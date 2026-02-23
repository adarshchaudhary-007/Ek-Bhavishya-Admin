'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface RejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    sellerName: string;
    loading?: boolean;
}

export function RejectModal({
    isOpen,
    onClose,
    onConfirm,
    sellerName,
    loading = false,
}: RejectModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reject Seller</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to reject {sellerName}? This will change their status to Blocked.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={loading}>
                        {loading ? 'Rejecting...' : 'Reject'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}