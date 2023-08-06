<template>
    <div class="row">
        <div class="col">
            <div class="row">
                <div class="col">
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
                        Tạo sản phẩm
                    </button>
                    <div class="modal" id="myModal">
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content">

                            <!-- Modal Header -->
                            <div class="modal-header">
                                <h4 class="modal-title">Tạo sản phẩm mới</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>

                            <!-- Modal body -->
                            <div class="modal-body">
                                <SanPhamCreate></SanPhamCreate>
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
            <SanPhamShowTable></SanPhamShowTable>
        </div>
    </div>
</template>
<script>
    export default {
        layout: "app",
        mounted(){
            this.$store.dispatch("sanpham/getSanPham");
        }
    }
</script>