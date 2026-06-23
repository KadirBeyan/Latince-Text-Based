import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import type { EpubExtractionResult } from "./LexicalTypes";

type ZipEntry = { name: string; compression: number; compressedSize: number; uncompressedSize: number; localHeaderOffset: number };

const MAX_EPUB_BYTES = 80 * 1024 * 1024;
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const HTML_RE = /\.(xhtml|html|htm)$/iu;
const SKIP_RE = /(cover|copyright|toc|nav|title|dedication|acknowledg)/iu;

export async function extractEpubText(epubPath: string): Promise<EpubExtractionResult> {
  const warnings: string[] = [];
  const htmlFiles = extractHtmlFiles(epubPath, warnings);
  const files = htmlFiles
    .filter((file) => !SKIP_RE.test(file.path))
    .map((file) => {
      const lines = cleanLines(htmlToText(file.html).split(/\r?\n/u));
      return { path: file.path, lineCount: lines.length, lines };
    })
    .filter((file) => file.lineCount > 0);
  return { sourcePath: epubPath, files, allLines: files.flatMap((file) => file.lines), warnings };
}

export function extractHtmlFiles(epubPath: string, warnings: string[] = []): Array<{ path: string; html: string }> {
  const stat = fs.statSync(epubPath);
  if (stat.size > MAX_EPUB_BYTES) throw new Error(`EPUB is too large (${stat.size} bytes).`);
  const buffer = fs.readFileSync(epubPath);
  return readZipEntries(buffer, warnings)
    .filter((entry) => HTML_RE.test(entry.name))
    .map((entry) => {
      if (entry.name.includes("..") || path.isAbsolute(entry.name)) throw new Error(`Unsafe EPUB path: ${entry.name}`);
      const data = readZipEntry(buffer, entry);
      if (data.length > MAX_FILE_BYTES) {
        warnings.push(`Skipped large HTML file: ${entry.name}`);
        return null;
      }
      return { path: entry.name, html: data.toString("utf8") };
    })
    .filter((file): file is { path: string; html: string } => Boolean(file));
}

export function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/giu, " ")
    .replace(/<style[\s\S]*?<\/style>/giu, " ")
    .replace(/<\/(p|div|li|h[1-6]|tr|section)>/giu, "\n")
    .replace(/<br\s*\/?>/giu, "\n")
    .replace(/<[^>]+>/gu, " ")
    .replace(/&nbsp;/giu, " ")
    .replace(/&amp;/giu, "&")
    .replace(/&lt;/giu, "<")
    .replace(/&gt;/giu, ">")
    .replace(/&#39;/giu, "'")
    .replace(/&quot;/giu, "\"")
    .replace(/\u00a0/gu, " ");
}

export function cleanLines(lines: string[]): string[] {
  return lines.map((line) => line.replace(/\s+/gu, " ").trim()).filter((line) => line.length > 0);
}

function readZipEntries(buffer: Buffer, warnings: string[]): ZipEntry[] {
  const eocd = findEndOfCentralDirectory(buffer);
  if (eocd < 0) throw new Error("Invalid EPUB ZIP: central directory not found.");
  const count = buffer.readUInt16LE(eocd + 10);
  const centralOffset = buffer.readUInt32LE(eocd + 16);
  const entries: ZipEntry[] = [];
  let offset = centralOffset;
  for (let i = 0; i < count; i += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) break;
    const compression = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const uncompressedSize = buffer.readUInt32LE(offset + 24);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.subarray(offset + 46, offset + 46 + nameLength).toString("utf8");
    if (uncompressedSize > MAX_FILE_BYTES && HTML_RE.test(name)) warnings.push(`Large EPUB member detected: ${name}`);
    entries.push({ name, compression, compressedSize, uncompressedSize, localHeaderOffset });
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

function readZipEntry(buffer: Buffer, entry: ZipEntry): Buffer {
  const offset = entry.localHeaderOffset;
  if (buffer.readUInt32LE(offset) !== 0x04034b50) throw new Error(`Invalid local ZIP header: ${entry.name}`);
  const nameLength = buffer.readUInt16LE(offset + 26);
  const extraLength = buffer.readUInt16LE(offset + 28);
  const dataStart = offset + 30 + nameLength + extraLength;
  const compressed = buffer.subarray(dataStart, dataStart + entry.compressedSize);
  if (entry.compression === 0) return compressed;
  if (entry.compression === 8) return zlib.inflateRawSync(compressed);
  throw new Error(`Unsupported ZIP compression ${entry.compression} for ${entry.name}`);
}

function findEndOfCentralDirectory(buffer: Buffer): number {
  const min = Math.max(0, buffer.length - 0xffff - 22);
  for (let i = buffer.length - 22; i >= min; i -= 1) if (buffer.readUInt32LE(i) === 0x06054b50) return i;
  return -1;
}
