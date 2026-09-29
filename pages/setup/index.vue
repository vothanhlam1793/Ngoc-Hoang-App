<template>
  <div class="container-fluid py-3 setup-workspace">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h4 class="font-weight-bold mb-1">
          <i class="fas fa-sliders-h text-primary mr-2"></i> Cài Đặt & Quản Trị Hệ Thống
        </h4>
        <p class="text-muted small mb-0">
          Trung tâm cấu hình tập trung: Cổng thanh toán MONA Pay, biểu phí học phí, dịch vụ ngoài giờ và lịch học
        </p>
      </div>
      <div>
        <span v-if="isAdmin" class="badge badge-pill badge-primary px-3 py-2">
          <i class="fas fa-shield-alt mr-1"></i> SUPER ADMIN
        </span>
      </div>
    </div>

    <!-- Tabs Workspace -->
    <div class="card shadow-sm border-0">
      <div class="card-body p-3">
        <b-tabs v-model="activeTabIndex" content-class="mt-4" pills fill nav-wrapper-class="setup-nav-pills">
          <!-- Vùng 1: Cổng MONA Pay & Gạch nợ tự động (Super Admin) -->
          <b-tab v-if="isAdmin">
            <template #title>
              <i class="fas fa-satellite-dish mr-2 text-warning"></i>
              <strong>Cổng MONA Pay (ADMIN)</strong>
            </template>
            <MonaPaySetting />
          </b-tab>

          <!-- Vùng 2: Quản lý Nhân sự & Phân quyền (Super Admin) -->
          <b-tab v-if="isAdmin">
            <template #title>
              <i class="fas fa-users-cog mr-2 text-primary"></i>
              <strong>Nhân Sự & Phân Quyền</strong>
            </template>
            <NhanSuSetting />
          </b-tab>

          <!-- Vùng 3: Cổng App Phụ Huynh camerangochoang.com (Super Admin) -->
          <b-tab v-if="isAdmin">
            <template #title>
              <i class="fas fa-key mr-2 text-info"></i>
              <strong>Cổng App Phụ Huynh (API Key)</strong>
            </template>
            <PortalSetting />
          </b-tab>

          <!-- Vùng 3: Biểu phí Học phí & CSVC -->
          <b-tab>
            <template #title>
              <i class="fas fa-money-check-alt mr-2 text-success"></i>
              <strong>Học Phí & Cơ Sở Vật Chất</strong>
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

          <!-- Vùng 3: Phí Dịch vụ & Ngoài giờ (Tạm ẩn theo yêu cầu nhà trường) -->
          <!--
          <b-tab>
            <template #title>
              <i class="fas fa-clock mr-2 text-info"></i>
              <strong>Dịch Vụ Ngoài Giờ & Bữa Ăn</strong>
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
          -->

          <!-- Vùng 4: Phí Mở rộng (Phụ thu & Hoạt động) -->
          <b-tab>
            <template #title>
              <i class="fas fa-receipt mr-2 text-secondary"></i>
              <strong>Phí Mở Rộng & Dịch Vụ Khác</strong>
            </template>
            <div class="card border shadow-none p-3 bg-white">
              <h5 class="font-weight-bold text-success mb-3">
                <i class="fas fa-tags mr-2"></i>Danh mục Phí Mở Rộng (Năng khiếu, Phụ thu, Dã ngoại)
              </h5>
              <PhiMoRong />
            </div>
          </b-tab>

          <!-- Vùng 5: Lịch học & Ngày nghỉ -->
          <b-tab>
            <template #title>
              <i class="fas fa-calendar-check mr-2 text-primary"></i>
              <strong>Lịch Học & Ngày Nghỉ</strong>
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
import MonaPaySetting from '~/components/Setup/MonaPaySetting.vue';
import NhanSuSetting from '~/components/Setup/NhanSuSetting.vue';
import PortalSetting from '~/components/Setup/PortalSetting.vue';
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
    MonaPaySetting,
    NhanSuSetting,
    PortalSetting,
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
      activeTabIndex: 0,
      defaultToDate: new Date().toISOString().slice(0, 10),
      month: 6,
      year: 2023
    };
  },
  computed: {
    isAdmin() {
      return this.$store.state.user.isAdmin === true || this.$store.state.user.roles?.includes('super-admin') || this.$store.state.user.roles?.includes('quan-tri-vien');
    }
  },
  mounted() {
    if (this.$route.query.tab === 'monapay') {
      this.activeTabIndex = 0;
    } else if (this.$route.query.tab === 'nhansu') {
      this.activeTabIndex = this.isAdmin ? 1 : 0;
    } else if (this.$route.query.tab === 'portal') {
      this.activeTabIndex = this.isAdmin ? 2 : 0;
    } else if (this.$route.query.tab === 'hocphi') {
      this.activeTabIndex = this.isAdmin ? 3 : 0;
    }
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
