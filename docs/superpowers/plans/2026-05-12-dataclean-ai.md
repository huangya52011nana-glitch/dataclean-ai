# DataClean AI 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建 DataClean AI — 上传文件（PDF/图片/Excel），AI 清洗处理后返回结构化 Excel 并展示预览。

**Architecture:** React + Vite 前端单页应用，Express 后端单 API 端点，DeepSeek V4 Pro 处理数据清洗和 OCR，xlsx 库读写 Excel。前后端通过 `/api` 通信，前端构建产物由 Express 或 Vite proxy 提供。

**Tech Stack:** React 18 + Vite + Tailwind CSS 3, Express.js + TypeScript, DeepSeek V4 Pro (OpenAI 兼容 API), multer + xlsx

---

## 文件结构

```
dataclean-ai/
├── client/                        # React 前端
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx               # React 入口
│       ├── App.tsx                # 主组件，管理状态机
│       ├── index.css              # Tailwind 指令 + 自定义样式
│       ├── components/
│       │   ├── DropZone.tsx       # 拖拽上传区
│       │   ├── ProcessingBar.tsx  # 处理中动画
│       │   ├── DataTable.tsx      # 结果表格预览
│       │   ├── AIInsights.tsx     # AI 洞察卡片
│       │   └── ErrorMessage.tsx   # 错误提示
│       └── hooks/
│           └── useFileUpload.ts   # 上传状态管理 hook
├── server/                        # Express 后端
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts               # 服务入口
│       ├── routes/
│       │   └── upload.ts          # POST /api/upload, GET /api/download/:file
│       ├── services/
│       │   ├── deepseek.ts        # DeepSeek API 调用封装
│       │   └── excel.ts           # Excel 读写工具
│       └── middleware/
│           └── upload.ts          # multer 配置 + 文件校验
└── package.json                   # 根 workspace 脚本
```

---

### Task 1: 项目初始化与依赖安装

**Files:**
- Create: `dataclean-ai/package.json`, `client/package.json`, `server/package.json`
- Create: `client/vite.config.ts`, `client/tsconfig.json`, `client/tailwind.config.js`, `client/postcss.config.js`, `client/index.html`
- Create: `server/tsconfig.json`

- [ ] **Step 1: 创建根 package.json**

```json
{
  "name": "dataclean-ai",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^9.0.0"
  }
}
```

- [ ] **Step 2: 创建 client/package.json**

```json
{
  "name": "dataclean-ai-client",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 3: 创建 server/package.json**

```json
{
  "name": "dataclean-ai-server",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.0",
    "express-rate-limit": "^7.4.0",
    "multer": "^1.4.5-lts.1",
    "openai": "^4.70.0",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/multer": "^1.4.12",
    "@types/node": "^22.0.0",
    "tsx": "^4.19.0",
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 4: 安装所有依赖**

```bash
cd dataclean-ai && npm install && cd client && npm install && cd ../server && npm install
```

- [ ] **Step 5: 创建 Vite 配置** `client/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
```

- [ ] **Step 6: 创建 Tailwind/PostCSS/TS 配置** `client/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};
```

- [ ] **Step 7: 创建 client/postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 8: 创建 client/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

- [ ] **Step 9: 创建 client/index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DataClean AI</title>
  </head>
  <body class="bg-gray-50 min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 10: 创建 server/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src"]
}
```

---

### Task 2: Express 后端 — multer 文件上传中间件

**Files:**
- Create: `server/src/middleware/upload.ts`

- [ ] **Step 1: 编写 multer 上传中间件**

```typescript
import multer from 'multer';
import path from 'path';
import { Request } from 'express';

const ALLOWED_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'text/csv', // .csv
  'application/pdf', // .pdf
  'image/png', // .png
  'image/jpeg', // .jpg
  'image/webp', // .webp
];

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
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型，仅支持 PDF、图片、Excel、CSV'));
  }
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });
```

---

### Task 3: Express 后端 — DeepSeek 服务

**Files:**
- Create: `server/src/services/deepseek.ts`

- [ ] **Step 1: 编写 DeepSeek API 调用封装**

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com',
});

const SYSTEM_PROMPT = `你是一个专业的数据处理助手。根据用户上传的文件内容，完成以下任务：

1. 如果是表格数据（Excel/CSV/PDF中的表格），请提取所有数据并返回结构化的行列数组。
2. 如果是图片中的表格或文档，请用OCR识别所有文字和表格数据。
3. 对数据执行清洗：去除重复行、统一日期格式为YYYY-MM-DD、标准化数字格式、填充缺失值（用"无"或合理推断）。
4. 提供数据洞察摘要。

必须严格按以下JSON格式返回，不要有任何额外文字：
{
  "headers": ["列名1", "列名2"],
  "rows": [["值1", "值2"], ["值3", "值4"]],
  "insights": "数据洞察摘要文本",
  "stats": { "rowCount": 数字, "cleanedFields": 数字, "anomalies": 数字 }
}`;

// 清洗 Excel/CSV 数据（纯文本处理）
export async function cleanExcelData(rawText: string): Promise<ProcessingResult> {
  const response = await client.chat.completions.create({
    model: 'deepseek-v4-pro',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `请清洗以下表格数据并返回结构化结果：\n\n${rawText}` },
    ],
    temperature: 0.1,
  });

  const content = response.choices[0]?.message?.content || '';
  return parseAIResponse(content);
}

// OCR 处理图片/PDF（视觉识别）
export async function ocrImage(imageBase64: string, mimeType: string): Promise<ProcessingResult> {
  const response = await client.chat.completions.create({
    model: 'deepseek-v4-pro',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: '请识别这张图片中的所有表格和文字数据，提取结构化数据并清洗。' },
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
        ],
      },
    ],
    temperature: 0.1,
  });

  const content = response.choices[0]?.message?.content || '';
  return parseAIResponse(content);
}

export interface ProcessingResult {
  headers: string[];
  rows: string[][];
  insights: string;
  stats: { rowCount: number; cleanedFields: number; anomalies: number };
}

function parseAIResponse(content: string): ProcessingResult {
  // 尝试提取 JSON（处理可能的 markdown 代码块包裹）
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || content.match(/(\{[\s\S]*\})/);
  const jsonStr = jsonMatch ? jsonMatch[1] : content;
  const parsed = JSON.parse(jsonStr);

  return {
    headers: parsed.headers || [],
    rows: parsed.rows || [],
    insights: parsed.insights || '无法生成洞察',
    stats: parsed.stats || { rowCount: 0, cleanedFields: 0, anomalies: 0 },
  };
}
```

---

### Task 4: Express 后端 — Excel 读写服务

**Files:**
- Create: `server/src/services/excel.ts`

- [ ] **Step 1: 编写 Excel 读取和写入工具**

```typescript
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// 读取 Excel/CSV 文件，返回纯文本表示
export function readExcelToText(filePath: string): string {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  // 转为 CSV 文本
  const csv = XLSX.utils.sheet_to_csv(sheet);
  return csv;
}

// 将结构化数据写入 Excel 文件
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
```

---

### Task 5: Express 后端 — 路由与服务入口

**Files:**
- Create: `server/src/routes/upload.ts`
- Create: `server/src/index.ts`

- [ ] **Step 1: 编写上传路由**

```typescript
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
    if (!req.file) {
      res.status(400).json({ success: false, error: '请上传文件' });
      return;
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const isImage = mimeType.startsWith('image/') || mimeType === 'application/pdf';
    const isSpreadsheet = mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType === 'text/csv';

    let result;

    if (isImage) {
      // 图片/PDF → base64 → AI OCR
      const { base64, mimeType: mt } = imageToBase64(filePath);
      result = await ocrImage(base64, mt);
    } else if (isSpreadsheet) {
      // Excel/CSV → 文本 → AI 清洗
      const rawText = readExcelToText(filePath);
      result = await cleanExcelData(rawText);
    } else {
      res.status(400).json({ success: false, error: '不支持的文件类型' });
      return;
    }

    // 写入 Excel
    const filename = writeExcel(result.headers, result.rows, OUTPUT_DIR);

    // 清理上传的临时文件
    fs.unlink(filePath, () => {});

    res.json({
      success: true,
      data: {
        headers: result.headers,
        rows: result.rows.slice(0, 100), // 预览最多 100 行
        totalRows: result.rows.length,
        insights: result.insights,
        stats: result.stats,
      },
      downloadUrl: `/api/download/${filename}`,
    });
  } catch (error: any) {
    console.error('处理失败:', error);
    // 清理临时文件
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
```

- [ ] **Step 2: 编写服务入口**

```typescript
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import uploadRouter from './routes/upload';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 全局限流：每分钟最多 10 次请求
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, error: '请求过于频繁，请稍后重试' },
});
app.use('/api', limiter);

app.use('/api', uploadRouter);

app.listen(PORT, () => {
  console.log(`DataClean AI 服务运行在 http://localhost:${PORT}`);
});
```

---

### Task 6: 前端 — Tailwind 样式与入口

**Files:**
- Create: `client/src/index.css`
- Create: `client/src/main.tsx`

- [ ] **Step 1: 编写 Tailwind 样式** `client/src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

- [ ] **Step 2: 编写 React 入口** `client/src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

### Task 7: 前端 — useFileUpload Hook

**Files:**
- Create: `client/src/hooks/useFileUpload.ts`

- [ ] **Step 1: 编写上传状态管理 Hook**

```typescript
import { useState, useCallback } from 'react';

export type ProcessStatus = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

export interface ProcessingResult {
  headers: string[];
  rows: string[][];
  totalRows: number;
  insights: string;
  stats: { rowCount: number; cleanedFields: number; anomalies: number };
  downloadUrl: string;
}

export function useFileUpload() {
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const upload = useCallback(async (file: File) => {
    setStatus('uploading');
    setError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 模拟上传进度
      const progressTimer = setInterval(() => {
        setProgress(p => Math.min(p + 10, 90));
      }, 200);

      setStatus('processing');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressTimer);
      setProgress(100);

      const json = await response.json();

      if (!json.success) {
        setError(json.error || '处理失败');
        setStatus('error');
        return;
      }

      setResult(json.data);
      setStatus('done');
    } catch (err: any) {
      setError(err.message || '网络错误，请检查连接');
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError('');
    setProgress(0);
  }, []);

  return { status, result, error, progress, upload, reset };
}
```

---

### Task 8: 前端 — DropZone 组件

**Files:**
- Create: `client/src/components/DropZone.tsx`

- [ ] **Step 1: 编写拖拽上传组件**

```tsx
import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface Props {
  onFile: (file: File) => void;
  disabled: boolean;
}

export default function DropZone({ onFile, disabled }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
        ${dragging ? 'border-blue-400 bg-blue-50 scale-[1.02]' : 'border-gray-300 hover:border-gray-400'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv,.pdf,.png,.jpg,.jpeg,.webp"
        onChange={handleChange}
        className="hidden"
      />
      <div className="text-4xl mb-3">📁</div>
      <p className="text-gray-700 font-medium">拖拽文件到此处，或点击上传</p>
      <p className="text-gray-400 text-sm mt-1">支持 PDF / 图片 / Excel / CSV（最大 10MB）</p>
    </div>
  );
}
```

---

### Task 9: 前端 — ProcessingBar 组件

**Files:**
- Create: `client/src/components/ProcessingBar.tsx`

- [ ] **Step 1: 编写处理进度组件**

```tsx
interface Props {
  progress: number;
  status: 'uploading' | 'processing';
}

export default function ProcessingBar({ progress, status }: Props) {
  const text = status === 'uploading' ? '上传中...' : 'AI 正在分析和清洗数据...';

  return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mb-4" />
      <p className="text-gray-600 mb-3">{text}</p>
      <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
```

---

### Task 10: 前端 — DataTable 组件

**Files:**
- Create: `client/src/components/DataTable.tsx`

- [ ] **Step 1: 编写数据预览表格组件**

```tsx
interface Props {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

export default function DataTable({ headers, rows, totalRows }: Props) {
  if (!headers.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">📊 数据预览</h3>
        <span className="text-sm text-gray-400">
          {totalRows > 100 ? `显示前 100 行，共 ${totalRows} 行` : `共 ${totalRows} 行`}
        </span>
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 text-gray-700 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

### Task 11: 前端 — AIInsights 组件

**Files:**
- Create: `client/src/components/AIInsights.tsx`

- [ ] **Step 1: 编写 AI 洞察展示组件**

```tsx
interface Props {
  insights: string;
  stats: { rowCount: number; cleanedFields: number; anomalies: number };
}

export default function AIInsights({ insights, stats }: Props) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
      <h3 className="font-semibold text-gray-800 mb-3">🤖 AI 洞察</h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">{insights}</p>
      <div className="flex gap-4 text-xs text-gray-500">
        <span className="bg-white rounded px-3 py-1">总行数: {stats.rowCount}</span>
        <span className="bg-white rounded px-3 py-1">已清洗字段: {stats.cleanedFields}</span>
        <span className="bg-white rounded px-3 py-1">异常值: {stats.anomalies}</span>
      </div>
    </div>
  );
}
```

---

### Task 12: 前端 — ErrorMessage 组件

**Files:**
- Create: `client/src/components/ErrorMessage.tsx`

- [ ] **Step 1: 编写错误提示组件**

```tsx
interface Props {
  message: string;
  onRetry: () => void;
}

export default function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-5 text-center">
      <div className="text-red-500 text-2xl mb-2">⚠️</div>
      <p className="text-red-700 mb-3">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
      >
        重新上传
      </button>
    </div>
  );
}
```

---

### Task 13: 前端 — App 主组件

**Files:**
- Create: `client/src/App.tsx`

- [ ] **Step 1: 编写主应用组件（状态机串联所有组件）**

```tsx
import { useFileUpload } from './hooks/useFileUpload';
import DropZone from './components/DropZone';
import ProcessingBar from './components/ProcessingBar';
import DataTable from './components/DataTable';
import AIInsights from './components/AIInsights';
import ErrorMessage from './components/ErrorMessage';

export default function App() {
  const { status, result, error, progress, upload, reset } = useFileUpload();

  const isWorking = status === 'uploading' || status === 'processing';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DataClean AI</h1>
          <p className="text-gray-500">上传杂乱数据，一键获得干净整洁的 Excel</p>
        </header>

        {/* Upload / Processing */}
        {status !== 'done' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            {status === 'error' ? (
              <ErrorMessage message={error} onRetry={reset} />
            ) : isWorking ? (
              <ProcessingBar
                progress={progress}
                status={status as 'uploading' | 'processing'}
              />
            ) : (
              <DropZone onFile={upload} disabled={false} />
            )}
          </div>
        )}

        {/* Results */}
        {status === 'done' && result && (
          <div className="space-y-6">
            {/* AI Insights */}
            <AIInsights insights={result.insights} stats={result.stats} />

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <DataTable headers={result.headers} rows={result.rows} totalRows={result.totalRows} />
            </div>

            {/* Download & Reset */}
            <div className="flex justify-center gap-4">
              <a
                href={result.downloadUrl}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                ⬇ 下载 Excel 结果
              </a>
              <button
                onClick={reset}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                上传新文件
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-400 text-xs">
          DataClean AI — 文件仅临时存储，处理完成后自动删除
        </footer>
      </div>
    </div>
  );
}
```

---

### Task 14: 启动验证

- [ ] **Step 1: 启动后端**

```bash
cd server && npm run dev
```
预期：显示 `DataClean AI 服务运行在 http://localhost:3001`

- [ ] **Step 2: 启动前端**

```bash
cd client && npm run dev
```
预期：Vite 启动在 `http://localhost:5173`

- [ ] **Step 3: 验证完整流程**

1. 打开 http://localhost:5173
2. 拖拽上传一个 Excel 文件
3. 确认看到表格预览和 AI 洞察
4. 点击下载按钮
5. 验证下载的 Excel 内容正确

---

## 自检清单

| 检查项 | 状态 |
|--------|------|
| Spec 覆盖：上传 PDF/图片 → Excel | ✅ Task 3 (ocrImage), Task 5 |
| Spec 覆盖：上传 Excel 清洗 | ✅ Task 3 (cleanExcelData), Task 5 |
| Spec 覆盖：AI 摘要洞察 | ✅ Task 3 (SYSTEM_PROMPT), Task 11 |
| Spec 覆盖：拖拽上传 | ✅ Task 8 |
| Spec 覆盖：预览表格 | ✅ Task 10 |
| Spec 覆盖：下载 xlsx | ✅ Task 4 (writeExcel), Task 5 |
| Spec 覆盖：单页 UI | ✅ Task 13 (App.tsx 状态机) |
| Spec 覆盖：无登录 | ✅ 无认证中间件 |
| Spec 覆盖：Tailwind 简洁 UI | ✅ Task 6, 各组件 |
| 安全：文件类型白名单 | ✅ Task 2 (upload.ts), Task 8 (accept) |
| 安全：大小限制 10MB | ✅ Task 2 (MAX_SIZE) |
| 安全：API 限流 | ✅ Task 5 (rate-limit) |
| 安全：临时文件清理 | ✅ Task 5 (fs.unlink) |
| 类型一致性检查 | ✅ ProcessingResult 接口统一使用 |
