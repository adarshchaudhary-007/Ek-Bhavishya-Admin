/**
 * Interview Management API Service
 * Handles all interview-related API calls for admin operations
 */

import api from '@/lib/axios';
import {
    InterviewsByStatusResponse,
    OperationResponse,
    InterviewStatus,
} from '@/types';

export class InterviewService {
    /**
     * Get astrologers by interview status
     */
    static async getInterviewsByStatus(status: InterviewStatus): Promise<InterviewsByStatusResponse> {
        const response = await api.get<InterviewsByStatusResponse>('/api/v1/interview/status', { params: { status } });
        return response.data;
    }

    /**
     * Schedule an interview meeting
     */
    static async scheduleInterview(data: {
        astrologer_id: string;
        meeting_time: string;
        meeting_link: string;
        admin_notes?: string;
    }): Promise<OperationResponse> {
        const response = await api.post<OperationResponse>('/api/v1/interview/schedule-interview', data);
        return response.data;
    }

    /**
     * Reschedule an interview meeting
     */
    static async rescheduleInterview(data: {
        astrologer_id: string;
        new_meeting_time: string;
        new_meeting_link: string;
    }): Promise<OperationResponse> {
        const response = await api.put<OperationResponse>('/api/v1/interview/reschedule-interview', data);
        return response.data;
    }

    /**
     * Cancel an interview meeting
     */
    static async cancelInterview(astrologer_id: string, reason?: string): Promise<OperationResponse> {
        const response = await api.put<OperationResponse>('/api/v1/interview/cancel-interview', {
            astrologer_id,
            reason
        });
        return response.data;
    }

    /**
     * Mark interview as completed
     */
    static async completeInterview(data: {
        astrologer_id: string;
        rating?: number;
        admin_notes?: string;
    }): Promise<OperationResponse> {
        const response = await api.put<OperationResponse>('/api/v1/interview/complete-interview', data);
        return response.data;
    }

    /**
     * Reject astrologer after interview
     */
    static async rejectAfterInterview(astrologer_id: string, remark?: string): Promise<OperationResponse> {
        const response = await api.put<OperationResponse>('/api/v1/interview/reject-interview', {
            astrologer_id,
            remark
        });
        return response.data;
    }
}

export const {
    getInterviewsByStatus,
    scheduleInterview,
    rescheduleInterview,
    cancelInterview,
    completeInterview,
    rejectAfterInterview
} = InterviewService;
