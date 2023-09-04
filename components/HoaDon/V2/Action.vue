<template>
    <div class="row h-100">
        <div class="col h-100">
            <button
                style="width: 100%; height: 40%;"
                class="btn btn-info"
                @click="createHoaDon"
                v-if="hocsinh.id && (sanphamChoose.length > 0)"
            >
            <b>THANH TOÁN</b>
            </button>
            <button
                style="width: 100%; height: 40%;"
                class="btn btn-secondary"
                @click="alertNotify()"
                v-else
            >
            <b>THANH TOÁN</b>
            </button>
            <button
                style="width: 100%; height: 40%;"
                class="btn btn-info my-1"
                @click="viewHoaDon"
            >
            <b>Xem đơn nháp</b>
            </button>
            <b-modal id="md-hoadon" size="lg" ok-only>
                <ShowHoaDon 
                    :sanphamChoose="sanphamChoose"
                    :stateShow="stateShow"
                    :hocsinh="hocsinh"
                />
            </b-modal>
        </div>
    </div>
</template>
<script>
import Index from '~/components/Filter/Table/Index.vue';
import ShowHoaDon from '~/components/HoaDon/ShowDraft.vue'
export default {
    components: {
        Index, ShowHoaDon
    },
    data(){
        return {
            stateShow: 0
        }
    },
    computed: {
        hocsinh(){
            return this.$store.state.hd.hocsinh;
        },
        sanphamChoose(){
            return this.$store.state.hd.sanphamChoose;
        },
        invoice(){
            return this.$store.state.hd.hoadon;
        }
    },
    methods: {
        createHoaDon(){
            this.$store.dispatch('hd/createHoaDon');
        },
        alertNotify(){
            alert("Hình như thiếu học sinh hay là chưa có sản phẩm thì phải?");
        },
        viewHoaDon(){
            console.log(this.invoice);
            console.log(this.sanphamChoose, this.stateShow);
            this.stateShow += 1;
            this.$bvModal.show('md-hoadon');
        }
    }
}
</script>