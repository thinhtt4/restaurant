import { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetBlogsQuery } from "@/store/api/blogApi";
import { useBlogSync } from "@/hooks/useBlogSync";
import ArticleGrid from "@/components/guest/blog/article-grid";
import Hero from "@/components/guest/blog/hero";
import Sidebar from "@/components/guest/blog/sidebar";
import PaginationControls from "@/components/ui/PaginationControls";


// Component BlogHome (Logic chính)
export function BlogHome() { // Đổi tên thành BlogHomeContent
    const [keyword, setKeyword] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const debouncedKeyword = useDebounce(keyword, 300);

    const { data, isLoading, isFetching, isError, refetch } = useGetBlogsQuery(
        {
            keyword: debouncedKeyword,
            page,
            size: 6,
        },
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
            refetchOnReconnect: true,
        }
    );

    useBlogSync(refetch);

    const blogs = data?.data?.blogs ?? [];
    const totalPages = data?.data?.totalPages ?? 1;

    const handleSearch = useCallback((kw: string) => {
        setKeyword(kw);
        setPage(1);
    }, []);

    const goToPage = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Hero
                title="Tin tức và mẹo hay"
                breadcrumbs={[
                    { label: 'TRANG CHỦ', href: '/' },
                    { label: 'TIN TỨC VÀ MẸO HAY' }
                ]}
            />

            <div className="flex gap-6 max-w-7xl mx-auto px-4 py-12">
                <div className="flex-1">
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết ..."
                            className="w-full p-2 border border-gray-300 rounded"
                            value={keyword}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>

                    <ArticleGrid
                        blogs={blogs}
                        isLoading={isLoading || isFetching}
                        isError={isError}
                    />

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <PaginationControls
                                page={page}
                                totalPages={totalPages}
                                onPageChange={goToPage}
                            />
                        </div>
                    )}
                </div>

                <Sidebar blogs={blogs} />
            </div>
        </div>
    );
}
