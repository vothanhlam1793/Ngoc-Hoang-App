<template>
    <div class="row">

    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    mounted(){
        this.$store.commit("diemdanh/updateIdLopHoc", this.$route.params.lophoc);
        this.$store.dispatch("diemdanh/searchDiemDanh");
    }
}
</script>