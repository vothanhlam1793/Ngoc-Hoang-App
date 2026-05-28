<template>
    <div class="row my-3">
        <div class="col-8 border rounded p-1" ref="invoiceRef">
            <div class="row align-items-center">
                <div class="text-center col-4 pb-1 pl-3">
                    <b-img src="/student.png" width="80" alt="Logo"></b-img>
                    <p style="font-size:11px;" class="mt-0 mb-0">NGOC HOANG KINDERGARTEN</p>
                </div>
                <div class="col-8 text-center">
                    <h4 class="font-weight-bold mb-0">TRƯỜNG MẦM NON NGỌC HOÀNG</h4>
                    <p style="font-size:16px;" class="mb-0"><strong><i class="fa-solid fa-phone"></i> 0933.064.964 - 0978.087.992</strong></p>
                </div>
            </div>
            <div class="row">
                <div class="col text-center">
                    <h2 class="invoice-title font-weight-bold mb-0">PHIẾU THU HỌC PHÍ THÁNG {{ month }}/{{ year }}</h2>
                </div>
            </div>
            <div class="row mt-0 mb-2 student-info-row">
                <div class="col-1"></div>
                <div class="col-11">
                    <p class="mb-0" style="font-size:16px;">
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
                                <th style="width:8%">STT</th>
                                <th style="width:45%">Các khoản thu</th>
                                <th style="width:32%">THÀNH TIỀN <span style="font-size:12px;font-weight:400;">(VNĐ)</span></th>
                                <th style="width:15%">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in tableRows" :key="row.stt + '-' + row.label">
                                <td class="text-center">{{ row.stt }}</td>
                                <td>{{ row.label }}</td>
                                <td class="text-right">{{ numberWithCommas(row.value) }}</td>
                                <td class="text-center">{{ row.note }}</td>
                            </tr>
                            <tr class="row-total">
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
                            <tr class="row-total">
                                <td colspan="2" class="text-center"><strong>TỔNG TRỪ</strong></td>
                                <td class="text-right"><strong>{{ numberWithCommas(getSub()) }}</strong></td>
                                <td></td>
                            </tr>
                            <tr>
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
                        <p class="mb-1 transfer-label">CK theo nội dung:</p>
                        <p class="transfer-content">"<strong>{{ localItem.hocsinh.name }} - {{ localItem.lophoc.name }}</strong>"</p>
                        <p class="mb-0 transfer-account">
                            <strong>TRƯỜNG MẦM NON NGỌC HOÀNG</strong><br>
                            Số TK: <strong class="account-number">77229966</strong> - ACB
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

        <div class="col-3 p-2 border rounded parent-box">
            <h5 class="font-weight-bold mb-2 parent-title">Thông tin phụ huynh</h5>
            <div v-if="localItem.hocsinh.parent && localItem.hocsinh.parent.hocsinhs && localItem.hocsinh.parent.hocsinhs.length > 0">
                <h6 class="font-weight-bold mb-1">Thông tin ACE</h6>
                <table class="table table-bordered table-striped table-sm mb-2">
                    <tr v-for="hocsinh in localItem.hocsinh.parent.hocsinhs" :key="hocsinh.id">
                        <td>{{ hocsinh.name }}</td>
                        <td v-if="hocsinh.lophoc">{{ hocsinh.lophoc.name }}</td>
                    </tr>
                </table>
            </div>
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
            <button class="btn btn-success btn-sm btn-block" @click="captureAndCopy" :disabled="isCapturing">
                {{ isCapturing ? 'Đang chụp...' : '📋 Copy phiếu thu (ảnh)' }}
            </button>
        </div>
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
        }
    },
    computed: {
        tableRows() {
            if (!this.localItem) return [];
            const d = this.localItem.data;
            const rows = [];
            rows.push({ stt: 1, label: 'Cơ sở vật chất ban đầu', value: d.csvc, note: '1 năm' });
            rows.push({ stt: 2, label: 'Camera', value: d.camera, note: '' });
            rows.push({ stt: 3, label: 'Học phí', value: d.hocphi, note: '' });
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
            } else {
                rows.push({ stt: rows.length + 1, label: 'Khoản thu khác', value: 0, note: '' });
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
.invoice-title {
    color: #FF6600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 3px;
}

.student-info-row {
    padding-bottom: 8px;
    margin-bottom: 10px;
    border-bottom: 1.5px solid #FF6600;
}

.fee-table-v2 {
    width: 100%;
    border-collapse: collapse;
    font-size: 15.5px;
    border: 1px solid #E0E0E0;
    color: #2C3E50;
}

.fee-table-v2 thead th {
    background-color: #0066CC;
    color: #fff;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    padding: 6px 8px;
    border: none;
    white-space: nowrap;
}

.fee-table-v2 tbody td {
    padding: 5px 8px;
    font-size: 15.5px;
    color: #1A252F;
    font-weight: 500;
    line-height: 1.3;
    border-bottom: 1px solid #EAEAEA;
    border-left: none;
    border-right: none;
}

.fee-table-v2 tbody tr:nth-child(even) td {
    background-color: #F9FBFC;
}

.fee-table-v2 .text-right {
    text-align: right;
    padding-right: 12px;
}

.fee-table-v2 .text-center {
    text-align: center;
}

.row-total td {
    background-color: #FFF5EE !important;
    font-weight: bold;
    font-size: 15.5px !important;
    padding: 6px 8px !important;
    border-bottom: 2px solid #FF6600 !important;
}

.thucthu-input-inline {
    width: 160px;
    text-align: right;
    font-size: 20px;
    font-weight: bold;
    color: #FF6600;
    border: 2px dashed #FF6600;
    border-radius: 4px;
    padding: 6px 12px;
    background: #fff;
}

.thucthu-input-inline:focus {
    outline: none;
    border: 2px solid #FF6600;
    background: #fff;
}

.qr-box {
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    padding: 15px;
    background: #fff;
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
    color: #0066CC;
}

.bank-note {
    line-height: 1.6;
    color: #2C3E50;
    font-size: 15px;
    margin-top: 15px;
}

.transfer-label {
    font-size: 13px;
    color: #666;
}

.transfer-content {
    font-size: 16px;
    color: #FF6600;
    font-weight: bold;
    background-color: #FFF5EE;
    padding: 4px 8px;
    display: inline-block;
    border-radius: 4px;
    margin-bottom: 8px;
}

.transfer-account {
    font-size: 15px;
}

.account-number {
    color: #0066CC;
    font-size: 15px;
}

.parent-box {
    border-color: #E0E0E0 !important;
}

.parent-title {
    color: #FF6600;
}
</style>
