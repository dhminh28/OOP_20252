Design for DESKTOP WEB browser, minimum 1280px wide viewport.
NOT a mobile app. Full width layout like a SaaS website.

Design an admin dashboard for "CoSpace" app.
Style: DM Sans font, #F9FAFB background, white cards, 8px radius. 
NO gradients.

LAYOUT: Fixed dark sidebar 240px left + main content right.

═══ SIDEBAR (#111827 dark, full height) ═══
Top 24px padding:
  Building icon white + "CoSpace" 18px bold white
  "Quản trị viên" 12px #9CA3AF below
Divider #374151 mt-16.

NAV ITEMS (44px height each, 12px 16px padding, 8px radius, gap 4px):
  ■ Tổng quan — active: #1F2937 bg, white text, blue left border 3px
  ○ Không gian — #9CA3AF text
  ○ Đặt chỗ — #9CA3AF text  
  ○ Thành viên — #9CA3AF text
  ○ Báo cáo — #9CA3AF text
  ○ Cài đặt — #9CA3AF text
Each item: icon 18px left + label 14px.

Bottom sidebar (absolute bottom 24px):
  Avatar 36px blue "A" + right: "Admin" 14px white bold / 
  "admin@cospace.vn" 12px #9CA3AF
  Logout icon far right #9CA3AF.

═══ MAIN CONTENT ═══

TOP BAR (white, border-bottom #E5E7EB, 64px, padding 0 24px):
Left: "Tổng quan" 22px bold #111
Right: bell icon (red dot) | "14/05/2026" date chip border #E5E7EB | 
"Xin chào, Admin 👋" 14px #6B7280

═══ KPI CARDS (4 columns, gap 16px, padding 24px) ═══
Each: white, border #E5E7EB, 8px radius, 20px padding.

Card 1 — blue theme:
  Top row: "Doanh thu tháng 5" 13px #6B7280 | 
  blue square icon bg #EFF6FF right
  "₫ 12.400.000" 26px bold #111 mt-8
  "↑ 18% so với tháng trước" 12px #10B981

Card 2 — purple theme:
  "Tổng đặt chỗ" 13px gray | purple icon bg #F5F3FF
  "134" 26px bold
  "↑ 9% so với tháng trước" 12px green

Card 3 — green theme:
  "Thành viên hoạt động" 13px gray | green icon bg #F0FDF4
  "47" 26px bold
  "↑ 5 thành viên mới" 12px green

Card 4 — amber theme:
  "Tỉ lệ lấp đầy" 13px gray | amber icon bg #FFFBEB
  "73%" 26px bold
  "↔ Ổn định" 12px #F59E0B

═══ TWO COLUMN ROW (gap 20px, padding 0 24px) ═══

LEFT 60% — REVENUE CHART CARD:
White, border, 8px radius, 20px padding.
Header: "Doanh thu 6 tháng gần nhất" 15px bold | 
"Xem chi tiết →" 13px #3B82F6 right.

Bar chart (clean, minimal):
Y-axis labels left: 0 | 5tr | 10tr | 15tr — 12px #9CA3AF
Horizontal gridlines #F3F4F6 dashed.
6 bars (48px wide, 8px top radius, #3B82F6):
  T12=8tr | T1=6tr | T2=10tr | T3=7tr | T4=11tr | T5=12.4tr(tallest)
X-axis labels below: T12 T1 T2 T3 T4 T5 — 12px #6B7280
Tooltip floating on T5: white card shadow "Tháng 5: ₫ 12.400.000"

RIGHT 40% — RECENT BOOKINGS:
White, border, 8px radius, 20px padding.
Header: "Đặt chỗ gần đây" 15px bold | "Xem tất cả →" blue right.

Table (row dividers #F3F4F6, no outer border):
Header row: Thành viên | Phòng | Thời gian | Trạng thái | Số tiền
13px #6B7280 header, 14px #111 data.

5 data rows:
1. Nguyễn Văn A | Phòng họp A | 14/05 09:00–12:00 | 
   ● Confirmed #DCFCE7 bg #16A34A text | ₫ 405.000
2. Trần Thị B | Desk 101 | 14/05 08:00–10:00 | 
   ● Confirmed green | ₫ 100.000
3. Lê Văn C | VP Riêng 01 | 13/05 13:00–17:00 | 
   ● Confirmed green | ₫ 720.000
4. Phạm Văn D | Phòng họp B | 13/05 10:00–12:00 | 
   ● Cancelled #FEE2E2 bg #DC2626 text | ₫ 300.000
5. Hoàng Thị E | Desk 102 | 12/05 09:00–11:00 | 
   ● Pending #FEF9C3 bg #CA8A04 text | ₫ 100.000

Pagination: "‹ 1 2 3 ›" right aligned 13px mt-12.

═══ WORKSPACE MANAGEMENT (padding 0 24px 24px) ═══
White card, border, 8px radius, 20px padding.
Header row: "Quản lý không gian" 15px bold | 
"+ Thêm phòng" right (black bg #111 white text 13px 36px height 8px radius).

Table columns: 
Tên phòng | Loại | Địa chỉ | Sức chứa | Giá/giờ | Trạng thái | Thao tác
Header 13px #6B7280. Data 14px #111. Row dividers #F3F4F6.

4 rows:
1. Phòng họp A | Meeting Room purple pill | 
   Tầng 3, Tòa nhà BMT, 32 Lê Duẩn | 8 người | ₫ 150.000 | 
   Còn trống green pill | ✏ 🗑 icon buttons
2. Desk 101 | Hot Desk blue pill | 
   Tầng 2, Tòa nhà BMT, 32 Lê Duẩn | 1 người | ₫ 50.000 | 
   Còn trống green | ✏ 🗑
3. VP Riêng 01 | Private Office amber pill | 
   Tầng 4, Tòa nhà BMT, 32 Lê Duẩn | 4 người | ₫ 200.000 | 
   Còn trống green | ✏ 🗑
4. Phòng họp B | Meeting Room purple pill | 
   Tầng 3, Tòa nhà BMT, 32 Lê Duẩn | 6 người | ₫ 120.000 | 
   Bảo trì gray pill | ✏ 🗑

═══ ADD ROOM MODAL (show floating over page) ═══
Overlay dark bg 40% opacity behind.
White card 580px centered, 16px radius, 28px padding, shadow.

Header: "Thêm không gian mới" 18px bold | X close button right.
Divider mt-16.

FORM (2 col grid gap 16px):
Row 1 full width: 
  "Tên phòng" → input placeholder "VD: Phòng họp A"

Row 2 two cols:
  "Loại không gian" → dropdown showing "Meeting Room" selected
  "Sức chứa (người)" → number input "8"

Row 3 two cols:
  "Giá/giờ (₫)" → input "150000"
  "Tầng" → input "3"

Row 4 two cols:
  "Tên tòa nhà" → input "Tòa nhà BMT"
  "Địa chỉ đường" → input "32 Lê Duẩn"

Row 5 two cols:
  "Quận/Huyện" → input "Hai Bà Trưng"
  "Thành phố" → input "Hà Nội"

Row 6 two cols:
  "Giờ mở cửa" → "07:00" đến "22:00" (two small inputs + "đến" label)
  "Trạng thái" → dropdown "Còn trống"

Row 7 full width:
  "Thiết bị có sẵn" label
  Checkbox grid 3 cols:
  ☑ WiFi  ☑ Máy chiếu  ☑ Điều hòa
  ☑ Bảng trắng  ☐ TV  ☐ Máy in

Row 8 full width:
  "Mô tả" → textarea 3 rows 
  placeholder "Mô tả tiện ích, vị trí, đặc điểm nổi bật..."

Row 9 full width:
  Upload box dashed border #D1D5DB, 80px height, 8px radius, center:
  "📷 Kéo thả ảnh hoặc click để chọn" 13px #6B7280

Modal footer divider + buttons right:
"Hủy" outlined border #D1D5DB 36px | 
"Tạo phòng" black bg white text 36px 8px radius.