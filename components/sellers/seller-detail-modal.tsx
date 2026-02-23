"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Seller } from "@/types"
import {
    Mail,
    Phone,
    Store,
    MapPin,
    CheckCircle2,
    FileText,
    IdCard,
    Calendar,
    Loader2
} from "lucide-react"
import { useSellerDetail } from "@/lib/hooks/use-sellers"

interface SellerDetailModalProps {
    sellerId: string
    isOpen: boolean
    onClose: () => void
}

export function SellerDetailModal({ sellerId, isOpen, onClose }: SellerDetailModalProps) {
    const { data, isLoading, error } = useSellerDetail(sellerId, isOpen);
    const seller = data?.data;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] w-[95vw] max-h-[90vh] overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-10">
                        <p className="text-muted-foreground">Failed to load seller details</p>
                    </div>
                ) : seller ? (
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <Store className="w-10 h-10 text-primary" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-bold">{seller.business_name}</DialogTitle>
                                    <DialogDescription>Owner: {seller.fullname}</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem 
                                    label="Email" 
                                    value={seller.email} 
                                    icon={Mail} 
                                />
                                <DetailItem 
                                    label="Phone" 
                                    value={seller.phone_number} 
                                    icon={Phone} 
                                />
                                <DetailItem 
                                    label="GST Number" 
                                    value={seller.gst_number || "Not provided"} 
                                    icon={FileText} 
                                />
                                <DetailItem 
                                    label="Joined On" 
                                    value={new Date(seller.createdAt).toLocaleDateString()} 
                                    icon={Calendar} 
                                />
                                <DetailItem 
                                    label="Status" 
                                    value={seller.status} 
                                    icon={CheckCircle2} 
                                    isBadge 
                                    badgeVariant={seller.status === "Active" ? "default" : seller.status === "Blocked" ? "destructive" : "secondary"}
                                />
                                <DetailItem 
                                    label="Verified" 
                                    value={seller.is_verified ? "Yes" : "No"} 
                                    icon={CheckCircle2} 
                                />
                                <DetailItem 
                                    label="Approved" 
                                    value={seller.is_approved ? "Yes" : "No"} 
                                    icon={CheckCircle2} 
                                />
                            </div>

                            <div className="p-4 rounded-lg border bg-blue-50/50 dark:bg-blue-900/10">
                                <h4 className="flex items-center gap-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">
                                    <MapPin className="w-3.5 h-3.5" />
                                    Business Address
                                </h4>
                                <p className="text-sm font-medium leading-relaxed">
                                    {seller.address || "No address provided"}
                                </p>
                            </div>
                        </div>
                    </>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}

interface DetailItemProps {
    label: string;
    value: string;
    icon: React.ElementType;
    isBadge?: boolean;
    badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

function DetailItem({ label, value, icon: Icon, isBadge, badgeVariant = "default" }: DetailItemProps) {
    return (
        <div className="flex flex-col gap-1.5 p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                <Icon className="w-3 h-3" />
                {label}
            </div>
            <div className="text-sm font-semibold text-foreground">
                {isBadge ? (
                    <Badge variant={badgeVariant}>
                        {value}
                    </Badge>
                ) : (
                    value
                )}
            </div>
        </div>
    );
}