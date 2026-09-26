<template>
  <div class="container-fluid py-3 pb-5 mb-5">
    <!-- Header Thông tin Sổ Tháng -->
    <div class="card border-0 shadow-sm rounded-lg mb-3 bg-white p-3">
      <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center mb-2 mb-md-0">
          <nuxt-link
            to="/anchieu"
            class="btn btn-sm btn-light border rounded-pill px-3 font-weight-bold text-secondary mr-3"
          >
            <i class="fas fa-arrow-left mr-1"></i> Danh sách lớp
          </nuxt-link>
          <div>
            <h4 class="font-weight-bold text-dark mb-0">
              {{ lophoc.name || 'Đang tải lớp...' }} - SỔ ĂN CHIỀU
            </h4>
            <span class="text-muted small">
              Tháng {{ $route.params.month }}/{{ $route.params.year }} • Theo dõi suất ăn xế chiều
            </span>
          </div>
        </div>

        <div class="d-flex align-items-center">
          <a
            :href="`/xemdiemdanh?type=ANCHIEU&idLopHoc=${idLopHoc}&year=${year}&month=${month}`"
            class="btn btn-sm btn-outline-info font-weight-bold rounded-pill px-3 shadow-sm"
          >
            <i class="fas fa-table mr-1"></i> Bảng tổng hợp tháng
          </a>
        </div>
      </div>

      <!-- Thanh Sub-Nav chuyển đổi giữa các Sổ tháng -->
      <div class="d-flex justify-content-center">
        <div class="bg-light p-1 rounded-pill border d-inline-flex">
          <nuxt-link
            :to="`/dihoc/${$route.params.year}/${$route.params.month}/${idLopHoc}`"
            class="btn btn-sm text-secondary font-weight-bold px-3 rounded-pill"
          >
            <i class="fas fa-calendar-check mr-1"></i> Sổ Đi Học
          </nuxt-link>
          <nuxt-link
            :to="`/anchieu/${$route.params.year}/${$route.params.month}/${idLopHoc}`"
            class="btn btn-sm btn-info text-white font-weight-bold px-3 rounded-pill shadow-sm"
          >
            <i class="fas fa-utensils mr-1"></i> Sổ Ăn Chiều
          </nuxt-link>
          <nuxt-link
            :to="`/vetre/${$route.params.year}/${$route.params.month}/${idLopHoc}`"
            class="btn btn-sm text-secondary font-weight-bold px-3 rounded-pill"
          >
            <i class="fas fa-clock mr-1"></i> Sổ Về Trễ
          </nuxt-link>
        </div>
      </div>
    </div>

    <!-- Danh sách các ngày trong tháng dạng Lưới Thẻ Cảm Ứng (Touch Grid) -->
    <div class="row">
      <div
        v-for="date in dates"
        :key="date"
        class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3"
      >
        <div
          class="card border-0 shadow-sm rounded-lg h-100 p-3 date-card"
          :class="{
            'border-today': isToday(date),
            'bg-light-weekend': isWeekend(date),
            'bg-white': !isWeekend(date)
          }"
        >
          <!-- Ngày & Thứ -->
          <div class="d-flex align-items-center justify-content-between mb-2">
            <div>
              <span class="badge badge-light border font-weight-bold px-2 py-1 text-dark" style="font-size: 0.85rem;">
                {{ date }}/{{ $route.params.month }}
              </span>
              <small class="font-weight-bold ml-1" :class="isWeekend(date) ? 'text-danger' : 'text-secondary'">
                {{ getThuNgay(date) }}
              </small>
            </div>

            <span v-if="isToday(date)" class="badge badge-primary px-2 py-1 font-weight-bold" style="font-size: 0.7rem;">
              Hôm nay
            </span>
          </div>

          <!-- Trạng thái điểm danh -->
          <div class="my-2">
            <div v-if="checkDiemDanh(date)" class="d-flex align-items-center text-success small font-weight-semibold">
              <i class="fas fa-check-circle mr-1"></i>
              <span>Đã chốt suất ăn</span>
            </div>
            <div v-else class="d-flex align-items-center text-muted small">
              <i class="far fa-circle mr-1"></i>
              <span>Chưa điểm danh</span>
            </div>
          </div>

          <!-- Nút hành động 1-chạm -->
          <div class="mt-auto pt-2 border-top text-right">
            <a
              v-if="checkDiemDanh(date)"
              :href="getHref(date, 'edit')"
              class="btn btn-sm btn-outline-warning text-dark font-weight-bold rounded-pill px-3 w-100"
            >
              <i class="fas fa-edit mr-1"></i> Chỉnh sửa
            </a>
            <a
              v-else
              :href="getHref(date)"
              class="btn btn-sm btn-primary font-weight-bold rounded-pill px-3 w-100 shadow-sm"
            >
              <i class="fas fa-plus mr-1"></i> Điểm danh
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';

export default {
  layout: 'app',
  data() {
    return {
      year: '',
      month: '',
      idLopHoc: '',
      type: 'ANCHIEU',
      diemdanhs: [],
      lophoc: {},
      dates: []
    };
  },
  methods: {
    isToday(date) {
      const now = new Date();
      return (
        parseInt(date, 10) === now.getDate() &&
        parseInt(this.month, 10) === now.getMonth() + 1 &&
        parseInt(this.year, 10) === now.getFullYear()
      );
    },
    isWeekend(date) {
      const d = new Date(parseInt(this.year, 10), parseInt(this.month, 10) - 1, parseInt(date, 10));
      return d.getDay() === 0 || d.getDay() === 6; // 0 = CN, 6 = T7
    },
    getThuNgay(date) {
      const d = new Date(parseInt(this.year, 10), parseInt(this.month, 10) - 1, parseInt(date, 10));
      const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      return days[d.getDay()];
    },
    checkDiemDanh(date) {
      for (let i = 0; i < this.diemdanhs.length; i++) {
        if (this.diemdanhs[i].date === date) {
          return true;
        }
      }
      return false;
    },
    getHref(date, path) {
      const ret = this.$route.fullPath.split('/');
      if (path) {
        ret.splice(ret.length - 1, 0, date, path);
      } else {
        ret.splice(ret.length - 1, 0, date);
      }
      return ret.join('/');
    },
    getLopHoc() {
      const client = this.$apolloProvider.defaultClient;
      client.query({
        query: gql`
          query GetLopHocName($id: ID!) {
            LopHoc(where: { id: $id }) {
              id
              name
            }
          }
        `,
        variables: { id: this.idLopHoc }
      }).then(data => {
        this.lophoc = data.data.LopHoc || {};
      }).catch(err => {
        console.error('LOPHOC_NAME_ERROR:', err);
      });
    },
    getDiemDanh() {
      const client = this.$apolloProvider.defaultClient;
      client.query({
        fetchPolicy: 'network-only',
        query: gql`
          query GetDiemDanhList($year: String!, $month: String!, $type: String!, $idLopHoc: String!) {
            allDiemdanhs(
              where: {
                year: $year
                month: $month
                type: $type
                lophoc: $idLopHoc
              }
            ) {
              id
              date
            }
          }
        `,
        variables: {
          year: this.year,
          month: this.month,
          type: this.type,
          idLopHoc: this.idLopHoc
        }
      }).then(data => {
        this.diemdanhs = data.data.allDiemdanhs || [];
      }).catch(err => {
        console.error('DIEMDANH_LIST_ERROR:', err);
      });
    }
  },
  created() {
    this.year = this.$route.params.year;
    this.month = this.$route.params.month;
    this.idLopHoc = this.$route.params.id;

    const daysInMonth = new Date(parseInt(this.year, 10), parseInt(this.month, 10), 0).getDate();
    this.dates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const d = i < 10 ? '0' + i : i.toString();
      this.dates.push(d);
    }

    if (this.idLopHoc) {
      this.getLopHoc();
      this.getDiemDanh();
    }
  }
};
</script>

<style scoped>
.date-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.date-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08) !important;
}

.border-today {
  border: 2px solid #06b6d4 !important;
}

.bg-light-weekend {
  background-color: #f8fafc;
}
</style>
