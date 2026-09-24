<template>
  <div class="input-group">
    <div class="input-group-prepend" v-if="prependIcon">
      <span class="input-group-text bg-light text-muted">
        <i :class="prependIcon"></i>
      </span>
    </div>

    <input
      ref="inputRef"
      type="text"
      inputmode="numeric"
      :class="['form-control', inputClass]"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :value="displayValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeyDown"
    />

    <div class="input-group-append" v-if="appendUnit">
      <span class="input-group-text font-weight-bold text-secondary">
        {{ appendUnit }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputCurrency',
  props: {
    value: {
      type: [Number, String],
      default: 0,
    },
    placeholder: {
      type: String,
      default: 'Nhập số tiền...',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    inputClass: {
      type: String,
      default: '',
    },
    prependIcon: {
      type: String,
      default: '',
    },
    appendUnit: {
      type: String,
      default: 'VNĐ',
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: null,
    },
    allowNegative: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    displayValue() {
      if (this.value === '' || this.value === null || this.value === undefined) {
        return '';
      }
      return this.formatNumberWithDots(this.value);
    },
  },
  methods: {
    formatNumberWithDots(val) {
      if (val === '' || val === null || val === undefined) return '';
      const isNeg = this.allowNegative && String(val).startsWith('-');
      const cleanNum = String(val).replace(/\D/g, '');
      if (!cleanNum) return isNeg ? '-' : '';

      const formatted = cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return isNeg ? `-${formatted}` : formatted;
    },
    handleInput(e) {
      const inputEl = e.target;
      let rawVal = inputEl.value;

      let isNeg = false;
      if (this.allowNegative && rawVal.startsWith('-')) {
        isNeg = true;
      }

      // Chỉ giữ lại chữ số
      const digitsOnly = rawVal.replace(/\D/g, '');

      if (!digitsOnly) {
        this.$emit('input', 0);
        this.$nextTick(() => {
          if (inputEl) inputEl.value = isNeg ? '-' : '';
        });
        return;
      }

      let numericVal = parseInt(digitsOnly, 10);
      if (isNeg) numericVal = -numericVal;

      // Giới hạn max nếu có
      if (this.max !== null && numericVal > this.max) {
        numericVal = this.max;
      }
      // Giới hạn min nếu không cho âm
      if (!this.allowNegative && this.min !== null && numericVal < this.min && digitsOnly.length > 3) {
        numericVal = Math.max(this.min, numericVal);
      }

      this.$emit('input', numericVal);

      // Cập nhật lại format trên input hiển thị ngay lập tức
      const formatted = this.formatNumberWithDots(numericVal);
      this.$nextTick(() => {
        if (inputEl) {
          inputEl.value = formatted;
        }
      });
    },
    handleFocus(e) {
      this.$emit('focus', e);
    },
    handleBlur(e) {
      this.$emit('blur', e);
    },
    handleKeyDown(e) {
      // Cho phép các phím điều khiển cơ bản: Backspace, Tab, Enter, Delete, Mũi tên
      const allowedKeys = ['Backspace', 'Tab', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
      if (allowedKeys.includes(e.key) || (e.ctrlKey || e.metaKey)) {
        return;
      }

      // Phím trừ '-' nếu cho phép số âm
      if (this.allowNegative && e.key === '-') {
        return;
      }

      // Chặn nếu không phải số 0-9
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    },
  },
};
</script>

<style scoped>
.input-group-text {
  font-size: 0.9rem;
}
</style>
