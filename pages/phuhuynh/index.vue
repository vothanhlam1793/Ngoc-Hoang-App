<template>
  <div class="container-fluid py-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h4 class="font-weight-bold mb-1">
          <i class="fas fa-user-friends text-primary mr-2"></i> Danh bạ Phụ Huynh & Sổ Nợ
        </h4>
        <p class="text-muted small mb-0">Tra cứu nhanh hồ sơ phụ huynh, số dư ví và biến động công nợ</p>
      </div>
      <div>
        <nuxt-link to="/dongtien" class="btn btn-outline-success mr-2">
          <i class="fas fa-exchange-alt mr-1"></i> Dòng tiền & Gạch nợ
        </nuxt-link>
      </div>
    </div>
    <FormPhuHuynh />
  </div>
</template>

<script>
import FormPhuHuynh from '~/components/PhuHuynh/Form.vue';

export default {
  layout: "app",
  components: {
    FormPhuHuynh
  }
};
</script>