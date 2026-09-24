<template>
  <div class="container-fluid px-0">
    <Menu />
    <main class="container-fluid px-3 py-2">
      <Nuxt />
    </main>
  </div>
</template>

<style>
.checkbox-lg .form-check-input {
  top: 0.8rem;
  scale: 1.4;
  margin-right: 0.7rem;
}

.checkbox-lg .form-check-label {
  padding-top: 13px;
}

input.larger {
  scale: 2;
  margin-right: 0.8rem;
  margin-left: 0.8rem;
}

.checkbox-xl .form-check-label {
  padding-top: 19px;
}
</style>

<script>
export default {
  head() {
    return {
      title: "MN Ngọc Hoàng - Quản lý nội bộ"
    };
  }
};
</script>
