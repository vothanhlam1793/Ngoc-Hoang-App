<template>
    <div class="row">
        <div class="col">
            <div class="row mt-3"
                v-if="checkRole(['giao-vien'])"
            >
                <div class="col p-2">
                    <h3 class="my-2">Công cụ lớp học</h3>
                    <ul class="list-group">
                        <li class="list-group-item list-group-item-primary"
                        @click="$router.push(`/dihoc`)"
                        >
                            <a>
                                Điểm danh hàng ngày
                            </a>
                        </li>
                        <li class="list-group-item"
                        @click="$router.push(`/vetre`)"
                        >
                            <a>
                                Về trễ 17 giờ
                            </a>
                        </li>
                        <li class="list-group-item list-group-item-primary"
                        @click="$router.push(`/anchieu`)"
                        >
                            <a>
                                Ăn chiều
                            </a>
                        </li>
                        <li class="list-group-item"
                        @click="$router.push(`/hocsinh`)"
                        >
                            <a>
                                Thông tin học sinh
                            </a>
                        </li>
                    </ul> 
                </div>
            </div>
            <div class="row mt-3"
                v-if="checkRole(['ke-toan'])"
            >
                <div class="col">
                    <h3 class="my-2">Công cụ quản trị</h3>
                                        <ul class="list-group">
                        <li class="list-group-item"
                        @click="$router.push(`/hocsinhv2`)"
                        >
                            <a>
                                Quản lý học sinh
                            </a>
                        </li>
                        <!-- <li class="list-group-item"
                                                    @click="$router.push(`/hoadon`)"
                            >
                            <a href="/hoadon">
                                Bán hàng
                            </a>
                        </li> -->
                        <li class="list-group-item"
                        @click="$router.push(`/ketso/${getDateKetSo()}`)"
                        >
                            <a>
                                Kết sổ
                            </a>
                        </li>
                        <li class="list-group-item"
                        @click="$router.push(`/setup`)"
                        >
                            <a>
                                Cài đặt thông tin
                            </a>
                        </li>
                        <li class="list-group-item"
                        @click="$router.push(`/giaovien`)"
                        >
                            <a>
                                Quản lý giáo viên
                            </a>
                        </li>
                        <li class="list-group-item"
                        @click="$router.push(`/ketsonghihoc`)"
                        >
                            <a>
                                Kết sổ nghỉ học
                            </a>
                        </li>
                        <li class="list-group-item"
                        @click="$router.push(`/danhsachketso`)"
                        >
                            <a>
                                Danh sách kết sổ
                            </a>
                        </li>
                        <li class="list-group-item list-group-item"
                        @click="$router.push(`/vetre/18g`)"
                        >
                            <a>
                                Danh sách phiếu điểm danh
                            </a>
                        </li>
                    </ul> 
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    layout: "app",
    watch: {

    },
    methods:{
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
    computed: {
        user(){
            return this.$store.state.user.user;
        },
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