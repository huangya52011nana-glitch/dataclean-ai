import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// 读取 Excel/CSV 文件，返回纯文本表示
export function readExcelToText(filePath: string): string {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const csv = XLSX.utils.sheet_to_csv(sheet);
  return csv;
}

// 将结构化数据写入 Excel 文件，返回文件名
export function writeExcel(headers: string[], rows: string[][], outputDir: string): string {
  const workbook = XLSX.utils.book_new();
  const data = [headers, ...rows];
  const sheet = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, sheet, '清洗结果');

  const filename = `cleaned-${Date.now()}.xlsx`;
  const filePath = path.join(outputDir, filename);
  XLSX.writeFile(workbook, filePath);
  return filename;
}

// 图片文件转 base64
export function imageToBase64(filePath: string): { base64: string; mimeType: string } {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeMap: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
  };
  return {
    base64: buffer.toString('base64'),
    mimeType: mimeMap[ext] || 'image/png',
  };
}
