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
