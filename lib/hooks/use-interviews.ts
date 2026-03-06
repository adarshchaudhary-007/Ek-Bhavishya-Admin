import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    getInterviewsByStatus,
    scheduleInterview,
    rescheduleInterview,
    cancelInterview,
    completeInterview,
    rejectAfterInterview
} from '@/lib/services/interview-service';
import { InterviewStatus } from '@/types';

export const useInterviewsByStatus = (status: InterviewStatus) => {
    return useQuery({
        queryKey: ['interviews', status],
        queryFn: () => getInterviewsByStatus(status)
    });
};

export const useScheduleInterview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            astrologer_id: string;
            meeting_time: string;
            meeting_link: string;
            admin_notes?: string;
        }) => scheduleInterview(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['interviews'] });
            queryClient.invalidateQueries({ queryKey: ['astrologers'] });
            toast.success(data.message || 'Interview scheduled successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to schedule interview');
        }
    });
};

export const useRescheduleInterview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            astrologer_id: string;
            new_meeting_time: string;
            new_meeting_link: string;
        }) => rescheduleInterview(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['interviews'] });
            toast.success(data.message || 'Interview rescheduled successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to reschedule interview');
        }
    });
};

export const useCancelInterview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ astrologer_id, reason }: { astrologer_id: string, reason?: string }) =>
            cancelInterview(astrologer_id, reason),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['interviews'] });
            toast.success(data.message || 'Interview cancelled successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to cancel interview');
        }
    });
};

export const useCompleteInterview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            astrologer_id: string;
            rating?: number;
            admin_notes?: string;
        }) => completeInterview(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['interviews'] });
            queryClient.invalidateQueries({ queryKey: ['astrologers'] });
            toast.success(data.message || 'Interview marked as completed');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to complete interview');
        }
    });
};

export const useRejectInterview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ astrologer_id, remark }: { astrologer_id: string, remark?: string }) =>
            rejectAfterInterview(astrologer_id, remark),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['interviews'] });
            queryClient.invalidateQueries({ queryKey: ['astrologers'] });
            toast.success(data.message || 'Astrologer application rejected');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to reject application');
        }
    });
};
