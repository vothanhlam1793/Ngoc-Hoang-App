<template>
    <input class="form-control" v-model="inp" @keyup="change()" placeholder="Nhập tên giáo viên">
</template>
<script>
export default {
    props: {
        defaultValue: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            inp: ""
        }
    },
    methods: {
        change() {
            this.$emit('update-data', this.inp);
        }
    },
    created(){
        this.inp = this.defaultValue;
    }
}
</script>