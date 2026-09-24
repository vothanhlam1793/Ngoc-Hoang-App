<template>
  <div class="row">
    <div class="col-lg-3 mb-3 mb-lg-0">
      <FilterElement />
    </div>
    <div class="col-lg-9">
      <HocSinhCreateModal />
      <div class="card shadow-sm border-0">
        <div class="card-body p-3">
          <FilterResult :hocsinhs="hocsinhs" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    hocsinhs() {
      return this.$store.state.filter.hocsinh.filterHocsinhs || [];
    },
  },
};
</script>

