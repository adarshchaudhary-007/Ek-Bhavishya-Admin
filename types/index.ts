export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'sub-admin';
    avatar?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface ApiError {
    message: string;
    status: number;
}
