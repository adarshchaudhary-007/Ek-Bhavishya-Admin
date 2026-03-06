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
import { RefreshCw, Search, MessageSquare, Clock, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

interface ChatSession {
    _id: string;
    user: { name: string; };
    astrologer: { name: string; };
    status: 'active' | 'ended' | 'cancelled';
    startTime: string;
    endTime?: string;
    duration: number;
    totalMessages: number;
    totalAmount: number;
}

const MOCK_CHATS: ChatSession[] = [
    { _id: 'c1', user: { name: 'Rahul Sharma' }, astrologer: { name: 'Pandit Rajesh Kumar' }, status: 'active', startTime: '2026-03-06T09:00:00Z', duration: 15, totalMessages: 32, totalAmount: 150 },
    { _id: 'c2', user: { name: 'Priya Verma' }, astrologer: { name: 'Jyotish Sunita Devi' }, status: 'active', startTime: '2026-03-06T09:10:00Z', duration: 8, totalMessages: 18, totalAmount: 80 },
    { _id: 'c3', user: { name: 'Amit Patel' }, astrologer: { name: 'Acharya Vikram Shastri' }, status: 'ended', startTime: '2026-03-05T14:00:00Z', endTime: '2026-03-05T14:25:00Z', duration: 25, totalMessages: 54, totalAmount: 250 },
    { _id: 'c4', user: { name: 'Sneha Gupta' }, astrologer: { name: 'Guru Anand Mishra' }, status: 'ended', startTime: '2026-03-05T11:30:00Z', endTime: '2026-03-05T11:50:00Z', duration: 20, totalMessages: 41, totalAmount: 200 },
    { _id: 'c5', user: { name: 'Karan Singh' }, astrologer: { name: 'Pandit Rajesh Kumar' }, status: 'cancelled', startTime: '2026-03-04T16:00:00Z', endTime: '2026-03-04T16:02:00Z', duration: 2, totalMessages: 3, totalAmount: 0 },
    { _id: 'c6', user: { name: 'Deepak Rao' }, astrologer: { name: 'Jyotish Sunita Devi' }, status: 'ended', startTime: '2026-03-04T10:00:00Z', endTime: '2026-03-04T10:30:00Z', duration: 30, totalMessages: 67, totalAmount: 300 },
];

export default function ChatsPage() {
    const [chats] = useState<ChatSession[]>(MOCK_CHATS);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = chats.filter(c => {
        const matchStatus = statusFilter === 'all' || c.status === statusFilter;
        const matchSearch = search === '' || c.user.name.toLowerCase().includes(search.toLowerCase()) || c.astrologer.name.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    const activeCount = chats.filter(c => c.status === 'active').length;
    const totalRevenue = chats.reduce((a, c) => a + c.totalAmount, 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Chat Sessions</h2>
                    <p className="text-muted-foreground text-sm">Monitor active and past chat sessions between users and astrologers.</p>
                </div>
                <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-2" /> Refresh</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-green-50 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-green-700">{activeCount}</p><p className="text-[11px] font-medium text-green-600">Active Now</p></div>
                <div className="bg-blue-50 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-blue-700">{chats.length}</p><p className="text-[11px] font-medium text-blue-600">Total Sessions</p></div>
                <div className="bg-purple-50 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-purple-700">{Math.round(chats.reduce((a, c) => a + c.duration, 0) / chats.length)} min</p><p className="text-[11px] font-medium text-purple-600">Avg Duration</p></div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-emerald-700">₹{totalRevenue.toLocaleString('en-IN')}</p><p className="text-[11px] font-medium text-emerald-600">Total Revenue</p></div>
            </div>

            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by user or astrologer..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="ended">Ended</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Astrologer</TableHead><TableHead>Status</TableHead><TableHead>Duration</TableHead><TableHead>Messages</TableHead><TableHead>Amount</TableHead><TableHead>Started</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {filtered.map(chat => (
                            <TableRow key={chat._id} className={chat.status === 'active' ? 'bg-green-50/30' : ''}>
                                <TableCell className="font-medium text-sm">{chat.user.name}</TableCell>
                                <TableCell className="text-sm">{chat.astrologer.name}</TableCell>
                                <TableCell>
                                    <Badge variant={chat.status === 'active' ? 'success' : chat.status === 'cancelled' ? 'destructive' : 'secondary'} className="text-[10px]">
                                        {chat.status === 'active' && <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse" />}
                                        {chat.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm"><Clock className="inline h-3 w-3 mr-1 text-muted-foreground" />{chat.duration} min</TableCell>
                                <TableCell className="text-sm"><MessageSquare className="inline h-3 w-3 mr-1 text-muted-foreground" />{chat.totalMessages}</TableCell>
                                <TableCell className="font-semibold text-sm">₹{chat.totalAmount}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">{new Date(chat.startTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
