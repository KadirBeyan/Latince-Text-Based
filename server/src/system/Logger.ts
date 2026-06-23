import fs from "node:fs";
import path from "node:path";
import type { AppPaths } from "../config/AppPaths";

export class Logger {
  constructor(private readonly paths: AppPaths) {}

  info(message: string, meta?: unknown): void {
    this.write("info", message, meta);
  }

  error(message: string, meta?: unknown): void {
    this.write("error", message, meta);
  }

  private write(level: "info" | "error", message: string, meta?: unknown): void {
    const line = JSON.stringify({ level, message, meta, at: new Date().toISOString() });
    fs.mkdirSync(this.paths.logsDir, { recursive: true });
    fs.appendFileSync(path.join(this.paths.logsDir, "app.log"), `${line}\n`, "utf8");
  }
}
