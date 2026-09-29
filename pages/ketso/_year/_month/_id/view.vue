<template>
  <div class="container-fluid py-3 pb-5 ketso-view-page">
    <!-- Top Nav & Actions -->
    <div class="card border-0 shadow-sm rounded-lg mb-3 bg-white p-3">
      <div class="d-flex flex-wrap justify-content-between align-items-center">
        <div class="d-flex align-items-center mb-2 mb-md-0">
          <nuxt-link
            :to="`/ketso/${year}/${month}`"
            class="btn btn-sm btn-light border rounded-pill px-3 font-weight-bold text-secondary mr-3"
            title="Quay lại danh sách lớp"
          >
            <i class="fas fa-arrow-left mr-1"></i> Danh sách lớp
          </nuxt-link>
          <div>
            <h4 class="font-weight-bold text-dark mb-0">
              SỔ KẾT SỔ LỚP {{ className }} • THÁNG {{ month }}/{{ year }}
            </h4>
            <span class="text-muted small">
              Trạng thái: <strong class="text-success"><i class="fas fa-check-circle mr-1"></i> ĐÃ CHỐT SỔ</strong> • Sĩ số: {{ studentList.length }} học sinh
            </span>
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <!-- Nút Tính toán lại -->
          <button
            type="button"
            class="btn btn-sm btn-outline-warning font-weight-bold rounded-pill px-3 mr-2 shadow-sm"
            @click="calculation"
          >
            <i class="fas fa-redo-alt mr-1"></i> Mở lại tính toán
          </button>

          <!-- Nút Mở Phiếu VietQR -->
          <a
            class="btn btn-sm btn-success font-weight-bold rounded-pill px-4 shadow-sm"
            :href="`/ketso/${year}/${month}/${idLopHoc}/show?v=2`"
            target="_blank"
          >
            <i class="fas fa-qrcode mr-1"></i> Xuất Phiếu VietQR Cả Lớp
          </a>
        </div>
      </div>
    </div>

    <!-- Quick Financial Counters của Lớp -->
    <div class="row mb-3">
      <div class="col-6 col-md-3 mb-2 mb-md-0">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100 border-left-primary">
          <span class="text-muted small font-weight-bold text-uppercase d-block">Sĩ số lớp</span>
          <span class="h4 font-weight-bold text-dark mb-0">{{ studentList.length }} <small class="text-muted font-weight-normal" style="font-size: 0.9rem;">bé</small></span>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-2 mb-md-0">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100 border-left-info">
          <span class="text-muted small font-weight-bold text-uppercase d-block">Tổng học phí gốc</span>
          <span class="h4 font-weight-bold text-info mb-0">{{ formatMoney(totalBaseTuition) }} đ</span>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-2 mb-md-0">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100 border-left-danger">
          <span class="text-muted small font-weight-bold text-uppercase d-block">Tổng tiền trừ nghỉ</span>
          <span class="h4 font-weight-bold text-danger mb-0">-{{ formatMoney(totalAbsentRefund) }} đ</span>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-2 mb-md-0">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100 border-left-success">
          <span class="text-muted small font-weight-bold text-uppercase d-block">Tổng thực thu đã chốt</span>
          <span class="h4 font-weight-bold text-success mb-0">{{ formatMoney(totalNetReceivable) }} đ</span>
        </div>
      </div>
    </div>

    <!-- Main View Table -->
    <div class="card border-0 shadow-sm rounded-lg overflow-hidden bg-white mb-4">
      <div class="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
        <h6 class="font-weight-bold text-dark mb-0">
          <i class="fas fa-table text-primary mr-2"></i> Bảng Số Liệu Học Phí Đã Chốt
        </h6>
        <span class="badge badge-light border px-2 py-1 text-muted">
          {{ studentList.length }} học sinh
        </span>
      </div>

      <div class="table-responsive table-sticky-wrapper">
        <table class="table table-bordered table-hover align-middle mb-0 fee-view-table">
          <thead class="thead-light sticky-header">
            <tr class="text-center small font-weight-bold text-uppercase">
              <th style="min-width: 170px;" class="text-left sticky-col-first">Họ và Tên Bé</th>
              <th style="min-width: 110px;" class="text-success text-right">Tổng Thu (đ)</th>
              <th style="min-width: 100px;">Học Phí</th>
              <th style="min-width: 90px;">CSVC</th>
              <th style="min-width: 85px;">Camera</th>
              <th style="min-width: 95px;">Phí Mở Rộng</th>
              <th style="min-width: 85px;">Khoản Khác</th>
              <th style="min-width: 120px;">Diễn Giải</th>
              <th style="min-width: 75px;">Nghỉ (ngày)</th>
              <th style="min-width: 100px;" class="text-danger text-right">Trừ Tiền Nghỉ</th>
            </tr>
          </thead>
          <tbody>
            <KetSoView
              v-for="item in studentList"
              :key="item.id"
              :item="item"
            />
            <tr v-if="!studentList.length">
              <td colspan="10" class="text-center py-5 text-muted">
                <i class="fas fa-spinner fa-spin mr-1"></i> Đang nạp dữ liệu sổ kết sổ...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'app',
  data() {
    return {
      year: '',
      month: '',
      idLopHoc: ''
    };
  },
  computed: {
    phieuketso() {
      return this.$store.state.pks.phieuketso || {};
    },
    className() {
      return this.phieuketso?.lophoc?.name || '...';
    },
    studentList() {
      return this.phieuketso?.items || [];
    },
    totalBaseTuition() {
      return this.studentList.reduce((sum, item) => sum + (Number(item?.data?.hocphi) || 0), 0);
    },
    totalAbsentRefund() {
      return this.studentList.reduce((sum, item) => sum + (Number(item?.data?.thanhtiennghi) || 0), 0);
    },
    totalNetReceivable() {
      return this.studentList.reduce((sum, item) => sum + (Number(item?.data?.total) || 0), 0);
    }
  },
  mounted() {
    this.year = this.$route.params.year;
    this.month = this.$route.params.month;
    this.idLopHoc = this.$route.params.id;

    this.$store.commit('pks/updateCode', `${this.year}_${this.month}`);
    this.$store.commit('pks/updateIdLopHoc', this.idLopHoc);
    this.$store.dispatch('pks/createOrUpdatePhieuKetSo');
  },
  methods: {
    formatMoney(val) {
      return Number(val || 0).toLocaleString('vi-VN');
    },
    calculation() {
      if (confirm('Phiếu này đã được chốt, bạn có chắc chắn muốn mở lại để chỉnh sửa tính toán?')) {
        this.$router.push(`/ketso/${this.year}/${this.month}/${this.idLopHoc}`);
      }
    }
  }
};
</script>

<style scoped>
.ketso-view-page {
  min-height: 85vh;
}

.border-left-primary { border-left: 4px solid #007bff !important; }
.border-left-info { border-left: 4px solid #17a2b8 !important; }
.border-left-danger { border-left: 4px solid #dc3545 !important; }
.border-left-success { border-left: 4px solid #28a745 !important; }

/* Sticky Container with Max Height */
.table-sticky-wrapper {
  max-height: 68vh;
  overflow-y: auto;
  overflow-x: auto;
  position: relative;
}

/* Sticky Header (Vertical) */
.fee-view-table thead.sticky-header th {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f8f9fa !important;
  box-shadow: inset 0 -1px 0 #dee2e6, 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Sticky First Column (Horizontal Freeze) */
.fee-view-table thead th.sticky-col-first {
  position: sticky;
  left: 0;
  top: 0;
  z-index: 15;
  background-color: #f1f3f5 !important;
  box-shadow: inset -1px 0 0 #dee2e6, inset 0 -1px 0 #dee2e6, 2px 0 4px rgba(0, 0, 0, 0.04);
}

.fee-view-table th,
.fee-view-table td {
  vertical-align: middle;
  padding: 0.45rem 0.5rem;
  font-size: 0.9rem;
}
</style>
