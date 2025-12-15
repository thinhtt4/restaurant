export interface LikeStatusResponse {
    isLiked: boolean;
    likeCount: number;
}

export interface ToggleLikeResponse {
    status: number;
    code: number;
    message: string;
    data: boolean;
}