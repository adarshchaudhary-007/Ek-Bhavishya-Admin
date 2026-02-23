"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Astrologer } from "./columns"
import {
    Mail,
    Phone,
    Briefcase,
    Languages,
    Star,
    CheckCircle2,
    UserCircle,
    Clock,
    DollarSign
} from "lucide-react"

interface AstrologerDetailModalProps {
    astrologer: Astrologer | null
    isOpen: boolean
    onClose: () => void
}

export function AstrologerDetailModal({ astrologer, isOpen, onClose }: AstrologerDetailModalProps) {
    if (!astrologer) return null

    const details = [
        { label: "Email", value: astrologer.personalDetails.email, icon: Mail },
        { label: "Phone", value: astrologer.personalDetails.phone, icon: Phone },
        { label: "Experience", value: `${astrologer.personalDetails.experience} Years`, icon: Briefcase },
        { label: "Rating", value: `${astrologer.ratings.average.toFixed(1)} (${astrologer.ratings.count} reviews)`, icon: Star },
        { label: "Wallet Balance", value: `₹${astrologer.walletBalance}`, icon: DollarSign },
        { label: "Joined On", value: new Date(astrologer.createdAt).toLocaleDateString(), icon: Clock },
        { label: "Status", value: astrologer.availability.status, icon: CheckCircle2, isBadge: true },
        { label: "Approved", value: astrologer.isApproved ? "Yes" : "No", icon: CheckCircle2 },
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <UserCircle className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold">{astrologer.personalDetails.name}</DialogTitle>
                            <DialogDescription>
                                {astrologer.personalDetails.pseudonym ? `Pseudonym: ${astrologer.personalDetails.pseudonym}` : "Detailed Profile View"}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 gap-4">
                        {details.map((item, idx) => (
                            <div key={idx} className="flex flex-col gap-1.5 p-3 rounded-lg border bg-muted/30">
                                <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                                    <item.icon className="w-3 h-3" />
                                    {item.label}
                                </div>
                                <div className="text-sm font-semibold text-foreground">
                                    {item.isBadge ? (
                                        <Badge variant={item.value === "online" ? "success" : "secondary"}>
                                            {item.value}
                                        </Badge>
                                    ) : (
                                        item.value
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                <Star className="w-3.5 h-3.5" />
                                Skills & Expertise
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {astrologer.personalDetails.skills.map((skill, i) => (
                                    <Badge key={i} variant="outline" className="bg-primary/5">{skill}</Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                <Languages className="w-3.5 h-3.5" />
                                Languages
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {astrologer.personalDetails.languages.map((lang, i) => (
                                    <Badge key={i} variant="secondary" className="font-normal">{lang}</Badge>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-lg border bg-blue-50/50 dark:bg-blue-900/10">
                                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">Call Rate</p>
                                <p className="text-lg font-bold">₹{astrologer.pricing.call}/min</p>
                            </div>
                            <div className="p-3 rounded-lg border bg-green-50/50 dark:bg-green-900/10">
                                <p className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase mb-1">Chat Rate</p>
                                <p className="text-lg font-bold">₹{astrologer.pricing.chat}/min</p>
                            </div>
                            <div className="p-3 rounded-lg border bg-purple-50/50 dark:bg-purple-900/10">
                                <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase mb-1">Video Rate</p>
                                <p className="text-lg font-bold">₹{astrologer.pricing.video}/min</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
