<template>
    <div class="col">
        <div class="d-flex justify-content-between">
            <div>
                <h1>ĐI HỌC: {{ lophoc.name }}</h1>
            </div>
            <div>
                <a 
                    class="btn btn-info"
                :href="`/xemdiemdanh?type=${type}&idLopHoc=${idLopHoc}&year=${year}&month=${month}`">Xem điểm danh tháng</a>
            </div>
        </div>
        <table class="table table-bordered">
            <thead>
                <tr class="text-center">
                    <th>Ngày</th>
                    <th>Tình trạng</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="date in dates" :class="checkDiemDanhColor(date)">
                    <td class="text-center">{{ date }}/{{ $route.params.month }}<br>({{ timThuNgay(`${date}/${$route.params.month }/${$route.params.year}`) }})</td>
                    <td>
                        <div>
                            <p v-if="checkDiemDanh(date)">Đã điểm danh</p>
                            <p v-else>Chưa điểm danh</p>
                        </div>
                    </td>
                    <td class="text-center">
                        <div>
                            <a v-if="checkDiemDanh(date)" :href="getHref(date, 'edit')" class="btn btn-warning">
                                Sửa
                            </a>
                            <a v-else :href="getHref(date)" class="btn btn-primary">
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
    data() {
        return {
            year: "",
            month: "",
            idLopHoc: "",
            type: "DIHOCHANGNGAY"
        }
    },
    methods: {
        timThuNgay(dateString) {
            const parts = dateString.split('/');
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            const date = new Date(year, month, day);
            const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
            const thu = days[date.getDay()];
            return thu;
        },
        checkDiemDanhColor(date) {
            if (this.checkDiemDanh(date)) {
                return ""
            } else {
                return "table-warning"
            }
        },
        getHref(date, path) {
            var ret = this.$route.fullPath.split("/");
            if (path) {
                ret.splice(ret.length - 1, 0, date, path);
            } else {
                ret.splice(ret.length - 1, 0, date);
            }
            return ret.join("/");
        },
        checkDiemDanh(date) {
            var ret = false;
            var that = this;
            this.phieudiemdanhs.forEach(function (diemdanh) {
                if (diemdanh.code == `${that.year}_${that.month}_${date}`) {
                    ret = true;
                }
            });
            return ret;
        }
    },
    watch: {
        stateLopHoc: function (nS, oS) {
            if (nS == "READY") {
                this.$store.commit("ndd/mergeDiHocToLopHoc");
            }
        },
        phieudiemdanhs: {
            immediate: true,
            handler(nV, oV) {

            }
        }
    },
    computed: {
        dates() {
            return this.$store.state.diemdanh.dateForm;
        },
        lophoc() {
            return this.$store.state.ndd.lophoc;
        },
        stateLopHoc() {
            return this.$store.state.ndd.stateLopHoc;
        },
        phieudiemdanhs() {
            return this.$store.state.ndd.phieudiemdanhs;
        }
    },
    created() {
        if (typeof window !== undefined) {
            this.year = this.$route.params.year;
            this.month = this.$route.params.month;
            this.idLopHoc = this.$route.params.id;

            this.$store.commit("diemdanh/updateDateForm", {
                year: this.year,
                month: this.month
            });
            this.$store.commit("ndd/updateType", this.type);
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
    mounted() {


    },
    layout: "diemdanh"
}
</script>