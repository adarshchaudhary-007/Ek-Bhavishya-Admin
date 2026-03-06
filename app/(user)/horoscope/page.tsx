'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sun, Moon, Orbit, Star, Hand, HeartHandshake, Hash, Waves,
  ArrowLeft, User, Calendar, Clock3, MapPin, Lock, Sparkles,
  Heart, Briefcase, DollarSign, Activity, MessageCircle,
} from 'lucide-react';

const tools = [
  { id: 'daily', title: 'Free Services', icon: Sun },
  { id: 'birth-chart', title: 'Birth Chart Analysis', icon: Moon },
  { id: 'transit', title: 'Transit Forecast', icon: Orbit },
  { id: 'synastry', title: 'Kundli Comparison', icon: Star },
  { id: 'palm', title: 'Palm Reading', icon: Hand },
  { id: 'couple', title: 'Couple Analysis', icon: HeartHandshake },
  { id: 'numerology', title: 'Numerology Reading', icon: Hash },
  { id: 'tarot', title: 'Tarot Card Reading', icon: Waves },
] as const;

type ViewState = 'grid' | 'form' | 'result';

const FormField = ({ label, icon: Icon, value, onChange, placeholder }: {
  label: string; icon: any; value: string; onChange: (v: string) => void; placeholder: string;
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-emerald-700">{label}</label>
    <div className="relative">
      <Icon className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-emerald-300" />
    </div>
  </div>
);

export default function HoroscopePage() {
  const router = useRouter();
  const [view, setView] = useState<ViewState>('grid');
  const [selectedTool, setSelectedTool] = useState<(typeof tools)[number]>(tools[0]);

  const [form, setForm] = useState({
    fullName: '', dateOfBirth: '', birthTime: '', birthPlace: '',
    brideName: '', brideDateOfBirth: '', brideBirthTime: '', brideBirthPlace: '',
    groomName: '', groomDateOfBirth: '', groomBirthTime: '', groomBirthPlace: '',
  });

  const zodiac = useMemo(() => {
    if (!form.dateOfBirth) return 'Aries';
    return 'Aries';
  }, [form.dateOfBirth]);

  const handleToolClick = (toolId: string) => {
    const tool = tools.find(item => item.id === toolId);
    if (!tool) return;
    setSelectedTool(tool);
    setView('form');
  };

  const handleBack = () => {
    if (view === 'form') { setView('grid'); return; }
    if (view === 'result') { setView('form'); return; }
    router.push('/dashboard');
  };

  const isKundli = selectedTool.id === 'synastry';
  const u = (key: string) => (val: string) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="max-w-2xl mx-auto">
      {view === 'grid' && (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Free Astrology Tools</h1>
            <p className="text-sm text-gray-500 mt-1">Choose a service to get started</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {tools.map(tool => {
              const Icon = tool.icon;
              return (
                <button key={tool.id} onClick={() => handleToolClick(tool.id)}
                  className="rounded-xl border border-gray-100 bg-white p-4 min-h-[100px] text-left hover:border-emerald-300 hover:shadow-sm transition-all group">
                  <div className="flex flex-col gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                      <Icon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 leading-snug">{tool.title}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {view === 'form' && (
        <div className="space-y-5">
          <button onClick={handleBack} className="flex items-center gap-1 text-emerald-600 text-sm font-medium hover:text-emerald-700">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="text-center space-y-2">
            <h2 className="text-lg font-bold text-gray-900">{selectedTool.title}</h2>
            <p className="text-sm text-gray-500">
              {isKundli ? 'Enter bride and groom details for compatibility check' : "Enter your details to get today's prediction"}
            </p>
            <div className="w-12 h-0.5 bg-emerald-500 mx-auto rounded-full" />
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
            {isKundli ? (
              <>
                <div className="rounded-xl border border-gray-100 p-4 space-y-3">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Bride Details</p>
                  <FormField label="Name" icon={User} value={form.brideName} onChange={u('brideName')} placeholder="Enter bride name" />
                  <FormField label="Date of Birth" icon={Calendar} value={form.brideDateOfBirth} onChange={u('brideDateOfBirth')} placeholder="DD/MM/YYYY" />
                  <FormField label="Birth Time" icon={Clock3} value={form.brideBirthTime} onChange={u('brideBirthTime')} placeholder="HH:MM AM/PM" />
                  <FormField label="Birth Place" icon={MapPin} value={form.brideBirthPlace} onChange={u('brideBirthPlace')} placeholder="City, Country" />
                </div>
                <div className="rounded-xl border border-gray-100 p-4 space-y-3">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Groom Details</p>
                  <FormField label="Name" icon={User} value={form.groomName} onChange={u('groomName')} placeholder="Enter groom name" />
                  <FormField label="Date of Birth" icon={Calendar} value={form.groomDateOfBirth} onChange={u('groomDateOfBirth')} placeholder="DD/MM/YYYY" />
                  <FormField label="Birth Time" icon={Clock3} value={form.groomBirthTime} onChange={u('groomBirthTime')} placeholder="HH:MM AM/PM" />
                  <FormField label="Birth Place" icon={MapPin} value={form.groomBirthPlace} onChange={u('groomBirthPlace')} placeholder="City, Country" />
                </div>
              </>
            ) : (
              <>
                <FormField label="Full Name" icon={User} value={form.fullName} onChange={u('fullName')} placeholder="Enter your full name" />
                <FormField label="Date of Birth" icon={Calendar} value={form.dateOfBirth} onChange={u('dateOfBirth')} placeholder="DD/MM/YYYY" />
                <FormField label="Birth Time" icon={Clock3} value={form.birthTime} onChange={u('birthTime')} placeholder="HH:MM AM/PM" />
                <FormField label="Birth Place" icon={MapPin} value={form.birthPlace} onChange={u('birthPlace')} placeholder="City, Country" />
              </>
            )}

            <button onClick={() => setView('result')}
              className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold mt-2 transition-colors">
              {isKundli ? 'Check Kundli Match' : 'Get My Free Services'}
            </button>

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
              <Lock className="w-3 h-3" /> Your information is secure and used only for calculation.
            </p>
          </div>
        </div>
      )}

      {view === 'result' && (
        <div className="space-y-5">
          <button onClick={handleBack} className="flex items-center gap-1 text-emerald-600 text-sm font-medium hover:text-emerald-700">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="rounded-2xl bg-emerald-600 text-white p-5 text-center">
            <h3 className="text-lg font-bold">
              {isKundli ? `${form.brideName || 'Bride'} & ${form.groomName || 'Groom'}` : form.fullName || 'Your Name'}
            </h3>
            <p className="text-emerald-100 text-sm mt-0.5">{isKundli ? 'Kundli Match Result' : `♈ ${zodiac}`}</p>
            <p className="text-emerald-200 text-xs mt-1">Today, {new Date().toLocaleDateString()}</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-5">
            <div className="text-center space-y-1">
              <Sparkles className="w-5 h-5 text-yellow-500 mx-auto" />
              <h4 className="text-base font-bold text-gray-900">Your Horoscope for Today</h4>
            </div>

            {[
              { label: 'Overall', icon: null, text: 'Today brings clarity and confidence. You may feel motivated to take important decisions.' },
              { label: 'Love', icon: Heart, text: 'A good day for honest communication with your partner.' },
              { label: 'Career', icon: Briefcase, text: 'Your efforts will be noticed. Focus on completing pending tasks.' },
              { label: 'Finance', icon: DollarSign, text: 'Financially stable day. Avoid impulsive spending.' },
              { label: 'Health', icon: Activity, text: 'Maintain balance. Light exercise and rest are advised.' },
            ].map(s => (
              <div key={s.label} className="space-y-1">
                <p className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
                  {s.icon ? <s.icon className="w-3.5 h-3.5" /> : '•'} {s.label}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <h4 className="text-center text-sm font-bold text-gray-900 mb-4">🍀 Lucky Elements</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Color', value: 'Red', inner: <div className="w-5 h-5 rounded-full bg-red-500" /> },
                { label: 'Number', value: '9', inner: <span className="text-emerald-700 font-bold text-sm">9</span> },
                { label: 'Direction', value: 'East', inner: <span className="text-emerald-700 font-bold text-sm">→</span> },
              ].map(el => (
                <div key={el.label}>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 mx-auto mb-1.5 flex items-center justify-center">{el.inner}</div>
                  <p className="text-[11px] text-gray-400">{el.label}</p>
                  <p className="font-semibold text-sm text-gray-900">{el.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-2.5">
            <button
              onClick={() => router.push('/chat')}
              className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Chat with Astrologer
            </button>
            <button
              onClick={() => router.push('/ai-astrologer')}
              className="w-full h-10 rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              🤖 Ask Ek Bhavishya AI
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
