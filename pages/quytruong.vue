<template>
  <div class="container-fluid py-3 school-fund" :aria-busy="busy ? 'true' : 'false'">
    <div class="fund-header">
      <div><h1 class="h4">Quỹ trường</h1><p class="text-muted mb-2">Từ công nợ đã thanh toán, không gồm số dư ví phụ huynh.</p></div>
      <div class="fund-actions">
        <button type="button" :disabled="busy" class="btn btn-outline-primary" @click="openSettings">Cài đặt quỹ</button>
        <button type="button" :disabled="busy" class="btn btn-outline-secondary" @click="load">{{ error ? 'Thử tải lại' : 'Tải lại sổ' }}</button>
      </div>
    </div>
    <b-modal v-model="settingsOpen" title="Cài đặt quỹ" hide-footer :no-close-on-backdrop="settingsBusy" :no-close-on-esc="settingsBusy" :hide-header-close="settingsBusy">
      <p class="text-muted">Số đầu quỹ, không gồm tiền dư của phụ huynh.</p>
      <div v-if="settingsError" class="alert alert-danger" role="alert">{{ settingsError }}</div>
      <div v-if="settingsSaved" class="alert alert-success">Đã lưu thiết lập. Chọn Khởi tạo quỹ để bắt đầu.</div>
      <form @submit.prevent="saveSettings">
        <fieldset :disabled="settingsBusy || !settingsLoaded">
          <label for="fund-start">Ngày bắt đầu</label>
          <input id="fund-start" v-model="setup.startDate" type="date" required class="form-control mb-3">
          <label for="fund-opening">Số dư đầu quỹ (đ)</label>
          <input id="fund-opening" v-model.number="setup.openingCash" type="number" step="1" min="-2147483647" max="2147483647" required class="form-control mb-3">
          <label for="fund-setup-note">Ghi chú</label>
          <textarea id="fund-setup-note" v-model.trim="setup.note" maxlength="1000" class="form-control mb-3" />
          <button class="btn btn-primary">Lưu thiết lập</button>
        </fieldset>
      </form>
      <p class="small text-muted mt-3">Số đầu là quỹ trước các thanh toán của ngày bắt đầu. Các phiếu thanh toán từ ngày đó sẽ được cộng vào quỹ.</p>
      <button v-if="!fund" type="button" class="btn btn-success" :disabled="settingsBusy || !settingsLoaded" @click="initializeFund">Khởi tạo quỹ</button>
    </b-modal>
    <p v-if="busy" role="status" class="mt-3">Đang xử lý…</p>
    <div v-if="error" role="alert" class="alert alert-danger mt-3">{{ error }}</div>
    <div v-if="pending" role="status" class="alert alert-warning mt-3">
      <p class="mb-2">Chưa xác nhận kết quả {{ pending.path === 'school-fund/reversals' ? 'hoàn tác' : 'phiếu' }}. Thử lại cùng giao dịch để tránh ghi nhận trùng.</p>
      <button type="button" :disabled="busy" class="btn btn-outline-dark" @click="sendPending">Thử lại giao dịch</button>
    </div>
    <p v-if="!fund && !busy && !error" class="mt-3">Chưa có dữ liệu quỹ. Chọn “Tải lại sổ” để kiểm tra.</p>
    <div v-if="fund">
      <section class="fund-summary my-3" aria-label="Số dư quỹ">
        <div><p class="mb-1 text-muted">Còn được rút</p><p class="h3 mb-0">{{ money(fund.cash) }} đ</p></div>
        <div class="fund-actions">
          <button type="button" :disabled="busy || !!pending" class="btn btn-primary" @click="openForm('WITHDRAWAL')">Rút tiền</button>
          <button type="button" :disabled="busy || !!pending" class="btn btn-outline-primary" @click="openForm('DEPOSIT')">Nộp tiền</button>
        </div>
      </section>
      <section class="period-summary mb-3" aria-label="Phát sinh trong kỳ">
        <div><p class="mb-1 text-muted">Tăng trong kỳ</p><p class="h5 mb-0 text-success">+{{ money(fund.periodIncome || 0) }} đ</p></div>
        <div><p class="mb-1 text-muted">Giảm trong kỳ</p><p class="h5 mb-0 text-danger">-{{ money(fund.periodExpense || 0) }} đ</p></div>
        <div><p class="mb-1 text-muted">Phát sinh ròng</p><p class="h5 mb-0">{{ fund.periodNet > 0 ? '+' : '' }}{{ money(fund.periodNet || 0) }} đ</p></div>
      </section>
      <p v-if="fund.cash < 0" class="text-danger">Trường cần bù quỹ</p>
      <form v-if="formOpen" class="fund-form mb-3" @submit.prevent="submit">
        <h2 class="h5">{{ form.type === 'WITHDRAWAL' ? 'Rút tiền' : 'Nộp tiền' }}</h2>
        <fieldset :disabled="busy || !!pending">
          <label for="fund-amount">Số tiền (đ)</label><input id="fund-amount" ref="amount" v-model.number="form.amount" required type="number" min="1" max="2147483647" step="1" class="form-control mb-2">
          <label for="fund-counterparty">{{ form.type === 'WITHDRAWAL' ? 'Người nhận tiền' : 'Người giao tiền' }}</label><input id="fund-counterparty" v-model.trim="form.counterparty" required maxlength="200" class="form-control mb-2">
          <label for="fund-reason">Lý do</label><input id="fund-reason" v-model.trim="form.reason" required maxlength="200" class="form-control mb-2">
        </fieldset>
        <div class="fund-actions">
          <button :disabled="busy || !!pending" class="btn btn-primary">Ghi nhận phiếu</button>
          <button type="button" :disabled="busy" class="btn btn-outline-secondary" @click="formOpen = false">Đóng</button>
        </div>
      </form>
      <div class="fund-period mt-4">
        <div><h2 class="h5 mb-1">Sổ quỹ</h2><p class="small text-muted mb-0">{{ periodLabel }}: {{ displayDate(range.from) }} - {{ displayDate(range.to) }}</p></div>
        <div class="fund-actions" role="group" aria-label="Chu kỳ sổ quỹ">
          <button v-for="option in periodOptions" :key="option.value" type="button" class="btn btn-sm" :class="period === option.value ? 'btn-primary' : 'btn-outline-secondary'" :disabled="busy" @click="selectPeriod(option.value)">{{ option.label }}</button>
        </div>
      </div>
      <b-modal v-model="customPeriodOpen" title="Chọn khoảng thời gian" centered hide-footer
        :no-close-on-backdrop="busy" :no-close-on-esc="busy" :hide-header-close="busy">
        <form @submit.prevent="applyCustomRange">
          <div class="custom-period-fields">
            <div><label for="fund-from">Từ ngày</label><input id="fund-from" v-model="customRange.from" type="date" required class="form-control" @input="customRangeError = ''"></div>
            <div><label for="fund-to">Đến ngày</label><input id="fund-to" v-model="customRange.to" type="date" required class="form-control" @input="customRangeError = ''"></div>
          </div>
          <div class="range-preview mt-3" :class="customRangeError ? 'range-preview-error' : ''">
            <i class="far fa-calendar-alt mr-2" aria-hidden="true"></i>
            <span v-if="customRange.from && customRange.to">{{ displayDate(customRange.from) }} đến {{ displayDate(customRange.to) }}</span>
            <span v-else>Chọn ngày bắt đầu và ngày kết thúc</span>
          </div>
          <p v-if="customRangeError" class="text-danger small mt-2 mb-0" role="alert">{{ customRangeError }}</p>
          <div class="modal-period-actions mt-4">
            <button type="button" class="btn btn-outline-secondary" :disabled="busy" @click="cancelCustomRange">Hủy</button>
            <button class="btn btn-primary" :disabled="busy">{{ busy ? 'Đang tải...' : 'Áp dụng' }}</button>
          </div>
        </form>
      </b-modal>
      <div class="table-responsive" role="region" aria-label="Sổ quỹ, cuộn ngang để xem đầy đủ" tabindex="0">
      <table class="table table-sm fund-table">
        <caption>Thời gian Việt Nam (UTC+7). Số tiền tính bằng đồng.</caption>
        <thead><tr><th scope="col">Thời điểm</th><th scope="col">Nghiệp vụ</th><th scope="col">Lý do / người nhận, giao</th><th scope="col">Người lập</th><th scope="col" class="text-end">Tăng/giảm</th><th scope="col" class="text-end">Số dư sau</th><th scope="col">Thao tác</th></tr></thead>
        <tbody><tr v-for="row in fund.rows" :key="row._id">
          <td class="text-nowrap">{{ dateTime(row.createdAt) }}</td><td>{{ labels[row.type] || 'Nghiệp vụ khác' }}</td>
          <td class="fund-description">{{ row.reason || 'Chưa có lý do' }}<br><span class="text-muted">{{ row.counterparty || 'Chưa có thông tin người nhận/giao' }}</span></td><td>{{ row.createdByName || 'Chưa có tên người lập' }}</td>
          <td class="text-end text-nowrap">{{ row.delta > 0 ? '+' : '' }}{{ money(row.delta) }}</td><td class="text-end text-nowrap">{{ money(row.after) }}</td>
          <td><button v-if="['WITHDRAWAL','DEPOSIT'].includes(row.type)" :disabled="busy || !!pending" class="btn btn-sm btn-outline-danger" @click="reverse(row, $event)">Hoàn tác</button></td>
        </tr><tr v-if="!fund.rows || !fund.rows.length"><td colspan="7" class="text-center py-4">Chưa có giao dịch trên trang này.</td></tr></tbody>
      </table>
      </div>
      <nav class="fund-actions mt-3" aria-label="Phân trang sổ quỹ">
      <button class="btn btn-outline-secondary" :disabled="busy || page <= 1" @click="changePage(-1)">Trước</button>
      <span> Trang {{ page }} / {{ Math.max(1, Math.ceil(fund.total / 50)) }} </span>
      <button class="btn btn-outline-secondary" :disabled="busy || page * 50 >= fund.total" @click="changePage(1)">Sau</button>
      </nav>
    </div>
    <b-modal v-model="reversalOpen" title="Hoàn tác giao dịch" hide-footer :return-focus="reversalTrigger" :no-close-on-backdrop="busy" :no-close-on-esc="busy" :hide-header-close="busy">
      <form v-if="reversalRow" @submit.prevent="confirmReversal">
        <p>{{ labels[reversalRow.type] }} · {{ dateTime(reversalRow.createdAt) }}</p>
        <p>{{ reversalRow.reason || 'Chưa có lý do' }}</p>
        <div class="alert alert-warning">
          Quỹ sẽ {{ reversalRow.delta < 0 ? 'tăng' : 'giảm' }} <strong>{{ money(Math.abs(reversalRow.delta)) }} đ</strong>.
          <template v-if="fund">Số dư dự kiến: <strong>{{ money(Number(fund.cash) - Number(reversalRow.delta)) }} đ</strong>.</template>
          <div>Ghi một giao dịch đối ứng, không xóa giao dịch gốc. Số dư thực tế có thể thay đổi nếu có giao dịch mới.</div>
        </div>
        <label for="reversal-reason">Lý do hoàn tác</label>
        <textarea id="reversal-reason" v-model.trim="reversalReason" required maxlength="200" rows="3" class="form-control mb-3" :disabled="busy || !!pending" />
        <p v-if="error" role="alert" class="text-danger">{{ error }}</p>
        <p v-if="pending" role="status">Chưa xác nhận kết quả. Đóng hộp thoại và chọn “Thử lại giao dịch”.</p>
        <div class="fund-actions">
          <button class="btn btn-danger" :disabled="busy || !!pending || !reversalReason.trim()">Xác nhận hoàn tác</button>
          <button type="button" class="btn btn-outline-secondary" :disabled="busy" @click="reversalOpen = false">Đóng</button>
        </div>
      </form>
    </b-modal>
  </div>
</template>
<script>
import { paymentHubRequest } from '~/utils/paymentHub';
export default {
  layout: 'app',
  data: () => ({ fund: null, page: 1, busy: false, error: '', pending: null, formOpen: false,
    period: 'this-week', range: { from: '', to: '' }, customRange: { from: '', to: '' }, customPeriodOpen: false, customRangeError: '',
    periodOptions: [{ value: 'this-week', label: 'Tuần này' }, { value: 'last-week', label: 'Tuần trước' },
      { value: 'this-month', label: 'Tháng này' }, { value: 'last-month', label: 'Tháng trước' }, { value: 'custom', label: 'Tùy chỉnh' }],
    settingsOpen: false, settingsBusy: false, settingsLoaded: false, settingsError: '', settingsSaved: false,
    setup: { startDate: '', openingCash: 0, note: '' },
    reversalOpen: false, reversalRow: null, reversalReason: '', reversalTrigger: null,
    form: { type: 'WITHDRAWAL', amount: null, reason: '', counterparty: '' },
    labels: { OPENING: 'Số dư đầu', WITHDRAWAL: 'Rút quỹ', DEPOSIT: 'Nộp quỹ', REVERSAL: 'Hoàn tác', SETTLEMENT: 'Thanh toán công nợ' } }),
  mounted() {
    try { this.pending = JSON.parse(sessionStorage.getItem('school-fund-pending') || 'null'); } catch (_) {}
    this.range = this.periodRange('this-week');
    this.customRange = { ...this.range };
    this.load();
  },
  computed: {
    periodLabel() { return this.periodOptions.find(option => option.value === this.period)?.label || 'Tùy chỉnh'; }
  },
  methods: {
    async initializeFund() {
      if (this.settingsBusy || !this.settingsLoaded) return;
      if (!window.confirm(`Khởi tạo quỹ từ ${this.setup.startDate}, số đầu ${this.money(this.setup.openingCash)} đ?`)) return;
      this.settingsBusy = true; this.settingsError = '';
      try {
        await paymentHubRequest(this, 'post', 'school-fund/settings', { ...this.setup });
        const result = await paymentHubRequest(this, 'post', 'school-fund/initialize', {});
        this.fund = result.data.data; this.page = 1; this.error = ''; this.settingsOpen = false;
      } catch (e) { this.settingsError = e.response?.data?.error || e.message; await this.load(); }
      finally { this.settingsBusy = false; }
    },
    async openSettings() {
      this.settingsOpen = true; this.settingsBusy = true; this.settingsLoaded = false; this.settingsError = ''; this.settingsSaved = false;
      try {
        if (!this.$store.state.user.user?.id) await this.$store.dispatch('user/getRole');
        const res = await paymentHubRequest(this, 'get', 'school-fund/settings');
        if (res.data.data) this.setup = { startDate: res.data.data.startDate, openingCash: res.data.data.openingCash, note: res.data.data.note || '' };
        this.settingsLoaded = true;
      } catch (e) { this.settingsError = e.response?.data?.error || e.message; }
      finally { this.settingsBusy = false; }
    },
    async saveSettings() {
      if (this.settingsBusy || !this.settingsLoaded) return;
      this.settingsBusy = true; this.settingsError = ''; this.settingsSaved = false;
      try {
        await paymentHubRequest(this, 'post', 'school-fund/settings', { ...this.setup });
        this.settingsSaved = true;
      } catch (e) { this.settingsError = e.response?.data?.error || e.message; }
      finally { this.settingsBusy = false; }
    },
    money(value) { return Number(value).toLocaleString('vi-VN'); },
    localDate(date) {
      const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
      const value = type => parts.find(part => part.type === type).value;
      return `${value('year')}-${value('month')}-${value('day')}`;
    },
    periodRange(period, now = new Date()) {
      const todayText = this.localDate(now);
      const today = new Date(`${todayText}T12:00:00Z`);
      const day = today.getUTCDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      const shift = (date, days) => { const result = new Date(date); result.setUTCDate(result.getUTCDate() + days); return result; };
      if (period === 'this-week') return { from: this.localDate(shift(today, mondayOffset)), to: this.localDate(shift(today, mondayOffset + 6)) };
      if (period === 'last-week') return { from: this.localDate(shift(today, mondayOffset - 7)), to: this.localDate(shift(today, mondayOffset - 1)) };
      const year = Number(todayText.slice(0, 4)), month = Number(todayText.slice(5, 7));
      const start = period === 'last-month' ? new Date(Date.UTC(year, month - 2, 1, 12)) : new Date(Date.UTC(year, month - 1, 1, 12));
      const end = period === 'last-month' ? new Date(Date.UTC(year, month - 1, 1, 12)) : new Date(Date.UTC(year, month, 1, 12));
      end.setUTCDate(end.getUTCDate() - 1);
      return { from: this.localDate(start), to: this.localDate(end) };
    },
    displayDate(value) { return value ? value.split('-').reverse().join('/') : ''; },
    async selectPeriod(period) {
      if (this.busy) return;
      if (period === 'custom') {
        this.customRange = { ...this.range };
        this.customRangeError = '';
        this.customPeriodOpen = true;
        return;
      }
      this.period = period;
      this.range = this.periodRange(period); this.page = 1; await this.load();
    },
    cancelCustomRange() {
      if (this.busy) return;
      this.customPeriodOpen = false;
      this.customRangeError = '';
      this.customRange = { ...this.range };
    },
    async applyCustomRange() {
      if (!this.customRange.from || !this.customRange.to || this.customRange.from > this.customRange.to) {
        this.customRangeError = 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc'; return;
      }
      this.period = 'custom'; this.range = { ...this.customRange }; this.page = 1;
      this.customPeriodOpen = false; this.customRangeError = ''; await this.load();
    },
    dateTime(value) {
      if (!value) return 'Chưa có thời điểm';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return 'Chưa có thời điểm';
      return new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);
    },
    openForm(type) {
      if (this.busy || this.pending) return;
      this.form.type = type; this.formOpen = true;
      this.$nextTick(() => { if (this.$refs.amount) this.$refs.amount.focus(); });
    },
    async load() {
      if (this.busy) return;
      this.busy = true;
      try {
        // Direct navigation mounts this page before the layout's async role load.
        if (!this.$store.state.user.user?.id) await this.$store.dispatch('user/getRole');
        if (!this.range.from || !this.range.to) this.range = this.periodRange('this-week');
        const query = `page=${encodeURIComponent(this.page)}&from=${encodeURIComponent(this.range.from)}&to=${encodeURIComponent(this.range.to)}`;
        const res = await paymentHubRequest(this, 'get', `school-fund?${query}`);
        this.fund = res.data.data; this.error = '';
      }
      catch (e) { this.error = e.response?.data?.error || e.message; }
      finally { this.busy = false; }
    },
    async changePage(delta) {
      if (this.busy) return;
      const previous = this.page;
      this.page += delta; await this.load();
      if (this.error) this.page = previous;
    },
    async submit() {
      if (this.busy) return;
      if (!this.pending) {
        if (!Number.isInteger(this.form.amount) || this.form.amount <= 0 || this.form.amount > 2147483647) { this.error = 'Số tiền không hợp lệ'; return; }
        if (!this.form.reason.trim() || !this.form.counterparty.trim()) { this.error = 'Nhập người nhận/giao tiền và lý do'; return; }
        this.pending = { path: 'school-fund/vouchers', body: { ...this.form, operationId: window.crypto.randomUUID() } };
      }
      await this.sendPending();
    },
    reverse(row, event) {
      if (this.busy || this.pending) return;
      this.reversalRow = row; this.reversalReason = ''; this.error = '';
      this.reversalTrigger = event ? event.currentTarget : null; this.reversalOpen = true;
    },
    async confirmReversal() {
      if (this.busy || this.pending || !this.reversalRow || !this.reversalReason.trim()) return;
      const row = this.reversalRow;
      const reason = this.reversalReason;
      this.pending = { path: 'school-fund/reversals', body: { operationId: window.crypto.randomUUID(), voucherId: row._id, reason: reason.trim() } };
      await this.sendPending();
    },
    async sendPending() {
      if (this.busy || !this.pending) return;
      this.busy = true; this.error = '';
      try {
        sessionStorage.setItem('school-fund-pending', JSON.stringify(this.pending));
        await paymentHubRequest(this, 'post', this.pending.path, this.pending.body);
        sessionStorage.removeItem('school-fund-pending'); this.pending = null;
        this.form.amount = null; this.form.reason = ''; this.page = 1;
        this.formOpen = false; this.reversalOpen = false;
        this.busy = false;
        await this.load();
      } catch (e) {
        this.error = e.response?.data?.error || e.message;
        if (e.response && [400, 401, 403, 409, 503].includes(e.response.status)) {
          sessionStorage.removeItem('school-fund-pending'); this.pending = null;
        }
      } finally { this.busy = false; }
    }
  }
};
</script>
<style scoped>
.fund-header, .fund-summary, .fund-period { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; }
.fund-summary, .fund-form { padding: 1rem; border: 1px solid #dee2e6; border-radius: .5rem; }
.period-summary { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .75rem; }
.period-summary > div { padding: .75rem 1rem; border: 1px solid #dee2e6; border-radius: .5rem; background: #fff; }
.custom-period-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.custom-period-fields label { font-weight: 600; font-size: .875rem; }
.range-preview { display: flex; align-items: center; min-height: 3rem; padding: .75rem 1rem; color: #35506b; background: #f3f8fc; border: 1px solid #d8e7f2; border-radius: .5rem; }
.range-preview-error { color: #842029; background: #f8d7da; border-color: #f5c2c7; }
.modal-period-actions { display: flex; justify-content: flex-end; gap: .5rem; }
.fund-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
.fund-form { max-width: 36rem; }
.fund-table { min-width: 850px; }
.fund-table th, .fund-table td { padding: .75rem .5rem; vertical-align: top; }
.fund-description { min-width: 12rem; max-width: 24rem; overflow-wrap: anywhere; }
.table-responsive:focus-visible { outline: 2px solid #005fcc; outline-offset: 2px; }
@media (max-width: 575px) { .fund-summary > div { width: 100%; } .fund-summary .btn { flex: 1; } .period-summary { grid-template-columns: 1fr; } .fund-period .fund-actions { width: 100%; } .fund-period .btn { flex: 1 0 40%; } .custom-period-fields { grid-template-columns: 1fr; } .modal-period-actions .btn { flex: 1; } }
</style>
