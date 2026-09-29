<template>
  <div>
    <div v-if="!isAdmin" class="alert alert-danger">Cần tài khoản có quyền quản trị (isAdmin) để quản lý MONA Pay.</div>
    <div v-else class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <h5 class="font-weight-bold">Thiết Lập Kết Nối MONA Pay</h5>
        <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
        <button v-if="!loaded" class="btn btn-outline-primary" :disabled="loading" @click="fetchConfig">{{ loading ? 'Đang tải...' : 'Tải lại cấu hình' }}</button>
        <form v-if="loaded" @submit.prevent="saveConfig">
          <fieldset :disabled="saving || syncing || loading">
            <div class="form-group">
              <label><input type="checkbox" v-model="config.monapay_enabled" /> Bật MONA Pay</label>
            </div>
            <div class="form-group">
              <label for="hub-webhook">URL nhận Webhook</label>
              <input id="hub-webhook" class="form-control" :value="webhookEndpoint" readonly />
            </div>
            <div v-for="secret in secretFields" :key="secret.key" class="form-group">
              <label :for="secret.key">{{ secret.label }} — {{ config[secret.key + '_configured'] ? 'Đã cấu hình' : 'Chưa cấu hình' }}</label>
              <input :id="secret.key" class="form-control" type="password" autocomplete="new-password"
                v-model.trim="config[secret.key]" maxlength="8192"
                :required="secret.key === 'webhook_secret' && config.monapay_enabled && !config.webhook_secret_configured"
                placeholder="Để trống để giữ nguyên secret đã lưu" />
            </div>
            <div class="form-group">
              <label for="hub-client">OAuth Client ID (nếu dùng OAuth thay API Token)</label>
              <input id="hub-client" class="form-control" v-model.trim="config.client_id" maxlength="255" />
            </div>
            <div class="form-group">
              <label for="hub-bank">Ngân hàng tiếp nhận</label>
              <select id="hub-bank" class="form-control" v-model="config.default_bank">
                <option v-for="bank in ['ACB', 'VCB', 'MB', 'TCB', 'BIDV']" :key="bank" :value="bank">{{ bank }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="hub-receiving">Tài khoản nhận được phép (receiving_accounts)</label>
              <textarea id="hub-receiving" class="form-control" v-model="receivingAccountsText" :required="config.monapay_enabled" rows="3"></textarea>
              <small class="text-muted">Mỗi dòng một số tài khoản (hoặc phân cách bằng dấu phẩy). Giữ số 0 đầu. Dùng số tài khoản thực tế xuất hiện trong webhook; tài khoản trực tiếp không cần VA.</small>
            </div>
            <div class="form-group">
              <label for="hub-va">VA dùng cho đối soát API (virtual_account_numbers, tùy chọn)</label>
              <textarea id="hub-va" class="form-control" v-model="virtualAccountsText" rows="2"></textarea>
              <small class="text-muted">Chỉ điền khi dùng API đối soát VA ACB. Tài khoản trực tiếp nhận webhook không cần mục này. API quét hiện tại yêu cầu VA và API Token hoặc OAuth.</small>
            </div>
            <div class="form-group">
              <label for="hub-interval">Chu kỳ đồng bộ (phút)</label>
              <input id="hub-interval" class="form-control" type="number" min="1" max="1440" step="1" required v-model.number="config.auto_sync_interval_mins" />
            </div>
            <div class="form-group">
              <label><input type="checkbox" v-model="config.auto_settle" /> Tự động gạch nợ học phí &amp; nạp ví</label>
            </div>
            <div class="form-group">
              <label><input type="checkbox" v-model="config.telegram_notify_enabled" /> Thông báo Telegram</label>
              <input v-if="config.telegram_notify_enabled" class="form-control" aria-label="Telegram Chat ID" v-model.trim="config.telegram_chat_id" maxlength="255" placeholder="Telegram Chat ID" />
            </div>
            <button class="btn btn-primary" type="submit">{{ saving ? 'Đang lưu...' : 'Lưu cấu hình' }}</button>
            <button class="btn btn-outline-primary ml-2" type="button" :disabled="!canSync" @click="triggerManualSync">{{ syncing ? 'Đang quét...' : 'Đồng bộ theo cấu hình đã lưu' }}</button>
          </fieldset>
          <p class="small text-muted mt-3">Để trống secret sẽ giữ nguyên giá trị đã lưu. Webhook thật phải có chữ ký HMAC-SHA256 và timestamp; không gửi giao dịch thử vào hệ thống kế toán.</p>
          <div v-if="config.last_sync_at" class="small">
            Lần quét gần nhất: {{ config.last_sync_at }}
            <p v-if="config.last_sync_result">{{ config.last_sync_result.message }}</p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { paymentHubAdmin, paymentHubRequest, configPayload } from '~/utils/paymentHub';

export default {
  data() {
    return {
      config: {}, receivingAccountsText: '', virtualAccountsText: '',
      loaded: false, loading: false, saving: false, syncing: false, error: '', canSync: false,
      secretFields: [
        { key: 'webhook_secret', label: 'Webhook Secret (HMAC-SHA256)' },
        { key: 'api_token', label: 'API Token' },
        { key: 'client_secret', label: 'OAuth Client Secret' }
      ]
    };
  },
  computed: {
    isAdmin() { return paymentHubAdmin(this.$store); },
    webhookEndpoint() {
      return this.config.webhook_url || (typeof window !== 'undefined' ? `${window.location.origin}/api/payment-hub/monapay-webhook` : '');
    }
  },
  watch: {
    isAdmin(value) { if (value) this.fetchConfig(); else this.loaded = false; }
  },
  mounted() { if (this.isAdmin) this.fetchConfig(); },
  methods: {
    async fetchConfig() {
      this.loading = true;
      this.error = '';
      try {
        const res = await paymentHubRequest(this, 'get', 'config');
        if (!res.data?.success || !res.data.data) throw new Error('Không tải được cấu hình');
        this.config = { client_id: '', ...res.data.data, api_token: '', client_secret: '', webhook_secret: '' };
        this.receivingAccountsText = (this.config.receiving_accounts || []).join('\n');
        this.virtualAccountsText = (this.config.virtual_account_numbers || []).join('\n');
        this.canSync = this.config.monapay_enabled === true && Boolean(this.virtualAccountsText) &&
          Boolean(this.config.api_token_configured || (this.config.client_id && this.config.client_secret_configured));
        this.loaded = true;
      } catch (err) {
        this.loaded = false;
        this.error = err.response?.data?.error || err.message;
      } finally { this.loading = false; }
    },
    async saveConfig() {
      if (!this.loaded || this.saving) return;
      this.saving = true;
      this.error = '';
      try {
        const payload = configPayload(this.config, this.receivingAccountsText, this.virtualAccountsText);
        const res = await paymentHubRequest(this, 'post', 'config', payload);
        if (!res.data?.success) throw new Error(res.data?.error || 'Không lưu được cấu hình');
        this.config.api_token = this.config.client_secret = this.config.webhook_secret = '';
        this.$bvToast.toast('Đã lưu cấu hình MONA Pay', { variant: 'success', solid: true });
        await this.fetchConfig();
      } catch (err) {
        this.error = err.response?.data?.error || err.message;
      } finally { this.saving = false; }
    },
    async triggerManualSync() {
      if (!this.loaded || !this.canSync || this.syncing) return;
      this.syncing = true;
      this.error = '';
      try {
        const res = await paymentHubRequest(this, 'post', 'sync');
        if (!res.data?.success) throw new Error(res.data?.error || 'Đồng bộ thất bại');
        this.$bvToast.toast(res.data.message || 'Đồng bộ hoàn tất', { variant: 'success', solid: true });
        await this.fetchConfig();
      } catch (err) {
        this.error = err.response?.data?.error || err.message;
      } finally { this.syncing = false; }
    }
  }
};
</script>
