// websocket.type.ts
export interface BlogUpdateMessage {
    action: "created" | "updated" | "deleted";
    blogId: number;
    title: string;
}

export interface CommentUpdateMessage {
    action: "created" | "updated" | "deleted";
    blogId: number;
    commentId: number;
    content?: string;
    username: string;
    userAvatar?: string;
    parentCommentId?: number;
    timestamp: number;
}

export interface LikeUpdateMessage {
    action: "liked" | "unliked";
    blogId: number;
    likeCount: number;
    username: string;
    timestamp: number;
}