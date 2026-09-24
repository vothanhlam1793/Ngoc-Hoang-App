<template>
  <div class="app-layout-wrapper">
    <!-- Sidebar Navigation -->
    <Sidebar
      :collapsed.sync="isCollapsed"
      :mobileOpen.sync="isMobileOpen"
    />

    <!-- Main Content Area -->
    <div :class="['main-wrapper', { 'sidebar-collapsed': isCollapsed }]">
      <!-- Minimalist Sticky Topbar -->
      <header class="app-topbar sticky-top bg-white border-bottom px-3 py-2 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <button
            type="button"
            class="btn btn-sm btn-light border-0 topbar-toggle mr-3"
            @click="toggleSidebar"
            aria-label="Toggle Menu"
          >
            <i class="fas fa-bars text-secondary fs-5"></i>
          </button>
          <div class="topbar-title font-weight-bold text-dark d-flex align-items-center">
            <span class="text-muted font-weight-normal small mr-2 d-none d-md-inline">Hệ thống Quản lý /</span>
            <span>Điểm Danh Học Sinh</span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content container-fluid px-3 py-3">
        <div class="mb-3">
          <MenuDiemDanh />
        </div>
        <Nuxt />
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar.vue';

export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      isCollapsed: false,
      isMobileOpen: false,
    };
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
  },
  mounted() {
    try {
      const saved = localStorage.getItem('sidebar_collapsed');
      if (saved === '1') {
        this.isCollapsed = true;
      }
    } catch (e) {}
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

.page-content {
  flex: 1;
}

@media (max-width: 991.98px) {
  .main-wrapper {
    margin-left: 0 !important;
  }
}
</style>
