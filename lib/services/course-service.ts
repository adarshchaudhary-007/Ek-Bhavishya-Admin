/**
 * Course Management API Service
 * Handles all course-related API calls for admin operations
 */

import api from '@/lib/axios';
import {
    CoursesResponse,
    CourseResponse,
    CreateCourseRequest,
    UpdateCourseRequest,
    OperationResponse,
    PaginationParams,
} from '@/types';

export interface CourseSearchParams extends PaginationParams {
    search?: string;
}

export class CourseService {
    /**
     * Get all courses with optional search and pagination
     * Endpoint: GET /api/v1/admin/courses?search=
     */
    static async getAllCourses(params?: CourseSearchParams): Promise<CoursesResponse> {
        console.log('[CourseService] getAllCourses called with params:', params);
        const response = await api.get<CoursesResponse>('/api/v1/admin/courses', { params });
        console.log('[CourseService] getAllCourses response:', response.data);
        return response.data;
    }

    /**
     * Approve a course
     */
    static async approveCourse(id: string): Promise<OperationResponse> {
        console.log('[CourseService] approveCourse called with id:', id);
        const response = await api.patch<OperationResponse>('/api/v1/admin/courses/approve', {
            id
        });
        console.log('[CourseService] approveCourse response:', response.data);
        return response.data;
    }

    /**
     * Reject a course
     */
    static async rejectCourse(id: string, rejectionReason: string): Promise<OperationResponse> {
        console.log('[CourseService] rejectCourse called with id:', id);
        const response = await api.patch<OperationResponse>('/api/v1/admin/courses/reject', {
            id,
            rejectionReason
        });
        console.log('[CourseService] rejectCourse response:', response.data);
        return response.data;
    }

    /**
     * Create admin course
     */
    static async createAdminCourse(data: CreateCourseRequest): Promise<CourseResponse> {
        console.log('[CourseService] createAdminCourse called with data:', data);
        const response = await api.post<CourseResponse>('/api/v1/admin/courses/admin-courses', data);
        console.log('[CourseService] createAdminCourse response:', response.data);
        return response.data;
    }

    /**
     * Get all admin courses with pagination
     */
    static async getAdminCourses(params?: PaginationParams): Promise<CoursesResponse> {
        console.log('[CourseService] getAdminCourses called with params:', params);
        const response = await api.get<CoursesResponse>('/api/v1/admin/courses/admin-courses', { params });
        console.log('[CourseService] getAdminCourses response:', response.data);
        return response.data;
    }

    /**
     * Update admin course
     */
    static async updateAdminCourse(data: UpdateCourseRequest): Promise<CourseResponse> {
        console.log('[CourseService] updateAdminCourse called with data:', data);
        const response = await api.put<CourseResponse>('/api/v1/admin/courses/admin-courses/update', data);
        console.log('[CourseService] updateAdminCourse response:', response.data);
        return response.data;
    }

    /**
     * Get admin course by ID
     */
    static async getAdminCourseById(id: string): Promise<CourseResponse> {
        console.log('[CourseService] getAdminCourseById called with id:', id);
        const response = await api.get<CourseResponse>(`/api/v1/admin/courses/admin-courses/${id}`);
        console.log('[CourseService] getAdminCourseById response:', response.data);
        return response.data;
    }

    /**
     * Delete admin course
     */
    static async deleteAdminCourse(id: string): Promise<OperationResponse> {
        console.log('[CourseService] deleteAdminCourse called with id:', id);
        const response = await api.delete<OperationResponse>('/api/v1/admin/courses/admin-courses/delete', {
            data: { id }
        });
        console.log('[CourseService] deleteAdminCourse response:', response.data);
        return response.data;
    }
}

// Export individual functions for easier importing
export const {
    getAllCourses,
    approveCourse,
    rejectCourse,
    createAdminCourse,
    getAdminCourses,
    getAdminCourseById,
    updateAdminCourse,
    deleteAdminCourse,
} = CourseService;
