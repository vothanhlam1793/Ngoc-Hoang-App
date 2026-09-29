<template>
  <tr>
    <td class="font-weight-semibold text-dark sticky-col-student">{{ item.hocsinh ? item.hocsinh.name : '' }}</td>
    <KetSoETotal :item="item" />
    <KetSoEHocPhi :item="item" />
    <KetSoECoSoVatChat :item="item" />
    <KetSoECamera :item="item" />
    <KetSoEPhiMoRong :item="item" :pmrs="pmrs" :statePmrs="statePmrs" />
    <KetSoEKhac :item="item" />
    <KetSoEDienGiai :item="item" />
    <KetSoEDiemDanhV2 :item="item" type="DIHOCHANGNGAY" :month="month" :year="year" />
    <KetSoEThanhTienNghi :item="item" />
  </tr>
</template>

<script>
export default {
  props: ['item', 'month', 'year', 'pmrs', 'statePmrs']
};
</script>

<style scoped>
.sticky-col-student {
  position: sticky;
  left: 0;
  z-index: 5;
  background-color: #ffffff !important;
  box-shadow: inset -1px 0 0 #dee2e6, 2px 0 4px rgba(0, 0, 0, 0.04);
}
tr:hover .sticky-col-student {
  background-color: #f8f9fa !important;
}
</style>
