<template>
    <div class="row h-100">
        <div class="col h-100 text-left p-2 pl-5">
            <button class="btn btn-primary" data-toggle="modal" data-target="#myModal">Thêm sản phẩm</button>
            <div class="modal" id="myModal">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">

                        <!-- Modal Header -->
                        <div class="modal-header">
                            <h4 class="modal-title">Thêm sản phẩm</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>

                        <!-- Modal body -->
                        <div class="modal-body">
                            <Search 
                                :sanphams="sanphams"
                                @update-data="sanphamchon"
                            />
                        </div>

                        <!-- Modal footer -->
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Đóng</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Search from '~/components/HoaDon/V2/Search.vue';
export default {
    components: {
        Search
    },
    data() {
        return {

        }
    },
    methods: {
        sanphamchon(sanpham){
            // console.log(sanpham);
            this.$emit("update-data", sanpham);
        }
    },
    computed: {
        sanphams() {
            return this.$store.state.hd.sanphams;
        }
    },
    created() {
        this.$store.dispatch("hd/getAllSanPham");
    }
}
</script>