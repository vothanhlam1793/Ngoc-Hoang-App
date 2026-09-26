<template>
  <div class="container-fluid py-5 text-center">
    <b-spinner variant="primary" class="mb-3"></b-spinner>
    <p class="text-muted">Đang chuyển hướng sang Trung tâm Quản trị Cài đặt...</p>
  </div>
</template>

<script>
export default {
  layout: 'app',
  mounted() {
    this.$router.replace('/setup?tab=monapay');
  }
};
</script>
