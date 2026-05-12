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
