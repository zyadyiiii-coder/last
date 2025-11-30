import React, { useState, useRef, useEffect } from 'react';
import { Music, Pause, Play } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import ImageUploader from './ImageUploader';
import { motion, AnimatePresence } from 'framer-motion';

const BackgroundMusic: React.FC = () => {
  const { backgroundMusicUrl, updateBackgroundMusicUrl, isEditing } = useContent();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      // If URL changes or loads
      audioRef.current.volume = 0.4;
    }
  }, [backgroundMusicUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed", e);
        // Sometimes browsers block unmuted autoplay, so we handle it gracefully
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start gap-2">
      <audio 
        ref={audioRef} 
        src={backgroundMusicUrl} 
        loop 
        onEnded={() => setIsPlaying(false)}
      />

      {/* Edit Overlay */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-2 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/20 w-64 shadow-2xl"
          >
             <ImageUploader 
               currentValue={backgroundMusicUrl}
               onUpdate={updateBackgroundMusicUrl}
               label="背景音乐链接 (MP3/URL)"
               compact
               className="!bg-transparent !border-white/20 !text-white text-xs"
             />
             <p className="text-[9px] text-gray-400 mt-1">支持外部音乐直链</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Control */}
      {backgroundMusicUrl && (
        <button
          onClick={togglePlay}
          className={`group w-12 h-12 rounded-full flex items-center justify-center shadow-2xl border transition-all duration-500 overflow-hidden relative ${
            isPlaying ? 'bg-brand-gold border-brand-gold' : 'bg-black/50 border-white/20 backdrop-blur-md hover:bg-black/80'
          }`}
          title={isPlaying ? "暂停音乐" : "播放音乐"}
        >
          {/* Spinning Vinyl Effect */}
          {isPlaying && (
            <div className="absolute inset-0 animate-spin-slow opacity-30">
               <div className="w-full h-full rounded-full border-2 border-dashed border-white"></div>
            </div>
          )}
          
          <div className="relative z-10 text-white">
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <div className="relative">
                 <Music className="w-5 h-5" />
                 <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        </button>
      )}

      {/* Placeholder Icon when in Edit Mode but no music set */}
      {isEditing && !backgroundMusicUrl && (
         <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400">
            <Music className="w-5 h-5 opacity-50" />
         </div>
      )}
    </div>
  );
};

export default BackgroundMusic;