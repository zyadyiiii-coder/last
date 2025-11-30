import React, { useState, useEffect } from 'react';
import { Image, Link as LinkIcon, Plus, AlertCircle, ImageOff, ExternalLink } from 'lucide-react';

interface ImageUploaderProps {
  currentValue: string;
  onUpdate: (newValue: string) => void;
  onBatchUpdate?: (newValues: string[]) => void;
  allowMultiple?: boolean;
  label?: string;
  className?: string;
  compact?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  currentValue, 
  onUpdate, 
  onBatchUpdate,
  allowMultiple = false,
  label = "更改图片",
  className = "",
  compact = false
}) => {
  // Local state for the input to handle typing/pasting multiple links without immediate parent update in batch mode
  const [localValue, setLocalValue] = useState(currentValue);
  const [imageError, setImageError] = useState(false);

  // Sync local state with prop only in single mode or if significant change occurred
  useEffect(() => {
    if (!allowMultiple) {
      setLocalValue(currentValue);
      setImageError(false); // Reset error when prop changes
    }
  }, [currentValue, allowMultiple]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    setImageError(false);
    
    // Immediate update for single mode to maintain "live preview" feel
    if (!allowMultiple) {
      onUpdate(val);
    }
  };

  const handleBatchSubmit = () => {
    if (!localValue.trim()) return;
    
    // Split by comma, new lines, or spaces for batch input
    const urls = localValue.split(/[\n,\s]+/)
      .map(url => url.trim())
      .filter(url => url.length > 0);
      
    if (urls.length > 0) {
      if (onBatchUpdate) {
        onBatchUpdate(urls);
      } else {
        // Fallback for single update prop if batch not handled (though UI suggests batch)
        urls.forEach(url => onUpdate(url));
      }
      if (allowMultiple) {
          setLocalValue(''); // Clear input after submit only in batch mode
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBatchSubmit();
    }
  };

  return (
    <div className={`bg-white border border-gray-200 p-3 rounded shadow-sm ${className}`}>
      {label && <label className="block text-[10px] font-bold text-gray-500 mb-2 flex items-center uppercase tracking-wider justify-between">
        <span className="flex items-center"><Image className="w-3 h-3 mr-1"/> {label}</span>
      </label>}
      
      <div className={`flex ${compact ? 'flex-col gap-2' : 'flex-col gap-2'}`}>
        {/* URL Input */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <LinkIcon className="w-3 h-3 text-gray-400" />
          </div>
          <input 
            type="text" 
            value={localValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full text-[10px] pl-7 pr-8 p-2 border border-gray-200 rounded text-black bg-gray-50 focus:border-brand-gold outline-none transition-colors placeholder:text-gray-400"
            placeholder={allowMultiple ? "输入链接 (支持逗号/换行批量添加)..." : "输入七牛云图片链接..."}
          />
          
          {/* Confirm/Add Button */}
          {localValue.trim().length > 0 && allowMultiple && (
             <button 
               onClick={handleBatchSubmit}
               className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-brand-gold text-white rounded hover:bg-black transition-colors z-10"
               title="确认添加"
             >
               <Plus className="w-3 h-3" />
             </button>
          )}
        </div>

        {/* Live Preview for Single Image Mode */}
        {!allowMultiple && localValue && (
           <div className="relative w-full mt-1 border border-gray-100 bg-gray-50 rounded overflow-hidden flex items-center justify-center min-h-[60px]">
              {imageError ? (
                  <div className="p-2 flex flex-col gap-1 text-red-500 text-[10px] items-center text-center">
                      <div className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>图片加载失败</span>
                      </div>
                      <a href={localValue} target="_blank" rel="noreferrer" className="flex items-center gap-1 underline text-gray-400 hover:text-red-400 transition-colors">
                          <ExternalLink className="w-3 h-3"/> 新窗口尝试打开 (检查链接)
                      </a>
                  </div>
              ) : (
                  <div className="relative w-full h-24 bg-checkerboard">
                    <img 
                        src={localValue} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                        onError={() => setImageError(true)}
                    />
                    <div className="absolute bottom-0 right-0 bg-black/50 text-white text-[9px] px-1">预览</div>
                  </div>
              )}
           </div>
        )}
      </div>
      <p className="text-[9px] text-gray-400 mt-1 pl-1">
        *仅支持外部链接 (如七牛云) {allowMultiple && " | 支持批量粘贴"}
      </p>
    </div>
  );
};

export default ImageUploader;