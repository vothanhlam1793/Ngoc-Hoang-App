<template>
    <div class="row h-100">
        <div class="col h-100">
            <button
                style="width: 100%; height: 100%;"
                class="btn btn-info"
                @click="createKetSo"
            >
            <b>KẾT SỔ</b>
            </button>
        </div>
    </div>
</template>
<script>
import Index from '~/components/Filter/Table/Index.vue';
export default {
    components: {
        Index
    },
    methods: {
        createKetSo(){
            this.$store.dispatch("ksnh/createKetSo");
        }
    },
    data(){
        return {

        }
    }
}
</script>