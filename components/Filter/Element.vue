<template>
  <div class="card shadow-sm border-0 bg-light p-3">
    <div class="mb-4">
      <h6 class="font-weight-bold text-dark mb-2 pb-1 border-bottom">
        <i class="fas fa-chalkboard text-primary mr-1"></i> Theo Lớp Học
      </h6>
      <FilterEle1LopHoc />
    </div>

    <div>
      <h6 class="font-weight-bold text-dark mb-2 pb-1 border-bottom">
        <i class="fas fa-user-tag text-info mr-1"></i> Trạng Thái Bé
      </h6>
      <Status />
    </div>
  </div>
</template>

<script>
import Status from '~/components/Filter/Ele2/Status.vue';
import FilterEle1LopHoc from '~/components/Filter/Ele1/LopHoc.vue';

export default {
  components: {
    Status,
    FilterEle1LopHoc
  },
};
</script>
