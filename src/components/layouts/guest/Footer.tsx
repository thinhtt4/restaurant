import { Mail, MapPin, Phone, Facebook, Youtube, Twitter } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* About */}
                    <div>
                        <h3 className="text-accent font-bold mb-4 text-lg">Về nhà hàng</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="hover:text-accent transition-colors">
                                    › Về Chúng Tôi
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-accent transition-colors">
                                    › Liên Hệ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-accent transition-colors">
                                    › Dịch Vụ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-accent transition-colors">
                                    › Chính Sách Hoạt Động
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-accent transition-colors">
                                    › Hướng Dẫn Đặt Bàn
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-accent font-bold mb-4 text-lg">Thông tin liên lạc</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-accent mt-1 flex-shrink-0" />
                                <span className="text-sm">FPT University</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-accent flex-shrink-0" />
                                <span className="text-sm">086 8202 662</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-accent flex-shrink-0" />
                                <span className="text-sm">nampham2662@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h3 className="text-accent font-bold mb-4 text-lg">Giờ mở cửa</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="font-semibold">Thứ Hai - Thứ Sáu</p>
                                <p className="text-primary-foreground/80">8:00 - 22:00</p>
                            </div>
                            <div>
                                <p className="font-semibold">Thứ Bảy - Chủ Nhật</p>
                                <p className="text-primary-foreground/80">10:00 - 23:00</p>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-accent font-bold mb-4 text-lg">Liên hệ nhanh</h3>
                        <p className="text-sm mb-4 text-primary-foreground/80">
                            Nếu có thắc mắc hoặc muốn nhận thêm ưu đãi hãy liên hệ ngay với chúng tôi.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Điền email tại đây"
                                className="flex-1 px-3 py-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded text-sm text-primary-foreground placeholder-primary-foreground/50"
                            />
                            <button className="bg-accent text-accent-foreground px-4 py-2 rounded font-bold text-sm hover:bg-opacity-90 transition-all">
                                GỬI
                            </button>
                        </div>

                        {/* Social */}
                        <div className="flex gap-4 mt-6">
                            <a
                                href="#"
                                className="w-10 h-10 border border-primary-foreground/30 rounded-full flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                            >
                                <Twitter size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 border border-primary-foreground/30 rounded-full flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 border border-primary-foreground/30 rounded-full flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
                            >
                                <Youtube size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
                    <p>&copy; 2025 Nhà Hàng Quê Lúa. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
