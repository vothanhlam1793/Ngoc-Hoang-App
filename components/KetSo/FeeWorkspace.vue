<template>
  <div class="container-fluid py-3">
    <nuxt-link :to="`/ketso/${$route.params.year}/${$route.params.month}`">← Danh sách lớp</nuxt-link>
    <h4 class="mt-3">Kết sổ {{ doc ? doc.className : '' }} · {{ month }}</h4>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <p v-if="!doc">Đang tải khoản phí…</p>
    <template v-else-if="doc.status === 'LEGACY'">
      <div class="alert alert-info">Phiếu này đã được lưu theo cơ chế cũ. Giữ nguyên số liệu lịch sử.</div>
      <nuxt-link :to="$route.path.replace(/\/$/, '') + '/view'" class="btn btn-primary">Xem phiếu cũ</nuxt-link>
    </template>
    <template v-else>
      <p>Tháng đối soát: <strong>{{ month }}</strong> · Kỳ thu: <strong>{{ doc.billingMonth }}</strong> · {{ statusLabel }}</p>
      <div class="alert alert-light border">Số tiền lấy từ khoản Fee đã tạo. Camera và các khoản chung phụ huynh chỉ thu một lần. Chốt sổ lưu chứng từ; chưa phát hành thông báo hoặc ghi tăng công nợ.</div>
      <div class="mb-3">
        <button class="btn btn-outline-primary mr-2" :disabled="busy" @click="load">Tải lại phí</button>
        <nuxt-link to="/khoanphi/cauhinh" class="btn btn-outline-info mr-2">Tạo phí &amp; Lịch tự động</nuxt-link>
        <button v-if="doc.status === 'DRAFT'" class="btn btn-secondary mr-2" :disabled="busy" @click="save('draft')">Lưu nháp</button>
        <button v-if="doc.status !== 'POSTED'" class="btn btn-success" :disabled="busy || missing.length > 0" @click="save('post')">{{ doc.status === 'POSTING' ? 'Tiếp tục chốt' : 'Chốt sổ' }}</button>
      </div>
      <div v-if="missing.length" class="alert alert-warning">Chưa tạo học phí kỳ {{ doc.billingMonth }}: {{ missing.map(s => s.name).join(', ') }}</div>
      <div class="card p-3 mb-3"><h5>Tổng theo Fee: {{ money(doc.total) }} đ</h5>
        <small>Khoản giảm trừ mang số âm; khoản đã thuộc chứng từ khác không cộng vào tổng này.</small>
      </div>
      <div class="table-responsive matrix-scroll"><table class="table table-bordered table-hover bg-white fee-matrix">
        <thead><tr><th class="student-column">Học sinh</th><th>Tổng thu (đ)</th><th v-for="type in matrix.columns" :key="type">{{ labels[type] || 'Khoản khác' }}</th><th>Diễn giải</th></tr></thead>
        <tbody><tr v-for="row in matrix.rows" :key="row.id">
          <th class="student-column">{{ row.name }}<small v-if="row.isShared" class="d-block text-muted">Khoản chung</small></th>
          <td class="text-right font-weight-bold text-success"><button v-if="!row.isShared" type="button" class="btn btn-link font-weight-bold text-success p-0" :aria-label="'Xem phiếu của ' + row.name" @click="openStudent(row)">{{ money(row.total) }}</button><span v-else>{{ money(row.total) }}</span></td>
          <td v-for="type in matrix.columns" :key="type" class="text-right">
            <button v-if="(row.cells[type] || []).length" class="btn btn-link p-0" :class="{'text-danger': ['ABSENCE_CREDIT', 'ADJUSTMENT_CREDIT'].includes(type)}" @click="showDetails(row, type)">
              {{ (row.cells[type] || []).some(f => !f.usedBy) ? money(cellTotal(row, type)) : 'Đã tính ở phiếu khác' }}
            </button>
            <span v-else-if="!row.shared.some(s => s.type === type)" :class="type === 'TUITION' ? 'text-warning' : 'text-muted'">{{ type === 'TUITION' ? 'Chưa tạo' : '—' }}</span>
            <button v-for="share in row.shared.filter(s => s.type === type)" :key="share.fee.id" class="btn btn-link p-0 small d-block" @click="showShared(row, share)">Thu chung tại {{ share.name }}</button>
            <button v-if="['EXTENDED', 'ADJUSTMENT_CREDIT'].includes(type) && !row.isShared && doc.status === 'DRAFT'" type="button" class="btn btn-sm btn-outline-primary ml-2" :disabled="busy" :aria-label="'Thêm ' + labels[type] + ' cho ' + row.name" @click="openExtra(row, type)">＋</button>
          </td>
          <td class="small">{{ rowNotes(row) }}</td>
        </tr><tr v-if="!matrix.rows.length"><td :colspan="matrix.columns.length + 3">Chưa có học sinh hoặc khoản phí.</td></tr></tbody>
        <tfoot><tr class="font-weight-bold"><th class="student-column">Tổng cộng</th><td class="text-right text-success">{{ money(doc.total) }}</td><td v-for="type in matrix.columns" :key="type" class="text-right">{{ money(matrix.totals[type]) }}</td><td></td></tr></tfoot>
      </table></div>
      <p class="small text-muted mt-2">Bấm Tổng thu để xem và điều chỉnh phiếu riêng của bé. Bấm số tiền từng cột để xem chi tiết. “—” là chưa có khoản phí ở cột này; 0đ là khoản đã có với tổng bằng 0.</p>
      <b-modal v-model="studentOpen" :title="'Phiếu kết sổ — ' + studentName" size="lg" hide-footer :no-close-on-backdrop="busy" :no-close-on-esc="busy" :hide-header-close="busy">
        <p><strong>{{ doc.className }}</strong> · Đối soát {{ month }} · Kỳ thu {{ doc.billingMonth }} · {{ statusLabel }}</p>
        <p v-if="studentParent">Phụ huynh: {{ studentParent }}</p>
        <div class="alert alert-info">Điều chỉnh tại phiếu này, giữ nguyên khoản phí gốc và lưu lịch sử. Không tự thay đổi công nợ, trừ ví hay hoàn tiền.</div>
        <div v-if="studentError" class="alert alert-danger" role="alert">{{ studentError }}</div>
        <form @submit.prevent="saveStudent">
          <div v-for="item in studentItems" :key="item.id" class="border rounded p-3 mb-2">
            <label :for="'adjust-' + item.id" class="font-weight-bold">{{ labels[item.type] || 'Khoản khác' }} · {{ item.code }}</label>
            <small v-if="!item.studentId" class="d-block text-warning">Khoản chung phụ huynh — chỉ tính tại bé đại diện này.</small>
            <p class="small mb-1">{{ explanation(item) }}</p>
            <div class="d-flex align-items-center"><span class="mr-3">Đang thu: {{ money(item.before) }}đ</span><input :id="'adjust-' + item.id" v-model.number="item.amount" type="number" step="1" :min="isCredit(item) ? -2147483647 : 0" :max="isCredit(item) ? 0 : 2147483647" class="form-control" style="max-width: 220px" :disabled="busy || !canAdjustStudent" required /><span class="ml-2">đ</span></div>
            <small v-if="isCredit(item)" class="text-muted">Khoản giảm nhập số âm, ví dụ -100000; nhập 0 nếu bỏ giảm.</small>
          </div>
          <p v-if="!studentItems.length" class="text-muted">Bé chưa có khoản thu riêng để điều chỉnh. Kiểm tra các khoản thu chung bên dưới hoặc tạo phí trước.</p>
          <p v-for="(shared, index) in studentShared" :key="'shared-' + index" class="text-muted">{{ shared }}</p>
          <h5>Tổng sau điều chỉnh: {{ money(studentTotal) }} đ</h5>
          <template v-if="canAdjustStudent && studentItems.length">
            <label for="adjust-reason">Lý do điều chỉnh (bắt buộc)</label><textarea id="adjust-reason" v-model.trim="studentReason" class="form-control mb-3" maxlength="500" required :disabled="busy" />
            <button type="submit" class="btn btn-primary" :disabled="busy || !studentChanged">{{ busy ? 'Đang lưu…' : 'Lưu điều chỉnh' }}</button>
          </template>
          <button type="button" class="btn btn-light ml-2" :disabled="busy" @click="studentOpen = false">Đóng</button>
        </form>
        <section v-if="studentHistory.length" class="mt-4 border-top pt-3"><h6>Lịch sử điều chỉnh</h6>
          <div v-for="entry in studentHistory" :key="entry.requestId" class="mb-3 small">
            <strong>{{ new Date(entry.at).toLocaleString('vi-VN') }}</strong> · Người sửa: {{ entry.actorId }}<br />{{ entry.reason }}
            <div v-for="change in entry.changes" :key="change.feeId">{{ labels[change.type] || change.type }}: {{ money(change.before) }} → {{ money(change.after) }} đ</div>
          </div>
        </section>
      </b-modal>
      <b-modal v-model="extraOpen" :title="(extraType === 'ADJUSTMENT_CREDIT' ? 'Thêm giảm trừ khác — ' : 'Thêm phí mở rộng — ') + extraName" hide-footer :no-close-on-backdrop="busy" :no-close-on-esc="busy" :hide-header-close="busy">
      <form @submit.prevent="addExtra">
        <p>Kỳ thu: <strong>{{ doc.billingMonth }}</strong></p>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <label>Diễn giải</label><input v-model.trim="extra.description" required maxlength="500" class="form-control mb-2" :disabled="busy" />
        <label>{{ extraType === 'ADJUSTMENT_CREDIT' ? 'Số tiền giảm (nhập số dương, đ)' : 'Số tiền (đ)' }}</label><input v-model.number="extra.amount" type="number" min="1" max="2147483647" required class="form-control mb-2" :disabled="busy" />
        <p v-if="extraType === 'ADJUSTMENT_CREDIT'" class="small text-muted">Khoản này giảm số phải thu; không tạo giao dịch hoàn tiền.</p>
        <button class="btn btn-primary" :disabled="busy">{{ busy ? 'Đang lưu…' : 'Lưu khoản phí' }}</button>
        <button type="button" class="btn btn-light ml-2" :disabled="busy" @click="extraOpen = false">Hủy</button>
      </form>
      </b-modal>
      <b-modal v-model="detailsOpen" :title="detailsTitle" size="lg" ok-only ok-title="Đóng">
        <div v-if="detailError" class="alert alert-danger" role="alert">{{ detailError }}</div>
        <p v-if="!detailFees.length" class="text-muted">Không còn khoản phí trong mục này.</p>
        <div v-for="fee in detailFees" :key="fee.id" class="border-bottom pb-3 mb-3">
          <button v-if="canDeleteExtra(fee)" type="button" class="btn btn-sm btn-outline-danger float-right" :disabled="busy || deletingExtra" @click="deleteExtra(fee)"><i class="fas fa-trash mr-1" aria-hidden="true"></i>Xóa khoản</button>
          <strong>{{ money(fee.amount) }} đ</strong> · <code>{{ fee.code }}</code>
          <p class="mb-1">{{ explanation(fee) }}</p>
          <div v-if="fee.usedBy" class="text-muted">Đã tính tại {{ fee.usedBy }}</div>
          <template v-if="evidence(fee).creditDays !== undefined">
            <p class="small">{{ evidence(fee).creditDays }} ngày × {{ money(evidence(fee).unitPrice) }}đ. Đối soát {{ evidence(fee).month }}.</p>
            <div v-for="(streak, i) in evidence(fee).streaks || []" :key="i" class="small">Chuỗi nghỉ: {{ streak.map(date => date.split('-').reverse().join('/')).join(', ') }}</div>
            <div class="small mt-2">Có mặt: {{ (evidence(fee).present || []).map(date => date.split('-').reverse().join('/')).join(', ') || '—' }}</div>
            <div class="small">Ngày nghỉ: {{ (evidence(fee).absent || []).map(date => date.split('-').reverse().join('/')).join(', ') || '—' }}</div>
          </template>
        </div>
      </b-modal>
    </template>
  </div>
</template>
<script>
import { paymentHubRequest } from '~/utils/paymentHub';
import { settlementMatrix } from '~/utils/settlementMatrix';
export default {
  data: () => ({ doc: null, busy: false, error: '', extra: { studentIds: [], description: '', amount: null }, requestId: '',
    studentOpen: false, studentId: '', studentName: '', studentItems: [], studentShared: [], studentReason: '', studentError: '', studentRevision: 0, studentRequestId: '', studentFingerprint: '',
    extraOpen: false, extraName: '', detailsOpen: false, detailsTitle: '', detailFees: [],
    detailError: '', deletingExtra: false, extraType: 'EXTENDED',
    labels: { TUITION: 'Học phí', CAMERA: 'Camera', FACILITY: 'CSVC', ABSENCE_CREDIT: 'Giảm nghỉ học', EXTENDED: 'Phí mở rộng', ADJUSTMENT_CREDIT: 'Giảm trừ khác' } }),
  computed: {
    studentParent() { const student = this.doc?.students?.find(item => item.id === this.studentId); return student?.parentName || (student?.parentId ? 'Mã hồ sơ ' + student.parentId : ''); },
    canAdjustStudent() { return ['DRAFT', 'POSTED'].includes(this.doc?.status); },
    studentTotal() { return this.studentItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0); },
    studentChanged() { return this.studentItems.some(item => item.amount !== item.before); },
    studentHistory() { return (this.doc?.adjustmentHistory || []).filter(entry => entry.studentId === this.studentId).slice().reverse(); },
    matrix() { return settlementMatrix(this.doc || {}); },
    month() { return `${this.$route.params.year}-${String(this.$route.params.month).padStart(2, '0')}`; },
    path() { return `monthly-fees/${this.month}/${this.$route.params.id}`; },
    missing() { return (this.doc?.students || []).filter(s => s.missingTuition); },
    statusLabel() { return ({ DRAFT: 'Nháp', POSTING: 'Đang chốt — có thể tiếp tục', POSTED: 'Đã chốt' })[this.doc?.status]; }
  },
  mounted() { this.load(); },
  methods: {
    isCredit(item) { return ['ABSENCE_CREDIT', 'ADJUSTMENT_CREDIT'].includes(item.type); },
    openStudent(row) {
      this.studentId = row.id; this.studentName = row.name; this.studentRevision = this.doc.revision || 0;
      this.studentItems = Object.values(row.cells).flat().filter(fee => !fee.usedBy).map(fee => ({ ...fee, before: fee.amount }));
      this.studentShared = row.shared.map(share => `${this.labels[share.type] || 'Khoản chung'}: thu chung tại ${share.name}, không cộng lại tại bé này.`);
      this.studentShared.push(...Object.values(row.cells).flat().filter(fee => fee.usedBy).map(fee => `${this.labels[fee.type] || 'Khoản phí'}: đã tính tại phiếu khác.`));
      this.studentReason = ''; this.studentError = ''; this.studentRequestId = ''; this.studentFingerprint = ''; this.studentOpen = true;
    },
    async saveStudent() {
      if (this.busy || !this.studentChanged || !this.canAdjustStudent) return;
      const items = this.studentItems.filter(item => item.amount !== item.before).map(item => ({ id: item.id, amount: item.amount }));
      if (!this.studentReason || items.some(item => !Number.isInteger(item.amount))) { this.studentError = 'Nhập số tiền nguyên và lý do điều chỉnh'; return; }
      if (!await this.$bvModal.msgBoxConfirm(`Lưu điều chỉnh phiếu của ${this.studentName}? Tổng mới ${this.money(this.studentTotal)}đ. Không tự cập nhật công nợ hoặc hoàn tiền.`, { okTitle: 'Lưu điều chỉnh', cancelTitle: 'Quay lại' })) return;
      const fingerprint = JSON.stringify({ items, reason: this.studentReason, revision: this.studentRevision });
      if (fingerprint !== this.studentFingerprint) { this.studentRequestId = window.crypto.randomUUID(); this.studentFingerprint = fingerprint; }
      this.studentError = '';
      if (await this.request('post', '/student/' + this.studentId + '/adjust', { items, reason: this.studentReason, revision: this.studentRevision, requestId: this.studentRequestId })) {
        this.openStudent(this.matrix.rows.find(row => row.id === this.studentId));
        this.$bvToast.toast('Đã lưu điều chỉnh và lịch sử của bé.', { variant: 'success', solid: true });
      } else this.studentError = this.error;
    },
    canDeleteExtra(fee) { return this.doc?.status === 'DRAFT' && ['EXTENDED', 'ADJUSTMENT_CREDIT'].includes(fee.type) && fee.source === 'MANUAL' && !fee.usedBy && this.evidence(fee).settlement === this.doc._id; },
    async deleteExtra(fee) {
      if (this.busy || this.deletingExtra || !this.canDeleteExtra(fee)) return;
      this.deletingExtra = true; this.detailError = '';
      try {
        if (!await this.$bvModal.msgBoxConfirm(`Xóa khoản “${this.explanation(fee)}” — ${this.money(fee.amount)}đ của ${fee.name}?`,
          { title: 'Xóa ' + this.labels[fee.type], okTitle: 'Xóa khoản', cancelTitle: 'Hủy', okVariant: 'danger' })) return;
        const ids = this.detailFees.map(item => item.id);
        if (await this.request('delete', '/extra/' + encodeURIComponent(fee.id))) {
          this.detailFees = this.doc.fees.filter(item => ids.includes(item.id));
          this.$bvToast.toast('Đã xóa khoản khỏi tổng thu; lịch sử hủy được giữ lại.', { variant: 'success', solid: true });
        } else this.detailError = this.error;
      } finally { this.deletingExtra = false; }
    },
    cellTotal(row, type) { return (row.cells[type] || []).filter(f => !f.usedBy).reduce((sum, f) => sum + f.amount, 0); },
    rowNotes(row) { return Object.values(row.cells).flat().map(f => f.usedBy ? 'Khoản đã thuộc phiếu khác' : this.explanation(f)).filter(Boolean).join('; '); },
    evidence(fee) { try { return typeof fee.evidence === 'object' ? fee.evidence || {} : JSON.parse(fee.evidence || '{}'); } catch (_) { return {}; } },
    showDetails(row, type) { this.detailError = ''; this.detailsTitle = `${row.name} — ${this.labels[type] || 'Khoản khác'}`; this.detailFees = row.cells[type] || []; this.detailsOpen = true; },
    showShared(row, share) { this.detailsTitle = `${row.name} — Thu chung tại ${share.name}`; this.detailFees = [share.fee]; this.detailsOpen = true; },
    openExtra(row, type = 'EXTENDED') {
      if (this.doc.status !== 'DRAFT' || this.busy) return;
      if (this.extra.studentIds[0] !== row.id || this.extraType !== type || !this.requestId) {
        this.extra = { studentIds: [row.id], description: '', amount: null }; this.requestId = '';
      }
      this.extraType = type; this.extraName = row.name; this.error = ''; this.extraOpen = true;
    },
    money(n) { return Number(n || 0).toLocaleString('vi-VN'); },
    explanation(fee) { try { const e = JSON.parse(fee.evidence || '{}'); return e.description || (e.creditDays !== undefined ? `${e.creditDays} ngày × ${this.money(e.unitPrice)}đ, đối soát ${e.month}` : ''); } catch (_) { return ''; } },
    async request(method, suffix, body) {
      this.busy = true; this.error = '';
      try { await this.$store.dispatch('user/getRole'); this.doc = (await paymentHubRequest(this, method, this.path + suffix, body)).data.data; return true; }
      catch (error) { this.error = error.response?.data?.error || error.message; return false; }
      finally { this.busy = false; }
    },
    load() { return this.request('get', ''); },
    async save(action) {
      if (this.busy) return;
      if (action === 'post' && !await this.$bvModal.msgBoxConfirm('Chốt các khoản Fee đang hiển thị vào phiếu?', { okTitle: 'Chốt sổ', cancelTitle: 'Hủy' })) return;
      await this.request('post', '/' + action, {});
    },
    async addExtra() {
      if (this.busy) return;
      if (!this.requestId) this.requestId = window.crypto.randomUUID();
      if (await this.request('post', '/extra', { ...this.extra, type: this.extraType, requestId: this.requestId })) {
        this.requestId = ''; this.extra = { studentIds: [], description: '', amount: null };
        this.extraOpen = false;
      }
    }
  }
};
</script>
<style scoped>
.matrix-scroll { max-height: 70vh; }
.fee-matrix th, .fee-matrix td { min-width: 125px; vertical-align: middle; }
.fee-matrix .student-column { position: sticky; left: 0; min-width: 220px; background: white; z-index: 2; }
.fee-matrix thead th { position: sticky; top: 0; background: #eef2f6; z-index: 3; }
.fee-matrix thead .student-column { z-index: 4; background: #eef2f6; }
.fee-matrix tfoot th, .fee-matrix tfoot td { background: #eef7f0; }
</style>
