<template>
    <div class="fixed-height alert alert-light border border-danger">
        <div class="row h-100">
            <div class="col-9 h-100">
                <div style="height: 20%;" class="row">
                    <div class="h-100 col">
                        <Find 
                            @update-data="updateHocSinh"
                        />
                    </div>
                </div>
                <div style="height: 80%;" class="row">
                    <div class="col auto-res-y">
                        <List/>
                    </div>
                </div>
            </div>
            <div class="col-3 h-100 border border-secondary p-4 rounded">
                <div style="height: 35%;" class="row p-3">
                    <div class="col auto-res-y">

                    </div>
                </div>
                <div style="height: 40%;" class="row">
                    <div class="col">

                    </div>
                </div>
                <div style="height: 25%;" class="row">
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
        }
    },
    watch: {

    },
    computed: {

    },
    methods: {
        updateHocSinh(hocsinh){

        }
    },
    mounted(){

    }
}
</script>