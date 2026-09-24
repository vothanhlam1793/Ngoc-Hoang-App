<template>
  <div class="container-fluid px-0">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h4 class="font-weight-bold mb-1">
          <i class="fas fa-cash-register text-primary mr-2"></i> Bán Hàng & Hoá Đơn Học Phí
        </h4>
        <p class="text-muted small mb-0">Lập hoá đơn thu phí, bán đồng phục, đồ dùng học tập cho học sinh</p>
      </div>
      <div>
        <nuxt-link to="/phieuthu" class="btn btn-outline-info rounded-pill px-3">
          <i class="fas fa-receipt mr-1"></i> Sổ thu chi
        </nuxt-link>
      </div>
    </div>

    <div class="fixed-height card shadow-sm border-0 bg-light p-3">
        <div class="row h-100">
            <div class="col-8 h-100 pr-2">
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
            <div class="col-4 h-100 bg-white border rounded-lg p-3 shadow-sm d-flex flex-column justify-content-between">
                <div style="height: 40%;" class="row">
                    <div class="col auto-res-y">
                        <Buyer />
                    </div>
                </div>
                <div style="height: 30%;" class="row">
                    <div class="col">
                        <!-- <Info /> -->
                    </div>
                </div>
                <div style="height: 30%;" class="row">
                    <div class="col auto-res-y">
                        <Action />
                    </div>
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