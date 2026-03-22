import React from 'react';
import { Slide } from '@/lib/schema';
import { Theme } from '@/lib/themes';

interface SlideProps {
  slide: Slide;
  theme: Theme;
  isEditing?: boolean;
  onTextEdit?: (field: string, value: string) => void;
  scale?: number;
}

// Helper to get accent color or use theme default
const getAccent = (slide: Slide, theme: Theme) => slide.accentColor || theme.accent;

export function HeroTitleSlide({ slide, theme, isEditing, onTextEdit }: SlideProps) {
  const isRight = slide.layout === 'title-hero-right';
  const accent = getAccent(slide, theme);
  const isDark = theme.id === 'aurora';

  return (
    <div
      className="relative w-full h-full overflow-hidden flex"
      style={{ backgroundColor: theme.slideBg, flexDirection: isRight ? 'row-reverse' : 'row' }}
    >
      {/* Decorative orb */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{
          background: accent,
          filter: 'blur(100px)',
          top: '-10%',
          [isRight ? 'right' : 'left']: '-5%',
        }}
      />
      
      {/* Image half */}
      {slide.imageUrl && (
        <div className="relative w-1/2 h-full overflow-hidden flex-shrink-0">
          <img
            src={slide.imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: isRight
                ? `linear-gradient(to left, ${theme.slideBg} 0%, transparent 60%)`
                : `linear-gradient(to right, ${theme.slideBg} 0%, transparent 60%)`,
            }}
          />
        </div>
      )}

      {/* Content half */}
      <div
        className={`flex flex-col justify-center z-10 ${slide.imageUrl ? 'w-1/2' : 'w-full'}`}
        style={{ padding: '64px' }}
      >
        {/* Accent line */}
        <div
          className="mb-8 rounded-full"
          style={{ width: '48px', height: '4px', backgroundColor: accent }}
        />

        <h1
          className="font-display leading-tight mb-6"
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: slide.imageUrl ? '52px' : '72px',
            fontWeight: 700,
            color: theme.primaryText,
            lineHeight: 1.05,
          }}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => onTextEdit?.('title', e.currentTarget.textContent || '')}
        >
          {slide.title}
        </h1>

        {slide.subtitle && (
          <p
            className="mb-4"
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '22px',
              fontWeight: 400,
              color: theme.secondaryText,
              lineHeight: 1.5,
            }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => onTextEdit?.('subtitle', e.currentTarget.textContent || '')}
          >
            {slide.subtitle}
          </p>
        )}

        {slide.body && (
          <p
            className="mt-4 px-3 py-2 rounded inline-block"
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              color: accent,
              backgroundColor: isDark ? 'rgba(52,211,153,0.1)' : `${accent}18`,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {slide.body}
          </p>
        )}
      </div>
    </div>
  );
}

export function SectionDividerSlide({ slide, theme }: SlideProps) {
  const accent = getAccent(slide, theme);
  const isDark = theme.id === 'aurora';

  return (
    <div
      className="relative w-full h-full overflow-hidden flex items-center justify-center"
      style={{
        background: isDark
          ? `linear-gradient(135deg, #0D1117 0%, #0a1628 100%)`
          : `linear-gradient(135deg, ${theme.primaryText} 0%, #1e293b 100%)`,
      }}
    >
      {/* Decorative orbs */}
      <div
        className="absolute w-80 h-80 rounded-full opacity-30 pointer-events-none"
        style={{ background: accent, filter: 'blur(80px)', top: '-10%', left: '-5%' }}
      />
      <div
        className="absolute w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{ background: accent, filter: 'blur(100px)', bottom: '-5%', right: '10%' }}
      />

      <div className="relative z-10 text-center" style={{ padding: '64px' }}>
        {/* Section number or accent */}
        <div
          className="mx-auto mb-8 rounded-full"
          style={{ width: '64px', height: '4px', backgroundColor: accent }}
        />

        <h2
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '64px',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.05,
            marginBottom: '24px',
          }}
        >
          {slide.title}
        </h2>

        {slide.subtitle && (
          <p
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '22px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.5,
            }}
          >
            {slide.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export function AgendaSlide({ slide, theme }: SlideProps) {
  const accent = getAccent(slide, theme);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: theme.slideBg, padding: '64px' }}
    >
      {/* Subtle background accent */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none"
        style={{ background: accent }}
      />

      <div
        className="mb-8 rounded-full"
        style={{ width: '48px', height: '4px', backgroundColor: accent }}
      />

      <h2
        style={{
          fontFamily: 'Fraunces, serif',
          fontSize: '48px',
          fontWeight: 700,
          color: theme.primaryText,
          marginBottom: '48px',
        }}
      >
        {slide.title}
      </h2>

      <div className="space-y-5">
        {slide.bullets?.map((item, i) => (
          <div key={i} className="flex items-center gap-6">
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '13px',
                fontWeight: 600,
                color: accent,
                minWidth: '32px',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div style={{ height: '1px', width: '24px', backgroundColor: `${accent}40` }} />
            <span
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '22px',
                fontWeight: 500,
                color: theme.primaryText,
              }}
            >
              {item.replace(/^\d+\s*[—-]\s*/, '')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BulletImageSlide({ slide, theme }: SlideProps) {
  const accent = getAccent(slide, theme);

  return (
    <div
      className="relative w-full h-full overflow-hidden flex"
      style={{ backgroundColor: theme.slideBg }}
    >
      {/* Content */}
      <div
        className="flex flex-col justify-center"
        style={{ width: slide.imageUrl ? '55%' : '100%', padding: '64px' }}
      >
        <div
          className="mb-6 rounded-full"
          style={{ width: '40px', height: '4px', backgroundColor: accent }}
        />
        <h2
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '42px',
            fontWeight: 700,
            color: theme.primaryText,
            marginBottom: '12px',
            lineHeight: 1.15,
          }}
        >
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '16px',
              color: theme.secondaryText,
              marginBottom: '32px',
            }}
          >
            {slide.subtitle}
          </p>
        )}
        <div className="space-y-4">
          {slide.bullets?.map((bullet, i) => (
            <div key={i} className="flex items-start gap-4">
              <div
                className="flex-shrink-0 mt-2 rounded-full"
                style={{ width: '8px', height: '8px', backgroundColor: accent }}
              />
              <span
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '18px',
                  fontWeight: 400,
                  color: theme.primaryText,
                  lineHeight: 1.6,
                }}
              >
                {bullet}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Image */}
      {slide.imageUrl && (
        <div className="w-[45%] h-full overflow-hidden flex-shrink-0 relative">
          <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${theme.slideBg} 0%, transparent 30%)`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export function TwoColumnSlide({ slide, theme }: SlideProps) {
  const accent = getAccent(slide, theme);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: theme.slideBg, padding: '64px' }}
    >
      {/* Header */}
      <div className="mb-10">
        <div
          className="mb-5 rounded-full"
          style={{ width: '40px', height: '4px', backgroundColor: accent }}
        />
        <h2
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '42px',
            fontWeight: 700,
            color: theme.primaryText,
            lineHeight: 1.15,
          }}
        >
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '16px',
              color: theme.secondaryText,
              marginTop: '8px',
            }}
          >
            {slide.subtitle}
          </p>
        )}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          {slide.bullets?.slice(0, Math.ceil((slide.bullets?.length || 0) / 2)).map((bullet, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="flex-shrink-0 mt-2 rounded-full"
                style={{ width: '8px', height: '8px', backgroundColor: accent }}
              />
              <span
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '17px',
                  color: theme.primaryText,
                  lineHeight: 1.6,
                }}
              >
                {bullet}
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {slide.bullets?.slice(Math.ceil((slide.bullets?.length || 0) / 2)).map((bullet, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="flex-shrink-0 mt-2 rounded-full"
                style={{ width: '8px', height: '8px', backgroundColor: accent }}
              />
              <span
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '17px',
                  color: theme.primaryText,
                  lineHeight: 1.6,
                }}
              >
                {bullet}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ComparisonSlide({ slide, theme }: SlideProps) {
  const accent = getAccent(slide, theme);
  const isDark = theme.id === 'aurora';

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: theme.slideBg, padding: '64px' }}
    >
      <div className="mb-8">
        <div
          className="mb-5 rounded-full"
          style={{ width: '40px', height: '4px', backgroundColor: accent }}
        />
        <h2
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '42px',
            fontWeight: 700,
            color: theme.primaryText,
          }}
        >
          {slide.title}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-8 h-[calc(100%-160px)]">
        {slide.comparisonColumns?.map((col, colIdx) => (
          <div
            key={colIdx}
            className="rounded-2xl p-8 flex flex-col"
            style={{
              background: col.highlight
                ? isDark ? `${accent}15` : `${accent}0D`
                : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
              border: col.highlight
                ? `2px solid ${accent}40`
                : isDark ? '2px solid rgba(255,255,255,0.06)' : '2px solid rgba(0,0,0,0.06)',
            }}
          >
            <h3
              className="mb-6 font-semibold"
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '20px',
                color: col.highlight ? accent : theme.secondaryText,
                letterSpacing: '-0.01em',
              }}
            >
              {col.title}
            </h3>
            <div className="space-y-3 flex-1">
              {col.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="flex-shrink-0 rounded-full flex items-center justify-center"
                    style={{
                      width: '20px',
                      height: '20px',
                      background: col.highlight ? accent : theme.secondaryText + '40',
                    }}
                  >
                    {col.highlight ? (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
                        <path d="M1 1H7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                  <span
                    style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: '16px',
                      color: col.highlight ? theme.primaryText : theme.secondaryText,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function KpiDashboardSlide({ slide, theme }: SlideProps) {
  const accent = getAccent(slide, theme);
  const isDark = theme.id === 'aurora';

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: theme.slideBg, padding: '64px' }}
    >
      <div className="mb-10">
        <div
          className="mb-5 rounded-full"
          style={{ width: '40px', height: '4px', backgroundColor: accent }}
        />
        <h2
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '42px',
            fontWeight: 700,
            color: theme.primaryText,
            lineHeight: 1.1,
          }}
        >
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '16px', color: theme.secondaryText, marginTop: '8px' }}>
            {slide.subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-4 gap-6">
        {slide.kpis?.map((kpi, i) => (
          <div
            key={i}
            className="rounded-2xl p-6"
            style={{
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '40px',
                fontWeight: 600,
                color: theme.primaryText,
                lineHeight: 1.1,
                marginBottom: '8px',
              }}
            >
              {kpi.value}
            </div>
            {kpi.trend && (
              <div
                className="mb-3 px-2 py-1 rounded inline-block"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: accent,
                  background: `${accent}18`,
                  letterSpacing: '0.04em',
                }}
              >
                ↑ {kpi.trend}
              </div>
            )}
            <div
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: theme.secondaryText,
                lineHeight: 1.4,
              }}
            >
              {kpi.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProcessFlowSlide({ slide, theme }: SlideProps) {
  const accent = getAccent(slide, theme);
  const isDark = theme.id === 'aurora';

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: theme.slideBg, padding: '64px' }}
    >
      <div className="mb-12">
        <div
          className="mb-5 rounded-full"
          style={{ width: '40px', height: '4px', backgroundColor: accent }}
        />
        <h2
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '42px',
            fontWeight: 700,
            color: theme.primaryText,
          }}
        >
          {slide.title}
        </h2>
      </div>

      <div className="flex items-start gap-4">
        {slide.processSteps?.map((step, i) => (
          <React.Fragment key={i}>
            <div className="flex-1 flex flex-col items-center text-center">
              <div
                className="rounded-2xl flex items-center justify-center mb-5"
                style={{
                  width: '60px',
                  height: '60px',
                  background: `${accent}20`,
                  border: `2px solid ${accent}40`,
                }}
              >
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '22px',
                    fontWeight: 700,
                    color: accent,
                  }}
                >
                  {step.number}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: theme.primaryText,
                  marginBottom: '8px',
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '14px',
                  color: theme.secondaryText,
                  lineHeight: 1.5,
                }}
              >
                {step.description}
              </p>
            </div>
            {i < (slide.processSteps?.length || 0) - 1 && (
              <div
                className="flex-shrink-0 mt-7"
                style={{ width: '40px', height: '2px', background: `${accent}30`, marginTop: '34px' }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function TimelineSlide({ slide, theme }: SlideProps) {
  const accent = getAccent(slide, theme);
  const isDark = theme.id === 'aurora';

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: theme.slideBg, padding: '64px' }}
    >
      <div className="mb-10">
        <div
          className="mb-5 rounded-full"
          style={{ width: '40px', height: '4px', backgroundColor: accent }}
        />
        <h2
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '42px',
            fontWeight: 700,
            color: theme.primaryText,
          }}
        >
          {slide.title}
        </h2>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div
          className="absolute left-0 top-4 bottom-0"
          style={{ width: '2px', background: `${accent}25`, left: '110px' }}
        />

        <div className="space-y-6">
          {slide.timelineMilestones?.map((milestone, i) => (
            <div key={i} className="flex items-start gap-8">
              <div
                className="flex-shrink-0 text-right"
                style={{
                  width: '90px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: accent,
                  paddingTop: '4px',
                }}
              >
                {milestone.date}
              </div>
              
              {/* Dot */}
              <div className="flex-shrink-0 relative z-10" style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
                <div
                  className="rounded-full"
                  style={{
                    width: '14px',
                    height: '14px',
                    background: accent,
                    marginTop: '4px',
                    boxShadow: `0 0 12px ${accent}60`,
                  }}
                />
              </div>

              <div style={{ paddingBottom: '8px' }}>
                <h3
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: theme.primaryText,
                    marginBottom: '4px',
                  }}
                >
                  {milestone.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '14px',
                    color: theme.secondaryText,
                    lineHeight: 1.5,
                  }}
                >
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function QuoteSlide({ slide, theme }: SlideProps) {
  const accent = getAccent(slide, theme);
  const isDark = theme.id === 'aurora';

  return (
    <div
      className="relative w-full h-full overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: theme.slideBg }}
    >
      {/* Background accent */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{ background: accent, filter: 'blur(120px)', top: '-20%', right: '-10%' }}
      />

      <div className="relative z-10 max-w-[80%] text-center" style={{ padding: '64px' }}>
        {/* Quote mark */}
        <div
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '120px',
            color: accent,
            lineHeight: 0.7,
            marginBottom: '32px',
            opacity: 0.4,
          }}
        >
          "
        </div>

        <blockquote
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '28px',
            fontWeight: 400,
            fontStyle: 'italic',
            color: theme.primaryText,
            lineHeight: 1.5,
            marginBottom: '40px',
          }}
        >
          {slide.quote}
        </blockquote>

        {slide.quoteAuthor && (
          <div className="flex flex-col items-center gap-2">
            <div
              style={{
                width: '40px',
                height: '2px',
                background: accent,
                marginBottom: '8px',
              }}
            />
            <span
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                color: theme.secondaryText,
              }}
            >
              {slide.quoteAuthor}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ClosingSlide({ slide, theme }: SlideProps) {
  const accent = getAccent(slide, theme);
  const isDark = theme.id === 'aurora';

  return (
    <div
      className="relative w-full h-full overflow-hidden flex items-center"
      style={{ backgroundColor: theme.slideBg, padding: '64px' }}
    >
      {/* Large decorative accent shape */}
      <div
        className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none"
        style={{
          width: '40%',
          background: `linear-gradient(to left, ${accent}, transparent)`,
        }}
      />
      <div
        className="absolute w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: accent, filter: 'blur(80px)', bottom: '-10%', right: '5%' }}
      />

      <div className="relative z-10 max-w-[65%]">
        <div
          className="mb-8 rounded-full"
          style={{ width: '48px', height: '4px', backgroundColor: accent }}
        />

        <h2
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '56px',
            fontWeight: 700,
            color: theme.primaryText,
            lineHeight: 1.05,
            marginBottom: '24px',
          }}
        >
          {slide.title}
        </h2>

        {slide.subtitle && (
          <p
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '20px',
              color: theme.secondaryText,
              lineHeight: 1.6,
              marginBottom: '32px',
            }}
          >
            {slide.subtitle}
          </p>
        )}

        {slide.body && (
          <div
            className="px-4 py-3 rounded-lg inline-block"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '14px',
              fontWeight: 500,
              color: accent,
              background: `${accent}12`,
              border: `1px solid ${accent}30`,
            }}
          >
            {slide.body}
          </div>
        )}
      </div>
    </div>
  );
}

export function DiagramSlide({ slide, theme }: SlideProps) {
  const accent = getAccent(slide, theme);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: theme.slideBg, padding: '64px' }}
    >
      <div className="mb-8">
        <div className="mb-5 rounded-full" style={{ width: '40px', height: '4px', backgroundColor: accent }} />
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '42px', fontWeight: 700, color: theme.primaryText }}>
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '16px', color: theme.secondaryText, marginTop: '8px' }}>
            {slide.subtitle}
          </p>
        )}
      </div>
      
      {/* Funnel diagram */}
      <div className="flex flex-col items-center justify-center gap-2 mt-8">
        {['Awareness', 'Interest', 'Consideration', 'Conversion'].map((stage, i) => (
          <div
            key={i}
            className="flex items-center justify-center text-center rounded-lg"
            style={{
              width: `${85 - i * 15}%`,
              height: '52px',
              background: i === 0 ? accent : `${accent}${Math.round((0.7 - i * 0.15) * 255).toString(16).padStart(2, '0')}`,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '16px',
              fontWeight: 600,
              color: i === 0 ? '#fff' : theme.primaryText,
            }}
          >
            {stage}
          </div>
        ))}
      </div>
    </div>
  );
}

// Main SlideRenderer component
export function SlideRenderer({ slide, theme, isEditing, onTextEdit, scale = 1 }: SlideProps) {
  const components: Record<string, React.ComponentType<SlideProps>> = {
    'hero-title': HeroTitleSlide,
    'section-divider': SectionDividerSlide,
    'agenda': AgendaSlide,
    'bullet-image': BulletImageSlide,
    'two-column': TwoColumnSlide,
    'comparison': ComparisonSlide,
    'kpi-dashboard': KpiDashboardSlide,
    'process-flow': ProcessFlowSlide,
    'timeline': TimelineSlide,
    'quote': QuoteSlide,
    'closing': ClosingSlide,
    'diagram': DiagramSlide,
  };

  const Component = components[slide.type] || HeroTitleSlide;
  return <Component slide={slide} theme={theme} isEditing={isEditing} onTextEdit={onTextEdit} scale={scale} />;
}
