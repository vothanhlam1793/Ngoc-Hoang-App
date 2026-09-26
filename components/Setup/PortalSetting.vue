<template>
  <div class="row">
    <!-- Cột trái: Form cấu hình API Key & WebSocket -->
    <div class="col-lg-7 mb-4">
      <div class="card border-0 shadow-sm rounded-lg">
        <div class="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
          <h5 class="font-weight-bold mb-0 text-dark">
            <i class="fas fa-key text-primary mr-2"></i>Cổng Kết Nối & Xác Thực App Phụ Huynh
          </h5>
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id="togglePortalSwitch"
              v-model="config.portal_enabled"
            />
            <label class="custom-control-label font-weight-bold text-dark" for="togglePortalSwitch">
              {{ config.portal_enabled ? 'Đang BẬT' : 'Đang TẮT' }}
            </label>
          </div>
        </div>

        <div class="card-body p-4">
          <form @submit.prevent="saveConfig">
            <!-- WebSocket Realtime URL -->
            <div class="form-group mb-3">
              <label class="font-weight-bold small text-dark d-flex justify-content-between">
                <span>WSS Endpoint (WebSocket Thông Báo Realtime)</span>
                <span class="text-muted">Dành cho Client camerangochoang.com</span>
              </label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control font-monospace bg-light"
                  :value="wsEndpoint"
                  readonly
                />
                <div class="input-group-append">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="copyText(wsEndpoint, 'WSS Endpoint')"
                  >
                    <i class="fas fa-copy mr-1"></i> Copy
                  </button>
                </div>
              </div>
            </div>

            <!-- API Secret Key (Chuỗi bí mật) -->
            <div class="form-group mb-3">
              <label class="font-weight-bold small text-dark d-flex justify-content-between">
                <span>Chuỗi Bí Mật API Key (HMAC Secret) *</span>
                <button
                  type="button"
                  class="btn btn-link btn-sm p-0 text-primary font-weight-bold"
                  @click="generateRandomKey"
                >
                  <i class="fas fa-random mr-1"></i> Sinh mã ngẫu nhiên
                </button>
              </label>
              <div class="input-group">
                <input
                  :type="showSecret ? 'text' : 'password'"
                  class="form-control font-monospace"
                  v-model.trim="config.api_key"
                  placeholder="Nhập hoặc sinh API key bí mật..."
                  required
                />
                <div class="input-group-append">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="showSecret = !showSecret"
                    title="Ẩn/Hiện key"
                  >
                    <i :class="['fas', showSecret ? 'fa-eye-slash' : 'fa-eye']"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="copyText(config.api_key, 'API Secret Key')"
                  >
                    <i class="fas fa-copy mr-1"></i> Copy
                  </button>
                </div>
              </div>
              <small class="text-muted">
                Dùng để tạo chữ ký HMAC-SHA256 cấp vé vào WebSocket cho App Phụ huynh mà không bị lộ mật khẩu.
              </small>
            </div>

            <!-- Thời hạn vé Ticket TTL -->
            <div class="row">
              <div class="col-md-6 form-group mb-3">
                <label class="font-weight-bold small text-dark">Thời Hạn Vé Kết Nối (TTL)</label>
                <div class="input-group">
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="config.ticket_ttl_seconds"
                    min="30"
                    max="3600"
                  />
                  <div class="input-group-append">
                    <span class="input-group-text">Giây</span>
                  </div>
                </div>
                <small class="text-muted">Mặc định 300s (5 phút) để chống Replay Attack.</small>
              </div>

              <!-- Thống kê kết nối Realtime -->
              <div class="col-md-6 form-group mb-3">
                <label class="font-weight-bold small text-dark">Socket Đang Kết Nối</label>
                <div class="p-2 bg-light rounded border d-flex align-items-center justify-content-between">
                  <div>
                    <span class="badge badge-success mr-1"><i class="fas fa-circle mr-1" style="font-size: 0.5rem;"></i> Online</span>
                    <strong>{{ config.active_connections || 0 }} kết nối</strong>
                  </div>
                  <button type="button" class="btn btn-sm btn-outline-secondary" @click="fetchConfig">
                    <i class="fas fa-sync-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-end mt-2">
              <button
                type="submit"
                class="btn btn-primary font-weight-bold rounded-pill px-4 shadow-sm"
                :disabled="saving"
              >
                <i class="fas fa-save mr-1"></i> {{ saving ? 'Đang lưu...' : 'Lưu Cấu Hình Portal' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Cột phải: Hướng dẫn nhanh & Liên kết tài liệu -->
    <div class="col-lg-5 mb-4">
      <div class="card border-0 shadow-sm rounded-lg bg-light mb-4">
        <div class="card-body p-4">
          <h6 class="font-weight-bold text-dark mb-3">
            <i class="fas fa-book-open text-primary mr-2"></i> Tài Liệu Dành Cho Dev `camerangochoang.com`
          </h6>
          <p class="small text-muted mb-3">
            Hệ thống đã chuẩn bị sẵn file hướng dẫn kỹ thuật chi tiết kèm toàn bộ mã mẫu (Node.js, PHP, Python, Flutter, React JS).
          </p>
          <div class="p-3 bg-white rounded border mb-3">
            <div class="small font-weight-bold text-dark mb-1">Vị trí file tài liệu:</div>
            <code class="text-primary font-weight-bold small">repos/sme2/docs/notify-access.md</code>
          </div>
          <ol class="small text-muted pl-3 mb-0">
            <li class="mb-1">Copy chuỗi <strong>API Secret Key</strong> ở bên trái dán vào file <code>.env</code> server <strong>camerangochoang.com</strong>.</li>
            <li class="mb-1">Tạo 1 endpoint cấp vé <code>/api/get-school-ws-ticket</code> theo hướng dẫn trong file docs.</li>
            <li class="mb-1">Frontend App mở kết nối WebSocket nhận thông báo tiền vào và điểm danh tự động.</li>
          </ol>
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
        portal_enabled: true,
        api_key: 'camerangochoang_portal_secret_2026',
        ticket_ttl_seconds: 300,
        active_connections: 0
      },
      showSecret: false,
      saving: false,
    };
  },
  computed: {
    wsEndpoint() {
      if (typeof window !== 'undefined') {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${protocol}//${window.location.host}/ws/parent`;
      }
      return 'wss://demo3.cameramamnon.com/ws/parent';
    }
  },
  mounted() {
    this.fetchConfig();
  },
  methods: {
    async fetchConfig() {
      try {
        const res = await axios.get('/api/portal/config');
        if (res.data?.data) {
          this.config = { ...this.config, ...res.data.data };
        }
      } catch (err) {
        console.warn('Chưa nạp được cấu hình portal:', err.message);
      }
    },

    generateRandomKey() {
      const chars = 'abcdef0123456789';
      let key = 'sec_';
      for (let i = 0; i < 32; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.config.api_key = key;
      this.$bvToast.toast('Đã sinh chuỗi API Key ngẫu nhiên mới! Hãy bấm Lưu.', {
        variant: 'info',
        solid: true,
      });
    },

    async saveConfig() {
      this.saving = true;
      try {
        await axios.post('/api/portal/config', this.config);
        this.$bvToast.toast('Đã lưu cấu hình Cổng Phụ Huynh thành công!', {
          title: 'Thành công',
          variant: 'success',
          solid: true,
        });
      } catch (err) {
        this.$bvToast.toast('Lỗi khi lưu cấu hình: ' + err.message, {
          title: 'Lỗi',
          variant: 'danger',
          solid: true,
        });
      } finally {
        this.saving = false;
      }
    },

    copyText(text, label = 'Nội dung') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        this.$bvToast.toast(`Đã sao chép ${label} vào clipboard!`, {
          variant: 'success',
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
