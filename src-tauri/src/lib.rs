use std::io::{Read, Write};
use std::net::{SocketAddr, TcpListener, TcpStream};
use std::path::{Path, PathBuf};
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use std::time::Duration;
use tauri::Manager;

#[derive(serde::Serialize)]
struct AppInfo {
  version: String,
  product_name: String,
  app_data_dir: String,
}

#[derive(Clone, serde::Serialize)]
struct BackendInfo {
  api_base: String,
  port: u16,
  running: bool,
  managed_by_tauri: bool,
}

struct BackendState {
  child: Mutex<Option<Child>>,
  info: Mutex<BackendInfo>,
}

#[tauri::command]
fn get_app_info(app: tauri::AppHandle) -> Result<AppInfo, String> {
  let app_data_dir = app.path().app_data_dir().map_err(|error| error.to_string())?;
  Ok(AppInfo {
    version: app.package_info().version.to_string(),
    product_name: app.package_info().name.to_string(),
    app_data_dir: app_data_dir.to_string_lossy().to_string(),
  })
}

#[tauri::command]
fn get_app_data_dir(app: tauri::AppHandle) -> Result<String, String> {
  Ok(app.path().app_data_dir().map_err(|error| error.to_string())?.to_string_lossy().to_string())
}

#[tauri::command]
fn get_default_model_paths() -> Vec<String> {
  let home = std::env::var("HOME").unwrap_or_default();
  vec![
    format!("{home}/.ollama/models"),
    format!("{home}/.cache/lm-studio/models"),
    format!("{home}/.lmstudio/models"),
  ]
}

#[tauri::command]
fn open_app_data_dir(app: tauri::AppHandle) -> Result<(), String> {
  let dir = app.path().app_data_dir().map_err(|error| error.to_string())?;
  open_path(dir)
}

#[tauri::command]
fn pick_directory() -> Option<String> {
  rfd::FileDialog::new().pick_folder().map(|path| path.to_string_lossy().to_string())
}

#[tauri::command]
fn pick_backup_file() -> Option<String> {
  rfd::FileDialog::new().add_filter("Via Prima backup", &["json"]).pick_file().map(|path| path.to_string_lossy().to_string())
}

#[tauri::command]
fn reveal_file(path: String) -> Result<(), String> {
  open_path(PathBuf::from(path))
}

#[tauri::command]
fn get_backend_info(app: tauri::AppHandle) -> Result<BackendInfo, String> {
  ensure_backend(&app)
}

#[tauri::command]
fn ensure_backend_running(app: tauri::AppHandle) -> Result<BackendInfo, String> {
  ensure_backend(&app)
}

fn open_path(path: PathBuf) -> Result<(), String> {
  #[cfg(target_os = "macos")]
  let mut command = Command::new("open");
  #[cfg(target_os = "windows")]
  let mut command = Command::new("explorer");
  #[cfg(target_os = "linux")]
  let mut command = Command::new("xdg-open");
  command.arg(path).spawn().map_err(|error| error.to_string())?;
  Ok(())
}

fn ensure_backend(app: &tauri::AppHandle) -> Result<BackendInfo, String> {
  if let Ok(api_base) = std::env::var("VIA_PRIMA_BACKEND_URL") {
    if let Some(port) = parse_port(&api_base) {
      return Ok(BackendInfo { api_base, port, running: is_backend_healthy(port), managed_by_tauri: false });
    }
  }

  let state = app.state::<BackendState>();
  let current = state.info.lock().map_err(|error| error.to_string())?.clone();
  if is_backend_healthy(current.port) {
    return Ok(BackendInfo { running: true, ..current });
  }

  let port = if tcp_port_is_available(current.port) { current.port } else { find_available_port()? };
  let api_base = format!("http://127.0.0.1:{port}");

  {
    let mut child_guard = state.child.lock().map_err(|error| error.to_string())?;
    let needs_child = child_guard.as_mut().map(|child| child.try_wait().ok().flatten().is_some()).unwrap_or(true);
    if needs_child {
      *child_guard = Some(spawn_backend(app, port)?);
    }
  }

  for _ in 0..50 {
    if is_backend_healthy(port) {
      let info = BackendInfo { api_base, port, running: true, managed_by_tauri: true };
      *state.info.lock().map_err(|error| error.to_string())? = info.clone();
      return Ok(info);
    }
    std::thread::sleep(Duration::from_millis(100));
  }

  Err("Backend sidecar did not become healthy in time.".to_string())
}

fn spawn_backend(app: &tauri::AppHandle, port: u16) -> Result<Child, String> {
  let resource_dir = app.path().resource_dir().ok();
  let current_dir = resource_dir.clone().unwrap_or_else(|| std::env::current_dir().unwrap_or_else(|_| PathBuf::from(".")));
  let script_path = std::env::var("VIA_PRIMA_BACKEND_ENTRY")
    .map(PathBuf::from)
    .unwrap_or_else(|_| resolve_backend_entry(&current_dir));
  let command_name = std::env::var("VIA_PRIMA_BACKEND_CMD").unwrap_or_else(|_| "node".to_string());
  let app_data_dir = app.path().app_data_dir().map_err(|error| error.to_string())?;

  Command::new(command_name)
    .arg(script_path)
    .current_dir(current_dir)
    .env("NODE_ENV", "production")
    .env("VIA_PRIMA_DESKTOP", "1")
    .env("VIA_PRIMA_APP_DATA_DIR", app_data_dir)
    .env("PORT", port.to_string())
    .stdin(Stdio::null())
    .stdout(Stdio::null())
    .stderr(Stdio::null())
    .spawn()
    .map_err(|error| format!("Backend sidecar could not be started: {error}"))
}

fn resolve_backend_entry(base_dir: &Path) -> PathBuf {
  let resource_entry = base_dir.join("dist").join("server").join("src").join("index.js");
  if resource_entry.exists() {
    return resource_entry;
  }
  PathBuf::from("dist/server/src/index.js")
}

fn is_backend_healthy(port: u16) -> bool {
  let address = SocketAddr::from(([127, 0, 0, 1], port));
  let Ok(mut stream) = TcpStream::connect_timeout(&address, Duration::from_millis(250)) else {
    return false;
  };
  let _ = stream.set_read_timeout(Some(Duration::from_millis(500)));
  let request = format!("GET /api/health HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\nConnection: close\r\n\r\n");
  if stream.write_all(request.as_bytes()).is_err() {
    return false;
  }
  let mut response = String::new();
  stream.read_to_string(&mut response).is_ok() && response.starts_with("HTTP/1.1 200") && response.contains("\"ok\":true")
}

fn tcp_port_is_available(port: u16) -> bool {
  TcpListener::bind(("127.0.0.1", port)).is_ok()
}

fn find_available_port() -> Result<u16, String> {
  TcpListener::bind(("127.0.0.1", 0))
    .and_then(|listener| listener.local_addr())
    .map(|address| address.port())
    .map_err(|error| error.to_string())
}

fn parse_port(api_base: &str) -> Option<u16> {
  let without_scheme = api_base.split("://").nth(1).unwrap_or(api_base);
  let host_port = without_scheme.split('/').next().unwrap_or(without_scheme);
  host_port.rsplit(':').next()?.parse().ok()
}

pub fn run() {
  let default_backend_info = BackendInfo {
    api_base: "http://127.0.0.1:3001".to_string(),
    port: 3001,
    running: false,
    managed_by_tauri: false,
  };
  tauri::Builder::default()
    .manage(BackendState { child: Mutex::new(None), info: Mutex::new(default_backend_info) })
    .setup(|app| {
      let handle = app.handle().clone();
      tauri::async_runtime::spawn_blocking(move || {
        let _ = ensure_backend(&handle);
      });
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![get_app_info, get_app_data_dir, get_default_model_paths, open_app_data_dir, pick_directory, pick_backup_file, reveal_file, get_backend_info, ensure_backend_running])
    .run(tauri::generate_context!())
    .expect("error while running Via Prima");
}
