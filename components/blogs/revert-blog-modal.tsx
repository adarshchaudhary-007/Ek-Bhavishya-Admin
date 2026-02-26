"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface RevertBlogModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (reason: string) => void
    blogTitle: string
    currentStatus: 'Approved' | 'Rejected'
    loading?: boolean
}

export function RevertBlogModal({
    isOpen,
    onClose,
    onConfirm,
    blogTitle,
    currentStatus,
    loading = false,
}: RevertBlogModalProps) {
    const [reason, setReason] = useState("")
    const [error, setError] = useState("")
    const newStatus = currentStatus === 'Approved' ? 'Rejected' : 'Approved'

    const handleConfirm = () => {
        if (!reason.trim()) {
            setError("Please provide a reason for reverting the status")
            return
        }
        if (reason.trim().length < 10) {
            setError("Reason must be at least 10 characters long")
            return
        }
        onConfirm(reason.trim())
        setReason("")
        setError("")
    }

    const handleClose = () => {
        setReason("")
        setError("")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Revert Blog Status</DialogTitle>
                    <DialogDescription>
                        You are reverting the status of "{blogTitle}" from {currentStatus} to {newStatus}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Reversion *</Label>
                    <Textarea
                        id="reason"
                        placeholder="Please provide a detailed reason for reverting the blog status..."
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value)
                            setError("")
                        }}
                        className={error ? "border-destructive" : ""}
                        rows={4}
                        disabled={loading}
                    />
                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? "Reverting..." : "Revert Status"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
