<template>
  <div class="filter-classes">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div class="custom-control custom-checkbox">
        <input
          type="checkbox"
          class="custom-control-input"
          id="select-all-classes"
          v-model="choseAll"
          @change="changed()"
        />
        <label class="custom-control-label font-weight-bold" for="select-all-classes">Tất cả các lớp</label>
      </div>
    </div>
    <div class="class-list-scrollable pr-1">
      <FilterEle1ItemCheck
        v-for="lophoc in validLopHocs"
        :lophoc="lophoc"
        :key="lophoc.id"
      />
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      choseAll: true,
    };
  },
  methods: {
    changed() {
      this.$store.commit("filter/hocsinh/updateFilterEle1All", this.choseAll);
      this.$store.dispatch("filter/hocsinh/applyFilters");
    },
  },
  watch: {
    choseAllState: function (nV) {
      this.choseAll = nV;
    },
  },
  computed: {
    lophocs() {
      return this.$store.state.filter.hocsinh.lophocs || [];
    },
    validLopHocs() {
      return (this.lophocs || []).filter((l) => l.name);
    },
    choseAllState() {
      return this.$store.state.filter.hocsinh.choseAll;
    },
  },
  mounted() {
    this.$store.dispatch("filter/hocsinh/getAllLopHoc");
  },
};
</script>

<style scoped>
.class-list-scrollable {
  max-height: 280px;
  overflow-y: auto;
}
</style>

