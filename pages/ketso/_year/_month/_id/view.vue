<template>
    <div class="row">
        <div class="col">
            <div class="row">
                <div class="col text-right">
                    <button
                        class="btn btn-warning my-3"
                        @click="calculation()"
                    >
                        Tính toán lại
                    </button>

                    <a
                        class="btn btn-success"
                        :href="`/ketso/${$route.params.year}/${$route.params.month}/${$route.params.id}/show`"
                    >Gởi phụ huynh</a>
                </div>
            </div>
            <table class="table table-bordered">
                <thead>
                    <tr class="text-center">
                        <th style="width: 10%">Tên</th>
                        <th style="width: 5%">Tổng</th>
                        <th>Học phí</th> 
                        <th>CSVC</th>
                        <th>Camera</th>
                        <th>Hóa Đơn</th>
                        <th>Ngoài giờ</th>
                        <th>Ăn 4g45</th>
                        <th>Khác</th>
                        <th>Diễn giải</th>
                        <th>Ngày nghỉ</th>
                        <th>Tiền nghỉ</th>
                    </tr>
                </thead>
                <tbody>
                    <KetSoView
                        v-for="item in phieuketso.items"
                        :item="item"
                        :key="item.id"
                    >
                    </KetSoView>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    methods: {
        calculation(){
            if(confirm("Phiếu này đã được kết sổ, bạn có chắc là tính toán lại????")){

            } else {
                return;
            }
            var h= location.href.split("/");
            h.pop();
            location.href = h.join("/");
        }
    },
    computed: {
        phieuketso(){
            return this.$store.state.pks.phieuketso;
        },
    },
    mounted(){
        this.year = this.$route.params.year;
        this.month = this.$route.params.month;
        this.idLopHoc = this.$route.params.id;
        // this.createOrUpdatePhieuKetSo();
        this.$store.commit("pks/updateCode", `${this.year}_${this.month}`);
        this.$store.commit("pks/updateIdLopHoc", this.$route.params.id);
        
        this.$store.dispatch("pks/createOrUpdatePhieuKetSo");
    },
    layout: "app",
}
</script>