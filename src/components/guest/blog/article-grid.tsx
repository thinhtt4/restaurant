import type { BlogResponse } from "@/types/blog.type";
import { Link } from "react-router-dom"
import { LikeButton } from "./like-button";

interface ArticleGridProps {
    blogs?: BlogResponse[];
    isLoading: boolean;
    isError: boolean;
}

export default function ArticleGrid({ blogs, isLoading, isError }: ArticleGridProps) {
    // Loading state
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg h-80 animate-pulse">
                        <div className="h-56 bg-gray-200"></div>
                        <div className="p-5 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">Không thể tải bài viết. Vui lòng thử lại!</p>
            </div>
        );
    }

    // Empty state
    if (!blogs || blogs.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">Chưa có bài viết nào.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
                <Link key={blog.blogId} to={`/app/blog/${blog.blogId}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group border border-border h-full">
                        {/* Image Container */}
                        <div className="relative h-56 overflow-hidden bg-muted">
                            <img
                                src={
                                    blog.imageUrl ||
                                    "/Que_Lua.png"
                                }
                                alt={blog.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        {/* Content Container */}
                        <div className="p-5">
                            <h3 className="text-base font-bold text-foreground mb-3 line-clamp-3 group-hover:text-accent transition-colors leading-snug">
                                {blog.title}
                            </h3>

                            <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">{blog.authorName}</p>
                                <LikeButton postId={blog.blogId} showCount={true} />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}