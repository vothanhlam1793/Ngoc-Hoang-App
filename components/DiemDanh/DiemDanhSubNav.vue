<template>
  <div class="diemdanh-sub-nav mb-3">
    <div class="sub-nav-wrapper">
      <!-- 1. Đi học -->
      <nuxt-link
        :to="`/dihoc/${year}/${month}/${date}/${classId}`"
        class="sub-nav-btn"
        :class="{ 'active': currentTab === 'dihoc' }"
      >
        <i class="fas fa-calendar-check mr-1"></i>
        <span>Đi Học</span>
      </nuxt-link>

      <!-- 2. Ăn chiều -->
      <nuxt-link
        :to="`/anchieu/${year}/${month}/${date}/${classId}`"
        class="sub-nav-btn"
        :class="{ 'active': currentTab === 'anchieu' }"
      >
        <i class="fas fa-utensils mr-1"></i>
        <span>Ăn Chiều</span>
      </nuxt-link>

      <!-- 3. Về trễ -->
      <nuxt-link
        :to="`/vetre/${year}/${month}/${date}/${classId}`"
        class="sub-nav-btn"
        :class="{ 'active': currentTab === 'vetre' }"
      >
        <i class="fas fa-clock mr-1"></i>
        <span>Về Trễ</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DiemDanhSubNav',
  props: {
    year: {
      type: [String, Number],
      required: true
    },
    month: {
      type: [String, Number],
      required: true
    },
    date: {
      type: [String, Number],
      required: true
    },
    classId: {
      type: String,
      required: true
    },
    currentTab: {
      type: String,
      default: 'dihoc' // 'dihoc', 'anchieu', 'vetre'
    }
  }
};
</script>

<style scoped>
.diemdanh-sub-nav {
  display: flex;
  justify-content: center;
  width: 100%;
}

.sub-nav-wrapper {
  display: inline-flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 9999px;
  border: 1px solid #e2e8f0;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
  max-width: 100%;
  overflow-x: auto;
}

.sub-nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  text-decoration: none;
  border-radius: 9999px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}

.sub-nav-btn:hover {
  color: #1e293b;
}

.sub-nav-btn.active {
  background: #ffffff;
  color: #4f46e5;
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.15), 0 1px 2px rgba(0, 0, 0, 0.06);
}

@media (max-width: 576px) {
  .sub-nav-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}
</style>
