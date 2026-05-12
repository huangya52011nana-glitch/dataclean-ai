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
