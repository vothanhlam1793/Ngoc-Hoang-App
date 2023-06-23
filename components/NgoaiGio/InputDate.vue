<template>
    <input type="date" class="form-control" v-model="inp" @keyup="change()">
</template>
<script>
export default {
    data() {
        return {
            inp: ""
        }
    },
    methods: {
        change() {
            this.$emit('update-data', this.inp);
        }
    }
}
</script>