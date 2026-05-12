import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { upload } from '../middleware/upload';
import { cleanExcelData, ocrImage } from '../services/deepseek';
import { readExcelToText, writeExcel, imageToBase64 } from '../services/excel';

const router = Router();
const OUTPUT_DIR = path.join(__dirname, '../../outputs');
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// 确保目录存在
[OUTPUT_DIR, UPLOADS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      res.status(500).json({ success: false, error: '服务未配置 AI API Key，请设置 DEEPSEEK_API_KEY 环境变量' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, error: '请上传文件' });
      return;
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const ext = path.extname(req.file.originalname).toLowerCase();

    // 优先按 MIME 类型判断，再按扩展名兜底
    const isImage = mimeType.startsWith('image/') || mimeType === 'application/pdf' || ['.png', '.jpg', '.jpeg', '.webp', '.pdf'].includes(ext);
    const isSpreadsheet = mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType === 'text/csv' || ['.xlsx', '.xls', '.xlsm', '.csv'].includes(ext);

    let result;

    if (isImage) {
      const { base64, mimeType: mt } = imageToBase64(filePath);
      result = await ocrImage(base64, mt);
    } else if (isSpreadsheet) {
      const rawText = readExcelToText(filePath);
      result = await cleanExcelData(rawText);
    } else {
      res.status(400).json({ success: false, error: '不支持的文件类型' });
      return;
    }

    const filename = writeExcel(result.headers, result.rows, OUTPUT_DIR);

    // 清理上传的临时文件
    fs.unlink(filePath, () => {});

    res.json({
      success: true,
      data: {
        headers: result.headers,
        rows: result.rows.slice(0, 100),
        totalRows: result.rows.length,
        insights: result.insights,
        stats: result.stats,
      },
      downloadUrl: `/api/download/${filename}`,
    });
  } catch (error: any) {
    console.error('处理失败:', error);
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(500).json({
      success: false,
      error: error.message || 'AI 处理失败，请重试',
    });
  }
});

router.get('/download/:filename', (req: Request, res: Response) => {
  const filePath = path.join(OUTPUT_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ success: false, error: '文件不存在或已过期' });
    return;
  }
  res.download(filePath, 'cleaned-data.xlsx');
});

export default router;
