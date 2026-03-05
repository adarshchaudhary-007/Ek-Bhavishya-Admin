'use client';

import { useRouter } from 'next/navigation';
import { Star, Phone, Video, MessageCircle, Wallet, BookOpen, ShoppingBag, Calendar, TrendingUp, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quickActions = [
  { icon: Phone, label: 'Call', color: 'bg-emerald-50 text-emerald-600', href: '/astrologers' },
  { icon: Video, label: 'Video', color: 'bg-blue-50 text-blue-600', href: '/calls' },
  { icon: MessageCircle, label: 'Chat', color: 'bg-purple-50 text-purple-600', href: '/chat' },
  { icon: BookOpen, label: 'Courses', color: 'bg-amber-50 text-amber-600', href: '/courses' },
  { icon: Sparkles, label: 'Remedies', color: 'bg-orange-50 text-orange-600', href: '/remedies' },
  { icon: ShoppingBag, label: 'Shop', color: 'bg-pink-50 text-pink-600', href: '/shop' },
];

const onlineAstrologers = [
  { id: '1', name: 'Pandit Sharma', speciality: 'Vedic Astrology', rating: 4.9, rate: 25, avatar: 'PS', experience: '15 yrs', isOnline: true },
  { id: '2', name: 'Jyotishi Devi', speciality: 'Tarot Reading', rating: 4.8, rate: 20, avatar: 'JD', experience: '10 yrs', isOnline: true },
  { id: '3', name: 'Acharya Mishra', speciality: 'Numerology', rating: 4.7, rate: 30, avatar: 'AM', experience: '20 yrs', isOnline: true },
  { id: '4', name: 'Guru Patel', speciality: 'Palmistry', rating: 4.6, rate: 18, avatar: 'GP', experience: '8 yrs', isOnline: false },
];

const upcomingLiveSessions = [
  { id: 'ls1', title: 'Mercury Transit Effects 2025', astrologer: 'Pandit Sharma', time: 'Today, 7:00 PM', viewers: 128 },
  { id: 'ls2', title: 'Weekly Rashifal Discussion', astrologer: 'Jyotishi Devi', time: 'Tomorrow, 10:00 AM', viewers: 85 },
];

export default function UserHome() {
  const router = useRouter();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 p-5 md:p-6 text-white relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-15">
          <Sparkles className="w-20 h-20" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold font-display">Welcome back, Rahul! ✨</h1>
        <p className="text-emerald-100 mt-1 text-sm">Your cosmic journey continues.</p>
        <div className="flex gap-3 mt-4 flex-wrap">
          <div className="bg-white/15 rounded-lg px-4 py-2 backdrop-blur-sm">
            <p className="text-[11px] text-emerald-100">Wallet Balance</p>
            <p className="text-lg font-bold">₹1,250</p>
          </div>
          <div className="bg-white/15 rounded-lg px-4 py-2 backdrop-blur-sm">
            <p className="text-[11px] text-emerald-100">Lucky Number</p>
            <p className="text-lg font-bold">7</p>
          </div>
          <div className="bg-white/15 rounded-lg px-4 py-2 backdrop-blur-sm">
            <p className="text-[11px] text-emerald-100">Zodiac</p>
            <p className="text-lg font-bold">♈ Aries</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-emerald-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map(action => (
            <button
              key={action.label}
              onClick={() => router.push(action.href)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-sm transition-all"
            >
              <div className={`p-2.5 rounded-xl ${action.color}`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-emerald-800">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Online Astrologers */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-emerald-900">Online Astrologers</h2>
            <button 
              onClick={() => router.push('/astrologers')}
              className="text-sm text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {onlineAstrologers.map(a => (
              <button
                key={a.id}
                onClick={() => router.push(`/astrologers/${a.id}`)}
                className="flex items-center gap-3 p-3 rounded-xl border border-emerald-100 bg-white hover:border-emerald-300 transition-all text-left"
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
                    {a.avatar}
                  </div>
                  {a.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-emerald-900 truncate">{a.name}</p>
                  <p className="text-xs text-emerald-600">{a.speciality} • {a.experience}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium text-emerald-800">{a.rating}</span>
                    <span className="text-xs text-emerald-500">₹{a.rate}/min</span>
                  </div>
                </div>
                <Button size="sm" className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white h-8 w-8 p-0">
                  <Phone className="w-3.5 h-3.5" />
                </Button>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Upcoming Live Sessions */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-blue-900 text-sm mb-3">📡 Live Sessions</h3>
            <div className="space-y-2">
              {upcomingLiveSessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => router.push('/live')}
                  className="block w-full text-left p-2 rounded-lg hover:bg-blue-200/50 transition-colors"
                >
                  <p className="text-xs font-semibold text-blue-900 line-clamp-2">{session.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] text-blue-700">{session.time}</p>
                    <p className="text-[11px] text-blue-600">👥 {session.viewers}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <h3 className="font-semibold text-purple-900 text-sm mb-3">💳 Recent Transactions</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-700">Video Call - 20min</span>
                <span className="font-semibold text-purple-900">-₹100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Wallet Top-up</span>
                <span className="font-semibold text-green-600">+₹500</span>
              </div>
              <button 
                onClick={() => router.push('/wallet')}
                className="w-full mt-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                View Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
