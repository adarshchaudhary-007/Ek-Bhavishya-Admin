'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useScheduleInterview } from '@/lib/hooks/use-interviews';
import { Loader2, Calendar, Link as LinkIcon } from 'lucide-react';

interface ScheduleInterviewModalProps {
    astrologer: {
        _id: string;
        name: string;
    } | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ScheduleInterviewModal({
    astrologer,
    isOpen,
    onClose
}: ScheduleInterviewModalProps) {
    const [meetingTime, setMeetingTime] = useState('');
    const [meetingLink, setMeetingLink] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    const scheduleMutation = useScheduleInterview();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!astrologer || !meetingTime || !meetingLink) return;

        scheduleMutation.mutate({
            astrologer_id: astrologer._id,
            meeting_time: new Date(meetingTime).toISOString(),
            meeting_link: meetingLink,
            admin_notes: adminNotes
        }, {
            onSuccess: () => {
                onClose();
                setMeetingTime('');
                setMeetingLink('');
                setAdminNotes('');
            }
        });
    };

    if (!astrologer) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Schedule Interview</DialogTitle>
                    <DialogDescription>
                        Set up a virtual meeting for {astrologer.name}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="time" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" /> Meeting Time
                            </Label>
                            <Input
                                id="time"
                                type="datetime-local"
                                required
                                value={meetingTime}
                                onChange={(e) => setMeetingTime(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="link" className="flex items-center gap-2">
                                <LinkIcon className="h-4 w-4" /> Meeting Link (Zoom/Google Meet)
                            </Label>
                            <Input
                                id="link"
                                type="url"
                                placeholder="https://meet.google.com/..."
                                required
                                value={meetingLink}
                                onChange={(e) => setMeetingLink(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Admin Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                placeholder="Any internal notes for the interviewer..."
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={scheduleMutation.isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={scheduleMutation.isPending}>
                            {scheduleMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scheduling...
                                </>
                            ) : (
                                'Confirm Schedule'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
