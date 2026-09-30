<template>
  <div class="container-fluid py-3">
    <h4 class="font-weight-bold"><i class="fas fa-sliders-h mr-2 text-primary"></i>Cài đặt</h4>
    <p class="text-muted">Thiết lập nghiệp vụ nhà trường và quản trị kết nối hệ thống.</p>
    <div v-if="loading" class="alert alert-info">Đang kiểm tra quyền truy cập…</div>
    <div v-else-if="!canManageSchool" class="alert alert-warning">Cần quyền hiệu trưởng, kế toán hoặc quản trị để mở cài đặt.</div>
    <div v-else class="card shadow-sm border-0">
      <div class="card-body">
        <b-tabs v-model="activeTab" pills content-class="mt-4">
          <b-tab title="Thiết lập nhà trường">
            <h5>Biểu phí &amp; Chính sách thu</h5>
            <div class="row">
              <section class="col-lg-5 mb-4">
                <div class="border rounded p-3 h-100"><h6>Biểu học phí theo năm</h6>
                  <p class="small text-muted">Năm của biểu giá, không phải năm sinh của bé.</p><HocPhiYear />
                </div>
              </section>
              <section class="col-lg-7 mb-4">
                <div class="border rounded p-3 mb-3"><h6>Phí cơ sở vật chất</h6><CoSoVatChat /></div>
                <div class="border rounded p-3"><h6>Quy định nghỉ học liên tiếp</h6><NghiLienTiep /></div>
              </section>
            </div>
            <section class="border rounded p-3 mb-4"><h6>Phí mở rộng &amp; Dịch vụ khác</h6><PhiMoRong /></section>
            <section class="border rounded p-3 mb-4">
              <h6>Phí camera &amp; Tạo phí định kỳ</h6>
              <p class="small text-muted">Quản lý hạng mục phí, lịch tự động, xem trước và nhật ký tạo phí. Phí camera căn cứ quyền xem active bên hệ thống camera.</p>
              <nuxt-link to="/khoanphi/cauhinh" class="btn btn-outline-primary">Tạo phí &amp; Lịch tự động</nuxt-link>
            </section>
            <section class="border rounded p-3"><h6>Lịch học &amp; Ngày nghỉ</h6><LichHocSetup />
              <nuxt-link :to="`/lichhoc?year=${year}&month=${month}`">Mở lịch học tháng</nuxt-link>
            </section>
          </b-tab>
          <b-tab v-if="isSuperAdmin" title="Quản trị hệ thống">
            <SupportSetting />
            <div class="alert alert-info">Chỉ dành cho super admin kỹ thuật. Các khóa kết nối không thuộc thiết lập nghiệp vụ nhà trường.</div>
            <section class="border rounded p-3 mb-4"><h5>Kết nối thanh toán MONA Pay</h5><MonaPaySetting /></section>
            <section class="border rounded p-3 mb-4"><h5>Kết nối camera</h5>
              <nuxt-link to="/setup/camera" class="btn btn-outline-primary">Cấu hình server &amp; API camera</nuxt-link>
            </section>
            <section class="border rounded p-3"><h5>Kết nối app phụ huynh</h5><PortalSetting /></section>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import MonaPaySetting from '~/components/Setup/MonaPaySetting.vue';
import PortalSetting from '~/components/Setup/PortalSetting.vue';
import LichHocSetup from '~/components/LichHocSetup.vue';
import PhiMoRong from '~/components/PhiMoRong/Form.vue';
import HocPhiYear from '~/components/HocPhi/Year.vue';
import CoSoVatChat from '~/components/CoSoVatChat.vue';
import NghiLienTiep from '~/components/NghiLienTiep.vue';
import SupportSetting from '~/components/Setup/SupportSetting.vue';
export default {
  layout: 'app',
  components: { MonaPaySetting, PortalSetting, LichHocSetup, PhiMoRong, HocPhiYear, CoSoVatChat, NghiLienTiep, SupportSetting },
  data: () => ({ activeTab: 0, loading: true, year: new Date().getFullYear(), month: new Date().getMonth() + 1 }),
  computed: {
    isSuperAdmin() { return !this.$store.state.user.isImpersonating && this.$store.state.user.user?.isSuperAdmin === true; },
    canManageSchool() {
      const user = this.$store.state.user;
      return !user.isImpersonating && (this.isSuperAdmin || user.user?.isAdmin === true ||
        (user.roles || []).some(role => ['hieu-truong', 'ke-toan'].includes(role)));
    }
  },
  async mounted() {
    try {
      await this.$store.dispatch('user/getRole');
      if (this.isSuperAdmin && ['system', 'monapay', 'portal'].includes(this.$route.query.tab)) this.activeTab = 1;
    } finally { this.loading = false; }
  }
};
</script>
