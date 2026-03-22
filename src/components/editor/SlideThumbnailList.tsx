import { useState, useCallback } from 'react';
import { useDeckStore } from '@/lib/store';
import { Slide } from '@/lib/schema';
import { THEMES } from '@/lib/themes';
import { SlideRenderer } from '@/components/slides/SlideRenderer';
import {
  DndContext, DragEndEvent, PointerSensor, useSensor, useSensors,
  closestCenter
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, Trash2 } from 'lucide-react';

interface SortableThumbnailProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  themeId: string;
  onClick: () => void;
  onDelete: () => void;
}

function SortableThumbnail({ slide, index, isActive, themeId, onClick, onDelete }: SortableThumbnailProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slide.id });
  const theme = THEMES[themeId as keyof typeof THEMES];

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <div
        onClick={onClick}
        className="relative rounded-lg overflow-hidden cursor-pointer transition-all"
        style={{
          border: `2px solid ${isActive ? '#2563EB' : 'rgba(255,255,255,0.07)'}`,
          background: isActive ? 'rgba(37,99,235,0.1)' : 'transparent',
        }}
        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.border = '2px solid rgba(255,255,255,0.15)'; }}
        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.border = '2px solid rgba(255,255,255,0.07)'; }}
      >
        {/* Thumbnail render */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: theme.slideBg }}>
          <div style={{ transform: 'scale(0.18)', transformOrigin: 'top left', width: '556%', height: '556%', pointerEvents: 'none' }}>
            <SlideRenderer slide={slide} theme={theme} />
          </div>
        </div>

        {/* Slide number */}
        <div className="px-2 py-1.5 flex items-center justify-between"
          style={{ background: 'rgba(0,0,0,0.3)' }}>
          <span className="text-[10px] font-bold" style={{ color: isActive ? '#60A5FA' : 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-[9px] truncate max-w-[80px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {slide.title}
          </span>
        </div>
      </div>

      {/* Drag handle */}
      <div {...attributes} {...listeners}
        className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 rounded-md"
        style={{ background: 'rgba(0,0,0,0.6)' }}>
        <GripVertical className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.6)' }} />
      </div>

      {/* Delete button */}
      <button
        onClick={e => { e.stopPropagation(); onDelete(); }}
        className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md"
        style={{ background: 'rgba(248,113,113,0.2)' }}>
        <Trash2 className="w-2.5 h-2.5" style={{ color: '#F87171' }} />
      </button>
    </div>
  );
}

interface SlideThumbnailListProps {
  slides: Slide[];
  activeSlideId: string | null;
  themeId: string;
  onSlideClick: (id: string) => void;
  onAddSlide: () => void;
  onDeleteSlide: (id: string) => void;
  onReorder: (slides: Slide[]) => void;
}

export function SlideThumbnailList({ slides, activeSlideId, themeId, onSlideClick, onAddSlide, onDeleteSlide, onReorder }: SlideThumbnailListProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex(s => s.id === active.id);
      const newIndex = slides.findIndex(s => s.id === over.id);
      onReorder(arrayMove(slides, oldIndex, newIndex));
    }
  }, [slides, onReorder]);

  return (
    <div className="h-full flex flex-col" style={{ background: '#0D0F16' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Slides
        </span>
        <button onClick={onAddSlide}
          className="p-1 rounded-md transition-colors"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable thumbnail list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={slides.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {slides.map((slide, index) => (
              <SortableThumbnail
                key={slide.id}
                slide={slide}
                index={index}
                isActive={slide.id === activeSlideId}
                themeId={themeId}
                onClick={() => onSlideClick(slide.id)}
                onDelete={() => onDeleteSlide(slide.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
