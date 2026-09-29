<template>
  <div class="container-fluid py-3 pb-5 dihoc-dashboard">
    <!-- Top Header Banner -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
      <div>
        <h4 class="font-weight-bold mb-1 text-dark">
          <i class="fas fa-calendar-check text-success mr-2"></i> Điểm Danh Hàng Ngày
        </h4>
        <p class="text-muted small mb-0">
          Theo dõi chuyên cần, bữa ăn và sĩ số các lớp học • Hôm nay: <strong>{{ todayFormatted }}</strong>
        </p>
      </div>
      <div class="d-flex align-items-center mt-2 mt-md-0">
        <span class="badge badge-light border px-3 py-2 text-primary font-weight-bold mr-2">
          <i class="fas fa-calendar-alt mr-1"></i> Tháng {{ month }}/{{ year }}
        </span>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary rounded-pill px-3 shadow-sm"
          :disabled="loading"
          @click="loadData"
        >
          <i class="fas fa-sync-alt mr-1" :class="{ 'fa-spin': loading }"></i> Tải lại
        </button>
      </div>
    </div>

    <!-- Overview Stats Counter -->
    <div class="row mb-4">
      <div class="col-6 col-md-3 mb-2">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100 stat-card border-left-primary">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small font-weight-bold text-uppercase d-block">Tổng số lớp</span>
              <span class="h4 font-weight-bold text-dark mb-0">{{ visibleClasses.length }}</span>
            </div>
            <div class="stat-icon bg-primary-light text-primary">
              <i class="fas fa-chalkboard"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-2">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100 stat-card border-left-info">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small font-weight-bold text-uppercase d-block">Tổng học sinh</span>
              <span class="h4 font-weight-bold text-info mb-0">{{ totalStudents }}</span>
            </div>
            <div class="stat-icon bg-info-light text-info">
              <i class="fas fa-user-graduate"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-2">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100 stat-card border-left-success">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small font-weight-bold text-uppercase d-block">Lớp đã điểm danh</span>
              <span class="h4 font-weight-bold text-success mb-0">{{ attendedClassesCount }} / {{ visibleClasses.length }}</span>
            </div>
            <div class="stat-icon bg-success-light text-success">
              <i class="fas fa-check-double"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-2">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100 stat-card border-left-warning">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small font-weight-bold text-uppercase d-block">Bé có mặt hôm nay</span>
              <span class="h4 font-weight-bold text-warning mb-0">{{ todayTotalPresent }}</span>
            </div>
            <div class="stat-icon bg-warning-light text-warning">
              <i class="fas fa-smile-beam"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="card border-0 shadow-sm rounded-lg mb-4 bg-white p-3">
      <div class="d-flex flex-wrap justify-content-between align-items-center">
        <div class="search-box position-relative flex-grow-1 mr-md-3 mb-2 mb-md-0" style="max-width: 400px;">
          <i class="fas fa-search position-absolute text-muted" style="left: 12px; top: 11px;"></i>
          <input
            v-model.trim="searchKeyword"
            type="text"
            class="form-control form-control-sm pl-4 rounded-pill border"
            placeholder="Tìm theo tên lớp hoặc giáo viên..."
          />
        </div>

        <div class="d-flex align-items-center">
          <div class="btn-group btn-group-sm rounded-pill p-1 bg-light border">
            <button
              type="button"
              class="btn rounded-pill px-3 font-weight-bold"
              :class="filterStatus === 'ALL' ? 'btn-primary shadow-sm' : 'btn-light text-secondary'"
              @click="filterStatus = 'ALL'"
            >
              Tất cả ({{ visibleClasses.length }})
            </button>
            <button
              type="button"
              class="btn rounded-pill px-3 font-weight-bold"
              :class="filterStatus === 'DONE' ? 'btn-success shadow-sm' : 'btn-light text-secondary'"
              @click="filterStatus = 'DONE'"
            >
              Đã điểm danh ({{ attendedClassesCount }})
            </button>
            <button
              type="button"
              class="btn rounded-pill px-3 font-weight-bold"
              :class="filterStatus === 'NOT_YET' ? 'btn-warning text-dark shadow-sm' : 'btn-light text-secondary'"
              @click="filterStatus = 'NOT_YET'"
            >
              Chưa xong ({{ visibleClasses.length - attendedClassesCount }})
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && (!classes || !classes.length)" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Đang tải dữ liệu...</span>
      </div>
      <p class="text-muted mt-3 mb-0">Đang nạp danh sách lớp và trạng thái điểm danh hôm nay...</p>
    </div>

    <div v-else-if="loadError" class="alert alert-danger shadow-sm border-0" role="alert">
      <i class="fas fa-exclamation-circle mr-1"></i>{{ loadError }}
      <button type="button" class="btn btn-sm btn-outline-danger ml-2" @click="loadData">Thử lại</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!filteredClasses.length" class="card border-0 shadow-sm rounded-lg p-5 text-center bg-white my-3">
      <div class="mb-3 text-muted" style="font-size: 3rem;">
        <i class="fas fa-folder-open"></i>
      </div>
      <h5 class="font-weight-bold text-secondary mb-1">Không tìm thấy lớp học phù hợp</h5>
      <p class="text-muted small mb-3">
        {{ searchKeyword ? 'Không có lớp học nào khớp với từ khóa tìm kiếm.' : 'Bạn chưa được phân quyền phụ trách lớp học nào hoặc danh sách đang trống.' }}
      </p>
      <div v-if="searchKeyword">
        <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="searchKeyword = ''">
          Xóa tìm kiếm
        </button>
      </div>
    </div>

    <!-- Danh sách lớp học dạng Cards -->
    <div v-else class="row">
      <div
        v-for="lophoc in filteredClasses"
        :key="lophoc.id"
        class="col-md-6 col-lg-4 mb-3"
      >
        <div class="class-card card shadow-sm border-0 h-100 rounded-lg overflow-hidden bg-white">
          <!-- Card Header / Title -->
          <div class="p-3 pb-2 d-flex justify-content-between align-items-start border-bottom bg-light">
            <div class="d-flex align-items-center">
              <div class="class-icon bg-success-light text-success mr-2">
                <i class="fas fa-shapes"></i>
              </div>
              <div>
                <h5 class="font-weight-bold text-dark mb-0">{{ lophoc.name }}</h5>
                <small class="text-muted font-weight-semibold">Sĩ số: <span class="text-primary font-weight-bold">{{ getStudentCount(lophoc) }}</span> bé</small>
              </div>
            </div>
            <div>
              <span
                v-if="hasAttendedToday(lophoc.id)"
                class="badge badge-success px-2 py-1 font-weight-bold shadow-sm"
              >
                <i class="fas fa-check-circle mr-1"></i> Đã điểm danh
              </span>
              <span
                v-else
                class="badge badge-warning text-dark px-2 py-1 font-weight-bold shadow-sm"
              >
                <i class="far fa-clock mr-1"></i> Chưa điểm danh
              </span>
            </div>
          </div>

          <!-- Card Body / Meta info -->
          <div class="p-3">
            <!-- Giáo viên phụ trách -->
            <div class="mb-2 small">
              <span class="text-muted d-block mb-1"><i class="fas fa-user-tie text-secondary mr-1"></i> Giáo viên phụ trách:</span>
              <div class="font-weight-bold text-dark text-truncate" :title="getTeacherNames(lophoc)">
                {{ getTeacherNames(lophoc) || 'Chưa phân công giáo viên' }}
              </div>
            </div>

            <!-- Tình trạng hôm nay -->
            <div class="p-2 rounded bg-light border mt-2">
              <div v-if="hasAttendedToday(lophoc.id)" class="d-flex justify-content-between align-items-center text-center">
                <div class="flex-fill border-right">
                  <span class="small text-muted d-block">Có mặt</span>
                  <strong class="text-success">{{ getAttendanceStats(lophoc.id).present }}</strong>
                </div>
                <div class="flex-fill border-right">
                  <span class="small text-muted d-block">Nghỉ học</span>
                  <strong class="text-danger">{{ getAttendanceStats(lophoc.id).absent }}</strong>
                </div>
                <div class="flex-fill">
                  <span class="small text-muted d-block">Người chấm</span>
                  <strong class="text-dark small text-truncate d-inline-block" style="max-width: 80px;" :title="getAttendanceStats(lophoc.id).teacher">
                    {{ getAttendanceStats(lophoc.id).teacher }}
                  </strong>
                </div>
              </div>
              <div v-else class="text-center py-1 text-muted small">
                <i class="fas fa-info-circle text-warning mr-1"></i> Chưa có dữ liệu chấm điểm danh hôm nay
              </div>
            </div>
          </div>

          <!-- Card Footer / Actions 1-Chạm -->
          <div class="p-3 pt-2 mt-auto border-top d-flex justify-content-between align-items-center bg-white">
            <nuxt-link
              :to="`/dihoc/${year}/${month}/${lophoc.id}`"
              class="btn btn-sm btn-light border text-secondary font-weight-bold rounded-pill px-3"
              title="Xem lịch sử điểm danh cả tháng"
            >
              <i class="fas fa-calendar-alt mr-1"></i> Sổ tháng
            </nuxt-link>

            <nuxt-link
              :to="`/dihoc/${year}/${month}/${date}/${lophoc.id}`"
              class="btn btn-sm btn-success font-weight-bold rounded-pill px-3 shadow-sm"
            >
              <i class="fas fa-check mr-1"></i> Điểm danh ngay <i class="fas fa-arrow-right ml-1"></i>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';

const GET_DASHBOARD_DATA = gql`
  query getDihocDashboard($todayCode: String!) {
    allLopHocs {
      id
      name
      hocsinhs {
        id
        status
      }
      chunhiem {
        id
        name
      }
    }
    allDiemDanhs(where: { code: $todayCode, type: "DIHOCHANGNGAY" }) {
      id
      code
      lophoc {
        id
      }
      co {
        id
      }
      khong {
        id
      }
      giaovien {
        id
        name
      }
    }
  }
`;

export default {
  layout: 'app',
  data() {
    const d = new Date();
    const year = String(d.getFullYear());
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    return {
      year,
      month,
      date,
      loading: false,
      classes: [],
      todayAttendance: [],
      searchKeyword: '',
      filterStatus: 'ALL', // ALL, DONE, NOT_YET
      loadError: '',
      refreshTimer: null,
      attendanceSavedHandler: null,
      visibilityHandler: null
    };
  },
  computed: {
    todayFormatted() {
      return `${this.date}/${this.month}/${this.year}`;
    },
    todayCode() {
      return `${this.year}_${this.month}_${this.date}`;
    },
    monthCode() {
      return `${this.year}_${this.month}`;
    },
    roles() {
      return this.$store.getters['user/effectiveRoles'] || [];
    },
    isAdmin() {
      return (
        this.$store.state.user?.isAdmin === true ||
        this.$store.state.user?.user?.isAdmin === true ||
        this.$store.getters['user/isRealAdmin'] ||
        this.checkRole(['quan-tri-vien', 'hieu-truong', 'hieu-pho', 'ke-toan'])
      );
    },
    isImpersonating() {
      return this.$store.state.user?.isImpersonating;
    },
    simulatedClass() {
      return this.$store.state.user?.simulatedClass;
    },
    visibleClasses() {
      if (!this.classes || !this.classes.length) return [];
      return this.classes.filter(lh => {
        if (!lh.name) return false;
        return this.checkLopHoc(lh);
      });
    },
    filteredClasses() {
      return this.visibleClasses.filter(lh => {
        // Status filter
        const done = this.hasAttendedToday(lh.id);
        if (this.filterStatus === 'DONE' && !done) return false;
        if (this.filterStatus === 'NOT_YET' && done) return false;

        // Keyword filter
        if (this.searchKeyword) {
          const kw = this.searchKeyword.toLowerCase();
          const nameMatch = lh.name && lh.name.toLowerCase().includes(kw);
          const teacherMatch = (lh.chunhiem || []).some(u => u.name && u.name.toLowerCase().includes(kw));
          return nameMatch || teacherMatch;
        }
        return true;
      });
    },
    totalStudents() {
      return this.visibleClasses.reduce((sum, lh) => sum + this.getStudentCount(lh), 0);
    },
    attendedClassesCount() {
      return this.visibleClasses.filter(lh => this.hasAttendedToday(lh.id)).length;
    },
    todayTotalPresent() {
      let count = 0;
      for (const lh of this.visibleClasses) {
        const stats = this.getAttendanceStats(lh.id);
        if (stats) count += stats.present;
      }
      return count;
    }
  },
  mounted() {
    this.loadData();
    this.attendanceSavedHandler = event => {
      if (event.detail?.code === this.todayCode) this.loadData();
    };
    this.visibilityHandler = () => {
      if (document.visibilityState === 'visible') this.loadData();
    };
    window.addEventListener('attendance-saved', this.attendanceSavedHandler);
    document.addEventListener('visibilitychange', this.visibilityHandler);
    this.refreshTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') this.loadData();
    }, 30000);
  },
  beforeDestroy() {
    window.removeEventListener('attendance-saved', this.attendanceSavedHandler);
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    window.clearInterval(this.refreshTimer);
  },
  methods: {
    checkRole(slugs) {
      if (!this.roles || !this.roles.length) return false;
      return this.roles.some(r => slugs.includes(r));
    },
    checkLopHoc(lh) {
      // 1. If real admin / principle / accountant and not simulating single teacher: show all
      if (this.isAdmin && !this.isImpersonating) {
        return true;
      }
      // 2. If simulating teacher
      if (this.isImpersonating && this.simulatedClass) {
        return lh.id === this.simulatedClass.id;
      }
      // 3. If teacher role: check assigned classes in profile
      if (this.checkRole(['giao-vien'])) {
        const userClasses = this.$store.state.user?.user?.lophoc || [];
        return userClasses.some(c => c.id === lh.id);
      }
      // 4. Default fallback: if logged in as management, show all
      return this.isAdmin;
    },
    getStudentCount(lophoc) {
      return (lophoc.hocsinhs || []).length;
    },
    getTeacherNames(lophoc) {
      if (!lophoc.chunhiem || !lophoc.chunhiem.length) return '';
      return lophoc.chunhiem.map(u => u.name).filter(Boolean).join(', ');
    },
    hasAttendedToday(classId) {
      return this.todayAttendance.some(a => a.lophoc && a.lophoc.id === classId);
    },
    getAttendanceStats(classId) {
      const att = this.todayAttendance.find(a => a.lophoc && a.lophoc.id === classId);
      if (!att) return { present: 0, absent: 0, teacher: 'Chưa có' };
      return {
        present: (att.co || []).length,
        absent: (att.khong || []).length,
        teacher: att.giaovien?.name || 'Giáo viên'
      };
    },
    async loadData() {
      if (this.loading) return;
      this.loading = true;
      this.loadError = '';
      try {
        if (!this.$store.state.user.user?.id) {
          await this.$store.dispatch('user/getRole');
        }
        const client = this.$apolloProvider?.defaultClient || this.$apollo?.defaultClient;
        if (!client) throw new Error('Apollo client not ready');

        const res = await client.query({
          query: GET_DASHBOARD_DATA,
          variables: {
            todayCode: this.todayCode
          },
          fetchPolicy: 'network-only'
        });

        if (res.data) {
          this.classes = res.data.allLopHocs || [];
          this.todayAttendance = res.data.allDiemDanhs || [];
        }
      } catch (e) {
        console.error('Error loading dihoc dashboard:', e);
        this.loadError = 'Không tải được dữ liệu điểm danh. Vui lòng thử lại.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.dihoc-dashboard {
  min-height: 80vh;
}

.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left-width: 4px !important;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.06) !important;
}

.border-left-primary { border-left: 4px solid #007bff !important; }
.border-left-info { border-left: 4px solid #17a2b8 !important; }
.border-left-success { border-left: 4px solid #28a745 !important; }
.border-left-warning { border-left: 4px solid #ffc107 !important; }

.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.bg-primary-light { background-color: rgba(0, 123, 255, 0.12); }
.bg-info-light { background-color: rgba(23, 162, 184, 0.12); }
.bg-success-light { background-color: rgba(40, 167, 69, 0.12); }
.bg-warning-light { background-color: rgba(255, 193, 7, 0.15); }

.class-card {
  transition: all 0.2s ease-in-out;
  border: 1px solid rgba(0,0,0,0.05) !important;
}
.class-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 22px rgba(0,0,0,0.09) !important;
}

.class-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
}
</style>
