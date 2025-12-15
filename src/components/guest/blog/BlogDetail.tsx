import { useParams } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { useGetBlogByIdQuery } from "@/store/api/blogApi"
import Hero from "@/components/guest/blog/hero"
import HTMLReactParser from 'html-react-parser'
import CommentsSection from "./comments-section"
import { LikeButton } from "./like-button"
import { useBlogSync } from "@/hooks/useBlogSync"
import { useAuth } from "@/hooks/useAuth"

export default function BlogDetail() {
    const { user } = useAuth();
    const params = useParams<{ id: string }>()



    // Kiểm tra và parse ID
    const id = params?.id ? Number.parseInt(params.id) : null

    // Sử dụng hook để fetch blog data
    const { data: blogResponse, isLoading, isError, refetch } = useGetBlogByIdQuery(id!, {
        skip: !id || isNaN(id), // Skip query nếu id không hợp lệ
    })
    useBlogSync(refetch);

    // Invalid ID
    if (!id || isNaN(id)) {
        return (
            <div className="min-h-screen bg-background">
                <div className="text-center py-20">
                    <h1 className="text-2xl font-bold text-red-600">ID bài viết không hợp lệ</h1>
                    <a
                        href="/app/blog"
                        className="inline-block mt-6 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Quay lại danh sách blog
                    </a>
                </div>
            </div>
        )
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="text-center py-20">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
                    </div>
                    <p className="text-xl mt-4">Đang tải bài viết...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (isError || !blogResponse) {
        return (
            <div className="min-h-screen bg-background">
                <div className="text-center py-20">
                    <h1 className="text-2xl font-bold text-red-600">
                        {isError ? "Có lỗi xảy ra khi tải bài viết" : "Bài viết không tìm thấy"}
                    </h1>
                    <a
                        href="/app/blog"
                        className="inline-block mt-6 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Quay lại danh sách blog
                    </a>
                </div>
            </div>
        )
    }

    // Format date
    const formattedDate = new Date(blogResponse.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })

    return (
        <div className="min-h-screen bg-background">
            <Hero
                title="CHI TIẾT BÀI VIẾT"
                breadcrumbs={[
                    { label: 'TRANG CHỦ', href: '/' },
                    { label: 'TIN TỨC', href: '/blog' },
                    { label: 'CHI TIẾT BÀI VIẾT' }
                ]}
                backgroundImage="/10.jpg"
            />

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <article className="bg-white rounded-lg shadow-sm p-8">
                    {/* Title and Metadata */}
                    <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
                        {blogResponse.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                        <span>Ngày đăng: {formattedDate}</span>
                        <span>•</span>
                        <span>Tác giả: {blogResponse.authorName}</span>
                        {/* Đẩy nút Like sang bên phải */}
                        <div className="ml-auto">
                            <LikeButton
                                postId={id}
                                showCount={true}
                                className="scale-125"   // làm nút to hơn
                            />
                        </div>
                    </div>



                    {/* Featured Image */}
                    {blogResponse.imageUrl && (
                        <div className="mb-8 rounded-lg overflow-hidden bg-muted h-96">
                            <img
                                src={blogResponse.imageUrl}
                                alt={blogResponse.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "/Que_Lua.png"
                                }}
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        {blogResponse.content ? (
                            <div className="text-base leading-relaxed mb-4 text-gray-800 dark:text-gray-200">
                                {HTMLReactParser(blogResponse.content)}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">Nội dung đang được cập nhật...</p>
                        )}
                    </div>


                    {/* Back Button */}
                    <div className="mt-12 pt-8 border-t border-border">
                        <a
                            href="/app/blog"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            <ChevronRight size={18} className="rotate-180" />
                            Quay lại danh sách blog
                        </a>
                    </div>
                    <CommentsSection blogId={id} currentUserId={user?.data.id} />
                </article>
            </div>
        </div>
    )
}