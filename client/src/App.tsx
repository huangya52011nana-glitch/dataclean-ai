import { useFileUpload } from './hooks/useFileUpload';
import DropZone from './components/DropZone';
import ProcessingBar from './components/ProcessingBar';
import DataTable from './components/DataTable';
import AIInsights from './components/AIInsights';
import ErrorMessage from './components/ErrorMessage';

export default function App() {
  const { status, result, error, progress, upload, reset } = useFileUpload();

  const isWorking = status === 'uploading' || status === 'processing';

  const handleDownload = () => {
    if (!result) return;
    window.open(result.downloadUrl, '_blank');
  };

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
            <AIInsights insights={result.insights} stats={result.stats} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <DataTable headers={result.headers} rows={result.rows} totalRows={result.totalRows} />
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                ⬇ 下载 Excel 结果
              </button>
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
