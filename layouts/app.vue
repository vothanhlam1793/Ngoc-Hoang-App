<template>
  <div class="app-layout-wrapper">
    <!-- Sidebar Navigation -->
    <Sidebar
      :collapsed.sync="isCollapsed"
      :mobileOpen.sync="isMobileOpen"
    />

    <!-- Main Content Area -->
    <div :class="['main-wrapper', { 'sidebar-collapsed': isCollapsed }]">
      <!-- Impersonation Indicator Bar -->
      <ImpersonationBar />

      <!-- Minimalist Sticky Topbar -->
      <header class="app-topbar sticky-top bg-white border-bottom px-3 py-2 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <!-- Toggle button for mobile & desktop -->
          <button
            type="button"
            class="btn btn-sm btn-light border-0 topbar-toggle mr-3"
            @click="toggleSidebar"
            aria-label="Toggle Menu"
          >
            <i class="fas fa-bars text-secondary fs-5"></i>
          </button>

          <!-- Breadcrumb / Page Title Indicator -->
          <div class="topbar-title font-weight-bold text-dark d-flex align-items-center">
            <span>{{ pageTitle }}</span>
          </div>
        </div>

        <div class="d-flex align-items-center">
          <!-- Role Switcher Button for Admin (When not impersonating) -->
          <div v-if="isRealAdmin && !isImpersonating" class="mr-2">
            <div class="dropdown">
              <button
                class="btn btn-sm btn-outline-secondary dropdown-toggle"
                type="button"
                id="roleSwitchDropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="fas fa-chalkboard-teacher mr-1" aria-hidden="true"></i> Góc nhìn GV
              </button>
              <div class="dropdown-menu dropdown-menu-right shadow border-0" aria-labelledby="roleSwitchDropdown" style="max-height: 300px; overflow-y: auto;">
                <h6 class="dropdown-header text-uppercase font-weight-bold text-muted small">Chọn lớp để xem</h6>
                <a
                  v-for="lh in classList"
                  :key="lh.id"
                  v-if="lh.name"
                  class="dropdown-item py-2 d-flex align-items-center justify-content-between"
                  href="javascript:void(0)"
                  @click="simulateTeacher(lh)"
                >
                  <span><i class="fas fa-shapes text-primary mr-2"></i>{{ lh.name }}</span>
                </a>
                <div v-if="!classList || !classList.length" class="dropdown-item text-muted small">
                  Đang tải danh sách lớp...
                </div>
              </div>
            </div>
          </div>

          <!-- Quick action: Thu chi phụ huynh (giữ nguyên quyền hiển thị) -->
          <nuxt-link
            v-if="!isImpersonating && checkRole(['quan-tri-vien', 'ke-toan', 'hieu-truong'])"
            to="/dongtien"
            class="btn btn-sm btn-outline-success rounded-pill px-3 mr-2 d-none d-sm-inline-flex align-items-center"
          >
            <i class="fas fa-money-bill-wave mr-1"></i> Thu chi phụ huynh
          </nuxt-link>

          <!-- User quick indicator -->
          <div v-if="currentUser" class="user-pill d-flex align-items-center py-1 px-2 rounded bg-light">
            <span class="small font-weight-semibold text-dark mr-1">{{ currentUser.name || currentUser.username }}</span>
            <span :class="['badge font-weight-normal', isImpersonating ? 'badge-warning text-dark' : 'badge-primary']" style="font-size: 0.65rem;">
              {{ getPrimaryRoleLabel() }}
            </span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main :class="['page-content container-fluid px-3 py-3', { 'has-teacher-bottom': isTeacherView }]">
        <Nuxt />
      </main>

      <!-- Teacher Mobile Bottom Navigation -->
      <TeacherBottomNav />
    </div>
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar.vue';
import ImpersonationBar from '~/components/ImpersonationBar.vue';
import TeacherBottomNav from '~/components/Teacher/TeacherBottomNav.vue';

export default {
  components: {
    Sidebar,
    ImpersonationBar,
    TeacherBottomNav,
  },
  data() {
    return {
      isCollapsed: false,
      isMobileOpen: false,
    };
  },
  computed: {
    pageTitle() {
      const titles = {
        '/': 'Trang chủ Quản lý',
        '/dongtien': 'Thu chi phụ huynh',
        '/quytruong': 'Quỹ trường',
        '/khoanphi/cauhinh': 'Cấu hình hệ thống khoản phí',
        '/khoanphi': 'Tra cứu khoản phí',
        '/no': 'Phụ huynh & Sổ nợ',
        '/phieuthu': 'Phiếu thu/chi ngày',
        '/hoadon': 'Hoá đơn & Học phí',
        '/ketso': 'Kết sổ tháng',
        '/danhsachketso': 'Danh sách kết sổ',
        '/ketsonghihoc': 'Kết sổ nghỉ học',
        '/giaovien/diemdanh': 'Điểm danh lớp',
        '/giaovien': 'Lớp học của tôi',
        '/hocsinh': 'Học sinh',
        '/hocsinhv2': 'Danh sách học sinh',
        '/hocsinhv3': 'Danh sách học sinh',
        '/phuhuynh': 'Phụ huynh',
        '/phuhuynhv2': 'Phụ huynh',
        '/dihoc': 'Điểm danh hàng ngày',
        '/diemdanh': 'Điểm danh',
        '/diemdanhtonghop': 'Điểm danh tổng hợp',
        '/xemdiemdanh': 'Xem điểm danh',
        '/diemdanhvetre': 'Điểm danh về trễ',
        '/ddvt': 'Điểm danh về trễ',
        '/vetre': 'Về trễ sau 17h',
        '/anchieu': 'Suất ăn chiều',
        '/lichhoc': 'Lịch học',
        '/caidatlichhoc': 'Cài đặt lịch học',
        '/thongbao': 'Thông báo phụ huynh',
        '/baocao': 'Báo cáo & Thống kê',
        '/doanhthu': 'Doanh thu',
        '/nhansu': 'Quản lý Nhân sự',
        '/setup': 'Cài đặt & Quản trị',
        '/cai-dat/monapay': 'Cài đặt MonaPay',
        '/sanpham': 'Sản phẩm',
      };
      const path = this.$route.path.replace(/\/+$/, '') || '/';
      const route = Object.keys(titles)
        .sort((a, b) => b.length - a.length)
        .find(key => path === key || (key !== '/' && path.startsWith(`${key}/`)));
      return route ? titles[route] : 'MN Ngọc Hoàng';
    },
    roles() {
      return this.$store.getters['user/effectiveRoles'] || [];
    },
    isImpersonating() {
      return this.$store.state.user.isImpersonating;
    },
    isRealAdmin() {
      return this.$store.getters['user/isRealAdmin'];
    },
    classList() {
      return this.$store.state.user.classList || [];
    },
    currentUser() {
      return this.$store.state.user.user || (this.$store.$auth && this.$store.$auth.$state.user) || null;
    },
    isTeacherView() {
      return this.roles.includes('giao-vien') || this.isImpersonating;
    },
  },
  methods: {
    toggleSidebar() {
      if (window.innerWidth < 992) {
        this.isMobileOpen = !this.isMobileOpen;
      } else {
        this.isCollapsed = !this.isCollapsed;
        try {
          localStorage.setItem('sidebar_collapsed', this.isCollapsed ? '1' : '0');
        } catch (e) {}
      }
    },
    simulateTeacher(lophoc) {
      this.$store.commit('user/startImpersonation', {
        role: 'giao-vien',
        lophoc: lophoc
      });
      this.$router.push('/giaovien');
    },
    getPrimaryRoleLabel() {
      if (this.isImpersonating) {
        return 'GV Giả lập';
      }
      if (this.checkRole(['quan-tri-vien'])) return 'Admin';
      if (this.checkRole(['hieu-truong'])) return 'Hiệu trưởng';
      if (this.checkRole(['hieu-pho'])) return 'Hiệu phó';
      if (this.checkRole(['ke-toan'])) return 'Kế toán';
      if (this.checkRole(['giao-vien'])) return 'Giáo viên';
      return 'Nhân viên';
    },
    checkRole(slugs) {
      if (!this.roles || !this.roles.length) return false;
      return this.roles.some((e1) => slugs.includes(e1));
    },
  },
  head() {
    return {
      title: 'MN Ngọc Hoàng - Quản lý nội bộ',
    };
  },
  mounted() {
    try {
      const saved = localStorage.getItem('sidebar_collapsed');
      if (saved === '1') {
        this.isCollapsed = true;
      }
    } catch (e) {}

    if (this.$store.$auth && this.$store.$auth.$state.loggedIn) {
      this.$store.dispatch('user/getRole');
    } else if (this.$route.path !== '/login') {
      location.href = '/login';
    }
  },
};
</script>

<style>
.checkbox-lg .form-check-input {
  top: 0.8rem;
  scale: 1.4;
  margin-right: 0.7rem;
}

.checkbox-lg .form-check-label {
  padding-top: 13px;
}

input.larger {
  scale: 2;
  margin-right: 0.8rem;
  margin-left: 0.8rem;
}

.checkbox-xl .form-check-label {
  padding-top: 19px;
}

/* App Layout Styles */
.app-layout-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

.main-wrapper {
  flex: 1;
  min-width: 0;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-wrapper.sidebar-collapsed {
  margin-left: 72px;
}

.app-topbar {
  z-index: 1030;
  height: 58px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.topbar-toggle {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.topbar-toggle:hover {
  background-color: #f1f5f9;
}

.page-content {
  flex: 1;
}

@media (max-width: 991.98px) {
  .main-wrapper {
    margin-left: 0 !important;
  }
  .page-content.has-teacher-bottom {
    padding-bottom: 75px !important;
  }
}
</style>
