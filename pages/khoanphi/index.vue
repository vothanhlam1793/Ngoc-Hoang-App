<template>
  <div class="container-fluid py-3 fee-page" :aria-busy="loading ? 'true' : 'false'">
    <div class="fee-header mb-3">
      <div>
        <h1 class="h4 mb-1">Tra cứu khoản phí của bé</h1>
        <p class="text-muted mb-0">Theo dõi khoản phí, chứng từ sử dụng và trạng thái hủy.</p>
      </div>
      <div>
        <nuxt-link to="/khoanphi/cauhinh" class="btn btn-primary mr-2">
          <i class="fas fa-sliders-h mr-1" aria-hidden="true"></i> Cấu hình & Cron tự động
        </nuxt-link>
        <button type="button" class="btn btn-outline-secondary" :disabled="loading" @click="loadFees">
          <i class="fas fa-sync-alt mr-1" :class="{ 'fa-spin': loading }" aria-hidden="true"></i> Tải lại
        </button>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }} <button type="button" class="btn btn-link p-0 ml-2" :disabled="loading" @click="loadFees">Thử lại</button>
    </div>

    <section class="row mb-3" aria-label="Tổng quan khoản phí">
      <div v-for="card in summaryCards" :key="card.key" class="col-6 col-lg-3 mb-2 mb-lg-0">
        <div class="card border-0 shadow-sm h-100"><div class="card-body py-3">
          <div class="small text-muted">{{ card.label }}</div>
          <div class="h4 mb-0" :class="card.className">{{ loading && !loaded ? '—' : card.value }}</div>
        </div></div>
      </div>
    </section>

    <form class="card shadow-sm mb-3" @submit.prevent="applyFilters">
      <div class="card-body fee-filters">
        <div class="form-group mb-0 search-field">
          <label for="fee-search">Tìm bé / mã khoản phí</label>
          <input id="fee-search" v-model.trim="filters.search" class="form-control" maxlength="200" placeholder="Tên bé, mã bé, lớp, phụ huynh hoặc mã phí">
        </div>
        <div class="form-group mb-0">
          <label for="fee-type">Loại phí</label>
          <select id="fee-type" v-model="filters.type" class="form-control">
            <option value="">Tất cả</option><option v-for="value in typeOptions" :key="value" :value="value">{{ typeLabel(value) }}</option>
          </select>
        </div>
        <div class="form-group mb-0">
          <label for="fee-status">Trạng thái</label>
          <select id="fee-status" v-model="filters.status" class="form-control">
            <option value="">Tất cả</option><option value="ACTIVE">Đang hiệu lực</option><option value="CANCELLED">Đã hủy</option>
          </select>
        </div>
        <div class="form-group mb-0">
          <label for="fee-source">Nguồn</label>
          <select id="fee-source" v-model="filters.source" class="form-control">
            <option value="">Tất cả</option><option v-for="value in sourceOptions" :key="value" :value="value">{{ sourceLabel(value) }}</option>
          </select>
        </div>
        <div class="form-group mb-0">
          <label for="fee-month">Tháng tính phí</label>
          <input id="fee-month" v-model="filters.billingMonth" type="month" class="form-control">
        </div>
        <div class="filter-actions">
          <button class="btn btn-primary" :disabled="loading"><i class="fas fa-search mr-1" aria-hidden="true"></i>Tra cứu</button>
          <button type="button" class="btn btn-outline-secondary" :disabled="loading" @click="resetFilters">Xóa lọc</button>
        </div>
      </div>
    </form>

    <div class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive" role="region" aria-label="Danh sách khoản phí" tabindex="0">
          <table class="table table-hover mb-0 fee-table">
            <thead class="thead-light"><tr>
              <th scope="col">Mã / loại</th><th scope="col">Bé / đối tượng</th><th scope="col">Kỳ phí</th>
              <th scope="col" class="text-right">Số tiền</th><th scope="col">Nguồn</th><th scope="col">Sử dụng / chứng từ</th>
              <th scope="col">Trạng thái</th><th scope="col" class="text-right">Thao tác</th>
            </tr></thead>
            <tbody>
              <tr v-if="loading"><td colspan="8" class="text-center py-5 text-muted"><b-spinner small class="mr-2" />Đang tải khoản phí...</td></tr>
              <tr v-for="fee in fees" v-else :key="fee.id || fee._id || fee.code">
                <td><button type="button" class="btn btn-link p-0 font-weight-bold text-left" @click="openDetail(fee)">{{ fee.code || fee.id || fee._id || 'Chưa có mã' }}</button><div class="small text-muted">{{ typeLabel(fee.type) }}</div></td>
                <td><strong>{{ subjectName(fee) }}</strong><div v-if="subjectMeta(fee)" class="small text-muted">{{ subjectMeta(fee) }}</div></td>
                <td class="text-nowrap">{{ periodLabel(fee) }}</td>
                <td class="text-right text-nowrap font-weight-bold">{{ money(fee.amount) }} đ</td>
                <td><span class="badge badge-light border">{{ sourceLabel(fee.source) }}</span></td>
                <td><span :class="usage(fee).attached ? 'text-primary' : 'text-muted'">{{ usage(fee).text }}</span></td>
                <td><span class="badge" :class="fee.status === 'CANCELLED' ? 'badge-secondary' : 'badge-success'">{{ statusLabel(fee.status) }}</span><div v-if="fee.status === 'CANCELLED'" class="small text-muted mt-1">{{ fee.cancellationReason || fee.cancelReason || 'Không có lý do' }}</div></td>
                <td class="text-right text-nowrap">
                  <button type="button" class="btn btn-sm btn-outline-primary mr-1" @click="openDetail(fee)">Chi tiết</button>
                  <button v-if="canCancel(fee)" type="button" class="btn btn-sm btn-outline-danger" @click="openCancel(fee, $event)">Hủy</button>
                </td>
              </tr>
              <tr v-if="!loading && !fees.length"><td colspan="8" class="text-center py-5 text-muted">Không có khoản phí phù hợp bộ lọc.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="total > pageSize" class="card-footer fee-pagination">
        <span class="small text-muted">{{ total }} khoản phí · Trang {{ page }} / {{ pageCount }}</span>
        <div><button class="btn btn-sm btn-outline-secondary mr-2" :disabled="loading || page <= 1" @click="changePage(-1)">Trước</button><button class="btn btn-sm btn-outline-secondary" :disabled="loading || page >= pageCount" @click="changePage(1)">Sau</button></div>
      </div>
    </div>

    <b-modal v-model="detailOpen" title="Chi tiết khoản phí" size="lg" hide-footer>
      <dl v-if="selectedFee" class="row fee-detail mb-0">
        <dt class="col-sm-4">Mã khoản phí</dt><dd class="col-sm-8">{{ selectedFee.code || selectedFee.id || selectedFee._id }}</dd>
        <dt class="col-sm-4">Loại / nguồn</dt><dd class="col-sm-8">{{ typeLabel(selectedFee.type) }} · {{ sourceLabel(selectedFee.source) }}</dd>
        <dt class="col-sm-4">Bé / đối tượng</dt><dd class="col-sm-8">{{ subjectName(selectedFee) }}<span v-if="subjectMeta(selectedFee)" class="text-muted"> · {{ subjectMeta(selectedFee) }}</span></dd>
        <dt class="col-sm-4">Kỳ / số tiền</dt><dd class="col-sm-8">{{ periodLabel(selectedFee) }} · <strong>{{ money(selectedFee.amount) }} đ</strong></dd>
        <dt class="col-sm-4">Sử dụng / chứng từ</dt><dd class="col-sm-8">{{ usage(selectedFee).text }}</dd>
        <dt class="col-sm-4">Bằng chứng</dt><dd class="col-sm-8"><pre class="evidence mb-0">{{ evidenceText(selectedFee) }}</pre></dd>
        <template v-if="selectedFee.status === 'CANCELLED'">
          <dt class="col-sm-4">Trạng thái hủy</dt><dd class="col-sm-8"><span class="badge badge-secondary">Đã hủy</span></dd>
          <dt class="col-sm-4">Lý do hủy</dt><dd class="col-sm-8">{{ selectedFee.cancellationReason || selectedFee.cancelReason || 'Không có lý do' }}</dd>
          <dt v-if="selectedFee.cancelledAt" class="col-sm-4">Thời điểm hủy</dt><dd v-if="selectedFee.cancelledAt" class="col-sm-8">{{ dateTime(selectedFee.cancelledAt) }}</dd>
        </template>
      </dl>
    </b-modal>

    <b-modal v-model="cancelOpen" title="Xác nhận hủy khoản phí" hide-footer :return-focus="cancelTrigger" :no-close-on-backdrop="cancelling" :no-close-on-esc="cancelling" :hide-header-close="cancelling">
      <form v-if="cancelFee" @submit.prevent="submitCancel">
        <div class="alert alert-warning">Chỉ hủy khoản phí chưa gắn chứng từ. Thao tác này không xóa lịch sử.</div>
        <p><strong>{{ cancelFee.code }}</strong> · {{ subjectName(cancelFee) }} · {{ money(cancelFee.amount) }} đ</p>
        <label for="cancel-fee-reason">Lý do hủy</label>
        <textarea id="cancel-fee-reason" v-model="cancelReason" class="form-control" rows="4" minlength="3" maxlength="500" required :disabled="cancelling" />
        <small class="text-muted">Từ 3 đến 500 ký tự.</small>
        <div class="d-flex justify-content-end mt-3">
          <button type="button" class="btn btn-outline-secondary mr-2" :disabled="cancelling" @click="cancelOpen = false">Đóng</button>
          <button class="btn btn-danger" :disabled="cancelling || cancelReason.trim().length < 3"><b-spinner v-if="cancelling" small class="mr-1" />Xác nhận hủy</button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { paymentHubRequest } from '~/utils/paymentHub';
import { feeQuery, feeCanCancel, feeUsage, normalizeFeeResponse, feeCancelPayload } from '~/utils/paymentHubFees';

export default {
  layout: 'app',
  data: () => ({
    loading: false, loaded: false, cancelling: false, error: '', fees: [], total: 0, page: 1, pageSize: 50,
    summary: { total: 0, active: 0, attached: 0, cancelled: 0 },
    filters: { type: '', status: '', source: '', billingMonth: '', search: '' },
    selectedFee: null, detailOpen: false, cancelFee: null, cancelOpen: false, cancelReason: '', cancelTrigger: null
  }),
  computed: {
    pageCount() { return Math.max(1, Math.ceil(this.total / this.pageSize)); },
    typeOptions() { return this.optionValues('type', ['TUITION', 'CAMERA', 'FACILITY', 'EXTENDED', 'ABSENCE_CREDIT']); },
    sourceOptions() { return this.optionValues('source', ['AUTOMATIC', 'MANUAL']); },
    summaryCards() {
      return [
        { key: 'total', label: 'Tổng khoản phí', value: this.summary.total, className: 'text-dark' },
        { key: 'active', label: 'Đang hiệu lực', value: this.summary.active, className: 'text-success' },
        { key: 'attached', label: 'Đã dùng / có chứng từ', value: this.summary.attached, className: 'text-primary' },
        { key: 'cancelled', label: 'Đã hủy', value: this.summary.cancelled, className: 'text-secondary' }
      ];
    }
  },
  mounted() { this.loadFees(); },
  methods: {
    optionValues(key, defaults) { return [...new Set(defaults.concat(this.fees.map(item => item[key]).filter(Boolean)))]; },
    async loadFees() {
      if (this.loading) return;
      this.loading = true; this.error = '';
      try {
        if (!this.$store.state.user.user?.id) await this.$store.dispatch('user/getRole');
        const query = feeQuery(this.filters, this.page, this.pageSize);
        const response = await paymentHubRequest(this, 'get', `fees?${query}`);
        const result = normalizeFeeResponse(response.data);
        this.fees = result.items; this.total = result.total; this.summary = result.summary; this.loaded = true;
      } catch (error) { this.error = error.response?.data?.error || error.response?.data?.message || error.message || 'Không tải được khoản phí'; }
      finally { this.loading = false; }
    },
    applyFilters() { this.page = 1; this.loadFees(); },
    resetFilters() { this.filters = { type: '', status: '', source: '', billingMonth: '', search: '' }; this.page = 1; this.loadFees(); },
    changePage(delta) { this.page += delta; this.loadFees(); },
    usage: feeUsage,
    canCancel: feeCanCancel,
    openDetail(fee) { this.selectedFee = fee; this.detailOpen = true; },
    openCancel(fee, event) { if (!feeCanCancel(fee)) return; this.cancelFee = fee; this.cancelReason = ''; this.cancelTrigger = event?.currentTarget || null; this.cancelOpen = true; },
    async submitCancel() {
      if (this.cancelling || !this.cancelFee || !feeCanCancel(this.cancelFee)) return;
      let body;
      try { body = feeCancelPayload(this.cancelReason); } catch (error) { this.error = error.message; return; }
      this.cancelling = true; this.error = '';
      try {
        const id = this.cancelFee.id || this.cancelFee._id;
        await paymentHubRequest(this, 'post', `fees/${encodeURIComponent(id)}/cancel`, body);
        this.cancelOpen = false;
        this.$bvToast.toast('Đã hủy khoản phí.', { title: 'Thành công', variant: 'success', solid: true });
        await this.loadFees();
      } catch (error) { this.error = error.response?.data?.error || error.response?.data?.message || error.message; }
      finally { this.cancelling = false; }
    },
    money(value) { return Number(value || 0).toLocaleString('vi-VN'); },
    typeLabel(value) { return ({ TUITION: 'Học phí', CAMERA: 'Camera', FACILITY: 'Cơ sở vật chất', EXTENDED: 'Phí mở rộng', ABSENCE_CREDIT: 'Giảm nghỉ học' })[value] || value || 'Chưa phân loại'; },
    sourceLabel(value) { return ({ MANUAL: 'Chủ động nghiệp vụ', AUTOMATIC: 'Tự động định kỳ' })[value] || value || 'Không rõ'; },
    statusLabel(value) { return ({ ACTIVE: 'Đang hiệu lực', CANCELLED: 'Đã hủy' })[value] || value || 'Không rõ'; },
    subjectName(fee) { const student = fee.student || fee.subject || fee.child || {}; const parent = fee.parent || {}; return student.name || fee.studentName || parent.name || fee.parentName || 'Chưa xác định đối tượng'; },
    subjectMeta(fee) { const student = fee.student || fee.subject || fee.child || {}; const parent = fee.parent || {}; return [student.code || fee.subjectCode, parent.name && student.name ? `PH: ${parent.name}` : '', parent.code].filter(Boolean).join(' · '); },
    periodLabel(fee) { return fee.periodLabel || fee.billingMonth || fee.schoolYear || fee.period || fee.month || 'Không xác định'; },
    evidenceText(fee) {
      const evidence = fee.evidence || fee.metadata?.evidence || fee.proof;
      if (!evidence || (Array.isArray(evidence) && !evidence.length)) return 'Chưa có bằng chứng đính kèm';
      if (typeof evidence === 'string') return evidence;
      return JSON.stringify(evidence, null, 2);
    },
    dateTime(value) { const date = new Date(value); return Number.isNaN(date.getTime()) ? 'Không rõ' : new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short' }).format(date); }
  }
};
</script>

<style scoped>
.fee-header, .fee-pagination { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.fee-filters { display: grid; grid-template-columns: minmax(15rem, 2fr) repeat(4, minmax(8rem, 1fr)); gap: .75rem; align-items: end; }
.fee-filters label { font-size: .8rem; font-weight: 600; color: #495057; }
.filter-actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: .5rem; }
.fee-table { min-width: 1050px; }
.fee-table th, .fee-table td { padding: .75rem; vertical-align: top; }
.table-responsive:focus-visible { outline: 2px solid #005fcc; outline-offset: 2px; }
.fee-detail dt, .fee-detail dd { padding-top: .5rem; padding-bottom: .5rem; border-bottom: 1px solid #edf0f2; }
.evidence { padding: .75rem; max-height: 15rem; overflow: auto; white-space: pre-wrap; overflow-wrap: anywhere; background: #f8f9fa; border-radius: .25rem; font: inherit; }
@media (max-width: 991px) { .fee-filters { grid-template-columns: repeat(2, minmax(0, 1fr)); } .search-field { grid-column: 1 / -1; } }
@media (max-width: 575px) { .fee-header { align-items: flex-start; } .fee-filters { grid-template-columns: 1fr; } .search-field, .filter-actions { grid-column: auto; } .filter-actions .btn { flex: 1; } .fee-pagination { align-items: flex-start; } }
</style>
