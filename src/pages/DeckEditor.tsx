import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Play, Download, ChevronDown, ArrowLeft,
  CheckCircle, Loader2
} from 'lucide-react';
import { useDeckStore } from '@/lib/store';
import { THEMES, ThemeId } from '@/lib/themes';
import { Slide } from '@/lib/schema';
import { SlideThumbnailList } from '@/components/editor/SlideThumbnailList';
import { SlideCanvas } from '@/components/editor/SlideCanvas';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { SlideRenderer } from '@/components/slides/SlideRenderer';

const BLANK_SLIDE: Omit<Slide, 'id'> = {
  type: 'two-column',
  layout: 'two-column-explainer',
  purpose: 'content',
  title: 'New Slide',
  subtitle: 'Add your content here',
  bullets: ['First point', 'Second point', 'Third point'],
};

export default function DeckEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    decks, currentDeck, setCurrentDeck,
    activeSlideId, setActiveSlideId,
    updateSlide, reorderSlides, addSlide, deleteSlide,
    updateTheme, updateDeckTitle,
    isSaving, lastSaved,
  } = useDeckStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);

  // Load deck on mount
  useEffect(() => {
    if (!currentDeck || currentDeck.id !== id) {
      const deck = decks.find(d => d.id === id);
      if (deck) {
        setCurrentDeck(deck);
      } else if (id === 'demo') {
        // Load first deck as demo
        if (decks.length > 0) setCurrentDeck(decks[0]);
      }
    }
  }, [id]);

  useEffect(() => {
    if (currentDeck) setTitleValue(currentDeck.title);
  }, [currentDeck?.title]);

  const activeSlide = currentDeck?.deckJson.slides.find(s => s.id === activeSlideId) || null;
  const theme = currentDeck ? THEMES[currentDeck.themeId] : THEMES.cobalt;

  const handleAddSlide = () => {
    const newSlide: Slide = {
      ...BLANK_SLIDE,
      id: `slide-${Date.now()}`,
    };
    addSlide(newSlide);
  };

  const handleTextEdit = (field: string, value: string) => {
    if (activeSlide) {
      updateSlide(activeSlide.id, { [field]: value });
    }
  };

  if (!currentDeck) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1117' }}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#2563EB' }} />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Loading deck...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#0F1117', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* ── Top Toolbar ─────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4 px-5 py-3 flex-shrink-0 z-20"
        style={{ background: '#13171F', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Back + Logo */}
        <button onClick={() => navigate('/dashboard')}
          className="p-1.5 rounded-lg transition-colors flex-shrink-0"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }} />

        {/* Deck title */}
        <div className="flex-1 min-w-0">
          {isEditingTitle ? (
            <input
              autoFocus
              value={titleValue}
              onChange={e => setTitleValue(e.target.value)}
              onBlur={() => { updateDeckTitle(titleValue); setIsEditingTitle(false); }}
              onKeyDown={e => { if (e.key === 'Enter') { updateDeckTitle(titleValue); setIsEditingTitle(false); } }}
              className="bg-transparent outline-none text-sm font-semibold"
              style={{ color: '#F8FAFF', minWidth: '200px' }}
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-sm font-semibold truncate max-w-[300px] text-left hover:opacity-70 transition-opacity"
              style={{ color: '#F8FAFF' }}
            >
              {currentDeck.title}
            </button>
          )}
        </div>

        {/* Autosave indicator */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isSaving ? (
            <div className="flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" style={{ color: '#60A5FA' }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Saving...</span>
            </div>
          ) : lastSaved ? (
            <div className="flex items-center gap-1.5 saved-pulse">
              <CheckCircle className="w-3 h-3" style={{ color: '#34D399' }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Saved</span>
            </div>
          ) : null}
        </div>

        {/* Theme selector */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)' }}>
            <div className="w-3 h-3 rounded-full" style={{ background: theme.accent }} />
            {theme.name}
            <ChevronDown className="w-3 h-3" />
          </button>
          {showThemeMenu && (
            <div className="absolute right-0 top-9 rounded-xl py-1.5 z-30 w-52"
              style={{ background: '#1E2435', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
              {Object.values(THEMES).map(t => (
                <button
                  key={t.id}
                  onClick={() => { updateTheme(t.id as ThemeId); setShowThemeMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors"
                  style={{ color: currentDeck.themeId === t.id ? '#60A5FA' : 'rgba(255,255,255,0.7)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div className="w-4 h-4 rounded-full" style={{ background: t.preview }} />
                  <span className="font-medium">{t.name}</span>
                  {currentDeck.themeId === t.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsPresenting(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFF' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}>
            <Play className="w-3 h-3" />
            Present
          </button>
          <button
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            <Download className="w-3 h-3" />
            Export PDF
          </button>
        </div>
      </motion.header>

      {/* ── Editor body ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — slide thumbnails */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-shrink-0 overflow-hidden"
          style={{ width: '160px', borderRight: '1px solid rgba(255,255,255,0.06)' }}
        >
          <SlideThumbnailList
            slides={currentDeck.deckJson.slides}
            activeSlideId={activeSlideId}
            themeId={currentDeck.themeId}
            onSlideClick={setActiveSlideId}
            onAddSlide={handleAddSlide}
            onDeleteSlide={deleteSlide}
            onReorder={reorderSlides}
          />
        </motion.div>

        {/* Center — slide canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex-1 overflow-hidden"
          onClick={() => setShowThemeMenu(false)}
        >
          <SlideCanvas
            slide={activeSlide}
            theme={theme}
            onTextEdit={handleTextEdit}
          />
        </motion.div>

        {/* Right sidebar — properties */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex-shrink-0 overflow-hidden"
          style={{ width: '224px', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
        >
          <PropertiesPanel
            activeSlide={activeSlide}
            theme={theme}
            onUpdateSlide={updates => { if (activeSlide) updateSlide(activeSlide.id, updates); }}
          />
        </motion.div>
      </div>

      {/* ── Presentation Mode ────────────────────────────────────────── */}
      {isPresenting && currentDeck && (
        <PresentationMode
          slides={currentDeck.deckJson.slides}
          theme={theme}
          onClose={() => setIsPresenting(false)}
        />
      )}
    </div>
  );
}

// ── Presentation Mode ──────────────────────────────────────────────────────────

function PresentationMode({ slides, theme, onClose }: {
  slides: Slide[];
  theme: typeof THEMES.cobalt;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') setCurrentIndex(i => Math.min(i + 1, slides.length - 1));
      if (e.key === 'ArrowLeft') setCurrentIndex(i => Math.max(i - 1, 0));
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [slides.length, onClose]);

  const slide = slides[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: '#000' }}
    >
      {/* Slide */}
      <div className="relative w-full" style={{ maxWidth: 'calc(100vh * 16/9)', aspectRatio: '16/9' }}>
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full"
        >
          <SlideRenderer slide={slide} theme={theme} />
        </motion.div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 flex items-center gap-4">
        <button onClick={() => setCurrentIndex(i => Math.max(i - 1, 0))}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'rgba(255,255,255,0.1)', color: currentIndex === 0 ? 'rgba(255,255,255,0.3)' : '#fff' }}>
          ←
        </button>
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>
          {currentIndex + 1} / {slides.length}
        </span>
        <button onClick={() => setCurrentIndex(i => Math.min(i + 1, slides.length - 1))}
          disabled={currentIndex === slides.length - 1}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'rgba(255,255,255,0.1)', color: currentIndex === slides.length - 1 ? 'rgba(255,255,255,0.3)' : '#fff' }}>
          →
        </button>
        <button onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-medium ml-4"
          style={{ background: 'rgba(248,113,113,0.2)', color: '#F87171', border: '1px solid rgba(248,113,113,0.3)' }}>
          Exit
        </button>
      </div>
    </motion.div>
  );
}


