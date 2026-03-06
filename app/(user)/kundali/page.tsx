'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles, Download, Share2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const planets = [
  { name: 'Sun', sign: 'Aries', house: '1st', degree: '15°23\'', status: 'Exalted' },
  { name: 'Moon', sign: 'Cancer', house: '4th', degree: '22°10\'', status: 'Own Sign' },
  { name: 'Mars', sign: 'Capricorn', house: '10th', degree: '8°45\'', status: 'Exalted' },
  { name: 'Mercury', sign: 'Virgo', house: '6th', degree: '12°30\'', status: 'Own Sign' },
  { name: 'Jupiter', sign: 'Sagittarius', house: '9th', degree: '5°17\'', status: 'Own Sign' },
  { name: 'Venus', sign: 'Pisces', house: '12th', degree: '27°50\'', status: 'Exalted' },
  { name: 'Saturn', sign: 'Aquarius', house: '11th', degree: '18°05\'', status: 'Own Sign' },
  { name: 'Rahu', sign: 'Gemini', house: '3rd', degree: '14°22\'', status: 'Neutral' },
  { name: 'Ketu', sign: 'Sagittarius', house: '9th', degree: '14°22\'', status: 'Neutral' },
];

const doshas = [
  { name: 'Manglik Dosha', status: 'Mild', severity: 'low', desc: 'Mars is in a favorable house. Low manglik effects.' },
  { name: 'Kaal Sarp Dosha', status: 'Absent', severity: 'none', desc: 'All planets do not fall between Rahu-Ketu axis.' },
  { name: 'Sade Sati', status: 'Not Active', severity: 'none', desc: 'Saturn is not transiting over your Moon sign currently.' },
];

const dashas = [
  { planet: 'Jupiter', period: 'Mahadasha', start: '2020', end: '2036', active: true },
  { planet: 'Mercury', period: 'Antardasha', start: '2024', end: '2026', active: true },
  { planet: 'Venus', period: 'Pratyantardasha', start: 'Jan 2025', end: 'Jun 2025', active: true },
];

export default function KundaliPage() {
  const [showChart, setShowChart] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', time: '', place: '' });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.date || !form.time || !form.place) {
      toast.error('Please fill all fields');
      return;
    }
    setShowChart(true);
    toast.success('Kundali Generated!');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kundali / Birth Chart</h1>
        <p className="text-gray-500 text-sm">Generate your Vedic birth chart based on date, time & place of birth</p>
      </div>

      {!showChart && (
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" /> Birth Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your name" className="mt-1"
                  value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date of Birth</Label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input id="date" type="date" className="pl-10"
                      value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="time">Time of Birth</Label>
                  <div className="relative mt-1">
                    <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input id="time" type="time" className="pl-10"
                      value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="place">Place of Birth</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input id="place" placeholder="e.g., Mumbai, Maharashtra" className="pl-10"
                    value={form.place} onChange={e => setForm(p => ({ ...p, place: e.target.value }))} />
                </div>
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                Generate Kundali <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {showChart && (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold">{form.name}&apos;s Kundali</h2>
                  <p className="text-sm text-gray-500">
                    Born: {new Date(form.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} at {form.time}
                  </p>
                  <p className="text-sm text-gray-500">Place: {form.place}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge>Ascendant: Aries</Badge>
                    <Badge variant="outline">Moon Sign: Cancer</Badge>
                    <Badge variant="outline">Nakshatra: Pushya</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> PDF</Button>
                  <Button variant="outline" size="sm"><Share2 className="w-4 h-4 mr-1" /> Share</Button>
                  <Button variant="outline" size="sm" onClick={() => setShowChart(false)}>New Chart</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Birth Chart (Rasi)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square max-w-md mx-auto border-2 border-emerald-200 relative">
                  <div className="grid grid-cols-4 grid-rows-4 h-full">
                    {[
                      'Pisces\n♓', 'Aries\n♈\nSun', 'Taurus\n♉', 'Gemini\n♊\nRahu',
                      'Aquarius\n♒\nSaturn', '', '', 'Cancer\n♋\nMoon',
                      'Capricorn\n♑\nMars', '', '', 'Leo\n♌',
                      'Sagittarius\n♐\nJupiter\nKetu', 'Scorpio\n♏', 'Libra\n♎', 'Virgo\n♍\nMercury',
                    ].map((cell, i) => (
                      <div key={i} className={`border border-emerald-100 p-1.5 flex items-center justify-center text-center
                        ${[5, 6, 9, 10].includes(i) ? 'bg-emerald-50' : ''}`}>
                        {cell && <span className="text-[10px] leading-tight whitespace-pre-line font-medium">{cell}</span>}
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs font-bold text-emerald-600">RASI</p>
                      <p className="text-[10px] text-gray-500">Aries Asc</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Planetary Positions (Graha)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {planets.map(p => (
                    <div key={p.name} className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 text-sm">
                      <span className="font-bold w-16">{p.name}</span>
                      <span className="text-gray-500 w-24">{p.sign}</span>
                      <span className="text-gray-500 w-12">{p.house}</span>
                      <span className="text-gray-500 w-16">{p.degree}</span>
                      <Badge variant={p.status === 'Exalted' ? 'default' : p.status === 'Own Sign' ? 'secondary' : 'outline'}
                        className="text-[10px] ml-auto">{p.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="doshas">
            <TabsList>
              <TabsTrigger value="doshas">Doshas</TabsTrigger>
              <TabsTrigger value="dashas">Dasha Periods</TabsTrigger>
              <TabsTrigger value="yogas">Yogas</TabsTrigger>
            </TabsList>
            <TabsContent value="doshas" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {doshas.map(d => (
                  <Card key={d.name}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm">{d.name}</h3>
                        <Badge variant={d.severity === 'none' ? 'secondary' : 'outline'}>{d.status}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">{d.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="dashas" className="mt-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  {dashas.map(d => (
                    <div key={d.planet + d.period} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100">
                      <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{d.planet} {d.period}</p>
                        <p className="text-xs text-gray-500">{d.start} - {d.end}</p>
                      </div>
                      {d.active && <Badge className="bg-green-500/10 text-green-600 border-green-500/30">Active</Badge>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="yogas" className="mt-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  {[
                    { name: 'Gaja Kesari Yoga', planets: 'Jupiter + Moon', effect: 'Wisdom, wealth and fame. Strong leadership qualities.' },
                    { name: 'Budhaditya Yoga', planets: 'Sun + Mercury', effect: 'Sharp intellect, excellent communication, success in education.' },
                    { name: 'Malavya Yoga', planets: 'Venus in Kendra', effect: 'Artistic talent, luxurious life, charming personality.' },
                  ].map(y => (
                    <div key={y.name} className="p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm">{y.name}</h3>
                        <Badge variant="outline" className="text-[10px]">{y.planets}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">{y.effect}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
