/**
 * Admin Profile API Service
 * Handles admin profile and authentication operations
 */

import api from '@/lib/axios';

export const AdminService = {
    /**
     * Get current admin profile
     */
    async getProfile() {
        console.log('[AdminService] Fetching admin profile');
        const response = await api.get('/api/v1/admin/profile');
        console.log('[AdminService] getProfile response:', response.data);
        return response.data;
    },

    /**
     * Update admin profile (name, email)
     */
    async updateProfile(data: { name?: string; email?: string }) {
        console.log('[AdminService] Updating profile:', data);
        const response = await api.patch('/api/v1/admin/profile', data);
        console.log('[AdminService] updateProfile response:', response.data);
        return response.data;
    },

    /**
     * Change admin password
     */
    async changePassword(data: { currentPassword: string; newPassword: string }) {
        console.log('[AdminService] Changing password');
        const response = await api.patch('/api/v1/admin/profile', data);
        console.log('[AdminService] changePassword response:', response.data);
        return response.data;
    },
};
