import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    getActiveCalls,
    getCallStatistics,
    getReportedCalls,
    refundCall,
    dismissReport,
    suspendForCallIssues,
    getSuspensionHistory
} from '@/lib/services/call-service';

export const useActiveCalls = () => {
    return useQuery({
        queryKey: ['calls', 'active'],
        queryFn: getActiveCalls,
        refetchInterval: 10000 // Refetch active calls every 10 seconds
    });
};

export const useCallStatistics = (startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: ['calls', 'stats', startDate, endDate],
        queryFn: () => getCallStatistics({ startDate, endDate })
    });
};

export const useReportedCalls = (page: number = 1, status?: string) => {
    return useQuery({
        queryKey: ['calls', 'reported', page, status],
        queryFn: () => getReportedCalls({ page, status })
    });
};

export const useRefundCall = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ callId, data }: { callId: string, data: any }) => refundCall(callId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['calls'] });
            toast.success(data.message || 'Refund processed successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to process refund');
        }
    });
};

export const useDismissReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ callId, adminNotes }: { callId: string, adminNotes: string }) => dismissReport(callId, adminNotes),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['calls'] });
            toast.success(data.message || 'Report dismissed');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to dismiss report');
        }
    });
};

export const useSuspendForCalls = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => suspendForCallIssues(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['astrologers'] });
            queryClient.invalidateQueries({ queryKey: ['calls'] });
            toast.success(data.message || 'Astrologer suspended successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to suspend astrologer');
        }
    });
};

export const useSuspensionHistory = (id: string) => {
    return useQuery({
        queryKey: ['astrologer', 'suspension-history', id],
        queryFn: () => getSuspensionHistory(id),
        enabled: !!id
    });
};
