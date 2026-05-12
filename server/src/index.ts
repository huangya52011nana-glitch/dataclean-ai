import 'dotenv/config';
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
