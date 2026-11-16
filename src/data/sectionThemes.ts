export type SectionThemeId =
  | 'obsidian-gold'
  | 'terracotta-espresso'
  | 'sapphire-mist'
  | 'bordeaux-rose'
  | 'emerald-olive';

export interface SectionThemeImages {
  heroBanner: string;
  bestsellersBanner: string;
  newArrivalsBanner: string;
  lastChancesBanner: string;
  offerAccessories: string;
  offerKnitwear: string;
  offerEssentials: string;
  offerJackets: string;
  trendingDarkRomance: string;
  trendingFauxFur: string;
  trendingFormalCoords: string;
  trendingAnimalPrint: string;
}

export interface SectionThemePalette {
  pageBg: string;
  surfaceMuted: string;
  tickerBg: string;
  tickerText: string;
  flashBarBg: string;
  flashBarHoverBg: string;
  accent: string;
  accentHover: string;
  accentText: string;
  editorialWordmark: string;
  bannerHeadlineColor: string;
  bannerAccentColor: string;
  bannerEyebrowColor: string;
  bannerCtaBg: string;
  bannerCtaText: string;
  bannerScrimGradient: string;
  offerLightText: string;
  offerLightSubText: string;
  offerLightCtaText: string;
  lastChancesScrim: string;
  lastChancesInk: string;
  lastChancesCtaBg: string;
  lastChancesCtaText: string;
}

export interface SectionColorTheme {
  id: SectionThemeId;
  folder: string;
  name: string;
  subtitle: string;
  swatchPrimary: string;
  swatchSecondary: string;
  swatchSurface: string;
  palette: SectionThemePalette;
  images: SectionThemeImages;
}

export const SECTION_COLOR_THEMES: SectionColorTheme[] = [
  {
    id: 'obsidian-gold',
    folder: '01-obsidian-gold',
    name: 'Obsidian & Gold',
    subtitle: 'Midnight Slate · Antique Brass',
    swatchPrimary: '#141312',
    swatchSecondary: '#d4af6a',
    swatchSurface: '#f8f6f1',
    palette: {
      pageBg: '#faf8f4',
      surfaceMuted: '#f1ede4',
      tickerBg: '#11100f',
      tickerText: '#e6c891',
      flashBarBg: '#141312',
      flashBarHoverBg: '#22201e',
      accent: '#181614',
      accentHover: '#302c28',
      accentText: '#f5efe6',
      editorialWordmark: '#c29b53',
      bannerHeadlineColor: '#f5efe6',
      bannerAccentColor: '#e6c891',
      bannerEyebrowColor: '#dfc085',
      bannerCtaBg: '#e6c891',
      bannerCtaText: '#141312',
      bannerScrimGradient: 'linear-gradient(to left, rgba(16,15,14,0.72), rgba(16,15,14,0.28), transparent)',
      offerLightText: '#f5efe6',
      offerLightSubText: '#e6c891',
      offerLightCtaText: '#e6c891',
      lastChancesScrim: 'rgba(14,13,12,0.42)',
      lastChancesInk: '#f7efe0',
      lastChancesCtaBg: '#e6c891',
      lastChancesCtaText: '#141312',
    },
    images: {
      heroBanner: '/assets/images/section-themes/01-obsidian-gold/hero-banner.jpg',
      bestsellersBanner: '/assets/images/section-themes/01-obsidian-gold/bestsellers-banner.jpg',
      newArrivalsBanner: '/assets/images/section-themes/01-obsidian-gold/arrivals-banner.jpg',
      lastChancesBanner: '/assets/images/section-themes/01-obsidian-gold/clearance-banner.jpg',
      offerAccessories: '/assets/images/section-themes/01-obsidian-gold/offer-accessories.jpg',
      offerKnitwear: '/assets/images/section-themes/01-obsidian-gold/offer-knitwear.jpg',
      offerEssentials: '/assets/images/section-themes/01-obsidian-gold/offer-essentials.jpg',
      offerJackets: '/assets/images/section-themes/01-obsidian-gold/offer-jackets.jpg',
      trendingDarkRomance: '/assets/images/section-themes/01-obsidian-gold/trending-dark-romance.jpg',
      trendingFauxFur: '/assets/images/section-themes/01-obsidian-gold/trending-faux-fur.jpg',
      trendingFormalCoords: '/assets/images/section-themes/01-obsidian-gold/trending-formal-coords.jpg',
      trendingAnimalPrint: '/assets/images/section-themes/01-obsidian-gold/trending-animal-print.jpg',
    },
  },
  {
    id: 'terracotta-espresso',
    folder: '02-terracotta-espresso',
    name: 'Terracotta & Espresso',
    subtitle: 'Sunlit Siena · Roast Cocoa',
    swatchPrimary: '#73301c',
    swatchSecondary: '#c76846',
    swatchSurface: '#fcf8f4',
    palette: {
      pageBg: '#fcf9f5',
      surfaceMuted: '#f4ebe2',
      tickerBg: '#26120c',
      tickerText: '#f2c18d',
      flashBarBg: '#2b150e',
      flashBarHoverBg: '#3e1f15',
      accent: '#6e2d1a',
      accentHover: '#873922',
      accentText: '#fdf8f3',
      editorialWordmark: '#b85a38',
      bannerHeadlineColor: '#2d150e',
      bannerAccentColor: '#6e2d1a',
      bannerEyebrowColor: '#5c2617',
      bannerCtaBg: '#6e2d1a',
      bannerCtaText: '#fdf8f3',
      bannerScrimGradient: 'linear-gradient(to left, rgba(250,239,229,0.52), transparent, transparent)',
      offerLightText: '#4a1d11',
      offerLightSubText: '#6e2d1a',
      offerLightCtaText: '#4a1d11',
      lastChancesScrim: 'rgba(252,245,238,0.58)',
      lastChancesInk: '#3d190e',
      lastChancesCtaBg: '#6e2d1a',
      lastChancesCtaText: '#fdf8f3',
    },
    images: {
      heroBanner: '/assets/images/section-themes/02-terracotta-espresso/hero-banner.jpg',
      bestsellersBanner: '/assets/images/section-themes/02-terracotta-espresso/bestsellers-banner.jpg',
      newArrivalsBanner: '/assets/images/section-themes/02-terracotta-espresso/arrivals-banner.jpg',
      lastChancesBanner: '/assets/images/section-themes/02-terracotta-espresso/clearance-banner.jpg',
      offerAccessories: '/assets/images/section-themes/02-terracotta-espresso/offer-accessories.jpg',
      offerKnitwear: '/assets/images/section-themes/02-terracotta-espresso/offer-knitwear.jpg',
      offerEssentials: '/assets/images/section-themes/02-terracotta-espresso/offer-essentials.jpg',
      offerJackets: '/assets/images/section-themes/02-terracotta-espresso/offer-jackets.jpg',
      trendingDarkRomance: '/assets/images/section-themes/02-terracotta-espresso/trending-dark-romance.jpg',
      trendingFauxFur: '/assets/images/section-themes/02-terracotta-espresso/trending-faux-fur.jpg',
      trendingFormalCoords: '/assets/images/section-themes/02-terracotta-espresso/trending-formal-coords.jpg',
      trendingAnimalPrint: '/assets/images/section-themes/02-terracotta-espresso/trending-animal-print.jpg',
    },
  },
  {
    id: 'sapphire-mist',
    folder: '03-sapphire-mist',
    name: 'Sapphire & Pearl Mist',
    subtitle: 'Midnight Cobalt · Parisian Stone',
    swatchPrimary: '#13294b',
    swatchSecondary: '#4b73ad',
    swatchSurface: '#f7f9fc',
    palette: {
      pageBg: '#f8fafd',
      surfaceMuted: '#ebf0f7',
      tickerBg: '#0c1729',
      tickerText: '#d6e4f7',
      flashBarBg: '#10213b',
      flashBarHoverBg: '#1a3257',
      accent: '#13294b',
      accentHover: '#1f3f70',
      accentText: '#f7faff',
      editorialWordmark: '#335a94',
      bannerHeadlineColor: '#0e1d36',
      bannerAccentColor: '#1a3d73',
      bannerEyebrowColor: '#254c87',
      bannerCtaBg: '#13294b',
      bannerCtaText: '#f7faff',
      bannerScrimGradient: 'linear-gradient(to left, rgba(235,241,248,0.52), transparent, transparent)',
      offerLightText: '#13294b',
      offerLightSubText: '#254c87',
      offerLightCtaText: '#13294b',
      lastChancesScrim: 'rgba(241,246,252,0.68)',
      lastChancesInk: '#0f2240',
      lastChancesCtaBg: '#13294b',
      lastChancesCtaText: '#f7faff',
    },
    images: {
      heroBanner: '/assets/images/section-themes/03-sapphire-mist/hero-banner.jpg',
      bestsellersBanner: '/assets/images/section-themes/03-sapphire-mist/bestsellers-banner.jpg',
      newArrivalsBanner: '/assets/images/section-themes/03-sapphire-mist/arrivals-banner.jpg',
      lastChancesBanner: '/assets/images/section-themes/03-sapphire-mist/clearance-banner.jpg',
      offerAccessories: '/assets/images/section-themes/03-sapphire-mist/offer-accessories.jpg',
      offerKnitwear: '/assets/images/section-themes/03-sapphire-mist/offer-knitwear.jpg',
      offerEssentials: '/assets/images/section-themes/03-sapphire-mist/offer-essentials.jpg',
      offerJackets: '/assets/images/section-themes/03-sapphire-mist/offer-jackets.jpg',
      trendingDarkRomance: '/assets/images/section-themes/03-sapphire-mist/trending-dark-romance.jpg',
      trendingFauxFur: '/assets/images/section-themes/03-sapphire-mist/trending-faux-fur.jpg',
      trendingFormalCoords: '/assets/images/section-themes/03-sapphire-mist/trending-formal-coords.jpg',
      trendingAnimalPrint: '/assets/images/section-themes/03-sapphire-mist/trending-animal-print.jpg',
    },
  },
  {
    id: 'bordeaux-rose',
    folder: '04-bordeaux-rose',
    name: 'Bordeaux & Rose Marble',
    subtitle: 'Deep Merlot · Blush Travertine',
    swatchPrimary: '#541a2e',
    swatchSecondary: '#a86477',
    swatchSurface: '#fcf7f9',
    palette: {
      pageBg: '#fcf8f9',
      surfaceMuted: '#f5eaee',
      tickerBg: '#290c17',
      tickerText: '#f5d0da',
      flashBarBg: '#36111f',
      flashBarHoverBg: '#4d192c',
      accent: '#541a2e',
      accentHover: '#6e233d',
      accentText: '#fdf7f9',
      editorialWordmark: '#964b61',
      bannerHeadlineColor: '#3b1120',
      bannerAccentColor: '#69213a',
      bannerEyebrowColor: '#752943',
      bannerCtaBg: '#541a2e',
      bannerCtaText: '#fdf7f9',
      bannerScrimGradient: 'linear-gradient(to left, rgba(250,238,242,0.52), transparent, transparent)',
      offerLightText: '#541a2e',
      offerLightSubText: '#752943',
      offerLightCtaText: '#541a2e',
      lastChancesScrim: 'rgba(252,244,247,0.68)',
      lastChancesInk: '#4a1527',
      lastChancesCtaBg: '#541a2e',
      lastChancesCtaText: '#fdf7f9',
    },
    images: {
      heroBanner: '/assets/images/section-themes/04-bordeaux-rose/hero-banner.jpg',
      bestsellersBanner: '/assets/images/section-themes/04-bordeaux-rose/bestsellers-banner.jpg',
      newArrivalsBanner: '/assets/images/section-themes/04-bordeaux-rose/arrivals-banner.jpg',
      lastChancesBanner: '/assets/images/section-themes/04-bordeaux-rose/clearance-banner.jpg',
      offerAccessories: '/assets/images/section-themes/04-bordeaux-rose/offer-accessories.jpg',
      offerKnitwear: '/assets/images/section-themes/04-bordeaux-rose/offer-knitwear.jpg',
      offerEssentials: '/assets/images/section-themes/04-bordeaux-rose/offer-essentials.jpg',
      offerJackets: '/assets/images/section-themes/04-bordeaux-rose/offer-jackets.jpg',
      trendingDarkRomance: '/assets/images/section-themes/04-bordeaux-rose/trending-dark-romance.jpg',
      trendingFauxFur: '/assets/images/section-themes/04-bordeaux-rose/trending-faux-fur.jpg',
      trendingFormalCoords: '/assets/images/section-themes/04-bordeaux-rose/trending-formal-coords.jpg',
      trendingAnimalPrint: '/assets/images/section-themes/04-bordeaux-rose/trending-animal-print.jpg',
    },
  },
  {
    id: 'emerald-olive',
    folder: '05-emerald-olive',
    name: 'Emerald & Burnished Olive',
    subtitle: 'Botanical Pine · Limestone Sage',
    swatchPrimary: '#14362a',
    swatchSecondary: '#8c7d48',
    swatchSurface: '#f7f9f6',
    palette: {
      pageBg: '#f8faf7',
      surfaceMuted: '#ebf0e9',
      tickerBg: '#0d1a14',
      tickerText: '#f0df99',
      flashBarBg: '#121c17',
      flashBarHoverBg: '#1c2b23',
      accent: '#14362a',
      accentHover: '#1f4f3e',
      accentText: '#f5efe6',
      editorialWordmark: '#998345',
      bannerHeadlineColor: '#14362a',
      bannerAccentColor: '#255442',
      bannerEyebrowColor: '#2b5243',
      bannerCtaBg: '#14362a',
      bannerCtaText: '#f5efe6',
      bannerScrimGradient: 'linear-gradient(to left, rgba(235,241,233,0.52), transparent, transparent)',
      offerLightText: '#14362a',
      offerLightSubText: '#255442',
      offerLightCtaText: '#14362a',
      lastChancesScrim: 'rgba(244,248,242,0.68)',
      lastChancesInk: '#123326',
      lastChancesCtaBg: '#14362a',
      lastChancesCtaText: '#f5efe6',
    },
    images: {
      heroBanner: '/assets/images/section-themes/05-emerald-olive/hero-banner.jpg',
      bestsellersBanner: '/assets/images/section-themes/05-emerald-olive/bestsellers-banner.jpg',
      newArrivalsBanner: '/assets/images/section-themes/05-emerald-olive/arrivals-banner.jpg',
      lastChancesBanner: '/assets/images/section-themes/05-emerald-olive/clearance-banner.jpg',
      offerAccessories: '/assets/images/section-themes/05-emerald-olive/offer-accessories.jpg',
      offerKnitwear: '/assets/images/section-themes/05-emerald-olive/offer-knitwear.jpg',
      offerEssentials: '/assets/images/section-themes/05-emerald-olive/offer-essentials.jpg',
      offerJackets: '/assets/images/section-themes/05-emerald-olive/offer-jackets.jpg',
      trendingDarkRomance: '/assets/images/section-themes/05-emerald-olive/trending-dark-romance.jpg',
      trendingFauxFur: '/assets/images/section-themes/05-emerald-olive/trending-faux-fur.jpg',
      trendingFormalCoords: '/assets/images/section-themes/05-emerald-olive/trending-formal-coords.jpg',
      trendingAnimalPrint: '/assets/images/section-themes/05-emerald-olive/trending-animal-print.jpg',
    },
  },
];

export const DEFAULT_THEME_ID: SectionThemeId = 'obsidian-gold';
