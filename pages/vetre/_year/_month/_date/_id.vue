<template>
    <div class="row">
        <div class="col">
            <div>
                <h1>{{ lophoc.name }}</h1>
                <p>Ngày {{ $route.params.date }}/{{ $route.params.month }}/{{ $route.params.year }}</p>
            </div>
            <div class="text-right my-2">
                <button 
                @click="$store.dispatch('ndd/createPhieuDiemDanh')"
                    class="btn btn-primary"
                >
                Tạo mới</button>
            </div>
            <div>
                <table class="table table-bordered table-stripped">
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Điểm danh</th>
                        </tr>
                    </thead>
                    <tbody>
                        <DiemDanhItemDiemDanh 
                            v-for="hocsinh in sortHocSinh(lophoc.hocsinhs)"
                            :hocsinh="hocsinh"
                            :key="hocsinh.id"
                            :counter="count"
                        />
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            state: "IDLE", 
            count: 0
        }
    },
    methods: {
        chuyentiengviet(str) {
            if(str == undefined){
                return "";
            }
            return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
        },
        sortHocSinh(hocsinhs){
            var ret = [];
            if(hocsinhs){
                var that = this;
                hocsinhs.forEach(function(hocsinh){
                    ret.push(hocsinh);
                });
                ret.sort(function(a,b){
                    var t = a.name.split(" ");
                    var u = b.name.split(" ");
                    if(that.chuyentiengviet(t[t.length - 1]) < that.chuyentiengviet(u[u.length - 1])){
                        return -1;
                    }
                    if(that.chuyentiengviet(t[t.length - 1]) > that.chuyentiengviet(u[u.length - 1])){
                        return 1;
                    }
                    return 0;
                });
                return ret;
            }
            return ret;
        },
        checkDiemDanh(hocsinh){
            var ret = false;
            this.phieudiemdanh.co.forEach(function(e){
                if(e.id == hocsinh.id){
                    ret = true;
                }
            });
            return ret;
        },
    },
    watch: {
        monitor: function(nS, oS){

        },
        stateLopHoc: function(nS, oS){
            if(nS == "READY"){
                this.$store.commit("ndd/merVeTreToLopHoc");
            }
        }
    },
    computed: {
        lophoc() {
            return this.$store.state.ndd.lophoc;
        },
        monitor(){
            return this.$store.state.ndd.monitor;
        },
        edit(){
            return this.$store.state.ndd.edit;
        },
        stateLopHoc(){
            return this.$store.state.ndd.stateLopHoc;
        }
    },
    created() {
        // Setup
        if(typeof window !== undefined){
            this.$store.commit("ndd/updateType", "VETRE");
            this.$store.commit("ndd/updateIdLopHoc", this.$route.params.id);
            this.$store.commit("ndd/updateCode", `${this.$route.params.year}_${this.$route.params.month}_${this.$route.params.date}`);
            this.$store.commit("ndd/updateIdGiaoVien", this.$store.$auth.$state.user.id)
            
            // Control
            this.$store.dispatch("ndd/getLopHoc");
        }
    },
    mounted() {

    },
    layout: "diemdanh"
}
</script>