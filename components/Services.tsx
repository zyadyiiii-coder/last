
import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { Palette, Clapperboard, Music, Tent, Printer, Star, Trash2, Plus, Edit3, Play, Layers, ChevronLeft, ChevronRight, ArrowLeft, X, Image as ImageIcon, ChevronDown, Grip } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { Category, PortfolioItem } from '../types';

const ICON_MAP: Record<string, React.ElementType> = {
  Palette, Clapperboard, Music, Tent, Printer, Star
};

// --- Sub-components for Sortable Items to use useDragControls ---

interface SortablePortfolioItemProps {
  item: PortfolioItem;
  isEditing: boolean;
  updatePortfolioItem: (id: number, field: keyof PortfolioItem, value: any) => void;
  removePortfolioItem: (id: number) => void;
  handleItemClick: (id: number) => void;
  serviceCategory: Category;
}

const SortablePortfolioItem: React.FC<SortablePortfolioItemProps> = ({ item, isEditing, updatePortfolioItem, removePortfolioItem, handleItemClick, serviceCategory }) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      id={String(item.id)}
      dragListener={!isEditing} // If editing, use handle; if not editing, whole card might not need dragging, but let's disable whole-card drag in edit mode to allow text selection
      dragControls={dragControls}
      className="group relative cursor-pointer h-full flex flex-col"
      onClick={() => handleItemClick(item.id)}
    >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-white shadow-sm group-hover:shadow-lg transition-all duration-500 rounded-lg border border-gray-100 mb-4">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors"></div>
            
            {/* Indicators */}
            <div className="absolute top-2 right-2 flex gap-1 z-10">
              {item.gallery && item.gallery.length > 0 && !item.videoUrl && (
                <div className="bg-black/60 backdrop-blur text-white p-1 rounded-full">
                  <Layers className="w-3 h-3" />
                </div>
              )}
            </div>

            {item.videoUrl && !isEditing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Modern Play Icon - Glassmorphism Black */}
                <div className="w-12 h-12 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-gold group-hover:border-brand-gold transition-all duration-300">
                  <Play className="w-5 h-5 text-white fill-current ml-1" />
                </div>
              </div>
            )}

            {/* Edit Overlay for Image Actions */}
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 rounded-lg">
                  <div className="flex justify-between w-full">
                    {/* Drag Handle */}
                    <div 
                      className="bg-white/90 p-1.5 rounded shadow-md cursor-grab active:cursor-grabbing hover:text-brand-gold"
                      onPointerDown={(e) => dragControls.start(e)}
                    >
                      <Grip className="w-4 h-4 text-gray-600" />
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); removePortfolioItem(item.id); }} 
                      className="bg-red-500 text-white p-1.5 rounded shadow-md hover:bg-red-600 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center">
                    <span className="bg-brand-gold/90 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1 transform hover:scale-105 transition-transform">
                        <Edit3 className="w-3 h-3"/> 点击编辑详情
                    </span>
                  </div>
              </div>
            )}
        </div>

        {/* Text Content Below Image - Visible & Editable */}
        <div className="px-1 flex-1">
            {isEditing ? (
                <div className="space-y-2 cursor-default" onClick={e => e.stopPropagation()}>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">案例标题</label>
                      <input 
                          value={item.title}
                          onChange={(e) => updatePortfolioItem(item.id, 'title', e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded p-2 text-sm font-bold font-serif text-gray-900 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none shadow-sm"
                          placeholder="输入标题"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">副标题</label>
                      <input 
                          value={item.subBrand || ''}
                          onChange={(e) => updatePortfolioItem(item.id, 'subBrand', e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded p-2 text-xs text-gray-600 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none shadow-sm"
                          placeholder="输入副标题 (可选)"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">简介</label>
                      <textarea 
                          value={item.description}
                          onChange={(e) => updatePortfolioItem(item.id, 'description', e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded p-2 text-xs text-gray-600 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none shadow-sm h-16 resize-none"
                          placeholder="输入简介"
                      />
                    </div>
                </div>
            ) : (
                <div className="group-hover:translate-x-1 transition-transform duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded">
                            {item.subBrand || item.category}
                        </span>
                    </div>
                    <h4 className="text-gray-900 font-bold font-serif text-lg leading-tight mb-2 group-hover:text-brand-gold transition-colors">
                        {item.title}
                    </h4>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                        {item.description}
                    </p>
                </div>
            )}
        </div>
    </Reorder.Item>
  );
};

interface SortableGalleryItemProps {
  img: string;
  idx: number;
  isEditing: boolean;
  removeFromGallery: () => void;
}

const SortableGalleryItem: React.FC<SortableGalleryItemProps> = ({ img, idx, isEditing, removeFromGallery }) => {
  const dragControls = useDragControls();
  
  return (
    <Reorder.Item
      value={img}
      id={img}
      dragListener={false}
      dragControls={dragControls}
      className="w-full bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group"
    >
       <img 
          src={img} 
          alt={`Gallery ${idx}`}
          referrerPolicy="no-referrer"
          className="w-full h-auto"
          loading="lazy"
          draggable={false}
       />
       {isEditing && (
          <>
              <button 
                onClick={removeFromGallery}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-20"
                title="删除图片"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              {/* Drag Handle */}
              <div 
                className="absolute bottom-2 right-2 bg-black/60 rounded p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-grab active:cursor-grabbing hover:bg-brand-gold/80 text-white"
                onPointerDown={(e) => dragControls.start(e)}
              >
                  <Grip className="w-4 h-4" />
              </div>
          </>
       )}
    </Reorder.Item>
  );
}


// --- Main Component ---

const Services: React.FC = () => {
  const { 
    services, updateService, addService, removeService, 
    portfolio, addPortfolioItem, removePortfolioItem, updatePortfolioItem, updatePortfolioCategoryOrder, 
    addToGallery, removeFromGallery, updateGalleryOrder,
    isEditing, sectionBackgrounds, updateSectionBackground, textContent, updateTextContent 
  } = useContent();

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  
  // State to track expanded service sections. Default to empty (Collapsed).
  const [expandedServiceIds, setExpandedServiceIds] = useState<number[]>([]);

  const toggleServiceExpand = (id: number) => {
    setExpandedServiceIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };
  
  // Derive selectedItem from state using selectedItemId so it updates in real-time when edited
  const selectedItem = portfolio.find(p => p.id === selectedItemId) || null;

  // Modal logic
  const handleItemClick = (id: number) => {
    setSelectedItemId(id);
    window.history.pushState({ modalOpen: true }, '', `#portfolio/${id}`);
  };

  const handleAddItem = (category: Category) => {
    const newItem = addPortfolioItem(category);
    // Automatically open the new item for editing
    if (newItem) {
        // We need to ensure the service section is expanded first
        const service = services.find(s => s.category === category);
        if (service && !expandedServiceIds.includes(service.id)) {
            setExpandedServiceIds(prev => [...prev, service.id]);
        }
        
        // Small timeout to allow state update to propagate
        setTimeout(() => {
            handleItemClick(newItem.id);
        }, 100);
    }
  };

  const closeModal = () => {
    setSelectedItemId(null);
    if (window.location.hash.includes('#portfolio/')) {
        window.history.replaceState(null, '', '#services');
    }
  };

  // Helper to detect direct video files
  // UPDATED: Default to TRUE for unknown links (like Qiniu without extension), only return false for known embeds
  const isDirectVideo = (url: string) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    // If it's a known embed platform, it's NOT a direct video
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || lowerUrl.includes('bilibili')) {
      return false;
    }
    // Otherwise, assume it's a direct file (mp4, mov, or cloud storage link)
    return true;
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('bilibili')) {
       const srcMatch = url.match(/src="([^"]+)"/);
       if (srcMatch) return srcMatch[1];
       if (url.includes('BV')) {
         const bvid = url.match(/(BV\w+)/)?.[0];
         return `//player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=0`;
       }
       return url;
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  useEffect(() => {
    const handlePopState = () => {
      if (selectedItemId) {
        setSelectedItemId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedItemId]);

  useEffect(() => {
    if (selectedItemId) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      const navbar = document.querySelector('nav');
      if (navbar) navbar.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      const navbar = document.querySelector('nav');
      if (navbar) navbar.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      const navbar = document.querySelector('nav');
      if (navbar) navbar.style.paddingRight = '';
    };
  }, [selectedItemId]);

  return (
    <section id="services" className="py-24 bg-brand-light relative">
      {/* Dynamic Background */}
      {sectionBackgrounds.services && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none"
          style={{ backgroundImage: `url("${sectionBackgrounds.services}")` }}
        ></div>
      )}
      
      {isEditing && (
        <div className="absolute top-4 right-4 z-30">
           <ImageUploader 
             currentValue={sectionBackgrounds.services || ''}
             onUpdate={(val) => updateSectionBackground('services', val)}
             label="更换业务背景"
             className="w-64"
           />
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
           {isEditing ? (
             <input 
                className="block mx-auto text-brand-gold font-medium tracking-[0.3em] uppercase text-xs mb-4 text-center border border-gray-200 p-1"
                value={textContent.servicesTitleSmall}
                onChange={(e) => updateTextContent('servicesTitleSmall', e.target.value)}
             />
           ) : (
             <h3 className="text-brand-gold font-medium tracking-[0.3em] uppercase text-xs mb-4">{textContent.servicesTitleSmall}</h3>
           )}

           {isEditing ? (
              <input 
                 className="block mx-auto text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6 text-center border border-gray-200 p-1 w-full max-w-lg"
                 value={textContent.servicesTitleLarge}
                 onChange={(e) => updateTextContent('servicesTitleLarge', e.target.value)}
              />
           ) : (
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6">{textContent.servicesTitleLarge}</h2>
           )}
           
           {isEditing ? (
              <textarea 
                 className="block mx-auto max-w-xl text-gray-500 text-sm leading-relaxed border border-gray-200 p-2 w-full h-24"
                 value={textContent.servicesDesc}
                 onChange={(e) => updateTextContent('servicesDesc', e.target.value)}
              />
           ) : (
              <p className="max-w-xl mx-auto text-gray-500 text-sm leading-relaxed">
                {textContent.servicesDesc}
              </p>
           )}
        </div>

        {/* Services List with Integrated Portfolio */}
        <div className="flex flex-col gap-12">
          {services.map((service, index) => {
            const IconComponent = ICON_MAP[service.iconName] || Star;
            // Filter portfolio items that match this service's category
            const servicePortfolio = portfolio.filter(item => item.category === service.category);
            const isExpanded = expandedServiceIds.includes(service.id);
            
            return (
              <div key={service.id} className="w-full bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                 {/* Service Header Block - Clickable for Accordion */}
                 <div 
                   onClick={() => !isEditing && toggleServiceExpand(service.id)}
                   className={`flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 cursor-pointer group ${isExpanded ? 'bg-gray-50/50' : 'bg-white'}`}
                   title={isExpanded ? "点击折叠" : "点击展开"}
                 >
                    <div className="flex items-start gap-5 w-full">
                        <div className={`p-4 rounded-xl shadow-sm transition-colors duration-300 flex-shrink-0 ${isExpanded ? 'bg-brand-gold text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-brand-gold/80 group-hover:text-white'}`}>
                           <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="space-y-2 mb-2" onClick={(e) => e.stopPropagation()}>
                                  <input 
                                    value={service.title} 
                                    onChange={(e) => updateService(service.id, 'title', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded p-1 text-black font-serif font-bold text-2xl"
                                  />
                                  <textarea 
                                    value={service.description}
                                    onChange={(e) => updateService(service.id, 'description', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded p-1 text-gray-600 text-sm h-16"
                                  />
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-3">
                                    <h3 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-brand-gold transition-colors">
                                      {service.title}
                                    </h3>
                                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500 uppercase">
                                       {servicePortfolio.length} 案例
                                    </span>
                                  </div>
                                  <p className="text-gray-500 text-sm mt-2 max-w-2xl">
                                    {service.description}
                                  </p>
                                </>
                              )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0 self-end md:self-center">
                        {isEditing && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); removeService(service.id); }}
                              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                              title="删除服务板块"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                        {/* Accordion Chevron */}
                        <div className={`p-2 rounded-full transition-all duration-300 ${isExpanded ? 'rotate-180 bg-gray-200' : 'rotate-0 bg-transparent group-hover:bg-gray-100'}`}>
                           <ChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                 </div>

                 {/* Portfolio Grid for this Service - Collapsible Content */}
                 <AnimatePresence>
                   {(isExpanded || isEditing) && (
                     <motion.div
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       transition={{ duration: 0.3, ease: 'easeInOut' }}
                       className="overflow-hidden"
                     >
                       <div className="p-6 md:p-8 pt-0 border-t border-gray-100 bg-gray-50/30">
                          {/* DRAG AND DROP GRID using Reorder.Group */}
                          <div className="mt-6">
                              <Reorder.Group 
                                axis="y"
                                values={servicePortfolio} 
                                onReorder={(newOrder) => updatePortfolioCategoryOrder(service.category, newOrder)}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12"
                                layoutScroll
                              >
                                  {servicePortfolio.map((item) => (
                                    <SortablePortfolioItem 
                                        key={item.id} 
                                        item={item} 
                                        isEditing={isEditing}
                                        updatePortfolioItem={updatePortfolioItem}
                                        removePortfolioItem={removePortfolioItem}
                                        handleItemClick={handleItemClick}
                                        serviceCategory={service.category}
                                    />
                                  ))}

                                  {/* Add Item Button */}
                                  {isEditing && (
                                      <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col"
                                      >
                                        <div 
                                            className="aspect-[4/3] bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-gold hover:bg-brand-gold/5 cursor-pointer flex flex-col items-center justify-center transition-all group shadow-sm mb-3"
                                            onClick={() => handleAddItem(service.category)}
                                        >
                                            <Plus className="w-8 h-8 text-gray-400 group-hover:text-brand-gold transition-colors" />
                                        </div>
                                        <div className="text-center">
                                            <span className="text-xs text-gray-400 font-bold">添加{service.title}案例</span>
                                        </div>
                                      </motion.div>
                                  )}
                              </Reorder.Group>
                          </div>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            );
          })}
          
          {/* Add Service Section Button */}
          {isEditing && (
            <button 
              onClick={addService}
              className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-brand-gold hover:bg-brand-gold/5 transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-brand-gold" />
              </div>
              <span className="text-gray-500 font-bold group-hover:text-brand-gold">添加新的业务板块</span>
            </button>
          )}
        </div>
      </div>

      {/* --- DETAIL MODAL & EDITOR --- */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[200] bg-white flex flex-col"
          >
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
                    {selectedItem.category}
                </div>
                <button 
                    onClick={closeModal}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-white p-0 scroll-smooth">
                <div className="w-full min-h-full flex flex-col pb-24">
                    <div className="w-full bg-black relative group/media z-0">
                        {selectedItem.videoUrl ? (
                           <div className="w-full aspect-video relative z-0">
                              {/* Check if direct video file (mp4/mov) OR non-embeddable link (like Qiniu generic) */}
                              {isDirectVideo(selectedItem.videoUrl) ? (
                                <video
                                  src={selectedItem.videoUrl}
                                  className="w-full h-full object-contain bg-black relative z-10"
                                  controls
                                  playsInline
                                />
                              ) : (
                                <iframe 
                                  src={getEmbedUrl(selectedItem.videoUrl) || ''}
                                  title={selectedItem.title}
                                  className="w-full h-full relative z-10"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              )}
                              
                              {/* Overlay for editing video url easily if iframe captures clicks - only in edit mode */}
                              {isEditing && <div className="absolute inset-0 bg-transparent pointer-events-auto md:pointer-events-none z-20"></div>}
                           </div>
                        ) : (
                           <div className="w-full h-[40vh] md:h-[60vh] relative z-0">
                               <img 
                                  src={selectedItem.imageUrl} 
                                  alt={selectedItem.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover opacity-90"
                                />
                               {/* Only Image gets the gradient overlay with title */}
                               <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent z-10 pointer-events-none flex flex-col justify-end p-6 md:p-12">
                                    <div className="pointer-events-auto inline-block">
                                        {isEditing ? (
                                            <div className="flex flex-col gap-2 max-w-xl">
                                                <div>
                                                    <input 
                                                    className="w-full max-w-xs text-xs font-bold border border-white/20 bg-black/40 text-white rounded p-1 focus:border-brand-gold outline-none placeholder:text-white/50"
                                                    value={selectedItem.subBrand || ''}
                                                    onChange={(e) => updatePortfolioItem(selectedItem.id, 'subBrand', e.target.value)}
                                                    placeholder="副标题 / 标签 (例如: 醒狮影视)"
                                                    />
                                                </div>
                                                <div>
                                                    <input 
                                                    className="w-full text-3xl md:text-5xl font-serif font-bold text-white border border-white/20 bg-black/40 rounded p-2 focus:border-brand-gold outline-none placeholder:text-white/50"
                                                    value={selectedItem.title}
                                                    onChange={(e) => updatePortfolioItem(selectedItem.id, 'title', e.target.value)}
                                                    placeholder="案例标题"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="inline-block px-3 py-1 bg-brand-gold text-black text-[10px] font-bold tracking-widest uppercase mb-4 shadow-sm">
                                                    {selectedItem.subBrand || selectedItem.category}
                                                </span>
                                                <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2 drop-shadow-lg shadow-black">{selectedItem.title}</h1>
                                            </>
                                        )}
                                    </div>
                               </div>
                           </div>
                        )}

                        {/* EDIT MODE: HERO MEDIA CONTROLS */}
                        {isEditing && (
                          <div className="absolute top-4 right-4 z-30 w-72 bg-white/95 backdrop-blur p-4 rounded-lg shadow-2xl border border-gray-200">
                             <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase flex items-center gap-1">
                               <ImageIcon className="w-3 h-3"/> 媒体设置
                             </h4>
                             <div className="space-y-3">
                                <ImageUploader 
                                  currentValue={selectedItem.imageUrl}
                                  onUpdate={(val) => updatePortfolioItem(selectedItem.id, 'imageUrl', val)}
                                  label="封面大图"
                                  compact
                                  className="!text-xs"
                                />
                                <ImageUploader 
                                  currentValue={selectedItem.videoUrl || ''}
                                  onUpdate={(val) => updatePortfolioItem(selectedItem.id, 'videoUrl', val)}
                                  label="视频链接 (MP4直链/嵌入)"
                                  compact
                                  className="!text-xs"
                                />
                             </div>
                          </div>
                        )}
                    </div>

                    <div className="px-4 py-12 md:px-8 md:py-16 max-w-5xl mx-auto w-full">
                         {/* VIDEO TITLE SECTION - Display here if video exists (moved below video) */}
                         {selectedItem.videoUrl && (
                             <div className="mb-8 border-b border-gray-100 pb-8">
                                 {isEditing ? (
                                     <div className="flex flex-col gap-4">
                                          <input 
                                            className="w-full text-3xl md:text-4xl font-serif font-bold text-gray-900 border border-gray-200 rounded p-2 focus:border-brand-gold outline-none"
                                            value={selectedItem.title}
                                            onChange={(e) => updatePortfolioItem(selectedItem.id, 'title', e.target.value)}
                                            placeholder="案例标题"
                                          />
                                          <input 
                                            className="w-full max-w-xs text-xs font-bold border border-gray-200 text-gray-600 rounded p-2 focus:border-brand-gold outline-none"
                                            value={selectedItem.subBrand || ''}
                                            onChange={(e) => updatePortfolioItem(selectedItem.id, 'subBrand', e.target.value)}
                                            placeholder="副标题 / 标签 (例如: 醒狮影视)"
                                          />
                                     </div>
                                 ) : (
                                     <>
                                         <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">{selectedItem.title}</h1>
                                         <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold tracking-widest uppercase">
                                             {selectedItem.subBrand || selectedItem.category}
                                         </span>
                                     </>
                                 )}
                             </div>
                         )}

                         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Description */}
                            <div className="lg:col-span-4">
                               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                  <span className="w-8 h-[1px] bg-brand-gold"></span>
                                  项目简介
                               </h3>
                               {isEditing ? (
                                  <textarea 
                                     className="w-full h-64 border border-gray-200 rounded p-3 text-sm leading-relaxed focus:border-brand-gold outline-none resize-none"
                                     value={selectedItem.description}
                                     onChange={(e) => updatePortfolioItem(selectedItem.id, 'description', e.target.value)}
                                     placeholder="请输入详细的项目介绍..."
                                  />
                               ) : (
                                  <p className="text-gray-600 leading-loose text-sm md:text-base whitespace-pre-line">
                                    {selectedItem.description}
                                  </p>
                               )}
                            </div>

                            {/* Gallery */}
                            <div className="lg:col-span-8">
                               <div className="space-y-8">
                                   {/* Sortable Gallery Grid */}
                                   <Reorder.Group 
                                      axis="y" 
                                      values={selectedItem.gallery || []} 
                                      onReorder={(newGallery) => updateGalleryOrder(selectedItem.id, newGallery)}
                                      className="space-y-8"
                                   >
                                       {selectedItem.gallery?.map((img, idx) => (
                                          <SortableGalleryItem 
                                            key={img} 
                                            img={img} 
                                            idx={idx} 
                                            isEditing={isEditing} 
                                            removeFromGallery={() => removeFromGallery(selectedItem.id, idx)} 
                                          />
                                       ))}
                                   </Reorder.Group>

                                   {/* Empty State / Add More */}
                                   {(!selectedItem.gallery || selectedItem.gallery.length === 0) && !isEditing && !selectedItem.videoUrl && (
                                      <div className="h-64 flex items-center justify-center bg-gray-50 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">
                                         暂无更多图片展示
                                      </div>
                                   )}

                                   {/* Edit Mode: Add Gallery Images */}
                                   {isEditing && (
                                      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6">
                                         <h4 className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-2">
                                            <Plus className="w-4 h-4" /> 添加图册图片 (支持七牛云/批量)
                                         </h4>
                                         <ImageUploader 
                                            currentValue=""
                                            onUpdate={(val) => addToGallery(selectedItem.id, val)}
                                            onBatchUpdate={(vals) => vals.forEach(val => addToGallery(selectedItem.id, val))}
                                            allowMultiple={true}
                                            label="粘贴图片链接"
                                            compact={false}
                                            className="w-full"
                                         />
                                      </div>
                                   )}
                               </div>
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

export default Services;
