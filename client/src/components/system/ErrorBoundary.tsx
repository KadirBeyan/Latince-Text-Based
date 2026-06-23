import { Component, type ErrorInfo, type ReactNode } from "react";
import { reportClientError } from "../../api/systemApi";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State { return { error }; }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    void reportClientError({ message: error.message, stack: error.stack, componentStack: info.componentStack });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="crash-screen">
        <section className="panel-card crash-card">
          <p className="eyebrow">Casus improvisus</p>
          <h1>Via Prima toparlanıyor</h1>
          <p>Beklenmeyen bir arayüz hatası oldu. Kayıtların backend tarafında korunuyor.</p>
          <div className="settings-actions">
            <button type="button" onClick={() => window.location.reload()}>Yeniden yükle</button>
            <button type="button" onClick={() => { localStorage.setItem("via-prima-open-systema", "1"); window.location.reload(); }}>Son sağlam kaydı kontrol et</button>
            <button type="button" onClick={() => { localStorage.setItem("via-prima-open-systema", "1"); window.location.reload(); }}>Systema paneli</button>
          </div>
          {import.meta.env.DEV ? <pre>{this.state.error.stack}</pre> : null}
        </section>
      </main>
    );
  }
}
