<template>
    <!-- <div
        class="row"
        v-if="invoice.id"
    > -->
    <div class="col">
        <div class="row">
            <div class="text-center col-4 pb-4 pl-5">
                <b-img
                    src="/student.png"
                    width="80"
                    alt="Center image"
                ></b-img>
                <p
                    style="font-size: 6px;"
                    class="mt-1"
                >NGOC HOANG KINDERGARTEN</p>
            </div>
            <div class="col-8 text-center">
                <h5>TRƯỜNG MẦM NON NGỌC HOÀNG</h5>
                <p><strong><i class="fa-solid fa-phone"></i> 0933.064.964 - 0978.087.992</strong></p>
            </div>
        </div>
        <div class="row text-right">
            <hr>
            <p><i></i></p>
        </div>
        <div class="row my-3">
            <div class="col text-center">
                <h1>PHIẾU THU</h1>
                <p>Mã PT: </p>
            </div>
        </div>
        <div class="row">
            <div class="col-1">

            </div>
            <div class="col-11">
                <p>Học sinh: 
                    <br>Điện thoại:
                </p>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <label><b>Thông tin đơn hàng</b></label>
                <b-table
                    :fields="table.fields"
                    :items="table.items"
                    small
                    striped
                    title="Thông tin đơn hàng"
                    bordered
                >
                </b-table>
            </div>
        </div>
    </div>
    <!-- </div> -->
</template>
<script>
export default {
    props: ['idHoaDon', 'sanphamChoose', 'stateShow', 'hocsinh'],
    watch: {
        stateShow(n, o) {
            // console.log("NE", n);
            this.createTable();
        }
    },
    data() {
        return {
            invoice: {},
            table: {
                fields: [{
                    key: "name",
                    label: "Tên"
                }, {
                    key: "amount",
                    label: "SL",
                    class: "text-center"
                }, {
                    key: "price",
                    label: "Đơn giá",
                    class: "text-right"
                }, {
                    key: "total",
                    label: "Tổng",
                    class: "text-right"
                }
                ],
                items: []
            }
        }
    },
    methods: {
        formatDateStringToVietnamese(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return `Ngày ${day} tháng ${month} năm ${year}`;
        },

        numberWithCommas(x) {
            if (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
                return 0;
            }
        },
        calcTotal() {
            var total = 0;

        },
        createTable() {
            // console.log("HER", this.sanphamChoose);
            var total = 0;
            for (var j = 0; j < this.sanphamChoose.length; j++) {
                let item = this.sanphamChoose[j];
                total += parseInt(item.amount) * parseInt(item.price);
                this.table.items.push({
                    name: item.name,
                    amount: item.amount,
                    price: this.numberWithCommas(item.price),
                    total: this.numberWithCommas(parseInt(item.amount) * parseInt(item.price)),
                    // _rowVariant: 'info', // Thêm thuộc tính _rowVariant để tô đậm hàng

                })
            }
            this.table.items.push({
                // Sử dụng một object đơn lẻ cho cell cuối cùng để span qua ba cột
                name: 'Tổng đơn hàng',
                //   _cellVariants: { name: 'danger', amount: 'd-none', price: 'd-none' }, // Ẩn hai cell cuối cùng
                total: this.numberWithCommas(total),
                _rowVariant: 'danger',
            })
            console.log(this.table);
        }
    },
    mounted() {
        // console.log("MOUNTED");
        // var that = this;
        // let client = this.$apolloProvider.defaultClient;
        // getHoaDonById(client, this.idHoaDon).then(data => {
        //     console.log(data);
        //     that.invoice = data;
            this.createTable();
        // }).catch(err => {
        //     console.log(err);
        // });
    }
}
</script>