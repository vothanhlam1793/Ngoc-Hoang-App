<template>
    <div class="row p-2">
        <div class="col-2">

        </div>
        <div class="col-8 border border-primary rounded p-2" v-if="item.id">
            <div class="row">
                <div class="text-center col-4 pb-4 pl-5">
                    <b-img
                        src="/student.png"
                        width="80"
                        alt="Center image"
                    ></b-img>
                    <p style="font-size: 6px;" class="mt-1">NGOC HOANG KINDERGARTEN</p>
                </div>
                <div class="col-8 text-center">
                    <h5>TRƯỜNG MẦM NON NGỌC HOÀNG</h5>
                    <p><strong><i class="fa-solid fa-phone"></i> 0933.064.964 - 0978.087.992</strong></p>
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
                            <tr v-if="item.data.phimorong > 0">
                                <td class="tb-col-1 p-1"><b>Phí mở rộng</b></td>
                                <td class="tb-col-2 p-1 text-right"><b>{{ numberWithCommas(item.data.phimorong) }}</b></td>
                                <td class="tb-col-3"></td>
                            </tr>
                            <tr
                                v-if="(Object.keys(item.data.detailPhiMoRong).length > 0 && item.data.detailPhiMoRong[key].checked)"
                                v-for="key in Object.keys(item.data.detailPhiMoRong)"
                            >
                                <td class="tb-col-1 p-1">- {{ item.data.detailPhiMoRong[key].label }}</td>
                                <td class="tb-col-2 p-1 text-right">{{ numberWithCommas(item.data.detailPhiMoRong[key].value) }}</td>
                                <td class="tb-col-3">CT</td>
                            </tr>
                            <tr>
                                <td class="tb-col-1">Phát sinh</td>
                                <td class="tb-col-2 p-1 text-right" v-if="parseInt(item.data.khac) > 0">{{ numberWithCommas(item.data.khac) }}</td>
                                <td class="tb-col-2 p-1 text-right" v-else>0</td>
                                <td class="tb-col-3" v-if="item.data.khac > 0">{{ item.data.note }}</td>
                                <td class="tb-col-3" v-else></td>
                            </tr>
                            <tr class="table-primary">
                                <td class="tb-col-1 p-1"><strong>TỔNG CỘNG</strong></td>
                                <td class="tb-col-2 p-1 text-right"><strong>{{ numberWithCommas(getTotal()) }}</strong></td>
                                <td class="tb-col-3 p-1 "></td>
                            </tr>
                            <tr>
                                <td class="tb-col-1 p-1">Khoản trừ nghỉ học liên tiếp</td>
                                <td class="tb-col-2 p-1 text-right">{{ numberWithCommas(item.data.thanhtiennghi) }}</td>
                                <td class="tb-col-3 p-1 " v-if="item.data.thanhtiennghi > 0">{{ item.data.ngaynghi }} ngày</td>
                                <td class="tb-col-3 p-1" v-else></td>
                            </tr>
                            <tr>
                                <td class="tb-col-1">Khoản trừ khác</td>
                                <td class="tb-col-2 p-1 text-right" v-if="parseInt(item.data.khac) < 0">{{ numberWithCommas(parseInt(item.data.khac) * -1) }}</td>
                                <td class="tb-col-2 p-1 text-right" v-else>0</td>
                                <td class="tb-col-3" v-if="item.data.khac < 0">{{ item.data.note }}</td>
                                <td class="tb-col-3" v-else></td>
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
import moment from 'moment'
function getNextMonth(inputMonth, inputYear) {
      // Tạo đối tượng moment từ thông tin tháng và năm đầu vào
      let currentMoment = moment(`${inputYear}-${inputMonth}`, 'YYYY-MM');

      // Thêm 1 tháng để tính tháng kế tiếp
      let nextMoment = currentMoment.add(1, 'months');

      // Lấy thông tin về tháng và năm kế tiếp
      let nextMonth = nextMoment.format('MM');
      let nextYear = nextMoment.format('YYYY');

      return { nextMonth, nextYear };
    }

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
                + (this.item.data.phimorong | 0)
                + this.item.data.an545;
            if(this.item.data.khac > 0){
                ret += this.item.data.khac;
            }
            return ret;
        },
        getSub() {
            if(this.item.data.khac > 0){
                return this.item.data.thanhtiennghi;
            } else {
                return this.item.data.thanhtiennghi + this.item.data.khac * -1;
            }
        }
    },
    created() {
        console.log(this.item);
        if(this.item.data.phimorong == undefined){
            this.item.data.phimorong = 0;
            this.item.data.detailPhiMoRong = [];
        }
        if (typeof window !== undefined) {
            if(this.item.phieuketso){
                this.year = this.item.phieuketso.code.split("_")[0];
                this.month = this.item.phieuketso.code.split("_")[1];
                let { nextMonth, nextYear } = getNextMonth(this.month, this.year);
                this.month = nextMonth;
                this.year = nextYear;
            }
            // this.year = this.$route.params.year;
            // this.month = this.$route.params.month;
            this.idLopHoc = this.$route.params.id;
            this.date = new Date(this.phieuketso.createdAt);

        }
    },
    props: ['item', 'phieuketso']
}
</script>