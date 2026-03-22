import { OutlineSlide, SlideLayout, SlidePurpose, ContentType, Tone } from '@/lib/schema';

interface GenerateOutlineParams {
  prompt: string;
  audience: string;
  tone: Tone;
  contentType: ContentType;
  slideCount: number;
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;

export async function generateOutline(params: GenerateOutlineParams): Promise<OutlineSlide[]> {
  const { prompt, audience, tone, contentType, slideCount } = params;

  if (!OPENAI_API_KEY) {
    return generateOutlineFallback(params);
  }

  const systemPrompt = `You are an expert presentation designer and strategist. Generate a compelling presentation outline.
Return ONLY a valid JSON array. No markdown, no code blocks, just raw JSON.`;

  const userPrompt = `Create a ${slideCount}-slide presentation outline with this info:
Topic: ${prompt}
Audience: ${audience || 'General audience'}
Tone: ${tone}
Content Type: ${contentType}

Each slide object must have:
- id: string (e.g. "outline-0")
- title: string (concise, compelling slide title)
- purpose: one of: intro | section-header | agenda | content | data | process | timeline | quote | comparison | closing
- layout: one of: title-hero-left | title-hero-right | dark-accent | agenda-clean | bullets-with-side-image | two-column-explainer | comparison-split | stat-cards-grid | horizontal-process | milestone-timeline | quote-impact | closing-contact | architecture-diagram
- contentIntent: string (1 sentence describing what content goes on this slide)
- hasVisual: boolean

Rules:
- Slide 1 must be intro (hero title)
- Slide 2 is often agenda
- Last slide must be closing
- Match layout to purpose logically
- Titles should be punchy and specific to the topic

Return ONLY the JSON array, nothing else.`;

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
        max_tokens: 2000,
      }),
    });

    if (!res.ok) {
      console.warn('OpenAI API error, falling back to local generation');
      return generateOutlineFallback(params);
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || '';

    // Parse JSON — strip any accidental markdown code fences
    const cleaned = raw.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
    const outline = JSON.parse(cleaned) as OutlineSlide[];

    return outline.slice(0, slideCount).map((s, i) => ({
      ...s,
      id: s.id || `outline-${i}`,
    }));
  } catch (e) {
    console.warn('Failed to parse AI outline, using fallback:', e);
    return generateOutlineFallback(params);
  }
}

// ─── Fallback (no API key or error) ───────────────────────────────────────────

function generateOutlineFallback({ prompt, slideCount, contentType }: GenerateOutlineParams): OutlineSlide[] {
  const topicWords = prompt.split(' ').slice(0, 4).join(' ');

  const templates: Record<ContentType, Array<{ title: string; purpose: SlidePurpose; layout: SlideLayout; contentIntent: string; hasVisual: boolean }>> = {
    business: [
      { title: topicWords || 'Executive Overview', purpose: 'intro', layout: 'title-hero-left', contentIntent: 'Set the stage with compelling headline and context', hasVisual: true },
      { title: 'Agenda', purpose: 'agenda', layout: 'agenda-clean', contentIntent: 'Preview the key topics to be covered', hasVisual: false },
      { title: 'The Challenge We Solve', purpose: 'content', layout: 'two-column-explainer', contentIntent: 'Define the core problem and market opportunity', hasVisual: false },
      { title: 'Key Metrics & Results', purpose: 'data', layout: 'stat-cards-grid', contentIntent: 'Present the most impactful numbers and KPIs', hasVisual: false },
      { title: 'Our Approach', purpose: 'content', layout: 'bullets-with-side-image', contentIntent: 'Explain the methodology and differentiators', hasVisual: true },
      { title: 'Competitive Landscape', purpose: 'comparison', layout: 'comparison-split', contentIntent: 'Show how we compare to alternatives', hasVisual: false },
      { title: 'Our Process', purpose: 'process', layout: 'horizontal-process', contentIntent: 'Walk through the step-by-step workflow', hasVisual: false },
      { title: 'Roadmap & Milestones', purpose: 'timeline', layout: 'milestone-timeline', contentIntent: 'Show progress and planned milestones', hasVisual: false },
      { title: 'What Our Customers Say', purpose: 'quote', layout: 'quote-impact', contentIntent: 'Feature a compelling customer testimonial', hasVisual: false },
      { title: 'Next Steps', purpose: 'closing', layout: 'closing-contact', contentIntent: 'Clear call to action and contact information', hasVisual: false },
    ],
    sales: [
      { title: topicWords || 'The Opportunity', purpose: 'intro', layout: 'title-hero-right', contentIntent: 'Hook the audience with the core value proposition', hasVisual: true },
      { title: 'The Problem Today', purpose: 'section-header', layout: 'dark-accent', contentIntent: 'Identify the pain point clearly', hasVisual: false },
      { title: 'Before vs. After', purpose: 'comparison', layout: 'comparison-split', contentIntent: 'Show the transformation our solution delivers', hasVisual: false },
      { title: 'How It Works', purpose: 'process', layout: 'horizontal-process', contentIntent: 'Explain the solution in simple steps', hasVisual: false },
      { title: 'Results by the Numbers', purpose: 'data', layout: 'stat-cards-grid', contentIntent: 'Proof points and ROI data', hasVisual: false },
      { title: 'Customer Success Story', purpose: 'quote', layout: 'quote-impact', contentIntent: 'Real customer testimonial with results', hasVisual: false },
      { title: 'Get Started Today', purpose: 'closing', layout: 'closing-contact', contentIntent: 'Clear next steps and CTA', hasVisual: false },
    ],
    educational: [
      { title: topicWords || 'Introduction', purpose: 'intro', layout: 'title-hero-left', contentIntent: 'Introduce the topic and learning objectives', hasVisual: true },
      { title: 'Learning Objectives', purpose: 'agenda', layout: 'agenda-clean', contentIntent: 'What participants will learn today', hasVisual: false },
      { title: 'Key Concepts', purpose: 'content', layout: 'two-column-explainer', contentIntent: 'Core concepts explained clearly', hasVisual: false },
      { title: 'Deep Dive', purpose: 'content', layout: 'bullets-with-side-image', contentIntent: 'Detailed breakdown of the main topic', hasVisual: true },
      { title: 'Data & Evidence', purpose: 'data', layout: 'stat-cards-grid', contentIntent: 'Research findings and supporting data', hasVisual: false },
      { title: 'Step-by-Step Process', purpose: 'process', layout: 'horizontal-process', contentIntent: 'Practical application guide', hasVisual: false },
      { title: 'Case Study', purpose: 'content', layout: 'bullets-with-side-image', contentIntent: 'Real-world example illustrating the concepts', hasVisual: true },
      { title: 'Key Takeaways', purpose: 'closing', layout: 'closing-contact', contentIntent: 'Summary and next learning steps', hasVisual: false },
    ],
    research: [
      { title: topicWords || 'Research Overview', purpose: 'intro', layout: 'title-hero-left', contentIntent: 'State the research question and significance', hasVisual: false },
      { title: 'Methodology', purpose: 'agenda', layout: 'agenda-clean', contentIntent: 'Research approach and data sources', hasVisual: false },
      { title: 'Background & Context', purpose: 'content', layout: 'two-column-explainer', contentIntent: 'Literature review and prior work', hasVisual: false },
      { title: 'Key Findings', purpose: 'data', layout: 'stat-cards-grid', contentIntent: 'Primary results and statistics', hasVisual: false },
      { title: 'Analysis', purpose: 'content', layout: 'bullets-with-side-image', contentIntent: 'Interpretation of findings', hasVisual: true },
      { title: 'Implications', purpose: 'comparison', layout: 'comparison-split', contentIntent: 'What these findings mean in practice', hasVisual: false },
      { title: 'Conclusions', purpose: 'closing', layout: 'closing-contact', contentIntent: 'Summary, limitations, and future work', hasVisual: false },
    ],
    product: [
      { title: topicWords || 'Product Overview', purpose: 'intro', layout: 'title-hero-right', contentIntent: 'Hero moment for the product', hasVisual: true },
      { title: 'The Problem', purpose: 'section-header', layout: 'dark-accent', contentIntent: 'Pain point the product solves', hasVisual: false },
      { title: 'Our Solution', purpose: 'content', layout: 'two-column-explainer', contentIntent: 'Product value proposition', hasVisual: false },
      { title: 'Key Features', purpose: 'content', layout: 'bullets-with-side-image', contentIntent: 'Core feature highlights', hasVisual: true },
      { title: 'Product Metrics', purpose: 'data', layout: 'stat-cards-grid', contentIntent: 'Usage, satisfaction, and growth numbers', hasVisual: false },
      { title: 'Roadmap', purpose: 'process', layout: 'horizontal-process', contentIntent: 'What\'s coming next', hasVisual: false },
      { title: 'Get Started', purpose: 'closing', layout: 'closing-contact', contentIntent: 'CTA and onboarding next steps', hasVisual: false },
    ],
    proposal: [
      { title: topicWords || 'Proposal Overview', purpose: 'intro', layout: 'title-hero-left', contentIntent: 'Executive summary of the proposal', hasVisual: false },
      { title: 'Agenda', purpose: 'agenda', layout: 'agenda-clean', contentIntent: 'Proposal structure walkthrough', hasVisual: false },
      { title: 'Understanding Your Needs', purpose: 'content', layout: 'two-column-explainer', contentIntent: 'Demonstrate understanding of the challenge', hasVisual: false },
      { title: 'Our Proposed Solution', purpose: 'content', layout: 'bullets-with-side-image', contentIntent: 'Detailed solution description', hasVisual: true },
      { title: 'Investment & ROI', purpose: 'data', layout: 'stat-cards-grid', contentIntent: 'Pricing, value delivered, ROI projection', hasVisual: false },
      { title: 'Implementation Plan', purpose: 'process', layout: 'horizontal-process', contentIntent: 'Timeline and milestones', hasVisual: false },
      { title: 'Our Team', purpose: 'content', layout: 'two-column-explainer', contentIntent: 'Relevant expertise and credentials', hasVisual: false },
      { title: 'Why Us', purpose: 'comparison', layout: 'comparison-split', contentIntent: 'Differentiators vs. alternatives', hasVisual: false },
      { title: 'Next Steps', purpose: 'closing', layout: 'closing-contact', contentIntent: 'How to move forward together', hasVisual: false },
    ],
  };

  const template = templates[contentType] || templates.business;
  return template.slice(0, slideCount).map((t, i) => ({
    ...t,
    id: `outline-${i}`,
  }));
}
