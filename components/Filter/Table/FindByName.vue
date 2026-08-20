<template>
    <div class="row">
        <div class="col">
            <input 
                class="form-control"
                v-model="findByName"
                placeholder="Nhập tên học sinh"
                @input="search"
            />
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            findByName: "",
            searchTimer: null
        }
    },
    methods: {
        search(){
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => {
                this.$store.commit('filter/hocsinh/updateSearchName', this.findByName);
                this.$store.dispatch('filter/hocsinh/applyFilters');
            }, 300);
        }
    },
    beforeDestroy(){
        clearTimeout(this.searchTimer);
    }
}
</script>
