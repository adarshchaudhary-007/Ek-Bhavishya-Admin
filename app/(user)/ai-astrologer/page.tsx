'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, BrainCircuit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AIAgent {
  id: string;
  name: string;
  emoji: string;
  description: string;
  specializations: string[];
  isActive: boolean;
  priority: number;
}

const mockAgents: AIAgent[] = [
  {
    id: 'ai-guru',
    name: 'AI Guru',
    emoji: '🧘',
    description: 'Expert in career guidance, love relationships, marriage compatibility, and financial astrology',
    specializations: ['Career', 'Love', 'Marriage', 'Finance'],
    isActive: true,
    priority: 1,
  },
  {
    id: 'ai-jyotish',
    name: 'AI Jyotish',
    emoji: '🔮',
    description: 'Specialist in Vedic Astrology, Kundli analysis, and birth chart interpretations',
    specializations: ['Career', 'Marriage'],
    isActive: true,
    priority: 2,
  },
  {
    id: 'ai-vidwan',
    name: 'AI Vidwan',
    emoji: '📚',
    description: 'Expert in educational astrology, career transitions, and learning paths',
    specializations: ['Career'],
    isActive: true,
    priority: 3,
  },
  {
    id: 'ai-premi',
    name: 'AI Premi',
    emoji: '💕',
    description: 'Specialist in love compatibility, relationship advice, and romantic guidance',
    specializations: ['Love', 'Marriage'],
    isActive: true,
    priority: 4,
  },
];

const filterCategories = ['All', 'Career', 'Love', 'Marriage', 'Finance'] as const;
type FilterCategory = (typeof filterCategories)[number];

export default function AiAstrologersListPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

  const filteredAgents =
    activeFilter === 'All'
      ? mockAgents
      : mockAgents.filter((agent) => agent.specializations.includes(activeFilter));

  const handleAskNow = (agentId: string) => {
    router.push(`/ai-astrologer/chat?agent=${agentId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Astrologers</h1>
              <p className="text-muted-foreground">Instant AI-based astrology guidance</p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {filterCategories.map((category) => (
            <Button
              key={category}
              variant={activeFilter === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(category)}
              className={
                activeFilter === category
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6'
                  : 'rounded-full px-6 hover:bg-accent'
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card
              key={agent.id}
              className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-emerald-200"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-16 h-16 border-2 border-emerald-200">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-teal-100 text-3xl">
                        {agent.emoji}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{agent.name}</h3>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 mt-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Powered
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {agent.specializations.map((spec, idx) => (
                    <span key={idx}>
                      <span className="text-sm text-muted-foreground font-medium">{spec}</span>
                      {idx < agent.specializations.length - 1 && (
                        <span className="text-muted-foreground mx-1">•</span>
                      )}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{agent.description}</p>

                <Button
                  onClick={() => handleAskNow(agent.id)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg"
                >
                  Ask Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <BrainCircuit className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No AI astrologers found for this category</p>
            <Button variant="outline" onClick={() => setActiveFilter('All')} className="mt-4">
              View All Astrologers
            </Button>
          </div>
        )}

        {/* Info Banner */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-emerald-900">Why Choose AI Astrologers?</h4>
                <p className="text-sm text-emerald-700">
                  Get instant personalized astrology guidance powered by advanced AI. Available 24/7,
                  our AI astrologers combine traditional Vedic wisdom with modern technology to provide
                  accurate readings, birth chart analysis, and life guidance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
