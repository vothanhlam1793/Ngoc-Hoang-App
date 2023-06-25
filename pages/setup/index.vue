<template>
    <div class="row">
        <div class="col">
            <h1>Trang cài đặt</h1>
            <div class="row">
                <div class="col-3">
                    <HocPhiYear></HocPhiYear>
                </div>
                <div class="col-4">
                    <CoSoVatChat />
                    <VeTre2 />
                    <VeTre />
                    <AnChieu />
                    <NghiLienTiep />
                </div>
                <div class="col-5">
                    <LichHocSetup />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import LichHocSetup from '~/components/LichHocSetup.vue'
// import LichHocSetup from '~/components/Filter/Table/Index.vue';
export default {
    components: {
        LichHocSetup
    },
    data: ()=> {
        return {
            defaultToDate: new Date().toISOString().slice(0, 10),
            month: 6,
            year: 2023
        }
    },
    methods: {
        updateToDate(date){
            console.log(date);
            this.month = parseInt(date.split("-")[1]);
            this.year = parseInt(date.split("-")[0]);
        }   
    },
    layout: "app"
}
</script>