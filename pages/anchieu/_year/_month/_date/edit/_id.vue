<template>
    <div class="row mt-3">
        <div class="col">
            <div>
                <h1>{{ lophoc.name }}</h1>
            </div>
            <ResultDiemDanh v-if="lophoc.id"
                :lophoc="lophoc"
            />
            <div class="my-2 text-right">
                <button 
                @click="$store.dispatch('ndd/createPhieuDiemDanh')"
                    class="btn btn-warning"
                    v-if="stateButtonEdit"
                >
                Cập nhật</button>
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
            if(hocsinhs == undefined){
                return [];
            }
            var ret = [];
            if(hocsinhs){
                var that = this;
                ret = hocsinhs.filter(function(hocsinh){
                    return hocsinh.status != "NGHI_LUON";
                });
                ret.sort(function(a,b){
                    let t = a.name.split(" ");
                    t = t.filter(e => e != "");
                    let u = b.name.split(" ");
                    u = u.filter(e => e != "");
                    if(that.chuyentiengviet(t[t.length - 1]) < that.chuyentiengviet(u[u.length - 1])){
                        return -1;
                    } else if(that.chuyentiengviet(t[t.length - 1]) > that.chuyentiengviet(u[u.length - 1])){
                        return 1;
                    } else {
                        return 0;
                    }
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
            this.$store.commit("ndd/updateType", "DIEMDANH545");
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