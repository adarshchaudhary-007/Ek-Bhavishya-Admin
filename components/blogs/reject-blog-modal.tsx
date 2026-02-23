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

interface RejectBlogModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (reason: string) => void
    blogTitle: string
    loading?: boolean
}

export function RejectBlogModal({
    isOpen,
    onClose,
    onConfirm,
    blogTitle,
    loading = false,
}: RejectBlogModalProps) {
    const [reason, setReason] = useState("")

    const handleConfirm = () => {
        if (reason.trim()) {
            onConfirm(reason)
            setReason("")
        }
    }

    const handleClose = () => {
        setReason("")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject Blog</DialogTitle>
                    <DialogDescription>
                        Provide a reason for rejecting "{blogTitle}"
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reason">Rejection Reason</Label>
                        <Textarea
                            id="reason"
                            placeholder="Explain why this blog is being rejected..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            disabled={loading}
                            rows={4}
                        />
                    </div>
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
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={loading || !reason.trim()}
                    >
                        {loading ? "Rejecting..." : "Reject Blog"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
