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

// Platform User Types (customers)
export interface PlatformUser {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    profilePhoto?: string;
    freeMinutes?: {
        total: number;
        used: number;
        remaining: number;
    };
    kundli?: any;
    exanthem?: any;
    isVerified: boolean;
    accountStatus: 'Active' | 'Blocked' | 'Suspended';
    walletBalance: number;
    createdAt: string;
    updatedAt: string;
}

export interface PlatformUsersResponse {
    success: boolean;
    data: PlatformUser[];
    pagination?: PaginationInfo;
}

export interface BlockUserRequest {
    userId: string;
}

export interface UnblockUserRequest {
    userId: string;
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
    profile_image?: string;
    address?: string;
    gst_number?: string;
    adhar_number?: string;
    bank_account_no?: string;
    ifsc_code?: string;
    bank_holder_name?: string;
    adhar_document?: string;
    gst_document?: string;
    status: 'Active' | 'Inactive' | 'Blocked' | 'Pending';
    is_approved: boolean;
    is_verified: boolean;
    display_status?: string;
    documents?: {
        gstCertificate?: string;
        businessLicense?: string;
    };
    bankDetails?: {
        accountNumber: string;
        ifscCode: string;
        accountHolderName: string;
    };
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
        name?: string;
        email?: string;
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

export interface RevertBlogStatusRequest {
    blogId: string;
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
    clientsGrowth?: number;
    astrologers: number;
    sellers: number;
    activeSessions: number;
    activeSessionsGrowth?: number;
    newProducts: number;
    complaintsCount: number;
    monthlyStats: any[];
    recentTransactions: Transaction[];
    approvals: {
        total_approved: number;
        details: {
            blogs: number;
            remedies: number;
            courses: number;
            sellers: number;
            astrologers: number;
            products: number;
        };
    };
}

export interface Transaction {
    id: string;
    name: string;
    email: string;
    amount: number;
    createdAt: string;
}

export interface MonthlyRevenue {
    month: string;
    revenue: number;
    users: number;
    astrologers: number;
    sellers: number;
    products: number;
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
    growthPercentage: number;
    channelBreakdown: {
        chat: number;
        video: number;
        call: number;
    };
    dailyBreakdown: Array<{ date: string; count: number }>;
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
    startDate?: string;
    endDate?: string;
}

export interface RevenueStatsResponse {
    success: boolean;
    data: {
        startDate: string;
        endDate: string;
        period: {
            days: number;
        };
        periodStats: {
            totalRevenue: number;
            growth: number;
            growthPercentage?: number; // Added for flexibility in page.tsx
        };
        revenueGraph: Array<{ date: string; amount: number }>;
        totalRevenue?: number; // Keep for compatibility if needed
        growth?: number;       // Keep for compatibility if needed
        chartData?: RevenueDataPoint[];
    };
}

export interface TopAstrologer {
    _id: string;
    name: string;
    email: string;
    totalEarnings: number;
    totalConsultations: number;
    rating: number;
    totalRevenue?: number;
    averageRating?: number;
    rank?: number;
}

export interface TopAstrologersParams {
    limit?: number;
    startDate?: string;
    endDate?: string;
}

export interface TopAstrologersResponse {
    success: boolean;
    data: TopAstrologer[];
}

export interface UsageParams {
    startDate?: string;
    endDate?: string;
    format?: 'json' | 'csv' | 'table' | 'daily' | 'weekly' | 'monthly';
}

export interface UsageDataPoint {
    date: string;
    activeUsers: number;
    newUsers: number;
    sessions?: number;
    consultations?: number;
    revenue?: number;
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
    _id: string
    personalDetails: {
        name: string
        email: string
        phone: string
        experience: number
        languages: string[]
        skills: string[]
        pseudonym?: string
        profileImage?: string
        about?: string
        gender?: string
    }
    ratings: {
        average: number
        count: number
        negativeReviewsCount: number
    }
    pricing: {
        call: number
        chat: number
        video: number
    }
    availability: {
        status: string
        currentStatus: string
        isCallAvailable: boolean
        isChatAvailable: boolean
        isVideoAvailable: boolean
        lastOnlineAt?: string
        currentCallId?: string | null
    }
    callSettings?: {
        audioCallRate: number
        videoCallRate: number
        acceptAudioCalls: boolean
        acceptVideoCalls: boolean
    }
    verificationStatus: string
    onboardingStatus: string
    isApproved: boolean
    walletBalance: number
    isExclusive?: boolean
    membershipOptions?: any[]
    referral?: {
        code: string
        referredBy?: string | null
        totalRewards: number
    }
    rejectionDetails?: {
        date: string
        reason: string
    }
    suspensionInfo?: {
        reason: string
        suspendedAt: string
        suspendUntil: string
        remainingDays: number
    }
    createdAt: string
    updatedAt: string
}

export interface AstrologersResponse {
    success: boolean;
    data: Astrologer[];
    pagination?: PaginationInfo;
}

export interface SuspendAstrologerRequest {
    id: string;
    suspensionReason: string;
    suspendDays: number;
}

export interface UnsuspendAstrologerRequest {
    id: string;
    admin_notes?: string;
}
// Product Types
export interface Product {
    _id: string;
    product_name: string;
    description: string;
    base_price: number;
    selling_price: number;
    stock_count: number;
    category_id: {
        _id: string;
        name: string;
    };
    seller_id: {
        _id: string;
        business_name: string;
        fullname: string;
        email: string;
        phone_number: string;
    };
    images: string[];
    status: 'Draft' | 'Published' | 'Out of Stock';
    is_verified: boolean;
    is_listed: boolean;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductsResponse {
    success: boolean;
    products: Product[];
    pagination: PaginationInfo;
}

export interface ProductResponse {
    success: boolean;
    product: Product;
}

// Interview Types
export type InterviewStatus = 'Pending' | 'Scheduled' | 'Completed' | 'Cancelled' | 'Rejected';

export interface Interview {
    _id?: string;
    astrologer_id: string;
    meeting_time: string;
    meeting_link: string;
    meeting_status: InterviewStatus;
    admin_notes?: string;
    interview_rating?: number;
}

export interface InterviewData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    registered_on: string;
    status: InterviewStatus;
    interview_details: Partial<Interview>;
}

export interface InterviewsByStatusResponse {
    success: boolean;
    count: number;
    status_type: InterviewStatus;
    data: InterviewData[];
}

// Call Monitoring Types
export interface CallSession {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    };
    astrologerId: {
        _id: string;
        name: string;
        email: string;
        phone: string;
    };
    status: 'ringing' | 'connecting' | 'active' | 'ended' | 'rejected' | 'no_answer' | 'cancelled';
    callType: 'audio' | 'video';
    billingType: 'minute' | 'fixed';
    totalAmount: number;
    duration: number; // in seconds
    initiatedAt: string;
    startedAt?: string;
    endedAt?: string;
    reportedBy?: {
        _id: string;
        name: string;
        email: string;
    };
    reportReason?: string;
    reportedAt?: string;
}

export interface CallStatistics {
    totalCalls: number;
    activeCalls: number;
    completedCalls: number;
    rejectedCalls: number;
    cancelledCalls: number;
    reportedCalls: number;
    acceptanceRate: number;
    revenue: {
        total: number;
        commission: number;
        astrologerEarnings: number;
        averagePerCall: number;
    };
    averageCallDuration: number;
    callTypeBreakdown: Array<{ _id: string; count: number }>;
    billingTypeBreakdown: Array<{ _id: string; count: number }>;
}

export interface CallStatsResponse {
    success: boolean;
    statistics: CallStatistics;
}

export interface ActiveCallsResponse {
    success: boolean;
    count: number;
    calls: CallSession[];
}

export interface ReportedCallsResponse {
    success: boolean;
    count: number;
    totalCount: number;
    page: number;
    totalPages: number;
    calls: CallSession[];
}

// User App Types (frontend user role)
export interface UserAstrologer {
    _id: string;
    personalDetails: {
        profileImage?: string;
        gender?: string;
        dob?: string;
        experience?: number;
        languages?: string[];
        skills?: string[];
        pseudonym?: string;
        about?: string;
    };
    systemStatus: {
        isLive: boolean;
        isOnline: boolean;
    };
    ratings: {
        average: number;
        count: number;
        negativeReviewsCount?: number;
    };
    pricing: {
        call: number;
        chat: number;
        video: number;
    };
    availability: {
        isChatAvailable: boolean;
        isCallAvailable: boolean;
        isVideoAvailable: boolean;
        currentStatus: string;
        status?: string;
    };
    callSettings?: {
        audioCallRate?: number;
        videoCallRate?: number;
        acceptAudioCalls?: boolean;
        acceptVideoCalls?: boolean;
    };
    verificationStatus?: string;
    isApproved?: boolean;
    isExclusive?: boolean;
    status?: string;
}

export interface UserCourse {
    _id: string;
    title: string;
    description: string;
    instructor?: string;
    astrologer?: { name?: string } | string | null;
    createdByAdmin?: string;
    courseType?: 'live' | 'recorded';
    duration?: string;
    price: number;
    isFree?: boolean;
    rating?: number;
    totalRatings?: number;
    totalEnrollments?: number;
    students?: number;
    thumbnail?: string;
    status?: string;
    level?: string;
    category?: string;
    modules?: { title: string; videoUrl?: string; description?: string; duration?: number; _id?: string }[];
    liveSchedule?: {
        startDate?: string;
        endDate?: string;
        startTime?: string;
        daysOfWeek?: string[];
        durationMinutes?: number;
        timezone?: string;
        frequency?: string;
    };
    isFeatured?: boolean;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface UserRemedy {
    _id: string;
    title: string;
    description: string;
    category: string;
    image?: string;
    base_price: number;
    duration_minutes?: number;
    specializations?: Array<{
        _id?: string;
        name: string;
        price: number;
        duration_minutes?: number;
        description?: string;
    }>;
    delivery_type?: 'live_video' | 'consultation' | 'report';
    tags?: string[];
    is_featured?: boolean;
    author?: {
        _id: string;
        fullName: string;
        profileImage?: string;
    };
}

export interface AstrologerRemedyService {
    _id: string;
    astrologer_id: {
        _id: string;
        personalDetails: {
            name: string;
            profileImage?: string;
            experience?: {
                years_experience?: number;
            };
        };
        systemStatus?: {
            isOnline?: boolean;
        };
    };
    remedy_id: string;
    status: string;
    custom_pricing?: {
        my_price?: number;
    };
    metrics?: {
        average_rating?: number;
        total_reviews?: number;
    };
    availability?: {
        is_active?: boolean;
    };
}

export interface RemedyAstrologersResponse {
    astrologers: AstrologerRemedyService[];
    remedy: UserRemedy;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface WalletSummary {
    balance: number;
    totalSpent: number;
    totalAdded: number;
    pendingRefunds: number;
}

export interface WalletTransaction {
    id: string;
    type: 'credit' | 'debit';
    description: string;
    amount: number;
    date: string;
    status: string;
}

export interface ChatMessage {
    _id: string;
    senderId: string;
    senderType: 'user' | 'astrologer';
    content: string;
    timestamp: string;
    status: string;
}

export interface ChatConversation {
    _id: string;
    userId: string;
    astrologerId: string | null;
    status: string;
    messages: ChatMessage[];
    unreadCount: { user: number; astrologer: number };
    lastMessageAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserListResponse<T> {
    success: boolean;
    data: T[];
}

export interface UserWalletResponse {
    success: boolean;
    data: WalletSummary;
}

export interface UserChatMessagesResponse {
    success: boolean;
    data: ChatMessage[];
}
