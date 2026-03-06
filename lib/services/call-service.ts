/**
 * Call Monitoring API Service
 * Handles all call-related API calls for admin operations
 */

import api from '@/lib/axios';
import {
    CallStatsResponse,
    ActiveCallsResponse,
    ReportedCallsResponse,
    OperationResponse,
    PaginationParams,
} from '@/types';

export class CallService {
    /**
     * Get active calls for monitoring
     */
    static async getActiveCalls(): Promise<ActiveCallsResponse> {
        const response = await api.get<ActiveCallsResponse>('/api/v1/admin/calls/active');
        return response.data;
    }

    /**
     * Get call statistics
     */
    static async getCallStatistics(params?: { startDate?: string; endDate?: string }): Promise<CallStatsResponse> {
        const response = await api.get<CallStatsResponse>('/api/v1/admin/calls/statistics', { params });
        return response.data;
    }

    /**
     * Get reported calls for review
     */
    static async getReportedCalls(params?: { status?: string } & PaginationParams): Promise<ReportedCallsResponse> {
        const response = await api.get<ReportedCallsResponse>('/api/v1/admin/calls/reported', { params });
        return response.data;
    }

    /**
     * Get details of a reported call
     */
    static async getReportDetails(callId: string): Promise<any> {
        const response = await api.get<any>(`/api/v1/admin/calls/reported/${callId}`);
        return response.data;
    }

    /**
     * Refund a reported call
     */
    static async refundCall(callId: string, data: { refundAmount?: number; adminNotes?: string }): Promise<OperationResponse> {
        const response = await api.post<OperationResponse>(`/api/v1/admin/calls/reported/${callId}/refund`, data);
        return response.data;
    }

    /**
     * Dismiss a report
     */
    static async dismissReport(callId: string, adminNotes?: string): Promise<OperationResponse> {
        const response = await api.post<OperationResponse>(`/api/v1/admin/calls/reported/${callId}/dismiss`, { adminNotes });
        return response.data;
    }

    /**
     * Suspend astrologer for call issues
     */
    static async suspendForCallIssues(astrologerId: string, data: {
        suspensionReason: string;
        callId?: string;
        suspensionDuration?: number;
        adminNotes?: string
    }): Promise<OperationResponse> {
        const response = await api.post<OperationResponse>(`/api/v1/admin/astrologers/${astrologerId}/suspend-for-calls`, data);
        return response.data;
    }

    /**
     * Get suspension history for an astrologer
     */
    static async getSuspensionHistory(astrologerId: string): Promise<any> {
        const response = await api.get<any>(`/api/v1/admin/astrologers/${astrologerId}/suspension-history`);
        return response.data;
    }
}

export const {
    getActiveCalls,
    getCallStatistics,
    getReportedCalls,
    getReportDetails,
    refundCall,
    dismissReport,
    suspendForCallIssues,
    getSuspensionHistory
} = CallService;
