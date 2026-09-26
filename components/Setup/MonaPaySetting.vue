<template>
  <div>
    <!-- Alert nếu không phải Admin -->
    <div v-if="!isAdmin" class="alert alert-danger shadow-sm rounded-lg p-4 text-center">
      <i class="fas fa-lock fa-3x mb-3 text-danger"></i>
      <h4>Bạn không có quyền truy cập khu vực này</h4>
      <p class="text-muted">Chức năng quản trị bảo mật cao chỉ dành riêng cho tài khoản Super Admin.</p>
    </div>

    <!-- Main Content khi là Admin -->
    <div v-else class="row">
      <!-- Cột trái: Form cấu hình -->
      <div class="col-lg-7 mb-4">
        <div class="card border-0 shadow-sm rounded-lg">
          <div class="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
            <h5 class="font-weight-bold mb-0 text-dark">
              <i class="fas fa-satellite-dish text-primary mr-2"></i>Thiết Lập Kết Nối MONA Pay
            </h5>
            <div class="custom-control custom-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id="toggleMonaSwitch"
                v-model="config.monapay_enabled"
              />
              <label class="custom-control-label font-weight-bold text-dark" for="toggleMonaSwitch">
                {{ config.monapay_enabled ? 'Đang BẬT' : 'Đang TẮT' }}
              </label>
            </div>
          </div>

          <div class="card-body p-4">
            <form @submit.prevent="saveConfig">
              <!-- Webhook URL -->
              <div class="form-group mb-3">
                <label class="font-weight-bold small text-dark d-flex justify-content-between">
                  <span>URL Nhận Webhook (Endpoint)</span>
                  <span class="text-muted">Dán URL này vào my.monapay.vn</span>
                </label>
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control font-monospace bg-light"
                    :value="webhookEndpoint"
                    readonly
                  />
                  <div class="input-group-append">
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="copyToClipboard(webhookEndpoint)"
                    >
                      <i class="fas fa-copy mr-1"></i> Copy
                    </button>
                  </div>
                </div>
              </div>

              <!-- Webhook Secret -->
              <div class="form-group mb-3">
                <label class="font-weight-bold small text-dark">
                  Webhook Secret (HMAC-SHA256) *
                </label>
                <div class="input-group">
                  <input
                    :type="showSecret ? 'text' : 'password'"
                    class="form-control font-monospace"
                    v-model.trim="config.webhook_secret"
                    placeholder="Nhập secret key từ MONA Pay..."
                    required
                  />
                  <div class="input-group-append">
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="showSecret = !showSecret"
                    >
                      <i :class="['fas', showSecret ? 'fa-eye-slash' : 'fa-eye']"></i>
                    </button>
                  </div>
                </div>
                <small class="text-muted">Dùng để xác thực tính toàn vẹn và chống giả mạo request ngân hàng.</small>
              </div>

              <div class="row">
                <!-- Ngân hàng mặc định -->
                <div class="col-md-6 form-group mb-3">
                  <label class="font-weight-bold small text-dark">Ngân Hàng Tiếp Nhận</label>
                  <select class="form-control" v-model="config.default_bank">
                    <option value="ACB">ACB - Ngân hàng Á Châu</option>
                    <option value="VCB">Vietcombank</option>
                    <option value="MB">MBBank - Ngân hàng Quân Đội</option>
                    <option value="TCB">Techcombank</option>
                    <option value="BIDV">BIDV</option>
                  </select>
                </div>

                <!-- Chế độ Tự động cấn trừ -->
                <div class="col-md-6 form-group mb-3">
                  <label class="font-weight-bold small text-dark">Quy Trình Xử Lý Dòng Tiền</label>
                  <select class="form-control" v-model="config.auto_settle">
                    <option :value="true">🟢 Tự động gạch nợ học phí & nạp ví</option>
                    <option :value="false">⚪ Chỉ nạp ví (Kế toán tự gạch nợ sau)</option>
                  </select>
                </div>
              </div>

              <!-- Cấu hình Dual-Sync (Cron 15 phút) -->
              <div class="p-3 bg-light rounded-lg border mb-3">
                <div class="d-flex align-items-center justify-content-between mb-2">
                  <label class="font-weight-bold text-dark mb-0">
                    <i class="fas fa-sync-alt text-primary mr-1"></i> Cơ chế Dual-Sync (Quét định kỳ 15 phút)
                  </label>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary rounded-pill font-weight-bold"
                    :disabled="syncing"
                    @click="triggerManualSync"
                  >
                    <i :class="['fas fa-redo-alt mr-1', syncing ? 'fa-spin' : '']"></i>
                    {{ syncing ? 'Đang quét...' : 'Đồng bộ ngay' }}
                  </button>
                </div>
                <small class="text-muted d-block mb-2">
                  Tự động quét lịch sử MONA Pay mỗi 15 phút để nhặt các giao dịch bị rớt Webhook, tự động gạch nợ và đảm bảo không bỏ sót giao dịch nào.
                </small>
                <div v-if="config.last_sync_at" class="small text-secondary bg-white p-2 rounded border">
                  <div><strong>Lần quét gần nhất:</strong> {{ formatDate(config.last_sync_at) }}</div>
                  <div v-if="config.last_sync_result" :class="config.last_sync_result.success ? 'text-success' : 'text-danger'">
                    <i :class="['fas mr-1', config.last_sync_result.success ? 'fa-check-circle' : 'fa-exclamation-triangle']"></i>
                    {{ config.last_sync_result.message || config.last_sync_result.error }}
                  </div>
                </div>
              </div>

              <!-- Telegram Thông Báo -->
              <div class="p-3 bg-light rounded-lg border mb-4">
                <div class="custom-control custom-checkbox mb-2">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="teleCheck"
                    v-model="config.telegram_notify_enabled"
                  />
                  <label class="custom-control-label font-weight-bold text-dark" for="teleCheck">
                    <i class="fab fa-telegram text-info mr-1"></i> Báo tin tiền vào ngay lập tức qua Telegram Bot
                  </label>
                </div>
                <div v-if="config.telegram_notify_enabled" class="mt-2">
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model.trim="config.telegram_chat_id"
                    placeholder="Nhập Telegram Group ID (ví dụ: -100123456789)..."
                  />
                </div>
              </div>

              <div class="d-flex justify-content-end">
                <button
                  type="submit"
                  class="btn btn-primary font-weight-bold rounded-pill px-4 shadow-sm"
                  :disabled="saving"
                >
                  <i class="fas fa-save mr-1"></i> {{ saving ? 'Đang lưu...' : 'Lưu Cấu Hình Hub' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Cột phải: Sandbox Test & Hướng dẫn -->
      <div class="col-lg-5 mb-4">
        <!-- Sandbox Test Webhook -->
        <div class="card border-0 shadow-sm rounded-lg mb-4">
          <div class="card-header bg-white py-3 border-bottom">
            <h5 class="font-weight-bold mb-0 text-dark">
              <i class="fas fa-vial text-success mr-2"></i>Thử Nghiệm Bắn Webhook (Sandbox)
            </h5>
          </div>
          <div class="card-body p-4">
            <p class="small text-muted mb-3">
              Gửi một giao dịch chuyển khoản giả lập để kiểm tra hệ thống có tự động nhận diện và gạch nợ thành công không.
            </p>

            <div class="form-group mb-2">
              <label class="small font-weight-bold">Nội dung chuyển khoản thử nghiệm:</label>
              <input
                type="text"
                class="form-control form-control-sm"
                v-model.trim="testPayload.description"
                placeholder="Ví dụ: PH000891 Vu Kim Son nop tien..."
              />
            </div>

            <div class="form-group mb-3">
              <label class="small font-weight-bold">Số tiền giả lập (VNĐ):</label>
              <input
                type="number"
                class="form-control form-control-sm"
                v-model.number="testPayload.amount"
              />
            </div>

            <button
              type="button"
              class="btn btn-outline-success btn-block rounded-pill font-weight-bold"
              :disabled="testing"
              @click="sendTestWebhook"
            >
              <i class="fas fa-paper-plane mr-1"></i> {{ testing ? 'Đang bắn webhook...' : 'Gửi Thử Giao Dịch Này' }}
            </button>

            <div v-if="testResult" class="mt-3 p-3 bg-dark text-white rounded small font-monospace">
              <strong>Kết quả phản hồi từ Hub:</strong>
              <pre class="text-success mb-0 mt-1" style="max-height: 150px; overflow-y: auto;">{{ JSON.stringify(testResult, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- Hướng dẫn tích hợp -->
        <div class="card border-0 shadow-sm rounded-lg bg-light">
          <div class="card-body p-4">
            <h6 class="font-weight-bold text-dark mb-2">
              <i class="fas fa-info-circle text-primary mr-1"></i> Các bước kết nối MONA Pay:
            </h6>
            <ol class="small text-muted pl-3 mb-0">
              <li class="mb-1">Đăng nhập tài khoản tại <strong>my.monapay.vn</strong>.</li>
              <li class="mb-1">Vào mục <strong>Webhooks</strong> ➔ Bấm <strong>Thêm Webhook</strong>.</li>
              <li class="mb-1">Dán URL Endpoint bên cạnh vào ô Webhook URL.</li>
              <li class="mb-1">Chọn kiểu xác thực: <code>HMAC_SHA256</code> và copy Secret Key dán vào ô bên trái.</li>
              <li>Bấm Lưu trên MONA Pay. Mọi giao dịch ngân hàng sẽ tự động chảy về hệ thống!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      config: {
        monapay_enabled: true,
        webhook_secret: 'monapay_secret_demo',
        default_bank: 'ACB',
        auto_settle: true,
        telegram_notify_enabled: false,
        telegram_chat_id: '',
      },
      showSecret: false,
      saving: false,
      testing: false,
      syncing: false,
      testPayload: {
        amount: 50000,
        description: 'PH000891 test chuyen khoan hoc phi',
        transaction_code: 'TEST_' + Date.now(),
        bank_name: 'ACB',
        account_number: '123456789'
      },
      testResult: null,
    };
  },
  computed: {
    isAdmin() {
      return this.$store.state.user.isAdmin === true || this.$store.state.user.roles?.includes('super-admin') || this.$store.state.user.roles?.includes('quan-tri-vien');
    },
    webhookEndpoint() {
      if (typeof window !== 'undefined') {
        return `${window.location.protocol}//${window.location.hostname}:3011/api/payment-hub/monapay-webhook`;
      }
      return 'https://api.cameramamnon.com/api/payment-hub/monapay-webhook';
    }
  },
  mounted() {
    if (this.isAdmin) {
      this.fetchConfig();
    }
  },
  methods: {
    async fetchConfig() {
      try {
        const res = await axios.get('/api/payment-hub/config');
        if (res.data?.data) {
          this.config = { ...this.config, ...res.data.data };
        }
      } catch (err) {
        console.warn('Chưa nạp được cấu hình payment hub:', err.message);
      }
    },

    async saveConfig() {
      this.saving = true;
      try {
        await axios.post('/api/payment-hub/config', this.config);
        this.$bvToast.toast('Đã lưu cấu hình MONA Pay Hub thành công!', {
          title: 'Thành công',
          variant: 'success',
          solid: true,
        });
      } catch (err) {
        console.error(err);
        this.$bvToast.toast('Lỗi khi lưu cấu hình: ' + err.message, {
          title: 'Lỗi',
          variant: 'danger',
          solid: true,
        });
      } finally {
        this.saving = false;
      }
    },

    async sendTestWebhook() {
      this.testing = true;
      this.testResult = null;
      try {
        const res = await axios.post('/api/payment-hub/monapay-webhook', {
          ...this.testPayload,
          transaction_code: 'TEST_' + Date.now()
        });
        this.testResult = res.data;
        this.$bvToast.toast('Đã nhận phản hồi từ Hub!', {
          variant: 'info',
          solid: true,
        });
      } catch (err) {
        this.testResult = err.response?.data || { error: err.message };
      } finally {
        this.testing = false;
      }
    },

    async triggerManualSync() {
      this.syncing = true;
      try {
        const res = await axios.post('/api/payment-hub/sync');
        if (res.data?.success) {
          this.$bvToast.toast(res.data.message || 'Đồng bộ hoàn tất!', {
            title: 'Đồng bộ thành công',
            variant: 'success',
            solid: true,
          });
        } else {
          this.$bvToast.toast(res.data?.error || res.data?.message || 'Có lỗi khi đồng bộ', {
            title: 'Thông báo',
            variant: 'warning',
            solid: true,
          });
        }
        await this.fetchConfig();
      } catch (err) {
        this.$bvToast.toast('Lỗi khi gọi API đồng bộ: ' + (err.response?.data?.error || err.message), {
          title: 'Lỗi',
          variant: 'danger',
          solid: true,
        });
      } finally {
        this.syncing = false;
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return d.toLocaleTimeString('vi-VN') + ' ' + d.toLocaleDateString('vi-VN');
    },

    copyToClipboard(text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        this.$bvToast.toast('Đã sao chép URL Webhook vào clipboard!', {
          variant: 'info',
          solid: true,
        });
      }
    }
  }
};
</script>

<style scoped>
.font-monospace {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.88rem;
}
</style>
