import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, PortfolioItem } from '../types';
import { useContent } from '../context/ContentContext';
import { PlayCircle, Layers, Plus, Trash2, Edit3, ChevronLeft, ChevronRight, ArrowLeft, X } from 'lucide-react';
import ImageUploader from './ImageUploader';

const categories = [
  { label: '品牌设计', value: Category.BRAND },
  { label: '影视拍摄', value: Category.VIDEO },
  { label: '活动策划', value: Category.EVENT },
  { label: '音乐制作', value: Category.MUSIC },
  { label: '物料印刷', value: Category.PRINT },
];

const Portfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>(Category.BRAND);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  
  const { 
    portfolio, addPortfolioItem, removePortfolioItem, updatePortfolioItem, reorderPortfolioItem,
    addToGallery, removeFromGallery, 
    isEditing, sectionBackgrounds, updateSectionBackground, 
    textContent, updateTextContent 
  } = useContent();

  const filteredData = portfolio.filter(item => item.category === activeCategory);

  const handleItemClick = (item: PortfolioItem) => {
    if (isEditing) return;
    setSelectedItem(item);
    window.history.pushState({ modalOpen: true }, '', `#portfolio/${item.id}`);
  };

  const closeModal = () => {
    setSelectedItem(null);
    if (window.location.hash.includes('#portfolio/')) {
        window.history.replaceState(null, '', '#portfolio');
    }
  };

  // Helper to extract embed URL from various video platforms
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // Bilibili iframe/embed cleaning
    if (url.includes('bilibili')) {
       // Try to extract src from iframe tag if pasted as raw HTML
       const srcMatch = url.match(/src="([^"]+)"/);
       if (srcMatch) return srcMatch[1];

       // Handle raw bvid
       if (url.includes('BV')) {
         const bvid = url.match(/(BV\w+)/)?.[0];
         return `//player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=0`;
       }
       
       // Handle cleaned url
       return url;
    }

    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    // Youku/Vimeo/Other generic mp4
    return url;
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (selectedItem) {
        setSelectedItem(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedItem]);

  // Lock body scroll and prevent layout shift (Jump) when modal is open
  useEffect(() => {
    if (selectedItem) {
      // Calculate scrollbar width to prevent content jumping
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Also apply padding to the fixed navbar to prevent it from jumping
      const navbar = document.querySelector('nav');
      if (navbar) {
         navbar.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      const navbar = document.querySelector('nav');
      if (navbar) {
         navbar.style.paddingRight = '';
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      const navbar = document.querySelector('nav');
      if (navbar) {
         navbar.style.paddingRight = '';
      }
    };
  }, [selectedItem]);

  return (
    <section id="portfolio" className="py-24 bg-white relative">
      {/* Dynamic Background */}
      {sectionBackgrounds.portfolio && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none"
          style={{ backgroundImage: `url("${sectionBackgrounds.portfolio}")` }}
        ></div>
      )}
      
      {isEditing && (
        <div className="absolute top-4 right-4 z-30">
           <ImageUploader 
             currentValue={sectionBackgrounds.portfolio || ''}
             onUpdate={(val) => updateSectionBackground('portfolio', val)}
             label="更换案例背景"
             className="w-64"
           />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="w-full md:w-auto">
            {isEditing ? (
              <input 
                 className="block text-brand-gold font-medium tracking-[0.3em] uppercase text-xs mb-3 border border-gray-200 p-1"
                 value={textContent.portfolioTitleSmall}
                 onChange={(e) => updateTextContent('portfolioTitleSmall', e.target.value)}
              />
            ) : (
              <h3 className="text-brand-gold font-medium tracking-[0.3em] uppercase text-xs mb-3">{textContent.portfolioTitleSmall}</h3>
            )}
            
            {isEditing ? (
              <input 
                 className="block text-3xl md:text-5xl font-serif font-bold text-gray-900 border border-gray-200 p-1"
                 value={textContent.portfolioTitleLarge}
                 onChange={(e) => updateTextContent('portfolioTitleLarge', e.target.value)}
              />
            ) : (
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">{textContent.portfolioTitleLarge}</h2>
            )}
          </div>
          
          {/* Filters */}
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <div className="flex gap-2 min-w-max">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`text-xs md:text-sm px-5 py-2 md:py-3 border transition-all duration-300 ${
                    activeCategory === cat.value
                      ? 'bg-black border-black text-white font-bold'
                      : 'bg-transparent border-gray-200 text-gray-500 hover:border-black hover:text-black'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {/* Add Item Button */}
          {isEditing && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 border-2 border-dashed border-gray-200 hover:border-brand-gold cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[300px] group"
              onClick={() => addPortfolioItem(activeCategory)}
            >
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <Plus className="w-8 h-8 text-brand-gold" />
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-500">
                {textContent.portfolioButtonAdd || "添加新案例"}
              </h3>
            </motion.div>
          )}

          <AnimatePresence mode='popLayout'>
            {filteredData.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group relative cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                {/* Image Container - Using aspect-[4/3] for consistent grid layout */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 shadow-md group-hover:shadow-2xl transition-all duration-500">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700"
                  />
                  
                  {/* Indicators */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {item.gallery && item.gallery.length > 0 && !item.videoUrl && (
                      <div className="bg-black/60 backdrop-blur text-white p-1.5 rounded-full">
                        <Layers className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {item.videoUrl && !isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/90 shadow-lg flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-white transition-all duration-300">
                        <PlayCircle className="w-6 h-6 md:w-8 md:h-8 text-black group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-brand-gold text-[10px] font-bold uppercase tracking-wider">
                      {item.subBrand || categories.find(c => c.value === item.category)?.label}
                    </span>
                  </div>
                  <h4 className="text-gray-900 text-lg md:text-xl font-serif font-bold group-hover:text-brand-gold transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Edit Controls */}
                {isEditing && (
                  <div className="absolute inset-0 bg-white/95 z-20 p-4 overflow-y-auto border border-brand-gold custom-scrollbar shadow-xl" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2 bg-gray-50 -m-4 p-4 sticky top-0 z-10">
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-brand-gold" />
                        <span className="text-xs font-bold text-black">编辑模式</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); reorderPortfolioItem(item.id, 'prev', activeCategory); }}
                          className="bg-white border border-gray-200 p-2 rounded hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-colors text-gray-600 shadow-sm"
                          title="向前移动"
                        >
                           <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); reorderPortfolioItem(item.id, 'next', activeCategory); }}
                          className="bg-white border border-gray-200 p-2 rounded hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-colors text-gray-600 shadow-sm"
                          title="向后移动"
                        >
                           <ChevronRight className="w-4 h-4" />
                        </button>
                        <div className="w-[1px] h-8 bg-gray-200 mx-1"></div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removePortfolioItem(item.id); }}
                          className="bg-red-50 border border-red-200 p-2 rounded hover:bg-red-500 hover:text-white transition-colors text-red-500 shadow-sm"
                          title="删除案例"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4">
                      <input 
                         value={item.title} 
                         onChange={(e) => updatePortfolioItem(item.id, 'title', e.target.value)}
                         className="w-full text-sm bg-gray-50 border border-gray-200 p-2 rounded text-black"
                         placeholder="案例标题"
                      />
                      <textarea
                         value={item.description} 
                         onChange={(e) => updatePortfolioItem(item.id, 'description', e.target.value)}
                         className="w-full text-xs bg-gray-50 border border-gray-200 p-2 rounded text-black h-20"
                         placeholder="案例描述"
                      />
                      <input 
                         value={item.subBrand || ''} 
                         onChange={(e) => updatePortfolioItem(item.id, 'subBrand', e.target.value)}
                         className="w-full text-xs bg-gray-50 border border-gray-200 p-2 rounded text-black"
                         placeholder="副标题/标签"
                      />
                      
                      <div className="border-t border-gray-100 pt-2">
                        <ImageUploader 
                          currentValue={item.imageUrl}
                          onUpdate={(val) => updatePortfolioItem(item.id, 'imageUrl', val)}
                          label="封面图"
                          compact
                          className="!text-xs"
                        />
                      </div>
                      
                      <div>
                        <ImageUploader 
                          currentValue={item.videoUrl || ''}
                          onUpdate={(val) => updatePortfolioItem(item.id, 'videoUrl', val)}
                          label="视频链接 (B站/MP4)"
                          compact
                          className="!text-xs"
                        />
                      </div>

                      <div className="border-t border-gray-100 pt-2">
                        <label className="text-[10px] font-bold text-gray-400 mb-2 block uppercase">详情图册</label>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          {item.gallery?.map((img, idx) => (
                            <div key={idx} className="relative aspect-square group/img">
                              <img src={img} className="w-full h-full object-cover rounded" alt="" referrerPolicy="no-referrer" />
                              <button 
                                onClick={(e) => { e.stopPropagation(); removeFromGallery(item.id, idx); }}
                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl opacity-0 group-hover/img:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <ImageUploader 
                          currentValue=""
                          onUpdate={(val) => addToGallery(item.id, val)}
                          onBatchUpdate={(vals) => vals.forEach(val => addToGallery(item.id, val))}
                          allowMultiple={true}
                          label="添加详情图 (支持多选)"
                          compact
                          className="!text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* --- DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[200] bg-white flex flex-col"
          >
            {/* Sticky Navigation Header */}
            <div className="flex-shrink-0 h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-6 z-20 sticky top-0 shadow-sm">
                <button 
                    onClick={closeModal}
                    className="flex items-center gap-2 text-gray-800 hover:text-brand-gold transition-colors group px-2 py-1 rounded-lg hover:bg-gray-50"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-white transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold tracking-wider">返回列表</span>
                </button>

                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden md:block border px-2 py-1 rounded">
                    {categories.find(c => c.value === selectedItem.category)?.label}
                </div>

                <button 
                    onClick={closeModal}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto bg-white p-0 scroll-smooth">
                <div className="w-full min-h-full flex flex-col pb-24">
                    
                    {/* Hero Media (Video or Image) */}
                    <div className="w-full bg-black relative">
                        {selectedItem.videoUrl ? (
                           <div className="w-full aspect-video">
                              <iframe 
                                src={getEmbedUrl(selectedItem.videoUrl) || ''}
                                title={selectedItem.title}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                           </div>
                        ) : (
                           <div className="w-full h-[40vh] md:h-[60vh] relative">
                               <img 
                                  src={selectedItem.imageUrl} 
                                  alt={selectedItem.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover opacity-90"
                               />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                           </div>
                        )}
                        
                        {!selectedItem.videoUrl && (
                          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white z-10">
                              <div className="max-w-7xl mx-auto">
                                <span className="inline-block px-3 py-1 bg-brand-gold text-black text-[10px] font-bold tracking-widest uppercase mb-4">
                                    {selectedItem.subBrand || selectedItem.category}
                                </span>
                                <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2 shadow-black drop-shadow-lg">{selectedItem.title}</h1>
                              </div>
                          </div>
                        )}
                    </div>

                    {/* Content Body */}
                    <div className="px-4 py-12 md:px-8 md:py-16 max-w-5xl mx-auto w-full">
                         
                         {selectedItem.videoUrl && (
                             <div className="mb-12 border-b border-gray-100 pb-8">
                                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">{selectedItem.title}</h1>
                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold tracking-widest uppercase">
                                    {selectedItem.subBrand || selectedItem.category}
                                </span>
                             </div>
                         )}

                         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Left: Description */}
                            <div className="lg:col-span-4">
                               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                  <span className="w-8 h-[1px] bg-brand-gold"></span>
                                  项目简介
                               </h3>
                               <p className="text-gray-600 leading-loose text-sm md:text-base whitespace-pre-line">
                                  {selectedItem.description}
                               </p>
                            </div>

                            {/* Right: Gallery */}
                            <div className="lg:col-span-8">
                               {selectedItem.gallery && selectedItem.gallery.length > 0 ? (
                                  <div className="space-y-8">
                                     {selectedItem.gallery.map((img, idx) => (
                                        <div key={idx} className="w-full bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                           <img 
                                              src={img} 
                                              alt={`Gallery ${idx}`}
                                              referrerPolicy="no-referrer"
                                              className="w-full h-auto"
                                              loading="lazy"
                                           />
                                        </div>
                                     ))}
                                  </div>
                               ) : (
                                  !selectedItem.videoUrl && (
                                    <div className="h-64 flex items-center justify-center bg-gray-50 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">
                                       暂无更多图片展示
                                    </div>
                                  )
                               )}
                            </div>
                         </div>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;