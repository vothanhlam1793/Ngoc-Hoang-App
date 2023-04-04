<template>
    <div class="col">
        <h1>{{ lophoc.name }}</h1>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Ngày</th>
                    <th>Tình trạng</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="date in dates"
                >
                    <td>{{ date }}/{{ $route.params.month }}</td>
                    <td>{{ checkPhieuDiemDanhTrongThang(date).message }}</td>
                    <td>
                        <div class="row">
                            <div class="col">
                                <a
                                    v-if="checkPhieuDiemDanhTrongThang(date).diemdanh"
                                    class="btn btn-success"
                                    :href="`/diemdanh/${$route.params.id}/${$route.params.year}/${$route.params.month}/${date}`"
                                >
                                Xem</a>
                                <a 
                                    v-else
                                    class="btn btn-primary"
                                    :href="`/diemdanh/${$route.params.id}/${$route.params.year}/${$route.params.month}/${date}`"
                                >
                                Điểm danh</a>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
export default {
    data(){
        return {
            status: {},
            state: "CREATE"
        }
    },
    methods: {
        checkPhieuDiemDanhTrongThang(date){
            var ret = {}
            var code =  this.$route.params.year + "_" + this.$route.params.month +  "_" + date;
                this.phieudiemdanhs.forEach(function(e){
                    if(e.code.indexOf(code) != -1){
                        ret.message = "Đã điểm danh";
                        ret.diemdanh = true;
                    }
                })
                if(ret.message == undefined){
                    ret.message = "Chưa điểm danh";
                    ret.diemdanh = false;
                }
            return ret;
        }
    },
    watch: {
        lophoc: function(newValue, oldValue){

        }
    },
    computed: {
        lophoc(){
            return this.$store.state.lophoc.lophoc;
        },
        dates(){
            return this.$store.state.diemdanh.dateForm;
        },
        phieudiemdanhs(){
            return this.$store.state.diemdanh.searchPhieuDiemDanh;
        }
    },
    mounted(){
        console.log("MONTH: ", this.$route.params);
        this.$store.dispatch("lophoc/getLopHoc", this.$route.params.id);
        this.$store.commit("diemdanh/updateDateForm", {
            year: this.$route.params.year, 
            month: this.$route.params.month
        });
        this.$store.dispatch("diemdanh/searchDiemDanh", {
            code: this.$route.params.year + "_" + this.$route.params.month,
            id: this.$route.params.id
        })
    }
}
</script>