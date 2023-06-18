<template>
    <div class="row">
        <div class="col">
            <div class="row">
                <div class="col">
                    <h1>{{ lophoc.name }} || {{ date }}</h1>
                    <V2DiemDanhResult></V2DiemDanhResult>
                    <V2DiemDanhStudentList
                        :hocsinhs="lophoc.hocsinhs"
                    ></V2DiemDanhStudentList>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    watch: {
        stateLopHoc: function(nS, oS){
            if(nS == "READY"){
                this.$store.dispatch('ndd/createPhieuDiemDanhV2');
            }
        }
    },
    computed: {
        lophoc() {
            return this.$store.state.ndd.lophoc;
        },
        stateLopHoc(){
            return this.$store.state.ndd.stateLopHoc;
        },
    },
    created(){
        // Neu van hanh tren browser
        if(typeof window !== undefined){
            this.$store.commit("ndd/updateType", "DIHOCHANGNGAY");
            this.$store.commit("ndd/updateIdLopHoc", this.lophocId);
            this.$store.commit("ndd/updateCode", this.date);
            this.$store.commit("ndd/updateIdGiaoVien", this.$store.$auth.$state.user.id)
            
            // Control
            this.$store.dispatch("ndd/getLopHoc");
        }
    },
    mounted(){

    },
    props: ['date', 'lophocId']
}
</script>