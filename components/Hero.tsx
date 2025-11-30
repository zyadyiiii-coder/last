import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { Play } from 'lucide-react';
import ImageUploader from './ImageUploader';

const Hero: React.FC = () => {
  const { 
    heroImage, updateHeroImage,
    heroVideo, updateHeroVideo, // Add video state
    isEditing, 
    textContent, updateTextContent,
    heroTitleImage, updateHeroTitleImage,
    heroTitleImageScale, updateHeroTitleImageScale,
    heroFooterImage, updateHeroFooterImage,
    heroFooterImageScale, updateHeroFooterImageScale
  } = useContent();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-[100dvh] w-full overflow-hidden bg-black flex items-center justify-center group">
      {/* Background Image Overlay (Fallback or Underlay) */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 group-hover:scale-100 z-0"
        style={{ backgroundImage: `url("${heroImage}")` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Background Video Layer - Autoplay Enabled */}
      {heroVideo && (
        <video 
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={heroVideo}
          autoPlay 
          loop 
          muted 
          playsInline
        />
      )}
      
      {/* Cinematic Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-white/10 pointer-events-none z-10"></div>

      {/* Edit Overlay */}
      {isEditing && (
        <div className="absolute top-24 right-4 z-30 flex flex-col gap-2">
           <ImageUploader 
             currentValue={heroImage} 
             onUpdate={updateHeroImage} 
             label="更换背景图片 (视频封面)"
             className="w-72"
           />
           <ImageUploader 
             currentValue={heroVideo} 
             onUpdate={updateHeroVideo} 
             label="更换背景视频 (MP4链接)"
             className="w-72"
           />
           <p className="text-[9px] text-white/70 bg-black/50 p-1 rounded">
             * 视频优先于图片显示。必须为直链 (如七牛云)
           </p>
        </div>
      )}

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Main Title Area - Conditional Rendering of Image or Text */}
          <div className="mb-8 w-full flex flex-col items-center relative">
            
            {/* If Image exists, show Image */}
            {heroTitleImage ? (
              <div className="relative w-full flex flex-col items-center">
                 <img 
                    src={heroTitleImage} 
                    alt="Hero Title" 
                    className="max-w-full object-contain drop-shadow-2xl"
                    style={{ width: `${heroTitleImageScale}%` }}
                    referrerPolicy="no-referrer"
                 />
                 
                 {isEditing && (
                   <div className="mt-4 p-4 bg-black/50 backdrop-blur rounded border border-white/20 w-full max-w-md">
                      <div className="mb-2">
                        <ImageUploader 
                          currentValue={heroTitleImage}
                          onUpdate={updateHeroTitleImage}
                          label="更换标题图片"
                          compact
                          className="!bg-transparent !border-white/20 !text-white"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-white whitespace-nowrap">缩放 ({heroTitleImageScale}%)</span>
                        <input 
                          type="range" 
                          min="30" 
                          max="150" 
                          value={heroTitleImageScale}
                          onChange={(e) => updateHeroTitleImageScale(Number(e.target.value))}
                          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                        />
                      </div>
                   </div>
                 )}
              </div>
            ) : (
              /* Otherwise show Text (H1) */
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-white leading-[1.1] drop-shadow-2xl w-full">
                {isEditing ? (
                  <div className="flex flex-col gap-4">
                    <input 
                      value={textContent.heroTitleLine1} 
                      onChange={(e) => updateTextContent('heroTitleLine1', e.target.value)}
                      className="bg-white/10 border border-white/20 rounded p-2 text-center w-full text-white"
                    />
                    <input 
                      value={textContent.heroTitleLine2} 
                      onChange={(e) => updateTextContent('heroTitleLine2', e.target.value)}
                      className="bg-white/10 border border-white/20 rounded p-2 text-center w-full text-white"
                    />
                  </div>
                ) : (
                  <>
                    <span className="block mb-2">{textContent.heroTitleLine1}</span>
                    <span className="text-white">{textContent.heroTitleLine2}</span>
                  </>
                )}
              </h1>
            )}

            {/* If NO image is set, allow uploading one in Edit Mode */}
            {isEditing && !heroTitleImage && (
               <div className="mt-4 w-64">
                  <ImageUploader 
                    currentValue="" 
                    onUpdate={updateHeroTitleImage} 
                    label="或：上传标题图片 (替代文字)"
                    compact
                    className="!bg-black/50 !border-white/20 !text-white"
                  />
               </div>
            )}
          </div>
          
          <div className="mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-white/90 font-light leading-relaxed tracking-wide px-4 drop-shadow-md">
            {isEditing ? (
               <input 
                  value={textContent.heroSubtitle} 
                  onChange={(e) => updateTextContent('heroSubtitle', e.target.value)}
                  className="bg-white/10 border border-white/20 rounded p-2 text-center w-full text-white"
                />
            ) : (
               <div dangerouslySetInnerHTML={{ __html: textContent.heroSubtitle.replace(/·/g, '<span class="text-brand-gold px-2">·</span>') }} />
            )}
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5 px-8">
            <a 
              href="#services"
              onClick={(e) => handleScroll(e, 'services')}
              className="group relative px-8 py-3 bg-transparent border border-white/40 hover:border-white hover:bg-white/10 text-white transition-all duration-300 overflow-hidden backdrop-blur-sm"
            >
              {isEditing ? (
                 <input 
                    value={textContent.heroButtonPrimary} 
                    onChange={(e) => updateTextContent('heroButtonPrimary', e.target.value)}
                    className="bg-transparent border-0 text-center w-24 text-white font-bold outline-none"
                  />
              ) : (
                 <span className="relative z-10 text-sm tracking-[0.2em] uppercase transition-colors font-bold">{textContent.heroButtonPrimary}</span>
              )}
            </a>
            
            <a 
              href="#contact"
              onClick={(e) => handleScroll(e, 'contact')}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-black font-bold text-sm tracking-[0.2em] uppercase hover:bg-brand-gold hover:text-white transition-all duration-300 shadow-xl"
            >
              <Play className="w-3 h-3 fill-current" /> 
              {isEditing ? (
                 <input 
                    value={textContent.heroButtonSecondary} 
                    onChange={(e) => updateTextContent('heroButtonSecondary', e.target.value)}
                    className="bg-transparent border-0 text-center w-24 text-black font-bold outline-none"
                  />
              ) : (
                 <span>{textContent.heroButtonSecondary}</span>
              )}
            </a>
          </div>
        </motion.div>
      </div>

      {/* Single Scalable Footer Image */}
      <div className="absolute bottom-16 left-0 w-full px-4 z-20">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
           {isEditing && (
              <div className="mb-4 w-80 bg-black/60 p-4 rounded border border-white/20 backdrop-blur-md">
                 <ImageUploader 
                    currentValue={heroFooterImage}
                    onUpdate={updateHeroFooterImage}
                    label="底部服务商合集图"
                    compact
                    className="!bg-transparent !border-white/20 !text-white mb-2"
                 />
                 <div className="flex items-center gap-2 text-white">
                    <span className="text-[10px] text-gray-300 whitespace-nowrap font-bold">缩放: {heroFooterImageScale}%</span>
                    <input 
                      type="range" 
                      min="10" 
                      max="150" 
                      value={heroFooterImageScale}
                      onChange={(e) => updateHeroFooterImageScale(Number(e.target.value))}
                      className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                    />
                 </div>
              </div>
           )}

           {heroFooterImage ? (
             <img 
               src={heroFooterImage} 
               alt="Partners" 
               className="object-contain opacity-80 hover:opacity-100 transition-opacity" 
               style={{ width: `${heroFooterImageScale}%`, maxWidth: '100%' }}
               referrerPolicy="no-referrer"
             />
           ) : (
             isEditing && (
               <div className="text-white/50 text-xs border border-dashed border-white/30 p-4 rounded text-center">
                  暂无底部服务商合集图，请上方上传
               </div>
             )
           )}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/80 to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Hero;