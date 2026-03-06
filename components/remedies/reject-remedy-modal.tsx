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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface RejectRemedyModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (reason: string) => void
    remedyTitle: string
    loading: boolean
}

export function RejectRemedyModal({ isOpen, onClose, onConfirm, remedyTitle, loading }: RejectRemedyModalProps) {
    const [reason, setReason] = useState('')

    const handleConfirm = () => {
        if (!reason.trim()) return
        onConfirm(reason)
        setReason('')
    }

    const handleClose = () => {
        setReason('')
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject Remedy</DialogTitle>
                    <DialogDescription>
                        Reject &quot;{remedyTitle}&quot;. This will send a notification to the astrologer.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <Label htmlFor="rejectionReason">Rejection Reason</Label>
                    <Textarea
                        id="rejectionReason"
                        placeholder="Explain why this remedy is being rejected..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        disabled={loading}
                        rows={4}
                    />
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={loading || !reason.trim()}
                    >
                        {loading ? "Rejecting..." : "Reject Remedy"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
