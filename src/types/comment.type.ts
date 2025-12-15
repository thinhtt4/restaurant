export interface CommentResponse {
    commentId: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    blogId: number;
    blogTitle: string;
    userId: number;
    username: string;
    userAvatar?: string;
    parentCommentId?: number;
    replyCount?: number;
}

export interface CommentRequest {
    content: string;
    parentCommentId?: number;
}