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
    Calendar,
    User,
    CreditCard,
    Building2,
    Image as ImageIcon,
} from "lucide-react"
import Image from "next/image"

interface SellerDetailModalProps {
    seller: Seller | null
    isOpen: boolean
    onClose: () => void
}

export function SellerDetailModal({ seller, isOpen, onClose }: SellerDetailModalProps) {
    if (!seller) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-2">
                        {seller.profile_image ? (
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                                <Image 
                                    src={seller.profile_image} 
                                    alt={seller.business_name} 
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="bg-primary/10 p-3 rounded-full">
                                <Store className="w-10 h-10 text-primary" />
                            </div>
                        )}
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
                            label="Aadhaar Number" 
                            value={seller.adhar_number || "Not provided"} 
                            icon={User} 
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

                    {/* Documents Section */}
                    {(seller.gst_document || seller.adhar_document || (seller.documents && (seller.documents.gstCertificate || seller.documents.businessLicense))) && (
                        <div className="p-4 rounded-lg border bg-muted/30">
                            <h4 className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                <FileText className="w-3.5 h-3.5" />
                                Documents
                            </h4>
                            <div className="space-y-2">
                                {seller.gst_document && (
                                    <div className="text-sm">
                                        <span className="font-medium">GST Document: </span>
                                        <a href={seller.gst_document} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                            View Document
                                        </a>
                                    </div>
                                )}
                                {seller.adhar_document && (
                                    <div className="text-sm">
                                        <span className="font-medium">Aadhaar Document: </span>
                                        <a href={seller.adhar_document} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                            View Document
                                        </a>
                                    </div>
                                )}
                                {seller.documents?.gstCertificate && (
                                    <div className="text-sm">
                                        <span className="font-medium">GST Certificate: </span>
                                        <span className="text-muted-foreground">{seller.documents.gstCertificate}</span>
                                    </div>
                                )}
                                {seller.documents?.businessLicense && (
                                    <div className="text-sm">
                                        <span className="font-medium">Business License: </span>
                                        <span className="text-muted-foreground">{seller.documents.businessLicense}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Bank Details Section */}
                    {(seller.bank_account_no || seller.ifsc_code || seller.bank_holder_name || seller.bankDetails) && (
                        <div className="p-4 rounded-lg border bg-muted/30">
                            <h4 className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                <Building2 className="w-3.5 h-3.5" />
                                Bank Details
                            </h4>
                            <div className="space-y-2">
                                <div className="text-sm">
                                    <span className="font-medium">Account Holder: </span>
                                    <span className="text-muted-foreground">
                                        {seller.bank_holder_name || seller.bankDetails?.accountHolderName || "Not provided"}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium">Account Number: </span>
                                    <span className="text-muted-foreground">
                                        {seller.bank_account_no || seller.bankDetails?.accountNumber || "Not provided"}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium">IFSC Code: </span>
                                    <span className="text-muted-foreground">
                                        {seller.ifsc_code || seller.bankDetails?.ifscCode || "Not provided"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
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