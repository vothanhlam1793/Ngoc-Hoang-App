<template>
    <div class="">
        <SearchStudentItemResult
            v-for="hocsinh,index in hocsinhs"
            :key="index"
            :hocsinh="hocsinh"
        >
        </SearchStudentItemResult>
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