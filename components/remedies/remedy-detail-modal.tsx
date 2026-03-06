"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Remedy } from "@/lib/services/remedy-service"
import { IndianRupee, Clock, Tag, Package, Sparkles, FileText, Calendar } from "lucide-react"

interface RemedyDetailModalProps {
    isOpen: boolean
    onClose: () => void
    remedy: Remedy
}

export function RemedyDetailModal({ isOpen, onClose, remedy }: RemedyDetailModalProps) {
    if (!remedy) return null

    const getStatusVariant = (status: string) => {
        if (status === 'Approved' || status === 'Active') return 'success'
        if (status === 'Rejected' || status === 'Inactive') return 'destructive'
        return 'secondary'
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">{remedy.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-5">
                    {/* Status & Meta */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <Badge variant={getStatusVariant(remedy.status) as any} className="text-xs font-bold uppercase">
                            {remedy.status}
                        </Badge>
                        {remedy.is_featured && (
                            <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 bg-amber-50">
                                <Sparkles className="h-3 w-3 mr-1 fill-amber-500" /> Featured
                            </Badge>
                        )}
                        <Badge variant="outline" className="text-xs capitalize">
                            <Package className="h-3 w-3 mr-1" /> {remedy.delivery_type}
                        </Badge>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1">
                            <FileText className="h-3 w-3" /> Description
                        </h4>
                        <p className="text-sm text-foreground/80 leading-relaxed">{remedy.description || 'No description provided.'}</p>
                    </div>

                    <Separator />

                    {/* Pricing & Duration */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-emerald-50 rounded-lg p-3 text-center">
                            <IndianRupee className="h-4 w-4 mx-auto text-emerald-600 mb-1" />
                            <p className="text-lg font-bold text-emerald-700">₹{remedy.base_price?.toLocaleString('en-IN')}</p>
                            <p className="text-[10px] text-emerald-600/70 font-medium">Base Price</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <Clock className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                            <p className="text-lg font-bold text-blue-700">{remedy.duration_minutes} min</p>
                            <p className="text-[10px] text-blue-600/70 font-medium">Duration</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                            <Tag className="h-4 w-4 mx-auto text-purple-600 mb-1" />
                            <p className="text-lg font-bold text-purple-700">{remedy.category || '—'}</p>
                            <p className="text-[10px] text-purple-600/70 font-medium">Category</p>
                        </div>
                    </div>

                    {/* Tags */}
                    {remedy.tags && remedy.tags.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {remedy.tags.map((tag, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Specializations (Packages) */}
                    {remedy.specializations && remedy.specializations.length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Packages</h4>
                                <div className="space-y-2">
                                    {remedy.specializations.map((spec, i) => (
                                        <div key={i} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
                                            <div>
                                                <p className="text-sm font-semibold">{spec.name}</p>
                                                <p className="text-xs text-muted-foreground">{spec.description} · {spec.duration_minutes} min</p>
                                            </div>
                                            <span className="text-sm font-bold text-emerald-700">₹{spec.price?.toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Requirements */}
                    {remedy.requirements && remedy.requirements.length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Requirements</h4>
                                <div className="space-y-1">
                                    {remedy.requirements.map((req, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm">
                                            <span>{req.field_name} <Badge variant="outline" className="text-[10px] ml-1">{req.field_type}</Badge></span>
                                            {req.is_required && <Badge variant="destructive" className="text-[10px] h-4">Required</Badge>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Rejection Reason */}
                    {remedy.rejectionReason && (
                        <>
                            <Separator />
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <h4 className="text-xs font-bold text-red-800 uppercase tracking-widest mb-1">Rejection Reason</h4>
                                <p className="text-sm text-red-700">{remedy.rejectionReason}</p>
                            </div>
                        </>
                    )}

                    {/* Dates */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Created: {new Date(remedy.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Updated: {new Date(remedy.updatedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
