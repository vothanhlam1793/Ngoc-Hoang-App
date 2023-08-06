// plugins/formatTotal.js
import Vue from 'vue';

const formatTotal = value => {
  // Định dạng trường total với dấu chấm sau mỗi 1000
  if (value === null || isNaN(value)) {
    value = 0;
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

Vue.prototype.$formatTotal = formatTotal;
