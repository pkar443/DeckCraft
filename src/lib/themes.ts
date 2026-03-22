export type ThemeId = 'cobalt' | 'sand' | 'aurora';

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  slideBg: string;
  accent: string;
  accentSoft: string;
  primaryText: string;
  secondaryText: string;
  headingFont: string;
  preview: string;
}

export const THEMES: Record<ThemeId, Theme> = {
  cobalt: {
    id: 'cobalt',
    name: 'Modern Cobalt',
    description: 'Clean & Professional',
    slideBg: '#F8FAFF',
    accent: '#2563EB',
    accentSoft: '#DBEAFE',
    primaryText: '#0F172A',
    secondaryText: '#475569',
    headingFont: 'Fraunces',
    preview: 'linear-gradient(135deg, #F8FAFF 0%, #DBEAFE 100%)',
  },
  sand: {
    id: 'sand',
    name: 'Warm Sand',
    description: 'Warm & Inviting',
    slideBg: '#FAF7F2',
    accent: '#B45309',
    accentSoft: '#FEF3C7',
    primaryText: '#1C1917',
    secondaryText: '#57534E',
    headingFont: 'Fraunces',
    preview: 'linear-gradient(135deg, #FAF7F2 0%, #FEF3C7 100%)',
  },
  aurora: {
    id: 'aurora',
    name: 'Graphite Aurora',
    description: 'Dark & Cinematic',
    slideBg: '#0D1117',
    accent: '#34D399',
    accentSoft: '#064E3B',
    primaryText: '#F1F5F9',
    secondaryText: '#94A3B8',
    headingFont: 'Fraunces',
    preview: 'linear-gradient(135deg, #0D1117 0%, #064E3B 100%)',
  },
};
