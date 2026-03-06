'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, CheckCircle, XCircle, Undo2, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { useState } from 'react';
import { ProductDetailModal } from './product-detail-modal';
import { useApproveProduct, useRejectProduct, useRevertProduct, useDeleteProduct } from '@/lib/hooks/use-products';

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: 'product_name',
        header: 'Product Name',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-semibold">{row.original.product_name}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">{row.original.description}</span>
            </div>
        )
    },
    {
        accessorKey: 'seller_id.business_name',
        header: 'Seller',
        cell: ({ row }) => row.original.seller_id?.business_name || 'N/A'
    },
    {
        accessorKey: 'category_id.name',
        header: 'Category',
        cell: ({ row }) => row.original.category_id?.name || 'N/A'
    },
    {
        accessorKey: 'selling_price',
        header: 'Price',
        cell: ({ row }) => `₹${row.original.selling_price}`
    },
    {
        accessorKey: 'stock_count',
        header: 'Stock',
        cell: ({ row }) => (
            <span className={row.original.stock_count < 10 ? 'text-destructive font-bold' : ''}>
                {row.original.stock_count}
            </span>
        )
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge
                    variant={
                        status === 'Published' ? 'success' :
                            status === 'Draft' ? 'secondary' :
                                'destructive'
                    }
                >
                    {status}
                </Badge>
            );
        }
    },
    {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: ({ row }) => format(new Date(row.original.createdAt), 'dd MMM yyyy')
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionCell product={row.original} />
    }
];

const ActionCell = ({ product }: { product: Product }) => {
    const [showDetails, setShowDetails] = useState(false);

    const approveMutation = useApproveProduct();
    const rejectMutation = useRejectProduct();
    const revertMutation = useRevertProduct();
    const deleteMutation = useDeleteProduct();

    const handleApprove = () => approveMutation.mutate(product._id);
    const handleReject = () => {
        const reason = prompt("Enter rejection reason (optional):");
        rejectMutation.mutate({ id: product._id, reason: reason || undefined });
    };
    const handleRevert = () => revertMutation.mutate(product._id);
    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this product?")) {
            deleteMutation.mutate(product._id);
        }
    };

    const isLoading = approveMutation.isPending || rejectMutation.isPending || revertMutation.isPending || deleteMutation.isPending;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setShowDetails(true)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {product.status !== 'Published' && (
                        <DropdownMenuItem onClick={handleApprove}>
                            <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" /> Approve & Publish
                        </DropdownMenuItem>
                    )}
                    {product.status === 'Published' && (
                        <DropdownMenuItem onClick={handleReject}>
                            <XCircle className="mr-2 h-4 w-4 text-destructive" /> Reject/Unpublish
                        </DropdownMenuItem>
                    )}
                    {product.status !== 'Draft' && (
                        <DropdownMenuItem onClick={handleRevert}>
                            <Undo2 className="mr-2 h-4 w-4 text-muted-foreground" /> Revert to Draft
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive font-medium" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Product
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ProductDetailModal
                product={product}
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
                onApprove={handleApprove}
                onReject={handleReject}
                onRevert={handleRevert}
            />
        </>
    );
};
