import { useState } from "react";
import {
  Building2, MapPin, Users, Wifi, Monitor, Wind, Printer,
  ChevronRight, CheckCircle2, Zap, Shield, Calendar,
  ArrowRight, Menu, X, Star, Clock, DollarSign,
  LayoutDashboard, Briefcase, UserCheck
} from "lucide-react";
import type { User } from "../types/user";
import type { Workspace } from "../types/workspace";
import { workspaceTypeLabel } from "../utils/displayText";
import "../styles/home.css";

interface HomeScreenProps {
  user: User | null;
  onLogin: () => void;
  onRegister: () => void;
  onEnterMember: () => void;
  onEnterAdmin: () => void;
  onBookWorkspace: (workspace: Workspace) => void;
}

const S = {
  card: { backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" },
  font: "DM Sans, sans-serif",
};

function vnd(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const NAV_LINKS = [
  { label: "Tính năng", href: "#features" },
  { label: "Không gian", href: "#spaces" },
  { label: "Giá cả", href: "#pricing" },
  { label: "Liên hệ", href: "#contact" },
];

const STATS = [
  { value: "500+", label: "Thành viên", icon: Users },
  { value: "1.200+", label: "Lượt đặt chỗ", icon: Calendar },
  { value: "18", label: "Không gian", icon: MapPin },
  { value: "98%", label: "Hài lòng", icon: Star },
];

const FEATURES = [
  {
    icon: Zap, bg: "#EFF6FF", color: "#3B82F6",
    title: "Đặt chỗ tức thì",
    desc: "Chọn phòng, chọn giờ, xác nhận ngay trong vài giây. Không cần chờ duyệt, không cần gọi điện.",
  },
  {
    icon: Shield, bg: "#F0FDF4", color: "#22C55E",
    title: "Thanh toán an toàn",
    desc: "Ví nội bộ bảo mật, lịch sử giao dịch minh bạch và số dư được cập nhật sau mỗi lần thanh toán.",
  },
  {
    icon: LayoutDashboard, bg: "#F5F3FF", color: "#7C3AED",
    title: "Quản lý thông minh",
    desc: "Bảng điều khiển trực quan giúp theo dõi lịch đặt, chi phí và tỉ lệ sử dụng không gian.",
  },
  {
    icon: UserCheck, bg: "#FFFBEB", color: "#D97706",
    title: "Cộng đồng năng động",
    desc: "Kết nối cùng hàng trăm chuyên gia và doanh nghiệp đang làm việc hiệu quả tại CoSpace mỗi ngày.",
  },
  {
    icon: Clock, bg: "#FFF1F2", color: "#E11D48",
    title: "Mở cửa 7:00 – 22:00",
    desc: "Hoạt động 7 ngày mỗi tuần, đảm bảo bạn luôn có không gian tập trung đúng lúc cần nhất.",
  },
  {
    icon: DollarSign, bg: "#F0FDF4", color: "#059669",
    title: "Giá cả minh bạch",
    desc: "Không phát sinh chi phí ẩn. Thanh toán theo giờ, linh hoạt theo nhu cầu thực tế của bạn.",
  },
];

const SPACE_TYPES = [
  {
    type: "Hot Desk",
    typeColor: "#3B82F6",
    typeBg: "#EFF6FF",
    price: 50_000,
    capacity: 1,
    desc: "Bàn làm việc cá nhân tại không gian mở, lý tưởng cho freelancer và làm việc ngắn hạn.",
    equipment: ["Wi-Fi", "Điều hòa"],
    image: "https://images.unsplash.com/photo-1765366417033-5d74f04ca77a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    popular: false,
  },
  {
    type: "Meeting Room",
    typeColor: "#7C3AED",
    typeBg: "#F5F3FF",
    price: 150_000,
    capacity: 8,
    desc: "Phòng họp riêng tư, đầy đủ thiết bị. Phù hợp cho cuộc họp nhóm và trình bày với khách hàng.",
    equipment: ["Wi-Fi", "Máy chiếu", "Điều hòa"],
    image: "https://images.unsplash.com/photo-1687945727613-a4d06cc41024?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    popular: true,
  },
  {
    type: "Private Office",
    typeColor: "#D97706",
    typeBg: "#FFFBEB",
    price: 200_000,
    capacity: 4,
    desc: "Văn phòng riêng đầy đủ tiện nghi cho nhóm nhỏ, tạo môi trường tập trung và chuyên nghiệp.",
    equipment: ["Wi-Fi", "Máy chiếu", "Điều hòa", "In ấn"],
    image: "https://images.unsplash.com/photo-1746021451691-4385f318ec13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    popular: false,
  },
];

const STEPS = [
  { num: "01", title: "Tạo tài khoản", desc: "Đăng ký miễn phí, điền thông tin cá nhân và xác nhận thư điện tử trong 1 phút." },
  { num: "02", title: "Chọn không gian", desc: "Duyệt danh sách không gian, lọc theo loại phòng và xem lịch còn trống." },
  { num: "03", title: "Đặt & Thanh toán", desc: "Chọn ngày giờ, xác nhận đặt chỗ và thanh toán qua ví CoSpace." },
  { num: "04", title: "Làm việc hiệu quả", desc: "Nhận mã xác nhận, đến trực tiếp và tận hưởng không gian của bạn!" },
];

const TESTIMONIALS = [
  {
    name: "Trần Minh Tú", role: "Nhà thiết kế tự do", init: "T",
    text: "CoSpace giúp tôi có không gian tập trung làm việc mà không cần văn phòng cố định. Đặt chỗ nhanh, giá cả hợp lý, rất tiện lợi!",
    stars: 5,
  },
  {
    name: "Nguyễn Thị Lan", role: "Quản lý sản phẩm", init: "L",
    text: "Tôi thường dùng phòng họp cho buổi lập kế hoạch. Thiết bị đầy đủ, không khí chuyên nghiệp. Cả nhóm tôi đều thích.",
    stars: 5,
  },
  {
    name: "Phạm Đức Anh", role: "Nhà sáng lập doanh nghiệp", init: "A",
    text: "Thuê văn phòng riêng theo tháng tiết kiệm hơn nhiều so với văn phòng truyền thống. CoSpace rất phù hợp với doanh nghiệp mới.",
    stars: 5,
  },
];

const EQUIP_ICONS = {
  "Wi-Fi": Wifi,
  "Máy chiếu": Monitor,
  "Điều hòa": Wind,
  "In ấn": Printer,
};

export function HomeScreen({
  user,
  onLogin,
  onRegister,
  onEnterMember,
  onEnterAdmin,
}: HomeScreenProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const enterProduct = () => {
    if (!user) {
      onLogin();
      return;
    }
    if (user.role === "admin") {
      onEnterAdmin();
      return;
    }
    onEnterMember();
  };

  const scrollToSpaces = () => {
    document.querySelector("#spaces")?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <div className="cospace-landing" style={{ fontFamily: S.font, backgroundColor: "#F9FAFB", minHeight: "100vh", color: "#111111" }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <nav className="landing-nav" style={{
        position: "sticky", top: 0, zIndex: 50,
        backgroundColor: "#FFFFFF", borderBottom: "1px solid #E5E7EB",
        height: "64px", display: "flex", alignItems: "center",
        padding: "0 40px", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <Building2 size={22} strokeWidth={2} style={{ color: "#111111" }} />
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#111111", letterSpacing: "-0.3px" }}>CoSpace</span>
        </div>

        {/* Desktop nav */}
        <div className="landing-desktop-nav" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={href} href={href} style={{
              padding: "6px 16px", fontSize: "14px", color: "#6B7280", fontWeight: "400",
              textDecoration: "none", borderRadius: "8px", fontFamily: S.font,
              transition: "color 0.15s",
            }}
              onMouseEnter={e => e.target.style.color = "#111111"}
              onMouseLeave={e => e.target.style.color = "#6B7280"}
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="landing-desktop-actions" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={onLogin} style={{
            height: "38px", padding: "0 18px", borderRadius: "8px",
            border: "1px solid #D1D5DB", backgroundColor: "#FFFFFF",
            fontSize: "14px", fontWeight: "500", color: "#374151",
            cursor: "pointer", fontFamily: S.font, transition: "background-color 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F9FAFB"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FFFFFF"}
          >
            Đăng nhập
          </button>
          <button onClick={onRegister} style={{
            height: "38px", padding: "0 18px", borderRadius: "8px",
            border: "none", backgroundColor: "#111111",
            fontSize: "14px", fontWeight: "600", color: "#FFFFFF",
            cursor: "pointer", fontFamily: S.font, transition: "opacity 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Đăng ký miễn phí
          </button>
        </div>

        <button
          className="landing-mobile-toggle"
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="landing-mobile-menu">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={href} href={href} onClick={() => setMobileOpen(false)}>{label}</a>
          ))}
          <div>
            <button type="button" onClick={onLogin}>Đăng nhập</button>
            <button type="button" onClick={onRegister}>Đăng ký miễn phí</button>
          </div>
        </div>
      )}

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="landing-hero" style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 40px 64px" }}>
        <div className="landing-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>

          {/* Left text */}
          <div>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "5px 12px", borderRadius: "20px",
              backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE",
              marginBottom: "24px",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#3B82F6", display: "inline-block" }} />
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#2563EB" }}>
                500+ thành viên đang sử dụng
              </span>
            </div>

            <h1 style={{
              fontSize: "52px", fontWeight: "700", color: "#111111",
              lineHeight: 1.15, letterSpacing: "-1.5px", margin: "0 0 20px",
            }}>
              Không gian làm việc{" "}
              <span style={{ color: "#3B82F6" }}>lý tưởng</span>
              {" "}cho bạn
            </h1>

            <p style={{ fontSize: "17px", color: "#6B7280", lineHeight: 1.7, margin: "0 0 36px", maxWidth: "480px" }}>
              Đặt bàn làm việc chung, phòng họp hay văn phòng riêng chỉ trong vài giây.
              Linh hoạt theo giờ, không ràng buộc hợp đồng dài hạn.
            </p>

            {/* CTA row */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "36px" }}>
              <button onClick={enterProduct} style={{
                height: "48px", padding: "0 28px", borderRadius: "10px",
                backgroundColor: "#111111", color: "#FFFFFF",
                fontSize: "15px", fontWeight: "700", border: "none",
                cursor: "pointer", fontFamily: S.font, display: "flex", alignItems: "center", gap: "8px",
                transition: "opacity 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Đặt chỗ ngay
                <ArrowRight size={16} />
              </button>
              <button onClick={scrollToSpaces} style={{
                height: "48px", padding: "0 24px", borderRadius: "10px",
                backgroundColor: "#FFFFFF", color: "#111111",
                fontSize: "15px", fontWeight: "600",
                border: "1px solid #D1D5DB", cursor: "pointer", fontFamily: S.font,
                transition: "background-color 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#F9FAFB"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FFFFFF"}
              >
                Xem không gian
              </button>
            </div>

            {/* Trust */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ display: "flex" }}>
                {["T", "L", "A", "M", "N"].map((c, i) => (
                  <div key={i} style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    backgroundColor: ["#3B82F6", "#7C3AED", "#10B981", "#F59E0B", "#EF4444"][i],
                    color: "#FFFFFF", fontSize: "12px", fontWeight: "700",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginLeft: i === 0 ? "0" : "-8px",
                    border: "2px solid #FFFFFF",
                    zIndex: 5 - i,
                  }}>{c}</div>
                ))}
              </div>
              <span style={{ fontSize: "13px", color: "#6B7280" }}>
                Cùng <strong style={{ color: "#111111" }}>500+ thành viên</strong> tin dùng CoSpace
              </span>
            </div>
          </div>

          {/* Right — visual preview */}
          <div style={{ position: "relative" }}>
            {/* Main card */}
            <div style={{
              ...S.card,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            }}>
              <img
                src="https://images.unsplash.com/photo-1687945727613-a4d06cc41024?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=700"
                alt="Phòng họp CoSpace"
                style={{ width: "100%", height: "280px", objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <p style={{ fontSize: "16px", fontWeight: "700", color: "#111111", margin: 0 }}>Phòng họp A</p>
                    <p style={{ fontSize: "13px", color: "#6B7280", margin: "3px 0 0", display: "flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={12} style={{ color: "#9CA3AF" }} />
                      Tầng 3, Tòa nhà BMT, 32 Lê Duẩn
                    </p>
                  </div>
                  <span style={{
                    padding: "3px 10px", borderRadius: "6px",
                    backgroundColor: "#F5F3FF", color: "#7C3AED",
                    fontSize: "12px", fontWeight: "600",
                  }}>Phòng họp</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {["Wi-Fi", "Máy chiếu", "Điều hòa"].map(eq => {
                      const Icon = EQUIP_ICONS[eq];
                      return (
                        <span key={eq} style={{
                          display: "inline-flex", alignItems: "center", gap: "3px",
                          padding: "3px 8px", backgroundColor: "#F3F4F6",
                          borderRadius: "5px", fontSize: "11px", color: "#6B7280",
                        }}>
                          <Icon size={10} />{eq}
                        </span>
                      );
                    })}
                  </div>
                  <span style={{ fontSize: "15px", fontWeight: "700", color: "#111111" }}>₫ 150.000/giờ</span>
                </div>
              </div>
            </div>

            {/* Floating badge — booking confirmed */}
            <div style={{
              position: "absolute", top: "16px", right: "-20px",
              ...S.card, padding: "12px 16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
              display: "flex", alignItems: "center", gap: "10px",
              minWidth: "200px",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "8px",
                backgroundColor: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <CheckCircle2 size={18} style={{ color: "#16A34A" }} />
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "700", color: "#111111", margin: 0 }}>Đặt chỗ thành công!</p>
                <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0" }}>14/06 · 09:00 – 12:00</p>
              </div>
            </div>

            {/* Floating badge — available spots */}
            <div style={{
              position: "absolute", bottom: "20px", left: "-20px",
              ...S.card, padding: "12px 16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "8px",
                backgroundColor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Users size={18} style={{ color: "#3B82F6" }} />
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "700", color: "#111111", margin: 0 }}>12 chỗ còn trống</p>
                <p style={{ fontSize: "11px", color: "#6B7280", margin: "2px 0 0" }}>Hôm nay tại CoSpace</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ═══════════════════════════════════════════════════════ */}
      <section className="landing-stats" style={{ backgroundColor: "#111827", padding: "32px 40px" }}>
        <div className="landing-stats-grid" style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "32px" }}>
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "8px", marginBottom: "4px",
              }}>
                <Icon size={18} style={{ color: "#9CA3AF" }} />
                <span style={{ fontSize: "28px", fontWeight: "700", color: "#FFFFFF", letterSpacing: "-0.5px" }}>{value}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════════════ */}
      <section id="features" className="landing-section landing-features" style={{ padding: "80px 40px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "#3B82F6", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>
            Tính năng
          </p>
          <h2 style={{ fontSize: "36px", fontWeight: "700", color: "#111111", letterSpacing: "-0.8px", margin: "0 0 14px" }}>
            Mọi thứ bạn cần trong một nền tảng
          </h2>
          <p style={{ fontSize: "16px", color: "#6B7280", maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>
            CoSpace được thiết kế để việc tìm và đặt không gian làm việc trở nên đơn giản nhất có thể.
          </p>
        </div>

        <div className="landing-features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {FEATURES.map(({ icon: Icon, bg, color, title, desc }) => (
            <div key={title} style={{ ...S.card, padding: "24px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "10px",
                backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "16px",
              }}>
                <Icon size={20} style={{ color }} />
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111111", margin: "0 0 8px" }}>{title}</h3>
              <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SPACE TYPES ════════════════════════════════════════════════════ */}
      <section id="spaces" className="landing-section landing-spaces" style={{ backgroundColor: "#F3F4F6", padding: "80px 40px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#3B82F6", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>
              Không gian
            </p>
            <h2 style={{ fontSize: "36px", fontWeight: "700", color: "#111111", letterSpacing: "-0.8px", margin: "0 0 14px" }}>
              Chọn không gian phù hợp với bạn
            </h2>
            <p style={{ fontSize: "16px", color: "#6B7280", maxWidth: "480px", margin: "0 auto" }}>
              Từ bàn làm việc cá nhân đến phòng họp và văn phòng riêng — đáp ứng mọi nhu cầu làm việc.
            </p>
          </div>

          <div className="landing-spaces-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {SPACE_TYPES.map(({ type, typeColor, typeBg, price, capacity, desc, equipment, image, popular }) => (
              <div key={type} style={{
                ...S.card, overflow: "hidden",
                border: popular ? "2px solid #3B82F6" : "1px solid #E5E7EB",
                position: "relative",
              }}>
                {popular && (
                  <div style={{
                    position: "absolute", top: "12px", right: "12px", zIndex: 2,
                    backgroundColor: "#3B82F6", color: "#FFFFFF",
                    fontSize: "11px", fontWeight: "700", padding: "4px 10px",
                    borderRadius: "20px",
                  }}>
                    Phổ biến nhất
                  </div>
                )}
                <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                  <img src={image} alt={workspaceTypeLabel(type as Workspace["type"])} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{
                    position: "absolute", bottom: "10px", left: "10px",
                    backgroundColor: typeColor, color: "#FFFFFF",
                    fontSize: "12px", fontWeight: "600", padding: "4px 10px", borderRadius: "6px",
                  }}>
                    {workspaceTypeLabel(type as Workspace["type"])}
                  </span>
                </div>
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
                    <p style={{ fontSize: "16px", fontWeight: "700", color: "#111111", margin: 0 }}>{workspaceTypeLabel(type as Workspace["type"])}</p>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "18px", fontWeight: "700", color: "#111111" }}>₫ {vnd(price)}</span>
                      <span style={{ fontSize: "12px", color: "#9CA3AF" }}>/giờ</span>
                    </div>
                  </div>
                  <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.55, margin: "0 0 14px" }}>{desc}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "14px" }}>
                    <Users size={13} style={{ color: "#9CA3AF" }} />
                    <span style={{ fontSize: "13px", color: "#6B7280" }}>Sức chứa: {capacity} người</span>
                  </div>
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "16px" }}>
                    {equipment.map(eq => {
                      const Icon = EQUIP_ICONS[eq];
                      return (
                        <span key={eq} style={{
                          display: "inline-flex", alignItems: "center", gap: "3px",
                          padding: "3px 8px", backgroundColor: "#F3F4F6",
                          borderRadius: "5px", fontSize: "11px", color: "#6B7280",
                        }}>
                          <Icon size={10} />{eq}
                        </span>
                      );
                    })}
                  </div>
                  <button onClick={enterProduct} style={{
                    width: "100%", height: "40px", borderRadius: "8px",
                    backgroundColor: popular ? "#111111" : "#FFFFFF",
                    color: popular ? "#FFFFFF" : "#111111",
                    fontSize: "14px", fontWeight: "600",
                    border: popular ? "none" : "1.5px solid #111111",
                    cursor: "pointer", fontFamily: S.font,
                    transition: "all 0.15s",
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = "#111111";
                      e.currentTarget.style.color = "#FFFFFF";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = popular ? "#111111" : "#FFFFFF";
                      e.currentTarget.style.color = popular ? "#FFFFFF" : "#111111";
                    }}
                  >
                    Đặt ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════════════ */}
      <section className="landing-section landing-process" style={{ padding: "80px 40px", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "#3B82F6", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>
            Quy trình
          </p>
          <h2 style={{ fontSize: "36px", fontWeight: "700", color: "#111111", letterSpacing: "-0.8px", margin: 0 }}>
            Chỉ 4 bước đơn giản
          </h2>
        </div>

        <div className="landing-steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", position: "relative" }}>
          {/* Connector line */}
          <div style={{
            position: "absolute", top: "28px", left: "12.5%", right: "12.5%",
            height: "2px", backgroundColor: "#E5E7EB", zIndex: 0,
          }}>
            <div style={{ width: "25%", height: "100%", backgroundColor: "#3B82F6" }} />
          </div>

          {STEPS.map(({ num, title, desc }, i) => (
            <div key={num} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "50%",
                backgroundColor: i === 0 ? "#111111" : "#FFFFFF",
                border: `2px solid ${i === 0 ? "#111111" : "#E5E7EB"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
                color: i === 0 ? "#FFFFFF" : "#6B7280",
                fontSize: "15px", fontWeight: "700",
              }}>
                {num}
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#111111", margin: "0 0 8px" }}>{title}</h3>
              <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════════════ */}
      <section className="landing-section landing-testimonials" style={{ backgroundColor: "#111827", padding: "80px 40px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#60A5FA", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>
              Đánh giá
            </p>
            <h2 style={{ fontSize: "36px", fontWeight: "700", color: "#FFFFFF", letterSpacing: "-0.8px", margin: 0 }}>
              Thành viên nói gì về CoSpace
            </h2>
          </div>

          <div className="landing-testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {TESTIMONIALS.map(({ name, role, init, text, stars }) => (
              <div key={name} style={{
                backgroundColor: "#1F2937", border: "1px solid #374151",
                borderRadius: "12px", padding: "24px",
              }}>
                {/* Stars */}
                <div style={{ display: "flex", gap: "3px", marginBottom: "16px" }}>
                  {Array(stars).fill(0).map((_, i) => (
                    <Star key={i} size={14} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                  ))}
                </div>
                <p style={{ fontSize: "14px", color: "#D1D5DB", lineHeight: 1.65, margin: "0 0 20px", fontStyle: "italic" }}>
                  "{text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    backgroundColor: "#3B82F6", color: "#FFFFFF",
                    fontSize: "14px", fontWeight: "700",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {init}
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "700", color: "#FFFFFF", margin: 0 }}>{name}</p>
                    <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING HIGHLIGHT ═══════════════════════════════════════════════ */}
      <section id="pricing" className="landing-section landing-pricing" style={{ padding: "80px 40px", maxWidth: "1280px", margin: "0 auto" }}>
        <div className="landing-pricing-card" style={{ ...S.card, padding: "48px", textAlign: "center", backgroundColor: "#FAFAFA", border: "1px solid #E5E7EB" }}>
          <p style={{ fontSize: "13px", fontWeight: "600", color: "#3B82F6", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
            Giá cả minh bạch
          </p>
          <h2 style={{ fontSize: "34px", fontWeight: "700", color: "#111111", letterSpacing: "-0.8px", margin: "0 0 16px" }}>
            Chỉ trả cho thời gian bạn dùng
          </h2>
          <p style={{ fontSize: "16px", color: "#6B7280", maxWidth: "460px", margin: "0 auto 40px", lineHeight: 1.6 }}>
            Không có phí ẩn, không cần ký hợp đồng dài hạn. Thanh toán theo giờ, linh hoạt hoàn toàn.
          </p>

          <div className="landing-pricing-grid" style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
            {[
              { type: "Hot Desk", price: 50_000, color: "#3B82F6", bg: "#EFF6FF" },
              { type: "Meeting Room", price: 120_000, color: "#7C3AED", bg: "#F5F3FF" },
              { type: "Private Office", price: 200_000, color: "#D97706", bg: "#FFFBEB" },
            ].map(({ type, price, color, bg }) => (
              <div key={type} style={{
                ...S.card, padding: "20px 28px", textAlign: "center", minWidth: "180px",
              }}>
                <span style={{
                  display: "inline-block", padding: "4px 12px", borderRadius: "6px",
                  backgroundColor: bg, color, fontSize: "12px", fontWeight: "600",
                  marginBottom: "12px",
                }}>
                  {workspaceTypeLabel(type as Workspace["type"])}
                </span>
                <p style={{ fontSize: "28px", fontWeight: "700", color: "#111111", margin: "0 0 2px", letterSpacing: "-0.5px" }}>
                  ₫ {vnd(price)}
                </p>
                <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>/ giờ</p>
              </div>
            ))}
          </div>

          <div className="landing-pricing-notes" style={{ marginTop: "36px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            {["Không phí ẩn", "Thanh toán linh hoạt", "Hủy bất cứ lúc nào"].map((txt, i) => (
              <span key={txt} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "#6B7280", marginLeft: i > 0 ? "16px" : "0" }}>
                <CheckCircle2 size={14} style={{ color: "#10B981" }} />
                {txt}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══════════════════════════════════════════════════════ */}
      <section className="landing-cta" style={{ backgroundColor: "#111111", padding: "80px 40px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "40px", fontWeight: "700", color: "#FFFFFF", letterSpacing: "-1px", margin: "0 0 16px", lineHeight: 1.2 }}>
            Sẵn sàng làm việc hiệu quả hơn?
          </h2>
          <p style={{ fontSize: "16px", color: "#9CA3AF", margin: "0 0 36px", lineHeight: 1.6 }}>
            Tham gia cùng 500+ thành viên đang tận hưởng không gian làm việc linh hoạt tại CoSpace.
            Đăng ký miễn phí, bắt đầu ngay hôm nay.
          </p>
          <div className="landing-cta-actions" style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button onClick={user ? enterProduct : onRegister} style={{
              height: "50px", padding: "0 32px", borderRadius: "10px",
              backgroundColor: "#3B82F6", color: "#FFFFFF",
              fontSize: "15px", fontWeight: "700", border: "none",
              cursor: "pointer", fontFamily: S.font,
              display: "flex", alignItems: "center", gap: "8px",
              transition: "opacity 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              {user
                ? user.role === "admin"
                  ? "Vào trang quản trị"
                  : "Vào khu đặt chỗ"
                : "Đăng ký miễn phí"}
              <ArrowRight size={16} />
            </button>
            <button onClick={scrollToSpaces} style={{
              height: "50px", padding: "0 28px", borderRadius: "10px",
              backgroundColor: "transparent", color: "#FFFFFF",
              fontSize: "15px", fontWeight: "600",
              border: "1px solid rgba(255,255,255,0.3)",
              cursor: "pointer", fontFamily: S.font,
              transition: "border-color 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"}
            >
              Xem không gian
            </button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer id="contact" className="landing-footer" style={{ backgroundColor: "#111827", borderTop: "1px solid #1F2937", padding: "48px 40px 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="landing-footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "40px" }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <Building2 size={20} style={{ color: "#FFFFFF" }} />
                <span style={{ fontSize: "18px", fontWeight: "700", color: "#FFFFFF" }}>CoSpace</span>
              </div>
              <p style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: 1.6, margin: "0 0 16px", maxWidth: "240px" }}>
                Nền tảng đặt chỗ không gian làm việc linh hoạt, chuyên nghiệp tại Hà Nội.
              </p>
              <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
                📍 32 Lê Duẩn, Q.Hai Bà Trưng, Hà Nội
              </p>
            </div>

            {/* Links */}
            {[
              { title: "Sản phẩm", links: ["Tính năng", "Không gian", "Giá cả", "Tài liệu API"] },
              { title: "Công ty", links: ["Về chúng tôi", "Blog", "Tuyển dụng", "Liên hệ"] },
              { title: "Hỗ trợ", links: ["Trung tâm trợ giúp", "Điều khoản", "Bảo mật", "Tùy chọn cookie"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p style={{ fontSize: "13px", fontWeight: "700", color: "#FFFFFF", marginBottom: "14px" }}>{title}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {links.map(l => (
                    <a key={l} href="#" style={{
                      fontSize: "13px", color: "#9CA3AF", textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                      onMouseEnter={e => e.target.style.color = "#FFFFFF"}
                      onMouseLeave={e => e.target.style.color = "#9CA3AF"}
                    >
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="landing-footer-bottom" style={{ borderTop: "1px solid #374151", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
              © 2026 CoSpace. Bảo lưu mọi quyền.
            </p>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
              Giờ mở cửa: Thứ 2 – CN · 07:00 – 22:00
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
