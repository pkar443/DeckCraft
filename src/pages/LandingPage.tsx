import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Zap, Palette, Download, Star, ChevronRight, 
  Check, ArrowRight, Play, Brain, Layout, FileText
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: '#0F1117', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#F1F5F9' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(15,17,23,0.8)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">DeckCraft</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it works', 'Pricing', 'Templates'].map(item => (
            <a key={item} href="#" className="text-sm font-medium transition-colors" style={{ color: 'rgba(255,255,255,0.55)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{ color: 'rgba(255,255,255,0.7)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          >
            Sign in
          </button>
          <button onClick={() => navigate('/signup')}
            className="px-5 py-2 text-sm font-semibold rounded-lg transition-all"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Get started free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-24">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        
        {/* Orbs */}
        <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #2563EB22 0%, transparent 70%)', top: '-10%', left: '-5%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7C3AED18 0%, transparent 70%)', bottom: '-10%', right: '10%' }} />

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-10 grid grid-cols-2 gap-16 items-center py-20">
          {/* Left content */}
          <motion.div variants={stagger} initial="initial" animate="animate">
            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
                style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)' }}>
                <Sparkles className="w-3.5 h-3.5" style={{ color: '#60A5FA' }} />
                <span className="text-xs font-semibold" style={{ color: '#60A5FA', letterSpacing: '0.05em' }}>
                  AI-POWERED PRESENTATION BUILDER
                </span>
              </div>
            </motion.div>

            <motion.h1 {...fadeUp} className="mb-6 leading-tight"
              style={{ fontFamily: 'Fraunces, serif', fontSize: '72px', fontWeight: 700, lineHeight: 1.02, color: '#F8FAFF' }}>
              Presentations that
              <br />
              <span style={{ background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                impress by default
              </span>
            </motion.h1>

            <motion.p {...fadeUp} className="mb-10 max-w-[520px]"
              style={{ fontSize: '20px', color: 'rgba(241,245,249,0.65)', lineHeight: 1.65, fontWeight: 400 }}>
              Turn any prompt or document into a boardroom-ready slide deck in seconds. 
              AI-generated, professionally designed, endlessly editable.
            </motion.p>

            <motion.div {...fadeUp} className="flex items-center gap-4">
              <button onClick={() => navigate('/signup')}
                className="flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-base transition-all"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff', boxShadow: '0 4px 24px rgba(37,99,235,0.4)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,99,235,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(37,99,235,0.4)'; }}
              >
                <Sparkles className="w-4 h-4" />
                Create your first deck — free
              </button>
              <button onClick={() => navigate('/decks/demo')}
                className="flex items-center gap-2 px-6 py-4 rounded-xl font-medium text-base transition-all"
                style={{ color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.12)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
              >
                <Play className="w-4 h-4" />
                See live demo
              </button>
            </motion.div>

            <motion.div {...fadeUp} className="flex items-center gap-6 mt-8">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0F1117] overflow-hidden"
                    style={{ background: `hsl(${i * 60}, 70%, 50%)` }}>
                    <img src={`https://images.unsplash.com/photo-${1500000000000 + i * 10000000}?w=40&q=80&fit=crop&crop=face`} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Trusted by 12,000+ teams</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Editor mockup */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative">
            <div className="rounded-2xl overflow-hidden"
              style={{ background: '#181C27', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 120px rgba(0,0,0,0.6)', aspectRatio: '16/10' }}>
              {/* Toolbar mockup */}
              <div className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#13171F' }}>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Q4 Business Review — DeckCraft</span>
                </div>
              </div>
              {/* Editor area */}
              <div className="flex h-[calc(100%-44px)]">
                {/* Thumbnails */}
                <div className="w-16 flex flex-col gap-1.5 p-2" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="rounded-sm overflow-hidden aspect-video cursor-pointer"
                      style={{
                        background: i === 0 ? 'linear-gradient(135deg, #F8FAFF, #DBEAFE)' : 'rgba(255,255,255,0.04)',
                        border: i === 0 ? '2px solid #2563EB' : '1px solid rgba(255,255,255,0.06)',
                      }}>
                      {i === 0 && <div className="w-full h-full flex items-center justify-center">
                        <div className="w-5 h-1 rounded-full" style={{ background: '#2563EB' }} />
                      </div>}
                    </div>
                  ))}
                </div>
                {/* Canvas */}
                <div className="flex-1 flex items-center justify-center p-4" style={{ background: '#0D0F16' }}>
                  <div className="w-full max-w-[380px] rounded-lg overflow-hidden"
                    style={{ background: '#F8FAFF', aspectRatio: '16/9', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
                    <div className="w-full h-full flex flex-col justify-center p-6">
                      <div className="w-8 h-0.5 rounded-full mb-3" style={{ background: '#2563EB' }} />
                      <div className="font-display text-sm font-bold mb-1.5" style={{ fontFamily: 'Fraunces, serif', color: '#0F172A', fontSize: '13px' }}>
                        Q4 Business Review
                      </div>
                      <div className="text-xs" style={{ color: '#475569', fontSize: '9px' }}>Performance Analysis & Strategic Outlook</div>
                    </div>
                  </div>
                </div>
                {/* Properties panel */}
                <div className="w-32 p-2.5" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="text-[10px] font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>PROPERTIES</div>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="mb-2">
                      <div className="h-1.5 rounded-full mb-1" style={{ width: `${60 + i * 10}%`, background: 'rgba(255,255,255,0.08)' }} />
                      <div className="h-5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -left-8 top-1/4 rounded-xl px-3 py-2.5 text-xs"
              style={{ background: '#181C27', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', color: '#60A5FA', fontWeight: 600 }}>
              <span className="text-green-400 mr-1">✓</span> Slide 3 generated
            </div>
            <div className="absolute -right-8 bottom-1/4 rounded-xl px-3 py-2.5 text-xs"
              style={{ background: '#181C27', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', color: '#A78BFA', fontWeight: 600 }}>
              <Sparkles className="w-3 h-3 inline mr-1.5" />
              AI rewriting...
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-32 px-10 max-w-[1400px] mx-auto">
        <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-sm font-semibold mb-4 uppercase tracking-widest" style={{ color: '#60A5FA' }}>Simple process</p>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '52px', fontWeight: 700, color: '#F8FAFF', lineHeight: 1.1 }}>
            From idea to deck in<br />
            <span style={{ color: '#60A5FA' }}>three steps</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-3 gap-8">
          {[
            { icon: FileText, step: '01', title: 'Describe your deck', desc: 'Enter your topic, audience, and tone. Upload existing content or start from scratch with a simple prompt.', color: '#2563EB' },
            { icon: Brain, step: '02', title: 'AI generates your deck', desc: 'Our AI creates a structured outline, fills every slide with content, and selects the perfect layout for each section.', color: '#7C3AED' },
            { icon: Layout, step: '03', title: 'Edit & export', desc: 'Click any element to edit inline. Switch themes, reorder slides, rewrite with AI. Export to PDF in one click.', color: '#0891B2' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="absolute top-6 right-6" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '48px', fontWeight: 700, color: 'rgba(255,255,255,0.04)' }}>
                {item.step}
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#F8FAFF', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(241,245,249,0.55)' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-16 px-10 max-w-[1400px] mx-auto">
        <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-sm font-semibold mb-4 uppercase tracking-widest" style={{ color: '#A78BFA' }}>Capabilities</p>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '52px', fontWeight: 700, color: '#F8FAFF', lineHeight: 1.1 }}>
            Everything you need to <br />
            <span style={{ color: '#A78BFA' }}>craft perfect decks</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-12 gap-5">
          {/* Large feature card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="col-span-7 rounded-2xl p-8 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1a1f35, #181C27)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '280px' }}>
            <div className="absolute w-64 h-64 rounded-full pointer-events-none" style={{ background: 'rgba(37,99,235,0.15)', filter: 'blur(60px)', right: '-10%', bottom: '-10%' }} />
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.4)' }}>
              <Brain className="w-5 h-5" style={{ color: '#60A5FA' }} />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#F8FAFF', fontFamily: 'Fraunces, serif' }}>AI-Powered Generation</h3>
            <p className="text-sm leading-relaxed max-w-md" style={{ color: 'rgba(241,245,249,0.55)' }}>
              Full deck from a single prompt. Our AI understands context, audience, and tone to produce structured, content-rich slides that feel designed, not generated.
            </p>
          </motion.div>

          {/* Theme system */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-5 rounded-2xl p-8 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)' }}>
              <Palette className="w-5 h-5" style={{ color: '#A78BFA' }} />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#F8FAFF', fontFamily: 'Fraunces, serif' }}>3 Premium Themes</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(241,245,249,0.55)' }}>
              Modern Cobalt, Warm Sand, Graphite Aurora. Switch themes instantly and watch every slide transform.
            </p>
            <div className="flex gap-2 mt-6">
              {['#2563EB', '#B45309', '#34D399'].map((color, i) => (
                <div key={i} className="w-6 h-6 rounded-full shadow-lg" style={{ background: color }} />
              ))}
            </div>
          </motion.div>

          {/* Inline editing */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
            className="col-span-5 rounded-2xl p-8 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(8,145,178,0.2)', border: '1px solid rgba(8,145,178,0.4)' }}>
              <Zap className="w-5 h-5" style={{ color: '#22D3EE' }} />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#F8FAFF', fontFamily: 'Fraunces, serif' }}>Click-to-Edit Canvas</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(241,245,249,0.55)' }}>
              Click any text element to edit directly on the canvas. Changes save automatically, no modal interruptions.
            </p>
          </motion.div>

          {/* PDF Export */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-7 rounded-2xl p-8 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0a1628, #0d1628)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="absolute w-56 h-56 rounded-full pointer-events-none" style={{ background: 'rgba(52,211,153,0.12)', filter: 'blur(60px)', right: '0', top: '0' }} />
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
              <Download className="w-5 h-5" style={{ color: '#34D399' }} />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: '#F8FAFF', fontFamily: 'Fraunces, serif' }}>One-Click PDF Export</h3>
            <p className="text-sm leading-relaxed max-w-md" style={{ color: 'rgba(241,245,249,0.55)' }}>
              Export pixel-perfect PDFs that preserve every design detail. Rendered by Playwright for highest fidelity output.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-10 max-w-[1400px] mx-auto">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-sm font-semibold mb-4 uppercase tracking-widest" style={{ color: '#60A5FA' }}>Pricing</p>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '52px', fontWeight: 700, color: '#F8FAFF', lineHeight: 1.1 }}>
            Simple, honest pricing
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-8 max-w-3xl mx-auto">
          {[
            {
              name: 'Free',
              price: '$0',
              desc: 'Perfect to get started',
              features: ['3 decks/month', '6 slide templates', 'Modern Cobalt theme', 'PDF export (watermarked)', 'Community support'],
              cta: 'Start free',
              highlight: false,
            },
            {
              name: 'Pro',
              price: '$29',
              desc: 'For power users & teams',
              features: ['Unlimited decks', 'All 12 slide templates', 'All 3 premium themes', 'AI image generation', 'Clean PDF export', 'Priority support', 'Team sharing'],
              cta: 'Get Pro',
              highlight: true,
            },
          ].map((plan, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: plan.highlight ? 'linear-gradient(135deg, #1a1f35, #1d2340)' : 'rgba(255,255,255,0.03)',
                border: plan.highlight ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.07)',
              }}>
              {plan.highlight && (
                <div className="absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#2563EB', color: '#fff' }}>
                  Most popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-1" style={{ color: '#F8FAFF', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{plan.name}</h3>
              <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>{plan.desc}</p>
              <div className="mb-6">
                <span style={{ fontFamily: 'Fraunces, serif', fontSize: '48px', fontWeight: 700, color: '#F8FAFF' }}>{plan.price}</span>
                <span className="ml-1 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>/month</span>
              </div>
              <div className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: plan.highlight ? 'rgba(37,99,235,0.3)' : 'rgba(255,255,255,0.08)' }}>
                      <Check className="w-3 h-3" style={{ color: plan.highlight ? '#60A5FA' : 'rgba(255,255,255,0.5)' }} />
                    </div>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate(plan.highlight ? '/signup?plan=pro' : '/signup')}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: plan.highlight ? 'linear-gradient(135deg, #2563EB, #7C3AED)' : 'rgba(255,255,255,0.07)',
                  color: '#fff',
                  border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.1)',
                }}>
                {plan.cta} <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-10 max-w-[800px] mx-auto">
        <motion.h2 className="text-center mb-12" style={{ fontFamily: 'Fraunces, serif', fontSize: '42px', fontWeight: 700, color: '#F8FAFF' }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          Frequently asked
        </motion.h2>
        <div className="space-y-4">
          {[
            { q: 'How long does it take to generate a deck?', a: 'Typically 15–30 seconds for a 10-slide deck. The AI pipeline runs outline, content, and visual planning in parallel.' },
            { q: 'Can I edit the generated slides?', a: 'Yes — click any text element to edit inline. You can also switch layouts, reorder slides, change themes, and use AI to rewrite individual slides.' },
            { q: 'What file formats can I export?', a: 'PDF export is supported on all plans. Pro users get clean, watermark-free exports. PPTX export is on our roadmap.' },
            { q: 'Is my content secure?', a: 'Yes. All decks are encrypted at rest and only accessible to your account. We never use your content to train AI models.' },
          ].map((item, i) => (
            <motion.details key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group rounded-xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer font-semibold text-base" style={{ color: '#F8FAFF' }}>
                {item.q}
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" style={{ color: 'rgba(255,255,255,0.4)' }} />
              </summary>
              <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'rgba(241,245,249,0.6)' }}>{item.a}</p>
            </motion.details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-10 mt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold">DeckCraft</span>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>© 2024 DeckCraft. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Docs'].map(l => (
              <a key={l} href="#" className="text-xs hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
