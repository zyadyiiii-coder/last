import React from 'react';
import { Phone, MapPin, Mail, ArrowUpRight } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import { useContent } from '../context/ContentContext';
import ImageUploader from './ImageUploader';

const Contact: React.FC = () => {
  const { footerLogos, updateFooterLogo, isEditing, sectionBackgrounds, updateSectionBackground, textContent, updateTextContent, wechatQrCode, updateWechatQrCode } = useContent();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#111111] text-white pt-24 pb-12 relative">
      {/* Dynamic Background */}
      {sectionBackgrounds.contact && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
          style={{ backgroundImage: `url("${sectionBackgrounds.contact}")` }}
        ></div>
      )}

      {isEditing && (
        <div className="absolute top-4 right-4 z-30">
           <ImageUploader 
             currentValue={sectionBackgrounds.contact || ''}
             onUpdate={(val) => updateSectionBackground('contact', val)}
             label="更换页脚背景"
             className="w-64"
           />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-5">
            {isEditing ? (
              <input 
                 className="font-serif text-3xl font-bold mb-8 text-white tracking-tight bg-transparent border border-white/20 p-1 w-full"
                 value={textContent.contactTitle}
                 onChange={(e) => updateTextContent('contactTitle', e.target.value)}
              />
            ) : (
              <h2 className="font-serif text-3xl font-bold mb-8 text-white tracking-tight">{textContent.contactTitle}</h2>
            )}
            
            {isEditing ? (
               <textarea 
                  className="text-gray-400 leading-relaxed max-w-sm mb-10 text-sm bg-transparent border border-white/20 p-2 w-full h-24"
                  value={textContent.contactDesc}
                  onChange={(e) => updateTextContent('contactDesc', e.target.value)}
               />
            ) : (
               <p className="text-gray-400 leading-relaxed max-w-sm mb-10 text-sm">
                 {textContent.contactDesc}
               </p>
            )}

            <div className="flex flex-col sm:flex-row gap-6">
               <div className="text-center sm:text-left">
                 {isEditing ? (
                    <input 
                       className="text-2xl font-serif font-bold text-brand-gold bg-transparent border border-white/20 p-1 w-20 text-center"
                       value={textContent.contactProjectCount}
                       onChange={(e) => updateTextContent('contactProjectCount', e.target.value)}
                    />
                 ) : (
                    <div className="text-2xl font-serif font-bold text-brand-gold">{textContent.contactProjectCount}</div>
                 )}
                 {isEditing ? (
                    <input 
                       className="text-[10px] uppercase tracking-widest text-gray-500 mt-1 bg-transparent border border-white/20 p-1 w-20 text-center"
                       value={textContent.contactProjectLabel}
                       onChange={(e) => updateTextContent('contactProjectLabel', e.target.value)}
                    />
                 ) : (
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{textContent.contactProjectLabel}</div>
                 )}
               </div>
               <div className="text-center sm:text-left">
                 {isEditing ? (
                    <input 
                       className="text-2xl font-serif font-bold text-brand-gold bg-transparent border border-white/20 p-1 w-20 text-center"
                       value={textContent.contactClientCount}
                       onChange={(e) => updateTextContent('contactClientCount', e.target.value)}
                    />
                 ) : (
                    <div className="text-2xl font-serif font-bold text-brand-gold">{textContent.contactClientCount}</div>
                 )}
                 {isEditing ? (
                    <input 
                       className="text-[10px] uppercase tracking-widest text-gray-500 mt-1 bg-transparent border border-white/20 p-1 w-20 text-center"
                       value={textContent.contactClientLabel}
                       onChange={(e) => updateTextContent('contactClientLabel', e.target.value)}
                    />
                 ) : (
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{textContent.contactClientLabel}</div>
                 )}
               </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4">
             {isEditing ? (
               <input 
                  className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-8 bg-transparent border border-white/20 p-1 w-full"
                  value={textContent.contactLabelCall || 'Contact Us'} 
                  onChange={(e) => updateTextContent('contactLabelCall', e.target.value)}
               />
             ) : (
               <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-8">{textContent.contactLabelCall || 'Contact Us'}</h4>
             )}
            
            <ul className="space-y-6">
              <li className="flex items-start group">
                <div className="flex-shrink-0 w-10 h-10 rounded bg-white/5 flex items-center justify-center mr-4 group-hover:bg-brand-gold/10 transition-colors">
                   <Phone className="w-4 h-4 text-brand-gold" />
                </div>
                <div className="flex items-start justify-between w-full">
                   <div>
                      {isEditing ? (
                        <input 
                          className="text-sm text-gray-400 mb-1 bg-transparent border border-white/20 p-1 w-full"
                          value={textContent.contactLabelCall}
                          onChange={(e) => updateTextContent('contactLabelCall', e.target.value)}
                        />
                      ) : (
                        <p className="text-sm text-gray-400 mb-1">{textContent.contactLabelCall}</p>
                      )}
                      
                      {isEditing ? (
                        <div className="flex flex-col gap-1">
                            <input className="bg-transparent border border-white/20 text-white p-1" value={textContent.contactPhone1} onChange={e => updateTextContent('contactPhone1', e.target.value)} />
                            <input className="bg-transparent border border-white/20 text-white p-1" value={textContent.contactPhone2} onChange={e => updateTextContent('contactPhone2', e.target.value)} />
                        </div>
                      ) : (
                          <>
                            <p className="text-white font-medium hover:text-brand-gold transition-colors cursor-pointer">{textContent.contactPhone1}</p>
                            <p className="text-white font-medium hover:text-brand-gold transition-colors cursor-pointer">{textContent.contactPhone2}</p>
                          </>
                      )}
                   </div>

                   {/* WeChat QR Code Section */}
                   <div className="ml-4 flex flex-col items-center">
                      {isEditing && (
                         <div className="w-24 relative mb-2">
                            <ImageUploader 
                               currentValue={wechatQrCode}
                               onUpdate={updateWechatQrCode}
                               label="微信二维码"
                               compact
                               className="!bg-black/50 !border-white/20 !text-white text-[9px]"
                            />
                         </div>
                      )}
                      {wechatQrCode ? (
                         <div className="w-20 h-20 bg-white p-1 rounded shadow-lg overflow-hidden">
                           <img src={wechatQrCode} alt="WeChat QR" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                         </div>
                      ) : isEditing ? (
                         <div className="w-20 h-20 border border-dashed border-white/20 flex items-center justify-center text-[9px] text-gray-500">
                           QR Code
                         </div>
                      ) : null}
                   </div>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center mr-4 group-hover:bg-brand-gold/10 transition-colors">
                   <MapPin className="w-4 h-4 text-brand-gold" />
                </div>
                <div>
                  {isEditing ? (
                     <input 
                       className="text-sm text-gray-400 mb-1 bg-transparent border border-white/20 p-1 w-full"
                       value={textContent.contactLabelVisit}
                       onChange={(e) => updateTextContent('contactLabelVisit', e.target.value)}
                     />
                   ) : (
                     <p className="text-sm text-gray-400 mb-1">{textContent.contactLabelVisit}</p>
                   )}
                  
                   {isEditing ? (
                      <input className="bg-transparent border border-white/20 text-white p-1 w-full" value={textContent.contactAddress} onChange={e => updateTextContent('contactAddress', e.target.value)} />
                   ) : (
                      <span className="text-white font-medium group-hover:text-brand-gold transition-colors">{textContent.contactAddress}</span>
                   )}
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
             {isEditing ? (
               <input 
                  className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-8 bg-transparent border border-white/20 p-1 w-full"
                  value={textContent.contactMenuTitle}
                  onChange={(e) => updateTextContent('contactMenuTitle', e.target.value)}
               />
             ) : (
               <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-8">{textContent.contactMenuTitle}</h4>
             )}
            <ul className="space-y-4">
              {['首页', '关于我们', '业务领域', '案例展示'].map((item, i) => {
                const targetId = item === '首页' ? 'hero' : item === '关于我们' ? 'about' : item === '业务领域' ? 'services' : 'portfolio';
                return (
                  <li key={i}>
                    <a 
                       href={`#${targetId}`}
                       onClick={(e) => handleScroll(e, targetId)}
                       className="flex items-center justify-between group py-2 border-b border-white/5 hover:border-brand-gold/30 transition-all"
                    >
                      <span className="text-gray-400 group-hover:text-white transition-colors text-sm">{item}</span>
                      <ArrowUpRight className="w-3 h-3 text-brand-gold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Footer Logos */}
        <div className="mb-12 border-t border-white/5 pt-12 flex flex-col items-center">
           {isEditing ? (
               <input 
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6 bg-transparent border border-white/20 p-1 text-center"
                  value={textContent.contactPartnersTitle}
                  onChange={(e) => updateTextContent('contactPartnersTitle', e.target.value)}
               />
             ) : (
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">{textContent.contactPartnersTitle}</h4>
             )}
           
           <div className="flex justify-center items-center gap-8 md:gap-16">
              {footerLogos.map((logo, index) => (
                 <div key={index} className="relative group/logo">
                   {isEditing && (
                     <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 opacity-0 group-hover/logo:opacity-100 transition-opacity z-50">
                       <ImageUploader 
                          currentValue={logo}
                          onUpdate={(val) => updateFooterLogo(index, val)}
                          label={`Logo ${index + 1}`}
                          compact
                       />
                     </div>
                   )}
                   {logo ? (
                     <img 
                       src={logo} 
                       alt={`Footer Partner ${index + 1}`} 
                       referrerPolicy="no-referrer"
                       className="h-6 md:h-10 object-contain opacity-40 hover:opacity-80 transition-opacity grayscale" 
                      />
                   ) : isEditing ? (
                     <div className="h-6 md:h-10 w-20 border border-dashed border-white/10 flex items-center justify-center text-[9px] text-gray-600">Logo位 {index+1}</div>
                   ) : null}
                 </div>
              ))}
           </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {CONTACT_INFO.companyName}. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Contact;