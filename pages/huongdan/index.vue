<template>
  <div class="handbook" lang="vi">
    <header class="handbook-welcome p-4 mb-4">
      <p class="text-primary font-weight-bold mb-2">HƯỚNG DẪN DÀNH CHO NHÀ TRƯỜNG</p>
      <h1>Sổ tay nghiệp vụ Ngọc Hoàng</h1>
      <p class="mb-0">Cô cần làm việc gì? Chọn một bài bên dưới rồi làm theo từng bước.</p>
    </header>

    <section aria-label="Tìm hướng dẫn" class="mb-4">
      <label for="handbook-search" class="font-weight-bold">Tìm việc cần làm</label>
      <div class="d-flex">
        <input id="handbook-search" v-model="query" type="search" class="form-control form-control-lg" placeholder="Ví dụ: nghỉ học, đổi số điện thoại, tính tiền…" aria-describedby="search-help" />
        <button v-if="query || audience" type="button" class="btn btn-outline-secondary ml-2" @click="query = ''; audience = ''">Xóa lọc</button>
      </div>
      <p id="search-help" class="text-muted mt-2 mb-3">Gõ có dấu hoặc không dấu đều được. Bấm tên bài để đọc; đọc hướng dẫn không làm thay đổi hồ sơ.</p>
      <label for="handbook-audience" class="mr-2">Hướng dẫn cho:</label>
      <select id="handbook-audience" v-model="audience" class="custom-select audience-select">
        <option value="">Tất cả mọi người</option>
        <option v-for="role in audiences" :key="role">{{ role }}</option>
      </select>
    </section>

    <div class="handbook-layout">
      <nav aria-label="Mục lục nghiệp vụ" class="handbook-index">
        <p aria-live="polite" class="text-muted">{{ results.length }} bài hướng dẫn</p>
        <template v-for="(group, index) in groups">
          <section v-if="results.some(item => item.group === index)" :key="group" class="mb-4">
            <h2 class="index-heading">{{ group }}</h2>
            <nuxt-link v-for="item in results.filter(a => a.group === index)" :key="item.id" :to="{ path: '/huongdan', query: { bai: item.id } }" class="article-link" :class="{ selected: article && article.id === item.id }" :aria-current="article && article.id === item.id ? 'page' : null" @click.native="focusArticle">
              <strong>{{ item.title }}</strong><span>{{ item.summary }}</span>
            </nuxt-link>
          </section>
        </template>
        <div v-if="!results.length" class="alert alert-light border">Chưa tìm thấy bài phù hợp. Thử từ ngắn hơn như “camera”, “nghỉ” hoặc bấm Xóa lọc.</div>
      </nav>

      <article v-if="article" class="handbook-article card border-0 shadow-sm p-3 p-md-4" aria-labelledby="article-title">
        <p class="text-muted mb-2">{{ groups[article.group] }} · Cập nhật {{ updatedAt }}</p>
        <h2 id="article-title" ref="articleTitle" tabindex="-1">{{ article.title }}</h2>
        <p>{{ article.summary }}</p>
        <p><strong>Người thực hiện:</strong> {{ article.roles.join(', ') }}. Thao tác theo phân công và quyền tài khoản.</p>
        <div v-if="article.status" class="alert alert-warning">{{ article.status }}</div>
        <section class="preparation p-3 mb-4"><h3>Cần chuẩn bị gì?</h3><p class="mb-0">{{ article.prepare }}</p></section>
        <h3>Làm lần lượt như sau</h3>
        <ol class="handbook-steps"><li v-for="(step, index) in article.steps" :key="index">{{ step }}</li></ol>
        <section class="result-box p-3 mb-4"><h3>Làm xong, kiểm tra lại</h3><p class="mb-0">{{ article.check }}</p></section>
        <section v-if="article.note" class="alert alert-info"><h3>Điều cần nhớ</h3><p class="mb-0">{{ article.note }}</p></section>
        <section class="mb-4"><h3>Nếu chưa làm được</h3><p>{{ article.help }}</p></section>
        <div v-if="availableLinks.length" class="action-links mb-4">
          <nuxt-link v-for="link in availableLinks" :key="link.to" :to="destination(link)" class="btn btn-primary mr-2 mb-2">{{ link.label }} →</nuxt-link>
          <small class="d-block text-muted">Mở màn hình để thực hiện; hướng dẫn không tự lưu hay thay đổi dữ liệu.</small>
        </div>
        <section class="border-top pt-3">
          <h3>Bài liên quan</h3>
          <nuxt-link v-for="item in relatedArticles" :key="item.id" :to="{ path: '/huongdan', query: { bai: item.id } }" class="d-block py-2" @click.native="focusArticle">{{ item.title }} →</nuxt-link>
        </section>
        <button type="button" class="btn btn-outline-secondary mt-3" @click="copyLink">Sao chép đường dẫn bài này</button>
        <p v-if="copyMessage" role="status" class="mt-2 mb-0">{{ copyMessage }}</p>
      </article>
      <section v-else class="card p-4 align-self-start">
        <h2>{{ $route.query.bai ? 'Không tìm thấy bài này' : 'Chọn việc cô cần làm' }}</h2>
        <p>Bấm một bài trong mục lục để xem các bước. Trên điện thoại, bài hướng dẫn nằm phía dưới mục lục.</p>
        <p class="mb-0">Mới bắt đầu? Chọn “Điểm danh hôm nay và sửa điểm danh nhầm”. Nếu không thấy nút thao tác cần dùng, nhờ quản lý kiểm tra quyền tài khoản.</p>
      </section>
    </div>
  </div>
</template>

<script>
import { articles, groups, audiences, updatedAt, searchArticles } from '~/utils/schoolHandbook';

export default {
  layout: 'app',
  middleware: 'auth',
  head: () => ({ title: 'Sổ tay nghiệp vụ Ngọc Hoàng' }),
  data: () => ({ query: '', audience: '', groups, audiences, updatedAt, copyMessage: '' }),
  computed: {
    results() { return searchArticles(this.query, this.audience); },
    article() { return articles.find(item => item.id === this.$route.query.bai) || null; },
    relatedArticles() { return this.article ? this.article.related.map(id => articles.find(item => item.id === id)).filter(Boolean) : []; },
    availableLinks() {
      if (!this.article) return [];
      const roles = this.$store.getters['user/effectiveRoles'] || [];
      const impersonating = this.$store.state.user.isImpersonating;
      const school = !impersonating && roles.some(role => ['quan-tri-vien', 'ke-toan', 'hieu-truong', 'hieu-pho'].includes(role));
      const fees = school && (this.$store.state.user.isAdmin === true || roles.some(role => ['super-admin', 'quan-tri-vien'].includes(role)));
      const students = school || impersonating || roles.includes('giao-vien');
      return this.article.links.filter(link => ({ school, fees, students })[link.access]);
    }
  },
  watch: { '$route.query.bai'() { this.copyMessage = ''; this.focusArticle(); } },
  methods: {
    destination(link) {
      const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit' }).formatToParts(new Date());
      const year = Number(parts.find(part => part.type === 'year').value);
      const month = Number(parts.find(part => part.type === 'month').value);
      if (link.to === '/ketso') {
        return `/ketso/${month === 1 ? year - 1 : year}/${String(month === 1 ? 12 : month - 1).padStart(2, '0')}`;
      }
      if (link.to === '/lichhoc') return { path: '/lichhoc', query: { year: String(year), month: String(month).padStart(2, '0') } };
      return link.to;
    },
    focusArticle() {
      this.$nextTick(() => {
        const heading = this.$refs.articleTitle;
        if (heading) { heading.focus({ preventScroll: true }); heading.scrollIntoView({ block: 'start' }); }
      });
    },
    async copyLink() {
      try {
        await navigator.clipboard.writeText(window.location.origin + this.$route.fullPath);
        this.copyMessage = 'Đã sao chép. Cô có thể dán đường dẫn để gửi cho đồng nghiệp.';
      } catch (_) {
        this.copyMessage = 'Cô có thể sao chép địa chỉ trên thanh địa chỉ của trình duyệt để gửi bài này.';
      }
    }
  }
};
</script>

<style scoped>
.handbook { max-width: 1250px; margin: 0 auto; color: #25374b; font-size: 1rem; line-height: 1.75; }
.handbook-welcome { background: #edf5ff; border-radius: 16px; }
.handbook h1 { font-size: 1.8rem; font-weight: 700; }
.handbook h2 { font-size: 1.5rem; font-weight: 700; }
.handbook h3 { font-size: 1.12rem; font-weight: 700; }
.handbook-layout { display: grid; grid-template-columns: minmax(260px, 340px) minmax(0, 1fr); gap: 24px; align-items: start; }
.handbook .index-heading { font-size: 1rem; color: #4d6074; }
.article-link { display: block; padding: 14px 16px; border: 1px solid #d7e0eb; border-radius: 10px; margin-bottom: 10px; background: white; color: #25374b; }
.article-link span { display: block; font-size: .94rem; color: #526477; margin-top: 4px; }
.article-link:hover, .article-link.selected { border-color: #2364ac; background: #edf5ff; text-decoration: none; }
.article-link.selected { box-shadow: inset 4px 0 #2364ac; }
.handbook-article { border-radius: 14px; min-width: 0; overflow-wrap: anywhere; }
#article-title { scroll-margin-top: 85px; }
.handbook a:focus-visible, .handbook button:focus-visible, .handbook input:focus-visible, .handbook select:focus-visible { outline: 3px solid #2364ac; outline-offset: 3px; }
.handbook-steps { padding-left: 1.8rem; }
.handbook-steps li { padding: 0 0 20px 8px; }
.handbook-steps li::marker { color: #2364ac; font-weight: 700; font-size: 1.2rem; }
.preparation { background: #f2f5f8; border-radius: 10px; }
.result-box { background: #edf8f0; border-radius: 10px; }
.handbook .btn { min-height: 44px; white-space: normal; }
.audience-select { width: auto; max-width: 100%; min-height: 44px; }
@media (max-width: 767px) {
  .handbook-layout { grid-template-columns: minmax(0, 1fr); }
  .handbook h1 { font-size: 1.5rem; }
  .handbook h2 { font-size: 1.3rem; }
}
</style>
