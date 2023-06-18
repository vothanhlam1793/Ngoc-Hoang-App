<template>
    <div class="col">
        <h1>ĐI HỌC: {{ lophoc.name }}</h1>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Ngày</th>
                    <th>Tình trạng</th>
                    <th>Hanh dong</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="date in dates"
                    :class="checkDiemDanhColor(date)"
                    >
                    <td>{{ date }}/{{ $route.params.month }}</td>
                    <td >
                        <div>
                            <p
                            v-if="checkDiemDanh(date)"
                            >Đã điểm danh</p>
                            <p v-else>Chưa điểm danh</p>
                        </div></td>
                    <td>
                        <div>
                            <a 
                            v-if="checkDiemDanh(date)"
                            :href="getHref(date, 'edit')"
                            class="btn btn-warning"
                            >
                                Sửa
                            </a>
                            <a
                            v-else
                            :href="getHref(date)"
                            class="btn btn-primary"
                            >
                                Tạo mới
                            </a>
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
            year: "",
            month: "",
            idLopHoc: ""
        }
    },
    methods: {
        checkDiemDanhColor(date){
            if(this.checkDiemDanh(date)){
                return ""
            } else {
                return "table-warning"
            }
        },
        getHref(date, path){
            var ret = this.$route.fullPath.split("/");
            if(path){
                ret.splice(ret.length - 1, 0, date, path);
            } else {
                ret.splice(ret.length - 1, 0, date);
            }
            return ret.join("/");
        },
        checkDiemDanh(date){
            var ret = false;
            var that = this;
            this.phieudiemdanhs.forEach(function(diemdanh){
                if(diemdanh.code ==  `${that.year}_${that.month}_${date}`){
                    ret = true;
                }
            });
            return ret;
        }
    },
    watch: {
        stateLopHoc: function(nS, oS){
            if(nS == "READY"){
                this.$store.commit("ndd/mergeDiHocToLopHoc");
            }
        },
        phieudiemdanhs: {
            immediate: true,
            handler(nV, oV){

            }
        }
    },
    computed: {
        dates(){
            return this.$store.state.diemdanh.dateForm;
        },
        lophoc(){
            return this.$store.state.ndd.lophoc;
        },
        stateLopHoc(){
            return this.$store.state.ndd.stateLopHoc;
        },
        phieudiemdanhs(){
            return this.$store.state.ndd.phieudiemdanhs;
        }
    },
    created(){
        if(typeof window !== undefined){
            this.year = this.$route.params.year;
            this.month = this.$route.params.month;
            this.idLopHoc = this.$route.params.id;

            this.$store.commit("diemdanh/updateDateForm", {
                year: this.year, 
                month: this.month
            });
            this.$store.commit("ndd/updateType", "DIHOCHANGNGAY");
            this.$store.commit("ndd/updateIdLopHoc", this.$route.params.id);
            this.$store.commit("ndd/updateIdGiaoVien", this.$store.$auth.$state.user.id)

            // Control
            this.$store.dispatch("ndd/getLopHoc");
            this.$store.dispatch("ndd/getAllPhieuDiemDanhOnMonth", {
                year: this.year,
                month: this.month
            });
        }
    },
    mounted(){


    },
    layout: "diemdanh"
}
</script>