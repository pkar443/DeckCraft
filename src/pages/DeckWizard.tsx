import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowLeft, ArrowRight, Upload, RefreshCw,
  Check, Loader2, ChevronDown, X, Wand2, FileText
} from 'lucide-react';
import { useDeckStore } from '@/lib/store';
import { Deck, OutlineSlide, ContentType, Tone, SlideType, SlideLayout, SlidePurpose } from '@/lib/schema';
import { ThemeId, THEMES } from '@/lib/themes';
import { SAMPLE_DECKS } from '@/lib/sample-data';

// ─── Step 1: Prompt Form ─────────────────────────────────────────────────────

interface Step1Data {
  prompt: string;
  audience: string;
  tone: Tone;
  contentType: ContentType;
  slideCount: number;
  themeId: ThemeId;
  aiVisuals: boolean;
  uploadedFile?: File;
}

const CONTENT_TYPES: { value: ContentType; label: string; emoji: string }[] = [
  { value: 'business', label: 'Business', emoji: '💼' },
  { value: 'educational', label: 'Educational', emoji: '🎓' },
  { value: 'research', label: 'Research', emoji: '🔬' },
  { value: 'sales', label: 'Sales', emoji: '🚀' },
  { value: 'product', label: 'Product', emoji: '✨' },
  { value: 'proposal', label: 'Proposal', emoji: '📋' },
];

const TONES: { value: Tone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'inspiring', label: 'Inspiring' },
  { value: 'analytical', label: 'Analytical' },
  { value: 'persuasive', label: 'Persuasive' },
];

function Step1Form({ data, onChange, onNext }: {
  data: Step1Data;
  onChange: (d: Partial<Step1Data>) => void;
  onNext: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const canProceed = data.prompt.trim().length > 10;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 700, color: '#F8FAFF', marginBottom: '8px' }}>
        Describe your presentation
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', marginBottom: '36px' }}>
        The more detail you provide, the better your deck will be.
      </p>

      {/* Prompt */}
      <div className="mb-6">
        <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Topic / Prompt *
        </label>
        <textarea
          value={data.prompt}
          onChange={e => onChange({ prompt: e.target.value })}
          placeholder="e.g. 'Create a product launch presentation for our new AI analytics platform targeting mid-market B2B companies. Include market opportunity, product features, pricing, and next steps.'"
          rows={4}
          className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#F8FAFF', lineHeight: '1.6' }}
          onFocus={e => e.currentTarget.style.border = '1px solid rgba(37,99,235,0.5)'}
          onBlur={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.09)'}
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{data.prompt.length} characters</span>
        </div>
      </div>

      {/* Audience + Tone row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Target Audience
          </label>
          <input
            type="text"
            value={data.audience}
            onChange={e => onChange({ audience: e.target.value })}
            placeholder="e.g. Executive team, investors..."
            className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#F8FAFF' }}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Tone
          </label>
          <div className="relative">
            <select
              value={data.tone}
              onChange={e => onChange({ tone: e.target.value as Tone })}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none appearance-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#F8FAFF' }}>
              {TONES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.4)' }} />
          </div>
        </div>
      </div>

      {/* Content type */}
      <div className="mb-6">
        <label className="block text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Content Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CONTENT_TYPES.map(ct => (
            <button
              key={ct.value}
              onClick={() => onChange({ contentType: ct.value })}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: data.contentType === ct.value ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${data.contentType === ct.value ? 'rgba(37,99,235,0.5)' : 'rgba(255,255,255,0.08)'}`,
                color: data.contentType === ct.value ? '#60A5FA' : 'rgba(255,255,255,0.65)',
              }}>
              <span>{ct.emoji}</span>
              {ct.label}
            </button>
          ))}
        </div>
      </div>

      {/* Slide count + Theme row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Slide Count
          </label>
          <div className="flex items-center gap-3">
            <button onClick={() => onChange({ slideCount: Math.max(3, data.slideCount - 1) })}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-light transition-all"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFF' }}>
              −
            </button>
            <span className="text-xl font-bold min-w-[40px] text-center" style={{ color: '#F8FAFF', fontFamily: 'JetBrains Mono, monospace' }}>
              {data.slideCount}
            </span>
            <button onClick={() => onChange({ slideCount: Math.min(20, data.slideCount + 1) })}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-light transition-all"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFF' }}>
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
            AI Visuals
          </label>
          <div className="flex items-center gap-3 pt-1.5">
            <button
              onClick={() => onChange({ aiVisuals: !data.aiVisuals })}
              className="relative w-12 h-6 rounded-full transition-all"
              style={{ background: data.aiVisuals ? '#2563EB' : 'rgba(255,255,255,0.15)' }}>
              <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: data.aiVisuals ? '26px' : '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
            </button>
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {data.aiVisuals ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>

      {/* Theme picker */}
      <div className="mb-6">
        <label className="block text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Theme
        </label>
        <div className="grid grid-cols-3 gap-3">
          {Object.values(THEMES).map(theme => (
            <button
              key={theme.id}
              onClick={() => onChange({ themeId: theme.id })}
              className="relative rounded-xl overflow-hidden transition-all"
              style={{
                border: `2px solid ${data.themeId === theme.id ? '#2563EB' : 'rgba(255,255,255,0.08)'}`,
              }}>
              <div className="aspect-video" style={{ background: theme.preview }} />
              <div className="px-3 py-2 text-left" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="text-xs font-bold" style={{ color: '#F8FAFF' }}>{theme.name}</div>
                <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{theme.description}</div>
              </div>
              {data.themeId === theme.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#2563EB' }}>
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* File upload */}
      <div className="mb-8">
        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.pptx" className="hidden"
          onChange={e => onChange({ uploadedFile: e.target.files?.[0] })} />
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full py-4 rounded-xl border-dashed flex items-center justify-center gap-3 transition-all"
          style={{ borderWidth: '2px', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.4)'; e.currentTarget.style.color = '#60A5FA'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
          <Upload className="w-4 h-4" />
          <span className="text-sm">
            {data.uploadedFile ? `📎 ${data.uploadedFile.name}` : 'Upload reference file (optional) — PDF, DOCX, TXT'}
          </span>
          {data.uploadedFile && (
            <button onClick={e => { e.stopPropagation(); onChange({ uploadedFile: undefined }); }}
              className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          )}
        </button>
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all"
        style={{
          background: canProceed ? 'linear-gradient(135deg, #2563EB, #7C3AED)' : 'rgba(255,255,255,0.08)',
          color: canProceed ? '#fff' : 'rgba(255,255,255,0.3)',
          cursor: canProceed ? 'pointer' : 'not-allowed',
        }}>
        <Sparkles className="w-4 h-4" />
        Generate outline
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Step 2: Outline Review ───────────────────────────────────────────────────

const PURPOSE_COLORS: Record<string, string> = {
  intro: '#60A5FA',
  'section-header': '#A78BFA',
  agenda: '#34D399',
  content: '#94A3B8',
  data: '#F59E0B',
  process: '#22D3EE',
  timeline: '#F472B6',
  quote: '#FB923C',
  comparison: '#A3E635',
  closing: '#60A5FA',
};

function Step2Outline({ outline, isLoading, onRegenerate, onAccept, onEditTitle }: {
  outline: OutlineSlide[];
  isLoading: boolean;
  onRegenerate: () => void;
  onAccept: () => void;
  onEditTitle: (id: string, title: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 700, color: '#F8FAFF', marginBottom: '6px' }}>
            Review your outline
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px' }}>
            Edit slide titles or regenerate the entire outline
          </p>
        </div>
        <button onClick={onRegenerate} disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Regenerate
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl shimmer" style={{ background: 'rgba(255,255,255,0.04)', animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      ) : (
        <div className="space-y-2 mb-8">
          {outline.map((slide, i) => (
            <motion.div key={slide.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 p-4 rounded-xl group"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-xs font-mono font-bold flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              
              {editingId === slide.id ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={() => { onEditTitle(slide.id, editValue); setEditingId(null); }}
                  onKeyDown={e => { if (e.key === 'Enter') { onEditTitle(slide.id, editValue); setEditingId(null); } }}
                  className="flex-1 bg-transparent outline-none text-sm font-semibold"
                  style={{ color: '#F8FAFF' }}
                />
              ) : (
                <span
                  className="flex-1 text-sm font-semibold cursor-text"
                  style={{ color: '#F8FAFF' }}
                  onClick={() => { setEditingId(slide.id); setEditValue(slide.title); }}>
                  {slide.title}
                </span>
              )}

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize"
                  style={{
                    background: `${PURPOSE_COLORS[slide.purpose] || '#94A3B8'}18`,
                    color: PURPOSE_COLORS[slide.purpose] || '#94A3B8',
                  }}>
                  {slide.purpose.replace('-', ' ')}
                </span>
                <span className="text-[11px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: 'rgba(255,255,255,0.3)' }}>
                  click to edit
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <button onClick={onAccept} disabled={isLoading}
        className="w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2"
        style={{
          background: isLoading ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #2563EB, #7C3AED)',
          color: isLoading ? 'rgba(255,255,255,0.4)' : '#fff',
        }}>
        <Check className="w-4 h-4" />
        Accept & generate full deck
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Step 3: Generation Progress ─────────────────────────────────────────────

const STAGES = [
  { id: 'outline', label: 'Outline', desc: 'Structuring your presentation' },
  { id: 'content', label: 'Content', desc: 'Writing slide content' },
  { id: 'visuals', label: 'Visuals', desc: 'Planning visual elements' },
  { id: 'fitting', label: 'Fitting', desc: 'Optimizing layout & spacing' },
];

function Step3Progress({ currentStage, onComplete }: { currentStage: number; onComplete: () => void }) {
  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="mb-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
          <Sparkles className="w-7 h-7 text-white" />
        </motion.div>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 700, color: '#F8FAFF', marginBottom: '8px' }}>
          Building your deck...
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px' }}>
          {currentStage < STAGES.length ? STAGES[currentStage].desc : 'Finalizing your presentation'}
        </p>
      </div>

      {/* Progress stages */}
      <div className="space-y-3 mb-10">
        {STAGES.map((stage, i) => {
          const status = i < currentStage ? 'done' : i === currentStage ? 'active' : 'pending';
          return (
            <motion.div key={stage.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl text-left"
              style={{
                background: status === 'done' ? 'rgba(52,211,153,0.08)' : status === 'active' ? 'rgba(37,99,235,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${status === 'done' ? 'rgba(52,211,153,0.2)' : status === 'active' ? 'rgba(37,99,235,0.3)' : 'rgba(255,255,255,0.06)'}`,
              }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: status === 'done' ? 'rgba(52,211,153,0.2)' : status === 'active' ? 'rgba(37,99,235,0.25)' : 'rgba(255,255,255,0.07)' }}>
                {status === 'done' ? (
                  <Check className="w-4 h-4" style={{ color: '#34D399' }} />
                ) : status === 'active' ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Loader2 className="w-4 h-4" style={{ color: '#60A5FA' }} />
                  </motion.div>
                ) : (
                  <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
                )}
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: status === 'pending' ? 'rgba(255,255,255,0.35)' : '#F8FAFF' }}>
                  {stage.label}
                </div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{stage.desc}</div>
              </div>
              {status === 'done' && (
                <div className="ml-auto text-xs font-semibold" style={{ color: '#34D399' }}>Complete</div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="rounded-full overflow-hidden mb-4" style={{ height: '4px', background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #2563EB, #7C3AED)' }}
          animate={{ width: `${Math.min(100, (currentStage / STAGES.length) * 100)}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {Math.min(100, Math.round((currentStage / STAGES.length) * 100))}% complete
      </p>
    </div>
  );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

const DEFAULT_DATA: Step1Data = {
  prompt: '',
  audience: '',
  tone: 'professional',
  contentType: 'business',
  slideCount: 8,
  themeId: 'cobalt',
  aiVisuals: true,
};

function generateOutline(data: Step1Data): OutlineSlide[] {
  const count = data.slideCount;
  const layouts: SlideLayout[] = [
    'title-hero-left', 'agenda-clean', 'two-column-explainer', 'stat-cards-grid',
    'bullets-with-side-image', 'comparison-split', 'horizontal-process', 'milestone-timeline',
    'quote-impact', 'closing-contact',
  ];
  const purposes: SlidePurpose[] = ['intro', 'agenda', 'content', 'data', 'content', 'comparison', 'process', 'timeline', 'quote', 'closing'];
  const types: SlideType[] = ['hero-title', 'agenda', 'two-column', 'kpi-dashboard', 'bullet-image', 'comparison', 'process-flow', 'timeline', 'quote', 'closing'];

  const titles = [
    data.prompt.split(' ').slice(0, 5).join(' ') || 'Introduction',
    'Agenda',
    'The Problem & Opportunity',
    'Key Metrics & Results',
    'Core Features & Benefits',
    'Competitive Landscape',
    'Our Process',
    'Roadmap & Timeline',
    'What Our Customers Say',
    'Next Steps & Call to Action',
  ];

  return Array.from({ length: Math.min(count, 10) }, (_, i) => ({
    id: `outline-${i}`,
    title: titles[i] || `Slide ${i + 1}`,
    purpose: purposes[i % purposes.length],
    layout: layouts[i % layouts.length],
    contentIntent: `${purposes[i % purposes.length]} slide content`,
    hasVisual: data.aiVisuals && i !== 1,
  }));
}

export default function DeckWizard() {
  const navigate = useNavigate();
  const { addDeck, setCurrentDeck } = useDeckStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Step1Data>(DEFAULT_DATA);
  const [outline, setOutline] = useState<OutlineSlide[]>([]);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [generationStage, setGenerationStage] = useState(0);

  const handleStep1Next = async () => {
    setStep(2);
    setIsGeneratingOutline(true);
    await new Promise(r => setTimeout(r, 1500));
    setOutline(generateOutline(formData));
    setIsGeneratingOutline(false);
  };

  const handleRegenerate = async () => {
    setIsGeneratingOutline(true);
    await new Promise(r => setTimeout(r, 1200));
    setOutline(generateOutline(formData));
    setIsGeneratingOutline(false);
  };

  const handleEditOutlineTitle = (id: string, title: string) => {
    setOutline(prev => prev.map(s => s.id === id ? { ...s, title } : s));
  };

  const handleAcceptOutline = async () => {
    setStep(3);
    // Simulate generation stages
    for (let i = 0; i <= STAGES.length; i++) {
      await new Promise(r => setTimeout(r, 900));
      setGenerationStage(i);
    }

    // Find or create a deck
    const sourceDeck = SAMPLE_DECKS[0];
    const newDeck: Deck = {
      ...sourceDeck,
      id: `deck-${Date.now()}`,
      title: outline[0]?.title || formData.prompt.split(' ').slice(0, 5).join(' ') || 'New Deck',
      prompt: formData.prompt,
      audience: formData.audience,
      tone: formData.tone,
      contentType: formData.contentType,
      slideCount: outline.length,
      themeId: formData.themeId,
      status: 'ready',
      createdAt: new Date(),
      updatedAt: new Date(),
      deckJson: {
        themeId: formData.themeId,
        slides: sourceDeck.deckJson.slides.slice(0, outline.length),
      },
    };

    addDeck(newDeck);
    setCurrentDeck(newDeck);

    await new Promise(r => setTimeout(r, 600));
    navigate(`/decks/${newDeck.id}`);
  };

  return (
    <div className="min-h-screen" style={{ background: '#0F1117', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(15,17,23,0.95)' }}>
        <div className="flex items-center gap-4">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/dashboard')}
            className="p-2 rounded-lg transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold">DeckCraft</span>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: step > s ? '#34D399' : step === s ? '#2563EB' : 'rgba(255,255,255,0.1)',
                    color: step >= s ? '#fff' : 'rgba(255,255,255,0.4)',
                  }}>
                  {step > s ? <Check className="w-3 h-3" /> : s}
                </div>
                <span className="text-xs font-medium hidden md:block" style={{ color: step === s ? '#F8FAFF' : 'rgba(255,255,255,0.35)' }}>
                  {['Describe', 'Review', 'Generate'][s - 1]}
                </span>
              </div>
              {s < 3 && <div className="w-8 h-px" style={{ background: step > s ? '#34D399' : 'rgba(255,255,255,0.12)' }} />}
            </div>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-8 py-16">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <Step1Form data={formData} onChange={d => setFormData(prev => ({ ...prev, ...d }))} onNext={handleStep1Next} />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <Step2Outline
                outline={outline}
                isLoading={isGeneratingOutline}
                onRegenerate={handleRegenerate}
                onAccept={handleAcceptOutline}
                onEditTitle={handleEditOutlineTitle}
              />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <Step3Progress currentStage={generationStage} onComplete={() => {}} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
