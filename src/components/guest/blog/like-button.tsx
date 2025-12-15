'use client'

import { Heart } from 'lucide-react'
import { useLikes } from '@/hooks/useLikes'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface LikeButtonProps {
    postId: number
    showCount?: boolean
    className?: string
}

export function LikeButton({ postId, showCount = true, className = '' }: LikeButtonProps) {
    const { isLiked, likeCount, toggleLike, isToggling, isLoading, isError } = useLikes({ postId })
    const { isAuthenticated } = useAuth()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        e.preventDefault()
        if (!isAuthenticated) {
            toast.error("Vui lòng đăng nhập để thích bài viết")
            return
        }
        if (!isToggling && !isLoading) {
            toggleLike()
        }
    }

    const isDisabled = isToggling || isLoading
    const displayCount = Math.max(0, likeCount ?? 0)

    return (
        <button
            onClick={handleClick}
            disabled={isDisabled}
            aria-pressed={isLiked}
            aria-label={isLiked ? `Unlike post (${displayCount} likes)` : `Like post (${displayCount} likes)`}
            title={isLiked ? 'Unlike' : 'Like'}
            className={`
                flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-200
                ${isLiked
                    ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400'
                    : 'bg-muted text-muted-foreground hover:bg-accent/10'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isError ? 'border border-destructive' : ''}
                ${className}
            `}
        >
            <Heart
                size={18}
                className={`transition-transform ${isLiked ? 'fill-current scale-110' : ''
                    } ${isToggling ? 'animate-pulse' : ''}`}
                aria-hidden="true"
            />
            {showCount && (
                <span className="text-sm font-medium">
                    {displayCount}
                </span>
            )}
        </button>
    )
}