'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { Separator } from '@/components/ui/separator';
import {
    CheckCircle,
    XCircle,
    Undo2,
    AlertCircle,
    Package,
    Store,
    Layout
} from 'lucide-react';
import Image from 'next/image';

interface ProductDetailModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onRevert: (id: string) => void;
}

export function ProductDetailModal({
    product,
    isOpen,
    onClose,
    onApprove,
    onReject,
    onRevert
}: ProductDetailModalProps) {
    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold">{product.product_name}</DialogTitle>
                        <Badge
                            variant={
                                product.status === 'Published' ? 'success' :
                                    product.status === 'Draft' ? 'secondary' :
                                        'destructive'
                            }
                        >
                            {product.status}
                        </Badge>
                    </div>
                    <DialogDescription>
                        Product ID: {product._id}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {/* Image Placeholder or Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square relative rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.product_name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <Package className="h-16 w-16 text-muted-foreground/30" />
                            )}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="grid gap-4">
                            <div className="flex items-center gap-2">
                                <Store className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Seller:</span>
                                <span className="text-sm">{product.seller_id?.business_name || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Layout className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Category:</span>
                                <span className="text-sm">{product.category_id?.name || 'N/A'}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Selling Price:</span>
                                <span className="text-emerald-600">₹{product.selling_price}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground italic">
                                <span>Base Price:</span>
                                <span>₹{product.base_price}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Available Stock:</span>
                                <Badge variant={product.stock_count < 10 ? 'destructive' : 'outline'}>
                                    {product.stock_count} Units
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Description</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {product.description}
                    </p>
                </div>

                {product.rejectionReason && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
                        <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-destructive uppercase">Rejection Reason</p>
                            <p className="text-sm">{product.rejectionReason}</p>
                        </div>
                    </div>
                )}

                <DialogFooter className="flex gap-2 sm:justify-start pt-6 border-t">
                    <div className="flex flex-wrap gap-2 w-full">
                        {product.status !== 'Published' && (
                            <Button variant="success" className="gap-2" onClick={() => onApprove(product._id)}>
                                <CheckCircle className="h-4 w-4" /> Approve & Publish
                            </Button>
                        )}
                        {product.status === 'Published' && (
                            <Button variant="destructive" className="gap-2" onClick={() => onReject(product._id)}>
                                <XCircle className="h-4 w-4" /> Reject/Unpublish
                            </Button>
                        )}
                        {product.status !== 'Draft' && (
                            <Button variant="outline" className="gap-2" onClick={() => onRevert(product._id)}>
                                <Undo2 className="h-4 w-4" /> Revert to Draft
                            </Button>
                        )}
                        <Button variant="secondary" className="ml-auto" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
