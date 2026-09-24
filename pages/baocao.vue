<template>
  <div class="container-fluid py-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h4 class="font-weight-bold mb-1">
          <i class="fas fa-chart-line text-success mr-2"></i> Báo Cáo Thống Kê Số Liệu
        </h4>
        <p class="text-muted small mb-0">Tổng hợp doanh thu học phí, số liệu chuyên cần và công nợ theo giai đoạn</p>
      </div>
    </div>
    <FormBaoCao />
  </div>
</template>
<script>
import FormBaoCao from '~/components/BaoCao/V1/Form.vue';
export default {
  components: {
    FormBaoCao
  },
  layout: "app"
};
</script>
