/**
 * Astrologer Management Query Hooks
 * TanStack Query hooks for astrologer operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AstrologerService } from '@/lib/services/astrologer-service';
import { queryKeys } from '@/lib/query-keys';
import {
    AstrologersResponse,
    OperationResponse,
    PaginationParams,
    SuspendAstrologerRequest,
    UnsuspendAstrologerRequest,
} from '@/types';

/**
 * Hook to fetch all astrologers with pagination
 */
export function useAstrologers(params?: PaginationParams) {
    return useQuery({
        queryKey: queryKeys.astrologers.list(params),
        queryFn: () => AstrologerService.getAllAstrologers(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook to suspend an astrologer
 */
export function useSuspendAstrologer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SuspendAstrologerRequest) => {
            console.log('[useSuspendAstrologer] Suspending astrologer:', data);
            return AstrologerService.suspendAstrologer(data);
        },
        onSuccess: (data, variables) => {
            console.log('[useSuspendAstrologer] Success response:', data);
            toast.success(data.message || 'Astrologer suspended successfully');

            // Update cache optimistically
            queryClient.setQueriesData(
                { queryKey: queryKeys.astrologers.lists() },
                (oldData: any) => {
                    if (!oldData?.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((astrologer: any) =>
                            astrologer._id === variables.id
                                ? { ...astrologer, status: 'Suspended' }
                                : astrologer
                        ),
                    };
                }
            );

            // Invalidate all astrologer queries
            queryClient.invalidateQueries({ queryKey: queryKeys.astrologers.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useSuspendAstrologer] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to suspend astrologer';
            toast.error(errorMessage);
        },
    });
}

/**
 * Hook to unsuspend an astrologer
 */
export function useUnsuspendAstrologer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UnsuspendAstrologerRequest) => {
            console.log('[useUnsuspendAstrologer] Unsuspending astrologer:', data);
            return AstrologerService.unsuspendAstrologer(data);
        },
        onSuccess: (data, variables) => {
            console.log('[useUnsuspendAstrologer] Success response:', data);
            toast.success(data.message || 'Astrologer unsuspended successfully');

            // Update cache optimistically
            queryClient.setQueriesData(
                { queryKey: queryKeys.astrologers.lists() },
                (oldData: any) => {
                    if (!oldData?.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((astrologer: any) =>
                            astrologer._id === variables.id
                                ? { ...astrologer, status: 'Active' }
                                : astrologer
                        ),
                    };
                }
            );

            // Invalidate all astrologer queries
            queryClient.invalidateQueries({ queryKey: queryKeys.astrologers.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useUnsuspendAstrologer] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to unsuspend astrologer';
            toast.error(errorMessage);
        },
    });
}

/**
 * Hook to delete an astrologer
 */
export function useDeleteAstrologer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => {
            console.log('[useDeleteAstrologer] Deleting astrologer:', id);
            return AstrologerService.deleteAstrologer(id);
        },
        onSuccess: (data, id) => {
            console.log('[useDeleteAstrologer] Success response:', data);
            toast.success(data.message || 'Astrologer deleted successfully');

            // Remove from cache optimistically
            queryClient.setQueriesData(
                { queryKey: queryKeys.astrologers.lists() },
                (oldData: any) => {
                    if (!oldData?.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.filter((astrologer: any) => astrologer._id !== id),
                    };
                }
            );

            // Invalidate all astrologer queries
            queryClient.invalidateQueries({ queryKey: queryKeys.astrologers.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useDeleteAstrologer] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete astrologer';
            toast.error(errorMessage);
        },
    });
}

/**
 * Hook to update an astrologer
 */
export function useUpdateAstrologer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => {
            console.log('[useUpdateAstrologer] Updating astrologer:', id, 'data:', data);
            return AstrologerService.updateAstrologer(id, data);
        },
        onSuccess: (data, variables) => {
            console.log('[useUpdateAstrologer] Success response:', data);
            toast.success(data.message || 'Astrologer updated successfully');

            // Update cache optimistically
            queryClient.setQueriesData(
                { queryKey: queryKeys.astrologers.lists() },
                (oldData: any) => {
                    if (!oldData?.data) return oldData;
                    return {
                        ...oldData,
                        data: oldData.data.map((astrologer: any) =>
                            astrologer._id === variables.id
                                ? { ...astrologer, ...variables.data }
                                : astrologer
                        ),
                    };
                }
            );

            // Invalidate all astrologer queries
            queryClient.invalidateQueries({ queryKey: queryKeys.astrologers.all, refetchType: 'all' });
        },
        onError: (error: any) => {
            console.error('[useUpdateAstrologer] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update astrologer';
            toast.error(errorMessage);
        },
    });
}
