<template>
    <div class="row">
        <div class="col">
            <div class="row">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addSanPham" @click="choseSanPham()">
                    Thêm sản phẩm
                </button>
                <div class="modal" id="addSanPham">
                    <div class="modal-dialog">
                        <div class="modal-content">

                        <!-- Modal Header -->
                        <div class="modal-header">
                            <h4 class="modal-title">Thêm sản phẩm</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>

                        <!-- Modal body -->
                        <div class="modal-body">
                            <HoaDonChoose />
                        </div>

                        <!-- Modal footer -->
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <ul class="list-group">
                        <li class="list-group-item"
                            v-for="item in sanPhamChoose"
                        >   
                            <p>{{ item.sanpham.name }}</p>
                            <input v-model="prices[item.sanpham.id]" @change="$forceUpdate()">
                            <input v-model="items[item.sanpham.id]" @change="$forceUpdate()">
                            <p >{{ items[item.sanpham.id] * prices[item.sanpham.id] }}</p>
                        </li>
                    </ul> 
                </div>
            </div>
            <div class="row">
                <p>{{ getTotal() }}</p>
            </div>
            <div class="row">
                <div class="col">
                    <button class="btn btn-success" @click="createHoaDon()">Tạo hoá đơn</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            items: {},
            prices: {}
        }
    },
    watch: {
        stateChoose: function(newState, oldState){
            if(newState == "DONE"){
                $("#addSanPham").modal("hide");    
                this.items[this.$store.state.sanpham.sanPhamChoose.id] = 1;
                this.prices[this.$store.state.sanpham.sanPhamChoose.id] = this.$store.state.sanpham.sanPhamChoose.price;
                this.$store.commit("hoadon/addSanPhamChoice", this.$store.state.sanpham.sanPhamChoose);
            }
        }
    },
    computed: {
        sanPhamChoose(){
            return this.$store.state.hoadon.sanPhamChoice;
        },
        stateChoose(){
            return this.$store.state.sanpham.stateChoose;
        }
    },
    methods: {
        choseSanPham(){
            this.$store.commit("sanpham/updateStateChoose", "IDLE");
        },
        getTotal(){
            var total = 0;
            var that = this;
            this.sanPhamChoose.forEach(function(item){
                total += that.items[item.sanpham.id]*that.prices[item.sanpham.id];
            });
            return total;
        },
        createHoaDon(){
            this.$store.commit("hoadon/updateDataPreCreateHoaDon", {
                items: this.items,
                prices: this.prices
            });
            this.$store.dispatch("hoadon/create");
        }
    },  
    mounted(){
        this.$store.dispatch("sanpham/getSanPham");

    }

}
</script>