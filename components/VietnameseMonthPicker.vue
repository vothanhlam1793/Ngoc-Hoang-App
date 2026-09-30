<template>
  <div class="vn-month-picker">
    <button :id="id" ref="trigger" type="button" class="form-control month-trigger" :class="{ 'form-control-sm': size === 'sm' }"
      :disabled="disabled" aria-haspopup="dialog" :aria-expanded="String(open)" :aria-label="label + ': ' + displayValue" @click="show">
      <span>{{ displayValue }}</span><i class="far fa-calendar-alt ml-2" aria-hidden="true"></i>
    </button>
    <b-modal v-model="open" :title="label" hide-footer size="sm" @hidden="restoreFocus">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <button type="button" class="btn btn-outline-secondary" :disabled="year <= 1900" aria-label="Năm trước" @click="year--">‹</button>
        <label class="mb-0 mx-2">Năm
          <select v-model.number="year" class="custom-select custom-select-sm year-select" aria-label="Chọn năm">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
        </label>
        <button type="button" class="btn btn-outline-secondary" :disabled="year >= 2200" aria-label="Năm sau" @click="year++">›</button>
      </div>
      <div class="month-grid">
        <button v-for="month in 12" :key="month" type="button" class="btn"
          :class="value === monthValue(month) ? 'btn-primary' : 'btn-outline-primary'"
          :aria-pressed="String(value === monthValue(month))" @click="choose(monthValue(month))">Tháng {{ month }}</button>
      </div>
      <div class="d-flex justify-content-between mt-3">
        <button type="button" class="btn btn-link px-0" @click="choose(currentMonth())">Tháng hiện tại</button>
        <button v-if="clearable" type="button" class="btn btn-link text-secondary px-0" @click="choose('')">Bỏ chọn</button>
      </div>
    </b-modal>
  </div>
</template>
<script>
export default {
  props: {
    value: { type: String, default: '' }, id: { type: String, default: undefined },
    disabled: Boolean, clearable: { type: Boolean, default: true },
    size: { type: String, default: '' }, label: { type: String, default: 'Chọn tháng' }
  },
  data: () => ({ open: false, year: new Date().getFullYear() }),
  computed: {
    years() { return Array.from({ length: 301 }, (_, i) => 1900 + i); },
    displayValue() {
      const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(this.value || '');
      return match ? `Tháng ${match[2]} năm ${match[1]}` : 'Chọn tháng';
    }
  },
  watch: { disabled(value) { if (value) this.open = false; } },
  methods: {
    currentMonth() { return new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 7); },
    monthValue(month) { return `${this.year}-${String(month).padStart(2, '0')}`; },
    show() { if (this.disabled) return; this.year = Number((/^\d{4}-(0[1-9]|1[0-2])$/.test(this.value) ? this.value : this.currentMonth()).slice(0, 4)); this.open = true; },
    choose(value) {
      if (this.disabled) return;
      this.$emit('input', value);
      this.$emit('change', value);
      this.open = false;
    },
    restoreFocus() { if (this.$refs.trigger && !this.disabled) this.$refs.trigger.focus(); }
  }
};
</script>
<style scoped>
.vn-month-picker { min-width: 165px; }
.month-trigger { display: flex; align-items: center; justify-content: space-between; text-align: left; white-space: nowrap; cursor: pointer; font-weight: inherit; }
.month-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.year-select { width: auto; }
</style>
