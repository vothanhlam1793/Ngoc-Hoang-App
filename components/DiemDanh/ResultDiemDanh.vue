<template>
  <div class="row">
    <div class="col">
      <p>Tổng: {{ lophoc.hocsinhs.length }}<br>Có: {{ calculator(lophoc) }}</p>

    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    calculator(lophoc) {
      const a = lophoc.hocsinhs;
      const count = a.reduce((accumulator, currentValue) => {
        console.log(currentValue);
        if (currentValue.result == 1) {
          return accumulator + 1;
        } else {
          return accumulator;
        }
      }, 0);

      return count;
    }
  },
  watch: {
    monitor: function (nS, oS) {
      this.$forceUpdate();
    },
  },
  computed: {
    monitor() {
      return this.$store.state.ndd.monitor;
    },
  },
  props: ['lophoc']
}
</script>