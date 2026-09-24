<template>
  <div class="container-fluid py-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h4 class="font-weight-bold mb-1">
          <i class="fas fa-receipt text-info mr-2"></i> Báo Cáo Phiếu Thu / Chi Theo Ngày
        </h4>
        <p class="text-muted small mb-0">Theo dõi chi tiết các phiếu thu học phí, hoàn tiền và chi nội bộ theo ngày</p>
      </div>
      <div>
        <nuxt-link to="/dongtien" class="btn btn-outline-success">
          <i class="fas fa-wallet mr-1"></i> Sổ cái Dòng tiền
        </nuxt-link>
      </div>
    </div>
    <FormBaoCao />
  </div>
</template>
<script>
import FormBaoCao from '~/components/PhieuThu/Form.vue';
export default {
  components: {
    FormBaoCao,
  },
  layout: "app"
};
</script>
