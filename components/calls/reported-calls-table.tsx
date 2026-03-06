'use client';

import {
    useReportedCalls,
    useRefundCall,
    useDismissReport,
    useSuspendForCalls
} from '@/lib/hooks/use-calls';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    AlertCircle,
    MoreHorizontal,
    Undo2,
    XCircle,
    ShieldAlert,
    CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function ReportedCallsTable() {
    const { data, isLoading } = useReportedCalls();

    const refundMutation = useRefundCall();
    const dismissMutation = useDismissReport();
    const suspendMutation = useSuspendForCalls();

    const handleRefund = (callId: string) => {
        const notes = prompt("Enter notes for refund:");
        if (notes === null) return;
        refundMutation.mutate({ callId, data: { adminNotes: notes } });
    };

    const handleDismiss = (callId: string) => {
        const notes = prompt("Enter notes for dismissal:");
        if (notes === null) return;
        dismissMutation.mutate({ callId, adminNotes: notes });
    };

    const handleSuspend = (astrologerId: string, callId: string) => {
        const reason = prompt("Enter suspension reason:");
        if (!reason) return;
        suspendMutation.mutate({
            id: astrologerId,
            data: {
                suspensionReason: reason,
                callId: callId,
                suspensionDuration: 7 // default 7 days
            }
        });
    };

    if (isLoading) {
        return <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 w-full bg-muted rounded-md" />)}
        </div>;
    }

    const calls = data?.calls || [];

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead>Reported At</TableHead>
                        <TableHead>User (Reporter)</TableHead>
                        <TableHead>Astrologer</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {calls.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No reported calls found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        calls.map((call) => (
                            <TableRow key={call._id} className="hover:bg-destructive/5">
                                <TableCell className="text-xs">
                                    {call.reportedAt ? format(new Date(call.reportedAt), 'dd MMM, hh:mm a') : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-xs font-medium">
                                        <span>{call.userId?.name}</span>
                                        <span className="text-muted-foreground font-normal">{call.userId?.phone}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-xs font-medium">
                                        <span>{call.astrologerId?.name}</span>
                                        <span className="text-muted-foreground font-normal">{call.astrologerId?.phone}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-xs text-destructive font-semibold">
                                        <AlertCircle className="h-3 w-3" />
                                        {call.reportReason || 'Not specified'}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={(call as any).adminAction ? 'success' : 'destructive'} className="text-[10px]">
                                        {(call as any).adminAction ? 'PROCESSED' : 'PENDING'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Dispute Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleRefund(call._id)}>
                                                <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" /> Refund User
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDismiss(call._id)}>
                                                <XCircle className="mr-2 h-4 w-4 text-muted-foreground" /> Dismiss Report
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive font-medium"
                                                onClick={() => handleSuspend(call.astrologerId?._id!, call._id)}
                                            >
                                                <ShieldAlert className="mr-2 h-4 w-4" /> Suspend Astrologer
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
