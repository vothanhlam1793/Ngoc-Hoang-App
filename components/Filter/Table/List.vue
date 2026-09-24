<template>
  <div class="student-list mt-3 position-relative">
    <!-- Header của bảng -->
    <div class="row px-3 py-2 text-muted font-weight-bold small border-bottom mb-2 bg-light rounded">
      <div class="col-md-3">HỌ VÀ TÊN BÉ</div>
      <div class="col-md-3">LỚP HỌC</div>
      <div class="col-md-3">PHỤ HUYNH & CÔNG NỢ</div>
      <div class="col-md-3 text-right">TRẠNG THÁI</div>
    </div>

    <!-- Spinner Loading mượt mà -->
    <div v-if="loading" class="text-center py-5">
      <b-spinner variant="primary" style="width: 2.5rem; height: 2.5rem;" label="Loading..."></b-spinner>
      <div class="text-muted mt-3 font-weight-bold">Đang tải và lọc dữ liệu học sinh...</div>
    </div>

    <!-- Danh sách không có dữ liệu -->
    <div v-else-if="!hocsinhs || !hocsinhs.length" class="text-center py-5 text-muted">
      <i class="fas fa-user-slash fa-3x mb-3 text-secondary opacity-50"></i>
      <div class="h6 font-weight-bold text-dark">Không tìm thấy học sinh nào</div>
      <p class="small text-muted mb-0">Thử thay đổi từ khoá tìm kiếm, tích chọn lớp hoặc chọn lại trạng thái.</p>
    </div>

    <!-- Danh sách các hàng -->
    <div v-else class="animated-fade-in">
      <ItemTable
        v-for="hocsinh in hocsinhs"
        :key="'st-' + hocsinh.id"
        :hocsinh="hocsinh"
      />
    </div>
  </div>
</template>

<script>
import ItemTable from '~/components/Filter/Table/ItemTable.vue';

export default {
  components: {
    ItemTable,
  },
  props: ['hocsinhs'],
  computed: {
    loading() {
      return this.$store.state.filter.hocsinh.loading;
    },
  },
};
</script>

<style scoped>
.animated-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

