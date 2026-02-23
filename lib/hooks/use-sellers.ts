/**
 * Seller Management Query Hooks
 * TanStack Query hooks for seller operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SellerService } from '@/lib/services/seller-service';
import { queryKeys, invalidationHelpers } from '@/lib/query-keys';
import { 
    SellersResponse, 
    SellerDetailResponse, 
    OperationResponse, 
    PaginationParams 
} from '@/types';

/**
 * Hook to fetch all sellers with pagination
 */
export function useSellers(params?: PaginationParams) {
    return useQuery({
        queryKey: queryKeys.sellers.list(params),
        queryFn: () => SellerService.getAllSellers(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook to fetch seller details by ID
 */
export function useSellerDetail(id: string, enabled: boolean = true) {
    return useQuery({
        queryKey: queryKeys.sellers.detail(id),
        queryFn: () => SellerService.getSellerById(id),
        enabled: enabled && !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to approve a seller
 */
export function useApproveSeller() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => {
            console.log('[useApproveSeller] Approving seller:', id);
            return SellerService.approveSeller(id);
        },
        onSuccess: (data, sellerId) => {
            console.log('[useApproveSeller] Success response:', data);
            toast.success(data.message || 'Seller approved successfully');
            
            // Update ALL seller list queries in cache
            console.log('[useApproveSeller] Updating cache for all seller queries');
            queryClient.setQueriesData(
                { queryKey: queryKeys.sellers.lists() },
                (oldData: any) => {
                    if (!oldData?.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((seller: any) =>
                            seller._id === sellerId
                                ? { ...seller, is_approved: true, status: 'Active' }
                                : seller
                        ),
                    };
                }
            );
            
            // Also invalidate to ensure fresh data
            console.log('[useApproveSeller] Invalidating ALL seller queries');
            queryClient.invalidateQueries({ queryKey: queryKeys.sellers.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useApproveSeller] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to approve seller';
            toast.error(errorMessage);
        },
    });
}

/**
 * Hook to reject a seller
 */
export function useRejectSeller() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => {
            console.log('[useRejectSeller] Rejecting seller:', id);
            return SellerService.rejectSeller(id);
        },
        onSuccess: (data, sellerId) => {
            console.log('[useRejectSeller] Success response:', data);
            toast.success(data.message || 'Seller rejected successfully');
            
            // Update ALL seller list queries in cache
            console.log('[useRejectSeller] Updating cache for all seller queries');
            queryClient.setQueriesData(
                { queryKey: queryKeys.sellers.lists() },
                (oldData: any) => {
                    if (!oldData?.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((seller: any) =>
                            seller._id === sellerId
                                ? { ...seller, is_approved: false, status: 'Blocked' }
                                : seller
                        ),
                    };
                }
            );
            
            // Also invalidate to ensure fresh data
            console.log('[useRejectSeller] Invalidating ALL seller queries');
            queryClient.invalidateQueries({ queryKey: queryKeys.sellers.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useRejectSeller] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to reject seller';
            toast.error(errorMessage);
        },
    });
}

/**
 * Hook to revert seller status
 */
export function useRevertSeller() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => {
            console.log('[useRevertSeller] Reverting seller status:', id);
            return SellerService.revertSellerStatus(id);
        },
        onSuccess: (data, sellerId) => {
            console.log('[useRevertSeller] Success response:', data);
            toast.success(data.message || 'Seller status reverted successfully');
            
            // Update ALL seller list queries in cache
            console.log('[useRevertSeller] Updating cache for all seller queries');
            queryClient.setQueriesData(
                { queryKey: queryKeys.sellers.lists() },
                (oldData: any) => {
                    if (!oldData?.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((seller: any) => {
                            if (seller._id === sellerId) {
                                // Toggle between approved and rejected
                                if (seller.is_approved && seller.status === 'Active') {
                                    return { ...seller, is_approved: false, status: 'Blocked' };
                                } else if (seller.status === 'Blocked') {
                                    return { ...seller, is_approved: true, status: 'Active' };
                                }
                            }
                            return seller;
                        }),
                    };
                }
            );
            
            // Also invalidate to ensure fresh data
            console.log('[useRevertSeller] Invalidating ALL seller queries');
            queryClient.invalidateQueries({ queryKey: queryKeys.sellers.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useRevertSeller] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to revert seller status';
            toast.error(errorMessage);
        },
    });
}