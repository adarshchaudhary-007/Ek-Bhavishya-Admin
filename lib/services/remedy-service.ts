/**
 * Remedy Management API Service
 * Handles all remedy-related API calls for admin operations
 */

import api from '@/lib/axios';

export interface RemedyFilterParams {
    page?: number;
    limit?: number;
    status?: 'Pending' | 'Approved' | 'Rejected' | 'Active' | 'Inactive' | '';
    search?: string;
}

export interface RemedySpecialization {
    name: string;
    price: number;
    duration_minutes: number;
    description: string;
}

export interface RemedyRequirement {
    field_name: string;
    field_type: string;
    is_required: boolean;
}

export interface Remedy {
    _id: string;
    title: string;
    description: string;
    category: string;
    image?: string;
    base_price: number;
    duration_minutes: number;
    delivery_type: string;
    status: string;
    is_featured: boolean;
    tags: string[];
    specializations: RemedySpecialization[];
    requirements: RemedyRequirement[];
    astrologer?: {
        _id: string;
        personalDetails?: {
            name: string;
            email: string;
        };
    };
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

export const RemedyService = {
    /**
     * Get all remedies with optional filtering and pagination
     */
    async getAllRemedies(params?: RemedyFilterParams) {
        console.log('[RemedyService] Fetching all remedies with params:', params);
        const response = await api.get('/api/v1/admin/remedies', { params });
        console.log('[RemedyService] getAllRemedies response:', response.data);
        return response.data;
    },

    /**
     * Get remedy details by ID
     */
    async getRemedyById(id: string) {
        console.log('[RemedyService] Fetching remedy by ID:', id);
        const response = await api.post('/api/v1/admin/remedies/get-by-id', { id });
        console.log('[RemedyService] getRemedyById response:', response.data);
        return response.data;
    },

    /**
     * Edit remedy details (partial update)
     */
    async editRemedy(id: string, data: Partial<Remedy>) {
        console.log('[RemedyService] Editing remedy:', id, data);
        const response = await api.patch(`/api/v1/admin/remedies/${id}`, data);
        console.log('[RemedyService] editRemedy response:', response.data);
        return response.data;
    },

    /**
     * Approve a remedy
     */
    async approveRemedy(id: string) {
        console.log('[RemedyService] Approving remedy:', id);
        const response = await api.patch('/api/v1/admin/remedies/approve', { id });
        console.log('[RemedyService] approveRemedy response:', response.data);
        return response.data;
    },

    /**
     * Reject a remedy with reason
     */
    async rejectRemedy(id: string, rejectionReason: string) {
        console.log('[RemedyService] Rejecting remedy:', id, 'Reason:', rejectionReason);
        const response = await api.patch('/api/v1/admin/remedies/reject', { id, rejectionReason });
        console.log('[RemedyService] rejectRemedy response:', response.data);
        return response.data;
    },

    /**
     * Revert a remedy status back to Pending
     */
    async revertRemedy(id: string) {
        console.log('[RemedyService] Reverting remedy:', id);
        const response = await api.patch('/api/v1/admin/remedies/revert', { id });
        console.log('[RemedyService] revertRemedy response:', response.data);
        return response.data;
    },
};
