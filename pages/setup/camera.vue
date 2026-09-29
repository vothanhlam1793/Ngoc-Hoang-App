<template>
  <div class="container-fluid py-4">
    <nuxt-link to="/setup" class="small">← Cài đặt hệ thống</nuxt-link>
    <h4 class="mt-2"><i class="fas fa-video text-primary mr-2"></i>Kết nối camera</h4>
    <p class="text-muted">Tài khoản là SĐT. Quyền camera được tổng hợp theo lớp các bé đang học trong hồ sơ phụ huynh.</p>
    <div v-if="!isAdmin" class="alert alert-warning">Cần quyền quản trị để cấu hình camera.</div>
    <template v-else>
      <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
      <div v-if="message" class="alert alert-success" role="status">{{ message }}</div>
      <div v-if="!loaded" class="card p-3">
        Đang tải cấu hình… <button v-if="error" class="btn btn-link" @click="load">Thử lại</button>
      </div>
      <template v-else>
        <div class="card shadow-sm p-3 mb-3">
          <h5>1. Kết nối hệ thống</h5>
          <label for="camera-url">Địa chỉ hệ thống camera</label>
          <input id="camera-url" v-model.trim="config.baseUrl" type="url" class="form-control mb-3" placeholder="https://camera.example.com" :disabled="busy" @input="connectionChanged" />
          <label for="camera-key">API key {{ config.apiKeyConfigured ? '(đã cấu hình — để trống để giữ nguyên)' : '' }}</label>
          <input id="camera-key" v-model="apiKey" type="password" autocomplete="new-password" class="form-control mb-3" :disabled="busy" @input="connectionChanged" />
          <div><button class="btn btn-outline-primary" :disabled="busy" @click="testConnection">{{ busy ? 'Đang xử lý…' : 'Kiểm tra kết nối / Tải lớp camera' }}</button></div>
          <small v-if="checkedAt" class="text-success mt-2">Kết nối thành công lúc {{ checkedAt }}</small>
        </div>
        <div class="card shadow-sm p-3 mb-3">
          <h5>2. Liên kết lớp</h5>
          <p class="small text-muted">Chọn lớp tương ứng bên camera. Nhiều lớp trường có thể dùng chung một lớp camera. Lưu cấu hình không tự thay đổi quyền tài khoản.</p>
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead><tr><th>Lớp trong trường</th><th>Lớp bên camera</th><th>Camera thuộc lớp</th></tr></thead>
              <tbody><tr v-for="school in schoolClasses" :key="school.id">
                <td>{{ school.name }}</td>
                <td>
                  <select v-model="config.mapping[school.id]" class="form-control" :aria-label="`Lớp camera cho ${school.name}`" :disabled="busy || !checkedAt">
                    <option value="">— Chưa liên kết —</option>
                    <option v-if="config.mapping[school.id] && !cameraClasses.some(c => c.id === config.mapping[school.id])" :value="config.mapping[school.id]">Lớp đã lưu (chưa tải hoặc không còn tồn tại)</option>
                    <option v-for="camera in cameraClasses" :key="camera.id" :value="camera.id">{{ camera.name }}</option>
                  </select>
                </td>
                <td><small>{{ camerasFor(config.mapping[school.id]) }}</small></td>
              </tr></tbody>
            </table>
          </div>
          <div><button class="btn btn-primary" :disabled="busy || !checkedAt" @click="save">Lưu kết nối & liên kết lớp</button></div>
        </div>
        <div class="card shadow-sm p-3">
          <h5>3. Đồng bộ tài khoản đã cấp</h5>
          <p class="small text-muted">Áp dụng cấu hình đã lưu cho các SĐT đã có tài khoản. Giữ nguyên PIN, trạng thái khóa và tạm ngưng camera; bỏ qua số chưa có tài khoản. Khi không còn bé đang học, chỉ tắt quyền camera và giữ nguyên lớp đã gán.</p>
          <div><button class="btn btn-outline-primary" :disabled="busy || dirty" @click="syncAll">Đồng bộ theo liên kết đã lưu</button></div>
          <small v-if="dirty" class="text-warning mt-2">Lưu thay đổi trước khi đồng bộ.</small>
          <p v-if="progress" class="mt-2 mb-0" role="status">{{ progress }}</p>
          <ul v-if="failures.length" class="text-danger small mt-2"><li v-for="(item, i) in failures" :key="i">{{ item }}</li></ul>
        </div>
      </template>
    </template>
  </div>
</template>
<script>
import { cameraAdmin, cameraRequest } from '~/utils/cameraIntegration';
export default {
  layout: 'app',
  data: () => ({ config: { baseUrl: '', mapping: {}, apiKeyConfigured: false }, apiKey: '', schoolClasses: [], cameraClasses: [],
    loaded: false, busy: false, error: '', message: '', checkedAt: '', saved: '', progress: '', failures: [] }),
  computed: {
    isAdmin() { return cameraAdmin(this.$store); },
    dirty() { return !!this.apiKey || JSON.stringify(this.config) !== this.saved; }
  },
  watch: { isAdmin(value) { if (value && !this.loaded) this.load(); } },
  mounted() { if (this.isAdmin) this.load(); },
  methods: {
    connectionChanged() { this.checkedAt = ''; this.cameraClasses = []; },
    camerasFor(id) { const row = this.cameraClasses.find(c => c.id === id); return row ? (row.cameras || []).map(c => c.name).join(', ') || 'Chưa có camera' : '—'; },
    async load() {
      this.error = '';
      try {
        const { data } = await cameraRequest(this, 'get', 'config');
        this.schoolClasses = data.schoolClasses;
        this.config = { baseUrl: data.baseUrl, mapping: data.mapping, apiKeyConfigured: data.apiKeyConfigured };
        this.schoolClasses.forEach(c => { if (!this.config.mapping[c.id]) this.$set(this.config.mapping, c.id, ''); });
        this.saved = JSON.stringify(this.config); this.loaded = true;
        if (this.config.apiKeyConfigured) await this.testConnection();
      } catch (error) { this.error = error.message; }
    },
    async testConnection() {
      this.busy = true; this.error = ''; this.checkedAt = '';
      try {
        const result = await cameraRequest(this, 'post', 'test', { baseUrl: this.config.baseUrl, apiKey: this.apiKey || undefined });
        this.cameraClasses = result.data; this.checkedAt = new Date().toLocaleString('vi-VN');
      } catch (error) { this.error = error.message; }
      finally { this.busy = false; }
    },
    async save() {
      this.busy = true; this.error = ''; this.message = '';
      try {
        const result = await cameraRequest(this, 'post', 'config', { baseUrl: this.config.baseUrl, mapping: this.config.mapping, apiKey: this.apiKey || undefined });
        this.config = result.data; this.apiKey = '';
        this.schoolClasses.forEach(c => { if (!this.config.mapping[c.id]) this.$set(this.config.mapping, c.id, ''); });
        this.saved = JSON.stringify(this.config); this.message = 'Đã lưu liên kết. Có thể đồng bộ các tài khoản đã cấp bên dưới.';
      } catch (error) { this.error = error.message; }
      finally { this.busy = false; }
    },
    async syncAll() {
      this.busy = true; this.error = ''; this.failures = []; this.progress = '';
      try {
        const { data: phones } = await cameraRequest(this, 'get', 'phones');
        if (!await this.$bvModal.msgBoxConfirm(`Kiểm tra ${phones.length} SĐT và đồng bộ các tài khoản đã có theo lớp hiện tại của bé?`, { okTitle: 'Đồng bộ', cancelTitle: 'Hủy' })) return;
        let synced = 0, skipped = 0;
        for (let i = 0; i < phones.length; i++) {
          try {
            const result = await cameraRequest(this, 'post', `phones/${encodeURIComponent(phones[i].id)}/sync-existing`, {});
            if (result.skipped) skipped++; else synced++;
          } catch (error) { this.failures.push(`${phones[i].number}: ${error.message}`); }
          this.progress = `${i + 1}/${phones.length}: ${synced} đã đồng bộ, ${skipped} chưa có tài khoản, ${this.failures.length} lỗi.`;
        }
        if (!phones.length) this.progress = 'Chưa có SĐT để đồng bộ.';
      } catch (error) { this.error = error.message; }
      finally { this.busy = false; }
    }
  }
};
</script>
