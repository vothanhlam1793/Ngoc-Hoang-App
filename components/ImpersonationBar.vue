<template>
  <div>
    <!-- Impersonation Active Banner -->
    <div
      v-if="isImpersonating"
      class="impersonation-banner px-3 py-2 d-flex flex-wrap align-items-center justify-content-between shadow-sm"
    >
      <div class="d-flex align-items-center flex-wrap mr-3 my-1">
        <span class="badge badge-warning text-dark font-weight-bold px-2 py-1 mr-2">
          <i class="fas fa-chalkboard-teacher mr-1"></i> ĐANG GIẢ LẬP GIÁO VIÊN
        </span>
        <span class="text-white small mr-2">
          Bạn đang xem giao diện với tư cách <strong>Giáo viên</strong>
        </span>

        <!-- Quick Class Selector Dropdown -->
        <div class="class-picker d-inline-flex align-items-center ml-1">
          <span class="text-white-50 small mr-1">Lớp đang chọn:</span>
          <select
            class="form-control form-control-sm custom-select-dark"
            :value="simulatedClass ? simulatedClass.id : ''"
            @change="onClassChange($event.target.value)"
          >
            <option value="" disabled>-- Chọn lớp học --</option>
            <option
              v-for="lh in classList"
              :key="lh.id"
              :value="lh.id"
            >
              {{ lh.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="d-flex align-items-center my-1">
        <nuxt-link
          v-if="simulatedClass"
          :to="`/giaovien`"
          class="btn btn-sm btn-light font-weight-bold mr-2 text-dark shadow-sm"
        >
          <i class="fas fa-home mr-1"></i> Dashboard Lớp
        </nuxt-link>

        <button
          type="button"
          class="btn btn-sm btn-danger font-weight-bold shadow-sm"
          @click="exitImpersonation"
        >
          <i class="fas fa-times-circle mr-1"></i> Thoát Giả Lập
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImpersonationBar',
  computed: {
    isImpersonating() {
      return this.$store.state.user.isImpersonating;
    },
    simulatedClass() {
      return this.$store.state.user.simulatedClass;
    },
    classList() {
      return this.$store.state.user.classList || [];
    }
  },
  methods: {
    onClassChange(classId) {
      const found = this.classList.find(c => c.id === classId);
      if (found) {
        this.$store.commit('user/setSimulatedClass', found);
        // Refresh route if currently on teacher page
        this.$forceUpdate();
      }
    },
    exitImpersonation() {
      this.$store.commit('user/stopImpersonation');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.impersonation-banner {
  background: linear-gradient(90deg, #1e293b 0%, #334155 100%);
  color: #fff;
  border-bottom: 2px solid #f59e0b;
  z-index: 1040;
}
.custom-select-dark {
  background-color: #0f172a;
  color: #f8fafc;
  border: 1px solid #475569;
  border-radius: 4px;
  font-size: 0.85rem;
  padding: 2px 24px 2px 8px;
  height: 28px;
  display: inline-block;
  width: auto;
}
.custom-select-dark:focus {
  background-color: #0f172a;
  color: #fff;
  border-color: #f59e0b;
  box-shadow: 0 0 0 0.2rem rgba(245, 158, 11, 0.25);
}
</style>
