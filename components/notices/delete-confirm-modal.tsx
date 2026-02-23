"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    noticeTitle: string
    loading?: boolean
}

export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    noticeTitle,
    loading = false,
}: DeleteConfirmModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Notice</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this notice?
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="bg-red-50 p-3 rounded">
                        <p className="text-sm font-medium text-red-900">"{noticeTitle}"</p>
                    </div>
                    <p className="text-sm text-gray-600">
                        This action cannot be undone. The notice and all its delivery records will be permanently deleted.
                    </p>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete Notice"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
