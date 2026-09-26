<template>
  <div class="container-fluid py-3">
    <!-- Header: Lời chào và thông tin Lớp học -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="teacher-hero-card p-4 rounded-lg shadow-sm text-white d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <div class="d-flex align-items-center mb-2">
              <span class="badge badge-light text-primary font-weight-bold px-3 py-1 mr-2">
                <i class="fas fa-calendar-day mr-1"></i> Hôm nay: {{ todayFormatted }}
              </span>
              <span v-if="isImpersonating" class="badge badge-warning text-dark font-weight-bold px-2 py-1">
                Góc nhìn Giáo viên (Test)
              </span>
            </div>
            <h2 class="font-weight-bold mb-1">
              {{ currentClass ? currentClass.name : 'Chưa phân công lớp' }}
            </h2>
            <p class="mb-0 text-white-50">
              Chào cô, chúc cô một ngày làm việc tràn đầy năng lượng cùng các bé!
            </p>
          </div>

          <div class="mt-3 mt-md-0 d-flex align-items-center">
            <nuxt-link
              v-if="currentClass"
              :to="`/dihoc/${currentYear}/${currentMonth}/${currentDate}/${currentClass.id}`"
              class="btn btn-warning font-weight-bold px-4 py-2 rounded-pill shadow"
            >
              <i class="fas fa-check-circle mr-1"></i> Điểm danh Ngày Hôm Nay
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Cảnh báo nếu chưa chọn/chưa có lớp -->
    <div v-if="!currentClass" class="alert alert-warning shadow-sm border-0">
      <i class="fas fa-exclamation-triangle mr-2"></i>
      Tài khoản của bạn chưa được gán lớp chủ nhiệm, hoặc bạn chưa chọn lớp trong chế độ Giả lập. 
      <span v-if="isImpersonating">Vui lòng chọn 1 lớp ở thanh trên cùng để thử nghiệm!</span>
    </div>

          <!-- Quick Stat Cards -->
    <div class="row mb-4" v-if="currentClass">
      <div class="col-6 col-md-3 mb-3">
        <div class="card border-0 shadow-sm rounded-lg stat-card bg-white p-3 h-100">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small font-weight-bold">TỔNG SĨ SỐ</span>
              <h3 class="font-weight-bold text-dark mb-0 mt-1">{{ totalStudents }}</h3>
            </div>
            <div class="stat-icon bg-primary-light text-primary">
              <i class="fas fa-user-graduate"></i>
            </div>
          </div>
          <small class="text-muted mt-2 d-block">Học sinh đang theo học</small>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-3">
        <div class="card border-0 shadow-sm rounded-lg stat-card bg-white p-3 h-100">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small font-weight-bold">ĐI HỌC HÔM NAY</span>
              <h3 class="font-weight-bold mb-0 mt-1" :class="hasAttendanceToday ? 'text-success' : 'text-secondary'">
                {{ hasAttendanceToday ? presentCount : '--' }}
              </h3>
            </div>
            <div class="stat-icon bg-success-light text-success">
              <i class="fas fa-user-check"></i>
            </div>
          </div>
          <small v-if="hasAttendanceToday" class="text-success mt-2 d-block font-weight-semibold">
            {{ totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0 }}% có mặt
          </small>
          <small v-else class="text-muted mt-2 d-block">
            Chưa điểm danh
          </small>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-3">
        <div class="card border-0 shadow-sm rounded-lg stat-card bg-white p-3 h-100">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small font-weight-bold">VẮNG HÔM NAY</span>
              <h3 class="font-weight-bold mb-0 mt-1" :class="hasAttendanceToday ? 'text-danger' : 'text-secondary'">
                {{ hasAttendanceToday ? absentCount : '--' }}
              </h3>
            </div>
            <div class="stat-icon bg-danger-light text-danger">
              <i class="fas fa-user-times"></i>
            </div>
          </div>
          <small v-if="hasAttendanceToday" class="text-danger mt-2 d-block">
            {{ absentCount > 0 ? `${absentCount} bé vắng` : 'Đầy đủ sĩ số' }}
          </small>
          <small v-else class="text-muted mt-2 d-block">
            Chưa điểm danh
          </small>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-3">
        <div class="card border-0 shadow-sm rounded-lg stat-card bg-white p-3 h-100">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small font-weight-bold">ĐĂNG KÝ ĂN CHIỀU</span>
              <h3 class="font-weight-bold mb-0 mt-1" :class="hasLunchToday ? 'text-info' : 'text-secondary'">
                {{ hasLunchToday ? lunchCount : '--' }}
              </h3>
            </div>
            <div class="stat-icon bg-info-light text-info">
              <i class="fas fa-utensils"></i>
            </div>
          </div>
          <small v-if="hasLunchToday" class="text-info mt-2 d-block">
            {{ lunchCount }} suất ăn
          </small>
          <small v-else class="text-muted mt-2 d-block">
            Chưa chốt suất ăn
          </small>
        </div>
      </div>
    </div>

    <!-- Quick Action Grid (Touch-friendly Buttons) -->
    <div class="row mb-4" v-if="currentClass">
      <div class="col-12 mb-2">
        <h5 class="font-weight-bold text-dark">
          <i class="fas fa-th-large text-primary mr-2"></i> Nghiệp Vụ Đứng Lớp
        </h5>
      </div>

      <!-- 1. Điểm danh Đi học -->
      <div class="col-12 col-md-6 col-lg-3 mb-3">
        <div
          class="action-card card border-0 shadow-sm p-3 h-100"
          @click="$router.push(`/dihoc/${currentYear}/${currentMonth}/${currentClass.id}`)"
        >
          <div class="d-flex align-items-center mb-3">
            <div class="action-icon bg-success-light text-success mr-3">
              <i class="fas fa-calendar-check"></i>
            </div>
            <div>
              <h6 class="font-weight-bold text-dark mb-0">Điểm danh Đi học</h6>
              <small class="text-muted">Sổ chuyên cần tháng</small>
            </div>
          </div>
          <p class="text-muted small mb-3 flex-grow-1">Ghi nhận có mặt / nghỉ học hàng ngày của từng bé trong lớp.</p>
          <div class="text-right">
            <span class="btn btn-sm btn-outline-success rounded-pill px-3">
              Mở sổ <i class="fas fa-arrow-right ml-1"></i>
            </span>
          </div>
        </div>
      </div>

      <!-- 2. Điểm danh Ăn Chiều -->
      <div class="col-12 col-md-6 col-lg-3 mb-3">
        <div
          class="action-card card border-0 shadow-sm p-3 h-100"
          @click="$router.push(`/anchieu/${currentYear}/${currentMonth}/${currentClass.id}`)"
        >
          <div class="d-flex align-items-center mb-3">
            <div class="action-icon bg-info-light text-info mr-3">
              <i class="fas fa-utensils"></i>
            </div>
            <div>
              <h6 class="font-weight-bold text-dark mb-0">Suất ăn chiều</h6>
              <small class="text-muted">Ghi nhận bữa xế</small>
            </div>
          </div>
          <p class="text-muted small mb-3 flex-grow-1">Theo dõi danh sách các bé ăn chiều và cập nhật cho nhà bếp.</p>
          <div class="text-right">
            <span class="btn btn-sm btn-outline-info rounded-pill px-3">
              Mở sổ <i class="fas fa-arrow-right ml-1"></i>
            </span>
          </div>
        </div>
      </div>

      <!-- 3. Điểm danh Về Trễ -->
      <div class="col-12 col-md-6 col-lg-3 mb-3">
        <div
          class="action-card card border-0 shadow-sm p-3 h-100"
          @click="$router.push(`/vetre/${currentYear}/${currentMonth}/${currentClass.id}`)"
        >
          <div class="d-flex align-items-center mb-3">
            <div class="action-icon bg-warning-light text-warning mr-3">
              <i class="fas fa-clock"></i>
            </div>
            <div>
              <h6 class="font-weight-bold text-dark mb-0">Đón trễ sau 17h</h6>
              <small class="text-muted">Tính phí trông muộn</small>
            </div>
          </div>
          <p class="text-muted small mb-3 flex-grow-1">Ghi nhận giờ đón trễ của các bé sau khung giờ 17h00 hàng ngày.</p>
          <div class="text-right">
            <span class="btn btn-sm btn-outline-warning rounded-pill px-3 text-dark font-weight-bold">
              Mở sổ <i class="fas fa-arrow-right ml-1"></i>
            </span>
          </div>
        </div>
      </div>

      <!-- 4. Danh sách học sinh lớp -->
      <div class="col-12 col-md-6 col-lg-3 mb-3">
        <div
          class="action-card card border-0 shadow-sm p-3 h-100"
          @click="$router.push(`/hocsinh/lophoc/${currentClass.id}`)"
        >
          <div class="d-flex align-items-center mb-3">
            <div class="action-icon bg-primary-light text-primary mr-3">
              <i class="fas fa-address-book"></i>
            </div>
            <div>
              <h6 class="font-weight-bold text-dark mb-0">Danh sách bé lớp tôi</h6>
              <small class="text-muted">Hồ sơ & SĐT phụ huynh</small>
            </div>
          </div>
          <p class="text-muted small mb-3 flex-grow-1">Xem chi tiết ngày sinh, tên thân mật, thông tin ba mẹ để liên lạc nhanh.</p>
          <div class="text-right">
            <span class="btn btn-sm btn-outline-primary rounded-pill px-3">
              Xem danh sách <i class="fas fa-arrow-right ml-1"></i>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Student Roster Preview -->
    <div class="row" v-if="currentClass && students.length > 0">
      <div class="col-12">
        <div class="card border-0 shadow-sm rounded-lg">
          <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h6 class="font-weight-bold text-dark mb-0">
              <i class="fas fa-list-ol text-primary mr-2"></i> Danh Sách Học Sinh ({{ students.length }} bé)
            </h6>
            <nuxt-link :to="`/hocsinh/lophoc/${currentClass.id}`" class="small font-weight-bold text-primary">
              Xem tất cả <i class="fas fa-chevron-right ml-1"></i>
            </nuxt-link>
          </div>
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="thead-light">
                <tr>
                  <th style="width: 50px;">STT</th>
                  <th>Họ và Tên Bé</th>
                  <th>Mã Học Sinh</th>
                  <th>Phụ Huynh</th>
                  <th>SĐT Liên Hệ</th>
                  <th class="text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(hs, index) in students.slice(0, 10)" :key="hs.id">
                  <td>{{ index + 1 }}</td>
                  <td class="font-weight-bold text-dark">
                    {{ hs.name }}
                    <span v-if="hs.nickname" class="badge badge-light border text-muted font-weight-normal ml-1">
                      {{ hs.nickname }}
                    </span>
                  </td>
                  <td><small class="badge badge-light border">{{ hs.code || hs.id.substring(0, 6) }}</small></td>
                  <td>{{ (hs.parent && hs.parent.name) || (hs.phuhuynh && hs.phuhuynh.name) || '---' }}</td>
                  <td>
                    <a v-if="getStudentPhone(hs)" :href="'tel:' + getStudentPhone(hs)" class="badge badge-success text-white font-weight-normal py-1 px-2">
                      <i class="fas fa-phone-alt mr-1"></i> {{ getStudentPhone(hs) }}
                    </a>
                    <span v-else class="text-muted small">Chưa có</span>
                  </td>
                  <td class="text-center">
                    <span v-if="hs.status === 'DANG_HOC' || !hs.status" class="badge badge-success font-weight-normal">Đang học</span>
                    <span v-else-if="hs.status === 'TAM_NGHI'" class="badge badge-warning text-dark font-weight-normal">Tạm nghỉ</span>
                    <span v-else class="badge badge-secondary font-weight-normal">{{ hs.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="students.length > 10" class="card-footer bg-white text-center py-2 border-top">
            <small class="text-muted">Đang hiển thị 10 / {{ students.length }} bé trong lớp. </small>
            <nuxt-link :to="`/hocsinh/lophoc/${currentClass.id}`" class="small font-weight-bold text-primary ml-1">
              Xem toàn bộ danh sách
            </nuxt-link>
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
    const d = new Date();
    const curYear = d.getFullYear().toString();
    const curMonth = ('0' + (d.getMonth() + 1)).slice(-2);
    const curDate = ('0' + d.getDate()).slice(-2);

    return {
      currentYear: curYear,
      currentMonth: curMonth,
      currentDate: curDate,
      todayFormatted: `${curDate}/${curMonth}/${curYear}`,
      todayCode: `${curYear}_${curMonth}_${curDate}`,
      students: [],
      presentCount: 0,
      absentCount: 0,
      lunchCount: 0,
      hasAttendanceToday: false,
      hasLunchToday: false,
      loading: false
    };
  },
  computed: {
    isImpersonating() {
      return this.$store.state.user.isImpersonating;
    },
    currentClass() {
      return this.$store.getters['user/effectiveClass'];
    },
    totalStudents() {
      return this.students.filter(s => s.status !== 'NGHI_LUON').length;
    }
  },
  watch: {
    currentClass: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.id) {
          this.fetchClassData(newVal.id);
        } else {
          this.students = [];
        }
      }
    }
  },
  methods: {
    getStudentPhone(hs) {
      if (hs.phone && hs.phone.name) return hs.phone.name;
      if (hs.parent && hs.parent.phone && hs.parent.phone.name) return hs.parent.phone.name;
      if (hs.phuhuynh && hs.phuhuynh.phone && hs.phuhuynh.phone.name) return hs.phuhuynh.phone.name;
      return '';
    },
    async fetchClassData(classId) {
      this.loading = true;
      try {
        const client = this.$apolloProvider.defaultClient;
        const res = await client.query({
          query: gql`
            query GetClassDetails($id: ID!) {
              LopHoc(where: { id: $id }) {
                id
                name
                hocsinhs {
                  id
                  name
                  code
                  status
                  phone {
                    name
                  }
                  parent {
                    name
                    phone {
                      name
                    }
                  }
                }
              }
            }
          `,
          variables: { id: classId },
          fetchPolicy: 'network-only'
        });

        if (res.data && res.data.LopHoc) {
          this.students = res.data.LopHoc.hocsinhs || [];
          const activeStudents = this.students.filter(s => s.status !== 'NGHI_LUON');

          // Query phiếu điểm danh thực tế hôm nay
          try {
            const ddRes = await client.query({
              query: gql`
                query GetTodayAttendance($code: String!, $lophocId: ID!) {
                  allDiemDanhs(where: {
                    code: $code,
                    lophoc: { id: $lophocId }
                  }) {
                    id
                    type
                    code
                    co { id name }
                    khong { id name }
                  }
                }
              `,
              variables: {
                code: this.todayCode,
                lophocId: classId
              },
              fetchPolicy: 'network-only'
            });

            const diemdanhList = ddRes.data?.allDiemDanhs || [];
            const dihocRecord = diemdanhList.find(d => d.type === 'DIHOCHANGNGAY');
            const anchieuRecord = diemdanhList.find(d => d.type === 'ANCHIEU');

            if (dihocRecord) {
              this.hasAttendanceToday = true;
              this.presentCount = (dihocRecord.co || []).length;
              this.absentCount = (dihocRecord.khong || []).length;
            } else {
              this.hasAttendanceToday = false;
              this.presentCount = 0;
              this.absentCount = 0;
            }

            if (anchieuRecord) {
              this.hasLunchToday = true;
              this.lunchCount = (anchieuRecord.co || []).length;
            } else {
              this.hasLunchToday = false;
              this.lunchCount = 0;
            }
          } catch (ddErr) {
            console.error('Error fetching today attendance record:', ddErr);
          }
        }
      } catch (e) {
        console.error('Error fetching class data:', e);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    // Tự động chọn lớp đầu tiên nếu đang giả lập mà chưa chọn lớp
    if (this.isImpersonating && !this.currentClass) {
      const classList = this.$store.state.user.classList || [];
      if (classList.length > 0) {
        this.$store.commit('user/setSimulatedClass', classList[0]);
      }
    }
  }
};
</script>

<style scoped>
.teacher-hero-card {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
}
.stat-card {
  border-radius: 12px;
  transition: transform 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}
.bg-primary-light {
  background-color: #e0f2fe;
}
.bg-success-light {
  background-color: #dcfce7;
}
.bg-warning-light {
  background-color: #fef3c7;
}
.bg-danger-light {
  background-color: #fee2e2;
}
.bg-info-light {
  background-color: #e0f2fe;
}
.action-card {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}
.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
}
.action-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
}
</style>
