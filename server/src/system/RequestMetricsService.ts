import type { NextFunction, Request, Response } from "express";

export type RequestMetric = {
  route: string;
  count: number;
  errors: number;
  averageMs: number;
  maxMs: number;
  lastStatus: number;
  lastDurationMs: number;
};

type MutableMetric = RequestMetric & { totalMs: number };

export class RequestMetricsService {
  private readonly startedAt = Date.now();
  private readonly metrics = new Map<string, MutableMetric>();

  middleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const started = performance.now();
      res.on("finish", () => this.record(req.path, res.statusCode, performance.now() - started));
      next();
    };
  }

  snapshot(limit = 30): RequestMetric[] {
    return [...this.metrics.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(({ totalMs: _totalMs, ...metric }) => metric);
  }

  uptimeSeconds(): number {
    return Math.floor((Date.now() - this.startedAt) / 1_000);
  }

  private record(route: string, status: number, durationMs: number): void {
    const normalizedRoute = normalizeRoute(route);
    const current = this.metrics.get(normalizedRoute) ?? {
      route: normalizedRoute, count: 0, errors: 0, averageMs: 0, maxMs: 0,
      lastStatus: status, lastDurationMs: 0, totalMs: 0,
    };
    current.count += 1;
    current.errors += status >= 400 ? 1 : 0;
    current.totalMs += durationMs;
    current.averageMs = round(current.totalMs / current.count);
    current.maxMs = round(Math.max(current.maxMs, durationMs));
    current.lastStatus = status;
    current.lastDurationMs = round(durationMs);
    this.metrics.set(normalizedRoute, current);
  }
}

function normalizeRoute(route: string): string {
  return route
    .replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/gi, ":id")
    .replace(/\/via-prima-backup-[^/]+\.json$/i, "/:backup")
    .replace(/\/[^/]+(?=\/repair$)/, "/:id");
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
