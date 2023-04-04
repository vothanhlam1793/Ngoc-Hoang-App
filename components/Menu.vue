<template>
<nav class="navbar navbar-expand-sm bg-light mb-3">
  <ul class="navbar-nav">

    <li class="nav-item">
      <a class="nav-link" href="/">Trang chủ</a>
    </li>
    <li v-if="checkRole(['quan-tri-vien', 'ke-toan'])" class="nav-item">
      <a class="nav-link" href="/phuhuynh">Phụ huynh</a>
    </li>
    <li v-if="checkRole(['quan-tri-vien', 'giao-vien', 'ke-toan'])" class="nav-item">
      <a class="nav-link" href="/hocsinh">Học sinh</a>
    </li>
    <li 
    v-if="checkRole(['quan-tri-vien', 'hieu-truong', 'hieu-pho', 'giao-vien'])" 
    class="nav-item">
      <a class="nav-link" href="/dihoc">Điểm danh</a>
    </li>
    <li 
    v-if="checkRole(['quan-tri-vien', 'hieu-truong', 'hieu-pho', 'giao-vien'])" 
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
      <a class="nav-link" href="/ketso/2023/03">Kết sổ</a>
    </li>
    <li 
    v-if="checkRole(['quan-tri-vien', 'ke-toan', 'hieu-truong', 'hieu-pho'])" 
    class="nav-item">
      <a class="nav-link" href="/setup">Cài đặt</a>
    </li>
    <li 
    v-if="checkRole(['giao-vien'])" 
    class="nav-item">
      <a class="nav-link" href="/anchieu">Ăn chiều</a>
    </li>
    <li class="nav-item">
      <LoginButton></LoginButton>
    </li>
    <!-- <li class="nav-item">
      <a class="nav-link" href="#">Link 3</a>
    </li> -->
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