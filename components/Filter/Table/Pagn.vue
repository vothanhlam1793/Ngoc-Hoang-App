<template>
    <div class="row">
        <div class="col">
            <ul class="pagination">
                <li class="page-item"><a class="page-link" href="#">Previous</a></li>
                <li class="page-item"><a class="page-link" href="#">1</a></li>
                <li class="page-item active"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item"><a class="page-link" href="#">Next</a></li>
            </ul> 
            <!-- <input 
                class="form-control"
                v-model="pageLength"
            >
            <button
                class="btn btn-danger"
                @click="$store.commit('filter/result/prevPage')"
            > < </button>
            <button
                class="btn btn-primary"
                @click="$store.commit('filter/result/setPageLength', pageLength)"
            >Cài đặt</button>
            <button
                class="btn btn-success"
                @click="$store.commit('filter/result/nextPage')"
            > > </button> -->
        </div>
    </div>
</template>
<script>

export default {
    data: () => {
        return {
            pageLength: 10
        }
    },
    created(){
        this.$store.commit("filter/result/setPageLength", this.pageLength);
    },
    components: {

    },
    props: []
}
</script>