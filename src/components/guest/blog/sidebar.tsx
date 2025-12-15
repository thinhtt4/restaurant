import type { BlogResponse } from "@/types/blog.type";
import { Link } from "react-router-dom"
import { useMemo } from "react";
import { LikeButton } from "./like-button";

interface SidebarProps {
    blogs?: BlogResponse[];
}

export default function Sidebar({ blogs }: SidebarProps) {
    // Sort blogs theo likeCount giảm dần và lấy 4 bài đầu
    const relatedPosts = useMemo(() => {
        if (!blogs || blogs.length === 0) return [];

        return [...blogs]
            .sort((a, b) => (b.countLike ?? 0) - (a.countLike ?? 0))
            .slice(0, 4);
    }, [blogs]);

    return (
        <div className="w-full lg:w-72 flex flex-col gap-6">
            {/* Related Posts Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-border">
                <h3 className="text-lg font-bold text-foreground mb-5">
                    Bài viết được yêu thích nhất
                </h3>

                {relatedPosts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Chưa có bài viết nào
                    </p>
                ) : (
                    <div className="space-y-4">
                        {relatedPosts.map((post) => (

                            <Link
                                key={post.blogId}
                                to={`/app/blog/${post.blogId}`}
                                className="flex gap-3 cursor-pointer group pb-4 border-b border-border last:border-b-0 last:pb-0"
                            >
                                <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-muted">
                                    <img
                                        src={post.imageUrl || "/Que_Lua.png?height=80&width=80"}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                                        {post.title}
                                    </p>

                                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                        <LikeButton postId={post.blogId} showCount={true} />

                                    </div>

                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}