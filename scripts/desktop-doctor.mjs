import { spawnSync } from "node:child_process";
import os from "node:os";

const checks = [
  { command: "node", args: ["--version"], label: "Node.js" },
  { command: "npm", args: ["--version"], label: "npm" },
  { command: "cargo", args: ["--version"], label: "Cargo" },
  { command: "rustc", args: ["--version"], label: "Rust compiler" },
];

let ok = true;

for (const check of checks) {
  const result = spawnSync(check.command, check.args, { encoding: "utf8", shell: process.platform === "win32" });
  if (result.status === 0) {
    console.log(`${check.label}: ${result.stdout.trim()}`);
    continue;
  }

  ok = false;
  console.error(`${check.label}: bulunamadi`);
}

if (!ok) {
  console.error("");
  if (process.platform === "win32") {
    console.error("Rust/Cargo yuklu degil. Tauri desktop build icin Rust toolchain gerekir.");
    console.error("Kurulum: https://rustup.rs adresindeki Windows kurulum adimlarini izleyin.");
    console.error("Kurulumdan sonra yeni bir terminal acip su komutlari kontrol edin:");
    console.error("cargo --version");
    console.error("rustc --version");
  } else {
    console.error("Rust/Cargo yuklu degil. Tauri desktop build icin Rust toolchain gerekir.");
    console.error("Kurulum:");
    console.error("curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh");
    console.error('source "$HOME/.cargo/env"');
    console.error("cargo --version");
  }
  process.exit(1);
}

console.log(`Desktop toolchain OK (${os.platform()} ${os.arch()})`);
