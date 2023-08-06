<template>
    <b-row>
      <b-col md="6">
        <b-form-group label="Chọn năm">
          <b-form-select v-model="selectedYear" :options="yearOptions" @change="updateData"></b-form-select>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Chọn tháng">
          <b-form-select v-model="selectedMonth" :options="months" @change="updateData"></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedYear: null,
        selectedMonth: null,
        months: [
          { text: 'Tháng 1', value: 1 },
          { text: 'Tháng 2', value: 2 },
          { text: 'Tháng 3', value: 3 },
          { text: 'Tháng 4', value: 4 },
          { text: 'Tháng 5', value: 5 },
          { text: 'Tháng 6', value: 6 },
          { text: 'Tháng 7', value: 7 },
          { text: 'Tháng 8', value: 8 },
          { text: 'Tháng 9', value: 9 },
          { text: 'Tháng 10', value: 10 },
          { text: 'Tháng 11', value: 11 },
          { text: 'Tháng 12', value: 12 },
        ],
      };
    },
    computed: {
      yearOptions() {
        // Lấy năm hiện tại
        const currentYear = new Date().getFullYear();
        
        // Tạo danh sách các năm từ năm hiện tại trước 5 năm đến sau 5 năm
        const minYear = currentYear - 5;
        const maxYear = currentYear + 5;
        const years = [];
        for (let i = minYear; i <= maxYear; i++) {
          years.push(i);
        }
        
        // Chuyển đổi danh sách các năm thành mảng options cho b-form-select
        return years.map(year => {
          return { text: year.toString(), value: year };
        });
      },
    },
    created() {
      // Đặt giá trị mặc định là năm và tháng hiện tại
      const currentDate = new Date();
      this.selectedYear = currentDate.getFullYear();
      this.selectedMonth = currentDate.getMonth(); // Tháng trong JavaScript bắt đầu từ 0, nên cần cộng thêm 1
      // Gọi hàm cập nhật dữ liệu khi component được khởi tạo
      this.updateData();
    },
    methods: {
      updateData() {
        // Gửi thông báo cho parent component về sự thay đổi năm và tháng
        this.$emit('update-data', { year: this.selectedYear, month: this.selectedMonth });
      },
    },
  };
  </script>
  