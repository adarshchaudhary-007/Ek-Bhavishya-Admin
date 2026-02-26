"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { RejectModal } from "./reject-modal"
import { SellerDetailModal } from "./seller-detail-modal"
import { Eye, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { useApproveSeller, useRejectSeller, useRevertSeller } from "@/lib/hooks/use-sellers"
import { Seller } from "@/types"

export const columns: ColumnDef<Seller>[] = [
    {
        accessorKey: "business_name",
        header: "Business Name",
        cell: ({ row }: { row: Row<Seller> }) => {
            const seller = row.original
            return (
                <div className="max-w-[200px]">
                    <p className="font-medium truncate" title={seller.business_name}>{seller.business_name}</p>
                    <p className="text-xs text-gray-500 truncate" title={seller.email}>{seller.email}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "fullname",
        header: "Owner Name",
        cell: ({ row }: { row: Row<Seller> }) => {
            return <span className="text-sm">{row.getValue("fullname") || "N/A"}</span>
        }
    },
    {
        accessorKey: "phone_number",
        header: "Phone",
        cell: ({ row }: { row: Row<Seller> }) => {
            return <span className="text-sm">{row.getValue("phone_number") || "N/A"}</span>
        }
    },
    {
        accessorKey: "is_verified",
        header: "Verification",
        cell: ({ row }: { row: Row<Seller> }) => {
            const isVerified = row.getValue("is_verified") as boolean
            return (
                <Badge variant={isVerified ? "default" : "secondary"} className="text-[10px] font-bold uppercase py-0 px-1.5 h-5">
                    {isVerified ? "Verified" : "Unverified"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: Row<Seller> }) => {
            const seller = row.original;
            const status = seller.status;
            const isApproved = seller.is_approved;

            // Determine display status and variant
            let displayStatus: string = status;
            let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";

            if (status === "Active" && isApproved) {
                displayStatus = "Approved";
                variant = "default";
            } else if (status === "Blocked") {
                displayStatus = "Rejected";
                variant = "destructive";
            } else if (status === "Inactive" && !isApproved) {
                displayStatus = "Pending";
                variant = "secondary";
            }

            return (
                <Badge variant={variant} className="text-[10px] font-bold uppercase py-0 px-1.5 h-5">
                    {displayStatus}
                </Badge>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }: { row: Row<Seller> }) => {
            const date = new Date(row.getValue("createdAt"));
            return <span className="text-sm">{date.toLocaleDateString()}</span>
        }
    },
    {
        id: "actions",
        cell: ({ row }: { row: Row<Seller> }) => {
            return <ActionCell seller={row.original} />
        },
    },
]

const ActionCell = ({ seller }: { seller: Seller }) => {
    const [openReject, setOpenReject] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const approveMutation = useApproveSeller();
    const rejectMutation = useRejectSeller();
    const revertMutation = useRevertSeller();

    const handleApprove = () => {
        approveMutation.mutate(seller._id);
    };

    const handleReject = () => {
        rejectMutation.mutate(seller._id);
        setOpenReject(false);
    };

    const handleRevert = () => {
        revertMutation.mutate(seller._id);
    };

    const isLoading = approveMutation.isPending || rejectMutation.isPending || revertMutation.isPending;
    const isApproved = seller.is_approved && seller.status === "Active";
    const isRejected = seller.status === "Blocked";
    const isPending = !seller.is_approved && seller.status === "Inactive";

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setShowDetails(true)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {isPending && (
                        <>
                            <DropdownMenuItem
                                className="text-green-600 cursor-pointer font-medium"
                                onClick={handleApprove}
                                disabled={isLoading}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" /> Approve Seller
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive cursor-pointer font-medium"
                                onClick={() => setOpenReject(true)}
                                disabled={isLoading}
                            >
                                <XCircle className="mr-2 h-4 w-4" /> Reject Seller
                            </DropdownMenuItem>
                        </>
                    )}

                    {(isApproved || isRejected) && (
                        <DropdownMenuItem
                            className="text-blue-600 cursor-pointer font-medium"
                            onClick={handleRevert}
                            disabled={isLoading}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" /> Revert Status
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <SellerDetailModal
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
                seller={seller}
            />

            <RejectModal
                isOpen={openReject}
                onClose={() => setOpenReject(false)}
                onConfirm={handleReject}
                sellerName={seller.fullname}
                loading={isLoading}
            />
        </>
    )
}