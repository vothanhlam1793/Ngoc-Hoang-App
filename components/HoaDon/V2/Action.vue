<template>
    <div class="row h-100">
        <div class="col h-100">
            <button
                style="width: 100%; height: 100%;"
                class="btn btn-info"
                @click="createHoaDon"
                v-if="hocsinh.id && (sanphamChoose.length > 0)"
            >
            <b>THANH TOÁN</b>
            </button>
            <button
                style="width: 100%; height: 100%;"
                class="btn btn-secondary"
                @click="alertNotify()"
                v-else
            >
            <b>THANH TOÁN</b>
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
    data(){
        return {

        }
    },
    computed: {
        hocsinh(){
            return this.$store.state.hd.hocsinh;
        },
        sanphamChoose(){
            return this.$store.state.hd.sanphamChoose;
        }
    },
    methods: {
        createHoaDon(){
            this.$store.dispatch('hd/createHoaDon');
        },
        alertNotify(){
            alert("Hình như thiếu học sinh hay là chưa có sản phẩm thì phải?");
        }
    }
}
</script>