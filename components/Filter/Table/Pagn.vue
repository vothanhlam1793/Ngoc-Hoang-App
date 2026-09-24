<template>
  <div class="filter-pagn-wrapper my-2">
    <div class="d-flex flex-column flex-md-row align-items-center justify-content-between p-2 bg-light rounded border">
      <div class="mb-2 mb-md-0 d-flex align-items-center">
        <span class="badge badge-primary px-3 py-2 mr-2">
          <i class="fas fa-user-graduate mr-1"></i> Tổng: {{ total }} học sinh
        </span>
        <span class="text-muted small">
          Trang <strong>{{ page }}</strong> / {{ totalPages }}
        </span>
      </div>
      <div class="btn-group btn-group-sm">
        <button
          class="btn btn-outline-primary px-3"
          :disabled="page === 1 || loading"
          @click="go(page - 1)"
        >
          <i class="fas fa-chevron-left mr-1"></i> Trang trước
        </button>
        <button
          class="btn btn-outline-primary px-3"
          :disabled="page === totalPages || loading"
          @click="go(page + 1)"
        >
          Trang sau <i class="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    page() {
      return this.$store.state.filter.hocsinh.page;
    },
    total() {
      return this.$store.state.filter.hocsinh.total;
    },
    loading() {
      return this.$store.state.filter.hocsinh.loading;
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.total / this.$store.state.filter.hocsinh.pageSize));
    },
  },
  methods: {
    go(page) {
      this.$store.dispatch("filter/hocsinh/getAllHocsinhs", page);
    },
  },
};
</script>

