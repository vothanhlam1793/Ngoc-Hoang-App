<template>
    <div class="row">
        <div class="col">
            <h1>{{ lophoc.name }}</h1>
        </div>
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