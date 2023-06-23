<template>
    <div class="row">
        <div class="col">
            <div>
                <h3>{{ lophoc.name }} - ĂN CHIỀU</h3>
                <p>Ngày {{ $route.params.date }}/{{ $route.params.month }}/{{ $route.params.year }}</p>
            </div>
            <ResultDiemDanh v-if="lophoc.id"
                :lophoc="lophoc"
            />
            <div class="text-right">
                <button 
                @click="$store.dispatch('ndd/createPhieuDiemDanh')"
                    class="btn btn-primary mb-3"
                >
                Tạo mới</button>
            </div>
            <div>
                <table class="table-bordered table-stripped">
                    <thead>
                        <tr class="text-center">
                            <th class="p-2">STT</th>
                            <th class="p-2">Tên</th>
                            <th class="p-2">Điểm danh</th>
                        </tr>
                    </thead>
                    <tbody>
                        <DiemDanhItemDiemDanh 
                            v-for="hocsinh, index in sortHocSinh(lophoc.hocsinhs)"
                            :hocsinh="hocsinh"
                            :key="hocsinh.id"
                            :index="index"
                        />
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import ResultDiemDanh from '~/components/DiemDanh/ResultDiemDanh.vue';
export default {
    components: {
        ResultDiemDanh
    },
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
        dangkyan: function(n,o){
            if(n.length > 0){
                this.$store.commit("ndd/mergeDangKiAnToLopHoc");
            }
        },
        stateLopHoc: function(nS, oS){
            if(nS == "READY"){
                this.$store.dispatch("ndd/getDangKyAn");
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
        dangkyan(){
            return this.$store.state.ndd.dangkyan;
        },
        stateLopHoc(){
            return this.$store.state.ndd.stateLopHoc;
        }
    },
    created() {
        // Setup
        if(typeof window !== undefined){
            this.$store.commit("ndd/updateType", "DIEMDANH545");
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