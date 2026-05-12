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
