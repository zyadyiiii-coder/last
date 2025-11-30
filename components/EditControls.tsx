import React, { useState } from 'react';
import { PenTool, Eye, FileJson, Check, Copy, RotateCcw, Save, Upload, X } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';

const EditControls: React.FC = () => {
  const { isEditing, toggleEditing, exportConfig, importConfig, resetData, hasLocalChanges } = useContent();
  const [copied, setCopied] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState('');

  const handleCopyConfig = () => {
    const jsonString = exportConfig();
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy", err);
      alert("复制失败，请手动检查控制台输出");
    });
  };

  const handleImportSubmit = () => {
    if (!importJson.trim()) {
      setImportError("请输入 JSON 内容");
      return;
    }
    
    // Attempt import and handle result without throwing exceptions
    const result = importConfig(importJson);
    if (result.success) {
      setShowImportModal(false);
      setImportJson('');
      setImportError('');
      alert("导入成功！页面已更新。");
    } else {
      // Don't log "Import failed" to console, just show user friendly error
      let safeErrorMessage = "JSON 格式无效";
      if (result.error && typeof result.error === 'string') {
          // If the error message is very long (e.g. from a paste dump), truncate it
          safeErrorMessage = result.error.length > 50 ? result.error.substring(0, 50) + "..." : result.error;
      }
      setImportError(safeErrorMessage);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4 items-end">
        {isEditing && (
          <div className="flex flex-col gap-4 items-end">
             
             {/* Reset / Clear Cache Button */}
             {hasLocalChanges && (
                <div className="flex items-center gap-3">
                   <span className="bg-black/80 text-white text-[10px] px-3 py-1 rounded backdrop-blur border border-white/20 shadow-xl pointer-events-none">
                     还原/重置
                   </span>
                   <button
                     onClick={resetData}
                     className="bg-red-600/90 border border-red-400 text-white w-12 h-12 rounded-full shadow-lg hover:bg-red-700 transition-all flex items-center justify-center"
                     title="清除本地缓存并还原到初始配置"
                   >
                     <RotateCcw className="w-5 h-5" />
                   </button>
                </div>
             )}
            
             {/* Import Config Button */}
             <div className="flex items-center gap-3">
                <span className="bg-black/80 text-white text-[10px] px-3 py-1 rounded backdrop-blur border border-white/20 shadow-xl pointer-events-none">
                  导入配置
                </span>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="bg-blue-600/90 border border-blue-400 text-white w-12 h-12 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center"
                  title="粘贴 JSON 代码以更新网站"
                >
                  <Upload className="w-5 h-5" />
                </button>
             </div>

             {/* Export Config Button */}
             <div className="flex items-center gap-3">
                <span className="bg-black/80 text-white text-[10px] px-3 py-1 rounded backdrop-blur border border-white/20 shadow-xl pointer-events-none">
                  {copied ? "已复制到剪贴板！" : "导出配置代码"}
                </span>
                <button
                  onClick={handleCopyConfig}
                  className={`${
                    copied ? 'bg-green-600 border-green-400' : 'bg-gray-800 border-gray-600'
                  } text-white w-12 h-12 rounded-full shadow-lg hover:bg-gray-700 transition-all flex items-center justify-center border`}
                  title="导出 config.json 代码"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
             </div>
          </div>
        )}
        
        {/* Auto-save indicator */}
        {hasLocalChanges && !isEditing && (
            <div className="bg-black/50 backdrop-blur px-2 py-1 rounded text-[9px] text-gray-300 flex items-center gap-1 border border-white/10 mb-[-10px]">
               <Save className="w-3 h-3" /> 本地修改已生效
            </div>
        )}
        
        {/* Main Toggle Button */}
        <div className="flex items-center gap-3">
          {isEditing && (
            <span className="bg-black/80 text-brand-gold text-[10px] px-3 py-1 rounded backdrop-blur border border-brand-gold/30 shadow-xl pointer-events-none flex items-center gap-2">
              编辑模式开启
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="自动保存中"></span>
            </span>
          )}
          <button
            onClick={toggleEditing}
            className={`${
              isEditing ? 'bg-brand-gold text-brand-dark' : 'bg-brand-card/80 border border-white/10 text-black'
            } w-14 h-14 rounded-full shadow-2xl hover:scale-105 transition-all transform flex items-center justify-center backdrop-blur-md`}
            title={isEditing ? "退出编辑 (预览)" : "开启编辑模式"}
          >
            {isEditing ? <Eye className="w-6 h-6" /> : <PenTool className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
             >
                <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b border-gray-200">
                   <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                     <FileJson className="w-5 h-5 text-brand-gold" />
                     导入配置代码 (JSON)
                   </h3>
                   <button 
                     onClick={() => setShowImportModal(false)}
                     className="text-gray-400 hover:text-black transition-colors"
                   >
                     <X className="w-6 h-6" />
                   </button>
                </div>
                
                <div className="p-6 flex-1 flex flex-col overflow-hidden">
                   <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700 flex items-start gap-2">
                      <div className="mt-0.5"><Check className="w-3 h-3" /></div>
                      <div>
                        <strong>操作提示：</strong> 请只粘贴 JSON 格式的代码（例如 &#123; "heroImage": "..." &#125;）。<br/>
                        不要粘贴自然语言指令（例如 "帮我添加一张图..."），这会导致错误。
                      </div>
                   </div>
                   <textarea
                     className={`w-full flex-1 p-4 font-mono text-xs bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                        importError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-brand-gold/30'
                     }`}
                     placeholder='{ "heroImage": "https://..." }'
                     value={importJson}
                     onChange={(e) => {
                        setImportJson(e.target.value);
                        setImportError('');
                     }}
                   />
                   {importError && (
                     <div className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1">
                        <X className="w-3 h-3" />
                        导入失败: {importError}
                     </div>
                   )}
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                   <button 
                     onClick={() => setShowImportModal(false)}
                     className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded transition-colors text-sm font-medium"
                   >
                     取消
                   </button>
                   <button 
                     onClick={handleImportSubmit}
                     className="px-6 py-2 bg-brand-gold text-white rounded shadow-lg hover:bg-black transition-colors text-sm font-bold flex items-center gap-2"
                   >
                     <Check className="w-4 h-4" /> 确认导入
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EditControls;