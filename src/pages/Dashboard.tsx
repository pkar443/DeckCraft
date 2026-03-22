import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Plus, MoreHorizontal, Clock, Trash2, Copy, Pencil, 
  LayoutGrid, List, Search, Bell, User, LogOut, Settings,
  FileText, CheckCircle, Loader2, AlertCircle
} from 'lucide-react';
import { useDeckStore } from '@/lib/store';
import { Deck } from '@/lib/schema';
import { THEMES } from '@/lib/themes';
import { formatDistanceToNow } from 'date-fns';

function StatusBadge({ status }: { status: Deck['status'] }) {
  const config = {
    ready: { color: '#34D399', bg: 'rgba(52,211,153,0.12)', icon: CheckCircle, label: 'Ready' },
    draft: { color: '#94A3B8', bg: 'rgba(148,163,184,0.12)', icon: FileText, label: 'Draft' },
    exporting: { color: '#60A5FA', bg: 'rgba(96,165,250,0.12)', icon: Loader2, label: 'Exporting' },
    error: { color: '#F87171', bg: 'rgba(248,113,113,0.12)', icon: AlertCircle, label: 'Error' },
  };
  const cfg = config[status];
  const Icon = cfg.icon;
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: cfg.bg }}>
      <Icon className="w-3 h-3" style={{ color: cfg.color }} />
      <span className="text-xs font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
    </div>
  );
}

function DeckCard({ deck, onOpen, onDelete, onDuplicate, onRename }: {
  deck: Deck;
  onOpen: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onRename: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = THEMES[deck.themeId];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{ background: '#181C27', border: '1px solid rgba(255,255,255,0.07)' }}
      onClick={onOpen}
    >
      {/* Thumbnail preview */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: theme.slideBg }}>
        {/* Simulated slide preview */}
        <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: '20px' }}>
          <div className="w-8 h-0.5 rounded-full mb-2" style={{ background: theme.accent }} />
          <div className="rounded mb-1.5" style={{ width: '65%', height: '14px', background: `${theme.primaryText}30`, borderRadius: '4px' }} />
          <div className="rounded" style={{ width: '45%', height: '8px', background: `${theme.primaryText}18`, borderRadius: '4px' }} />
          {/* Preview content elements */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg" style={{ height: '24px', background: `${theme.accent}15`, border: `1px solid ${theme.accent}20` }} />
            ))}
          </div>
        </div>
        
        {/* Theme color accent */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-20"
          style={{ background: `radial-gradient(circle, ${theme.accent}, transparent)` }} />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(15,17,23,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="px-4 py-2 rounded-xl font-semibold text-sm" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
            Open Editor
          </div>
        </div>
      </div>

      {/* Card info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm leading-snug pr-3 line-clamp-2" style={{ color: '#F8FAFF', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {deck.title}
          </h3>
          <div className="relative flex-shrink-0">
            <button
              onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(255,255,255,0.07)' }}>
              <MoreHorizontal className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.5)' }} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-20 rounded-xl py-1.5 w-44"
                style={{ background: '#1E2435', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
                onClick={e => e.stopPropagation()}>
                {[
                  { icon: Pencil, label: 'Rename', action: onRename },
                  { icon: Copy, label: 'Duplicate', action: onDuplicate },
                  { icon: Trash2, label: 'Delete', action: onDelete, danger: true },
                ].map(item => (
                  <button key={item.label}
                    onClick={() => { item.action(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                    style={{ color: item.danger ? '#F87171' : 'rgba(255,255,255,0.7)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <StatusBadge status={deck.status} />
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.25)' }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {formatDistanceToNow(deck.updatedAt, { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <div className="w-3 h-3 rounded-full" style={{ background: theme.accent }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {theme.name} · {deck.slideCount} slides
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { decks, deleteDeck, duplicateDeck, updateDeck } = useDeckStore();
  const [search, setSearch] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const filtered = decks.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleRename = (deck: Deck) => {
    setRenamingId(deck.id);
    setRenameValue(deck.title);
  };

  const commitRename = (id: string) => {
    if (renameValue.trim()) {
      updateDeck(id, { title: renameValue.trim() });
    }
    setRenamingId(null);
  };

  return (
    <div className="min-h-screen" style={{ background: '#0F1117', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#F1F5F9' }}>
      {/* Top navigation */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0F1117' }}>
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">DeckCraft</span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {['My Decks', 'Templates', 'Shared'].map((item, i) => (
                <button key={item} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ background: i === 0 ? 'rgba(255,255,255,0.07)' : 'transparent', color: i === 0 ? '#F8FAFF' : 'rgba(255,255,255,0.45)' }}>
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Bell className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium" style={{ color: '#F8FAFF' }}>Alex</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 py-10">
        {/* Page header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '36px', fontWeight: 700, color: '#F8FAFF', marginBottom: '6px' }}>
              My Decks
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
              {decks.length} deck{decks.length !== 1 ? 's' : ''} in your workspace
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/decks/new')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff', boxShadow: '0 4px 20px rgba(37,99,235,0.35)' }}>
            <Plus className="w-4 h-4" />
            New Deck
          </motion.button>
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 max-w-sm relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
            <input
              type="text"
              placeholder="Search decks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#F8FAFF' }}
            />
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <button className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <LayoutGrid className="w-4 h-4" style={{ color: '#F8FAFF' }} />
            </button>
            <button className="p-2 rounded-lg" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Create CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/decks/new')}
          className="relative rounded-2xl p-8 mb-8 cursor-pointer overflow-hidden group"
          style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(124,58,237,0.12))', border: '1px solid rgba(37,99,235,0.25)' }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(37,99,235,0.05)' }} />
          <div className="absolute w-48 h-48 rounded-full pointer-events-none" style={{ background: 'rgba(37,99,235,0.15)', filter: 'blur(50px)', right: '10%', top: '-20%' }} />
          <div className="relative flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: '#F8FAFF', fontFamily: 'Fraunces, serif' }}>
                Create a new deck with AI
              </h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Describe your topic and let AI build your entire presentation in seconds
              </p>
            </div>
            <div className="ml-auto flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#F8FAFF' }}>
              Get started →
            </div>
          </div>
        </motion.div>

        {/* Deck grid / empty state */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <FileText className="w-8 h-8" style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#F8FAFF', fontFamily: 'Fraunces, serif' }}>
              {search ? 'No decks found' : 'Your workspace is empty'}
            </h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {search ? 'Try a different search term' : 'Create your first deck and see the magic happen'}
            </p>
            {!search && (
              <button onClick={() => navigate('/decks/new')}
                className="px-6 py-3 rounded-xl font-semibold text-sm"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff' }}>
                <Plus className="w-4 h-4 inline mr-2" />
                Create your first deck
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <h2 className="text-sm font-semibold mb-4 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Recent
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(deck => (
                <div key={deck.id}>
                  {renamingId === deck.id ? (
                    <div className="rounded-2xl p-4" style={{ background: '#181C27', border: '2px solid rgba(37,99,235,0.5)' }}>
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onBlur={() => commitRename(deck.id)}
                        onKeyDown={e => { if (e.key === 'Enter') commitRename(deck.id); if (e.key === 'Escape') setRenamingId(null); }}
                        className="w-full text-sm font-semibold outline-none bg-transparent"
                        style={{ color: '#F8FAFF' }}
                      />
                    </div>
                  ) : (
                    <DeckCard
                      deck={deck}
                      onOpen={() => {
                        const { setCurrentDeck } = useDeckStore.getState();
                        setCurrentDeck(deck);
                        navigate(`/decks/${deck.id}`);
                      }}
                      onDelete={() => deleteDeck(deck.id)}
                      onDuplicate={() => duplicateDeck(deck.id)}
                      onRename={() => handleRename(deck)}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
