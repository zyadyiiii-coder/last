import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PortfolioItem, TeamMember, ServiceItem, Category, AppConfig, TextContent } from '../types';
import { PORTFOLIO_DATA, TEAM_MEMBERS, SERVICES } from '../constants';

// Storage Key
const STORAGE_KEY = 'YIDAO_SITE_CONFIG_V2';

// Default Text Content to ensure no missing keys on initial load
const DEFAULT_TEXT_CONTENT: TextContent = {
  heroTitleLine1: "打造一站式",
  heroTitleLine2: "文化创意方案",
  heroSubtitle: "品牌设计 · 影视制作 · 音乐原创 · 活动执行",
  heroButtonPrimary: "查看案例",
  heroButtonSecondary: "联系我们",
  
  aboutTitleSmall: "About Yidao Jiahua",
  aboutTitleLargeLine1: "以视觉传达为核心",
  aboutTitleLargeLine2: "构建文化影响力",
  aboutDescP1: "贵州译道佳华文化发展有限公司，前身是一家深耕行业10多年的品牌设计工作室。我们不只是设计的执行者，更是品牌价值的塑造者。",
  aboutDescP2: "旗下拥有【醒狮影视】与【龙予成林音乐工作室】，打通视觉与听觉的创意边界。从现场搭建执行到广告物料印刷，我们提供全产业链的专业支持。",
  aboutExpYear: "10",
  aboutExpLabel: "Years Experience",
  aboutTeamTitle: "Core Team",
  clientLogosTitleSmall: "Trusted By",
  clientLogosTitleLarge: "合作品牌",

  servicesTitleSmall: "Our Business",
  servicesTitleLarge: "核心业务 & 案例展示",
  servicesDesc: "我们提供全链路的创意服务，从视觉到听觉，从线上到线下，全方位助力品牌价值提升。",
  servicesCtaTitle: "定制化解决方案",
  servicesCtaDesc: "没有找到您需要的服务？\n联系我们获取专属方案。",
  servicesCtaButton: "立即咨询",

  portfolioTitleSmall: "Selected Works",
  portfolioTitleLarge: "精选案例",
  portfolioButtonAdd: "添加新案例",

  contactTitle: "YIDAO JIAHUA",
  contactDesc: "我们致力于将文化与商业完美融合，通过独特的视觉语言和创新的执行方案，为品牌创造持久的影响力。",
  contactProjectCount: "100+",
  contactProjectLabel: "Projects",
  contactClientCount: "50+",
  contactClientLabel: "Clients",
  contactLabelCall: "Call Us",
  contactLabelVisit: "Visit Us",
  contactMenuTitle: "Menu",
  contactPartnersTitle: "Partners & Certifications",
  contactPhone1: "15985194981",
  contactPhone2: "13984832580",
  contactAddress: "贵州省贵阳市"
};

interface ContentContextType {
  isEditing: boolean;
  toggleEditing: () => void;
  
  // Text Content
  textContent: TextContent;
  updateTextContent: (key: string, value: string) => void;

  // Portfolio
  portfolio: PortfolioItem[];
  addPortfolioItem: (category?: Category) => PortfolioItem; 
  removePortfolioItem: (id: number) => void;
  updatePortfolioItem: (id: number, field: keyof PortfolioItem, value: any) => void;
  reorderPortfolioItem: (id: number, direction: 'prev' | 'next', category: Category) => void; 
  updatePortfolioCategoryOrder: (category: Category, newItems: PortfolioItem[]) => void; // New Drag-and-Drop support
  addToGallery: (id: number, imageUrl: string) => void;
  removeFromGallery: (id: number, index: number) => void;
  reorderGalleryItem: (id: number, index: number, direction: 'left' | 'right') => void;
  updateGalleryOrder: (id: number, newGallery: string[]) => void; // New Drag-and-Drop support
  
  // Team
  team: TeamMember[];
  addTeamMember: () => void;
  removeTeamMember: (id: number) => void;
  updateTeamMember: (id: number, field: keyof TeamMember, value: string) => void;
  reorderTeamMember: (id: number, direction: 'left' | 'right') => void; 
  
  // Services
  services: ServiceItem[];
  addService: () => void;
  removeService: (id: number) => void;
  updateService: (id: number, field: keyof ServiceItem, value: string) => void;

  // Hero
  heroImage: string;
  updateHeroImage: (url: string) => void;
  heroVideo: string;
  updateHeroVideo: (url: string) => void;

  heroTitleImage: string;
  updateHeroTitleImage: (url: string) => void;
  heroTitleImageScale: number;
  updateHeroTitleImageScale: (scale: number) => void;
  
  heroFooterImage: string;
  updateHeroFooterImage: (url: string) => void;
  heroFooterImageScale: number;
  updateHeroFooterImageScale: (scale: number) => void;

  // About Hero Image
  aboutHeroImage: string;
  updateAboutHeroImage: (url: string) => void;
  aboutFooterImage: string;
  updateAboutFooterImage: (url: string) => void;
  aboutFooterImageScale: number;
  updateAboutFooterImageScale: (scale: number) => void;

  // Logos
  introLogos: string[];
  updateIntroLogo: (index: number, url: string) => void;
  
  clientLogos: string; 
  updateClientLogos: (url: string) => void; 
  clientLogosScale: number;
  updateClientLogosScale: (scale: number) => void;

  footerLogos: string[];
  updateFooterLogo: (index: number, url: string) => void;

  // QR Code
  wechatQrCode: string;
  updateWechatQrCode: (url: string) => void;

  // Background Music
  backgroundMusicUrl: string;
  updateBackgroundMusicUrl: (url: string) => void;

  // Section Backgrounds
  sectionBackgrounds: Record<string, string>;
  updateSectionBackground: (section: string, url: string) => void;
  
  resetData: () => void;
  handleFileUpload: (file: File) => Promise<string>;
  
  // Export/Import
  exportConfig: () => string;
  importConfig: (jsonString: string) => { success: boolean; error?: string };
  hasLocalChanges: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  
  // Initialize state
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(PORTFOLIO_DATA);
  const [team, setTeam] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES);
  const [heroImage, setHeroImage] = useState<string>('https://picsum.photos/1920/1080?grayscale&blur=2');
  const [heroVideo, setHeroVideo] = useState<string>(''); // New video state
  
  // Hero Title Image
  const [heroTitleImage, setHeroTitleImage] = useState<string>('');
  const [heroTitleImageScale, setHeroTitleImageScale] = useState<number>(100);

  // Hero Footer Image
  const [heroFooterImage, setHeroFooterImage] = useState<string>('');
  const [heroFooterImageScale, setHeroFooterImageScale] = useState<number>(80);

  // About Hero Image
  const [aboutHeroImage, setAboutHeroImage] = useState<string>('https://picsum.photos/800/1000?random=99');
  const [aboutFooterImage, setAboutFooterImage] = useState<string>('');
  const [aboutFooterImageScale, setAboutFooterImageScale] = useState<number>(100);

  const [introLogos, setIntroLogos] = useState<string[]>(['', '', '']);
  const [clientLogos, setClientLogos] = useState<string>(''); 
  const [clientLogosScale, setClientLogosScale] = useState<number>(100);
  const [footerLogos, setFooterLogos] = useState<string[]>(['', '', '']);
  const [wechatQrCode, setWechatQrCode] = useState<string>('');
  
  // Background Music
  const [backgroundMusicUrl, setBackgroundMusicUrl] = useState<string>('');

  const [sectionBackgrounds, setSectionBackgrounds] = useState<Record<string, string>>({
      about: '',
      services: '',
      portfolio: '',
      contact: ''
  });
  const [textContent, setTextContent] = useState<TextContent>(DEFAULT_TEXT_CONTENT);

  // Helper to apply configuration to state with robust checks
  const applyConfig = (config: AppConfig) => {
    if (!config) return;

    if (Array.isArray(config.portfolio)) setPortfolio(config.portfolio.filter(Boolean));
    if (Array.isArray(config.team)) setTeam(config.team.filter(Boolean));
    
    // Services migration for legacy data: Ensure categories are mapped
    if (Array.isArray(config.services)) {
        const migratedServices = config.services.map(s => {
             if (!s) return null;
             // Find default definition to recover category if lost
             const defaultDef = SERVICES.find(def => def.iconName === s.iconName);
             return {
                ...s,
                category: s.category || defaultDef?.category || Category.BRAND
             };
        }).filter(Boolean) as ServiceItem[];
        setServices(migratedServices);
    }

    if (config.heroImage) setHeroImage(config.heroImage);
    if (config.heroVideo !== undefined) setHeroVideo(config.heroVideo);

    if (config.heroTitleImage !== undefined) setHeroTitleImage(config.heroTitleImage);
    if (config.heroTitleImageScale !== undefined) setHeroTitleImageScale(config.heroTitleImageScale);

    if (config.heroFooterImage !== undefined) setHeroFooterImage(config.heroFooterImage);
    if (config.heroFooterImageScale !== undefined) setHeroFooterImageScale(config.heroFooterImageScale);
    
    if (config.aboutHeroImage) setAboutHeroImage(config.aboutHeroImage);
    if (config.aboutFooterImage !== undefined) setAboutFooterImage(config.aboutFooterImage);
    if (config.aboutFooterImageScale !== undefined) setAboutFooterImageScale(config.aboutFooterImageScale);

    if (Array.isArray(config.introLogos)) setIntroLogos(config.introLogos);
    
    if (config.clientLogos !== undefined) setClientLogos(config.clientLogos);
    if (config.clientLogosScale !== undefined) setClientLogosScale(config.clientLogosScale);
    
    if (Array.isArray(config.footerLogos)) setFooterLogos(config.footerLogos);
    if (config.wechatQrCode !== undefined) setWechatQrCode(config.wechatQrCode);
    if (config.backgroundMusicUrl !== undefined) setBackgroundMusicUrl(config.backgroundMusicUrl);

    if (config.sectionBackgrounds) setSectionBackgrounds(config.sectionBackgrounds);
    if (config.textContent) {
      // Merge defaults with loaded content to ensure no keys are missing
      setTextContent(prev => ({ ...prev, ...config.textContent }));
    }
  };

  // 1. Load Data Strategy: Force Load from config.json
  // We explicitly IGNORE LocalStorage to force the site to match the config file on every reload.
  useEffect(() => {
    const loadData = async () => {
      try {
        // Add cache busting to prevent browser caching of the json file
        const response = await fetch(`/config.json?t=${Date.now()}`);
        if (response.ok) {
          const config: AppConfig = await response.json();
          console.log("Configuration forced from config.json");
          applyConfig(config);
        } else {
          console.warn("config.json not found, falling back to defaults");
        }
      } catch (error) {
        console.error("Failed to load config.json", error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadData();
  }, []);

  // 2. Auto-Save Strategy: Still save to LocalStorage for Edit Mode continuity
  // but note that refreshing will wipe these changes unless exported to config.json
  useEffect(() => {
    if (!isInitialized) return;

    const currentConfig: AppConfig = {
      heroImage,
      heroVideo,
      heroTitleImage,
      heroTitleImageScale,
      heroFooterImage,
      heroFooterImageScale,
      aboutHeroImage,
      aboutFooterImage,
      aboutFooterImageScale,
      introLogos,
      clientLogos,
      clientLogosScale,
      sectionBackgrounds,
      services,
      portfolio,
      team,
      footerLogos,
      textContent,
      wechatQrCode,
      backgroundMusicUrl
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));
      setHasLocalChanges(true);
    } catch (e) {
      console.error("Failed to auto-save to local storage", e);
    }

  }, [
    // Dependency array includes ALL state variables that need saving
    portfolio, team, services, heroImage, heroVideo, heroTitleImage, heroTitleImageScale, 
    heroFooterImage, heroFooterImageScale, aboutHeroImage, aboutFooterImage, aboutFooterImageScale,
    introLogos, clientLogos, clientLogosScale, footerLogos, 
    wechatQrCode, backgroundMusicUrl, sectionBackgrounds, textContent, 
    isInitialized
  ]);

  const toggleEditing = () => setIsEditing(prev => !prev);

  // Text Content Update
  const updateTextContent = (key: string, value: string) => {
    setTextContent(prev => ({ ...prev, [key]: value }));
  };

  // Portfolio CRUD
  const addPortfolioItem = (category: Category = Category.BRAND) => {
    // Generate a new item using the provided category
    const newItem: PortfolioItem = {
      id: Date.now(),
      title: '新案例标题',
      category: category === Category.ALL ? Category.BRAND : category,
      imageUrl: 'https://picsum.photos/800/600?grayscale', 
      description: '请输入案例描述...',
      gallery: []
    };
    setPortfolio(prev => [newItem, ...prev]);
    return newItem; // Return so the UI can auto-open it
  };

  const removePortfolioItem = (id: number) => {
    if (confirm('确定要删除这个案例吗？')) {
      setPortfolio(prev => prev.filter(item => item.id !== id));
    }
  };

  const updatePortfolioItem = (id: number, field: keyof PortfolioItem, value: any) => {
    setPortfolio(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const reorderPortfolioItem = (id: number, direction: 'prev' | 'next', category: Category) => {
     setPortfolio(prev => {
        const filteredItems = prev
            .map((item, idx) => ({ ...item, originalIdx: idx }))
            .filter(item => category === Category.ALL || item.category === category);
        
        const currentFilteredIdx = filteredItems.findIndex(item => item.id === id);
        if (currentFilteredIdx === -1) return prev;

        const targetFilteredIdx = direction === 'prev' ? currentFilteredIdx - 1 : currentFilteredIdx + 1;
        if (targetFilteredIdx < 0 || targetFilteredIdx >= filteredItems.length) return prev;

        const sourceOriginalIdx = filteredItems[currentFilteredIdx].originalIdx;
        const targetOriginalIdx = filteredItems[targetFilteredIdx].originalIdx;

        const newArr = [...prev];
        [newArr[sourceOriginalIdx], newArr[targetOriginalIdx]] = [newArr[targetOriginalIdx], newArr[sourceOriginalIdx]];
        return newArr;
     });
  };

  const updatePortfolioCategoryOrder = (category: Category, newItems: PortfolioItem[]) => {
    setPortfolio(prev => {
      // 1. Keep items that do NOT match the current category (preserving their original relative order)
      const otherItems = prev.filter(item => item.category !== category);
      
      // 2. Append the newly reordered items for this category
      // Note: This effectively moves this category's block to the end of the data array,
      // but visually they are grouped by service/category anyway so it doesn't matter.
      return [...otherItems, ...newItems];
    });
  };

  const addToGallery = (id: number, imageUrl: string) => {
    setPortfolio(prev => prev.map(item => {
      if (item.id === id) {
        const currentGallery = item.gallery || [];
        return { ...item, gallery: [...currentGallery, imageUrl] };
      }
      return item;
    }));
  };

  const removeFromGallery = (id: number, index: number) => {
    setPortfolio(prev => prev.map(item => {
      if (item.id === id && item.gallery) {
        const newGallery = [...item.gallery];
        newGallery.splice(index, 1);
        return { ...item, gallery: newGallery };
      }
      return item;
    }));
  };

  const reorderGalleryItem = (id: number, index: number, direction: 'left' | 'right') => {
    setPortfolio(prev => prev.map(item => {
        if (item.id === id && item.gallery) {
            const newGallery = [...item.gallery];
            const newIndex = direction === 'left' ? index - 1 : index + 1;
            
            if (newIndex >= 0 && newIndex < newGallery.length) {
                [newGallery[index], newGallery[newIndex]] = [newGallery[newIndex], newGallery[index]];
                return { ...item, gallery: newGallery };
            }
        }
        return item;
    }));
  };

  const updateGalleryOrder = (id: number, newGallery: string[]) => {
    updatePortfolioItem(id, 'gallery', newGallery);
  };

  // Team CRUD
  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now(),
      name: '姓名',
      role: '职位',
      image: 'https://picsum.photos/200/200?grayscale'
    };
    setTeam(prev => [newMember, ...prev]);
  };

  const removeTeamMember = (id: number) => {
    if (confirm('确定要删除这位成员吗？')) {
      setTeam(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateTeamMember = (id: number, field: keyof TeamMember, value: string) => {
    setTeam(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const reorderTeamMember = (id: number, direction: 'left' | 'right') => {
    setTeam(prev => {
      const index = prev.findIndex(item => item.id === id);
      if (index === -1) return prev;
      const newIndex = direction === 'left' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const newArr = [...prev];
      [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
      return newArr;
    });
  };

  // Services CRUD
  const addService = () => {
    const newService: ServiceItem = {
      id: Date.now(),
      title: '新服务项目',
      description: '服务描述...',
      iconName: 'Star',
      category: Category.BRAND
    };
    setServices(prev => [...prev, newService]);
  };

  const removeService = (id: number) => {
    if (confirm('确定要删除这个服务项目吗？')) {
      setServices(prev => prev.filter(item => item.id !== id));
    }
  };

  const updateService = (id: number, field: keyof ServiceItem, value: string) => {
    setServices(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateHeroImage = (url: string) => setHeroImage(url);
  const updateHeroVideo = (url: string) => setHeroVideo(url);
  const updateHeroTitleImage = (url: string) => setHeroTitleImage(url);
  const updateHeroTitleImageScale = (scale: number) => setHeroTitleImageScale(scale);
  const updateHeroFooterImage = (url: string) => setHeroFooterImage(url);
  const updateHeroFooterImageScale = (scale: number) => setHeroFooterImageScale(scale);

  const updateAboutHeroImage = (url: string) => setAboutHeroImage(url);
  const updateAboutFooterImage = (url: string) => setAboutFooterImage(url);
  const updateAboutFooterImageScale = (scale: number) => setAboutFooterImageScale(scale);

  const updateIntroLogo = (index: number, url: string) => {
    setIntroLogos(prev => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  const updateClientLogos = (url: string) => setClientLogos(url);
  const updateClientLogosScale = (scale: number) => setClientLogosScale(scale);

  const updateFooterLogo = (index: number, url: string) => {
    setFooterLogos(prev => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  const updateWechatQrCode = (url: string) => setWechatQrCode(url);
  const updateBackgroundMusicUrl = (url: string) => setBackgroundMusicUrl(url);

  const updateSectionBackground = (section: string, url: string) => {
    setSectionBackgrounds(prev => ({ ...prev, [section]: url }));
  };

  const resetData = () => {
    if (confirm('确定要清除所有本地修改并还原到初始配置吗？此操作无法撤销。')) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  const handleFileUpload = (file: File): Promise<string> => {
    return Promise.reject("File upload not supported in this mode");
  };

  const exportConfig = () => {
    const config: AppConfig = {
      heroImage,
      heroVideo,
      heroTitleImage,
      heroTitleImageScale,
      heroFooterImage,
      heroFooterImageScale,
      aboutHeroImage,
      aboutFooterImage,
      aboutFooterImageScale,
      introLogos,
      clientLogos,
      clientLogosScale,
      sectionBackgrounds,
      services,
      portfolio,
      team,
      footerLogos,
      textContent,
      wechatQrCode,
      backgroundMusicUrl
    };
    return JSON.stringify(config, null, 2);
  };

  const importConfig = (jsonString: string) => {
    try {
      const config = JSON.parse(jsonString);
      if (typeof config !== 'object' || !config) {
         throw new Error("Invalid JSON format");
      }
      
      applyConfig(config);
      setHasLocalChanges(true);
      return { success: true };
    } catch (e: any) {
      console.error("Import failed:", e);
      return { success: false, error: e.message || "Invalid JSON" };
    }
  };

  return (
    <ContentContext.Provider value={{
      isEditing,
      toggleEditing,
      textContent,
      updateTextContent,
      portfolio,
      addPortfolioItem,
      removePortfolioItem,
      updatePortfolioItem,
      reorderPortfolioItem,
      updatePortfolioCategoryOrder,
      addToGallery,
      removeFromGallery,
      reorderGalleryItem,
      updateGalleryOrder,
      team,
      addTeamMember,
      removeTeamMember,
      updateTeamMember,
      reorderTeamMember,
      services,
      addService,
      removeService,
      updateService,
      heroImage,
      updateHeroImage,
      heroVideo,
      updateHeroVideo,
      heroTitleImage,
      updateHeroTitleImage,
      heroTitleImageScale,
      updateHeroTitleImageScale,
      heroFooterImage,
      updateHeroFooterImage,
      heroFooterImageScale,
      updateHeroFooterImageScale,
      aboutHeroImage,
      updateAboutHeroImage,
      aboutFooterImage,
      updateAboutFooterImage,
      aboutFooterImageScale,
      updateAboutFooterImageScale,
      introLogos,
      updateIntroLogo,
      clientLogos,
      updateClientLogos,
      clientLogosScale,
      updateClientLogosScale,
      footerLogos,
      updateFooterLogo,
      wechatQrCode,
      updateWechatQrCode,
      backgroundMusicUrl,
      updateBackgroundMusicUrl,
      sectionBackgrounds,
      updateSectionBackground,
      resetData,
      handleFileUpload,
      exportConfig,
      importConfig,
      hasLocalChanges
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};