import { OutlineSlide, Slide, ContentType, Tone } from '@/lib/schema';
import { ThemeId } from '@/lib/themes';

interface GenerateDeckParams {
  outline: OutlineSlide[];
  prompt: string;
  audience: string;
  tone: Tone;
  contentType: ContentType;
  themeId: ThemeId;
  onProgress?: (stage: number) => void;
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;

export async function generateDeck(params: GenerateDeckParams): Promise<Slide[]> {
  const { outline, prompt, audience, tone, contentType, themeId, onProgress } = params;

  onProgress?.(1);

  if (!OPENAI_API_KEY) {
    // Simulate generation time
    await new Promise(r => setTimeout(r, 800));
    onProgress?.(2);
    await new Promise(r => setTimeout(r, 800));
    onProgress?.(3);
    await new Promise(r => setTimeout(r, 600));
    onProgress?.(4);
    return generateDeckFallback(outline, prompt, audience, tone);
  }

  const systemPrompt = `You are an expert presentation content writer. Generate complete slide content for a presentation.
Return ONLY a valid JSON array of slide objects. No markdown, no code blocks, just raw JSON.`;

  const slideDescriptions = outline.map((s, i) =>
    `Slide ${i + 1}: "${s.title}" — ${s.purpose} — layout: ${s.layout} — intent: ${s.contentIntent}`
  ).join('\n');

  const userPrompt = `Generate slide content for this ${contentType} presentation:
Topic: ${prompt}
Audience: ${audience || 'General audience'}  
Tone: ${tone}

Outline:
${slideDescriptions}

For each slide, return a JSON object with these fields (only include relevant fields based on layout):
- id: string (e.g. "gen-0")
- type: match to layout — hero-title | section-divider | agenda | bullet-image | two-column | comparison | kpi-dashboard | process-flow | timeline | quote | closing | diagram
- layout: use exactly the layout from the outline
- purpose: use exactly the purpose from the outline
- title: string (the slide title)
- subtitle: string (optional supporting line)
- body: string (optional additional text)
- bullets: string[] (for agenda/bullet slides — 4-6 items, start each with a short label or emoji)
- quote: string (for quote slides — compelling quote, 1-2 sentences)
- quoteAuthor: string (for quote slides)
- kpis: array of {value: string, label: string, trend: string} (for kpi-dashboard — 4 items)
- processSteps: array of {number: number, title: string, description: string} (for process-flow — 3-5 steps)
- timelineMilestones: array of {date: string, title: string, description: string} (for timeline — 4-6 items)
- comparisonColumns: array of {title: string, items: string[], highlight: boolean} (for comparison — 2 columns, 4-5 items each)
- notes: string (1 sentence speaker note)

Make content specific to the topic "${prompt}", not generic. Be concrete with numbers where applicable.
Return ONLY the JSON array.`;

  try {
    onProgress?.(1);
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.75,
        max_tokens: 4000,
      }),
    });

    onProgress?.(2);

    if (!res.ok) {
      console.warn('OpenAI API error generating deck, using fallback');
      await new Promise(r => setTimeout(r, 400));
      onProgress?.(3);
      await new Promise(r => setTimeout(r, 400));
      onProgress?.(4);
      return generateDeckFallback(outline, prompt, audience, tone);
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || '';
    const cleaned = raw.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
    const slides = JSON.parse(cleaned) as Partial<Slide>[];

    onProgress?.(3);
    await new Promise(r => setTimeout(r, 300));
    onProgress?.(4);

    return slides.map((s, i) => ({
      id: `gen-${Date.now()}-${i}`,
      type: s.type || (outline[i]?.layout?.includes('hero') ? 'hero-title' : 'two-column'),
      layout: s.layout || outline[i]?.layout || 'two-column-explainer',
      purpose: s.purpose || outline[i]?.purpose || 'content',
      title: s.title || outline[i]?.title || `Slide ${i + 1}`,
      subtitle: s.subtitle,
      body: s.body,
      bullets: s.bullets,
      quote: s.quote,
      quoteAuthor: s.quoteAuthor,
      kpis: s.kpis,
      processSteps: s.processSteps,
      timelineMilestones: s.timelineMilestones,
      comparisonColumns: s.comparisonColumns,
      notes: s.notes,
    } as Slide));
  } catch (e) {
    console.warn('Failed to parse AI deck, using fallback:', e);
    onProgress?.(3);
    await new Promise(r => setTimeout(r, 300));
    onProgress?.(4);
    return generateDeckFallback(outline, prompt, audience, tone);
  }
}

// ─── Revise single slide ───────────────────────────────────────────────────────

export async function reviseSlide(slide: Slide, instruction: string): Promise<Partial<Slide>> {
  if (!OPENAI_API_KEY) {
    // Return a slightly modified version
    await new Promise(r => setTimeout(r, 1200));
    return {
      title: slide.title,
      subtitle: instruction.includes('concise')
        ? slide.subtitle?.split(' ').slice(0, 5).join(' ')
        : slide.subtitle,
      bullets: slide.bullets?.map(b => instruction.includes('shorter') ? b.split(' ').slice(0, 6).join(' ') : b),
    };
  }

  const systemPrompt = `You are an expert slide content writer. Revise the provided slide content based on the user's instruction.
Return ONLY a valid JSON object with the updated fields. No markdown, no code blocks.`;

  const userPrompt = `Revise this slide:
${JSON.stringify(slide, null, 2)}

Instruction: ${instruction}

Return only the changed fields as a JSON object (title, subtitle, body, bullets, quote, quoteAuthor, kpis, etc.)
Only return fields that should change.`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!res.ok) return {};
    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || '';
    const cleaned = raw.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
    return JSON.parse(cleaned) as Partial<Slide>;
  } catch (e) {
    console.warn('reviseSlide failed:', e);
    return {};
  }
}

// ─── Fallback deck generation ──────────────────────────────────────────────────

function generateDeckFallback(outline: OutlineSlide[], prompt: string, _audience: string, _tone: Tone): Slide[] {
  const topic = prompt.split(' ').slice(0, 5).join(' ');

  return outline.map((item, i) => {
    const base: Slide = {
      id: `gen-${Date.now()}-${i}`,
      type: layoutToType(item.layout),
      layout: item.layout,
      purpose: item.purpose,
      title: item.title,
    };

    switch (item.purpose) {
      case 'intro':
        return {
          ...base,
          subtitle: `A comprehensive look at ${topic}`,
          body: new Date().getFullYear().toString(),
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        };
      case 'agenda':
        return {
          ...base,
          bullets: outline
            .filter(s => s.purpose !== 'intro' && s.purpose !== 'agenda')
            .slice(0, 5)
            .map((s, j) => `${String(j + 1).padStart(2, '0')} — ${s.title}`),
        };
      case 'data':
        return {
          ...base,
          subtitle: 'Key Performance Indicators',
          kpis: [
            { value: '3.2x', label: 'Growth Rate', trend: '+40%' },
            { value: '94%', label: 'Satisfaction Score', trend: '+8%' },
            { value: '$2.1M', label: 'Revenue Impact', trend: '+22%' },
            { value: '1,200+', label: 'Active Users', trend: '+15%' },
          ],
        };
      case 'comparison':
        return {
          ...base,
          comparisonColumns: [
            {
              title: 'Traditional Approach',
              items: ['Manual processes', 'High error rate', 'Slow turnaround', 'Limited scalability', 'High cost'],
              highlight: false,
            },
            {
              title: item.title.includes('Our') ? 'Our Solution' : 'New Approach',
              items: ['Automated workflows', 'Near-zero errors', '10x faster delivery', 'Infinitely scalable', 'Lower TCO'],
              highlight: true,
            },
          ],
        };
      case 'process':
        return {
          ...base,
          subtitle: 'A proven step-by-step approach',
          processSteps: [
            { number: 1, title: 'Discover', description: 'Understand current state and define goals' },
            { number: 2, title: 'Design', description: 'Architect the optimal solution' },
            { number: 3, title: 'Build', description: 'Execute with precision and speed' },
            { number: 4, title: 'Launch', description: 'Deploy and measure results' },
          ],
        };
      case 'timeline':
        return {
          ...base,
          subtitle: 'Our journey and roadmap',
          timelineMilestones: [
            { date: 'Q1', title: 'Foundation', description: 'Core infrastructure and team assembled' },
            { date: 'Q2', title: 'Launch', description: 'First customers onboarded successfully' },
            { date: 'Q3', title: 'Scale', description: 'Rapid growth across key markets' },
            { date: 'Q4', title: 'Expand', description: 'New markets and partnerships' },
          ],
        };
      case 'quote':
        return {
          ...base,
          quote: `The impact has been transformational. We've seen dramatic improvements across every metric that matters to our business since adopting this approach.`,
          quoteAuthor: 'Senior Director of Strategy',
        };
      case 'section-header':
        return {
          ...base,
          subtitle: item.contentIntent,
        };
      case 'closing':
        return {
          ...base,
          subtitle: `Thank you for your time and attention.`,
          body: 'Let\'s connect and take the next step together.',
        };
      default:
        return {
          ...base,
          subtitle: item.contentIntent,
          bullets: [
            `Key insight about ${topic}`,
            'Supporting evidence and data',
            'Strategic implication',
            'Recommended next action',
          ],
        };
    }
  });
}

function layoutToType(layout: string): Slide['type'] {
  const map: Record<string, Slide['type']> = {
    'title-hero-left': 'hero-title',
    'title-hero-right': 'hero-title',
    'dark-accent': 'section-divider',
    'agenda-clean': 'agenda',
    'bullets-with-side-image': 'bullet-image',
    'two-column-explainer': 'two-column',
    'comparison-split': 'comparison',
    'stat-cards-grid': 'kpi-dashboard',
    'horizontal-process': 'process-flow',
    'milestone-timeline': 'timeline',
    'quote-impact': 'quote',
    'closing-contact': 'closing',
    'architecture-diagram': 'diagram',
  };
  return map[layout] || 'two-column';
}
