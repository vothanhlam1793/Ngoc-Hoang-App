<template>
    <div class="fixed-height alert alert-light border border-danger">
        <div class="row h-100">
            <div class="col-8 h-100">
                <div style="height: 10%;" class="row">
                    <div class="h-100 col">
                        <FindProduct @update-data="productSelect" />
                    </div>
                </div>
                <div style="height: 65%;" class="row">
                    <div class="col auto-res-y">
                        <List />
                    </div>
                </div>
                <div class="row h-25">
                    <div class="col">
                        <Total />
                    </div>
                </div>
            </div>
            <div class="col-4 h-100 border border-secondary p-4 rounded">
                <div style="height: 35%;" class="row p-3">
                    <div class="col auto-res-y">
                        <Buyer />
                    </div>
                </div>
                <div style="height: 40%;" class="row">
                    <div class="col">
                        <!-- <Info /> -->
                    </div>
                </div>
                <div style="height: 25%;" class="row">
                    <div class="col auto-res-y">
                        <Action />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
/* CSS để thiết lập chiều cao cố định cho div */
.fixed-height {
    height: 85vh;
    /* 100% chiều cao của viewport */
}

.auto-res-y {
    height: 100%;
    overflow-y: auto;
}
</style>
<script>
import FindProduct from '~/components/HoaDon/V2/FindProduct.vue';
import List from '~/components/HoaDon/V2/TableProduct/List.vue';
import Total from '~/components/HoaDon/V2/TableProduct/Total.vue';
import Saler from '~/components/HoaDon/V2/Saler.vue';
import Buyer from '~/components/HoaDon/V2/Buyer.vue';
import Info from '~/components/HoaDon/V2/Info.vue';
import Action from '~/components/HoaDon/V2/Action.vue';
export default {
    components: {
        FindProduct,
        List,
        Total,
        Saler,
        Buyer,
        Action,
        Info
    },
    data() {
        return {
            type: "NORMAL"
        }
    },
    watch: {
        hoadon: function () {
            alert("Đã tạo hoá đơn mới thành công");
            location.reload();
        }
    },
    computed: {
        hoadon() {
            return this.$store.state.hd.hoadon;
        }
    },
    methods: {
        // Sản phẩm được chọn bởi tìm kiếm sản phẩm
        productSelect(product) {
            // console.log("FORM", product);
            this.$store.commit('hd/addSanPhamChoose', product)
        }
    },
    mounted() {
        this.$store.commit("hd/updateType", this.type);
        this.$store.dispatch("hocphi/getInfoHocPhi");
    }
}
</script>