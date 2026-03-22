import { create } from 'zustand';
import { Deck, DeckJson, Slide } from './schema';
import { ThemeId } from './themes';
import { SAMPLE_DECKS } from './sample-data';

interface DeckStore {
  decks: Deck[];
  currentDeck: Deck | null;
  activeSlideId: string | null;
  selectedElementId: string | null;
  isSaving: boolean;
  lastSaved: Date | null;
  
  // Actions
  setDecks: (decks: Deck[]) => void;
  addDeck: (deck: Deck) => void;
  updateDeck: (id: string, updates: Partial<Deck>) => void;
  deleteDeck: (id: string) => void;
  duplicateDeck: (id: string) => void;
  setCurrentDeck: (deck: Deck | null) => void;
  setActiveSlideId: (id: string | null) => void;
  setSelectedElementId: (id: string | null) => void;
  updateSlide: (slideId: string, updates: Partial<Slide>) => void;
  reorderSlides: (slides: Slide[]) => void;
  addSlide: (slide: Slide) => void;
  deleteSlide: (slideId: string) => void;
  updateTheme: (themeId: ThemeId) => void;
  updateDeckTitle: (title: string) => void;
  triggerAutosave: () => void;
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  decks: SAMPLE_DECKS,
  currentDeck: null,
  activeSlideId: null,
  selectedElementId: null,
  isSaving: false,
  lastSaved: null,

  setDecks: (decks) => set({ decks }),
  
  addDeck: (deck) => set((state) => ({ 
    decks: [deck, ...state.decks] 
  })),
  
  updateDeck: (id, updates) => set((state) => ({
    decks: state.decks.map(d => d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d),
    currentDeck: state.currentDeck?.id === id 
      ? { ...state.currentDeck, ...updates, updatedAt: new Date() } 
      : state.currentDeck,
  })),
  
  deleteDeck: (id) => set((state) => ({
    decks: state.decks.filter(d => d.id !== id),
  })),
  
  duplicateDeck: (id) => set((state) => {
    const deck = state.decks.find(d => d.id === id);
    if (!deck) return state;
    const newDeck: Deck = {
      ...deck,
      id: `deck-${Date.now()}`,
      title: `${deck.title} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return { decks: [newDeck, ...state.decks] };
  }),
  
  setCurrentDeck: (deck) => set({ 
    currentDeck: deck,
    activeSlideId: deck?.deckJson.slides[0]?.id || null,
    selectedElementId: null,
  }),
  
  setActiveSlideId: (id) => set({ activeSlideId: id, selectedElementId: null }),
  
  setSelectedElementId: (id) => set({ selectedElementId: id }),
  
  updateSlide: (slideId, updates) => {
    const state = get();
    if (!state.currentDeck) return;
    const updatedSlides = state.currentDeck.deckJson.slides.map(s =>
      s.id === slideId ? { ...s, ...updates } : s
    );
    const updatedDeckJson: DeckJson = {
      ...state.currentDeck.deckJson,
      slides: updatedSlides,
    };
    const updatedDeck = { ...state.currentDeck, deckJson: updatedDeckJson };
    set({ currentDeck: updatedDeck });
    get().triggerAutosave();
  },
  
  reorderSlides: (slides) => {
    const state = get();
    if (!state.currentDeck) return;
    const updatedDeck = {
      ...state.currentDeck,
      deckJson: { ...state.currentDeck.deckJson, slides },
    };
    set({ currentDeck: updatedDeck });
    get().triggerAutosave();
  },
  
  addSlide: (slide) => {
    const state = get();
    if (!state.currentDeck) return;
    const updatedDeck = {
      ...state.currentDeck,
      deckJson: {
        ...state.currentDeck.deckJson,
        slides: [...state.currentDeck.deckJson.slides, slide],
      },
    };
    set({ currentDeck: updatedDeck, activeSlideId: slide.id });
    get().triggerAutosave();
  },
  
  deleteSlide: (slideId) => {
    const state = get();
    if (!state.currentDeck) return;
    const slides = state.currentDeck.deckJson.slides.filter(s => s.id !== slideId);
    const updatedDeck = {
      ...state.currentDeck,
      deckJson: { ...state.currentDeck.deckJson, slides },
    };
    const newActiveId = slides.length > 0 ? slides[0].id : null;
    set({ currentDeck: updatedDeck, activeSlideId: newActiveId });
    get().triggerAutosave();
  },
  
  updateTheme: (themeId) => {
    const state = get();
    if (!state.currentDeck) return;
    const updatedDeck = {
      ...state.currentDeck,
      themeId,
      deckJson: { ...state.currentDeck.deckJson, themeId },
    };
    set({ currentDeck: updatedDeck });
    get().updateDeck(updatedDeck.id, { themeId });
  },
  
  updateDeckTitle: (title) => {
    const state = get();
    if (!state.currentDeck) return;
    const updatedDeck = { ...state.currentDeck, title };
    set({ currentDeck: updatedDeck });
    get().updateDeck(updatedDeck.id, { title });
  },
  
  triggerAutosave: () => {
    set({ isSaving: true });
    setTimeout(() => {
      const state = get();
      if (state.currentDeck) {
        set((s) => ({
          isSaving: false,
          lastSaved: new Date(),
          decks: s.decks.map(d => 
            d.id === s.currentDeck?.id ? { ...s.currentDeck, updatedAt: new Date() } : d
          ),
        }));
      }
    }, 800);
  },
}));
