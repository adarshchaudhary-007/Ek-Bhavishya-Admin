/**
 * Remedy Management Query Hooks
 * TanStack Query hooks for remedy operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RemedyService, RemedyFilterParams, Remedy } from '@/lib/services/remedy-service';

const REMEDY_KEYS = {
    all: ['remedies'] as const,
    lists: () => [...REMEDY_KEYS.all, 'list'] as const,
    list: (params?: RemedyFilterParams) => [...REMEDY_KEYS.lists(), params] as const,
    details: () => [...REMEDY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...REMEDY_KEYS.details(), id] as const,
};

// Hook to fetch all remedies with filtering and pagination
export function useRemedies(params?: RemedyFilterParams) {
    return useQuery({
        queryKey: REMEDY_KEYS.list(params),
        queryFn: () => RemedyService.getAllRemedies(params),
    });
}

// Hook to fetch remedy details by ID
export function useRemedyDetail(remedyId: string, enabled: boolean = true) {
    return useQuery({
        queryKey: REMEDY_KEYS.detail(remedyId),
        queryFn: () => RemedyService.getRemedyById(remedyId),
        enabled: enabled && !!remedyId,
    });
}

// Hook to approve a remedy
export function useApproveRemedy() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (remedyId: string) => {
            console.log('[useApproveRemedy] Approving remedy:', remedyId);
            return RemedyService.approveRemedy(remedyId);
        },
        onSuccess: (data) => {
            console.log('[useApproveRemedy] Success:', data);
            toast.success(data.message || 'Remedy approved successfully');
            queryClient.invalidateQueries({ queryKey: REMEDY_KEYS.all });
        },
        onError: (error: any) => {
            console.error('[useApproveRemedy] Error:', error);
            toast.error(error.response?.data?.message || 'Failed to approve remedy');
        },
    });
}

// Hook to reject a remedy
export function useRejectRemedy() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ remedyId, reason }: { remedyId: string; reason: string }) => {
            console.log('[useRejectRemedy] Rejecting remedy:', remedyId);
            return RemedyService.rejectRemedy(remedyId, reason);
        },
        onSuccess: (data) => {
            console.log('[useRejectRemedy] Success:', data);
            toast.success(data.message || 'Remedy rejected successfully');
            queryClient.invalidateQueries({ queryKey: REMEDY_KEYS.all });
        },
        onError: (error: any) => {
            console.error('[useRejectRemedy] Error:', error);
            toast.error(error.response?.data?.message || 'Failed to reject remedy');
        },
    });
}

// Hook to revert a remedy status
export function useRevertRemedy() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (remedyId: string) => {
            console.log('[useRevertRemedy] Reverting remedy:', remedyId);
            return RemedyService.revertRemedy(remedyId);
        },
        onSuccess: (data) => {
            console.log('[useRevertRemedy] Success:', data);
            toast.success(data.message || 'Remedy status reverted');
            queryClient.invalidateQueries({ queryKey: REMEDY_KEYS.all });
        },
        onError: (error: any) => {
            console.error('[useRevertRemedy] Error:', error);
            toast.error(error.response?.data?.message || 'Failed to revert remedy');
        },
    });
}

// Hook to edit a remedy
export function useEditRemedy() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ remedyId, data }: { remedyId: string; data: Partial<Remedy> }) => {
            console.log('[useEditRemedy] Editing remedy:', remedyId);
            return RemedyService.editRemedy(remedyId, data);
        },
        onSuccess: (data, variables) => {
            console.log('[useEditRemedy] Success:', data);
            toast.success(data.message || 'Remedy updated successfully');
            queryClient.invalidateQueries({ queryKey: REMEDY_KEYS.all });
            queryClient.invalidateQueries({ queryKey: REMEDY_KEYS.detail(variables.remedyId) });
        },
        onError: (error: any) => {
            console.error('[useEditRemedy] Error:', error);
            toast.error(error.response?.data?.message || 'Failed to update remedy');
        },
    });
}
