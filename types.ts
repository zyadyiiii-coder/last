import React from 'react';

export enum Category {
  ALL = 'ALL',
  BRAND = 'BRAND',
  VIDEO = 'VIDEO',
  MUSIC = 'MUSIC',
  EVENT = 'EVENT',
  PRINT = 'PRINT'
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  iconName: string;
  category: Category; // Linked Category for portfolio filtering
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: Category;
  imageUrl: string;
  gallery?: string[];
  description: string;
  subBrand?: string;
  videoUrl?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface TextContent {
  [key: string]: string;
}

export interface AppConfig {
  heroImage: string;
  heroVideo?: string; // New field for background video
  heroTitleImage: string;
  heroTitleImageScale: number;
  heroFooterImage: string; 
  heroFooterImageScale: number; 
  aboutHeroImage: string;
  aboutFooterImage?: string; 
  aboutFooterImageScale?: number;
  introLogos: string[];
  clientLogos: string;
  clientLogosScale: number;
  sectionBackgrounds: Record<string, string>;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  team: TeamMember[];
  footerLogos: string[];
  textContent: TextContent;
  wechatQrCode: string;
  backgroundMusicUrl: string;
}