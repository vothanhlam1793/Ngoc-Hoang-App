<template>
  <div class="container-fluid py-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h4 class="font-weight-bold mb-1">
          <i class="fas fa-users-cog text-primary mr-2"></i> Quản Lý Danh Sách Học Sinh
        </h4>
        <p class="text-muted small mb-0">Tra cứu hồ sơ, phân lớp, tình trạng đi học và cập nhật biểu phí học sinh</p>
      </div>
      <div>
        <nuxt-link to="/hocsinh/create" class="btn btn-primary rounded-pill px-3 shadow-sm">
          <i class="fas fa-user-plus mr-1"></i> Tiếp nhận bé mới
        </nuxt-link>
      </div>
    </div>
    <FilterForm />
  </div>
</template>
<script>
export default {
  layout: "app"
};
</script>
