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

interface RejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    sellerId: string;
    sellerName: string;
}

export function RejectModal({
    isOpen,
    onClose,
    sellerId,
    sellerName,
}: RejectModalProps) {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleReject = async () => {
        if (!reason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        setLoading(true);
        try {
            await api.patch('/sellers/reject', {
                id: sellerId,
                rejectionReason: reason
            });

            toast.success(`${sellerName} has been rejected.`);
            queryClient.invalidateQueries({ queryKey: ['sellers'] });
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reject seller');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reject Seller</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to reject {sellerName}? This will prevent them from
                        selling on the platform.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="reason" className="text-left">
                            Reason for Rejection
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder="Incomplete documentation..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleReject} loading={loading}>
                        Reject
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
