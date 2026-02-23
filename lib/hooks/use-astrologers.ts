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
        mutationFn: ({ id, reason }: { id: string; reason?: string }) => {
            console.log('[useSuspendAstrologer] Suspending astrologer:', id);
            return AstrologerService.suspendAstrologer(id, reason);
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
        mutationFn: (id: string) => {
            console.log('[useUnsuspendAstrologer] Unsuspending astrologer:', id);
            return AstrologerService.unsuspendAstrologer(id);
        },
        onSuccess: (data, astrologerId) => {
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
                            astrologer._id === astrologerId
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
