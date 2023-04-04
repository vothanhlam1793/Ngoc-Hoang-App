<template>
    <div class="row">
        <div class="col">
            <div>
                <button 
                @click="$store.dispatch('ndd/createPhieuDiemDanh')"
                    class="btn btn-primary"
                >
                Tạo mới</button>
            </div>
            <div>
                <h1>{{ lophoc.name }}</h1>
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
                            v-for="hocsinh in lophoc.hocsinhs"
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
        this.$store.commit("ndd/updateType", "DIEMDANH545");
        this.$store.commit("ndd/updateIdLopHoc", this.$route.params.id);
        this.$store.commit("ndd/updateCode", `${this.$route.params.year}_${this.$route.params.month}_${this.$route.params.date}`);
        this.$store.commit("ndd/updateIdGiaoVien", this.$store.$auth.$state.user.id)
        
        // Control
        this.$store.dispatch("ndd/getLopHoc");
    },
    mounted() {

    },
    layout: "diemdanh"
}
</script>