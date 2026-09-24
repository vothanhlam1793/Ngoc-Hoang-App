<template>
  <div class="container-fluid py-3 setup-workspace">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h4 class="font-weight-bold mb-1">
          <i class="fas fa-sliders-h text-primary mr-2"></i> Cài Đặt Hệ Thống & Biểu Phí
        </h4>
        <p class="text-muted small mb-0">Thiết lập học phí năm học, phí cơ sở vật chất, dịch vụ ngoài giờ và lịch học chuẩn</p>
      </div>
    </div>

    <!-- Tabs Workspace -->
    <div class="card shadow-sm border-0">
      <div class="card-body p-3">
        <b-tabs content-class="mt-4" pills fill nav-wrapper-class="setup-nav-pills">
          <!-- Tab 1: Biểu phí Học phí & CSVC -->
          <b-tab active>
            <template #title>
              <i class="fas fa-money-check-alt mr-2"></i><strong>Học Phí & Cơ Sở Vật Chất</strong>
            </template>
            <div class="row">
              <div class="col-lg-5 mb-4 mb-lg-0">
                <div class="card border shadow-none p-3 h-100 bg-white">
                  <h5 class="font-weight-bold text-primary mb-3">
                    <i class="fas fa-calendar-alt mr-2"></i>Biểu phí theo năm
                  </h5>
                  <HocPhiYear />
                </div>
              </div>
              <div class="col-lg-7">
                <div class="card border shadow-none p-3 mb-3 bg-white">
                  <h5 class="font-weight-bold text-primary mb-3">
                    <i class="fas fa-building mr-2"></i>Phí Cơ Sở Vật Chất
                  </h5>
                  <CoSoVatChat />
                </div>
                <div class="card border shadow-none p-3 bg-white">
                  <h5 class="font-weight-bold text-primary mb-3">
                    <i class="fas fa-user-clock mr-2"></i>Quy định Nghỉ học liên tiếp
                  </h5>
                  <NghiLienTiep />
                </div>
              </div>
            </div>
          </b-tab>

          <!-- Tab 2: Phí Dịch vụ & Ngoài giờ -->
          <b-tab>
            <template #title>
              <i class="fas fa-clock mr-2"></i><strong>Dịch Vụ Ngoài Giờ & Bữa Ăn</strong>
            </template>
            <div class="row">
              <div class="col-lg-6 mb-4 mb-lg-0">
                <div class="card border shadow-none p-3 mb-3 bg-white">
                  <h5 class="font-weight-bold text-warning mb-3">
                    <i class="fas fa-business-time mr-2"></i>Biểu phí Về trễ sau 17h
                  </h5>
                  <VeTre />
                </div>
                <div class="card border shadow-none p-3 bg-white">
                  <h5 class="font-weight-bold text-warning mb-3">
                    <i class="fas fa-history mr-2"></i>Biểu phí Về trễ sau 18h
                  </h5>
                  <VeTre2 />
                </div>
              </div>
              <div class="col-lg-6">
                <div class="card border shadow-none p-3 h-100 bg-white">
                  <h5 class="font-weight-bold text-info mb-3">
                    <i class="fas fa-utensils mr-2"></i>Biểu phí Suất Ăn Chiều
                  </h5>
                  <AnChieu />
                </div>
              </div>
            </div>
          </b-tab>

          <!-- Tab 3: Phí Mở rộng (Phụ thu & Hoạt động) -->
          <b-tab>
            <template #title>
              <i class="fas fa-receipt mr-2"></i><strong>Phí Mở Rộng & Dịch Vụ Khác</strong>
            </template>
            <div class="card border shadow-none p-3 bg-white">
              <h5 class="font-weight-bold text-success mb-3">
                <i class="fas fa-tags mr-2"></i>Danh mục Phí Mở Rộng (Năng khiếu, Phụ thu, Dã ngoại)
              </h5>
              <PhiMoRong />
            </div>
          </b-tab>

          <!-- Tab 4: Lịch học & Ngày nghỉ -->
          <b-tab>
            <template #title>
              <i class="fas fa-calendar-check mr-2"></i><strong>Lịch Học & Ngày Nghỉ</strong>
            </template>
            <div class="card border shadow-none p-3 bg-white">
              <h5 class="font-weight-bold text-primary mb-3">
                <i class="fas fa-calendar-day mr-2"></i>Cấu hình Số ngày học chuẩn trong tháng
              </h5>
              <LichHocSetup />
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import LichHocSetup from '~/components/LichHocSetup.vue';
import PhiMoRong from '~/components/PhiMoRong/Form.vue';
import HocPhiYear from '~/components/HocPhi/Year.vue';
import CoSoVatChat from '~/components/CoSoVatChat.vue';
import VeTre from '~/components/ VeTre.vue';
import VeTre2 from '~/components/ VeTre2.vue';
import AnChieu from '~/components/AnChieu.vue';
import NghiLienTiep from '~/components/NghiLienTiep.vue';

export default {
  layout: "app",
  components: {
    LichHocSetup,
    PhiMoRong,
    HocPhiYear,
    CoSoVatChat,
    VeTre,
    VeTre2,
    AnChieu,
    NghiLienTiep
  },
  data() {
    return {
      defaultToDate: new Date().toISOString().slice(0, 10),
      month: 6,
      year: 2023
    };
  },
  methods: {
    updateToDate(date) {
      if (!date) return;
      this.month = parseInt(date.split("-")[1]);
      this.year = parseInt(date.split("-")[0]);
    }
  }
};
</script>

<style scoped>
.setup-workspace {
  max-width: 1400px;
  margin: 0 auto;
}
</style>
