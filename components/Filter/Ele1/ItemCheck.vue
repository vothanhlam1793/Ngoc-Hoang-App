<template>
  <div class="custom-control custom-checkbox mb-1">
    <input
      type="checkbox"
      class="custom-control-input"
      :id="'lh-' + lophoc.id"
      v-model="chose"
    />
    <label class="custom-control-label small d-flex justify-content-between align-items-center" :for="'lh-' + lophoc.id">
      <span>{{ lophoc.name }}</span>
      <span class="badge badge-light border text-muted ml-1">{{ countFiltered }}</span>
    </label>
  </div>
</template>

<script>
export default {
  props: ["lophoc"],
  data: () => {
    return {
      chose: true,
      syncing: false,
    };
  },
  watch: {
    chose: function () {
      this.$store.commit("filter/hocsinh/updateFilterEle1", {
        lophoc: this.lophoc,
        chose: this.chose,
      });
      if (!this.syncing) {
        this.$store.dispatch("filter/hocsinh/applyFilters");
      }
    },
    monitor: function () {
      this.syncing = true;
      this.chose = this.lophoc.chose;
      this.$nextTick(() => {
        this.syncing = false;
      });
    },
  },
  computed: {
    monitor() {
      return this.$store.state.filter.hocsinh.monitor;
    },
    currentStatuses() {
      return this.$store.state.filter.hocsinh.status || [];
    },
    countFiltered() {
      if (!this.lophoc || !this.lophoc.hocsinhs) return 0;
      return this.lophoc.hocsinhs.filter((h) => this.currentStatuses.includes(h.status)).length;
    },
  },
  mounted() {
    this.chose = this.lophoc.chose !== undefined ? this.lophoc.chose : true;
  },
};
</script>


