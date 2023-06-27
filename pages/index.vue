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
                            <a href="/dihoc">
                                Điểm danh hàng ngày
                            </a>
                        </li>
                        <li class="list-group-item"
                        @click="$router.push(`/vetre`)"
                        >
                            <a href="/vetre">
                                Về trễ
                            </a>
                        </li>
                        <li class="list-group-item list-group-item-primary"
                        @click="$router.push(`/anchieu`)"
                        >
                            <a href="/anchieu">
                                Ăn chiều
                            </a>
                        </li>
                        <li class="list-group-item"
                        @click="$router.push(`/hocsinh`)"
                        >
                            <a href="/hocsinh">
                                Thông tin học sinh
                            </a>
                        </li>
                        <li class="list-group-item list-group-item-danger"
                        @click="$router.push(`/diemdanhvetre`)"
                        >
                            <a href="/diemdanhvetre">
                                Điểm danh sau (18 giờ)
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
                            <a href="/hocsinhv2">
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
                            <a :href="`/ketso/${getDateKetSo()}`">
                                Kết sổ
                            </a>
                        </li>
                        <li class="list-group-item"
                        @click="$router.push(`/setup`)"
                        >
                            <a href="/setup">
                                Cài đặt thông tin
                            </a>
                        </li>
                        <li class="list-group-item"
                        @click="$router.push(`/giaovien`)"
                        >
                            <a href="/giaovien">
                                Quản lý giáo viên
                            </a>
                        </li>
                        <li class="list-group-item"
                        @click="$router.push(`/ketsonghihoc`)"
                        >
                            <a href="/ketsonghihoc">
                                Kết sổ nghỉ học
                            </a>
                        </li>
                        <li class="list-group-item"
                        @click="$router.push(`/danhsachketso`)"
                        >
                            <a href="/danhsachketso">
                                Danh sách kết sổ
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