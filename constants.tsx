import React from 'react';
import { Category, PortfolioItem, ServiceItem, TeamMember } from './types';

export const CONTACT_INFO = {
  phone1: '15985194981',
  phone2: '13984832580',
  companyName: '贵州译道佳华文化发展有限公司',
  address: '贵州省贵阳市'
};

export const INTRO_CONFIG = {
  logoImage: "", // Leave empty to show text "YIDAO JIAHUA", or put an image URL
  subText: "Cinematic & Design"
};

export const NAV_LINKS = [
  { label: '首页', href: '#hero' },
  { label: '关于我们', href: '#about' },
  { label: '业务与案例', href: '#services' }, // Combined link
  { label: '联系我们', href: '#contact' },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 1,
    title: '品牌平面设计及规划',
    description: 'VIS视觉品牌设计、室内外文化墙宣传展板、创意海报、画册制作。',
    iconName: 'Palette',
    category: Category.BRAND
  },
  {
    id: 2,
    title: '影视拍摄及后期',
    description: '企业宣传片、微电影、广告片录制、后期剪辑、影视调色、航拍。',
    iconName: 'Clapperboard',
    category: Category.VIDEO
  },
  {
    id: 3,
    title: '原创独立音乐制作',
    description: '【龙予成林音乐工作室】专属BGM制作、游戏编曲、广告片编曲录制。',
    iconName: 'Music',
    category: Category.MUSIC
  },
  {
    id: 4,
    title: '线下活动搭建',
    description: '活动现场视觉规划及搭建、开业典礼、论坛会议、年会策划执行。',
    iconName: 'Tent',
    category: Category.EVENT
  },
  {
    id: 5,
    title: '广告物料 & 印刷',
    description: '自有印刷厂房，提供广告物料供应安装、纸质印刷品制作一站式服务。',
    iconName: 'Printer',
    category: Category.PRINT
  }
];

export const PORTFOLIO_DATA: PortfolioItem[] = [
  // Branding Cases
  {
    id: 1,
    title: '未来方舟-甜蜜小镇',
    category: Category.BRAND,
    imageUrl: 'https://picsum.photos/800/600?random=1',
    gallery: [
      'https://picsum.photos/800/600?random=101',
      'https://picsum.photos/800/600?random=102',
      'https://picsum.photos/800/600?random=103'
    ],
    description: '小区对外形象VI设计及施工图展示，打造充满幸福感的城市。'
  },
  {
    id: 2,
    title: '贵州省图书馆“贵图猫”',
    category: Category.BRAND,
    imageUrl: 'https://picsum.photos/800/600?random=2',
    gallery: [
      'https://picsum.photos/800/600?random=201',
      'https://picsum.photos/800/600?random=202'
    ],
    description: '形象IP设计规划，结合水族文字与民族服饰元素。'
  },
  {
    id: 3,
    title: '中国工商银行',
    category: Category.BRAND,
    imageUrl: 'https://picsum.photos/800/600?random=3',
    description: '中西支行专属VI设计、创意海报设计及活动物料。'
  },
  {
    id: 4,
    title: '抗疫公益海报',
    category: Category.BRAND,
    imageUrl: 'https://picsum.photos/800/600?random=4',
    description: '登上贵州“动静APP”登录首页，传递正能量。'
  },
  
  // Video Cases (Awaking Lion)
  {
    id: 5,
    title: '中国南方电网',
    category: Category.VIDEO,
    imageUrl: 'https://picsum.photos/800/600?random=5',
    description: '“中国十大国之重器”——伏羲芯片宣传片拍摄。',
    subBrand: '醒狮影视'
  },
  {
    id: 6,
    title: '贵州机车节',
    category: Category.VIDEO,
    imageUrl: 'https://picsum.photos/800/600?random=6',
    description: '2020激情贵州汽车摩托车系列赛宣传片及后期制作。',
    subBrand: '醒狮影视'
  },
  {
    id: 7,
    title: '丹寨万达小镇',
    category: Category.VIDEO,
    imageUrl: 'https://picsum.photos/800/600?random=7',
    description: '苗年宣传片，获视频新星榜TOP20。',
    subBrand: '醒狮影视'
  },
  {
    id: 8,
    title: '《军号1979》',
    category: Category.VIDEO,
    imageUrl: 'https://picsum.photos/800/600?random=8',
    description: '纪录片拍摄及后期制作，传承红色基因。',
    subBrand: '醒狮影视'
  },

  // Event Cases
  {
    id: 9,
    title: '生态文明贵阳国际论坛',
    category: Category.EVENT,
    imageUrl: 'https://picsum.photos/800/600?random=9',
    description: '2018年会线下活动搭建与执行。'
  },
  {
    id: 10,
    title: '中国国际大数据产业博览会',
    category: Category.EVENT,
    imageUrl: 'https://picsum.photos/800/600?random=10',
    gallery: [
        'https://picsum.photos/800/600?random=1001',
        'https://picsum.photos/800/600?random=1002',
    ],
    description: '数博会分论坛现场视觉规划、透明冰屏应用及搭建。'
  },
  {
    id: 11,
    title: '贵州茶叶营销发展论坛',
    category: Category.EVENT,
    imageUrl: 'https://picsum.photos/800/600?random=11',
    description: '大型会议舞台搭建、灯光音响配置。'
  },

  // Music Cases
  {
    id: 12,
    title: '企业专属编曲',
    category: Category.MUSIC,
    imageUrl: 'https://picsum.photos/800/600?random=12',
    description: '为各大企业定制专属BGM及歌曲制作。',
    subBrand: '龙予成林音乐'
  },

  // Print Cases
  {
    id: 13,
    title: '党建文化墙',
    category: Category.PRINT,
    imageUrl: 'https://picsum.photos/800/600?random=13',
    description: '贵州农商银行党建整改事项及宣传物料规划制作。'
  },
  {
    id: 14,
    title: '自有印刷厂房',
    category: Category.PRINT,
    imageUrl: 'https://picsum.photos/800/600?random=14',
    description: '配备大型户外喷绘机、UV机，提供高效物料生产。'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  { id: 1, name: '导演/品牌设计师', role: '主理人', image: 'https://picsum.photos/200/200?random=20' },
  { id: 2, name: '摄影指导', role: '航拍/主理人', image: 'https://picsum.photos/200/200?random=21' },
  { id: 3, name: '独立音乐制作人', role: '主理人', image: 'https://picsum.photos/200/200?random=22' },
];