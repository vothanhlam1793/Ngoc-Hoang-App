<template>
<nav class="navbar navbar-expand-sm bg-light mb-3 sticky-top">
  <ul class="navbar-nav">

    <li class="nav-item">
      <a class="nav-link" href="/">Trang chủ</a>
    </li>
    <li v-if="checkRole(['quan-tri-vien','hieu-truong','hieu-pho', 'ke-toan'])" class="nav-item">
      <a class="nav-link" href="/hocsinhv2">Học sinh</a>
    </li>
    <li v-if="checkRole(['giao-vien'])" class="nav-item">
      <a class="nav-link" href="/hocsinh">Học sinh</a>
    </li>
    <li 
    v-if="checkRole(['giao-vien'])" 
    class="nav-item">
      <a class="nav-link" href="/dihoc">Điểm danh</a>
    </li>
    <li 
    v-if="checkRole(['giao-vien'])" 
    class="nav-item">
      <a class="nav-link" href="/vetre">Về trễ</a>
    </li>
    <li v-if="checkRole(['quan-tri-vien'])" class="nav-item">
      <a class="nav-link" href="/sanpham">Sản phẩm</a>
    </li>
    <li v-if="checkRole(['quan-tri-vien'])" class="nav-item">
      <a class="nav-link" href="/hoadon">Hoá đơn</a>
    </li>
    <li 
    v-if="checkRole(['quan-tri-vien', 'ke-toan', 'hieu-truong', 'hieu-pho'])" 
    class="nav-item">
      <a class="nav-link" :href="`/ketso/${getDateKetSo()}`">Kết sổ</a>
    </li>
    <li 
    v-if="checkRole(['quan-tri-vien', 'ke-toan', 'hieu-truong', 'hieu-pho'])" 
    class="nav-item">
      <a class="nav-link" href="/setup">Cài đặt</a>
    </li>
    <li v-if="checkRole(['quan-tri-vien','hieu-truong','hieu-pho', 'ke-toan'])" class="nav-item">
      <a class="nav-link" href="/baocao">Báo cáo</a>
    </li>
    <li 
    v-if="checkRole(['giao-vien'])" 
    class="nav-item">
      <a class="nav-link" href="/anchieu">Ăn chiều</a>
    </li>
    <!-- <li class="nav-item">
      <a class="nav-link" href="#">Link 3</a>
    </li> -->
    <li class="nav-item ml-5">
      <LoginButton></LoginButton>
    </li>
  </ul>
</nav>
</template>

<script>

export default {
    data() {
        return {

        }
    },
    methods: {
      getDateKetSo(){
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var d1 = new Date(firstDay - 1000);
        var a = "00" + (d1.getMonth() +1 ).toString();
        a = a.substring(a.length -2, a.length)
        return `${d1.getFullYear()}/${a}`
      },
      checkRole(slugs){
        var ret = false;
        this.roles.forEach(function(e1){
          slugs.forEach(function(e2){
            if(e1 == e2){
              ret = true;
            }
          });
        })
        return ret;
      }
    },
    watch: {
      roles: function(newR, oldR){

      }
    },
    computed:{
      roles(){
        return this.$store.state.user.roles;
      }
    },
    mounted(){
      if(this.$store.$auth.$state.loggedIn){
        this.$store.dispatch("user/getRole");
      } else {
        if(this.$route.path == "/login"){

        } else {
          location.href = "/login"
        }
      }
    }
}
</script>