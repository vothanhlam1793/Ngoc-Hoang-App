<template>
  <div class="student-list mt-3">
    <!-- Header của bảng -->
    <div class="row px-3 py-2 text-muted font-weight-bold small border-bottom mb-2">
      <div class="col-md-3">HỌ VÀ TÊN BÉ</div>
      <div class="col-md-3">LỚP HỌC</div>
      <div class="col-md-3">PHỤ HUYNH & CÔNG NỢ</div>
      <div class="col-md-3 text-right">TRẠNG THÁI</div>
    </div>

    <!-- Trạng thái Loading -->
    <div v-if="loading" class="text-center py-5">
      <b-spinner variant="primary" label="Loading..."></b-spinner>
      <div class="text-muted mt-2 small">Đang tải danh sách học sinh...</div>
    </div>

    <!-- Danh sách không có dữ liệu -->
    <div v-else-if="!hocsinhs || !hocsinhs.length" class="text-center py-5 text-muted">
      <i class="fas fa-search fa-2x mb-2 d-block text-secondary"></i>
      Không tìm thấy học sinh nào phù hợp với bộ lọc.
    </div>

    <!-- Danh sách các hàng -->
    <div v-else>
      <ItemTable
        v-for="hocsinh in hocsinhs"
        :key="hocsinh.id"
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
