import { ThemeId } from './themes';

export type SlideType =
  | 'hero-title'
  | 'section-divider'
  | 'agenda'
  | 'bullet-image'
  | 'two-column'
  | 'comparison'
  | 'kpi-dashboard'
  | 'process-flow'
  | 'timeline'
  | 'quote'
  | 'closing'
  | 'diagram';

export type SlideLayout =
  | 'title-hero-left'
  | 'title-hero-right'
  | 'dark-accent'
  | 'agenda-clean'
  | 'bullets-with-side-image'
  | 'two-column-explainer'
  | 'comparison-split'
  | 'stat-cards-grid'
  | 'horizontal-process'
  | 'milestone-timeline'
  | 'quote-impact'
  | 'closing-contact'
  | 'architecture-diagram';

export type SlidePurpose =
  | 'intro'
  | 'section-header'
  | 'agenda'
  | 'content'
  | 'data'
  | 'process'
  | 'timeline'
  | 'quote'
  | 'comparison'
  | 'closing';

export type ContentType =
  | 'business'
  | 'educational'
  | 'research'
  | 'sales'
  | 'product'
  | 'proposal';

export type Tone =
  | 'professional'
  | 'conversational'
  | 'inspiring'
  | 'analytical'
  | 'persuasive';

export type DeckStatus = 'draft' | 'ready' | 'exporting' | 'error';

export interface SlideElement {
  id: string;
  type: 'heading' | 'subheading' | 'body' | 'bullet-list' | 'kpi' | 'image' | 'quote' | 'label' | 'number';
  content: string | string[];
  style?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    align?: 'left' | 'center' | 'right';
  };
}

export interface KpiItem {
  value: string;
  label: string;
  trend?: string;
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

export interface TimelineMilestone {
  date: string;
  title: string;
  description: string;
}

export interface ComparisonColumn {
  title: string;
  items: string[];
  highlight?: boolean;
}

export interface Slide {
  id: string;
  type: SlideType;
  layout: SlideLayout;
  purpose: SlidePurpose;
  title: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
  quote?: string;
  quoteAuthor?: string;
  kpis?: KpiItem[];
  processSteps?: ProcessStep[];
  timelineMilestones?: TimelineMilestone[];
  comparisonColumns?: ComparisonColumn[];
  imageUrl?: string;
  imagePrompt?: string;
  backgroundStyle?: string;
  notes?: string;
  accentColor?: string;
}

export interface DeckJson {
  slides: Slide[];
  themeId: ThemeId;
}

export interface Deck {
  id: string;
  title: string;
  prompt?: string;
  audience?: string;
  tone?: Tone;
  contentType?: ContentType;
  slideCount: number;
  themeId: ThemeId;
  status: DeckStatus;
  deckJson: DeckJson;
  createdAt: Date;
  updatedAt: Date;
}

export interface OutlineSlide {
  id: string;
  title: string;
  purpose: SlidePurpose;
  layout: SlideLayout;
  contentIntent: string;
  hasVisual: boolean;
}
