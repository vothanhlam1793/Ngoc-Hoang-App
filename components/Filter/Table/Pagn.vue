<template>
    <div class="row">
        <div class="col">
            <div class="d-flex align-items-center justify-content-between my-3">
                <button class="btn btn-outline-primary" :disabled="page === 1 || loading" @click="go(page - 1)">Trang trước</button>
                <span>Trang {{ page }}/{{ totalPages }} ({{ total }} học sinh)</span>
                <button class="btn btn-outline-primary" :disabled="page === totalPages || loading" @click="go(page + 1)">Trang sau</button>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    computed: {
        page(){ return this.$store.state.filter.hocsinh.page; },
        total(){ return this.$store.state.filter.hocsinh.total; },
        loading(){ return this.$store.state.filter.hocsinh.loading; },
        totalPages(){
            return Math.max(1, Math.ceil(this.total / this.$store.state.filter.hocsinh.pageSize));
        }
    },
    methods: {
        go(page){
            this.$store.dispatch("filter/hocsinh/getAllHocsinhs", page);
        }
    },
}
</script>
