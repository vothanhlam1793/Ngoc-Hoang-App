<template>
  <header class="main-navbar-wrapper sticky-top">
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-2 px-3">
      <!-- Brand & Version -->
      <a class="navbar-brand d-flex align-items-center mr-4" href="/">
        <div class="brand-icon-wrapper mr-2">
          <i class="fas fa-graduation-cap text-primary"></i>
        </div>
        <div class="d-flex flex-column">
          <span class="brand-title font-weight-bold text-dark">MN Ngọc Hoàng</span>
          <span class="brand-subtitle text-muted">Hệ thống quản lý nội bộ</span>
        </div>
        <span class="badge badge-pill badge-light border text-primary ml-2 py-1 px-2 font-weight-normal">v2.0.1</span>
      </a>

      <!-- Mobile Toggle Button -->
      <button
        class="navbar-toggler border-0"
        type="button"
        @click="mobileMenuOpen = !mobileMenuOpen"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Nav Links -->
      <div :class="['collapse navbar-collapse', { show: mobileMenuOpen }]">
        <ul class="navbar-nav mr-auto align-items-lg-center">
          <!-- 1. Trang chủ -->
          <li class="nav-item">
            <nuxt-link to="/" class="nav-link nav-btn" exact-active-class="active">
              <i class="fas fa-home mr-1"></i> Trang chủ
            </nuxt-link>
          </li>

          <!-- 2. Nhóm Học sinh & Điểm danh -->
          <li
            v-if="checkRole(['quan-tri-vien', 'hieu-truong', 'hieu-pho', 'ke-toan', 'giao-vien'])"
            class="nav-item dropdown"
            :class="{ show: activeDropdown === 'student' }"
          >
            <a
              class="nav-link nav-btn dropdown-toggle"
              href="#"
              role="button"
              @click.prevent="toggleDropdown('student')"
            >
              <i class="fas fa-user-graduate mr-1"></i> Học sinh
            </a>
            <div class="dropdown-menu border-0 shadow-lg animated--fade-in" :class="{ show: activeDropdown === 'student' }">
              <nuxt-link
                v-if="checkRole(['quan-tri-vien', 'hieu-truong', 'hieu-pho', 'ke-toan'])"
                class="dropdown-item py-2"
                to="/hocsinhv2"
                @click.native="closeMenus"
              >
                <i class="fas fa-users-cog text-primary mr-2"></i> Danh sách học sinh
              </nuxt-link>
              <nuxt-link
                v-if="checkRole(['giao-vien'])"
                class="dropdown-item py-2"
                to="/hocsinh"
                @click.native="closeMenus"
              >
                <i class="fas fa-user-check text-primary mr-2"></i> Thông tin học sinh lớp
              </nuxt-link>
              <div class="dropdown-divider"></div>
              <nuxt-link
                v-if="checkRole(['giao-vien', 'quan-tri-vien', 'hieu-truong'])"
                class="dropdown-item py-2"
                to="/dihoc"
                @click.native="closeMenus"
              >
                <i class="fas fa-calendar-check text-success mr-2"></i> Điểm danh hàng ngày
              </nuxt-link>
              <nuxt-link
                v-if="checkRole(['giao-vien', 'quan-tri-vien', 'hieu-truong'])"
                class="dropdown-item py-2"
                to="/vetre"
                @click.native="closeMenus"
              >
                <i class="fas fa-business-time text-warning mr-2"></i> Về trễ sau 17h
              </nuxt-link>
              <nuxt-link
                v-if="checkRole(['giao-vien', 'quan-tri-vien', 'hieu-truong'])"
                class="dropdown-item py-2"
                to="/anchieu"
                @click.native="closeMenus"
              >
                <i class="fas fa-utensils text-info mr-2"></i> Suất ăn chiều
              </nuxt-link>
            </div>
          </li>

          <!-- 3. Nhóm Tài chính & Thu phí -->
          <li
            v-if="checkRole(['quan-tri-vien', 'ke-toan', 'hieu-truong', 'hieu-pho'])"
            class="nav-item dropdown"
            :class="{ show: activeDropdown === 'finance' }"
          >
            <a
              class="nav-link nav-btn dropdown-toggle"
              href="#"
              role="button"
              @click.prevent="toggleDropdown('finance')"
            >
              <i class="fas fa-wallet mr-1"></i> Tài chính & Thu phí
            </a>
            <div class="dropdown-menu border-0 shadow-lg animated--fade-in" :class="{ show: activeDropdown === 'finance' }">
              <nuxt-link
                class="dropdown-item py-2 font-weight-bold text-success"
                to="/dongtien"
                @click.native="closeMenus"
              >
                <i class="fas fa-exchange-alt mr-2"></i> Dòng tiền & Gạch nợ
              </nuxt-link>
              <nuxt-link
                class="dropdown-item py-2"
                to="/hoadon"
                @click.native="closeMenus"
              >
                <i class="fas fa-file-invoice-dollar text-primary mr-2"></i> Hoá đơn & Học phí
              </nuxt-link>
              <nuxt-link
                class="dropdown-item py-2"
                to="/no"
                @click.native="closeMenus"
              >
                <i class="fas fa-user-friends text-info mr-2"></i> Phụ huynh & Công nợ
              </nuxt-link>
              <div class="dropdown-divider"></div>
              <a
                class="dropdown-item py-2"
                :href="`/ketso/${getDateKetSo()}`"
                @click="closeMenus"
              >
                <i class="fas fa-calendar-alt text-secondary mr-2"></i> Kết sổ tháng
              </a>
            </div>
          </li>

          <!-- 4. Thông báo phụ huynh -->
          <li
            v-if="checkRole(['quan-tri-vien', 'hieu-truong', 'hieu-pho', 'ke-toan'])"
            class="nav-item"
          >
            <nuxt-link to="/thongbao" class="nav-link nav-btn" active-class="active">
              <i class="fas fa-bullhorn mr-1"></i> Thông báo
            </nuxt-link>
          </li>

          <!-- 5. Báo cáo & Thống kê -->
          <li
            v-if="checkRole(['quan-tri-vien', 'hieu-truong', 'hieu-pho', 'ke-toan'])"
            class="nav-item"
          >
            <nuxt-link to="/baocao" class="nav-link nav-btn" active-class="active">
              <i class="fas fa-chart-line mr-1"></i> Báo cáo
            </nuxt-link>
          </li>

          <!-- 6. Cài đặt hệ thống -->
          <li
            v-if="checkRole(['quan-tri-vien', 'ke-toan', 'hieu-truong', 'hieu-pho'])"
            class="nav-item"
          >
            <nuxt-link to="/setup" class="nav-link nav-btn" active-class="active">
              <i class="fas fa-sliders-h mr-1"></i> Cài đặt
            </nuxt-link>
          </li>
        </ul>

        <!-- Right Side: User Profile & Logout -->
        <div class="navbar-nav align-items-lg-center mt-3 mt-lg-0 border-top border-lg-top-0 pt-2 pt-lg-0">
          <div v-if="currentUser" class="d-flex align-items-center mr-3 user-info-pill px-3 py-1 bg-light rounded-pill">
            <div class="avatar-circle mr-2 bg-primary text-white font-weight-bold">
              {{ (currentUser.name || currentUser.username || 'U').charAt(0).toUpperCase() }}
            </div>
            <div class="d-flex flex-column text-left">
              <span class="user-name font-weight-bold text-dark">{{ currentUser.name || currentUser.username }}</span>
              <span class="user-role badge badge-secondary font-weight-normal">{{ getPrimaryRoleLabel() }}</span>
            </div>
          </div>

          <div class="nav-item mt-2 mt-lg-0">
            <button
              v-if="$store.$auth && $store.$auth.$state.loggedIn"
              class="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 d-flex align-items-center"
              @click="logout"
            >
              <i class="fas fa-sign-out-alt mr-1"></i> Đăng xuất
            </button>
            <a
              v-else
              class="btn btn-primary btn-sm rounded-pill px-3 py-1"
              href="/login"
            >
              <i class="fas fa-sign-in-alt mr-1"></i> Đăng nhập
            </a>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  data() {
    return {
      mobileMenuOpen: false,
      activeDropdown: null,
    };
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
    toggleDropdown(name) {
      this.activeDropdown = this.activeDropdown === name ? null : name;
    },
    closeMenus() {
      this.activeDropdown = null;
      this.mobileMenuOpen = false;
    },
    logout() {
      this.closeMenus();
      if (this.$auth) {
        this.$auth.logout();
      } else {
        location.href = "/login";
      }
    },
    getPrimaryRoleLabel() {
      if (this.checkRole(["quan-tri-vien"])) return "Quản trị viên";
      if (this.checkRole(["hieu-truong"])) return "Hiệu trưởng";
      if (this.checkRole(["hieu-pho"])) return "Hiệu phó";
      if (this.checkRole(["ke-toan"])) return "Kế toán";
      if (this.checkRole(["giao-vien"])) return "Giáo viên";
      return "Nhân viên";
    },
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

    // Đóng dropdown khi click ra ngoài
    const handleClickOutside = (e) => {
      if (!this.$el.contains(e.target)) {
        this.closeMenus();
      }
    };
    document.addEventListener("click", handleClickOutside);
    this.$once("hook:beforeDestroy", () => {
      document.removeEventListener("click", handleClickOutside);
    });
  }
};
</script>

<style scoped>
.main-navbar-wrapper {
  z-index: 1040;
}

.brand-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: rgba(13, 110, 253, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
}

.brand-title {
  font-size: 1.05rem;
  line-height: 1.2;
  letter-spacing: -0.2px;
}

.brand-subtitle {
  font-size: 0.72rem;
  letter-spacing: 0.1px;
}

.nav-btn {
  font-weight: 500;
  font-size: 0.92rem;
  color: #495057 !important;
  padding: 0.5rem 0.85rem !important;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.nav-btn:hover {
  color: #0d6efd !important;
  background-color: rgba(13, 110, 253, 0.06);
}

.nav-btn.active,
.nav-item.active > .nav-link {
  color: #0d6efd !important;
  font-weight: 600;
  background-color: rgba(13, 110, 253, 0.1);
}

.dropdown-menu {
  border-radius: 10px;
  min-width: 220px;
  padding: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
  animation: fadeIn 0.15s ease-in-out;
}

.dropdown-item {
  border-radius: 6px;
  font-size: 0.9rem;
  color: #495057;
  transition: background-color 0.15s ease;
}

.dropdown-item:hover {
  background-color: #f1f5f9;
  color: #0d6efd;
}

.user-info-pill {
  border: 1px solid #e9ecef;
}

.avatar-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.user-name {
  font-size: 0.85rem;
  line-height: 1.1;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.65rem;
  padding: 2px 4px;
  margin-top: 2px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
