<template>
  <div class="dashboard-container py-3">
    <!-- Welcome Banner -->
    <div class="welcome-banner p-4 mb-4 rounded-lg shadow-sm text-white d-flex flex-column flex-md-row justify-content-between align-items-md-center">
      <div>
        <h2 class="h4 font-weight-bold mb-1">
          <i class="fas fa-school mr-2"></i> Hệ Thống Điều Hành Mầm Non Ngọc Hoàng
        </h2>
        <p class="mb-0 text-white-50">
          Xin chào, <strong>{{ currentUser ? (currentUser.name || currentUser.username) : 'Thầy/Cô' }}</strong>! Chúc bạn một ngày làm việc hiệu quả.
        </p>
      </div>
      <div class="mt-3 mt-md-0 d-flex align-items-center">
        <span class="badge badge-light text-primary px-3 py-2 font-weight-bold shadow-sm">
          <i class="far fa-calendar-alt mr-1"></i> {{ currentDateText }}
        </span>
      </div>
    </div>

    <!-- 1. Cụm dành cho Giáo Viên (Nếu chỉ có role Giáo Viên) -->
    <div v-if="checkRole(['giao-vien']) && !checkRole(['quan-tri-vien', 'ke-toan', 'hieu-truong', 'hieu-pho'])" class="section-group mb-4">
      <h3 class="section-title mb-3">
        <i class="fas fa-chalkboard-teacher text-primary mr-2"></i> Nghiệp Vụ Lớp Học
      </h3>
      <div class="row">
        <div class="col-md-6 col-lg-3 mb-3">
          <div class="feature-card shadow-sm h-100 p-3" @click="$router.push('/dihoc')">
            <div class="card-icon bg-success-light text-success mb-3">
              <i class="fas fa-calendar-check"></i>
            </div>
            <h4 class="card-title font-weight-bold mb-1">Điểm danh hàng ngày</h4>
            <p class="card-desc text-muted mb-0">Ghi nhận bé đi học, ăn sáng, ăn trưa</p>
            <span class="badge badge-success mt-2">Hàng ngày</span>
          </div>
        </div>

        <div class="col-md-6 col-lg-3 mb-3">
          <div class="feature-card shadow-sm h-100 p-3" @click="$router.push('/vetre')">
            <div class="card-icon bg-warning-light text-warning mb-3">
              <i class="fas fa-business-time"></i>
            </div>
            <h4 class="card-title font-weight-bold mb-1">Về trễ sau 17h</h4>
            <p class="card-desc text-muted mb-0">Chấm giờ trả trẻ muộn sau giờ quy định</p>
            <span class="badge badge-warning text-dark mt-2">Theo dõi</span>
          </div>
        </div>

        <div class="col-md-6 col-lg-3 mb-3">
          <div class="feature-card shadow-sm h-100 p-3" @click="$router.push('/anchieu')">
            <div class="card-icon bg-info-light text-info mb-3">
              <i class="fas fa-utensils"></i>
            </div>
            <h4 class="card-title font-weight-bold mb-1">Suất ăn chiều</h4>
            <p class="card-desc text-muted mb-0">Ghi nhận bé đăng ký ăn phụ xế chiều</p>
            <span class="badge badge-info mt-2">Ăn uống</span>
          </div>
        </div>

        <div class="col-md-6 col-lg-3 mb-3">
          <div class="feature-card shadow-sm h-100 p-3" @click="$router.push('/hocsinh')">
            <div class="card-icon bg-primary-light text-primary mb-3">
              <i class="fas fa-user-graduate"></i>
            </div>
            <h4 class="card-title font-weight-bold mb-1">Thông tin học sinh</h4>
            <p class="card-desc text-muted mb-0">Danh sách và thông tin liên hệ các bé</p>
            <span class="badge badge-primary mt-2">Hồ sơ</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Cụm dành cho Ban Giám Hiệu, Kế Toán, Quản Trị Viên -->
    <div v-if="checkRole(['quan-tri-vien', 'ke-toan', 'hieu-truong', 'hieu-pho'])">
      <!-- Group 1: Quản lý Học sinh & Giảng dạy -->
      <div class="section-group mb-4">
        <h3 class="section-title mb-3">
          <i class="fas fa-user-graduate text-primary mr-2"></i> Học Sinh & Giảng Dạy
        </h3>
        <div class="row">
          <div class="col-md-6 col-lg-3 mb-3">
            <div class="feature-card shadow-sm h-100 p-3" @click="$router.push('/hocsinhv2')">
              <div class="card-icon bg-primary-light text-primary mb-3">
                <i class="fas fa-users-cog"></i>
              </div>
              <h4 class="card-title font-weight-bold mb-1">Quản lý học sinh</h4>
              <p class="card-desc text-muted mb-0">Hồ sơ bé, phân lớp, trạng thái biểu phí</p>
              <span class="badge badge-primary mt-2">Trọng tâm</span>
            </div>
          </div>

          <div class="col-md-6 col-lg-3 mb-3">
            <div class="feature-card shadow-sm h-100 p-3" @click="$router.push('/giaovien')">
              <div class="card-icon bg-info-light text-info mb-3">
                <i class="fas fa-chalkboard-teacher"></i>
              </div>
              <h4 class="card-title font-weight-bold mb-1">Quản lý giáo viên</h4>
              <p class="card-desc text-muted mb-0">Danh sách nhân sự, phân công chủ nhiệm</p>
              <span class="badge badge-info mt-2">Nhân sự</span>
            </div>
          </div>

          <div class="col-md-6 col-lg-3 mb-3">
            <div class="feature-card shadow-sm h-100 p-3" @click="$router.push('/diemdanhtonghop')">
              <div class="card-icon bg-success-light text-success mb-3">
                <i class="fas fa-calendar-alt"></i>
              </div>
              <h4 class="card-title font-weight-bold mb-1">Điểm danh tổng tháng</h4>
              <p class="card-desc text-muted mb-0">Bảng theo dõi chuyên cần toàn trường</p>
              <span class="badge badge-success mt-2">Báo cáo tháng</span>
            </div>
          </div>

          <div class="col-md-6 col-lg-3 mb-3">
            <div class="feature-card shadow-sm h-100 p-3" @click="$router.push('/vetre/18g')">
              <div class="card-icon bg-warning-light text-warning mb-3">
                <i class="fas fa-clock"></i>
              </div>
              <h4 class="card-title font-weight-bold mb-1">Về trễ sau 18 giờ</h4>
              <p class="card-desc text-muted mb-0">Tổng hợp danh sách các bé đón trễ</p>
              <span class="badge badge-warning text-dark mt-2">Theo dõi</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Group 2: Tài chính & Kế toán -->
      <div class="section-group mb-4">
        <h3 class="section-title mb-3">
          <i class="fas fa-wallet text-success mr-2"></i> Tài Chính & Thu Phí
        </h3>
        <div class="row">
          <div class="col-md-6 col-lg-3 mb-3">
            <div class="feature-card shadow-sm h-100 p-3 border-success-subtle highlight-card" @click="$router.push('/dongtien')">
              <div class="card-icon bg-success text-white mb-3 shadow-sm">
                <i class="fas fa-exchange-alt"></i>
              </div>
              <h4 class="card-title font-weight-bold mb-1 text-success">Dòng tiền & Gạch nợ</h4>
              <p class="card-desc text-muted mb-0">Đối soát giao dịch ngân hàng ACB, gạch nợ học phí tự động</p>
              <span class="badge badge-success mt-2">Mới v2.0.1</span>
            </div>
          </div>

          <div class="col-md-6 col-lg-3 mb-3">
            <div class="feature-card shadow-sm h-100 p-3" @click="$router.push('/hoadon')">
              <div class="card-icon bg-primary-light text-primary mb-3">
                <i class="fas fa-file-invoice-dollar"></i>
              </div>
              <h4 class="card-title font-weight-bold mb-1">Hoá đơn & Học phí</h4>
              <p class="card-desc text-muted mb-0">Tạo hoá đơn định kỳ, xuất phiếu thu</p>
              <span class="badge badge-primary mt-2">Học phí</span>
            </div>
          </div>

          <div class="col-md-6 col-lg-3 mb-3">
            <div class="feature-card shadow-sm h-100 p-3" @click="$router.push('/no')">
              <div class="card-icon bg-secondary-light text-secondary mb-3">
                <i class="fas fa-user-friends"></i>
              </div>
              <h4 class="card-title font-weight-bold mb-1">Phụ huynh & Công nợ</h4>
              <p class="card-desc text-muted mb-0">Tra cứu số dư ví, danh sách nợ đọng</p>
              <span class="badge badge-secondary mt-2">Công nợ</span>
            </div>
          </div>

          <div class="col-md-6 col-lg-3 mb-3">
            <div class="feature-card shadow-sm h-100 p-3" @click="$router.push(`/ketso/${getDateKetSo()}`)">
              <div class="card-icon bg-purple-light text-purple mb-3">
                <i class="fas fa-balance-scale"></i>
              </div>
              <h4 class="card-title font-weight-bold mb-1">Kết sổ hàng tháng</h4>
              <p class="card-desc text-muted mb-0">Chốt số liệu, hoàn tiền ăn, chốt nợ</p>
              <span class="badge badge-dark mt-2">Định kỳ</span>
            </div>
          </div>

          <div class="col-md-6 col-lg-3 mb-3">
            <div class="feature-card shadow-sm h-100 p-3" @click="$router.push('/phieuthu')">
              <div class="card-icon bg-info-light text-info mb-3">
                <i class="fas fa-receipt"></i>
              </div>
              <h4 class="card-title font-weight-bold mb-1">Phiếu thu/chi ngày</h4>
              <p class="card-desc text-muted mb-0">Báo cáo thu tiền mặt, xuất file Excel</p>
              <span class="badge badge-info mt-2">Sổ quỹ</span>
            </div>
          </div>

          <div class="col-md-6 col-lg-3 mb-3">
            <div class="feature-card shadow-sm h-100 p-3" @click="$router.push('/sanpham')">
              <div class="card-icon bg-warning-light text-warning mb-3">
                <i class="fas fa-tshirt"></i>
              </div>
              <h4 class="card-title font-weight-bold mb-1">Bán hàng & Dịch vụ</h4>
              <p class="card-desc text-muted mb-0">Quản lý đồng phục, balo, học cụ</p>
              <span class="badge badge-warning text-dark mt-2">Sản phẩm</span>
            </div>
          </div>

          <div class="col-md-6 col-lg-3 mb-3">
            <div class="feature-card shadow-sm h-100 p-3" @click="$router.push('/baocao')">
              <div class="card-icon bg-success-light text-success mb-3">
                <i class="fas fa-chart-line"></i>
              </div>
              <h4 class="card-title font-weight-bold mb-1">Báo cáo tổng hợp</h4>
              <p class="card-desc text-muted mb-0">Thống kê doanh thu, chi phí, học sinh</p>
              <span class="badge badge-success mt-2">Tổng hợp</span>
            </div>
          </div>

          <div class="col-md-6 col-lg-3 mb-3">
            <div class="feature-card shadow-sm h-100 p-3" @click="$router.push('/ketsonghihoc')">
              <div class="card-icon bg-danger-light text-danger mb-3">
                <i class="fas fa-user-minus"></i>
              </div>
              <h4 class="card-title font-weight-bold mb-1">Kết sổ nghỉ học</h4>
              <p class="card-desc text-muted mb-0">Quyết toán học phí cho bé thôi học</p>
              <span class="badge badge-danger mt-2">Thôi học</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Group 3: Truyền thông & Quản trị -->
      <div class="section-group mb-4">
        <h3 class="section-title mb-3">
          <i class="fas fa-cogs text-secondary mr-2"></i> Truyền Thông & Cài Đặt
        </h3>
        <div class="row">
          <div class="col-md-6 col-lg-3 mb-3">
            <div class="feature-card shadow-sm h-100 p-3" @click="$router.push('/thongbao')">
              <div class="card-icon bg-warning-light text-warning mb-3">
                <i class="fas fa-bullhorn"></i>
              </div>
              <h4 class="card-title font-weight-bold mb-1">Thông báo phụ huynh</h4>
              <p class="card-desc text-muted mb-0">Đăng tin tức, lịch nghỉ, nhắc học phí</p>
              <span class="badge badge-warning text-dark mt-2">Mới v2.0.1</span>
            </div>
          </div>

          <div class="col-md-6 col-lg-3 mb-3">
            <div class="feature-card shadow-sm h-100 p-3" @click="$router.push('/setup')">
              <div class="card-icon bg-secondary-light text-secondary mb-3">
                <i class="fas fa-sliders-h"></i>
              </div>
              <h4 class="card-title font-weight-bold mb-1">Cài đặt hệ thống</h4>
              <p class="card-desc text-muted mb-0">Thiết lập biểu phí, danh mục lớp, cấu hình</p>
              <span class="badge badge-secondary mt-2">Cấu hình</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "app",
  data() {
    return {};
  },
  computed: {
    currentUser() {
      return this.$store.state.user.user || (this.$store.$auth && this.$store.$auth.$state.user) || null;
    },
    roles() {
      return this.$store.state.user.roles || [];
    },
    currentDateText() {
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const now = new Date();
      const dayName = days[now.getDay()];
      const d = String(now.getDate()).padStart(2, '0');
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const y = now.getFullYear();
      return `${dayName}, ${d}/${m}/${y}`;
    }
  },
  methods: {
    getDateKetSo() {
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const d1 = new Date(firstDay - 1000);
      let a = "00" + (d1.getMonth() + 1).toString();
      a = a.substring(a.length - 2, a.length);
      return `${d1.getFullYear()}/${a}`;
    },
    checkRole(slugs) {
      if (!this.roles || !this.roles.length) return false;
      return this.roles.some((e1) => slugs.includes(e1));
    }
  },
  mounted() {
    if (this.$store.$auth && this.$store.$auth.$state.loggedIn) {
      this.$store.dispatch("user/getRole");
    } else if (this.$route.path !== "/login") {
      location.href = "/login";
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-banner {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  border-radius: 12px;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
}

.feature-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #edf2f7;
  cursor: pointer;
  transition: all 0.22s ease-in-out;
  display: flex;
  flex-direction: column;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08) !important;
  border-color: #cbd5e0;
}

.highlight-card {
  background: #f8fff9;
  border-color: #8ce99a;
}

.card-icon {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.card-title {
  font-size: 1rem;
  color: #1a202c;
}

.card-desc {
  font-size: 0.82rem;
  line-height: 1.35;
  flex-grow: 1;
}

/* Theme light background colors for icons */
.bg-primary-light {
  background-color: rgba(13, 110, 253, 0.12);
}
.bg-success-light {
  background-color: rgba(25, 135, 84, 0.12);
}
.bg-warning-light {
  background-color: rgba(255, 193, 7, 0.18);
}
.bg-info-light {
  background-color: rgba(13, 202, 240, 0.15);
}
.bg-secondary-light {
  background-color: rgba(108, 117, 125, 0.12);
}
.bg-danger-light {
  background-color: rgba(220, 53, 69, 0.12);
}
.bg-purple-light {
  background-color: rgba(111, 66, 193, 0.12);
}
.text-purple {
  color: #6f42c1;
}
</style>
