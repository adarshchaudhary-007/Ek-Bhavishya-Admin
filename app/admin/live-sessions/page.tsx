'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { RefreshCw, Search, Radio, Users, Eye, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LiveSession {
    _id: string;
    astrologer: { name: string; };
    title: string;
    status: 'live' | 'scheduled' | 'ended';
    platform: 'agora' | 'youtube';
    viewerCount: number;
    peakViewers: number;
    duration: number;
    scheduledAt?: string;
    startedAt?: string;
    endedAt?: string;
}

const MOCK_LIVE_SESSIONS: LiveSession[] = [
    { _id: 'ls1', astrologer: { name: 'Pandit Rajesh Kumar' }, title: 'Kundli Reading — March Special', status: 'live', platform: 'agora', viewerCount: 342, peakViewers: 342, duration: 45, startedAt: '2026-03-06T08:30:00Z' },
    { _id: 'ls2', astrologer: { name: 'Acharya Vikram Shastri' }, title: 'Vastu Tips for New Home', status: 'scheduled', platform: 'youtube', viewerCount: 0, peakViewers: 0, duration: 0, scheduledAt: '2026-03-07T10:00:00Z' },
    { _id: 'ls3', astrologer: { name: 'Jyotish Sunita Devi' }, title: 'Weekly Tarot Predictions', status: 'ended', platform: 'agora', viewerCount: 0, peakViewers: 890, duration: 60, startedAt: '2026-03-05T18:00:00Z', endedAt: '2026-03-05T19:00:00Z' },
    { _id: 'ls4', astrologer: { name: 'Guru Anand Mishra' }, title: 'Lal Kitab Remedies Q&A', status: 'ended', platform: 'agora', viewerCount: 0, peakViewers: 567, duration: 40, startedAt: '2026-03-04T20:00:00Z', endedAt: '2026-03-04T20:40:00Z' },
    { _id: 'ls5', astrologer: { name: 'Pandit Rajesh Kumar' }, title: 'Career & Finance Predictions', status: 'scheduled', platform: 'youtube', viewerCount: 0, peakViewers: 0, duration: 0, scheduledAt: '2026-03-08T16:00:00Z' },
];

export default function LiveSessionsPage() {
    const [sessions] = useState<LiveSession[]>(MOCK_LIVE_SESSIONS);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = sessions.filter(s => {
        const matchStatus = statusFilter === 'all' || s.status === statusFilter;
        const matchSearch = search === '' || s.title.toLowerCase().includes(search.toLowerCase()) || s.astrologer.name.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const liveNow = sessions.filter(s => s.status === 'live').length;
    const totalViewers = sessions.filter(s => s.status === 'live').reduce((a, s) => a + s.viewerCount, 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Live Sessions</h2>
                    <p className="text-muted-foreground text-sm">Monitor live streams, scheduled sessions, and engagement stats.</p>
                </div>
                <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-2" /> Refresh</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-red-50 rounded-lg p-3 text-center">
                    <Radio className="h-4 w-4 mx-auto text-red-600 mb-1 animate-pulse" />
                    <p className="text-2xl font-bold text-red-700">{liveNow}</p>
                    <p className="text-[11px] font-medium text-red-600">Live Now</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <Eye className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                    <p className="text-2xl font-bold text-blue-700">{totalViewers}</p>
                    <p className="text-[11px] font-medium text-blue-600">Current Viewers</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <Clock className="h-4 w-4 mx-auto text-amber-600 mb-1" />
                    <p className="text-2xl font-bold text-amber-700">{sessions.filter(s => s.status === 'scheduled').length}</p>
                    <p className="text-[11px] font-medium text-amber-600">Scheduled</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <Users className="h-4 w-4 mx-auto text-purple-600 mb-1" />
                    <p className="text-2xl font-bold text-purple-700">{Math.max(...sessions.map(s => s.peakViewers))}</p>
                    <p className="text-[11px] font-medium text-purple-600">Peak Viewers</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by title or astrologer..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="live">Live Now</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader><TableRow><TableHead>Session</TableHead><TableHead>Astrologer</TableHead><TableHead>Platform</TableHead><TableHead>Status</TableHead><TableHead>Viewers</TableHead><TableHead>Duration</TableHead><TableHead>Time</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {filtered.map(session => (
                            <TableRow key={session._id} className={session.status === 'live' ? 'bg-red-50/30' : ''}>
                                <TableCell className="font-medium text-sm max-w-[200px] truncate">{session.title}</TableCell>
                                <TableCell className="text-sm">{session.astrologer.name}</TableCell>
                                <TableCell><Badge variant="outline" className="text-[10px] capitalize">{session.platform}</Badge></TableCell>
                                <TableCell>
                                    <Badge variant={session.status === 'live' ? 'destructive' : session.status === 'scheduled' ? 'default' : 'secondary'} className="text-[10px]">
                                        {session.status === 'live' && <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse" />}
                                        {session.status === 'live' ? 'LIVE' : session.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm">
                                    {session.status === 'live' && <><Eye className="inline h-3 w-3 mr-0.5" />{session.viewerCount}</>}
                                    {session.status === 'ended' && <><Users className="inline h-3 w-3 mr-0.5" />{session.peakViewers} peak</>}
                                    {session.status === 'scheduled' && '—'}
                                </TableCell>
                                <TableCell className="text-sm">{session.duration > 0 ? `${session.duration} min` : '—'}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {session.status === 'scheduled' && session.scheduledAt && new Date(session.scheduledAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                                    {session.startedAt && new Date(session.startedAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
