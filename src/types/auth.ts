export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    }
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    name?: string;
    confirmPassword?: string;
}

export interface RefreshTokenResponse {
    success: boolean;
    data: {
        accessToken: string;
        refreshToken: string;
    }
}
