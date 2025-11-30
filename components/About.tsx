import React from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { Plus, Trash2, User, ChevronLeft, ChevronRight } from 'lucide-react';
import ImageUploader from './ImageUploader';

const About: React.FC = () => {
  const { 
    team, updateTeamMember, addTeamMember, removeTeamMember, reorderTeamMember,
    isEditing, sectionBackgrounds, updateSectionBackground,
    clientLogos, updateClientLogos, clientLogosScale, updateClientLogosScale,
    textContent, updateTextContent,
    aboutHeroImage, updateAboutHeroImage,
    aboutFooterImage, updateAboutFooterImage, aboutFooterImageScale, updateAboutFooterImageScale
  } = useContent();

  return (
    <section id="about" className="py-24 relative bg-white overflow-hidden">
      {/* Dynamic Background */}
      {sectionBackgrounds.about && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none"
          style={{ backgroundImage: `url("${sectionBackgrounds.about}")` }}
        ></div>
      )}
      
      {isEditing && (
        <div className="absolute top-4 right-4 z-30">
           <ImageUploader 
             currentValue={sectionBackgrounds.about || ''}
             onUpdate={(val) => updateSectionBackground('about', val)}
             label="更换关于背景"
             className="w-64"
           />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left: Image Composition */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1 sticky top-24"
          >
            <div className="relative h-[500px] w-full bg-gray-50 overflow-hidden group shadow-2xl">
              <img 
                src={aboutHeroImage} 
                alt="Company Environment" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
              />
              
              {isEditing && (
                <div className="absolute top-4 left-4 z-30 w-64">
                   <ImageUploader 
                     currentValue={aboutHeroImage}
                     onUpdate={updateAboutHeroImage}
                     label="更换展示图"
                     className="!bg-white/90"
                   />
                </div>
              )}

              {/* Decorative Frame */}
              <div className="absolute top-4 left-4 right-4 bottom-4 border border-white/30 pointer-events-none"></div>
              
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-white shadow-xl p-6 flex items-center justify-center z-10">
                <div className="text-center">
                   {isEditing ? (
                     <>
                      <input 
                         className="block text-4xl font-serif text-brand-gold font-bold w-20 text-center mx-auto border border-gray-200" 
                         value={textContent.aboutExpYear}
                         onChange={(e) => updateTextContent('aboutExpYear', e.target.value)}
                      />
                      <input 
                         className="text-[10px] text-gray-50 uppercase tracking-widest mt-1 block w-full text-center border border-gray-200"
                         value={textContent.aboutExpLabel}
                         onChange={(e) => updateTextContent('aboutExpLabel', e.target.value)}
                      />
                     </>
                   ) : (
                     <>
                      <span className="block text-4xl font-serif text-brand-gold font-bold">{textContent.aboutExpYear}<span className="text-lg align-top">+</span></span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 block">{textContent.aboutExpLabel}</span>
                     </>
                   )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Text Content & Team */}
          <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="order-1 lg:order-2"
          >
            {isEditing ? (
               <input 
                  className="text-brand-gold font-medium tracking-[0.3em] uppercase text-xs mb-6 w-full border border-gray-200 p-1"
                  value={textContent.aboutTitleSmall}
                  onChange={(e) => updateTextContent('aboutTitleSmall', e.target.value)}
               />
            ) : (
               <h3 className="text-brand-gold font-medium tracking-[0.3em] uppercase text-xs mb-6">{textContent.aboutTitleSmall}</h3>
            )}

            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-8 leading-tight">
               {isEditing ? (
                  <div className="flex flex-col gap-2">
                     <input 
                       className="w-full border border-gray-200 p-1"
                       value={textContent.aboutTitleLargeLine1}
                       onChange={(e) => updateTextContent('aboutTitleLargeLine1', e.target.value)}
                     />
                     <input 
                       className="w-full border border-gray-200 p-1 text-gray-400"
                       value={textContent.aboutTitleLargeLine2}
                       onChange={(e) => updateTextContent('aboutTitleLargeLine2', e.target.value)}
                     />
                  </div>
               ) : (
                 <>
                   {textContent.aboutTitleLargeLine1}<br/>
                   <span className="text-gray-400">{textContent.aboutTitleLargeLine2}</span>
                 </>
               )}
            </h2>
            
            <div className="space-y-6 text-gray-600 font-light leading-relaxed text-sm md:text-base mb-12">
               {isEditing ? (
                 <>
                    <textarea 
                       className="w-full border border-gray-200 p-2 h-24"
                       value={textContent.aboutDescP1}
                       onChange={(e) => updateTextContent('aboutDescP1', e.target.value)}
                    />
                    <textarea 
                       className="w-full border border-gray-200 p-2 h-24"
                       value={textContent.aboutDescP2}
                       onChange={(e) => updateTextContent('aboutDescP2', e.target.value)}
                    />
                 </>
               ) : (
                 <>
                  <p>{textContent.aboutDescP1}</p>
                  <p>{textContent.aboutDescP2}</p>
                 </>
               )}
            </div>

            {/* Client Logos Section (Moved Above Team) */}
            <div className="mb-12 border-b border-gray-100 pb-12">
              <div className="text-left mb-6">
                 {isEditing ? (
                   <input 
                      className="block text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-2 border border-gray-200 p-1 w-full"
                      value={textContent.clientLogosTitleSmall}
                      onChange={(e) => updateTextContent('clientLogosTitleSmall', e.target.value)}
                   />
                 ) : (
                   <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-2">{textContent.clientLogosTitleSmall}</h4>
                 )}

                 {isEditing ? (
                    <input 
                       className="block text-xl font-serif font-bold text-gray-900 border border-gray-200 p-1 w-full"
                       value={textContent.clientLogosTitleLarge}
                       onChange={(e) => updateTextContent('clientLogosTitleLarge', e.target.value)}
                    />
                 ) : (
                    <h3 className="text-xl font-serif font-bold text-gray-900">{textContent.clientLogosTitleLarge}</h3>
                 )}
              </div>
              
              <div className="flex flex-col items-start">
                 {isEditing && (
                    <div className="w-full mb-4 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                       <div className="mb-4">
                          <ImageUploader 
                              currentValue={clientLogos}
                              onUpdate={updateClientLogos}
                              label="上传合作品牌合集图 (长图)"
                              className="w-full"
                          />
                       </div>
                       <div className="flex items-center gap-4 px-2">
                          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">图片缩放 ({clientLogosScale}%)</span>
                          <input 
                            type="range" 
                            min="10" 
                            max="100" 
                            value={clientLogosScale}
                            onChange={(e) => updateClientLogosScale(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                          />
                       </div>
                    </div>
                 )}

                 {clientLogos ? (
                    <div className="w-full flex justify-start">
                       <img 
                          src={clientLogos} 
                          alt="Client Logos" 
                          referrerPolicy="no-referrer"
                          className="max-w-full object-contain origin-left"
                          style={{ width: `${clientLogosScale}%` }}
                       />
                    </div>
                 ) : (
                    isEditing && (
                       <div className="w-full h-24 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                          暂无合作品牌图片，请上方上传
                       </div>
                    )
                 )}
              </div>
            </div>
            
            {/* Team Section */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-8">
                 {isEditing ? (
                    <input 
                       className="text-xs font-bold uppercase tracking-widest text-gray-400 border border-gray-200 p-1"
                       value={textContent.aboutTeamTitle}
                       onChange={(e) => updateTextContent('aboutTeamTitle', e.target.value)}
                    />
                 ) : (
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">{textContent.aboutTeamTitle}</h4>
                 )}
                {isEditing && (
                  <button 
                    onClick={addTeamMember}
                    className="text-xs bg-brand-gold text-white px-3 py-2 rounded font-bold flex items-center hover:bg-black transition-colors shadow-lg"
                  >
                    <Plus className="w-3 h-3 mr-1" /> 添加成员
                  </button>
                )}
              </div>
              
              {/* Team Posters Area - Full Grid Layout */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {team.map((member, index) => (
                  <div key={member.id} className="w-full group relative">
                    {/* Poster Image Area */}
                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden shadow-md mb-4 group-hover:shadow-xl transition-all duration-300">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                          <User className="w-12 h-12" />
                        </div>
                      )}
                      
                      {/* --- EDIT MODE OVERLAY --- */}
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] z-20 flex flex-col justify-between p-2">
                           
                           {/* Top: Delete */}
                           <div className="flex justify-end">
                             <button 
                               onClick={() => removeTeamMember(member.id)}
                               className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors shadow-lg"
                               title="删除成员"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>

                           {/* Center: Image Upload Trigger */}
                           <div className="flex-1 flex items-center justify-center">
                              <div className="w-full px-2">
                                <ImageUploader 
                                  currentValue={member.image}
                                  onUpdate={(val) => updateTeamMember(member.id, 'image', val)}
                                  label="更图"
                                  compact={true}
                                  className="!bg-black/60 !border-white/30 !text-white !p-2 text-center text-[10px]"
                                />
                              </div>
                           </div>

                           {/* Bottom: Sort Toolbar */}
                           <div className="bg-black/80 rounded flex items-center justify-between p-1 border border-white/20">
                              <button 
                                onClick={(e) => { e.stopPropagation(); reorderTeamMember(member.id, 'left'); }}
                                disabled={index === 0}
                                className={`p-1.5 text-white hover:text-brand-gold disabled:opacity-30 transition-colors`}
                                title="向前移动"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>
                              <span className="text-[10px] text-gray-300 font-bold uppercase">排序</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); reorderTeamMember(member.id, 'right'); }}
                                disabled={index === team.length - 1}
                                className={`p-1.5 text-white hover:text-brand-gold disabled:opacity-30 transition-colors`}
                                title="向后移动"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                           </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Info Area */}
                    <div className="space-y-1">
                      {isEditing ? (
                        <div className="flex flex-col gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                           <input 
                             className="w-full text-xs bg-white border border-gray-300 p-1.5 rounded text-black font-bold focus:border-brand-gold outline-none" 
                             value={member.role} 
                             placeholder="职位"
                             onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                           />
                           <input 
                             className="w-full text-xs bg-white border border-gray-300 p-1.5 rounded text-gray-700 focus:border-brand-gold outline-none" 
                             value={member.name} 
                             placeholder="姓名"
                             onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                           />
                        </div>
                      ) : (
                        <div className="text-left pl-1 border-l-2 border-transparent group-hover:border-brand-gold transition-colors duration-300">
                          <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">{member.role}</p>
                          <p className="text-xs text-gray-500 font-serif italic mt-0.5">{member.name}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Placeholder for Edit Mode */}
                {isEditing && (
                   <div 
                      onClick={addTeamMember}
                      className="w-full aspect-[3/4] border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-brand-gold hover:text-brand-gold transition-colors bg-gray-50"
                   >
                      <Plus className="w-8 h-8 mb-2" />
                      <span className="text-xs font-bold">添加成员</span>
                   </div>
                )}
              </div>
            </div>

          </motion.div>
        </div>
        
        {/* Footer Image Collection for About Page */}
        <div className="mt-20 border-t border-gray-100 pt-16 flex flex-col items-center">
            {isEditing && (
              <div className="mb-6 w-full max-w-lg bg-gray-50 p-4 rounded border border-dashed border-gray-300">
                  <ImageUploader 
                    currentValue={aboutFooterImage || ''}
                    onUpdate={updateAboutFooterImage}
                    label="底部服务商合集图"
                    compact
                    className="w-full mb-2"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 whitespace-nowrap">缩放: {aboutFooterImageScale || 100}%</span>
                    <input 
                      type="range" 
                      min="10" 
                      max="150" 
                      value={aboutFooterImageScale || 100}
                      onChange={(e) => updateAboutFooterImageScale(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                    />
                  </div>
              </div>
            )}
            
            {aboutFooterImage ? (
               <img 
                 src={aboutFooterImage} 
                 alt="Service Providers" 
                 referrerPolicy="no-referrer"
                 className="object-contain"
                 style={{ width: `${aboutFooterImageScale || 100}%`, maxWidth: '100%' }}
               />
            ) : (
               isEditing && (
                  <div className="w-full h-32 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm bg-gray-50">
                     暂无底部服务商图片，请上方上传
                  </div>
               )
            )}
        </div>

      </div>
    </section>
  );
};

export default About;