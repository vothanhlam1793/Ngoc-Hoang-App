<template>
  <div v-if="isAdmin" class="camera-account mt-2">
    <div class="d-flex align-items-center flex-wrap">
      <small class="mr-2" :class="error || mappingError ? 'text-danger' : 'text-muted'" role="status">{{ status }}</small>
      <button type="button" class="btn btn-sm btn-light" title="Tải lại trạng thái camera" aria-label="Tải lại trạng thái camera" :disabled="busy" @click="load"><i class="fas fa-redo"></i></button>
      <template v-if="loaded">
        <button type="button" class="btn btn-sm btn-outline-primary ml-1" :title="account ? 'Đồng bộ theo lớp của bé' : 'Tạo tài khoản camera bằng SĐT'" :aria-label="account ? 'Đồng bộ theo lớp của bé' : 'Tạo tài khoản camera bằng SĐT'" :disabled="busy || !!mappingError" @click="act('sync')"><i :class="['fas', account ? 'fa-sync-alt' : 'fa-user-plus']"></i></button>
        <template v-if="account">
          <button type="button" class="btn btn-sm btn-outline-info ml-1" :title="account.active ? 'Tắt camera' : 'Bật camera'" :aria-label="account.active ? 'Tắt camera' : 'Bật camera'" :disabled="busy" @click="act('toggle-active', { active: !account.active })"><i :class="['fas', account.active ? 'fa-video' : 'fa-video-slash']"></i></button>
          <button type="button" class="btn btn-sm btn-outline-warning ml-1" title="Cấp lại PIN" aria-label="Cấp lại PIN" :disabled="busy" @click="act('reset-pin')"><i class="fas fa-key"></i></button>
          <b-dropdown size="sm" variant="light" class="ml-1" text="⋯" :disabled="busy" aria-label="Thao tác tài khoản">
            <b-dropdown-item @click="act('toggle-account', { enabled: account.state === 'DISABLED' })">{{ account.state === 'DISABLED' ? 'Mở tài khoản' : 'Khóa tài khoản' }}</b-dropdown-item>
            <b-dropdown-item v-if="account.state === 'BLOCKED'" @click="act('unblock')">Gỡ khóa nhập sai PIN</b-dropdown-item>
          </b-dropdown>
        </template>
      </template>
    </div>
    <small v-if="account && account.lophoc && account.lophoc.length" class="d-block text-muted">{{ account.lophoc.map(c => c.name).join(', ') }}</small>
    <small v-if="mappingError" class="d-block text-danger">{{ mappingError }} · <nuxt-link to="/setup/camera">Cài đặt liên kết</nuxt-link></small>
    <div v-if="temporaryPin" class="alert alert-info py-2 mt-2 mb-0">PIN tạm: <strong>{{ temporaryPin }}</strong>. Phụ huynh cần đổi PIN sau khi đăng nhập.
      <button type="button" class="btn btn-sm btn-link" @click="temporaryPin = ''">Ẩn</button>
    </div>
  </div>
</template>
<script>
import { cameraAdmin, cameraRequest } from '~/utils/cameraIntegration';
export default {
  props: { phoneId: { type: String, required: true } },
  data: () => ({ account: null, loaded: false, busy: false, error: '', mappingError: '', temporaryPin: '', generation: 0 }),
  computed: {
    isAdmin() { return cameraAdmin(this.$store); },
    status() {
      if (this.error) return this.error;
      if (!this.loaded) return 'Đang tải tài khoản camera…';
      if (!this.account) return 'Chưa có tài khoản camera';
      const states = { DISABLED: 'Tài khoản bị khóa', BLOCKED: 'Khóa do sai PIN', RESET: 'Chờ đổi PIN' };
      return `${states[this.account.state] || 'Tài khoản hoạt động'} · ${this.account.active ? 'Camera bật' : 'Camera tắt'}`;
    }
  },
  watch: {
    phoneId() { this.generation++; this.temporaryPin = ''; this.account = null; this.loaded = false; this.load(); },
    isAdmin(value) { if (value) this.load(); }
  },
  mounted() { this.load(); },
  beforeDestroy() { this.generation++; },
  methods: {
    async load() {
      if (!this.isAdmin) return;
      const generation = ++this.generation;
      this.busy = true; this.error = ''; this.loaded = false;
      try {
        const { data } = await cameraRequest(this, 'get', `phones/${encodeURIComponent(this.phoneId)}`);
        if (generation !== this.generation) return;
        this.account = data.account; this.mappingError = data.mappingError || ''; this.loaded = true;
      } catch (error) { if (generation === this.generation) this.error = error.message; }
      finally { if (generation === this.generation) this.busy = false; }
    },
    async act(action, payload = {}) {
      const id = this.phoneId, generation = this.generation;
      if (action !== 'sync' && !await this.$bvModal.msgBoxConfirm('Áp dụng thay đổi tài khoản camera cho SĐT này?', { okTitle: 'Xác nhận', cancelTitle: 'Hủy' })) return;
      if (id !== this.phoneId || generation !== this.generation) return;
      this.busy = true; this.error = ''; this.temporaryPin = '';
      try {
        const result = await cameraRequest(this, 'post', `phones/${encodeURIComponent(id)}/${action}`, payload);
        if (generation !== this.generation) return;
        this.temporaryPin = result.temporaryPin || result.data?.temporaryPin || '';
        await this.load();
      } catch (error) { if (generation === this.generation) this.error = error.message; }
      finally { if (id === this.phoneId) this.busy = false; }
    }
  }
};
</script>
