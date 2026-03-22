import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slide } from '@/lib/schema';
import { Theme } from '@/lib/themes';
import { SlideRenderer } from '@/components/slides/SlideRenderer';

interface SlideCanvasProps {
  slide: Slide | null;
  theme: Theme;
  onTextEdit: (field: string, value: string) => void;
}

export function SlideCanvas({ slide, theme, onTextEdit }: SlideCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [prevSlideId, setPrevSlideId] = useState<string | null>(null);

  const BASE_WIDTH = 1600;
  const BASE_HEIGHT = 900;

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const availableWidth = container.clientWidth - 80;
        const availableHeight = container.clientHeight - 80;
        const scaleX = availableWidth / BASE_WIDTH;
        const scaleY = availableHeight / BASE_HEIGHT;
        setScale(Math.min(scaleX, scaleY, 1));
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (slide?.id !== prevSlideId) {
      setPrevSlideId(slide?.id || null);
    }
  }, [slide?.id]);

  if (!slide) {
    return (
      <div ref={containerRef} className="flex-1 flex items-center justify-center" style={{ background: '#0D0F16' }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Select a slide to edit
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center overflow-hidden"
      style={{ background: '#0D0F16' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative rounded-xl overflow-hidden slide-canvas-shadow"
          style={{
            width: `${BASE_WIDTH * scale}px`,
            height: `${BASE_HEIGHT * scale}px`,
            flexShrink: 0,
          }}
        >
          {/* Scaled slide content */}
          <div
            style={{
              width: `${BASE_WIDTH}px`,
              height: `${BASE_HEIGHT}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <SlideRenderer
              slide={slide}
              theme={theme}
              isEditing={true}
              onTextEdit={onTextEdit}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
