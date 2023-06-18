<template>
    <div class="">
        <V2DiemDanhItemStudentList
            v-for="hocsinh,index in hocsinhs"
            :hocsinh="hocsinh"
            :key="index"
        ></V2DiemDanhItemStudentList>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    props: ['hocsinhs']
}
</script>