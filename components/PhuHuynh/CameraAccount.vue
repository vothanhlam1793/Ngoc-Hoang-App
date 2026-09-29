<template>
  <div v-if="isAdmin" class="camera-account d-flex align-items-center flex-wrap ml-md-3 mt-2 mt-md-0">
    <span v-if="!loaded && !error" class="small text-muted mr-2"><i class="fas fa-spinner fa-spin mr-1"></i>Camera</span>
    <template v-else-if="!account">
      <span class="badge badge-light border text-muted mr-2"><i class="fas fa-user-slash mr-1"></i>Chưa cấp camera</span>
      <button type="button" class="btn btn-sm btn-primary" :disabled="busy || !!mappingError" @click="act('sync')"><i class="fas fa-user-plus mr-1"></i>Cấp tài khoản</button>
    </template>
    <template v-else>
      <span v-for="classroom in account.lophoc || []" :key="classroom.id" class="badge badge-info badge-camera-class mr-1"><i class="fas fa-video mr-1"></i>{{ classroom.name }}</span>
      <span v-if="!(account.lophoc || []).length" class="badge badge-light border text-muted mr-2">Chưa có lớp camera</span>
      <button type="button" :class="['camera-switch ml-1', account.active ? 'is-on' : 'is-off']" :disabled="busy || account.state === 'DISABLED'" :title="account.active ? 'Bấm để tắt quyền xem camera' : 'Bấm để bật quyền xem camera'" @click="act('toggle-active', { active: !account.active })">
        <i :class="['fas mr-1', account.active ? 'fa-check-circle' : 'fa-times-circle']"></i>{{ account.active ? 'Camera bật' : 'Camera tắt' }}
      </button>
      <span v-if="account.state === 'DISABLED'" class="badge badge-danger ml-1"><i class="fas fa-lock mr-1"></i>Đã vô hiệu hóa</span>
      <span v-else-if="account.state === 'BLOCKED'" class="badge badge-warning ml-1"><i class="fas fa-exclamation-triangle mr-1"></i>Sai PIN</span>
      <span v-else-if="account.state === 'RESET'" class="badge badge-warning ml-1"><i class="fas fa-key mr-1"></i>Chờ đổi PIN</span>
      <button type="button" class="btn btn-sm btn-light border ml-2" title="Đồng bộ lớp theo bé đang học" :disabled="busy || !!mappingError" @click="act('sync')"><i class="fas fa-sync-alt"></i></button>
      <button type="button" class="btn btn-sm btn-light border ml-1" title="Cấp lại PIN tạm" :disabled="busy" @click="act('reset-pin')"><i class="fas fa-key text-warning"></i></button>
      <b-dropdown size="sm" variant="light" class="ml-1 camera-more" text="⋯" :disabled="busy" aria-label="Thao tác tài khoản camera">
        <b-dropdown-item @click="act('toggle-account', { enabled: account.state === 'DISABLED' })">{{ account.state === 'DISABLED' ? 'Mở lại tài khoản' : 'Khóa tài khoản' }}</b-dropdown-item>
        <b-dropdown-item v-if="account.state === 'BLOCKED'" @click="act('unblock')">Gỡ khóa nhập sai PIN</b-dropdown-item>
        <b-dropdown-item @click="load">Tải lại trạng thái</b-dropdown-item>
      </b-dropdown>
    </template>
    <button v-if="error" type="button" class="btn btn-sm btn-outline-danger ml-1" title="Tải lại trạng thái camera" @click="load"><i class="fas fa-redo"></i></button>
    <div v-if="temporaryPin" class="camera-pin alert alert-info py-1 px-2 mt-2 mb-0 small">PIN tạm: <strong>{{ temporaryPin }}</strong>. Phụ huynh cần đổi PIN khi đăng nhập.<button type="button" class="close ml-2" aria-label="Ẩn PIN" @click="temporaryPin = ''"><span>&times;</span></button></div>
  </div>
</template>
<script>
import { cameraAdmin, cameraRequest } from '~/utils/cameraIntegration';
export default {
  props: { phoneId: { type: String, required: true } },
  data: () => ({ account: null, loaded: false, busy: false, error: '', mappingError: '', temporaryPin: '', generation: 0 }),
  computed: { isAdmin() { return cameraAdmin(this.$store); } },
  watch: {
    phoneId() { this.generation++; this.temporaryPin = ''; this.account = null; this.loaded = false; this.load(); },
    isAdmin(value) { if (value) this.load(); }
  },
  mounted() { this.load(); },
  beforeDestroy() { this.generation++; },
  methods: {
    setMappingError(message) { this.mappingError = message || ''; this.$emit('mapping-error', { phoneId: this.phoneId, message: this.mappingError }); },
    async load() {
      if (!this.isAdmin) return;
      const generation = ++this.generation;
      this.busy = true; this.error = ''; this.loaded = false;
      try {
        const { data } = await cameraRequest(this, 'get', `phones/${encodeURIComponent(this.phoneId)}`);
        if (generation !== this.generation) return;
        this.account = data.account; this.setMappingError(data.mappingError); this.loaded = true;
      } catch (error) { if (generation === this.generation) this.error = error.message; }
      finally { if (generation === this.generation) this.busy = false; }
    },
    async act(action, payload = {}) {
      const id = this.phoneId, generation = this.generation;
      if (['reset-pin', 'toggle-account'].includes(action) && !await this.$bvModal.msgBoxConfirm('Áp dụng thay đổi tài khoản camera cho SĐT này?', { okTitle: 'Xác nhận', cancelTitle: 'Hủy' })) return;
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
<style scoped>
.camera-account { min-width: 0; }
.badge-camera-class { font-weight: 500; }
.camera-switch { border: 1px solid transparent; border-radius: 999px; font-size: .75rem; font-weight: 600; line-height: 1.4; padding: .25rem .55rem; }
.camera-switch.is-on { background: #d4edda; border-color: #a7d7b0; color: #176c31; }
.camera-switch.is-off { background: #f1f3f5; border-color: #d6d9dd; color: #606870; }
.camera-switch:disabled { opacity: .65; cursor: not-allowed; }
.camera-more :deep(.btn) { border: 1px solid #dee2e6; }
.camera-pin { flex-basis: 100%; }
</style>
