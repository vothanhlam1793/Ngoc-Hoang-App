<template>
    <div class="row my-5">
        <div class="col-7 border border-primary rounded p-2">
            <div class="row">
                <div class="text-center col-4 pb-4 pl-5">
                    <b-img src="/student.png" width="80" alt="Center image"></b-img>
                    <p style="font-size: 12px;" class="mt-1">NGOC HOANG KINDERGARTEN</p>
                </div>
                <div class="col-8 text-center">
                    <h5>TRƯỜNG MẦM NON NGỌC HOÀNG</h5>
                    <p><strong><i class="fa-solid fa-phone"></i> 0933.064.964 - 0978.087.992</strong></p>
                </div>
            </div>
            <div class="row">
                <div class="col text-center text-danger">
                    <h4>PHIẾU HỌC PHÍ THÁNG {{ month }}/{{ year }}</h4>
                </div>
            </div>
            <div class="row mt-1">
                <div class="col-1">

                </div>
                <div class="col-11">
                    <p>Họ và tên học sinh: <strong>{{ localItem.hocsinh.name }}</strong>
                        <br>Lớp: <strong>{{ localItem.lophoc.name }}</strong>
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <table class="">
                        <thead class="text-center text-danger">
                            <tr>
                                <th style="width: 45%;">Các khoản thu</th>
                                <th style="width: 35%">Chi tiết thu</th>
                                <th style="width: 20%">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="tb-col-1">Cơ sở vật chất ban đầu</td>
                                <td class="tb-col-2">{{ numberWithCommas(localItem.data.csvc) }}</td>
                                <td class="tb-col-3">1 năm</td>
                            </tr>
                            <tr>
                                <td class="tb-col-1">Camera</td>
                                <td class="tb-col-2">{{ numberWithCommas(localItem.data.camera) }}</td>
                                <td class="tb-col-3"></td>
                            </tr>
                            <!-- <tr>
                                <td class="tb-col-1">Hóa đơn</td>
                                <td class="tb-col-2">{{ numberWithCommas(localItem.data.totalHoaDon) }}</td>
                                <td class="tb-col-3"></td>
                            </tr> -->
                            <tr>
                                <td class="tb-col-1">Học phí</td>
                                <td class="tb-col-2">{{ numberWithCommas(localItem.data.hocphi) }}</td>
                                <td class="tb-col-3"></td>
                            </tr>
                            <!-- <tr>
                                <td class="tb-col-1">Phí giữ trẻ ngoài giờ</td>
                                <td class="tb-col-2">{{ numberWithCommas(localItem.data.ngoaigio) }}</td>
                                <td class="tb-col-3"></td>
                            </tr> -->
                            <!-- <tr>
                                <td class="tb-col-1">Phí trẻ ăn chiều 16g45</td>
                                <td class="tb-col-2">{{ numberWithCommas(localItem.data.an545) }}</td>
                                <td class="tb-col-3"></td>
                            </tr> -->
                            <!-- <tr  v-if="localItem.data.phimorong > 0">
                                <td class="tb-col-1"><b>Thu khác</b></td>
                                <td class="tb-col-2"><b>{{ numberWithCommas(localItem.data.phimorong) }}</b></td>
                                <td class="tb-col-3"></td>
                            </tr> -->
                            <tr v-if="(Object.keys(localItem.data.detailPhiMoRong).length > 0 && localItem.data.detailPhiMoRong[key].checked)"
                                v-for="key in Object.keys(localItem.data.detailPhiMoRong)">
                                <td class="tb-col-1">
                                    {{
                                        localItem.data.detailPhiMoRong[key].label === "phí đồ dùng học tập"
                                            ? "Phí đồ dùng học tập"
                                            : localItem.data.detailPhiMoRong[key].label
                                    }}
                                </td>
                                <td class="tb-col-2">{{ numberWithCommas(localItem.data.detailPhiMoRong[key].value) }}
                                </td>
                                <td class="tb-col-3">
                                    {{
                                        localItem.data.detailPhiMoRong[key].label.includes("đồ dùng học tập")
                                    ? "1 năm"
                                    : ""
                                    }}
                                </td>
                            </tr>
                            <tr>
                                <td class="tb-col-1">Khoản thu khác</td>
                                <td class="tb-col-2" v-if="parseInt(localItem.data.khac) > 0">{{
                                    numberWithCommas(localItem.data.khac) }}</td>
                                <td class="tb-col-2" v-else>0</td>
                                <td class="tb-col-3" v-if="localItem.data.khac > 0">{{ localItem.data.note }}</td>
                                <td class="tb-col-3" v-else></td>
                            </tr>
                            <tr class="table-primary">
                                <td class="tb-col-1"><strong>TỔNG CỘNG</strong></td>
                                <td class="tb-col-2"><strong>{{ numberWithCommas(getTotal()) }}</strong></td>
                                <td class="tb-col-3"></td>
                            </tr>
                            <tr>
                                <td class="tb-col-1">Khoản trừ nghỉ học</td>
                                <td class="tb-col-2">{{ numberWithCommas(localItem.data.thanhtiennghi) }}</td>
                                <td class="tb-col-3" v-if="localItem.data.thanhtiennghi > 0">{{ localItem.data.ngaynghi
                                    }} ngày
                                </td>
                                <td class="tb-col-3" v-else></td>
                            </tr>
                            <tr>
                                <td class="tb-col-1">Khoản trừ khác</td>
                                <td class="tb-col-2" v-if="parseInt(localItem.data.khac) < 0">{{
                                    numberWithCommas(parseInt(localItem.data.khac) * -1) }}</td>
                                <td class="tb-col-2" v-else>0</td>
                                <td class="tb-col-3" v-if="localItem.data.khac < 0">{{ localItem.data.note }}</td>
                                <td class="tb-col-3" v-else></td>
                            </tr>
                            <tr class="table-primary">
                                <td class="tb-col-1"><strong>TỔNG TRỪ</strong></td>
                                <td class="tb-col-2"><strong>{{ numberWithCommas(getSub()) }}</strong></td>
                                <td class="tb-col-3"></td>
                            </tr>
                            <tr class="text-danger">
                                <td class="tb-col-1 text-center"><strong>TỔNG PHẢI THU</strong></td>
                                <td class="tb-col-2"><strong>{{ numberWithCommas(localItem.data.total) }}</strong></td>
                                <td class="tb-col-3"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="row">
                <div class="col-10 text-right">
                    <p><i>Ngày {{ this.date.getDate() }} tháng {{ this.date.getMonth() + 1 }} năm {{
                        this.date.getFullYear()
                            }}</i></p>
                </div>
                <div class="col-2">

                </div>
            </div>
            <div class="row text-center mb-5">
                <div class="col">
                    <p>Hiệu trưởng</p>
                </div>
                <div class="col">
                    <p>Phụ huynh</p>
                </div>
                <div class="col">
                    <p>Người thu tiền</p>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-2"></div>
                <div class="col-10">
                    <p>Phụ huynh chuyển khoản theo nội dung
                        <br>"<strong>HỌ VÀ TÊN BÉ - TÊN LỚP</strong>"
                        <br>Ví dụ "<strong>Nguyen Ha Phuong Choi 1</strong>"
                    </p>
                    <p>Tên tài khoản: <strong>TRƯỜNG MẦM NON NGỌC HOÀNG</strong>
                        <br>Ngân hàng Á Châu: <strong>77229966</strong>
                    </p>
                </div>
            </div>
        </div>
        <div class="col-1">

        </div>
        <div class="col-4 p-2 border border-danger rounded">
            <div class="row">
                <div class="col">
                    <div class="row">
                        <div class="col">
                            <h4>Thông tin phụ huynh</h4>
                        </div>
                    </div>
                    <div class="row" v-if="localItem.hocsinh.parent.hocsinhs.length > 0">
                        <div class="col">
                            <h6>Thông tin ACE</h6>
                            <table class="table table-bordered table-striped">
                                <tr v-for="hocsinh in localItem.hocsinh.parent.hocsinhs">
                                    <td>{{ hocsinh.name }}</td>
                                    <td v-if="hocsinh.lophoc">{{ hocsinh.lophoc.name }}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <h6>Số điện thoại</h6>
                            <table class="table table-bordered table-striped">
                                <tr v-for="phone in localItem.hocsinh.parent.phone">
                                    <td>{{ phone.name }}</td>
                                    <td>{{ phone.number }}</td>
                                    <td>
                                        <a :href="`https://zalo.me/${phone.number}`" class="btn btn-primary"
                                            target="_blank">Zalo</a>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
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
    props: ['item', 'phieuketso'],
    data() {
        return {
            year: "",
            month: "",
            date: "",
            localItem: null   // ✅ thêm biến local
        }
    },
    created() {
        // clone item từ props để không mutate trực tiếp Vuex state
        this.localItem = JSON.parse(JSON.stringify(this.item));

        if (this.localItem.data.phimorong === undefined) {
            this.localItem.data.phimorong = 0;
            this.localItem.data.detailPhiMoRong = [];
        }

        if (typeof window !== "undefined") {
            this.year = this.$route.params.year;
            this.month = this.$route.params.month;
            let { nextMonth, nextYear } = getNextMonth(this.month, this.year);
            this.month = nextMonth;
            this.year = nextYear;
            this.idLopHoc = this.$route.params.id;
            this.date = new Date(this.phieuketso.createdAt);
        }
    },
    methods: {
        numberWithCommas(x) {
            let t = x ?? 0;
            return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        getTotal() {
            let d = this.localItem.data;
            let ret = d.csvc + d.camera + d.totalHoaDon + d.hocphi + d.ngoaigio + d.phimorong + d.an545;
            if (d.khac > 0) ret += d.khac;
            return ret;
        },
        getSub() {
            let d = this.localItem.data;
            return d.khac > 0 ? d.thanhtiennghi : d.thanhtiennghi + d.khac * -1;
        }
    }
}
</script>
