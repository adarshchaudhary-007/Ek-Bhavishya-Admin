// User and Authentication Types
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'sub-admin';
    avatar?: string;
}

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'sub-admin';
    avatar?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    admin: AdminUser;
}

// Common API Response Types
export interface ApiError {
    message: string;
    status: number;
    code?: string;
}

export interface OperationResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginationInfo {
    total: number;
    page: number;
    pages: number;
    limit?: number;
}

// Seller Types
export interface Seller {
    _id: string;
    business_name: string;
    fullname: string;
    email: string;
    phone_number: string;
    address: string;
    gst_number: string;
    status: 'Active' | 'Inactive' | 'Blocked';
    is_approved: boolean;
    is_verified: boolean;
    display_status?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface SellersResponse {
    success: boolean;
    count?: number;
    sellers?: Seller[];  // API returns 'sellers' not 'data'
    data?: Seller[];     // Keep for backward compatibility
    pagination?: PaginationInfo;
}

export interface SellerDetailResponse {
    success: boolean;
    data: Seller;
}

// Notice Types
export interface Notice {
    _id: string;
    title: string;
    message: string;
    type: string;
    user_ids: string[];
    email_notification: boolean;
    push_notification: boolean;
    in_app_notification: boolean;
    schedule_send: string | null;
    sentCount: number;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateNoticeRequest {
    title: string;
    message: string;
    type: string;
    user_ids: string[];
    email_notification: boolean;
    push_notification: boolean;
    in_app_notification: boolean;
    schedule_send?: string | null;
}

export interface UpdateNoticeRequest {
    noticeId: string;
    title?: string;
    message?: string;
    type?: 'platform_policy' | 'downtime_alert' | 'payment_notice' | 'warning_strike' | 'appreciation_message';
    user_ids?: string[];
    email_notification?: boolean;
    push_notification?: boolean;
    in_app_notification?: boolean;
    schedule_send?: string | null;
}

export interface NoticesResponse {
    success: boolean;
    data: Notice[];
    pagination?: PaginationInfo;
}

export interface NoticeDetailResponse {
    success: boolean;
    data: Notice;
}

export interface NoticeResponse {
    success: boolean;
    message: string;
    notice: {
        id: string;
        title: string;
        message: string;
        sentCount: number;
    };
}

export interface NotificationsResponse {
    success: boolean;
    data: NotificationDelivery[];
    pagination?: PaginationInfo;
}

export interface NotificationDelivery {
    _id: string;
    notice_id: string;
    user_id: string;
    delivery_status: 'pending' | 'sent' | 'delivered' | 'failed';
    delivery_type: 'email' | 'push' | 'in_app';
    sent_at: string;
}

// Blog Types
export interface Blog {
    _id: string;
    title: string;
    content: string;
    author: {
        _id: string;
        personalDetails: {
            name: string;
            email: string;
        };
    };
    status: 'Pending' | 'Approved' | 'Rejected';
    rejectionReason?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface BlogFilterParams extends PaginationParams {
    status?: 'Pending' | 'Approved' | 'Rejected';
    search?: string;
}

export interface BlogsResponse {
    success: boolean;
    data: Blog[];
    pagination?: PaginationInfo;
}

export interface BlogDetailResponse {
    success: boolean;
    data: Blog;
}

export interface RejectBlogRequest {
    id: string;
    reason: string;
}

// Course Types
export interface CourseModule {
    _id?: string;
    title: string;
    description: string;
    videoUrl?: string;
    duration?: number;
    order: number;
}

export interface Course {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    instructor?: string;
    modules: CourseModule[];
    thumbnail: string;
    tags: string[];
    isFeatured: boolean;
    status: 'Active' | 'Inactive' | 'Pending' | 'Approved' | 'Rejected';
    createdByAdmin?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCourseRequest {
    title: string;
    description: string;
    price: number;
    category: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    instructor: string;
    modules: CourseModule[];
    thumbnail: string;
    tags: string[];
    isFeatured: boolean;
}

export interface UpdateCourseRequest {
    id: string;
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    level?: 'Beginner' | 'Intermediate' | 'Advanced';
    instructor?: string;
    modules?: CourseModule[];
    thumbnail?: string;
    tags?: string[];
    isFeatured?: boolean;
}

export interface CoursesResponse {
    success: boolean;
    data: Course[];
    pagination?: PaginationInfo;
}

export interface CourseResponse {
    success: boolean;
    data: Course;
}

export interface RejectCourseRequest {
    id: string;
    reason: string;
}

// Dashboard Types
export interface DashboardStats {
    revenue: number;
    clients: number;
    astrologers: number;
    activeSessions: number;
    monthlyStats?: MonthlyRevenue[];
}

export interface MonthlyRevenue {
    month: string;
    revenue: number;
}

export interface DashboardStatsResponse {
    success: boolean;
    data: DashboardStats;
}

export interface ConsultationStats {
    totalConsultations: number;
    todayConsultations: number;
    averageRating: number;
    completionRate: number;
}

export interface ConsultationStatsResponse {
    success: boolean;
    data: ConsultationStats;
}

export interface RevenueDataPoint {
    date: string;
    revenue: number;
}

export interface DateRange {
    startDate: string;
    endDate: string;
}

export interface RevenueStatsResponse {
    success: boolean;
    data: {
        totalRevenue: number;
        periodRevenue: number;
        growth: number;
        chartData: RevenueDataPoint[];
    };
}

export interface TopAstrologer {
    _id: string;
    name: string;
    email: string;
    totalEarnings: number;
    totalConsultations: number;
    rating: number;
}

export interface TopAstrologersResponse {
    success: boolean;
    data: TopAstrologer[];
}

export interface UsageParams extends DateRange {
    format?: 'daily' | 'weekly' | 'monthly';
}

export interface UsageDataPoint {
    date: string;
    activeUsers: number;
    newUsers: number;
    sessions: number;
}

export interface UsageResponse {
    success: boolean;
    data: UsageDataPoint[];
}

export interface UserActivityStats {
    activeUsers: number;
    newUsers: number;
    returningUsers: number;
    averageSessionDuration: number;
}

export interface UserActivityResponse {
    success: boolean;
    data: UserActivityStats;
}

// Astrologer Types
export interface Astrologer {
    _id: string;
    personalDetails: {
        name: string;
        email: string;
        phone: string;
    };
    status: 'Active' | 'Inactive' | 'Suspended';
    isVerified: boolean;
    rating: number;
    totalEarnings: number;
    createdAt: string;
}

export interface AstrologersResponse {
    success: boolean;
    data: Astrologer[];
    pagination?: PaginationInfo;
}
