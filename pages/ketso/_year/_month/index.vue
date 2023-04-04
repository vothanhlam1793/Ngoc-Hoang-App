<template>
    <div class="row">
        <div class="col">
            <h1>Kết sổ tháng {{ month }}/ {{ year }}</h1>
            <div class="row my-3">
                <div class="col">
                    <select 
                        class="form-control"
                        v-model="year"
                        @change="changeTime()"
                        >
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                    </select>
                </div>
                <div class="col">
                    <select 
                        class="form-control"
                        v-model="month"
                        @change="changeTime()"
                        >
                        <option value="01">Tháng 1</option>
                        <option value="02">Tháng 2</option>
                        <option value="03">Tháng 3</option>
                        <option value="04">Tháng 4</option>
                        <option value="05">Tháng 5</option>
                        <option value="06">Tháng 6</option>
                        <option value="07">Tháng 7</option>
                        <option value="08">Tháng 8</option>
                        <option value="09">Tháng 9</option>
                        <option value="10">Tháng 10</option>
                        <option value="11">Tháng 11</option>
                        <option value="12">Tháng 12</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Tên lớp</th>
                                <th>Đã kết sổ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="lophoc in lophocs"
                            >
                                <td>
                                    <a 
                                        :href="`/ketso/${$route.params.year}/${$route.params.month}/${lophoc.id}`"
                                    >{{ lophoc.name }}</a></td>
                                <td>{{ getKetSo(lophoc).message }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            year: "",
            month: ""
        }
    },
    methods: {
        changeTime(){
            location.href = `/ketso/${this.year}/${this.month}`;
        },
        getKetSo(lh){
            var ret = {};
            this.phieuketsos.forEach(function(pks){
                if(pks.lophoc.id == lh.id){
                    ret.message = "Đã kết sổ"
                }
            })
            if(ret.message == undefined){
                ret.message = "Chưa kết sổ";
            }
            return ret;
        }
    },
    computed: {
        lophocs(){
            return this.$store.state.lophoc.lophocs;
        },
        phieuketsos(){
            return this.$store.state.ketso.searchPhieuKetSos;
        }

    },
    mounted(){
        this.year = this.$route.params.year;
        this.month = this.$route.params.month;
        this.$store.dispatch("lophoc/getAllLopHoc");
        this.$store.dispatch("ketso/searchKetSo", {
            code: `${this.$route.params.year}_${this.$route.params.month}`        
        });
    },
    layout: "app"
}
</script>