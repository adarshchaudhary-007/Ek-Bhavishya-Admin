'use client';

import { FormEvent, Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  RefreshCw,
  Send,
  Bot,
  User as UserIcon,
  ShieldAlert,
  ChartSpline,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';

type LocalMessage = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  meta?: {
    agent_display_name?: string;
    agent_emoji?: string;
    isFallback?: boolean;
    response?: string;
  };
};

interface BirthDetails {
  date: string;
  time: string;
  lat: number;
  lon: number;
  timezone: string;
}

interface ChartData {
  type: string;
  planets?: Record<string, { sign?: string }>;
  isFallback?: boolean;
}

const STORAGE_KEY = 'ai_astro_chat_state_v1';

const agentInfo: Record<string, { name: string; emoji: string; specialization: string }> = {
  'ai-guru': { name: 'AI Guru', emoji: '🧘', specialization: 'Career • Love • Marriage • Finance' },
  'ai-jyotish': { name: 'AI Jyotish', emoji: '🔮', specialization: 'Vedic Astrology • Kundli Analysis' },
  'ai-vidwan': { name: 'AI Vidwan', emoji: '📚', specialization: 'Educational Astrology • Career' },
  'ai-premi': { name: 'AI Premi', emoji: '💕', specialization: 'Love • Relationships • Marriage' },
};

function AiAstrologerChatContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const selectedAgent = searchParams.get('agent') || 'ai-guru';
  const agent = agentInfo[selectedAgent] || agentInfo['ai-guru'];

  const sessionId = useMemo(() => {
    if (user?.id) return `user-${user.id}`;
    return `guest-${Date.now()}`;
  }, [user?.id]);

  const [isSending, setIsSending] = useState(false);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<LocalMessage[]>(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as { messages?: LocalMessage[] };
      return parsed.messages || [];
    } catch {
      return [];
    }
  });

  const [chartInput, setChartInput] = useState<BirthDetails>({
    date: '',
    time: '',
    lat: 28.6139,
    lon: 77.209,
    timezone: 'Asia/Kolkata',
  });

  const [chartData, setChartData] = useState<ChartData | null>(() => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as { chartData?: ChartData | null };
      return parsed.chartData || null;
    } catch {
      return null;
    }
  });

  const [usingFallback, setUsingFallback] = useState(
    messages.some((m) => Boolean(m.meta?.isFallback))
  );

  const persistState = (nextMessages: LocalMessage[], nextChartData: ChartData | null) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ messages: nextMessages, chartData: nextChartData })
    );
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: LocalMessage = {
      id: `${Date.now()}-u`,
      role: 'user',
      text: message.trim(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setMessage('');
    setIsSending(true);

    try {
      const { data } = await api.post('/api/v1/ai-astrologer/chat', {
        session_id: sessionId,
        message: userMessage.text,
        user_context: { name: user?.name || 'Guest User' },
        chart_data: chartData,
      });

      const response = data.data || data;
      const aiMessage: LocalMessage = {
        id: `${Date.now()}-a`,
        role: 'ai',
        text: response.response || response.message || 'No response received',
        meta: response,
      };

      const finalMessages = [...nextMessages, aiMessage];
      setMessages(finalMessages);
      persistState(finalMessages, chartData);

      if (response.isFallback) setUsingFallback(true);
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleChartGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!chartInput.date || !chartInput.time) {
      toast.error('Date and time of birth are required');
      return;
    }

    setIsChartLoading(true);
    try {
      const { data } = await api.post('/api/v1/ai-astrologer/chart', {
        birth_details: chartInput,
        chart_type: 'western',
      });

      const chart = data.data || data;
      setChartData(chart);
      persistState(messages, chart);

      if (chart.isFallback) setUsingFallback(true);
      toast.success('Birth chart generated successfully');
    } catch {
      toast.error('Chart generation failed. Please try again.');
    } finally {
      setIsChartLoading(false);
    }
  };

  const handleInterpret = async () => {
    if (!chartData) return;
    setIsInterpreting(true);
    try {
      const { data } = await api.post('/api/v1/ai-astrologer/interpret', {
        chart_data: chartData,
        focus: 'general',
      });

      const interpretation = data.data || data;
      const aiMessage: LocalMessage = {
        id: `${Date.now()}-interpret`,
        role: 'ai',
        text: interpretation.interpretation || 'No interpretation available',
      };
      const finalMessages = [...messages, aiMessage];
      setMessages(finalMessages);
      persistState(finalMessages, chartData);

      if (interpretation.isFallback) setUsingFallback(true);
    } catch {
      toast.error('Interpretation failed. Please try again.');
    } finally {
      setIsInterpreting(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setChartData(null);
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Conversation has been cleared');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-2xl border-2 border-emerald-200">
            {agent.emoji}
          </div>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {agent.name}
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </h1>
            <p className="text-muted-foreground text-sm">{agent.specialization}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {usingFallback && (
            <Badge variant="outline" className="border-amber-500/40 text-amber-600">
              <ShieldAlert className="w-3.5 h-3.5 mr-1" /> Fallback Mode
            </Badge>
          )}
          <Button variant="outline" onClick={handleClearChat}>
            <RefreshCw className="w-4 h-4 mr-2" /> Reset Chat
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-base">Birth Details (optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleChartGenerate}>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={chartInput.date}
                  onChange={(e) => setChartInput((p) => ({ ...p, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="tob">Time of Birth</Label>
                <Input
                  id="tob"
                  type="time"
                  value={chartInput.time}
                  onChange={(e) => setChartInput((p) => ({ ...p, time: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.0001"
                    value={chartInput.lat}
                    onChange={(e) =>
                      setChartInput((p) => ({ ...p, lat: Number(e.target.value) }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lon">Longitude</Label>
                  <Input
                    id="lon"
                    type="number"
                    step="0.0001"
                    value={chartInput.lon}
                    onChange={(e) =>
                      setChartInput((p) => ({ ...p, lon: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  placeholder="Asia/Kolkata"
                  value={chartInput.timezone || ''}
                  onChange={(e) => setChartInput((p) => ({ ...p, timezone: e.target.value }))}
                />
              </div>
              <Button className="w-full" type="submit" disabled={isChartLoading}>
                <ChartSpline className="w-4 h-4 mr-2" />
                {isChartLoading ? 'Generating...' : 'Generate Chart'}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                type="button"
                disabled={!chartData || isInterpreting}
                onClick={handleInterpret}
              >
                {isInterpreting ? 'Interpreting...' : 'Interpret Chart'}
              </Button>
            </form>

            {chartData && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Chart Generated</p>
                  <p className="text-muted-foreground">Type: {chartData.type}</p>
                  <p className="text-muted-foreground">
                    Sun: {chartData.planets?.Sun?.sign || 'N/A'}
                  </p>
                  <p className="text-muted-foreground">
                    Moon: {chartData.planets?.Moon?.sign || 'N/A'}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">AI Chat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[500px] border border-border rounded-xl p-4 overflow-y-auto bg-muted/20 space-y-3">
              {messages.length === 0 && (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <p className="font-medium">Start your AI astrology session</p>
                    <p className="text-sm text-muted-foreground">
                      Ask about love, career, marriage, health, or future opportunities.
                    </p>
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {m.role === 'user' ? (
                        <UserIcon className="w-3.5 h-3.5" />
                      ) : (
                        <Bot className="w-3.5 h-3.5" />
                      )}
                      <span className="text-xs opacity-80">
                        {m.role === 'user'
                          ? 'You'
                          : m.meta
                            ? `${m.meta.agent_display_name || agent.name} ${m.meta.agent_emoji || agent.emoji}`
                            : 'AI Astrologer'}
                      </span>
                      {m.meta?.isFallback && (
                        <Badge variant="outline" className="text-[10px] h-5">
                          Dummy
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="space-y-3">
              <Textarea
                placeholder="Type your question... (e.g. What does this month look like for my career?)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[96px]"
                maxLength={4000}
              />
              <div className="flex justify-between items-center gap-3">
                <p className="text-xs text-muted-foreground">Session ID: {sessionId}</p>
                <Button type="submit" disabled={isSending || !message.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  {isSending ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AiAstrologerChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AiAstrologerChatContent />
    </Suspense>
  );
}
