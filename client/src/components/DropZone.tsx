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
