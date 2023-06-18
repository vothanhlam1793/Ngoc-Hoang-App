<template>
    <div class="">
        <input
            class="form-control"
            v-model="inpDate"
            type="date"
            @change="$store.dispatch(inpDateDispatch, inpDate);"
        >
    </div>
</template>
<script>
export default {
    data(){
        return {
            inpDate: ""
        }
    },
    props: ['inpDateDispatch']
}
</script>