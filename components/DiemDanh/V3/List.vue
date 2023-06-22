<template>
    <div class="">
        <DiemDanhV3Item
            v-for="hocsinh in lophoc.hocsinhs"
            :key="hocsinh.id"
            :hocsinh="hocsinh"
        />
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    computed: {
        lophoc(){
            return this.$store.state.diemdanh.v3.create.lophoc;
        }
    }
}
</script>