"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { User } from "./columns"
import { Calendar, Mail, Phone, Wallet, CheckCircle2, UserCircle } from "lucide-react"

interface UserDetailModalProps {
    user: User | null
    isOpen: boolean
    onClose: () => void
}

export function UserDetailModal({ user, isOpen, onClose }: UserDetailModalProps) {
    if (!user) return null

    const details = [
        { label: "Email", value: user.email, icon: Mail },
        { label: "Phone", value: user.phoneNumber || "Not provided", icon: Phone },
        { label: "Wallet Balance", value: `₹${user.walletBalance}`, icon: Wallet },
        { label: "Joined On", value: new Date(user.createdAt).toLocaleDateString(), icon: Calendar },
        { label: "Status", value: user.status, icon: CheckCircle2, isBadge: true },
        { label: "Verified", value: user.is_verified ? "Yes" : "No", icon: CheckCircle2 },
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <UserCircle className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold">{user.fullName || "User Details"}</DialogTitle>
                            <DialogDescription>Full profile information for {user.email}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        {details.map((item, idx) => (
                            <div key={idx} className="flex flex-col gap-1.5 p-3 rounded-lg border bg-muted/30">
                                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider">
                                    <item.icon className="w-3.5 h-3.5" />
                                    {item.label}
                                </div>
                                <div className="text-sm font-semibold">
                                    {item.isBadge ? (
                                        <Badge variant={item.value === "Active" ? "success" : "secondary"}>
                                            {item.value}
                                        </Badge>
                                    ) : (
                                        item.value
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Additional sections like Kundli, etc. could go here if data exists */}
                    {(user.kundli || user.exanthem) && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">Additional Info</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {user.kundli && (
                                    <div className="p-3 rounded-lg border bg-muted/20 text-sm italic">
                                        Kundli: {user.kundli}
                                    </div>
                                )}
                                {user.exanthem && (
                                    <div className="p-3 rounded-lg border bg-muted/20 text-sm">
                                        Exanthem: {user.exanthem}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
