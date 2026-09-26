<template>
  <nav v-if="shouldShow" class="teacher-bottom-nav d-lg-none">
    <div class="bottom-nav-container">
      <!-- 1. Lớp tôi -->
      <nuxt-link
        to="/giaovien"
        class="nav-tab-item"
        exact-active-class="active"
      >
        <div class="nav-tab-icon">
          <i class="fas fa-home"></i>
        </div>
        <span class="nav-tab-label">Lớp tôi</span>
      </nuxt-link>

      <!-- 2. Điểm danh (Gom Đi học, Ăn chiều, Về trễ) -->
      <nuxt-link
        :to="dihocUrl"
        class="nav-tab-item"
        :class="{ 'active': isDiemDanhActive }"
      >
        <div class="nav-tab-icon">
          <i class="fas fa-calendar-check"></i>
        </div>
        <span class="nav-tab-label">Điểm danh</span>
      </nuxt-link>

      <!-- 3. Danh sách học sinh -->
      <nuxt-link
        :to="hocsinhUrl"
        class="nav-tab-item"
        :class="{ 'active': isHocsinhActive }"
      >
        <div class="nav-tab-icon">
          <i class="fas fa-user-graduate"></i>
        </div>
        <span class="nav-tab-label">Học sinh</span>
      </nuxt-link>

      <!-- 4. Bảng tin & Thông báo -->
      <nuxt-link
        to="/thongbao"
        class="nav-tab-item"
        :class="{ 'active': isThongbaoActive }"
      >
        <div class="nav-tab-icon">
          <i class="fas fa-bullhorn"></i>
        </div>
        <span class="nav-tab-label">Thông báo</span>
      </nuxt-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TeacherBottomNav',
  computed: {
    roles() {
      return this.$store.getters['user/effectiveRoles'] || [];
    },
    isImpersonating() {
      return this.$store.state.user.isImpersonating;
    },
    shouldShow() {
      return this.roles.includes('giao-vien') || this.isImpersonating;
    },
    currentClass() {
      return this.$store.getters['user/effectiveClass'];
    },
    currentYear() {
      return new Date().getFullYear().toString();
    },
    currentMonth() {
      const m = new Date().getMonth() + 1;
      return m < 10 ? '0' + m : m.toString();
    },
    currentDate() {
      const d = new Date().getDate();
      return d < 10 ? '0' + d : d.toString();
    },
    dihocUrl() {
      if (this.currentClass && this.currentClass.id) {
        return `/dihoc/${this.currentYear}/${this.currentMonth}/${this.currentDate}/${this.currentClass.id}`;
      }
      return '/dihoc';
    },
    hocsinhUrl() {
      if (this.currentClass && this.currentClass.id) {
        return `/hocsinh/lophoc/${this.currentClass.id}`;
      }
      return '/hocsinh';
    },
    isDiemDanhActive() {
      const path = this.$route.path;
      return path.startsWith('/dihoc') || path.startsWith('/anchieu') || path.startsWith('/vetre') || path.startsWith('/xemdiemdanh');
    },
    isHocsinhActive() {
      return this.$route.path.startsWith('/hocsinh');
    },
    isThongbaoActive() {
      return this.$route.path.startsWith('/thongbao');
    }
  }
};
</script>

<style scoped>
.teacher-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 62px;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
  z-index: 1040;
}

.bottom-nav-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 0 8px;
}

.nav-tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-decoration: none;
  color: #64748b;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  margin: 2px 4px;
  position: relative;
  -webkit-tap-highlight-color: transparent;
}

.nav-tab-icon {
  font-size: 1.2rem;
  margin-bottom: 2px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
}

.nav-tab-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: -0.2px;
  line-height: 1;
}

.nav-tab-item:active .nav-tab-icon {
  transform: scale(0.9);
}

.nav-tab-item.active {
  color: #4f46e5;
}

.nav-tab-item.active .nav-tab-icon {
  transform: translateY(-2px);
  color: #4f46e5;
}

.nav-tab-item.active::after {
  content: '';
  position: absolute;
  top: 4px;
  width: 24px;
  height: 3px;
  background: #4f46e5;
  border-radius: 3px;
}
</style>
