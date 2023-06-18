<template>
    <div class="form-group">
        <input 
            class="form-control"
            placeholder="Nhập tên"
            v-model="inpSearch"
            v-on:keyup="changed()"
        >
    </div>
</template>
<script>
export default {
    data(){
        return {
            inpSearch: ""
        }
    },
    methods: {
        changed(){
            this.$store.commit("search/updateInputSearch", this.inpSearch);
        }
    }
}
</script>