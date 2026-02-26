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

interface BlockUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName: string;
    loading?: boolean;
}

export function BlockUserModal({
    isOpen,
    onClose,
    onConfirm,
    userName,
    loading = false,
}: BlockUserModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Block User</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to block {userName}? This will prevent them from accessing the platform.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={loading}>
                        {loading ? 'Blocking...' : 'Block User'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
