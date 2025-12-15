import { useState, useMemo } from "react";
import {
    useGetCommentsByBlogIdQuery,
    useGetCommentCountQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} from "@/store/api/commentApi";
import type { CommentResponse, CommentRequest } from "@/types/comment.type";

interface CommentNode extends CommentResponse {
    replies?: CommentNode[];
}

interface UseCommentOptions {
    blogId: number;
    sortBy?: "relevant" | "newest";
}

export const useComment = ({ blogId, sortBy = "relevant" }: UseCommentOptions) => {
    const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
    const [replyingTo, setReplyingTo] = useState<number | null>(null);

    // Queries
    const {
        data: commentsData = [],
        isLoading: isLoadingComments,
        error: commentsError,
        refetch: refetchComments,
    } = useGetCommentsByBlogIdQuery(blogId);

    const {
        data: commentCount = 0,
        isLoading: isLoadingCount,
        refetch: refetchCount,
    } = useGetCommentCountQuery(blogId);

    // Mutations
    const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();
    const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation();
    const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

    // Transform flat comments to nested structure
    const nestedComments = useMemo(() => {
        const commentMap = new Map<number, CommentNode>();
        const rootComments: CommentNode[] = [];

        // Create map of all comments
        commentsData.forEach((comment) => {
            commentMap.set(comment.commentId, { ...comment, replies: [] });
        });

        // Build tree structure
        commentsData.forEach((comment) => {
            const node = commentMap.get(comment.commentId)!;
            if (comment.parentCommentId && commentMap.has(comment.parentCommentId)) {
                const parent = commentMap.get(comment.parentCommentId)!;
                parent.replies = parent.replies || [];
                parent.replies.push(node);
            } else {
                rootComments.push(node);
            }
        });

        return rootComments;
    }, [commentsData]);

    // Sort comments
    const sortedComments = useMemo(() => {
        const sorted = [...nestedComments];
        if (sortBy === "relevant") {
            // Sort by reply count and created date
            sorted.sort((a, b) => {
                const aScore = (a.replyCount || 0) * 10 + new Date(a.createdAt).getTime();
                const bScore = (b.replyCount || 0) * 10 + new Date(b.createdAt).getTime();
                return bScore - aScore;
            });
        } else {
            // Sort by newest
            sorted.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
        return sorted;
    }, [nestedComments, sortBy]);

    // Handle create comment
    const handleCreateComment = async (content: string, parentCommentId?: number) => {
        try {
            const body: CommentRequest = {
                content,
                ...(parentCommentId && { parentCommentId }),
            };

            await createComment({ blogId, body }).unwrap();
            await refetchComments();
            await refetchCount();

            // Expand parent comment if replying
            if (parentCommentId) {
                setExpandedReplies((prev) => new Set(prev).add(parentCommentId.toString()));
                setReplyingTo(null);
            }

            return { success: true };
        } catch (error) {
            console.error("Failed to create comment:", error);
            return { success: false, error };
        }
    };

    // Handle update comment
    const handleUpdateComment = async (commentId: number, content: string) => {
        try {
            const body: CommentRequest = { content };
            await updateComment({ blogId, commentId, body }).unwrap();
            await refetchComments();
            return { success: true };
        } catch (error) {
            console.error("Failed to update comment:", error);
            return { success: false, error };
        }
    };

    // Handle delete comment
    const handleDeleteComment = async (commentId: number) => {
        try {
            await deleteComment({ blogId, commentId }).unwrap();
            await refetchComments();
            await refetchCount();
            return { success: true };
        } catch (error) {
            console.error("Failed to delete comment:", error);
            return { success: false, error };
        }
    };

    // Toggle expand/collapse replies
    const toggleReplies = (commentId: number | string) => {
        const id = commentId.toString();
        setExpandedReplies((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // Toggle reply form
    const toggleReplyForm = (commentId: number | null) => {
        setReplyingTo(replyingTo === commentId ? null : commentId);
    };

    return {
        // Data
        comments: sortedComments,
        commentCount,
        expandedReplies,
        replyingTo,

        // Loading states
        isLoading: isLoadingComments || isLoadingCount,
        isCreating,
        isUpdating,
        isDeleting,

        // Errors
        error: commentsError,

        // Actions
        createComment: handleCreateComment,
        updateComment: handleUpdateComment,
        deleteComment: handleDeleteComment,
        toggleReplies,
        toggleReplyForm,
        refetchComments,
        refetchCount,
    };
};