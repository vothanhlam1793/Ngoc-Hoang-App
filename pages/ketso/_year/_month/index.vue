<template>
  <div class="container-fluid py-3 pb-5 ketso-page">
    <!-- Top Header -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
      <div>
        <h4 class="font-weight-bold mb-1 text-dark">
          <i class="fas fa-file-invoice-dollar text-primary mr-2"></i> Kết Sổ Học Phí Tháng {{ month }}/{{ year }}
        </h4>
        <p class="text-muted small mb-0">
          Tổng hợp học phí, số ngày nghỉ, các khoản phí và sinh phiếu thu VietQR cho từng lớp
        </p>
      </div>
      <div class="d-flex align-items-center mt-2 mt-md-0">
        <nuxt-link to="/dongtien" class="btn btn-sm btn-outline-success font-weight-bold rounded-pill px-3 mr-2">
          <i class="fas fa-exchange-alt mr-1"></i> Thu chi & Gạch nợ
        </nuxt-link>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary rounded-pill px-3"
          @click="refreshData"
        >
          <i class="fas fa-sync-alt mr-1"></i> Tải lại
        </button>
      </div>
    </div>

    <!-- Summary Counters & Time Filter -->
    <div class="row mb-4">
      <div class="col-12 col-md-4 mb-3 mb-md-0">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100">
          <label class="small font-weight-bold text-muted text-uppercase mb-2">
            <i class="fas fa-calendar-alt mr-1 text-primary"></i> Chọn kỳ kết sổ
          </label>
          <div class="row no-gutters">
            <div class="col-6 pr-1">
              <select v-model="month" class="form-control form-control-sm font-weight-bold" @change="changeTime">
                <option v-for="m in monthOptions" :key="m" :value="m">Tháng {{ m }}</option>
              </select>
            </div>
            <div class="col-6 pl-1">
              <select v-model="year" class="form-control form-control-sm font-weight-bold" @change="changeTime">
                <option v-for="y in yearOptions" :key="y" :value="y">Năm {{ y }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-4 mb-2 mb-md-0">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100 border-left-success">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small font-weight-bold text-uppercase d-block">Lớp đã kết sổ</span>
              <span class="h4 font-weight-bold text-success mb-0">{{ completedCount }} / {{ validClasses.length }}</span>
            </div>
            <div class="stat-icon bg-success-light text-success">
              <i class="fas fa-check-circle"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-4 mb-2 mb-md-0">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100 border-left-warning">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="text-muted small font-weight-bold text-uppercase d-block">Lớp chưa kết sổ</span>
              <span class="h4 font-weight-bold text-warning mb-0">{{ validClasses.length - completedCount }}</span>
            </div>
            <div class="stat-icon bg-warning-light text-warning">
              <i class="fas fa-hourglass-half"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Classes Table -->
    <div class="card border-0 shadow-sm rounded-lg overflow-hidden bg-white">
      <div class="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
        <h6 class="font-weight-bold text-dark mb-0">
          <i class="fas fa-list-ul text-primary mr-2"></i> Danh Sách Lớp Học Kỳ {{ month }}/{{ year }}
        </h6>
        <span class="badge badge-light border px-2 py-1 text-muted">
          Tổng cộng {{ validClasses.length }} lớp
        </span>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="thead-light">
            <tr>
              <th style="width: 50px;" class="text-center">STT</th>
              <th>Tên Lớp Học</th>
              <th style="width: 180px;" class="text-center">Trạng Thái Kết Sổ</th>
              <th style="width: 360px;" class="text-right">Thao Tác Nghiệp Vụ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(lophoc, idx) in validClasses" :key="lophoc.id">
              <td class="text-center font-weight-bold text-muted">{{ idx + 1 }}</td>
              <td>
                <div class="font-weight-bold text-dark" style="font-size: 1.05rem;">
                  {{ lophoc.name }}
                </div>
                <small class="text-muted" v-if="lophoc.chunhiem && lophoc.chunhiem.length">
                  GV: {{ lophoc.chunhiem.map(u => u.name).filter(Boolean).join(', ') }}
                </small>
              </td>
              <td class="text-center">
                <span
                  v-if="isSaved(lophoc)"
                  class="badge badge-success px-3 py-2 font-weight-bold shadow-sm"
                >
                  <i class="fas fa-check-double mr-1"></i> Đã kết sổ
                </span>
                <span
                  v-else
                  class="badge badge-light text-secondary border px-3 py-2 font-weight-bold"
                >
                  <i class="far fa-circle mr-1"></i> Chưa kết sổ
                </span>
              </td>
              <td class="text-right">
                <div v-if="isSaved(lophoc)" class="d-inline-flex align-items-center gap-1">
                  <!-- Xem chi tiết kết sổ -->
                  <a
                    class="btn btn-sm btn-outline-primary rounded-pill px-3 font-weight-semibold mr-1"
                    :href="`/ketso/${year}/${month}/${lophoc.id}/view`"
                    title="Xem chi tiết bảng tính kết sổ"
                  >
                    <i class="fas fa-eye mr-1"></i> Xem sổ
                  </a>

                  <!-- Phiếu học phí VietQR chuẩn V2 -->
                  <a
                    class="btn btn-sm btn-success rounded-pill px-3 font-weight-bold shadow-sm mr-2"
                    :href="`/ketso/${year}/${month}/${lophoc.id}/show?v=2`"
                    title="Mở mẫu phiếu học phí có mã VietQR động gửi phụ huynh"
                  >
                    <i class="fas fa-qrcode mr-1"></i> Phiếu VietQR
                  </a>

                  <!-- Xóa kết sổ có bảo vệ -->
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger rounded-circle p-0 action-delete-btn"
                    title="Xóa phiếu kết sổ lớp này"
                    @click="openDeleteModal(lophoc)"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
                <div v-else>
                  <a
                    class="btn btn-sm btn-primary rounded-pill px-3 font-weight-bold shadow-sm"
                    :href="`/ketso/${year}/${month}/${lophoc.id}`"
                  >
                    <i class="fas fa-calculator mr-1"></i> Tạo kết sổ ngay
                  </a>
                </div>
              </td>
            </tr>
            <tr v-if="!validClasses.length">
              <td colspan="4" class="text-center py-5 text-muted">
                <i class="fas fa-folder-open mb-2" style="font-size: 2rem;"></i>
                <div>Đang tải hoặc chưa có danh sách lớp học.</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Xác Nhận Xóa Kết Sổ An Toàn -->
    <b-modal
      v-model="deleteModalOpen"
      title="Xác nhận xoá phiếu kết sổ"
      hide-footer
      header-bg-variant="danger"
      header-text-variant="white"
    >
      <div v-if="selectedClassToDelete">
        <p class="text-danger font-weight-bold mb-2">
          <i class="fas fa-exclamation-triangle mr-1"></i> Cảnh báo mất dữ liệu tính toán!
        </p>
        <p class="small text-muted mb-3">
          Bạn đang yêu cầu xoá toàn bộ dữ liệu kết sổ của lớp <strong>{{ selectedClassToDelete.name }}</strong> trong kỳ <strong>Tháng {{ month }}/{{ year }}</strong>. Các số liệu tính bù trừ học phí và ngày nghỉ của các bé sẽ bị huỷ.
        </p>
        <div class="form-group">
          <label class="small font-weight-bold text-dark">
            Nhập chữ <strong>XOA</strong> vào ô bên dưới để xác nhận:
          </label>
          <input
            v-model.trim="deleteConfirmText"
            type="text"
            class="form-control"
            placeholder="Gõ chữ XOA để tiếp tục..."
          />
        </div>
        <div class="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            class="btn btn-secondary mr-2"
            :disabled="deleting"
            @click="deleteModalOpen = false"
          >
            Đóng
          </button>
          <button
            type="button"
            class="btn btn-danger font-weight-bold"
            :disabled="deleting || deleteConfirmText !== 'XOA'"
            @click="confirmDeleteKetSo"
          >
            <i class="fas fa-trash-alt mr-1" :class="{ 'fa-spin': deleting }"></i>
            {{ deleting ? 'Đang xoá...' : 'Xác nhận xoá vĩnh viễn' }}
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import gql from 'graphql-tag';

export default {
  layout: 'app',
  data() {
    return {
      year: '',
      month: '',
      monthOptions: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      deleteModalOpen: false,
      selectedClassToDelete: null,
      deleteConfirmText: '',
      deleting: false
    };
  },
  computed: {
    yearOptions() {
      const current = new Date().getFullYear();
      const list = [];
      for (let y = current - 3; y <= current + 2; y++) {
        list.push(String(y));
      }
      return list;
    },
    lophocs() {
      return this.$store.state.lophoc.lophocs || [];
    },
    validClasses() {
      return this.lophocs.filter(c => {
        if (!c || !c.name) return false;
        const name = c.name.trim().toLowerCase();
        if (name === 'dư cần xoá' || name === 'du can xoa' || name === 'null') return false;
        return true;
      });
    },
    phieuketsos() {
      return this.$store.state.ketso.searchPhieuKetSos || [];
    },
    completedCount() {
      return this.validClasses.filter(c => this.isSaved(c)).length;
    }
  },
  mounted() {
    this.year = this.$route.params.year || String(new Date().getFullYear());
    this.month = this.$route.params.month || String(new Date().getMonth() + 1).padStart(2, '0');
    this.loadData();
  },
  methods: {
    loadData() {
      this.$store.dispatch('lophoc/getAllLopHoc');
      this.$store.dispatch('ketso/searchKetSo', {
        code: `${this.year}_${this.month}`
      });
    },
    refreshData() {
      this.loadData();
    },
    changeTime() {
      this.$router.push(`/ketso/${this.year}/${this.month}`);
      this.$store.dispatch('ketso/searchKetSo', {
        code: `${this.year}_${this.month}`
      });
    },
    getKetSo(lh) {
      if (!this.phieuketsos || !this.phieuketsos.length) return { status: 'NONE' };
      const found = this.phieuketsos.find(p => p.lophoc && String(p.lophoc.id) === String(lh.id));
      return found || { status: 'NONE' };
    },
    isSaved(lh) {
      return this.getKetSo(lh).status === 'SAVED';
    },
    openDeleteModal(lophoc) {
      this.selectedClassToDelete = lophoc;
      this.deleteConfirmText = '';
      this.deleteModalOpen = true;
    },
    async confirmDeleteKetSo() {
      if (!this.selectedClassToDelete || this.deleteConfirmText !== 'XOA' || this.deleting) return;
      const pks = this.getKetSo(this.selectedClassToDelete);
      if (!pks || !pks.id) return;

      this.deleting = true;
      try {
        const client = this.$apollo?.defaultClient || this.$apolloProvider?.defaultClient;
        await client.mutate({
          mutation: gql`
            mutation deletePhieuKetSo($id: ID!) {
              deletePhieuKetSo(id: $id) {
                id
              }
            }
          `,
          variables: { id: pks.id }
        });
        this.deleteModalOpen = false;
        this.selectedClassToDelete = null;
        this.loadData();
      } catch (err) {
        console.error('Error deleting phieu ket so:', err);
        alert('Có lỗi xảy ra khi xoá phiếu kết sổ: ' + (err.message || 'Lỗi server'));
      } finally {
        this.deleting = false;
      }
    }
  }
};
</script>

<style scoped>
.ketso-page {
  min-height: 80vh;
}

.border-left-success {
  border-left: 4px solid #28a745 !important;
}

.border-left-warning {
  border-left: 4px solid #ffc107 !important;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.bg-success-light {
  background-color: rgba(40, 167, 69, 0.12);
}

.bg-warning-light {
  background-color: rgba(255, 193, 7, 0.15);
}

.action-delete-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}
</style>
