<template>
  <tr>
    <td class="font-weight-semibold text-dark sticky-col-student">{{ item.hocsinh ? item.hocsinh.name : '' }}</td>
    <td class="text-right font-weight-bold text-success">{{ numberWithCommas(item.data.total) }}</td>
    <td class="text-right">{{ numberWithCommas(item.data.hocphi) }}</td>
    <td class="text-right">{{ numberWithCommas(item.data.csvc) }}</td>
    <td class="text-right">{{ numberWithCommas(item.data.camera) }}</td>
    <td class="text-right">
      {{ numberWithCommas(item.data.phimorong) }}
      <b-button
        size="sm"
        variant="light"
        class="border py-0 px-1 ml-1"
        :key="`btn-${item.id}`"
        @click="showModal(`md-${item.id}`)"
      >
        <i class="fas fa-ellipsis-h"></i>
      </b-button>
      <b-modal
        :key="`md-${item.id}`"
        :id="`md-${item.id}`"
        :title="`Chi tiết phí mở rộng: ${item.hocsinh ? item.hocsinh.name : ''}`"
        ok-only
        ok-title="Đóng"
      >
        <table class="table table-bordered table-striped mb-0">
          <thead>
            <tr>
              <th>Khoản phí</th>
              <th class="text-right">Số tiền (đ)</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="key in Object.keys(item.data.detailPhiMoRong || {})"
              :key="key"
              :class="getClass(item.data.detailPhiMoRong[key].checked)"
            >
              <td>{{ item.data.detailPhiMoRong[key].label }}</td>
              <td class="text-right">
                {{ numberWithCommas(item.data.detailPhiMoRong[key].value) }}
              </td>
            </tr>
          </tbody>
        </table>
      </b-modal>
    </td>
    <td class="text-right">{{ numberWithCommas(item.data.khac) }}</td>
    <td class="small text-muted">{{ item.data.note }}</td>
    <td class="text-center font-weight-bold">{{ numberWithCommas(item.data.ngaynghi) }}</td>
    <td class="text-right text-danger font-weight-bold">{{ numberWithCommas(item.data.thanhtiennghi) }}</td>
  </tr>
</template>

<script>
export default {
  props: ['item'],
  methods: {
    getClass(checked) {
      return checked ? 'table-success' : '';
    },
    showModal(id) {
      this.$bvModal.show(id);
    },
    numberWithCommas(x) {
      if (!x) return '0';
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
  }
};
</script>

<style scoped>
.sticky-col-student {
  position: sticky;
  left: 0;
  z-index: 5;
  background-color: #ffffff !important;
  box-shadow: inset -1px 0 0 #dee2e6, 2px 0 4px rgba(0, 0, 0, 0.04);
}
tr:hover .sticky-col-student {
  background-color: #f8f9fa !important;
}
</style>
