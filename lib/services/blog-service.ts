/**
 * Blog Management API Service
 * Handles all blog-related API calls for admin operations
 */

import api from '@/lib/axios';
import {
    BlogsResponse,
    BlogDetailResponse,
    OperationResponse,
    PaginationParams,
    BlogFilterParams,
} from '@/types';

export const BlogService = {
    /**
     * Get all blogs with optional filtering and pagination
     */
    async getAllBlogs(params?: BlogFilterParams): Promise<BlogsResponse> {
        console.log('[BlogService] Fetching all blogs with params:', params);
        const response = await api.get('/api/v1/admin/blogs', { 
            params
        });
        console.log('[BlogService] getAllBlogs response:', response.data);
        return response.data;
    },

    /**
     * Get blog details by ID
     */
    async getBlogById(id: string): Promise<BlogDetailResponse> {
        console.log('[BlogService] Fetching blog by ID:', id);
        const response = await api.post('/api/v1/admin/blogs/get-by-id', { id });
        console.log('[BlogService] getBlogById response:', response.data);
        // Normalize response structure
        if (response.data.blog) {
            return {
                success: response.data.success,
                data: response.data.blog,
            };
        }
        return response.data;
    },

    /**
     * Approve a blog
     */
    async approveBlog(id: string): Promise<OperationResponse> {
        console.log('[BlogService] Approving blog:', id);
        const response = await api.patch('/api/v1/admin/blogs/approve', { id });
        console.log('[BlogService] approveBlog response:', response.data);
        return response.data;
    },

    /**
     * Reject a blog with reason
     */
    async rejectBlog(id: string, rejectionReason: string): Promise<OperationResponse> {
        console.log('[BlogService] Rejecting blog:', id, 'Reason:', rejectionReason);
        const response = await api.patch('/api/v1/admin/blogs/reject', {
            id,
            rejectionReason,
        });
        console.log('[BlogService] rejectBlog response:', response.data);
        return response.data;
    },

    /**
     * Revert blog status
     * For approved blogs: rejects them (sets to Pending/Rejected)
     * For rejected blogs: approves them (sets to Approved)
     */
    async revertBlogStatus(id: string, currentStatus: 'Approved' | 'Rejected', reason: string): Promise<OperationResponse> {
        console.log('[BlogService] Reverting blog status:', id, 'Current status:', currentStatus, 'Reason:', reason);
        
        if (currentStatus === 'Approved') {
            // For approved blogs, reject them with the provided reason
            const response = await api.patch('/api/v1/admin/blogs/reject', {
                id,
                rejectionReason: reason,
            });
            console.log('[BlogService] revertBlogStatus (reject) response:', response.data);
            return response.data;
        } else if (currentStatus === 'Rejected') {
            // For rejected blogs, approve them
            const response = await api.patch('/api/v1/admin/blogs/approve', { id });
            console.log('[BlogService] revertBlogStatus (approve) response:', response.data);
            return response.data;
        }
        
        throw new Error('Invalid status for reversion');
    },
};
