'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InterviewStatus } from '@/types';
import { useInterviewsByStatus, useCompleteInterview, useCancelInterview, useRejectInterview } from '@/lib/hooks/use-interviews';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Clock, Search, UserMinus, Video } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScheduleInterviewModal } from '@/components/interviews/schedule-interview-modal';

export default function InterviewsPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-emerald-950">Interview Management</h1>
                <p className="text-muted-foreground text-sm">
                    Manage virtual interviews for astrologer applications and onboarding.
                </p>
            </div>

            <Tabs defaultValue="Pending" className="w-full">
                <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
                    {['Pending', 'Scheduled', 'Completed', 'Cancelled', 'Rejected'].map((status) => (
                        <TabsTrigger
                            key={status}
                            value={status}
                            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white border"
                        >
                            {status}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {['Pending', 'Scheduled', 'Completed', 'Cancelled', 'Rejected'].map((status) => (
                    <TabsContent key={status} value={status} className="mt-6">
                        <InterviewList status={status as InterviewStatus} />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

function InterviewList({ status }: { status: InterviewStatus }) {
    const { data, isLoading } = useInterviewsByStatus(status);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAstro, setSelectedAstro] = useState<{ _id: string; name: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (astro: { _id: string; name: string }) => {
        setSelectedAstro(astro);
        setIsModalOpen(true);
    };

    const completeMutation = useCompleteInterview();
    const cancelMutation = useCancelInterview();
    const rejectMutation = useRejectInterview();

    const handleComplete = (id: string) => {
        const rating = prompt("Enter rating (1-5):", "5");
        const notes = prompt("Enter notes:");
        completeMutation.mutate({
            astrologer_id: id,
            rating: rating ? parseInt(rating) : 5,
            admin_notes: notes || undefined
        });
    };

    const handleCancel = (id: string) => {
        const reason = prompt("Enter cancellation reason:");
        if (reason !== null) {
            cancelMutation.mutate({ astrologer_id: id, reason });
        }
    };

    const handleReject = (id: string) => {
        const remark = prompt("Enter rejection reason:");
        if (remark !== null) {
            rejectMutation.mutate({ astrologer_id: id, remark });
        }
    };

    if (isLoading) {
        return <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 w-full bg-muted rounded-md" />)}
        </div>;
    }

    const interviews = data?.data || [];
    const filtered = interviews.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.phone.includes(searchTerm)
    );

    const isMutating = completeMutation.isPending || cancelMutation.isPending || rejectMutation.isPending;

    return (
        <div className="space-y-4">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name or phone..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Candidate</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Registered On</TableHead>
                            {status === 'Scheduled' && <TableHead>Meeting Details</TableHead>}
                            {(status === 'Scheduled' || status === 'Pending') && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No candidates found in {status} status.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((item) => (
                                <TableRow key={item._id} className="hover:bg-emerald-50/20">
                                    <TableCell>
                                        <div className="font-semibold">{item.name}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase">{item._id}</div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <div>{item.email}</div>
                                        <div className="text-muted-foreground">{item.phone}</div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {format(new Date(item.registered_on), 'dd MMM yyyy')}
                                    </TableCell>
                                    {status === 'Scheduled' && (
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
                                                    <Calendar className="h-3 w-3" />
                                                    {item.interview_details?.meeting_time ?
                                                        format(new Date(item.interview_details.meeting_time), 'dd MMM, hh:mm a') :
                                                        'TBD'}
                                                </div>
                                                {item.interview_details?.meeting_link && (
                                                    <a
                                                        href={item.interview_details.meeting_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[10px] text-blue-600 underline flex items-center gap-1"
                                                    >
                                                        <Video className="h-2 w-2" /> Join Meeting
                                                    </a>
                                                )}
                                            </div>
                                        </TableCell>
                                    )}
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {status === 'Pending' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-destructive h-8 px-2"
                                                        onClick={() => handleReject(item._id)}
                                                        disabled={isMutating}
                                                    >
                                                        <UserMinus className="h-4 w-4 mr-1" /> Reject
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-600 hover:bg-emerald-700 h-8"
                                                        onClick={() => handleOpenModal({ _id: item._id, name: item.name })}
                                                        disabled={isMutating}
                                                    >
                                                        Schedule
                                                    </Button>
                                                </>
                                            )}
                                            {status === 'Scheduled' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 px-2"
                                                        onClick={() => handleCancel(item._id)}
                                                        disabled={isMutating}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-600 hover:bg-emerald-700 h-8"
                                                        onClick={() => handleComplete(item._id)}
                                                        disabled={isMutating}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" /> Mark Done
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ScheduleInterviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                astrologer={selectedAstro}
            />
        </div>
    );
}
