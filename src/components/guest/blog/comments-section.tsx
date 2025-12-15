/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { MessageSquare, Loader2 } from 'lucide-react'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useComment } from "@/hooks/useComment"
import type { CommentResponse } from "@/types/comment.type"
import ConfirmDialog from "@/components/ui/ConfirmDialog"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"


interface CommentNode extends CommentResponse {
    replies?: CommentNode[]
}

interface NestedReplyProps {
    reply: CommentNode
    level?: number
    onReply: (parentId: number, content: string) => Promise<void>
    onDelete: (commentId: number) => Promise<{ success: boolean; error?: any }>
    onToggleExpand: (id: number) => void
    expandedReplies: Set<string>
    replyingTo: number | null
    replyContent: string
    onReplyContentChange: (content: string) => void
    currentUserId?: number
    onRequestDelete: (commentId: number) => void
}

function NestedReply({
    reply,
    level = 0,
    onReply,
    onDelete,
    onToggleExpand,
    expandedReplies,
    replyingTo,
    replyContent,
    onReplyContentChange,
    currentUserId,
    onRequestDelete,
}: NestedReplyProps) {
    const isExpanded = expandedReplies.has(reply.commentId.toString())
    const hasReplies = reply.replies && reply.replies.length > 0
    const isOwner = currentUserId === reply.userId
    const [isDeleting] = useState(false)

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return "Vừa xong"
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`
        return date.toLocaleDateString("vi-VN")
    }

    return (
        <div className="space-y-3">
            <div className="flex gap-3">
                <Avatar className={`flex-shrink-0 ${level > 0 ? "h-7 w-7" : "h-8 w-8"}`}>
                    {reply.userAvatar ? (
                        <AvatarImage src={reply.userAvatar} alt={reply.username} />
                    ) : (
                        <AvatarImage src={'https://res.cloudinary.com/dig9xykia/image/upload/v1764062750/restaurant_app_images/ek0qr63hqphaofizppva.png'} alt={reply.username} />
                    )}
                </Avatar>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <span className={`font-medium text-foreground ${level > 0 ? "text-xs" : "text-sm"}`}>
                            {reply.username}
                        </span>
                    </div>

                    <p className={`text-foreground leading-relaxed ${level > 0 ? "text-xs" : "text-sm"}`}>
                        {reply.content}
                    </p>

                    <div className={`flex items-center gap-3 text-muted-foreground pt-1 ${level > 0 ? "text-xs" : "text-xs"}`}>
                        <button
                            onClick={() => onToggleExpand(reply.commentId)}
                            className="hover:text-accent transition-colors"
                        >
                            💬 Trả lời
                        </button>

                        {isOwner && (
                            <button
                                onClick={() => onRequestDelete(reply.commentId)}
                                disabled={isDeleting}
                                className="hover:text-red-500 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? "Đang xóa..." : "Xóa"}
                            </button>
                        )}

                        <span className="ml-auto">{formatTime(reply.createdAt)}</span>
                    </div>
                </div>
            </div>

            {hasReplies && (
                <div className={`${level > 0 ? "ml-6" : "ml-11"} border-l-2 border-border pl-3 space-y-3`}>
                    {!isExpanded && reply.replies!.length > 0 && (
                        <button
                            onClick={() => onToggleExpand(reply.commentId)}
                            className="text-xs text-accent hover:opacity-80 transition-opacity font-medium flex items-center gap-1"
                        >
                            <MessageSquare size={12} />
                            Xem {reply.replies!.length} trả lời
                        </button>
                    )}

                    {isExpanded && (
                        <>
                            {reply.replies!.map((nestedReply) => (
                                <NestedReply
                                    key={nestedReply.commentId}
                                    reply={nestedReply}
                                    level={level + 1}
                                    onReply={onReply}
                                    onDelete={onDelete}
                                    onToggleExpand={onToggleExpand}
                                    expandedReplies={expandedReplies}
                                    replyingTo={replyingTo}
                                    replyContent={replyContent}
                                    onReplyContentChange={onReplyContentChange}
                                    currentUserId={currentUserId}
                                    onRequestDelete={onRequestDelete}
                                />
                            ))}

                            <button
                                onClick={() => onToggleExpand(reply.commentId)}
                                className="text-xs text-muted-foreground hover:text-accent transition-colors"
                            >
                                Ẩn trả lời
                            </button>
                        </>
                    )}
                </div>
            )}

            {replyingTo === reply.commentId && (
                <div className={`${level > 0 ? "ml-10" : "ml-11"} bg-muted rounded-lg p-3 space-y-2`}>
                    <Textarea
                        placeholder="Viết trả lời..."
                        value={replyContent}
                        onChange={(e) => onReplyContentChange(e.target.value)}
                        className="resize-none border-0 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-xs"
                        rows={2}
                    />
                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={() => {
                                onToggleExpand(reply.commentId)
                                onReplyContentChange("")
                            }}
                            variant="outline"
                            size="sm"
                            className="text-foreground border-border hover:bg-background text-xs h-7"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={() => onReply(reply.commentId, replyContent)}
                            disabled={!replyContent.trim()}
                            size="sm"
                            className="bg-accent text-accent-foreground hover:opacity-90 text-xs h-7"
                        >
                            Gửi
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

interface CommentsSectionProps {
    blogId: number
    currentUserId?: number
}

export default function CommentsSection({ blogId, currentUserId }: CommentsSectionProps) {
    const [sortBy, setSortBy] = useState<"relevant" | "newest">("relevant")
    const [newComment, setNewComment] = useState("")
    const [replyContent, setReplyContent] = useState("")
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState<number | null>(null)

    const {
        comments,
        commentCount,
        expandedReplies,
        replyingTo,
        isLoading,
        isCreating,
        createComment,
        deleteComment,
        toggleReplies,
        toggleReplyForm,
    } = useComment({ blogId, sortBy })
    const { isAuthenticated } = useAuth()
    const isLoggedIn = isAuthenticated

    const handleSubmitComment = async () => {
        if (!isLoggedIn) {
            toast.error("Vui lòng đăng nhập để bình luận")
            return
        }
        if (newComment.trim()) {
            const result = await createComment(newComment)
            if (result.success) {
                setNewComment("")
            }
        }
    }

    const handleSubmitReply = async (parentId: number) => {
        if (!isLoggedIn) {
            toast.error("Vui lòng đăng nhập để bình luận")
            return
        }
        if (replyContent.trim()) {
            const result = await createComment(replyContent, parentId)
            if (result.success) {
                setReplyContent("")
            }
        }
    }

    const handleRequestDelete = (commentId: number) => {
        setCommentToDelete(commentId)
        setDeleteConfirmOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (commentToDelete !== null) {
            await deleteComment(commentToDelete)
            setDeleteConfirmOpen(false)
            setCommentToDelete(null)
        }
    }

    const handleCancelDelete = () => {
        setDeleteConfirmOpen(false)
        setCommentToDelete(null)
    }

    if (isLoading) {
        return (
            <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                </div>
            </div>
        )
    }

    return (
        <div className="mt-12 pt-8 border-t border-border">
            <ConfirmDialog
                open={deleteConfirmOpen}
                title="Xác nhận xóa"
                description="Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác."
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                    Ý kiến ({commentCount})
                </h2>

                {/* Comment Input */}
                <div className="bg-muted rounded-lg p-4">
                    <Textarea
                        placeholder="Chia sẻ ý kiến của bạn"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="resize-none border-0 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none"
                        rows={3}
                    />
                    <div className="flex justify-end mt-3 gap-2">
                        <Button
                            onClick={() => setNewComment("")}
                            variant="outline"
                            className="text-foreground border-border hover:bg-background"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmitComment}
                            disabled={!newComment.trim() || isCreating}
                            className="bg-accent text-accent-foreground hover:opacity-90"
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Đang gửi...
                                </>
                            ) : (
                                "Gửi"
                            )}
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as "relevant" | "newest")} className="w-full">
                    <TabsList className="grid w-full max-w-xs grid-cols-2 bg-transparent border-b border-border rounded-none">
                        <TabsTrigger
                            value="newest"
                            className="text-muted-foreground data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none border-b-2 border-transparent"
                        >
                            Mới nhất
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={sortBy} className="mt-6 space-y-6">
                        {comments.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                Chưa có bình luận nào. Hãy là người đầu tiên!
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.commentId} className="space-y-4">
                                    <div className="flex gap-4">
                                        <Avatar className="h-10 w-10 flex-shrink-0">
                                            {comment.userAvatar ? (
                                                <AvatarImage src={comment.userAvatar} alt={comment.username} />
                                            ) : (
                                                <AvatarImage src={'https://res.cloudinary.com/dig9xykia/image/upload/v1764062750/restaurant_app_images/ek0qr63hqphaofizppva.png'} alt={comment.username} />

                                            )}
                                        </Avatar>

                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-foreground">
                                                    {comment.username}
                                                </span>
                                            </div>

                                            <p className="text-foreground text-sm leading-relaxed">
                                                {comment.content}
                                            </p>

                                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                                                <button
                                                    onClick={() => toggleReplyForm(comment.commentId)}
                                                    className="hover:text-accent transition-colors"
                                                >
                                                    💬 Trả lời
                                                </button>

                                                {currentUserId === comment.userId && (
                                                    <button
                                                        onClick={() => handleRequestDelete(comment.commentId)}
                                                        className="hover:text-red-500 transition-colors"
                                                    >
                                                        Xóa
                                                    </button>
                                                )}

                                                <span className="ml-auto">
                                                    {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className="ml-14 border-l-2 border-border pl-4 space-y-3">
                                            {!expandedReplies.has(comment.commentId.toString()) && (
                                                <button
                                                    onClick={() => toggleReplies(comment.commentId)}
                                                    className="text-xs text-accent hover:opacity-80 transition-opacity font-medium flex items-center gap-1"
                                                >
                                                    <MessageSquare size={14} />
                                                    Xem {comment.replies.length} trả lời
                                                </button>
                                            )}

                                            {expandedReplies.has(comment.commentId.toString()) && (
                                                <>
                                                    {comment.replies.map((reply) => (
                                                        <NestedReply
                                                            key={reply.commentId}
                                                            reply={reply}
                                                            level={0}
                                                            onReply={handleSubmitReply}
                                                            onDelete={deleteComment}
                                                            onToggleExpand={toggleReplies}
                                                            expandedReplies={expandedReplies}
                                                            replyingTo={replyingTo}
                                                            replyContent={replyContent}
                                                            onReplyContentChange={setReplyContent}
                                                            currentUserId={currentUserId}
                                                            onRequestDelete={handleRequestDelete}
                                                        />
                                                    ))}

                                                    <button
                                                        onClick={() => toggleReplies(comment.commentId)}
                                                        className="text-xs text-muted-foreground hover:text-accent transition-colors"
                                                    >
                                                        Ẩn trả lời
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {replyingTo === comment.commentId && (
                                        <div className="ml-14 bg-muted rounded-lg p-3 space-y-2">
                                            <Textarea
                                                placeholder="Viết trả lời..."
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                className="resize-none border-0 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-sm"
                                                rows={2}
                                            />
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    onClick={() => {
                                                        toggleReplyForm(null)
                                                        setReplyContent("")
                                                    }}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-foreground border-border hover:bg-background"
                                                >
                                                    Hủy
                                                </Button>
                                                <Button
                                                    onClick={() => handleSubmitReply(comment.commentId)}
                                                    disabled={!replyContent.trim() || isCreating}
                                                    size="sm"
                                                    className="bg-accent text-accent-foreground hover:opacity-90"
                                                >
                                                    {isCreating ? (
                                                        <>
                                                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                            Đang gửi...
                                                        </>
                                                    ) : (
                                                        "Gửi"
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}