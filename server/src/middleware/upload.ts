import multer from 'multer';
import path from 'path';
import { Request } from 'express';

const ALLOWED_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.ms-excel.sheet.macroEnabled.12',
  'text/csv',
  'text/comma-separated-values',
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/octet-stream', // 部分浏览器/工具可能用通用类型
];

const ALLOWED_EXTENSIONS = ['.xlsx', '.xls', '.xlsm', '.csv', '.pdf', '.png', '.jpg', '.jpeg', '.webp'];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  // 先按 MIME 类型检查，再按扩展名检查（兼容浏览器发送通用 MIME 的情况）
  if (ALLOWED_TYPES.includes(file.mimetype) || ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`不支持的文件类型（${file.mimetype}），仅支持 PDF、图片、Excel、CSV`));
  }
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });
