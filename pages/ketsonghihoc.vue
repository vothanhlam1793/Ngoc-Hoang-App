<template>
    <div class="row">
        <div class="col">
            <NghiHoc/>
        </div>
    </div>
</template>
<script>
import NghiHoc from '~/components/KetSo/NghiHoc/Form.vue';
export default {
    components: {
        NghiHoc
    },
    data(){
        return {
            id: ""
        }
    },
    created(){

    },
    layout: "app"
}
</script>