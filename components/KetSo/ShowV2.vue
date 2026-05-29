<template>
<div>
    <div class="row my-3">
        <div class="col-8 border rounded p-1" ref="invoiceRef">
            <div class="row align-items-center">
                <div class="text-center col-4 pb-1 pl-3">
                    <b-img src="/student.png" width="80" alt="Logo"></b-img>
                    <p style="font-size:11px;" class="mt-0 mb-0">NGOC HOANG KINDERGARTEN</p>
                </div>
                <div class="col-8 text-center">
                    <h4 class="font-weight-bold mb-0">TRƯỜNG MẦM NON NGỌC HOÀNG</h4>
                    <p style="font-size:16px;" class="mb-0"><strong><i class="fa-solid fa-phone"></i> 0933.064.964</strong></p>
                </div>
            </div>
            <div class="row">
                <div class="col text-center text-danger">
                    <h2 class="font-weight-bold mb-0">PHIẾU THU HỌC PHÍ THÁNG {{ month }}/{{ year }}</h2>
                </div>
            </div>
            <div class="row mt-0 mb-1">
                <div class="col-1"></div>
                <div class="col-11">
                    <p style="font-size:17px; margin-bottom:2px;">
                        Họ và tên học sinh: <strong>{{ localItem.hocsinh.name }}</strong>
                        &nbsp;&nbsp;|&nbsp;&nbsp; Lớp: <strong>{{ localItem.lophoc.name }}</strong>
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="col-8 pr-1">
                    <table class="fee-table-v2">
                        <thead>
                            <tr>
                                <th style="width:5%">STT</th>
                                <th style="width:42%">Các khoản thu</th>
                                <th style="width:30%">Thành tiền (VNĐ)</th>
                                <th style="width:23%">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in tableRows" :key="row.stt + '-' + row.label">
                                <td class="text-center">{{ row.stt }}</td>
                                <td>{{ row.label }}</td>
                                <td class="text-right">{{ numberWithCommas(row.value) }}</td>
                                <td class="text-center">{{ row.note }}</td>
                            </tr>
                            <tr class="table-primary">
                                <td colspan="2" class="text-center"><strong>TỔNG CỘNG</strong></td>
                                <td class="text-right"><strong>{{ numberWithCommas(getTotal()) }}</strong></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td colspan="2">Khoản trừ nghỉ học</td>
                                <td class="text-right">{{ numberWithCommas(localItem.data.thanhtiennghi) }}</td>
                                <td class="text-center" v-if="localItem.data.thanhtiennghi > 0">{{ localItem.data.ngaynghi }} ngày</td>
                                <td v-else></td>
                            </tr>
                            <tr>
                                <td colspan="2">Khoản trừ khác</td>
                                <td class="text-right" v-if="parseInt(localItem.data.khac) < 0">{{ numberWithCommas(parseInt(localItem.data.khac) * -1) }}</td>
                                <td class="text-right" v-else>0</td>
                                <td v-if="localItem.data.khac < 0">{{ localItem.data.note }}</td>
                                <td v-else></td>
                            </tr>
                            <tr class="table-primary">
                                <td colspan="2" class="text-center"><strong>TỔNG TRỪ</strong></td>
                                <td class="text-right"><strong>{{ numberWithCommas(getSub()) }}</strong></td>
                                <td></td>
                            </tr>
                            <tr class="text-danger font-weight-bold">
                                <td colspan="2" class="text-center"><strong>THỰC THU</strong></td>
                                <td class="text-right p-1">
                                    <input type="text" v-model="adjustAmount" class="thucthu-input-inline" @input="onAmountInput" />
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-4 pl-2 text-center">
                    <div class="qr-box">
                        <img :src="vietqrUrl" alt="QR Chuyển khoản" class="qr-img" />
                        <p class="qr-text">Quét mã QR để chuyển khoản</p>
                    </div>
                    <div class="bank-note text-left mt-2">
                        <p class="mb-1" style="font-size:12px;">
                            CK theo nội dung<br>
                            "<strong>{{ localItem.hocsinh.name }} - {{ localItem.lophoc.name }}</strong>"
                        </p>
                        <p class="mb-0" style="font-size:12px;">
                            Chủ TK: <strong>TRƯỜNG MẦM NON NGỌC HOÀNG</strong><br>
                            Số TK: <strong>77229966</strong> - ACB
                        </p>
                    </div>
                </div>
            </div>
            <div class="row mt-1">
                <div class="col-10 text-right">
                    <p style="font-size:15px;" class="mb-1"><i>Ngày {{ date.getDate() }} tháng {{ date.getMonth() + 1 }} năm {{ date.getFullYear() }}</i></p>
                </div>
                <div class="col-2"></div>
            </div>
            <div class="row text-center mb-1">
                <div class="col"><p class="font-weight-bold">Hiệu trưởng</p></div>
                <div class="col"><p class="font-weight-bold">Phụ huynh</p></div>
                <div class="col"><p class="font-weight-bold">Người thu tiền</p></div>
            </div>
        </div>

        <div class="col-1"></div>

        <div class="col-3 p-2 border border-danger rounded">
            <h5 class="text-danger font-weight-bold mb-2">Thông tin phụ huynh</h5>
            <h6 class="font-weight-bold mb-1">Số điện thoại</h6>
            <table class="table table-bordered table-striped table-sm mb-2">
                <tr v-for="phone in localItem.hocsinh.parent.phone" :key="phone.number">
                    <td>{{ phone.name }}</td>
                    <td>{{ phone.number }}</td>
                    <td>
                        <a :href="`https://zalo.me/${phone.number}`" class="btn btn-primary btn-sm" target="_blank">Zalo</a>
                    </td>
                </tr>
            </table>
            <!--
            <button class="btn btn-success btn-sm btn-block mb-1" @click="captureAndCopy" :disabled="isCapturing">
                {{ isCapturing ? 'Đang chụp...' : '📋 Copy phiếu thu (ảnh)' }}
            </button>
            <button v-if="siblings.length > 0" class="btn btn-info btn-sm btn-block" @click="showSiblings = true">
                👨‍👩‍👧 Anh/Chị/Em ({{ siblings.length + 1 }} bé)
            </button>
            -->
        </div>
    </div>

    <!--
    <b-modal v-model="showSiblings" title="Phiếu thu Anh/Chị/Em" ok-only ok-title="Đóng" size="lg">
        <table class="table table-bordered table-sm">
            <thead>
                <tr><th>Tên</th><th>Lớp</th><th></th></tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>{{ localItem.hocsinh.name }}</strong></td>
                    <td>{{ localItem.lophoc.name }}</td>
                    <td class="text-center"><span class="badge badge-warning">Đang xem</span></td>
                </tr>
                <tr v-for="s in siblings" :key="s.id">
                    <td>{{ s.name }}</td>
                    <td>{{ s.lophoc ? s.lophoc.name : '' }}</td>
                    <td class="text-center">
                        <a v-if="s.lophoc && s.lophoc.id"
                            :href="`/ketso/${year}/${month}/${s.lophoc.id}/show?v=2`"
                            class="btn btn-primary btn-sm"
                            target="_blank"
                        >Xem phiếu thu V2</a>
                        <span v-else class="text-muted">Chưa kết sổ</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </b-modal>
    -->
</div>
</template>

<script>
import moment from 'moment'
function getNextMonth(inputMonth, inputYear) {
    let currentMoment = moment(`${inputYear}-${inputMonth}`, 'YYYY-MM');
    let nextMoment = currentMoment.add(1, 'months');
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
            date: new Date(),
            localItem: null,
            adjustAmount: "",
            isCapturing: false,
            showSiblings: false,
        }
    },
    computed: {
        tableRows() {
            if (!this.localItem) return [];
            const d = this.localItem.data;
            const rows = [];
            if (d.csvc > 0) rows.push({ stt: rows.length + 1, label: 'Cơ sở vật chất ban đầu', value: d.csvc, note: '1 năm' });
            if (d.camera > 0) rows.push({ stt: rows.length + 1, label: 'Camera', value: d.camera, note: '' });
            if (d.hocphi > 0) rows.push({ stt: rows.length + 1, label: 'Học phí', value: d.hocphi, note: '' });
            if (d.ngoaigio > 0) rows.push({ stt: rows.length + 1, label: 'Phí giữ trẻ ngoài giờ', value: d.ngoaigio, note: '' });
            if (d.an545 > 0) rows.push({ stt: rows.length + 1, label: 'Phí trẻ ăn chiều 16g45', value: d.an545, note: '' });
            if (d.totalHoaDon > 0) rows.push({ stt: rows.length + 1, label: 'Hóa đơn', value: d.totalHoaDon, note: '' });
            for (const item of this.filteredPhiMoRong) {
                rows.push({
                    stt: rows.length + 1,
                    label: this.formatPhiMoRongLabel(item.label),
                    value: item.value,
                    note: item.label.includes('đồ dùng học tập') ? '1 năm' : ''
                });
            }
            if (parseInt(d.khac) > 0) {
                rows.push({ stt: rows.length + 1, label: 'Khoản thu khác', value: d.khac, note: d.note || '' });
            }
            return rows;
        },
        filteredPhiMoRong() {
            if (!this.localItem || !this.localItem.data.detailPhiMoRong) return [];
            const pmr = this.localItem.data.detailPhiMoRong;
            if (Array.isArray(pmr)) return pmr.filter(i => i.checked);
            const result = [];
            for (const key of Object.keys(pmr)) {
                if (pmr[key].checked) result.push({ _key: key, ...pmr[key] });
            }
            return result;
        },
        siblings() {
            if (!this.localItem || !this.localItem.hocsinh || !this.localItem.hocsinh.parent) return [];
            const parent = this.localItem.hocsinh.parent;
            if (!parent.hocsinhs) return [];
            return parent.hocsinhs.filter(h => h.id !== this.localItem.hocsinh.id);
        },
        vietqrUrl() {
            const bankCode = 'ACB';
            const accountNo = '77229966';
            const accountName = 'TRUONG MAM NON NGOC HOANG';
            const amount = this.adjustAmountRaw || 0;
            const content = `${this.localItem?.hocsinh?.name || ''} ${this.localItem?.lophoc?.name || ''}`;
            let url = `https://img.vietqr.io/image/${bankCode}-${accountNo}-print.png`;
            url += `?accountName=${encodeURIComponent(accountName)}`;
            url += `&addInfo=${encodeURIComponent(content.trim())}`;
            if (amount > 0) url += `&amount=${amount}`;
            return url;
        },
        adjustAmountRaw() {
            if (!this.adjustAmount) return 0;
            return parseInt(this.adjustAmount.replace(/\./g, '')) || 0;
        }
    },
    created() {
        this.localItem = JSON.parse(JSON.stringify(this.item));
        const d = this.localItem.data;
        d.csvc = d.csvc || 0;
        d.camera = d.camera || 0;
        d.hocphi = d.hocphi || 0;
        d.ngoaigio = d.ngoaigio || 0;
        d.an545 = d.an545 || 0;
        d.totalHoaDon = d.totalHoaDon || 0;
        d.phimorong = d.phimorong || 0;
        d.khac = Number(d.khac) || 0;
        d.thanhtiennghi = d.thanhtiennghi || 0;

        if (!d.detailPhiMoRong || Array.isArray(d.detailPhiMoRong)) {
            d.detailPhiMoRong = {};
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

        this.adjustAmount = this.numberWithCommas(this.localItem.data.total);
    },
    methods: {
        numberWithCommas(x) {
            let t = Number(x ?? 0);
            if (isNaN(t)) t = 0;
            return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        onAmountInput() {
            let raw = this.adjustAmount.replace(/\./g, '').replace(/[^0-9]/g, '');
            if (raw) {
                this.adjustAmount = this.numberWithCommas(parseInt(raw));
            }
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
        },
        formatPhiMoRongLabel(label) {
            if (label === 'phí đồ dùng học tập') return 'Phí đồ dùng học tập';
            return label;
        },
        async captureAndCopy() {
            if (!this.$refs.invoiceRef) return;
            this.isCapturing = true;
            try {
                const html2canvas = (await import('html2canvas')).default;
                const canvas = await html2canvas(this.$refs.invoiceRef, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                });
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                if (!blob) {
                    alert('Không thể tạo ảnh, vui lòng thử lại.');
                    return;
                }
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    alert('Đã copy phiếu thu vào clipboard! Mở Zalo và Ctrl+V để dán.');
                } catch (e) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `phieuthu-${this.localItem.hocsinh.name}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            } catch (err) {
                console.error('Screenshot error:', err);
                alert('Lỗi khi chụp phiếu thu.');
            } finally {
                this.isCapturing = false;
            }
        }
    }
}
</script>

<style scoped>
.fee-table-v2 {
    width: 100%;
    border-collapse: collapse;
    font-size: 16px;
    border: 2px solid #1a73e8;
}

.fee-table-v2 th,
.fee-table-v2 td {
    border: 1px solid #ccc;
    padding: 5px 8px;
}

.fee-table-v2 thead th {
    background: #1a73e8;
    color: #fff;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
}

.fee-table-v2 tbody tr:nth-child(even) {
    background: #f8f9fa;
}

.fee-table-v2 .text-right {
    text-align: right;
    padding-right: 12px;
}

.fee-table-v2 .text-center {
    text-align: center;
}

.fee-table-v2 .table-primary td {
    background: #e8f0fe !important;
    font-weight: bold;
}

.thucthu-input-inline {
    width: 160px;
    text-align: right;
    font-size: 19px;
    font-weight: bold;
    color: #dc3545;
    border: 2px dashed #dc3545;
    border-radius: 4px;
    padding: 4px 10px;
    background: #fff8f8;
}

.thucthu-input-inline:focus {
    outline: none;
    border: 2px solid #dc3545;
    background: #fff;
}

.qr-box {
    border: 2px solid #eee;
    border-radius: 8px;
    padding: 8px;
    background: #fafafa;
    margin-top: 2px;
}

.qr-img {
    width: 100%;
    max-width: 170px;
    height: auto;
    border-radius: 4px;
}

.qr-text {
    font-size: 12px;
    margin-top: 6px;
    font-weight: bold;
    color: #1a73e8;
}

.bank-note {
    line-height: 1.5;
    color: #555;
}
</style>
