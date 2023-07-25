<template>
    <div
        class="row"
        v-if="invoice.id"
    >
        <div class="col">
            <div class="row my-2">
                <div class="col-2">

                </div>
                <div class="col-2 h-100">
                    <b-img
                        src="/student.png"
                        width="100"
                        alt="Center image"
                    ></b-img>
                </div>
                <div class="col-8 d-flex flex-column justify-content-center align-items-center">
                    <h4>TRƯỜNG MẦM NON NGỌC HOÀNG</h4>
                    <p>Trảng Dài - Biên Hoà</p>
                    <p><b>0933.064.964 - 0978.087.992</b></p>
                </div>
            </div>
            <div class="row text-right">
                <hr>
                <p><i>{{ formatDateStringToVietnamese(invoice.createdAt) }}</i></p>
            </div>
            <div class="row my-3">
                <div class="col text-center">
                    <h1>HOÁ ĐƠN</h1>
                    <p>Mã HĐ: {{ this.invoice.code }}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-1">

                </div>
                <div class="col-11">
                    <p>Học sinh: {{ invoice.student.name }}
                        <br>Điện thoại: {{ invoice.parent.phone[0].number }}
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
    </div>
</template>
<script>

import { getHoaDonById } from '~/plugins/invoice.js'
export default {
    props: ['idHoaDon'],
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
        createTable() {
            console.log(this.invoice);
            for (var j = 0; j < this.invoice.items.length; j++) {
                let item = this.invoice.items[j];
                this.table.items.push({
                    name: item.sanpham.name,
                    amount: item.amount,
                    price: this.numberWithCommas(item.price),
                    total: this.numberWithCommas(item.total),
                    // _rowVariant: 'info', // Thêm thuộc tính _rowVariant để tô đậm hàng

                })
            }
            this.table.items.push({
                // Sử dụng một object đơn lẻ cho cell cuối cùng để span qua ba cột
                name: 'Tổng đơn hàng',
                //   _cellVariants: { name: 'danger', amount: 'd-none', price: 'd-none' }, // Ẩn hai cell cuối cùng
                total: this.numberWithCommas(this.invoice.total),
                  _rowVariant: 'danger',
            })
        }
    },
    mounted() {
        var that = this;
        let client = this.$apolloProvider.defaultClient;
        getHoaDonById(client, this.idHoaDon).then(data => {
            console.log(data);
            that.invoice = data;
            that.createTable();
        }).catch(err => {
            console.log(err);
        });
    }
}
</script>