import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Sparkles, User, Lock, CreditCard, Bell,
  Check, LogOut, ExternalLink
} from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex@company.com');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: '#0F1117', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#F1F5F9' }}>
      {/* Header */}
      <header className="flex items-center gap-4 px-8 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0F1117' }}>
        <button onClick={() => navigate('/dashboard')}
          className="p-2 rounded-lg transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white">DeckCraft</span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <span className="font-semibold text-sm" style={{ color: '#F8FAFF' }}>Settings</span>
      </header>

      <div className="max-w-[900px] mx-auto px-8 py-10 flex gap-8">
        {/* Sidebar nav */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all"
                  style={{
                    background: activeTab === tab.id ? 'rgba(37,99,235,0.15)' : 'transparent',
                    color: activeTab === tab.id ? '#60A5FA' : 'rgba(255,255,255,0.5)',
                    border: `1px solid ${activeTab === tab.id ? 'rgba(37,99,235,0.3)' : 'transparent'}`,
                  }}>
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
            <hr style={{ borderColor: 'rgba(255,255,255,0.07)', margin: '12px 0' }} />
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all"
              style={{ color: '#F87171' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 700, color: '#F8FAFF', marginBottom: '6px' }}>Profile</h2>
              <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>Manage your account information</p>

              {/* Avatar */}
              <div className="flex items-center gap-5 mb-8 p-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff' }}>
                  A
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: '#F8FAFF' }}>{name}</h3>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{email}</p>
                </div>
                <button className="ml-auto px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                  Change photo
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Full Name</label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#F8FAFF' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>Email Address</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#F8FAFF' }} />
                </div>
                <button onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: saved ? 'rgba(52,211,153,0.15)' : 'linear-gradient(135deg, #2563EB, #7C3AED)', color: saved ? '#34D399' : '#fff', border: saved ? '1px solid rgba(52,211,153,0.3)' : 'none' }}>
                  {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save changes'}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 700, color: '#F8FAFF', marginBottom: '6px' }}>Billing & Subscription</h2>
              <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>Manage your plan and payment details</p>

              {/* Current plan */}
              <div className="p-6 rounded-2xl mb-6" style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.25)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold" style={{ color: '#F8FAFF' }}>Free Plan</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(148,163,184,0.15)', color: '#94A3B8' }}>Current</span>
                    </div>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>3 decks · 6 templates · Watermarked export</p>
                  </div>
                  <span style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 700, color: '#F8FAFF' }}>$0</span>
                </div>

                {/* Usage meter */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <span>Decks used</span>
                    <span>3 / 3</span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-full rounded-full" style={{ width: '100%', background: '#F59E0B' }} />
                  </div>
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(124,58,237,0.12))', border: '1px solid rgba(37,99,235,0.25)' }}>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#F8FAFF', fontFamily: 'Fraunces, serif' }}>Upgrade to Pro</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Unlimited decks, all templates, clean PDF export, AI images</p>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff' }}>
                    <ExternalLink className="w-4 h-4" />
                    Upgrade — $29/mo
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 700, color: '#F8FAFF', marginBottom: '6px' }}>Security</h2>
              <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>Update your password and security settings</p>
              <div className="space-y-5">
                {['Current Password', 'New Password', 'Confirm Password'].map(label => (
                  <div key={label}>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</label>
                    <input type="password" placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#F8FAFF' }} />
                  </div>
                ))}
                <button className="px-6 py-3 rounded-xl font-semibold text-sm"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff' }}>
                  Update password
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 700, color: '#F8FAFF', marginBottom: '6px' }}>Notifications</h2>
              <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>Configure how you receive updates</p>
              <div className="space-y-4">
                {[
                  { label: 'Deck generation complete', desc: 'When your AI deck finishes generating', on: true },
                  { label: 'Export ready', desc: 'When your PDF export is ready to download', on: true },
                  { label: 'Product updates', desc: 'New features and improvements', on: false },
                  { label: 'Weekly digest', desc: 'Summary of your activity', on: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#F8FAFF' }}>{item.label}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.desc}</p>
                    </div>
                    <div className={`w-11 h-6 rounded-full cursor-pointer transition-all`}
                      style={{ background: item.on ? '#2563EB' : 'rgba(255,255,255,0.15)' }}>
                      <div className="w-4 h-4 rounded-full bg-white mt-1 transition-all shadow-sm"
                        style={{ marginLeft: item.on ? '26px' : '4px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
