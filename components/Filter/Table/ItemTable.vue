<template>
  <div class="student-item-row mb-2">
    <!-- Dòng hiển thị học sinh -->
    <div
      class="row align-items-center bg-white p-2 mx-0 rounded border shadow-sm item-header"
      @click="openModal()"
    >
      <div class="col-md-3 font-weight-bold text-dark d-flex align-items-center">
        <div class="avatar-mini mr-2 bg-primary-light text-primary">
          <i class="fas fa-child"></i>
        </div>
        <span>{{ hocsinh.name }}</span>
      </div>
      <div class="col-md-3 text-secondary">
        <i class="fas fa-chalkboard mr-1 text-info"></i> {{ (hocsinh.lophoc && hocsinh.lophoc.name) || 'Chưa phân lớp' }}
      </div>
      <div class="col-md-3">
        <span v-if="hocsinh.parent">
          <small class="text-muted d-block">{{ hocsinh.parent.name }}</small>
          <strong :class="hocsinh.parent.debt > 0 ? 'text-danger' : 'text-success'">
            {{ numberWithCommas(hocsinh.parent.debt) }} đ
          </strong>
        </span>
        <span v-else class="text-muted small">Chưa gán PH</span>
      </div>
      <div class="col-md-3 text-right d-flex align-items-center justify-content-end">
        <span :class="['badge px-2 py-1 mr-2', statusBadgeClass(hocsinh.status)]">
          {{ statusLabel(hocsinh.status) }}
        </span>
        <button
          class="btn btn-sm btn-outline-primary rounded-pill px-2 py-0"
          title="Xem chi tiết"
          @click.stop="openModal()"
        >
          <i class="fas fa-eye mr-1"></i> Chi tiết
        </button>
      </div>
    </div>

    <!-- Modal Chi tiết Học sinh -->
    <b-modal
      v-model="showModal"
      size="xl"
      hide-footer
      header-class="bg-light border-bottom-0 pb-0"
      body-class="pt-2"
    >
      <template #modal-title>
        <div class="d-flex align-items-center">
          <div class="avatar-modal-title mr-3 bg-primary text-white">
            <i class="fas fa-user-graduate"></i>
          </div>
          <div>
            <h5 class="font-weight-bold text-dark mb-0">
              {{ hocsinh.name }}
              <span :class="['badge ml-2', statusBadgeClass(hocsinh.status)]">
                {{ statusLabel(hocsinh.status) }}
              </span>
            </h5>
            <small class="text-muted">
              Lớp: <strong>{{ (hocsinh.lophoc && hocsinh.lophoc.name) || 'Chưa phân lớp' }}</strong> |
              Phụ huynh: <strong>{{ (hocsinh.parent && hocsinh.parent.name) || 'Chưa có' }}</strong>
              <span v-if="hocsinh.parent && hocsinh.parent.code">({{ hocsinh.parent.code }})</span>
            </small>
          </div>
        </div>
      </template>

      <!-- Nội dung Tabs -->
      <div v-if="loadItem" class="pt-2">
        <b-tabs content-class="mt-3" pills fill nav-wrapper-class="mb-3">
          <b-tab active>
            <template #title>
              <i class="fas fa-id-card mr-1"></i> Hồ sơ học sinh
            </template>
            <div class="card border-0 bg-light p-3 rounded">
              <Info :hocsinh="hocsinh" />
            </div>
          </b-tab>

          <b-tab @click="loadData()">
            <template #title>
              <i class="fas fa-file-invoice-dollar mr-1"></i> Sổ nợ & Biến động học phí
            </template>
            <div class="card border-0 bg-light p-3 rounded">
              <Debt :hocsinh="hocsinh" :loadData="loadDataDebt" />
            </div>
          </b-tab>

          <b-tab>
            <template #title>
              <i class="fas fa-phone-alt mr-1"></i> Liên hệ Phụ huynh
            </template>
            <div class="card border-0 bg-light p-3 rounded">
              <Parent :hocsinh="hocsinh" />
            </div>
          </b-tab>
        </b-tabs>
      </div>

      <div class="d-flex justify-content-end mt-4 pt-3 border-top">
        <button class="btn btn-secondary rounded-pill px-4" @click="showModal = false">
          Đóng
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Info from '~/components/Filter/Table/Info/Index.vue';
import Debt from '~/components/Filter/Table/Debt/Index.vue';
import Parent from '~/components/HocSinh/Info.vue';

export default {
  components: {
    Info,
    Debt,
    Parent,
  },
  props: ['hocsinh'],
  data: () => {
    return {
      loadDataDebt: false,
      loadItem: false,
      showModal: false,
    };
  },
  methods: {
    openModal() {
      this.loadItem = true;
      this.showModal = true;
    },
    loadData() {
      this.loadDataDebt = true;
    },
    numberWithCommas(x) {
      if (!x && x !== 0) return '0';
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
    statusLabel(st) {
      if (st === 'DANG_HOC') return 'Đang học';
      if (st === 'TAM_NGHI') return 'Tạm nghỉ';
      if (st === 'DANG_KY') return 'Đăng ký';
      if (st === 'NGHI_LUON') return 'Nghỉ luôn';
      return st || 'Chưa rõ';
    },
    statusBadgeClass(st) {
      if (st === 'DANG_HOC') return 'badge-success';
      if (st === 'TAM_NGHI') return 'badge-warning text-dark';
      if (st === 'DANG_KY') return 'badge-info';
      if (st === 'NGHI_LUON') return 'badge-secondary';
      return 'badge-light border';
    },
  },
};
</script>

<style scoped>
.item-header {
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}
.item-header:hover {
  background-color: #f0f7ff !important;
  border-color: #70b5ff !important;
  transform: translateY(-1px);
}
.avatar-mini {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}
.avatar-modal-title {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}
.bg-primary-light {
  background-color: rgba(13, 110, 253, 0.12);
}
</style>

