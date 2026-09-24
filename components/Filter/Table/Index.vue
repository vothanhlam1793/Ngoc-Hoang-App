<template>
  <div>
    <!-- Phân trang & Thống kê tổng số học sinh ở PHÍA TRÊN -->
    <Pagn />

    <!-- Danh sách học sinh -->
    <List :hocsinhs="pageHocsinhs" />

    <!-- Phân trang ở PHÍA DƯỚI -->
    <Pagn class="mt-3" />
  </div>
</template>

<script>
import List from '~/components/Filter/Table/List.vue';
import Pagn from '~/components/Filter/Table/Pagn.vue';

export default {
  components: {
    List,
    Pagn,
  },
  watch: {
    hocsinhs: function () {
      this.$store.commit("filter/result/updateHocsinhs", this.hocsinhs);
    },
  },
  computed: {
    pageHocsinhs() {
      return this.hocsinhs;
    },
  },
  mounted() {
    this.$store.commit("filter/result/updateHocsinhs", this.hocsinhs);
  },
  props: ["hocsinhs"],
};
</script>

