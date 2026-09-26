<template>
  <div class="container-fluid py-3">
    <NhanSuSetting />
  </div>
</template>

<script>
import NhanSuSetting from '~/components/Setup/NhanSuSetting.vue';

export default {
  layout: 'app',
  components: {
    NhanSuSetting
  },
  head() {
    return {
      title: 'Quản Lý Nhân Sự & Phân Quyền - MN Ngọc Hoàng'
    };
  }
};
</script>
