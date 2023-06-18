<template>
    <div class="row">
        <div class="col">
            <div class="text-right">
                <button 
                @click="$store.dispatch('ndd/createPhieuDiemDanh')"
                    class="btn btn-warning"
                    v-if="stateButtonEdit"
                >
                Cập nhật</button>
                <p
                v-if="stateButtonEdit == false"
                >Lớp học đã được điểm danh</p>
            </div>
            <div>
                <h1>{{ lophoc.name }}</h1>
            </div>
            <div>
                <table class="table table-bordered table-stripped">
                    <thead>
                        <tr class="text-center">
                            <th>Tên</th>
                            <th>Điểm danh</th>
                        </tr>
                    </thead>
                    <tbody>
                        <DiemDanhItemDiemDanh 
                            v-for="hocsinh in sortHocSinh(lophoc.hocsinhs)"
                            :hocsinh="hocsinh"
                            :key="hocsinh.id"
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
            state: "IDLE"
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
        }
    },
    watch: {
        monitor: function(nS, oS){
            this.$forceUpdate();
        },
        phieudiemdanh: function(n, o){
            if(n.id){
                this.$store.commit("ndd/mergePhieuDiemDanhToLopHoc");
            }
        },
        stateLopHoc: function(nS, oS){
            if(nS == "READY"){
                this.$store.dispatch("ndd/getPhieuDiemDanh");
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
        phieudiemdanh(){
            return this.$store.state.ndd.phieudiemdanh;
        },
        stateLopHoc(){
            return this.$store.state.ndd.stateLopHoc;
        },
        stateButtonEdit(){
            return this.$store.state.ndd.stateButtonEdit;
        }
    },
    created() {
        // Setup
        if(typeof window !== undefined){
            this.$store.commit("ndd/updateType", "DIHOCHANGNGAY");
            this.$store.commit("ndd/updateIdLopHoc", this.$route.params.id);
            this.$store.commit("ndd/updateCode", `${this.$route.params.year}_${this.$route.params.month}_${this.$route.params.date}`);
            this.$store.commit("ndd/updateIdGiaoVien", this.$store.$auth.$state.user.id)
            
            this.$store.commit("ndd/updateStateEdit", "edit");
            // Control
            this.$store.dispatch("ndd/getLopHoc");
        }
    },
    mounted() {

    },
    layout: "diemdanh"
}
</script>