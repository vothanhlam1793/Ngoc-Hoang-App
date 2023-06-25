<template>
    <div class="row">
        <div class="col">
            <NghiHoc 
                :idHocSinh="id"
            />
        </div>
    </div>
</template>
<script>
import NghiHoc from '~/components/KetSo/NghiHoc.vue';
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
        this.id = this.$route.query.id;
    },
    layout: "app"
}
</script>