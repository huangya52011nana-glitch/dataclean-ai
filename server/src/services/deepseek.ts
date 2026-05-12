import OpenAI from 'openai';

const apiKey = process.env.DEEPSEEK_API_KEY;
if (!apiKey) {
  console.error('错误：未设置 DEEPSEEK_API_KEY 环境变量');
  console.error('请运行：export DEEPSEEK_API_KEY="sk-你的密钥"');
}

const client = new OpenAI({
  apiKey: apiKey || '',
  baseURL: 'https://api.deepseek.com/v1',
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

export interface ProcessingResult {
  headers: string[];
  rows: string[][];
  insights: string;
  stats: { rowCount: number; cleanedFields: number; anomalies: number };
}

function parseAIResponse(content: string): ProcessingResult {
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

// 清洗 Excel/CSV 数据（纯文本处理）
export async function cleanExcelData(rawText: string): Promise<ProcessingResult> {
  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
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
  const isPdf = mimeType === 'application/pdf';

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: isPdf ? '请提取这个PDF中的所有表格和文字数据，结构化后清洗。' : '请识别这张图片中的所有表格和文字数据，提取结构化数据并清洗。' },
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
        ],
      },
    ],
    temperature: 0.1,
  });

  const content = response.choices[0]?.message?.content || '';
  return parseAIResponse(content);
}
