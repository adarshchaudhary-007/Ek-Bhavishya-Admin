"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User } from "./columns"
import { Mail, Phone, Wallet, CheckCircle2, UserCircle, Clock } from "lucide-react"
import Image from "next/image"

interface UserDetailModalProps {
    user: User | null
    isOpen: boolean
    onClose: () => void
}

export function UserDetailModal({ user, isOpen, onClose }: UserDetailModalProps) {
    if (!user) return null

    const freeMinutesRemaining = user.freeMinutes 
        ? user.freeMinutes.total - user.freeMinutes.used 
        : 0

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-2">
                        {user.profilePhoto ? (
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                                <Image 
                                    src={user.profilePhoto} 
                                    alt={user.fullName || "User"} 
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="bg-primary/10 p-3 rounded-full">
                                <UserCircle className="w-10 h-10 text-primary" />
                            </div>
                        )}
                        <div>
                            <DialogTitle className="text-2xl font-bold">{user.fullName || "User Details"}</DialogTitle>
                            <DialogDescription>Full profile information</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Personal Information Section */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Personal Information</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <DetailItem 
                                label="Full Name" 
                                value={user.fullName || "Not provided"} 
                                icon={UserCircle} 
                            />
                            <DetailItem 
                                label="Email" 
                                value={user.email} 
                                icon={Mail} 
                            />
                            <DetailItem 
                                label="Phone Number" 
                                value={user.phoneNumber || "Not provided"} 
                                icon={Phone} 
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Account Status Section */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Account Status</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <DetailItem 
                                label="Account Status" 
                                value={user.status} 
                                icon={CheckCircle2} 
                                isBadge
                                badgeVariant={user.status === "Active" ? "default" : "secondary"}
                            />
                            <DetailItem 
                                label="Verification Status" 
                                value={user.is_verified ? "Verified" : "Unverified"} 
                                icon={CheckCircle2} 
                                isBadge
                                badgeVariant={user.is_verified ? "default" : "secondary"}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Wallet Section */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Wallet</h4>
                        <div className="grid grid-cols-1 gap-3">
                            <DetailItem 
                                label="Wallet Balance" 
                                value={`₹${user.walletBalance.toFixed(2)}`} 
                                icon={Wallet} 
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Free Minutes Section */}
                    {user.freeMinutes && (
                        <>
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Free Minutes</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <DetailItem 
                                        label="Total" 
                                        value={`${user.freeMinutes.total} min`} 
                                        icon={Clock} 
                                    />
                                    <DetailItem 
                                        label="Used" 
                                        value={`${user.freeMinutes.used} min`} 
                                        icon={Clock} 
                                    />
                                    <DetailItem 
                                        label="Remaining" 
                                        value={`${freeMinutesRemaining} min`} 
                                        icon={Clock} 
                                    />
                                </div>
                            </div>
                            <Separator />
                        </>
                    )}

                    {/* Astrology Data Section */}
                    {(user.kundli || user.exanthem) && (
                        <>
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Astrology Data</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {user.kundli && (
                                        <div className="p-3 rounded-lg border bg-muted/20">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Kundli</p>
                                            <p className="text-sm font-semibold">{typeof user.kundli === 'string' ? user.kundli : JSON.stringify(user.kundli)}</p>
                                        </div>
                                    )}
                                    {user.exanthem && (
                                        <div className="p-3 rounded-lg border bg-muted/20">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Exanthem</p>
                                            <p className="text-sm font-semibold">{typeof user.exanthem === 'string' ? user.exanthem : JSON.stringify(user.exanthem)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Separator />
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

interface DetailItemProps {
    label: string
    value: string
    icon: React.ElementType
    isBadge?: boolean
    badgeVariant?: "default" | "secondary" | "destructive" | "outline"
}

function DetailItem({ label, value, icon: Icon, isBadge, badgeVariant = "default" }: DetailItemProps) {
    return (
        <div className="flex flex-col gap-1.5 p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider">
                <Icon className="w-3.5 h-3.5" />
                {label}
            </div>
            <div className="text-sm font-semibold">
                {isBadge ? (
                    <Badge variant={badgeVariant}>
                        {value}
                    </Badge>
                ) : (
                    value
                )}
            </div>
        </div>
    )
}
