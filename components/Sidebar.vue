<template>
  <div>
    <!-- Mobile Backdrop Overlay -->
    <div
      v-if="mobileOpen"
      class="sidebar-backdrop"
      @click="$emit('update:mobileOpen', false)"
    ></div>

    <!-- Main Sidebar Container -->
    <aside
      :class="[
        'sidebar-wrapper',
        { 'collapsed': collapsed },
        { 'mobile-open': mobileOpen }
      ]"
    >
      <!-- 1. Header: Brand Logo & Toggle -->
      <div class="sidebar-header d-flex align-items-center justify-content-between px-3 py-3 border-bottom">
        <nuxt-link to="/" class="sidebar-brand d-flex align-items-center text-decoration-none" @click.native="handleNavClick">
          <div class="brand-logo-icon mr-2 shadow-sm d-flex align-items-center justify-content-center">
            <i class="fas fa-graduation-cap text-white"></i>
          </div>
          <div v-if="!collapsed" class="brand-text">
            <span class="brand-name font-weight-bold text-dark">MN NGỌC HOÀNG</span>
            <span class="brand-desc text-muted">Quản trị nội bộ v2.0.2</span>
          </div>
        </nuxt-link>

        <button
          type="button"
          class="btn btn-sm btn-light toggle-btn d-none d-lg-flex align-items-center justify-content-center shadow-none border-0"
          :title="collapsed ? 'Mở rộng menu' : 'Thu gọn menu'"
          @click="toggleCollapse"
        >
          <i :class="collapsed ? 'fas fa-angle-right' : 'fas fa-angle-left'"></i>
        </button>

        <button
          type="button"
          class="btn btn-sm btn-light d-lg-none shadow-none border-0"
          @click="$emit('update:mobileOpen', false)"
        >
          <i class="fas fa-times text-secondary"></i>
        </button>
      </div>

      <!-- 2. Navigation Menu (Custom Slim Scroll) -->
      <div class="sidebar-nav custom-scroll py-2">
        <!-- GROUP 1: TỔNG QUAN -->
        <div class="nav-section-title px-3 pt-2 pb-1 text-muted" v-if="!collapsed">
          TỔNG QUAN
        </div>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <nuxt-link
              to="/"
              class="nav-link sidebar-item"
              exact-active-class="active"
              @click.native="handleNavClick"
              :title="collapsed ? 'Trang chủ' : ''"
            >
              <i class="fas fa-home nav-icon text-primary"></i>
              <span v-if="!collapsed" class="nav-text">Trang chủ</span>
            </nuxt-link>
          </li>
        </ul>

        <!-- GROUP 2: TÀI CHÍNH & KẾ TOÁN -->
        <div
          v-if="checkRole(['quan-tri-vien', 'ke-toan', 'hieu-truong', 'hieu-pho']) && !collapsed"
          class="nav-section-title px-3 pt-2 pb-1 text-muted"
        >
          TÀI CHÍNH & KẾ TOÁN
        </div>
        <ul
          v-if="checkRole(['quan-tri-vien', 'ke-toan', 'hieu-truong', 'hieu-pho'])"
          class="nav flex-column mb-2"
        >
          <li class="nav-item">
            <nuxt-link
              to="/dongtien"
              class="nav-link sidebar-item nav-item-highlight"
              active-class="active"
              @click.native="handleNavClick"
              :title="collapsed ? 'Sổ cái Dòng tiền & Gạch nợ' : ''"
            >
              <i class="fas fa-money-bill-wave nav-icon text-success"></i>
              <span v-if="!collapsed" class="nav-text font-weight-bold">Dòng tiền & Gạch nợ</span>
              <span v-if="!collapsed" class="badge badge-success badge-pill ml-auto font-weight-normal">Mới</span>
            </nuxt-link>
          </li>

          <li class="nav-item">
            <nuxt-link
              to="/no"
              class="nav-link sidebar-item"
              active-class="active"
              @click.native="handleNavClick"
              :title="collapsed ? 'Phụ huynh & Sổ nợ' : ''"
            >
              <i class="fas fa-user-friends nav-icon text-info"></i>
              <span v-if="!collapsed" class="nav-text">Phụ huynh & Sổ nợ</span>
            </nuxt-link>
          </li>

          <li class="nav-item">
            <nuxt-link
              to="/phieuthu"
              class="nav-link sidebar-item"
              active-class="active"
              @click.native="handleNavClick"
              :title="collapsed ? 'Phiếu thu/chi ngày' : ''"
            >
              <i class="fas fa-receipt nav-icon text-secondary"></i>
              <span v-if="!collapsed" class="nav-text">Phiếu thu/chi ngày</span>
            </nuxt-link>
          </li>

          <li class="nav-item">
            <nuxt-link
              to="/hoadon"
              class="nav-link sidebar-item"
              active-class="active"
              @click.native="handleNavClick"
              :title="collapsed ? 'Hoá đơn & Học phí' : ''"
            >
              <i class="fas fa-file-invoice-dollar nav-icon text-primary"></i>
              <span v-if="!collapsed" class="nav-text">Hoá đơn & Học phí</span>
            </nuxt-link>
          </li>

          <li class="nav-item">
            <a
              :href="`/ketso/${getDateKetSo()}`"
              class="nav-link sidebar-item"
              @click="handleNavClick"
              :title="collapsed ? 'Kết sổ tháng' : ''"
            >
              <i class="fas fa-calendar-alt nav-icon text-warning"></i>
              <span v-if="!collapsed" class="nav-text">Kết sổ tháng</span>
            </a>
          </li>
        </ul>

        <!-- GROUP 3: HỌC SINH & ĐIỂM DANH -->
        <div
          v-if="checkRole(['quan-tri-vien', 'hieu-truong', 'hieu-pho', 'ke-toan', 'giao-vien']) && !collapsed"
          class="nav-section-title px-3 pt-2 pb-1 text-muted"
        >
          HỌC SINH & LỚP HỌC
        </div>
        <ul
          v-if="checkRole(['quan-tri-vien', 'hieu-truong', 'hieu-pho', 'ke-toan', 'giao-vien'])"
          class="nav flex-column mb-2"
        >
          <li class="nav-item" v-if="checkRole(['quan-tri-vien', 'hieu-truong', 'hieu-pho', 'ke-toan'])">
            <nuxt-link
              to="/hocsinhv2"
              class="nav-link sidebar-item"
              active-class="active"
              @click.native="handleNavClick"
              :title="collapsed ? 'Danh sách học sinh' : ''"
            >
              <i class="fas fa-user-graduate nav-icon text-primary"></i>
              <span v-if="!collapsed" class="nav-text">Danh sách học sinh</span>
            </nuxt-link>
          </li>

          <li class="nav-item" v-if="checkRole(['giao-vien'])">
            <nuxt-link
              to="/hocsinh"
              class="nav-link sidebar-item"
              active-class="active"
              @click.native="handleNavClick"
              :title="collapsed ? 'Học sinh lớp tôi' : ''"
            >
              <i class="fas fa-user-graduate nav-icon text-primary"></i>
              <span v-if="!collapsed" class="nav-text">Học sinh lớp tôi</span>
            </nuxt-link>
          </li>

          <li class="nav-item">
            <nuxt-link
              to="/dihoc"
              class="nav-link sidebar-item"
              active-class="active"
              @click.native="handleNavClick"
              :title="collapsed ? 'Điểm danh hàng ngày' : ''"
            >
              <i class="fas fa-calendar-check nav-icon text-success"></i>
              <span v-if="!collapsed" class="nav-text">Điểm danh hàng ngày</span>
            </nuxt-link>
          </li>

          <li class="nav-item">
            <nuxt-link
              to="/vetre"
              class="nav-link sidebar-item"
              active-class="active"
              @click.native="handleNavClick"
              :title="collapsed ? 'Về trễ sau 17h' : ''"
            >
              <i class="fas fa-business-time nav-icon text-warning"></i>
              <span v-if="!collapsed" class="nav-text">Về trễ sau 17h</span>
            </nuxt-link>
          </li>

          <li class="nav-item">
            <nuxt-link
              to="/anchieu"
              class="nav-link sidebar-item"
              active-class="active"
              @click.native="handleNavClick"
              :title="collapsed ? 'Suất ăn chiều' : ''"
            >
              <i class="fas fa-utensils nav-icon text-info"></i>
              <span v-if="!collapsed" class="nav-text">Suất ăn chiều</span>
            </nuxt-link>
          </li>
        </ul>

        <!-- GROUP 4: VẬN HÀNH & HỆ THỐNG -->
        <div
          v-if="checkRole(['quan-tri-vien', 'hieu-truong', 'hieu-pho', 'ke-toan']) && !collapsed"
          class="nav-section-title px-3 pt-2 pb-1 text-muted"
        >
          HỆ THỐNG & BÁO CÁO
        </div>
        <ul
          v-if="checkRole(['quan-tri-vien', 'hieu-truong', 'hieu-pho', 'ke-toan'])"
          class="nav flex-column mb-2"
        >
          <li class="nav-item">
            <nuxt-link
              to="/thongbao"
              class="nav-link sidebar-item"
              active-class="active"
              @click.native="handleNavClick"
              :title="collapsed ? 'Thông báo phụ huynh' : ''"
            >
              <i class="fas fa-bullhorn nav-icon text-danger"></i>
              <span v-if="!collapsed" class="nav-text">Thông báo phụ huynh</span>
            </nuxt-link>
          </li>

          <li class="nav-item">
            <nuxt-link
              to="/baocao"
              class="nav-link sidebar-item"
              active-class="active"
              @click.native="handleNavClick"
              :title="collapsed ? 'Báo cáo & Thống kê' : ''"
            >
              <i class="fas fa-chart-line nav-icon text-primary"></i>
              <span v-if="!collapsed" class="nav-text">Báo cáo & Thống kê</span>
            </nuxt-link>
          </li>

          <li class="nav-item">
            <nuxt-link
              to="/setup"
              class="nav-link sidebar-item"
              active-class="active"
              @click.native="handleNavClick"
              :title="collapsed ? 'Cài đặt hệ thống' : ''"
            >
              <i class="fas fa-sliders-h nav-icon text-secondary"></i>
              <span v-if="!collapsed" class="nav-text">Cài đặt hệ thống</span>
            </nuxt-link>
          </li>
        </ul>
      </div>

      <!-- 3. Footer: User Profile & Logout -->
      <div class="sidebar-footer p-3 border-top bg-white">
        <div v-if="currentUser" class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center overflow-hidden mr-2">
            <div class="avatar-user bg-primary text-white font-weight-bold flex-shrink-0 mr-2">
              {{ (currentUser.name || currentUser.username || 'U').charAt(0).toUpperCase() }}
            </div>
            <div v-if="!collapsed" class="user-meta overflow-hidden">
              <div class="user-name font-weight-bold text-dark text-truncate">
                {{ currentUser.name || currentUser.username }}
              </div>
              <small class="user-role badge badge-light border text-secondary font-weight-normal px-1">
                {{ getPrimaryRoleLabel() }}
              </small>
            </div>
          </div>

          <button
            type="button"
            class="btn btn-sm btn-outline-danger logout-btn flex-shrink-0"
            :title="collapsed ? 'Đăng xuất' : ''"
            @click="logout"
          >
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>

        <div v-else class="text-center">
          <a href="/login" class="btn btn-primary btn-block btn-sm">
            <i class="fas fa-sign-in-alt mr-1"></i>
            <span v-if="!collapsed">Đăng nhập</span>
          </a>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
export default {
  props: {
    collapsed: {
      type: Boolean,
      default: false
    },
    mobileOpen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    roles() {
      return this.$store.state.user.roles || [];
    },
    currentUser() {
      return this.$store.state.user.user || (this.$store.$auth && this.$store.$auth.$state.user) || null;
    }
  },
  methods: {
    toggleCollapse() {
      this.$emit('update:collapsed', !this.collapsed);
      try {
        localStorage.setItem('sidebar_collapsed', !this.collapsed ? '1' : '0');
      } catch (e) {}
    },
    handleNavClick() {
      if (window.innerWidth < 992) {
        this.$emit('update:mobileOpen', false);
      }
    },
    logout() {
      if (this.$auth) {
        this.$auth.logout();
      } else {
        location.href = '/login';
      }
    },
    getPrimaryRoleLabel() {
      if (this.checkRole(['quan-tri-vien'])) return 'Quản trị viên';
      if (this.checkRole(['hieu-truong'])) return 'Hiệu trưởng';
      if (this.checkRole(['hieu-pho'])) return 'Hiệu phó';
      if (this.checkRole(['ke-toan'])) return 'Kế toán';
      if (this.checkRole(['giao-vien'])) return 'Giáo viên';
      return 'Nhân viên';
    },
    getDateKetSo() {
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const d1 = new Date(firstDay - 1000);
      let a = '00' + (d1.getMonth() + 1).toString();
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
      this.$store.dispatch('user/getRole');
    }
  }
};
</script>

<style scoped>
.sidebar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 250px;
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
  z-index: 1045;
  display: flex;
  flex-direction: column;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.03);
}

.sidebar-wrapper.collapsed {
  width: 72px;
}

.sidebar-wrapper.collapsed .brand-text,
.sidebar-wrapper.collapsed .nav-text,
.sidebar-wrapper.collapsed .nav-section-title,
.sidebar-wrapper.collapsed .badge,
.sidebar-wrapper.collapsed .user-meta {
  display: none !important;
}

.brand-logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%);
  font-size: 1.1rem;
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 0.98rem;
  line-height: 1.2;
  letter-spacing: 0.2px;
  white-space: nowrap;
}

.brand-desc {
  font-size: 0.7rem;
  white-space: nowrap;
}

.toggle-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: #64748b;
  background-color: #f1f5f9;
}

.toggle-btn:hover {
  background-color: #e2e8f0;
  color: #0f172a;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.custom-scroll::-webkit-scrollbar {
  width: 5px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.nav-section-title {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  color: #94a3b8 !important;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 0.62rem 0.95rem;
  margin: 0.15rem 0.6rem;
  border-radius: 8px;
  color: #475569;
  font-size: 0.88rem;
  font-weight: 500;
  transition: all 0.18s ease;
  white-space: nowrap;
  text-decoration: none;
}

.sidebar-item:hover {
  background-color: #f8fafc;
  color: #0d9488;
}

.sidebar-item.active {
  background-color: rgba(13, 148, 136, 0.1);
  color: #0d9488 !important;
  font-weight: 600;
}

.sidebar-item .nav-icon {
  width: 22px;
  text-align: center;
  font-size: 1rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.sidebar-wrapper.collapsed .sidebar-item {
  justify-content: center;
  padding: 0.65rem 0;
  margin: 0.2rem 0.5rem;
}

.sidebar-wrapper.collapsed .sidebar-item .nav-icon {
  margin-right: 0;
}

.nav-item-highlight {
  background-color: rgba(16, 185, 129, 0.06);
}

.nav-item-highlight:hover {
  background-color: rgba(16, 185, 129, 0.12) !important;
}

.avatar-user {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%) !important;
}

.user-name {
  font-size: 0.82rem;
  line-height: 1.2;
}

.user-role {
  font-size: 0.68rem;
}

.logout-btn {
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
}

/* Mobile responsive drawer */
@media (max-width: 991.98px) {
  .sidebar-wrapper {
    transform: translateX(-100%);
    width: 260px !important;
  }
  .sidebar-wrapper.mobile-open {
    transform: translateX(0);
    box-shadow: 4px 0 25px rgba(0, 0, 0, 0.2);
  }
  .sidebar-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(2px);
    z-index: 1040;
  }
}
</style>
