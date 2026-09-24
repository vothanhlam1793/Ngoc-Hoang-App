<template>
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text bg-white border-right-0 rounded-left-pill">
        <i class="fas fa-search text-muted"></i>
      </span>
    </div>
    <input
      type="text"
      class="form-control border-left-0 rounded-right-pill"
      v-model="findByName"
      placeholder="Tìm theo tên học sinh, lớp học, hoặc tên phụ huynh..."
      @input="search"
    />
    <div v-if="findByName" class="input-group-append">
      <button class="btn btn-outline-secondary rounded-pill ml-2" @click="clearSearch">
        <i class="fas fa-times"></i> Xoá tìm kiếm
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      findByName: "",
      searchTimer: null,
    };
  },
  methods: {
    search() {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.$store.commit("filter/hocsinh/updateSearchName", this.findByName);
        this.$store.dispatch("filter/hocsinh/applyFilters");
      }, 300);
    },
    clearSearch() {
      this.findByName = "";
      this.$store.commit("filter/hocsinh/updateSearchName", "");
      this.$store.dispatch("filter/hocsinh/applyFilters");
    },
  },
  beforeDestroy() {
    clearTimeout(this.searchTimer);
  },
};
</script>

