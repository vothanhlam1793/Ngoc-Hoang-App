<template>
    <div class="fixed-height alert alert-light border border-danger">
        <div class="row h-100">
            <div class="col h-100">
                <div style="height: 15%;" class="row">
                    <div class="h-100 col">
                        <Find 
                            @update-data="updateHocSinh"
                        />
                    </div>
                </div>
                <div style="height: 75%;" class="row">
                    <div class="col auto-res-y">
                        <List
                            :month="month"
                            :year="year"
                        />
                    </div>
                </div>
                <div style="height: 10%;" class="row">
                    <div class="col auto-res-y">
                        <Save />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
    /* CSS để thiết lập chiều cao cố định cho div */
    .fixed-height {
      height: 85vh; /* 100% chiều cao của viewport */
    }
    .auto-res-y {
        height: 100%;
        overflow-y: auto;
    }
</style>
<script>

import Save from '~/components/KetSo/NghiHoc/Save.vue';
import Find from '~/components/KetSo/NghiHoc/Find.vue';
import List from '~/components/KetSo/NghiHoc/Table/List.vue';
export default {
    components: {
        Save,
        List,
        Find
    },
    data(){
        return {
            month: (new Date().toISOString().slice(0, 10)).split("-")[1],
            year: (new Date().toISOString().slice(0, 10)).split("-")[0]
        }
    },
    watch: {
        success(n,o){
            if(n){
                alert("Đã tạo thành công");
                location.reload();
            }
        }
    },
    computed: {
        success(){
            return this.$store.state.ksnh.success;
        }
    },
    methods: {
        updateHocSinh(hocsinh){

        }
    },
    mounted(){

    }
}
</script>