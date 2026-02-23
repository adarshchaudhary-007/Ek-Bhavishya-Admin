/**
 * Notice Management API Service
 * Handles all notice-related API operations
 */

import api from '@/lib/axios';
import {
    NoticesResponse,
    NoticeDetailResponse,
    NoticeResponse,
    CreateNoticeRequest,
    UpdateNoticeRequest,
    OperationResponse,
    PaginationParams,
    NotificationsResponse,
} from '@/types';

export class NoticeService {
    /**
     * Get all notices with pagination
     */
    static async getAllNotices(params?: PaginationParams): Promise<NoticesResponse> {
        console.log('[NoticeService] getAllNotices called with params:', params);
        const response = await api.get<NoticesResponse>('/api/v1/admin/notices', { params });

        console.log('[NoticeService] getAllNotices response:', response.data);
        return response.data;
    }

    /**
     * Get notice details by ID
     */
    static async getNoticeById(noticeId: string): Promise<NoticeDetailResponse> {
        console.log('[NoticeService] getNoticeById called with id:', noticeId);
        const response = await api.post<NoticeDetailResponse>('/api/v1/admin/notices/get-by-id', {
            noticeId,
        });

        console.log('[NoticeService] getNoticeById response:', response.data);
        return response.data;
    }

    /**
     * Create a new notice
     */
    static async createNotice(data: CreateNoticeRequest): Promise<NoticeResponse> {
        console.log('[NoticeService] createNotice called with data:', data);
        const response = await api.post<NoticeResponse>('/api/v1/admin/notices', data);

        console.log('[NoticeService] createNotice response:', response.data);
        return response.data;
    }

    /**
     * Update an existing notice
     */
    static async updateNotice(data: UpdateNoticeRequest): Promise<NoticeResponse> {
        console.log('[NoticeService] updateNotice called with data:', data);
        const response = await api.patch<NoticeResponse>('/api/v1/admin/notices/update', data);

        console.log('[NoticeService] updateNotice response:', response.data);
        return response.data;
    }

    /**
     * Delete a notice
     */
    static async deleteNotice(noticeId: string): Promise<OperationResponse> {
        console.log('[NoticeService] deleteNotice called with id:', noticeId);
        const response = await api.delete<OperationResponse>('/api/v1/admin/notices/delete', {
            data: { noticeId }
        });

        console.log('[NoticeService] deleteNotice response:', response.data);
        return response.data;
    }

    /**
     * Get notification delivery status for a notice
     */
    static async getNoticeNotifications(
        noticeId: string,
        params?: PaginationParams
    ): Promise<NotificationsResponse> {
        console.log('[NoticeService] getNoticeNotifications called with id:', noticeId);
        const response = await api.post<NotificationsResponse>(
            '/api/v1/admin/notices/get-notifications',
            { noticeId },
            { params }
        );

        console.log('[NoticeService] getNoticeNotifications response:', response.data);
        return response.data;
    }
}

// Export individual functions for easier importing
export const {
    getAllNotices,
    getNoticeById,
    createNotice,
    updateNotice,
    deleteNotice,
    getNoticeNotifications,
} = NoticeService;
