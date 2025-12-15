import { useState, useEffect } from "react";
import Hero from "./blog/hero";
import { useGetMenuItemsQuery } from "@/store/api/menuItemApi";
import { useGetMenuCategoriesQuery } from "@/store/api/categoryApi";
import type { MenuItem } from "@/types/menuItem.type";

export default function MenuPage() {

    const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6;

    // Fetch categories
    const { data: categoryData } = useGetMenuCategoriesQuery({});
    const categories = ["Tất cả", ...(categoryData?.data?.map((cat: any) => cat.name) || [])];

    // Fetch menu items
    const { data: menuData, isLoading, error } = useGetMenuItemsQuery({
        page: 1,
        size: 200,
        search: "",
        active: true,
    });

    const menuItems: MenuItem[] = menuData?.data || [];

    // Filter by category + search
    const filteredItems = menuItems.filter((item: MenuItem) => {
        const matchesCategory =
            selectedCategory === "Tất cả" || item.categoryName === selectedCategory;

        const matchesSearch = item.name
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase());

        return matchesCategory && matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    // Reset page when filtering
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery]);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const selectCategory = (category: string) => {
        setSelectedCategory(category);
    };

    // Loading state
    if (isLoading) {
        return (
            <main className="min-h-screen bg-background">
                <section className="py-16 md:py-24 bg-card text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                    <p className="mt-4 text-lg">Đang tải thực đơn...</p>
                </section>
            </main>
        );
    }

    // Error state
    if (error) {
        return (
            <main className="min-h-screen bg-background">
                <section className="py-16 md:py-24 bg-card text-center">
                    <p className="text-red-500 text-lg">Không thể tải thực đơn. Vui lòng thử lại.</p>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <Hero
                title="Thực Đơn"
                breadcrumbs={[
                    { label: "TRANG CHỦ", href: "/" },
                    { label: "THỰC ĐƠN" }
                ]}
                backgroundImage="/cozy-italian-restaurant.png"
            />

            {/* Menu Section */}
            <section className="py-16 md:py-24 bg-card">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                        {/* Sidebar Categories */}
                        <div className="lg:col-span-1">
                            <div className="bg-card border border-border p-6 rounded-lg">
                                <h3 className="text-accent font-bold text-lg mb-4">THỰC ĐƠN</h3>

                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => selectCategory(category)}
                                            className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all
                                                ${selectedCategory === category
                                                    ? "bg-accent text-white border border-accent"
                                                    : "bg-background hover:bg-accent/10 border border-transparent"
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Menu Content */}
                        <div className="lg:col-span-3">
                            {/* Title */}
                            <div className="mb-8">
                                <p className="text-accent font-semibold mb-2">Nhà Hàng Quê Lúa</p>
                                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                                    {selectedCategory}
                                </h2>

                                {/* Search Bar */}
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm kiếm món ăn..."
                                    className="w-full max-w-md px-4 py-3 border-2 border-border rounded-lg focus:border-accent outline-none"
                                />
                            </div>

                            {/* Menu Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {currentItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all"
                                    >
                                        <div className="relative aspect-square">
                                            <img
                                                src={item.imageUrl || "/placeholder.svg"}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                            />
                                        </div>

                                        <div className="p-4 space-y-2">
                                            <h3 className="text-lg font-bold">{item.name}</h3>
                                            <p className="text-accent font-semibold text-xl">
                                                {item.price.toLocaleString("vi-VN")} đ
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {currentItems.length === 0 && (
                                <div className="text-center py-16 text-foreground/50">
                                    Không tìm thấy món ăn phù hợp
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-3 mt-10">
                                    {/* Prev */}
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-lg border border-border disabled:opacity-50"
                                    >
                                        Trước
                                    </button>

                                    {/* Page Numbers */}
                                    {[...Array(totalPages)].map((_, idx) => {
                                        const page = idx + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`px-4 py-2 rounded-lg border ${currentPage === page
                                                    ? "bg-accent text-white border-accent"
                                                    : "border-border"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    {/* Next */}
                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-lg border border-border disabled:opacity-50"
                                    >
                                        Sau
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
