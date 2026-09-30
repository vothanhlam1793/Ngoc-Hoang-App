<template>
  <section class="border rounded p-3 mb-4">
    <h5>Trợ lý hỗ trợ</h5>
    <p class="text-muted">Hướng dẫn từ sổ tay nhà trường. Kết nối provider tương thích OpenAI; lịch sử chỉ lưu tại trình duyệt trong 48 giờ.</p>
    <p v-if="message" role="status" :class="error ? 'text-danger' : 'text-success'">{{ message }}</p>
    <form v-if="config" @submit.prevent="save">
      <div class="custom-control custom-switch mb-3"><input id="support-enabled" v-model="config.enabled" type="checkbox" class="custom-control-input"><label for="support-enabled" class="custom-control-label">Bật chat hỗ trợ</label></div>
      <div v-for="field in fields" :key="field.key" class="form-group">
        <label :for="'support-' + field.key">{{ field.label }}</label>
        <input :id="'support-' + field.key" v-model.trim="config[field.key]" class="form-control" required maxlength="500" :placeholder="field.placeholder">
      </div>
      <div class="form-group"><label for="support-key">API key {{ config.apiKeyConfigured ? '(đã có — để trống để giữ nguyên)' : '' }}</label><input id="support-key" v-model.trim="apiKey" type="password" autocomplete="new-password" maxlength="8192" class="form-control"></div>
      <button class="btn btn-primary mr-2" :disabled="busy">{{ busy ? 'Đang xử lý…' : 'Lưu cấu hình' }}</button>
      <button type="button" class="btn btn-outline-primary" :disabled="busy" @click="test">Kiểm tra kết nối</button>
      <button v-if="config.enabled" type="button" class="btn btn-outline-danger ml-2" :disabled="busy" @click="disable">Tắt hỗ trợ ngay</button>
    </form>
  </section>
</template>
<script>
import { supportRequest } from '~/utils/supportChat';
export default {
  data: () => ({ config: null, apiKey: '', busy: false, error: false, message: '', fields: [
    { key: 'name', label: 'Tên trợ lý', placeholder: 'Trợ lý Ngọc Hoàng' },
    { key: 'provider', label: 'Tên provider', placeholder: 'Tiny' },
    { key: 'baseUrl', label: 'Địa chỉ API (HTTPS)', placeholder: 'https://provider.example/v1' },
    { key: 'model', label: 'Model', placeholder: 'Tên model tại provider' }
  ] }),
  async mounted() { try { this.config = await supportRequest(this, 'get', 'config'); } catch (e) { this.error = true; this.message = e.response?.data?.error || 'Không tải được cấu hình'; } },
  methods: {
    async disable() {
      this.busy = true; this.error = false;
      try { this.config = await supportRequest(this, 'put', 'config', { enabled: false }); this.message = 'Đã tắt trợ lý. Backend đã chặn yêu cầu chat mới.'; }
      catch (e) { this.error = true; this.message = e.response?.data?.error || 'Không thể tắt trợ lý'; }
      finally { this.busy = false; }
    },
    async submit(test) {
      this.busy = true; this.message = ''; this.error = false;
      try {
        const result = await supportRequest(this, test ? 'post' : 'put', test ? 'test' : 'config', { ...this.config, apiKey: this.apiKey || undefined });
        if (!test) { this.config = result; this.apiKey = ''; }
        this.message = test ? 'Kết nối thành công. Cấu hình thử chưa được lưu.' : 'Đã lưu. Thay đổi có hiệu lực với yêu cầu tiếp theo; nút chat cập nhật trong tối đa 30 giây.';
      } catch (e) { this.error = true; this.message = e.response?.data?.error || 'Không thể hoàn tất yêu cầu'; }
      finally { this.busy = false; }
    },
    save() { return this.submit(false); }, test() { return this.submit(true); }
  }
};
</script>
