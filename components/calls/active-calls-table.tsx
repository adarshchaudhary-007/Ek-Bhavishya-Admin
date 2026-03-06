'use client';

import { useActiveCalls } from '@/lib/hooks/use-calls';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Phone, User, Star } from 'lucide-react';
import { format } from 'date-fns';

export function ActiveCallsTable() {
    const { data, isLoading } = useActiveCalls();

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 w-full bg-muted rounded-md" />
                ))}
            </div>
        );
    }

    const calls = data?.calls || [];

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead>User</TableHead>
                        <TableHead>Astrologer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Started At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {calls.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No active consultations at the moment.
                            </TableCell>
                        </TableRow>
                    ) : (
                        calls.map((call) => (
                            <TableRow key={call._id} className="hover:bg-emerald-50/30">
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <User className="h-4 w-4 text-emerald-700" />
                                        </div>
                                        <div className="flex flex-col text-xs">
                                            <span className="font-semibold">{call.userId?.name}</span>
                                            <span className="text-muted-foreground">{call.userId?.phone}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                            <Star className="h-4 w-4 text-amber-700" />
                                        </div>
                                        <div className="flex flex-col text-xs">
                                            <span className="font-semibold">{call.astrologerId?.name}</span>
                                            <span className="text-muted-foreground">{call.astrologerId?.phone}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize">
                                        {call.callType}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-xs font-semibold capitalize">{call.status}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {format(new Date(call.initiatedAt), 'hh:mm:ss a')}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
