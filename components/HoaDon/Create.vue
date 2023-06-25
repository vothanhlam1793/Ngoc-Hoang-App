<template>
    <div class="row">
        <div class="col">
            <div class="row my-3">
                <div class="col">
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
                                    <HoaDonSearch></HoaDonSearch>
                                </div>

                                <!-- Modal footer -->
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="hocsinh.parent.id == undefined">
                <p>Chọn học sinh cần mua đồ</p>
            </div>
            <div class="row my-2" v-if="hocsinh.parent.id">
                <div class="col text-right">
                    <div class="form-check-inline">
                        <label class="form-check-label">
                            <input type="radio" class="form-check-input" name="optradio" value="THANHTOAN"
                                v-model="type">Thanh toán
                        </label>
                    </div>
                    <div class="form-check-inline">
                        <label class="form-check-label">
                            <input type="radio" class="form-check-input" name="optradio" value="KETSO" v-model="type">Kết sổ
                            tháng
                        </label>
                    </div>
                </div>
                <div class="col text-right">
                    <button class="btn btn-success" @click="$store.dispatch('hd/createHoaDon')">Tạo hóa đơn</button>
                </div>
            </div>
            <div v-if="hocsinh.parent.id" class="row my-2">
                <div class="col">
                    <button class="btn btn-primary" data-toggle="modal" data-target="#myModal">Thêm sản phẩm</button>
                    <div v-if="sanphams.length == 0">
                        <p>Chọn "Thêm sản phẩm" để thêm sản phẩm</p>
                    </div>
                    <div v-else>
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <td></td>
                                    <th>Tên</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                <HoaDonItem v-for="sanpham in sanphams" :sanpham="sanpham" :key="sanpham.id">

                                </HoaDonItem>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{{ total }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            type: "KETSO"
        }
    },
    watch: {
        type: function (n, o) {
            this.$store.commit("hd/updateType", this.type);
        }
    },
    computed: {
        sanphams() {
            return this.$store.state.hd.sanphamChoose;
        },
        total() {
            return this.$store.state.hd.total;
        },
        hocsinh() {
            if (this.$store.state.hd.hocsinh.parent) {
                return this.$store.state.hd.hocsinh;
            } else {
                this.$store.state.hd.hocsinh.parent = {};
                return this.$store.state.hd.hocsinh;
            }
        }
    },
    methods: {

    },
    mounted() {


    }

}
</script>