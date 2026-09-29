<template>
  <div class="attendance-page pb-5 mb-5">
    <!-- Sub-Nav chuyển đổi nhanh Đi học - Ăn chiều - Về trễ -->
    <DiemDanhSubNav
      :year="$route.params.year"
      :month="$route.params.month"
      :date="$route.params.date"
      :classId="$route.params.id"
      currentTab="dihoc"
    />

    <!-- Compact Header: Nút quay lại + Tên lớp + Chọn Ngày với 2 Mũi Tên -->
    <div class="card border-0 shadow-sm rounded-lg mb-3 bg-white p-3">
      <div class="d-flex flex-wrap align-items-center justify-content-between">
        <div class="d-flex align-items-center mb-2 mb-sm-0">
          <nuxt-link
            :to="`/dihoc/${$route.params.year}/${$route.params.month}/${$route.params.id}`"
            class="btn btn-sm btn-light border rounded-pill px-2 py-1 font-weight-bold text-secondary mr-2"
            title="Quay lại sổ tháng"
          >
            <i class="fas fa-arrow-left"></i>
          </nuxt-link>
          <h5 class="font-weight-bold text-dark mb-0">
            {{ lophoc.name || 'Đang tải...' }}
          </h5>
        </div>

        <!-- Date Switcher: [ ◀ ] [ 📅 Date Picker ] [ ▶ ] -->
        <div class="date-switcher d-flex align-items-center bg-light border rounded-pill px-1 py-1">
          <button
            type="button"
            class="btn btn-sm btn-light rounded-circle nav-date-btn"
            @click="changeDateByOffset(-1)"
            title="Ngày trước đó"
          >
            <i class="fas fa-chevron-left text-secondary"></i>
          </button>

          <div class="date-picker-wrapper mx-1 position-relative" @click="openDatePicker">
            <span class="badge badge-success px-2 py-1 font-weight-bold text-white date-display-badge">
              <i class="fas fa-calendar-day mr-1"></i> {{ $route.params.date }}/{{ $route.params.month }}/{{ $route.params.year }}
            </span>
            <input
              ref="dateInput"
              type="date"
              class="hidden-date-input"
              :value="currentIsoDate"
              @change="onDateInputChange"
            />
          </div>

          <button
            type="button"
            class="btn btn-sm btn-light rounded-circle nav-date-btn"
            @click="changeDateByOffset(1)"
            title="Ngày tiếp theo"
          >
            <i class="fas fa-chevron-right text-secondary"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Stats Summary (Tổng / Có mặt / Vắng - Nhảy số realtime) -->
    <div class="row mb-3" v-if="lophoc && lophoc.hocsinhs">
      <div class="col-4 pr-1">
        <div class="stat-box bg-white p-2 rounded text-center shadow-sm border">
          <span class="text-muted small d-block">Sĩ số</span>
          <strong class="h5 font-weight-bold text-dark mb-0">{{ activeStudents.length }}</strong>
        </div>
      </div>
      <div class="col-4 px-1">
        <div class="stat-box bg-white p-2 rounded text-center shadow-sm border border-success">
          <span class="text-success small d-block font-weight-bold">Có mặt</span>
          <strong class="h5 font-weight-bold text-success mb-0">{{ presentCount }}</strong>
        </div>
      </div>
      <div class="col-4 pl-1">
        <div class="stat-box bg-white p-2 rounded text-center shadow-sm border border-danger">
          <span class="text-danger small d-block font-weight-bold">Vắng</span>
          <strong class="h5 font-weight-bold text-danger mb-0">{{ absentCount }}</strong>
        </div>
      </div>
    </div>

    <!-- Quick Actions 1-Chạm & Search Filter -->
    <div class="card border-0 shadow-sm rounded-lg mb-3 bg-white">
      <div class="card-body p-3">
        <!-- Quick Action Buttons -->
        <div class="d-flex flex-wrap gap-2 mb-3">
          <button
            type="button"
            class="btn btn-sm btn-success rounded-pill font-weight-bold px-3 mr-2 mb-1 shadow-sm"
            @click="setAllPresent"
          >
            <i class="fas fa-check-double mr-1"></i> Tất cả đi học ({{ activeStudents.length }})
          </button>

          <button
            type="button"
            class="btn btn-sm btn-outline-danger rounded-pill font-weight-bold px-3 mb-1"
            @click="setAllAbsent"
          >
            <i class="fas fa-times-circle mr-1"></i> Đặt tất cả vắng
          </button>
        </div>

        <!-- Search input -->
        <div class="input-group input-group-sm">
          <div class="input-group-prepend">
            <span class="input-group-text bg-light border-right-0"><i class="fas fa-search text-muted"></i></span>
          </div>
          <input
            type="text"
            class="form-control bg-light border-left-0"
            v-model="searchKeyword"
            placeholder="Tìm nhanh tên bé hoặc tên ở nhà..."
          />
          <div class="input-group-append" v-if="searchKeyword">
            <button class="btn btn-light border" type="button" @click="searchKeyword = ''">&times;</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Danh sách Học Sinh Touch Cards -->
    <div class="student-list-container">
      <DiemDanhItemDiemDanh
        v-for="(hocsinh, index) in filteredStudents"
        :hocsinh="hocsinh"
        :key="hocsinh.id"
        :index="index"
        @select-student="handleOpenStudentModal"
      />

      <div v-if="filteredStudents.length === 0" class="text-center py-5 text-muted bg-white rounded shadow-sm">
        <i class="fas fa-user-slash fa-2x mb-2 text-muted"></i>
        <p class="mb-0">Không tìm thấy học sinh nào khớp với từ khóa "{{ searchKeyword }}"</p>
      </div>
    </div>

    <!-- STICKY BOTTOM ACTION BAR (Tối ưu ngón tay cái trên Mobile) -->
    <div class="sticky-bottom-bar shadow-lg">
      <div class="container-fluid d-flex align-items-center justify-content-between px-3 py-2">
        <div class="d-flex flex-column">
          <span class="small text-muted font-weight-bold">Hiện diện:</span>
          <div class="font-weight-bold text-dark">
            <span class="text-success">{{ presentCount }}</span> / {{ activeStudents.length }} bé
          </div>
        </div>

        <button
          type="button"
          class="btn btn-success btn-save-touch rounded-pill px-4 py-2 font-weight-bold shadow"
          :disabled="saving"
          @click="saveDiemDanh"
        >
          <span v-if="saving"><i class="fas fa-spinner fa-spin mr-1"></i> Đang lưu...</span>
          <span v-else><i class="fas fa-save mr-1"></i> LƯU ĐIỂM DANH</span>
        </button>
      </div>
    </div>

    <!-- Popup Thông tin Học Sinh & Gọi Phụ Huynh -->
    <StudentQuickModal
      :student="selectedStudent"
      :className="lophoc ? lophoc.name : ''"
    />
  </div>
</template>

<script>
import DiemDanhItemDiemDanh from '~/components/DiemDanh/ItemDiemDanh.vue';
import StudentQuickModal from '~/components/DiemDanh/StudentQuickModal.vue';
import DiemDanhSubNav from '~/components/DiemDanh/DiemDanhSubNav.vue';

export default {
  layout: 'app',
  components: {
    DiemDanhItemDiemDanh,
    StudentQuickModal,
    DiemDanhSubNav
  },
  data() {
    return {
      searchKeyword: '',
      saving: false,
      selectedStudent: null
    };
  },
  computed: {
    lophoc() {
      return this.$store.state.ndd.lophoc || {};
    },
    monitor() {
      return this.$store.state.ndd.monitor;
    },
    stateLopHoc() {
      return this.$store.state.ndd.stateLopHoc;
    },
    activeStudents() {
      // Re-trigger whenever monitor changes
      const _ = this.monitor;
      if (!this.lophoc || !this.lophoc.hocsinhs) return [];
      const that = this;
      const list = this.lophoc.hocsinhs.filter(hs => hs.status !== 'NGHI_LUON');
      return list.sort((a, b) => {
        let t = (a.name || '').trim().split(' ');
        let u = (b.name || '').trim().split(' ');
        let lastNameA = that.chuyentiengviet(t[t.length - 1]);
        let lastNameB = that.chuyentiengviet(u[u.length - 1]);
        if (lastNameA < lastNameB) return -1;
        if (lastNameA > lastNameB) return 1;
        return 0;
      });
    },
    filteredStudents() {
      if (!this.searchKeyword.trim()) {
        return this.activeStudents;
      }
      const kw = this.chuyentiengviet(this.searchKeyword.trim().toLowerCase());
      return this.activeStudents.filter(hs => {
        const nameClean = this.chuyentiengviet((hs.name || '').toLowerCase());
        const sNameClean = this.chuyentiengviet((hs.sName || '').toLowerCase());
        const codeClean = (hs.code || '').toLowerCase();
        return nameClean.includes(kw) || sNameClean.includes(kw) || codeClean.includes(kw);
      });
    },
    presentCount() {
      const _ = this.monitor;
      if (!this.activeStudents) return 0;
      return this.activeStudents.filter(hs => hs.result === '1' && hs.status !== 'TAM_NGHI').length;
    },
    absentCount() {
      const _ = this.monitor;
      if (!this.activeStudents) return 0;
      return this.activeStudents.filter(hs => hs.result !== '1' && hs.status !== 'TAM_NGHI').length;
    },
    currentIsoDate() {
      const { year, month, date } = this.$route.params;
      return `${year}-${month}-${date}`;
    }
  },
  watch: {
    stateLopHoc(nS) {
      if (nS === 'READY') {
        this.$store.commit('ndd/mergeDiHocToLopHoc');
      }
    }
  },
  methods: {
    openDatePicker() {
      const input = this.$refs.dateInput;
      if (input) {
        if (typeof input.showPicker === 'function') {
          input.showPicker();
        } else {
          input.focus();
          input.click();
        }
      }
    },
    changeDateByOffset(offsetDays) {
      const { year, month, date, id } = this.$route.params;
      const cur = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(date, 10));
      cur.setDate(cur.getDate() + offsetDays);

      const nextYear = cur.getFullYear().toString();
      const nextMonth = ('0' + (cur.getMonth() + 1)).slice(-2);
      const nextDate = ('0' + cur.getDate()).slice(-2);

      this.$router.push(`/dihoc/${nextYear}/${nextMonth}/${nextDate}/${id}`);
    },
    onDateInputChange(e) {
      const val = e.target.value;
      if (!val) return;
      const [y, m, d] = val.split('-');
      const id = this.$route.params.id;
      this.$router.push(`/dihoc/${y}/${m}/${d}/${id}`);
    },
    chuyentiengviet(str) {
      if (!str) return '';
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    },
    handleOpenStudentModal(student) {
      this.selectedStudent = student;
      this.$bvModal.show('modal-student-quick-info');
    },
    setAllPresent() {
      this.$store.commit('ndd/setAllDiemDanh', '1');
    },
    setAllAbsent() {
      this.$store.commit('ndd/setAllDiemDanh', '0');
    },
    async saveDiemDanh() {
      this.saving = true;
      try {
        const saved = await this.$store.dispatch('ndd/createPhieuDiemDanh');
        if (!saved) return;
        this.$bvToast.toast(`Đã lưu điểm danh: ${saved.present} có mặt, ${saved.absent} vắng.`, {
          title: 'Đã lưu đầy đủ', variant: 'success', solid: true
        });
        if (saved.redirect) this.$router.replace(saved.redirect);
      } catch (e) {
        console.error('Error saving attendance:', e);
      } finally {
        this.saving = false;
      }
    }
  },
  created() {
    if (typeof window !== 'undefined') {
      this.$store.commit('ndd/updateStateEdit', 'create');
      this.$store.commit('ndd/updateType', 'DIHOCHANGNGAY');
      this.$store.commit('ndd/updateIdLopHoc', this.$route.params.id);
      this.$store.commit(
        'ndd/updateCode',
        `${this.$route.params.year}_${this.$route.params.month}_${this.$route.params.date}`
      );
      if (this.$store.$auth && this.$store.$auth.$state.user) {
        this.$store.commit('ndd/updateIdGiaoVien', this.$store.$auth.$state.user.id);
      }
      this.$store.dispatch('ndd/getLopHoc');
    }
  }
};
</script>

<style scoped>
.attendance-page {
  max-width: 768px;
  margin: 0 auto;
}

.stat-box {
  border-radius: 10px;
}

.sticky-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;
  z-index: 1030;
}

.btn-save-touch {
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.nav-date-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-picker-wrapper {
  cursor: pointer;
}

.date-display-badge {
  font-size: 0.82rem;
  pointer-events: none;
}

.hidden-date-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

@media (min-width: 992px) {
  .sticky-bottom-bar {
    left: 250px;
  }
}
</style>
