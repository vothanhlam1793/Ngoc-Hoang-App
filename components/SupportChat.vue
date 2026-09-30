<template>
  <div v-if="userId && (enabled || open)" class="support-widget">
    <section v-if="open" class="support-panel shadow-lg" aria-label="Chat hỗ trợ">
      <header class="support-header">
        <strong>{{ name }}</strong>
        <button class="btn btn-sm btn-light" type="button" aria-label="Thu nhỏ chat" @click="open = false">Thu nhỏ</button>
      </header>
      <div class="px-3 pt-2 small text-muted">Hướng dẫn nghiệp vụ · Lịch sử tự xóa sau 48 giờ</div>
      <div ref="messages" class="support-messages" aria-live="polite" aria-relevant="additions text">
        <p v-if="!messages.length">Cô cần hỗ trợ việc gì ạ? Em có thể hướng dẫn điểm danh, hồ sơ bé, camera và kết sổ.</p>
        <div v-for="(message, index) in messages" :key="index" class="support-message" :class="message.role">
          <strong class="small">{{ message.role === 'user' ? 'Bạn' : name }}</strong>
          <div v-if="message.role === 'assistant'"><template v-for="(part, partIndex) in formatted(message.content)"><nuxt-link v-if="part.to" :key="partIndex" :to="part.to">{{ part.text }}</nuxt-link><strong v-else-if="part.bold" :key="partIndex">{{ part.text }}</strong><span v-else :key="partIndex">{{ part.text }}</span></template></div>
          <div v-else>{{ message.content }}</div>
        </div>
        <p v-if="busy" class="text-muted">Đang soạn hướng dẫn…</p>
      </div>
      <div v-if="!enabled" class="alert alert-warning mx-3">Nhà trường đã tạm ngừng trợ lý hỗ trợ.</div>
      <div v-if="error" class="px-3 text-danger" role="alert">{{ error }} <button v-if="retryMessage && enabled" class="btn btn-sm btn-outline-primary" :disabled="busy" @click="send(retryMessage)">Thử lại</button></div>
      <form class="p-3" @submit.prevent="send()">
        <label for="support-input" class="sr-only">Câu hỏi cần hỗ trợ</label>
        <textarea id="support-input" ref="input" v-model="input" rows="2" maxlength="2000" class="form-control" placeholder="Cô nhập câu hỏi ở đây…" :disabled="!enabled" @keydown="handleKeydown" />
        <small class="text-muted">Enter để gửi · Shift + Enter để xuống dòng</small>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <button class="btn btn-link px-0" type="button" :disabled="busy" @click="reset">Cuộc trò chuyện mới</button>
          <button class="btn btn-primary" :disabled="busy || !enabled || !input.trim()">Gửi</button>
        </div>
        <nuxt-link to="/huongdan" class="small" @click.native="open = false">Mở sổ tay nghiệp vụ →</nuxt-link>
      </form>
    </section>
    <button v-if="enabled" type="button" class="btn btn-primary support-launch shadow" :aria-expanded="String(open)" @click="toggle">{{ open ? 'Đóng hỗ trợ' : 'Hỗ trợ' }} <i class="fas fa-comment-dots ml-1" aria-hidden="true"></i></button>
  </div>
</template>
<script>
import { supportRequest, cleanSession } from '~/utils/supportChat';
import { messageParts, guideLinks, shouldSendOnEnter } from '~/utils/supportMessage';
export default {
  data: () => ({ enabled: false, open: false, name: 'Trợ lý Ngọc Hoàng', input: '', messages: [], createdAt: Date.now(), busy: false, error: '', retryMessage: '', timer: null, generation: 0 }),
  computed: {
    userId() { return this.$auth.loggedIn ? String(this.$store.state.user.user?.id || this.$auth.user?.id || '') : ''; },
    storageKey() { return 'ngochoang-support:' + this.userId; }
  },
  watch: {
    userId(id, previous) {
      this.generation++;
      if (previous) { try { localStorage.removeItem('ngochoang-support:' + previous); } catch (_) {} }
      this.open = false; this.enabled = false; this.busy = false; this.messages = []; this.input = ''; this.error = ''; this.retryMessage = '';
      if (id) { this.load(); this.status(); }
    }
  },
  mounted() {
    this.load(); this.status();
    this.timer = setInterval(() => { this.expire(); this.status(); }, 30000);
    window.addEventListener('storage', this.onStorage);
  },
  beforeDestroy() {
    clearInterval(this.timer); window.removeEventListener('storage', this.onStorage); this.generation++;
    if (!this.$auth.loggedIn) {
      try { Object.keys(localStorage).filter(key => key.startsWith('ngochoang-support:')).forEach(key => localStorage.removeItem(key)); } catch (_) {}
    }
  },
  methods: {
    formatted(text) { return messageParts(text, guideLinks(this.$store)); },
    handleKeydown(event) {
      if (!shouldSendOnEnter(event)) return;
      event.preventDefault();
      if (!event.repeat) this.send();
    },
    onStorage(event) { if (event.key === this.storageKey) { this.generation++; this.busy = false; this.load(); } },
    async status() {
      const user = this.userId;
      if (!user) return;
      try { const data = await supportRequest(this, 'get', 'status'); if (user !== this.userId) return; this.enabled = data.enabled; this.name = data.name; }
      catch (_) { if (user === this.userId) this.enabled = false; }
    },
    load() {
      if (!this.userId) return;
      let session;
      try { session = cleanSession(JSON.parse(localStorage.getItem(this.storageKey))); } catch (_) {}
      this.messages = session ? session.messages : []; this.createdAt = session ? session.createdAt : Date.now();
      if (!session) { try { localStorage.removeItem(this.storageKey); } catch (_) {} }
    },
    persist() {
      try { localStorage.setItem(this.storageKey, JSON.stringify({ createdAt: this.createdAt, messages: this.messages.slice(-40) })); }
      catch (_) { this.error = 'Trình duyệt không lưu được lịch sử. Cuộc trò chuyện chỉ giữ khi trang đang mở.'; }
    },
    expire() { if (!cleanSession({ createdAt: this.createdAt, messages: this.messages })) this.reset(); },
    reset() { this.generation++; this.busy = false; this.messages = []; this.input = ''; this.error = ''; this.retryMessage = ''; this.createdAt = Date.now(); try { localStorage.removeItem(this.storageKey); } catch (_) {} },
    toggle() { this.expire(); this.open = !this.open; if (this.open) { this.status(); this.$nextTick(() => this.$refs.input?.focus()); } },
    scroll() { this.$nextTick(() => { const el = this.$refs.messages; if (el) el.scrollTop = el.scrollHeight; }); },
    async send(retry) {
      if (this.busy || !this.enabled) return;
      const text = typeof retry === 'string' ? retry : this.input.trim();
      if (!text) return;
      this.expire();
      const generation = this.generation;
      const history = this.messages.slice(-12);
      this.messages.push({ role: 'user', content: text }); this.messages = this.messages.slice(-40);
      this.input = ''; this.error = ''; this.retryMessage = ''; this.busy = true; this.persist(); this.scroll();
      try {
        const result = await supportRequest(this, 'post', 'chat', { message: text, history, page: this.$route.path });
        if (generation !== this.generation) return;
        this.messages.push({ role: 'assistant', content: result.answer }); this.messages = this.messages.slice(-40); this.persist();
      } catch (e) {
        if (generation !== this.generation) return;
        this.messages.pop(); this.persist(); this.retryMessage = text;
        this.error = e.response?.data?.error || 'Chưa gửi được câu hỏi. Cô thử lại nhé.';
        if (e.response?.status === 403) this.enabled = false;
      } finally { if (generation === this.generation) { this.busy = false; this.scroll(); } }
    }
  }
};
</script>
<style scoped>
.support-widget { position: fixed; right: 22px; bottom: 22px; z-index: 1040; }
.support-launch { float: right; border-radius: 26px; min-height: 48px; padding: 10px 22px; }
.support-panel { display: flex; flex-direction: column; width: 380px; max-width: calc(100vw - 24px); height: 580px; max-height: calc(100dvh - 170px); background: white; border: 1px solid #dbe5f1; border-radius: 18px; overflow: hidden; margin-bottom: 12px; }
.support-header { background: #edf5ff; padding: 14px; display: flex; justify-content: space-between; align-items: center; }
.support-messages { overflow-y: auto; flex: 1; padding: 16px; min-height: 100px; }
.support-message { white-space: pre-wrap; overflow-wrap: anywhere; border-radius: 12px; padding: 12px; margin-bottom: 12px; background: #f2f5f8; line-height: 1.65; }
.support-message.user { background: #e4f0ff; margin-left: 22px; }
@media(max-width: 767px) { .support-widget { bottom: 82px; right: 12px; } .support-panel { width: calc(100vw - 24px); } }
</style>
