'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/axios';

interface SuspendModalProps {
    isOpen: boolean;
    onClose: () => void;
    astrologerId: string;
    astrologerName: string;
}

export function SuspendModal({
    isOpen,
    onClose,
    astrologerId,
    astrologerName,
}: SuspendModalProps) {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleSuspend = async () => {
        if (!reason.trim()) {
            toast.error('Please provide a reason for suspension');
            return;
        }

        setLoading(true);
        try {
            await api.patch('/astrologers/suspend', {
                id: astrologerId,
                suspensionReason: reason
            });

            toast.success(`${astrologerName} has been suspended.`);
            queryClient.invalidateQueries({ queryKey: ['astrologers'] });
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to suspend astrologer');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Suspend Astrologer</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to suspend {astrologerName}? This action can be
                        reversed later.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="reason" className="text-left">
                            Reason for Suspension
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder="Violation of terms..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleSuspend} loading={loading}>
                        Suspend
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
