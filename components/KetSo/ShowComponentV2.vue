<template>
    <div class="row p-2">
        <div class="col-2">

        </div>
        <div class="col-8 border border-primary rounded p-2" v-if="item.id">
            <div class="row">
                <div class="col-4">
                    <h2>LOGO</h2>
                </div>
                <div class="col-8 text-center">
                    <h5>TRƯỜNG MẦM NON NGỌC HOÀNG</h5>
                    <p><strong>0933.064.964 - 0978.087.992</strong></p>
                </div>
            </div>
            <div class="row">
                <div class="col text-center text-danger">
                    <h4>PHIẾU THU HỌC PHÍ THÁNG {{ month }}/{{ year }}</h4>
                </div>
            </div>
            <div class="row mt-1">
                <div class="col-1">

                </div>
                <div class="col-11">
                    <p>Họ và tên học sinh: <strong>{{ item.hocsinh.name }}</strong>
                        <br>Lớp: <strong>{{ item.lophoc.name }}</strong>
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="col-1"></div>
                <div class="col-11">
                    <table class="table-bordered">
                        <thead class="text-center text-danger">
                            <tr>
                                <th style="width: 50%;">Các khoản thu</th>
                                <th style="width: 25%">Chi tiết thu</th>
                                <th style="width: 25%">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="p-1">
                                <td class="tb-col-1 p-1">Cơ sở vật chất ban đầu</td>
                                <td class="tb-col-2 p-1 text-right">{{ numberWithCommas(item.data.csvc) }}</td>
                                <td class="tb-col-3 p-1"></td>
                            </tr>
                            <tr>
                                <td class="tb-col-1 p-1">Camera</td>
                                <td class="tb-col-2 p-1 text-right">{{ numberWithCommas(item.data.camera) }}</td>
                                <td class="tb-col-3 p-1"></td>
                            </tr>
                            <tr>
                                <td class="tb-col-1 p-1">Học phí</td>
                                <td class="tb-col-2 p-1 text-right">{{ numberWithCommas(item.data.hocphi) }}</td>
                                <td class="tb-col-3 p-1"></td>
                            </tr>
                            <tr>
                                <td class="tb-col-1 p-1">Phí giữ trẻ ngoài giờ</td>
                                <td class="tb-col-2 p-1 text-right">{{ numberWithCommas(item.data.ngoaigio) }}</td>
                                <td class="tb-col-3 p-1"></td>
                            </tr>
                            <tr>
                                <td class="tb-col-1 p-1">Phí trẻ ăn chiều 16g45</td>
                                <td class="tb-col-2 p-1 text-right">{{ numberWithCommas(item.data.an545) }}</td>
                                <td class="tb-col-3 p-1"></td>
                            </tr>
                            <tr>
                                <td class="tb-col-1 p-1">Phí phát sinh</td>
                                <td class="tb-col-2 p-1 text-right">{{ numberWithCommas(item.data.khac) }}</td>
                                <td class="tb-col-3 p-1">{{ item.data.note }}</td>
                            </tr>
                            <tr class="table-primary">
                                <td class="tb-col-1 p-1"><strong>TỔNG CỘNG</strong></td>
                                <td class="tb-col-2 p-1 text-right"><strong>{{ numberWithCommas(getTotal()) }}</strong></td>
                                <td class="tb-col-3 p-1 "></td>
                            </tr>
                            <tr>
                                <td class="tb-col-1 p-1">Khoản trừ nghỉ học liên tiếp</td>
                                <td class="tb-col-2 p-1 text-right">{{ numberWithCommas(item.data.thanhtiennghi) }}</td>
                                <td class="tb-col-3 p-1" v-if="item.data.thanhtiennghi > 0">{{ item.data.ngaynghi }} ngày</td>
                                <td class="tb-col-3 p-1" v-else></td>
                            </tr>
                            <tr>
                                <td class="tb-col-1 p-1">Khoản trừ khác</td>
                                <td class="tb-col-2 p-1 text-right">0</td>
                                <td></td>
                            </tr>
                            <tr class="table-primary">
                                <td class="tb-col-1 p-1"><strong>TỔNG TRỪ</strong></td>
                                <td class="tb-col-2 p-1 text-right"><strong>{{ numberWithCommas(getSub()) }}</strong></td>
                                <td class="tb-col-3 p-1"></td>
                            </tr>
                            <tr class="text-danger">
                                <td class="tb-col-1 p-1 text-center"><strong>THỰC THU</strong></td>
                                <td class="tb-col-2 p-1 text-right"><strong>{{ numberWithCommas(item.data.total) }}</strong></td>
                                <td class="tb-col-3 p-1"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="col-2">

        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            year: "",
            month: "",
            date: ""
        }
    },
    methods: {
        numberWithCommas(x) {
            if(x == undefined ){
                return 0;
            } else {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }
        },
        getTotal() {
            var ret = 0;
            ret = ret
                + this.item.data.csvc
                + this.item.data.camera
                + this.item.data.totalHoaDon
                + this.item.data.hocphi
                + this.item.data.ngoaigio
                + this.item.data.an545
                + this.item.data.khac;
            return ret;
        },
        getSub() {
            return this.item.data.thanhtiennghi;
        }
    },
    created() {
        console.log(this.item);
        if (typeof window !== undefined) {
            this.year = this.$route.params.year;
            this.month = this.$route.params.month;
            this.idLopHoc = this.$route.params.id;
            this.date = new Date(this.phieuketso.createdAt);
        }
    },
    props: ['item', 'phieuketso']
}
</script>