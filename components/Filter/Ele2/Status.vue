<template>
  <div class="filter-status">
    <div
      v-for="s in state"
      :key="s.value"
      class="custom-control custom-checkbox mb-2"
    >
      <input
        type="checkbox"
        class="custom-control-input"
        :id="'status-' + s.value"
        :value="s.value"
        v-model="checkedStatus"
      />
      <label class="custom-control-label small d-flex align-items-center" :for="'status-' + s.value">
        <span :class="['badge mr-1', s.badgeClass]">{{ s.title }}</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      checkedStatus: ["DANG_HOC", "TAM_NGHI", "DANG_KY", "NGHI_LUON"],
      state: [
        {
          value: "DANG_HOC",
          title: "Đang học",
          badgeClass: "badge-success",
        },
        {
          value: "TAM_NGHI",
          title: "Tạm nghỉ",
          badgeClass: "badge-warning text-dark",
        },
        {
          value: "DANG_KY",
          title: "Đăng ký",
          badgeClass: "badge-info",
        },
        {
          value: "NGHI_LUON",
          title: "Nghỉ luôn",
          badgeClass: "badge-secondary",
        },
      ],
    };
  },
  watch: {
    checkedStatus: function () {
      this.$store.commit("filter/hocsinh/updateFilterEle2", this.checkedStatus);
      this.$store.dispatch("filter/hocsinh/applyFilters");
    },
  },
};
</script>

