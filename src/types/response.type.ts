export interface APIResponse<T> {
    status: number,
    code: number,
    message: string,
    data: T
}

export interface AuthResponse {
    accessToken : string,
    refreshToken : string,
}