/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  UtensilsCrossed,
  FileText,
  Settings,
  Users,
  Store,
  MessageSquare,
  ChevronDown,
  Ticket,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { hasAnyRequiredRole, normalizeRoles } from "@/utils/authUtils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface SubMenuItem {
  label: string;
  href: string;
  requiredRoles?: string[];
}

interface MenuItem {
  icon: any;
  label: string;
  id: string;
  href?: string;
  expandable?: boolean;
  submenu?: SubMenuItem[];
  requiredRoles?: string[];
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();

  const { user, isLoading } = useAuth();

  const roleUser = user?.data?.roles ?? null;

  const roleNames = normalizeRoles(roleUser);

  const toggleExpand = (item: string) => {
    setExpandedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Hàm xử lý click vào menu item
  const handleMenuClick = (item: MenuItem) => {
    if (!isOpen && item.expandable) {
      onToggle();
      setTimeout(() => {
        toggleExpand(item.id);
      }, 100);
    } else if (item.expandable) {
      toggleExpand(item.id);
    }
  };

  const menuItems: MenuItem[] = [
    {
      icon: Home,
      label: "Dashboard",
      id: "dashboard",
      href: "/admin/dashboard",
      requiredRoles: ["ADMIN", "MANAGER", "STAFF"],
    },

    {
      icon: Users,
      label: "Quản Lý Tài Khoản",
      id: "accounts",
      expandable: true,
      requiredRoles: ["ADMIN"],
      submenu: [
        {
          label: "Danh sách tài khoản",
          href: "/admin/accounts",
          requiredRoles: ["ADMIN"],
        },
      ],
    },

    // {
    //   icon: TrendingUp,
    //   label: "Quản Lý Vai Trò",
    //   id: "roles",
    //   expandable: true,
    //   requiredRoles: ["ADMIN"],
    //   submenu: [
    //     {
    //       label: "Danh sách vai trò",
    //       href: "/admin/roles",
    //       requiredRoles: ["ADMIN"],
    //     },
    //     {
    //       label: "Phân quyền",
    //       href: "/admin/permissions",
    //       requiredRoles: ["ADMIN"],
    //     },
    //   ],
    // },

    {
      icon: UtensilsCrossed,
      label: "Quản Lý Món Ăn",
      id: "dishes",
      expandable: true,
      requiredRoles: ["ADMIN", "MANAGER"],
      submenu: [
        {
          label: "Quản lý sản phẩm",
          href: "/admin/menu-item",
          requiredRoles: ["ADMIN", "MANAGER"],
        },
        {
          label: "Danh mục sản phẩm",
          href: "/admin/menu-category",
          requiredRoles: ["ADMIN", "MANAGER"],
        },
        {
          label: "Danh sách combo",
          href: "/admin/combo",
          requiredRoles: ["ADMIN", "MANAGER"],
        },
      ],
    },
    {
      icon: FileText,
      label: "Quản Lý Bài Viết",
      id: "posts",
      expandable: true,
      requiredRoles: ["ADMIN", "MANAGER"],
      submenu: [
        {
          label: "Danh sách bài viết",
          href: "/admin/blog",
          requiredRoles: ["ADMIN", "MANAGER"],
        },
      ],
    },
    {
      icon: Ticket,
      label: "Quản Lý Voucher",
      id: "voucher",
      expandable: true,
      requiredRoles: ["ADMIN", "MANAGER"],
      submenu: [
        {
          label: "Danh sách voucher",
          href: "/admin/voucher",
          requiredRoles: ["ADMIN", "MANAGER"],
        },
      ],
    },
    {
      icon: Settings,
      label: "Quản Lý Bàn",
      id: "other",
      expandable: true,
      requiredRoles: ["ADMIN", "MANAGER"],
      submenu: [
        {
          label: "Quản lí bàn",
          href: "/admin/table-crud",
          requiredRoles: ["ADMIN", "MANAGER"],
        },
        {
          label: "Quản lí loại bàn",
          href: "/admin/table-area",
          requiredRoles: ["ADMIN", "MANAGER"],
        },
      ],
    },


    {
      icon: Store,
      label: "Quản Lý Đặt Bàn",
      id: "booking",
      expandable: true,
      requiredRoles: ["ADMIN", "MANAGER", "STAFF"],
      submenu: [
        {
          label: "Danh sách đặt bàn",
          href: "/admin/booking",
          requiredRoles: ["ADMIN", "MANAGER", "STAFF"],
        },
        {
          label: "Đặt bàn",
          href: "/admin/table-map",
          requiredRoles: ["ADMIN", "MANAGER", "STAFF"],
        },
      ],
    },

    {
      icon: MessageSquare,
      label: "Tư vấn với khách hàng",
      id: "consultation",
      expandable: true,
      requiredRoles: ["ADMIN", "MANAGER", "STAFF"],
      submenu: [
        {
          label: "Tin nhắn",
          href: "/admin/chat",
          requiredRoles: ["ADMIN", "MANAGER", "STAFF"],
        },
        // {
        //   label: "Phản hồi",
        //   href: "/admin/feedback",
        //   requiredRoles: ["ADMIN", "MANAGER", "STAFF"],
        // },
      ],
    },
  ];

  // Kiểm tra xem menu item có đang active không
  const isMenuActive = (item: MenuItem) => {
    if (item.href) {
      return location.pathname === item.href;
    }
    if (item.submenu) {
      return item.submenu.some((sub) => location.pathname === sub.href);
    }
    return false;
  };

  // Kiểm tra xem submenu item có đang active không
  const isSubMenuActive = (href: string) => {
    return location.pathname === href;
  };

  // Tự động expand menu nếu có submenu item đang active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (!item.submenu) return;

      if (!hasAnyRequiredRole(roleNames, item.requiredRoles)) return;

      const hasActiveSubItem = item.submenu.some(
        (sub) =>
          sub.href === location.pathname &&
          hasAnyRequiredRole(roleNames, sub.requiredRoles)
      );
      if (hasActiveSubItem && !expandedItems.includes(item.id)) {
        setExpandedItems((prev) => [...prev, item.id]);
      }
    });
  }, [location.pathname, roleNames]);

  if (isLoading) {
    return (
      <div
        className={`bg-slate-900 text-white ${isOpen ? "w-64" : "w-20"} p-4`}
      >
        Đang tải...
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-900 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-20"
        } overflow-y-auto`}
    >
      {/* Logo + Toggle Button */}
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Logo Quê Lúa"
            className="w-8 h-8 rounded-full object-cover"
          />
          {isOpen && (
            <span className="font-bold text-lg">
              <Link to={"/app/home"}>Quê Lúa</Link>
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label={isOpen ? "Thu gọn sidebar" : "Mở rộng sidebar"}
        >
          {isOpen ? "«" : "»"}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          if (!hasAnyRequiredRole(roleNames, item.requiredRoles)) return null;
          const Icon = item.icon;
          const isExpanded = expandedItems.includes(item.id);
          const isActive = isMenuActive(item);

          return (
            <div key={item.id}>
              {item.href ? (
                <Link
                  to={item.href}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800"
                    }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    {isOpen && <span className="text-sm">{item.label}</span>}
                  </div>
                </Link>
              ) : (
                <button
                  onClick={() => handleMenuClick(item)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:bg-slate-800"
                  title={!isOpen ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    {isOpen && <span className="text-sm">{item.label}</span>}
                  </div>
                  {isOpen && item.expandable && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isExpanded ? "rotate-180" : ""
                        }`}
                    />
                  )}
                </button>
              )}

              {/* Submenu */}
              {isOpen && item.expandable && isExpanded && item.submenu && (
                <div className="ml-4 mt-2 space-y-1 border-l border-slate-700 pl-3">
                  {item.submenu
                  .filter((subItem) => hasAnyRequiredRole(roleNames,subItem.requiredRoles))
                  .map((subItem, index) => {
                    const isSubActive = isSubMenuActive(subItem.href);
                    return (
                      <Link
                        key={index}
                        to={subItem.href}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${isSubActive
                          ? "bg-blue-500 text-white font-medium"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                          }`}
                      >
                        {subItem.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
