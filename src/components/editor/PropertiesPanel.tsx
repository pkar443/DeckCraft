import { useState } from 'react';
import { Slide, SlideLayout } from '@/lib/schema';
import { Theme } from '@/lib/themes';
import { reviseSlide } from '@/lib/ai/generateDeck';
import { 
  Wand2, Image, RefreshCw, Sparkles, LayoutGrid, CheckCircle
} from 'lucide-react';

interface PropertiesPanelProps {
  activeSlide: Slide | null;
  theme: Theme;
  onUpdateSlide: (updates: Partial<Slide>) => void;
}

const LAYOUT_OPTIONS: { value: SlideLayout; label: string; icon: string }[] = [
  { value: 'title-hero-left', label: 'Hero Left', icon: '◧' },
  { value: 'title-hero-right', label: 'Hero Right', icon: '◨' },
  { value: 'agenda-clean', label: 'Agenda', icon: '☰' },
  { value: 'bullets-with-side-image', label: 'Bullets + Image', icon: '⊞' },
  { value: 'two-column-explainer', label: 'Two Column', icon: '⊟' },
  { value: 'stat-cards-grid', label: 'KPI Grid', icon: '⊞' },
  { value: 'horizontal-process', label: 'Process', icon: '→' },
  { value: 'quote-impact', label: 'Quote', icon: '❝' },
  { value: 'comparison-split', label: 'Comparison', icon: '⊣' },
  { value: 'closing-contact', label: 'Closing', icon: '✓' },
];

const AI_SUGGESTIONS = [
  'Make it more concise',
  'Add more data points',
  'Emphasize the key benefit',
  'Make it more persuasive',
  'Simplify the language',
];

export function PropertiesPanel({ activeSlide, theme, onUpdateSlide }: PropertiesPanelProps) {
  const [aiInstruction, setAiInstruction] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteSuccess, setRewriteSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'style' | 'layout' | 'ai'>('layout');

  const handleAiRewrite = async () => {
    if (!activeSlide) return;
    setIsRewriting(true);
    setRewriteSuccess(false);
    try {
      const instruction = aiInstruction || 'Improve this slide content, make it more compelling and clear';
      const updates = await reviseSlide(activeSlide, instruction);
      if (Object.keys(updates).length > 0) {
        onUpdateSlide(updates);
        setRewriteSuccess(true);
        setTimeout(() => setRewriteSuccess(false), 2500);
      }
    } catch (e) {
      console.warn('AI rewrite failed:', e);
    }
    setIsRewriting(false);
    setAiInstruction('');
  };

  if (!activeSlide) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <LayoutGrid className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.2)' }} />
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Select a slide to see properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: '#13171F' }}>
      {/* Tab header */}
      <div className="flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex">
          {(['layout', 'style', 'ai'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 text-xs font-semibold capitalize transition-colors"
              style={{
                color: activeTab === tab ? '#F8FAFF' : 'rgba(255,255,255,0.35)',
                borderBottom: `2px solid ${activeTab === tab ? '#2563EB' : 'transparent'}`,
              }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* LAYOUT TAB */}
        {activeTab === 'layout' && (
          <div className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Slide Layout
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {LAYOUT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => onUpdateSlide({ layout: opt.value })}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg text-center transition-all"
                  style={{
                    background: activeSlide.layout === opt.value ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${activeSlide.layout === opt.value ? 'rgba(37,99,235,0.5)' : 'rgba(255,255,255,0.07)'}`,
                  }}>
                  <span className="text-base" style={{ lineHeight: 1 }}>{opt.icon}</span>
                  <span className="text-[10px] font-medium" style={{ color: activeSlide.layout === opt.value ? '#60A5FA' : 'rgba(255,255,255,0.5)' }}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Slide info */}
            <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Slide Info</p>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Type</span>
                  <span className="text-xs font-medium capitalize" style={{ color: '#F8FAFF' }}>{activeSlide.type.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Purpose</span>
                  <span className="text-xs font-medium capitalize" style={{ color: '#F8FAFF' }}>{activeSlide.purpose.replace('-', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STYLE TAB */}
        {activeTab === 'style' && (
          <div className="p-4 space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Accent Color</p>
              <div className="grid grid-cols-6 gap-2">
                {['#2563EB', '#7C3AED', '#0891B2', '#059669', '#D97706', '#DC2626', '#DB2777', '#4F46E5', '#F8FAFF', '#0F172A'].map(color => (
                  <button
                    key={color}
                    onClick={() => onUpdateSlide({ accentColor: color })}
                    className="rounded-full transition-transform hover:scale-110"
                    style={{
                      width: '24px',
                      height: '24px',
                      background: color,
                      border: activeSlide.accentColor === color ? '2px solid white' : '2px solid transparent',
                      boxShadow: activeSlide.accentColor === color ? `0 0 8px ${color}80` : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Title</p>
              <div className="space-y-2">
                <input
                  value={activeSlide.title}
                  onChange={e => onUpdateSlide({ title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F8FAFF' }}
                  placeholder="Slide title..."
                />
              </div>
            </div>

            {activeSlide.subtitle !== undefined && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Subtitle</p>
                <input
                  value={activeSlide.subtitle || ''}
                  onChange={e => onUpdateSlide({ subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F8FAFF' }}
                  placeholder="Subtitle..."
                />
              </div>
            )}

            {activeSlide.body !== undefined && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Body</p>
                <textarea
                  value={activeSlide.body || ''}
                  onChange={e => onUpdateSlide({ body: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F8FAFF' }}
                  placeholder="Body text..."
                />
              </div>
            )}
          </div>
        )}

        {/* AI TAB */}
        {activeTab === 'ai' && (
          <div className="p-4 space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>AI Rewrite</p>
              <textarea
                value={aiInstruction}
                onChange={e => setAiInstruction(e.target.value)}
                placeholder="Optional: Describe how to improve this slide..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl text-xs outline-none resize-none mb-2"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F8FAFF', lineHeight: '1.5' }}
              />
              <button
                onClick={handleAiRewrite}
                disabled={isRewriting}
                className="w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2"
                style={{ 
                  background: rewriteSuccess ? 'rgba(52,211,153,0.2)' : 'linear-gradient(135deg, #2563EB, #7C3AED)', 
                  color: rewriteSuccess ? '#34D399' : '#fff', 
                  border: rewriteSuccess ? '1px solid rgba(52,211,153,0.4)' : 'none',
                  opacity: isRewriting ? 0.7 : 1 
                }}>
                {isRewriting ? (
                  <><div className="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin" /> Rewriting...</>
                ) : rewriteSuccess ? (
                  <><CheckCircle className="w-3 h-3" /> Rewrite Applied!</>
                ) : (
                  <><Wand2 className="w-3 h-3" /> Rewrite Slide</>
                )}
              </button>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Quick Actions</p>
              <div className="space-y-1.5">
                {AI_SUGGESTIONS.map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => { setAiInstruction(suggestion); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.1)'; e.currentTarget.style.color = '#60A5FA'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}>
                    <Sparkles className="w-3 h-3 inline mr-2" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {activeSlide.imageUrl !== undefined && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Image</p>
                {activeSlide.imageUrl && (
                  <div className="rounded-lg overflow-hidden mb-2">
                    <img src={activeSlide.imageUrl} alt="" className="w-full" style={{ aspectRatio: '16/9', objectFit: 'cover' }} />
                  </div>
                )}
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                  <button className="flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                    <Image className="w-3 h-3" />
                    Replace
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
