<template>
  <div class="student-item-row mb-2">
    <div
      class="row align-items-center bg-white p-2 mx-0 rounded border shadow-sm item-header"
      @click="run()"
    >
      <div class="col-md-3 font-weight-bold text-dark d-flex align-items-center">
        <i class="fas fa-chevron-right mr-2 text-muted chevron-icon" :class="{ 'rotate-90': isOpen }"></i>
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
      <div class="col-md-3 text-right">
        <span :class="['badge px-2 py-1', statusBadgeClass(hocsinh.status)]">
          {{ statusLabel(hocsinh.status) }}
        </span>
      </div>
    </div>

    <!-- Collapse Chi tiết -->
    <div :id="'demo' + hocsinh.id" class="collapse mt-2">
      <div class="p-3 bg-white border rounded shadow-sm" v-if="loadItem">
        <b-tabs content-class="mt-3" pills>
          <b-tab title="Hồ sơ học sinh" active>
            <Info :hocsinh="hocsinh" />
          </b-tab>
          <b-tab title="Sổ nợ & Học phí" @click="loadData()">
            <Debt :hocsinh="hocsinh" :loadData="loadDataDebt" />
          </b-tab>
          <b-tab title="Liên hệ Phụ huynh">
            <Parent :hocsinh="hocsinh" />
          </b-tab>
        </b-tabs>
      </div>
    </div>
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
      isOpen: false,
    };
  },
  methods: {
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
    run() {
      this.loadItem = true;
      this.isOpen = !this.isOpen;
      $('#demo' + this.hocsinh.id).collapse('toggle');
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
  background-color: #f8f9fa !important;
  border-color: #b8daff !important;
}
.chevron-icon {
  font-size: 0.75rem;
  transition: transform 0.2s ease-in-out;
}
.rotate-90 {
  transform: rotate(90deg);
}
</style>
