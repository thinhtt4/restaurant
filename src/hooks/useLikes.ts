// hooks/useLikes.ts
import {
    useGetLikeStatusQuery,
    useToggleLikeMutation,
    useGetLikeCountQuery
} from '@/store/api/likeApi';

interface UseLikesProps {
    postId: number;
    enabled?: boolean;
}

export function useLikes({ postId, enabled = true }: UseLikesProps) {
    // Lấy trạng thái like (boolean)
    const {
        data: isLiked = false,
        isLoading: isStatusLoading,
        isError: isStatusError,
    } = useGetLikeStatusQuery(postId, {
        skip: !enabled,
    });

    // Lấy số lượng like (number)
    const {
        data: likeCount = 0,
        isLoading: isCountLoading,
        isError: isCountError,
    } = useGetLikeCountQuery(postId, {
        skip: !enabled,
    });

    const [toggleLikeMutation, { isLoading: isToggling }] = useToggleLikeMutation();

    const toggleLike = async () => {
        try {
            await toggleLikeMutation(postId).unwrap();
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    return {
        isLiked,
        likeCount,
        isLoading: isStatusLoading || isCountLoading,
        isError: isStatusError || isCountError,
        isToggling,
        toggleLike,
    };
}

// Hook chỉ lấy số lượng like
export function useLikeCount(postId: number) {
    const { data: likeCount = 0, isLoading } = useGetLikeCountQuery(postId);

    return {
        likeCount,
        isLoading,
    };
}