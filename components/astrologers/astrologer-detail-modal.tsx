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
    DollarSign,
    ShieldCheck,
    AlertCircle,
    Infinity,
    Gift,
    XCircle,
    Video,
    MessageSquare,
    Info,
    History,
    Calendar,
    Settings2,
    User
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

interface AstrologerDetailModalProps {
    astrologer: Astrologer | null
    isOpen: boolean
    onClose: () => void
}

export function AstrologerDetailModal({ astrologer, isOpen, onClose }: AstrologerDetailModalProps) {
    if (!astrologer) return null

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="bg-primary/10 p-3 rounded-full overflow-hidden w-16 h-16 flex items-center justify-center border-2 border-primary/20">
                                {astrologer.personalDetails.profileImage ? (
                                    <img
                                        src={astrologer.personalDetails.profileImage}
                                        alt={astrologer.personalDetails.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <UserCircle className="w-10 h-10 text-primary" />
                                )}
                            </div>
                            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${astrologer.availability.status === 'online' ? 'bg-success' : 'bg-muted-foreground'}`} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <DialogTitle className="text-2xl font-bold">{astrologer.personalDetails.name}</DialogTitle>
                                {astrologer.isExclusive && (
                                    <Badge variant="success" className="bg-amber-500 hover:bg-amber-600 text-white border-0">
                                        <Infinity className="w-3 h-3 mr-1" /> Exclusive
                                    </Badge>
                                )}
                            </div>
                            <DialogDescription className="flex items-center gap-2 mt-1">
                                {astrologer.personalDetails.pseudonym && (
                                    <span className="font-medium text-primary">@{astrologer.personalDetails.pseudonym}</span>
                                )}
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    {astrologer.ratings.average.toFixed(1)} ({astrologer.ratings.count} reviews)
                                </span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Tabs defaultValue="profile" className="flex-1 flex flex-col">
                    <TabsList className="px-6 bg-transparent border-b rounded-none h-auto gap-6 justify-start overflow-x-auto">
                        <TabsTrigger value="profile" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2 border-b-2 border-transparent">Profile</TabsTrigger>
                        <TabsTrigger value="pricing" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2 border-b-2 border-transparent">Pricing</TabsTrigger>
                        <TabsTrigger value="availability" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2 border-b-2 border-transparent">Availability</TabsTrigger>
                        <TabsTrigger value="system" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-2 border-b-2 border-transparent">System Status</TabsTrigger>
                    </TabsList>

                    <div className="flex-1 overflow-y-auto p-6">
                        <TabsContent value="profile" className="mt-0 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailItem icon={Mail} label="Email" value={astrologer.personalDetails.email} />
                                <DetailItem icon={Phone} label="Phone" value={astrologer.personalDetails.phone} />
                                <DetailItem icon={Briefcase} label="Experience" value={`${astrologer.personalDetails.experience} Years`} />
                                <DetailItem icon={User} label="Gender" value={astrologer.personalDetails.gender || "Not specified"} />
                            </div>

                            <div className="space-y-4">
                                <section>
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                        <Info className="w-3.5 h-3.5" />
                                        About
                                    </h4>
                                    <p className="text-sm text-foreground leading-relaxed bg-muted/30 p-4 rounded-lg border">
                                        {astrologer.personalDetails.about || "No biography provided."}
                                    </p>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <section>
                                        <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                            <Star className="w-3.5 h-3.5" />
                                            Skills & Expertise
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {astrologer.personalDetails.skills.length > 0 ? (
                                                astrologer.personalDetails.skills.map((skill, i) => (
                                                    <Badge key={i} variant="outline" className="bg-primary/5">{skill}</Badge>
                                                ))
                                            ) : (
                                                <span className="text-sm text-muted-foreground italic">None listed</span>
                                            )}
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                            <Languages className="w-3.5 h-3.5" />
                                            Languages
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {astrologer.personalDetails.languages.length > 0 ? (
                                                astrologer.personalDetails.languages.map((lang, i) => (
                                                    <Badge key={i} variant="secondary" className="font-normal">{lang}</Badge>
                                                ))
                                            ) : (
                                                <span className="text-sm text-muted-foreground italic">None listed</span>
                                            )}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="pricing" className="mt-0 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <PricingCard icon={Phone} label="Call Rate" rate={astrologer.pricing.call} color="blue" />
                                <PricingCard icon={MessageSquare} label="Chat Rate" rate={astrologer.pricing.chat} color="green" />
                                <PricingCard icon={Video} label="Video Rate" rate={astrologer.pricing.video} color="purple" />
                            </div>

                            {astrologer.callSettings && (
                                <section className="mt-6">
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                        <Settings2 className="w-3.5 h-3.5" />
                                        Call Settings
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                        <StatusToggle label="Accept Audio Calls" active={astrologer.callSettings.acceptAudioCalls} />
                                        <StatusToggle label="Accept Video Calls" active={astrologer.callSettings.acceptVideoCalls} />
                                        <DetailItem icon={Phone} label="Audio Rate (Settings)" value={`₹${astrologer.callSettings.audioCallRate}/min`} />
                                        <DetailItem icon={Video} label="Video Rate (Settings)" value={`₹${astrologer.callSettings.videoCallRate}/min`} />
                                    </div>
                                </section>
                            )}
                        </TabsContent>

                        <TabsContent value="availability" className="mt-0 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailItem
                                    icon={CheckCircle2}
                                    label="Current Status"
                                    value={astrologer.availability.status}
                                    isBadge
                                    badgeVariant={astrologer.availability.status === 'online' ? 'success' : 'secondary'}
                                />
                                <DetailItem
                                    icon={History}
                                    label="Last Online"
                                    value={formatDate(astrologer.availability.lastOnlineAt)}
                                />
                            </div>

                            <section>
                                <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                    <Settings2 className="w-3.5 h-3.5" />
                                    Service Toggles
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <StatusToggle icon={Phone} label="Call Available" active={astrologer.availability.isCallAvailable} />
                                    <StatusToggle icon={MessageSquare} label="Chat Available" active={astrologer.availability.isChatAvailable} />
                                    <StatusToggle icon={Video} label="Video Available" active={astrologer.availability.isVideoAvailable} />
                                </div>
                            </section>

                            {astrologer.availability.currentCallId && (
                                <div className="p-4 rounded-lg border bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 flex items-center gap-4">
                                    <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full text-amber-600 dark:text-amber-400">
                                        <Phone className="w-5 h-5 animate-pulse" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Active Meeting / Call</p>
                                        <p className="text-sm font-semibold truncate max-w-[400px]">ID: {astrologer.availability.currentCallId}</p>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="system" className="mt-0 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailItem icon={ShieldCheck} label="Verification" value={astrologer.verificationStatus} isBadge badgeVariant={astrologer.verificationStatus === 'Verified' ? 'success' : 'secondary'} />
                                <DetailItem icon={History} label="Onboarding" value={astrologer.onboardingStatus} isBadge badgeVariant={astrologer.onboardingStatus === 'Completed' ? 'success' : 'secondary'} />
                                <DetailItem icon={CheckCircle2} label="Approval Status" value={astrologer.isApproved ? "Approved" : "Pending Approval"} isBadge badgeVariant={astrologer.isApproved ? 'success' : 'secondary'} />
                                <DetailItem icon={DollarSign} label="Wallet Balance" value={`₹${astrologer.walletBalance.toLocaleString('en-IN')}`} />
                            </div>

                            <section>
                                <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                    <Gift className="w-3.5 h-3.5" />
                                    Referral Program
                                </h4>
                                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border bg-muted/20">
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Referral Code</p>
                                        <p className="text-sm font-bold font-mono">{astrologer.referral?.code || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Rewards</p>
                                        <p className="text-sm font-bold">₹{astrologer.referral?.totalRewards || 0}</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h4 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Timeline
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem icon={Clock} label="Joined On" value={formatDate(astrologer.createdAt)} />
                                    <DetailItem icon={Clock} label="Last Updated" value={formatDate(astrologer.updatedAt)} />
                                </div>
                            </section>

                            {astrologer.rejectionDetails?.reason && (
                                <section className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-destructive uppercase tracking-widest mb-2">
                                        <XCircle className="w-4 h-4" />
                                        Rejection Details
                                    </h4>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-foreground">{astrologer.rejectionDetails.reason}</p>
                                        <p className="text-[10px] font-medium text-muted-foreground uppercase italic px-1">
                                            Rejected on: {formatDate(astrologer.rejectionDetails.date)}
                                        </p>
                                    </div>
                                </section>
                            )}
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

function DetailItem({ icon: Icon, label, value, isBadge, badgeVariant }: { icon: any, label: string, value: string | number, isBadge?: boolean, badgeVariant?: any }) {
    return (
        <div className="flex flex-col gap-1.5 p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                <Icon className="w-3 h-3" />
                {label}
            </div>
            <div className="text-sm font-semibold text-foreground">
                {isBadge ? (
                    <Badge variant={badgeVariant || "secondary"} className="capitalize">
                        {value}
                    </Badge>
                ) : (
                    value
                )}
            </div>
        </div>
    )
}

function PricingCard({ icon: Icon, label, rate, color }: { icon: any, label: string, rate: number, color: 'blue' | 'green' | 'purple' }) {
    const variants = {
        blue: "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400",
        green: "bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-800 text-green-600 dark:text-green-400",
        purple: "bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800 text-purple-600 dark:text-purple-400",
    }

    return (
        <Card className={`${variants[color]} border shadow-none`}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">{label}</p>
                    <Icon className="w-4 h-4 opacity-70" />
                </div>
                <p className="text-xl font-bold flex items-baseline gap-1">
                    ₹{rate}
                    <span className="text-[10px] font-normal opacity-70">/min</span>
                </p>
            </CardContent>
        </Card>
    )
}

function StatusToggle({ icon: Icon, label, active }: { icon?: any, label: string, active: boolean }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/10 h-12">
            <div className="flex items-center gap-2 overflow-hidden">
                {Icon && <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                <span className="text-sm font-medium text-foreground truncate">{label}</span>
            </div>
            <Badge variant={active ? "success" : "secondary"} className="h-5 px-1.5 text-[10px]">
                {active ? "ON" : "OFF"}
            </Badge>
        </div>
    )
}
