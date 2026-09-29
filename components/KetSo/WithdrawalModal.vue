<template>
  <b-modal
    v-model="showModal"
    :title="`Biên bản thanh lý thôi học: ${receiptData.code || ''}`"
    size="lg"
    hide-footer
    centered
    no-close-on-backdrop
  >
    <div v-if="receiptData && receiptData.code">
      <!-- Vùng in Biên Bản Thanh Lý -->
      <div class="liquidation-paper p-4 bg-white border rounded shadow-sm" ref="liquidationPrintRef">
        <!-- Header trường -->
        <div class="row align-items-center pb-2 border-bottom mb-3">
          <div class="col-3 text-center">
            <img src="/student.png" alt="Logo Mầm non Ngọc Hoàng" class="img-fluid" style="max-height: 70px;" />
            <div class="text-uppercase font-weight-bold mt-1" style="font-size: 8px; letter-spacing: 0.5px;">
              Ngoc Hoang Kindergarten
            </div>
          </div>
          <div class="col-9">
            <h5 class="font-weight-bold text-danger mb-1 text-uppercase">Trường Mầm Non Ngọc Hoàng</h5>
            <div class="small text-muted mb-0">
              <i class="fas fa-map-marker-alt text-danger mr-1"></i> Số 14, Đường 16, P. Linh Chiểu, TP. Thủ Đức, TP.HCM
            </div>
            <div class="small text-dark font-weight-bold">
              <i class="fas fa-phone-alt text-success mr-1"></i> Hotline: 0933.064.964 - 0978.087.992
            </div>
          </div>
        </div>

        <!-- Tiêu đề chứng từ -->
        <div class="text-center my-3">
          <h4 class="font-weight-bold text-dark text-uppercase mb-1">
            Biên Bản Thanh Lý & Quyết Toán Thôi Học
          </h4>
          <div class="small text-muted font-italic">
            Mã biên bản: <strong class="text-primary">{{ receiptData.code }}</strong> — Kỳ áp dụng: <strong>{{ receiptData.billingMonth }}</strong>
          </div>
        </div>

        <!-- Thông tin học sinh & Phụ huynh -->
        <div class="bg-light p-3 rounded mb-3 border small">
          <div class="row align-items-center">
            <div class="col-7">
              <div class="mb-1">
                Học sinh thôi học: <strong class="text-dark" style="font-size: 1.05rem;">{{ receiptData.studentName }}</strong>
              </div>
              <div class="text-muted">
                Trạng thái: <span class="badge badge-secondary">ĐÃ NGHỈ HỌC</span>
              </div>
            </div>
            <div class="col-5 border-left pl-3">
              <div class="mb-1">
                Mã Phụ Huynh:
                <span class="badge badge-danger font-weight-bold px-2 py-1" style="font-size: 0.9rem;">
                  {{ receiptData.parentCode }}
                </span>
              </div>
              <div>Phụ huynh: <strong>{{ receiptData.parentName }}</strong></div>
              <div class="text-muted" v-if="receiptData.parentPhone">SĐT: <strong>{{ receiptData.parentPhone }}</strong></div>
            </div>
          </div>
        </div>

        <!-- Bảng chi tiết quyết toán -->
        <div class="table-responsive mb-3">
          <table class="table table-bordered table-sm mb-0 align-middle liquidation-table">
            <thead class="thead-light small text-uppercase font-weight-bold">
              <tr>
                <th class="text-center" style="width: 8%;">STT</th>
                <th style="width: 52%;">Nội dung đối soát</th>
                <th class="text-center" style="width: 15%;">Số lượng</th>
                <th class="text-right" style="width: 25%;">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              <!-- Khối 1: Các khoản đã có -->
              <tr class="table-light font-weight-bold">
                <td colspan="4" class="text-uppercase text-primary small">
                  <i class="fas fa-wallet mr-1"></i> I. Các khoản tiền phụ huynh đã đóng / có sẵn
                </td>
              </tr>
              <tr>
                <td class="text-center text-muted">1</td>
                <td>Học phí tháng {{ receiptData.billingMonth }} đã nộp</td>
                <td class="text-center">—</td>
                <td class="text-right font-weight-bold text-success">+ {{ formatMoney(receiptData.paidTuition) }} đ</td>
              </tr>
              <tr v-if="receiptData.parentBalanceAtTime > 0">
                <td class="text-center text-muted">2</td>
                <td>Số dư ví phụ huynh trước khi chốt</td>
                <td class="text-center">—</td>
                <td class="text-right font-weight-bold text-success">+ {{ formatMoney(receiptData.parentBalanceAtTime) }} đ</td>
              </tr>
              <tr class="bg-light">
                <td colspan="3" class="text-right font-weight-bold text-muted small">TỔNG TIỀN ĐÃ CÓ:</td>
                <td class="text-right font-weight-bold text-success">{{ formatMoney(receiptData.totalAvailable) }} đ</td>
              </tr>

              <!-- Khối 2: Chi phí thực tế -->
              <tr class="table-light font-weight-bold">
                <td colspan="4" class="text-uppercase text-danger small">
                  <i class="fas fa-receipt mr-1"></i> II. Chi phí thực tế bé sử dụng trong tháng
                </td>
              </tr>
              <tr>
                <td class="text-center text-muted">1</td>
                <td>Học phí thực tế những ngày đi học</td>
                <td class="text-center font-weight-bold">{{ receiptData.actualDays }} ngày</td>
                <td class="text-right font-weight-bold text-danger">- {{ formatMoney(receiptData.actualTuition) }} đ</td>
              </tr>
              <tr v-if="receiptData.anChieuAmount > 0">
                <td class="text-center text-muted">2</td>
                <td>Tiền ăn chiều thực tế</td>
                <td class="text-center">—</td>
                <td class="text-right font-weight-bold text-danger">- {{ formatMoney(receiptData.anChieuAmount) }} đ</td>
              </tr>
              <tr v-if="receiptData.veTreAmount > 0">
                <td class="text-center text-muted">3</td>
                <td>Tiền ngoài giờ / về trễ</td>
                <td class="text-center">—</td>
                <td class="text-right font-weight-bold text-danger">- {{ formatMoney(receiptData.veTreAmount) }} đ</td>
              </tr>
              <tr v-if="receiptData.cameraAmount > 0">
                <td class="text-center text-muted">4</td>
                <td>Dịch vụ Camera tháng {{ receiptData.billingMonth }}</td>
                <td class="text-center">—</td>
                <td class="text-right font-weight-bold text-danger">- {{ formatMoney(receiptData.cameraAmount) }} đ</td>
              </tr>
              <tr class="bg-light">
                <td colspan="3" class="text-right font-weight-bold text-muted small">TỔNG CHI PHÍ THỰC TẾ:</td>
                <td class="text-right font-weight-bold text-danger">- {{ formatMoney(receiptData.totalCost) }} đ</td>
              </tr>
            </tbody>
            <tfoot>
              <!-- Kết quả thanh lý -->
              <tr :class="receiptData.isRefund ? 'table-success' : 'table-warning'">
                <td colspan="3" class="text-right font-weight-bold text-uppercase" style="font-size: 1.05rem;">
                  {{ receiptData.isRefund ? 'SỐ TIỀN NHÀ TRƯỜNG HOÀN TRẢ PHỤ HUYNH:' : 'SỐ TIỀN PHỤ HUYNH CẦN ĐÓNG THÊM:' }}
                </td>
                <td class="text-right font-weight-bold" :class="receiptData.isRefund ? 'text-success' : 'text-danger'" style="font-size: 1.2rem;">
                  {{ formatMoney(receiptData.settlementAmount) }} đ
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Khối VietQR nếu phụ huynh cần đóng thêm tiền -->
        <div class="row align-items-center pt-2 mb-2" v-if="!receiptData.isRefund && receiptData.settlementAmount > 0 && receiptData.vietqrUrl">
          <div class="col-12 border p-2 rounded bg-light">
            <div class="d-flex align-items-center">
              <img
                :src="receiptData.vietqrUrl"
                alt="VietQR ACB"
                style="width: 100px; height: 100px; object-fit: contain;"
                class="border rounded p-1 bg-white mr-3"
              />
              <div class="small">
                <div class="font-weight-bold text-primary mb-1">
                  <i class="fas fa-qrcode mr-1"></i> Quét mã VietQR chuyển khoản thanh lý
                </div>
                <div class="text-muted" style="font-size: 0.8rem;">
                  Ngân hàng: <strong>ACB</strong> — STK: <strong>77229966</strong><br />
                  Chủ TK: <strong>TRUONG MAM NON NGOC HOANG</strong><br />
                  Nội dung CK: <strong class="text-danger font-weight-bold d-inline-block px-1 bg-warning rounded" style="font-size: 0.95rem;">{{ receiptData.qrInfo }}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vùng Chữ ký -->
        <div class="row text-center small pt-3">
          <div class="col-12 text-right text-muted font-italic mb-3">
            TP. Thủ Đức, ngày ..... tháng ..... năm 2026
          </div>
          <div class="col-6">
            <strong>Phụ huynh học sinh</strong>
            <div class="text-muted" style="height: 50px;"></div>
            <div class="text-muted font-italic">(Ký, họ tên & xác nhận nhận tiền)</div>
          </div>
          <div class="col-6">
            <strong>Đại diện Nhà trường</strong>
            <div class="text-muted" style="height: 50px;"></div>
            <div class="text-muted font-italic">(Ký, họ tên & đóng dấu)</div>
          </div>
        </div>
      </div>

      <!-- Action Buttons (Ẩn khi in) -->
      <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
        <div>
          <a
            v-if="zaloPhone"
            :href="`https://zalo.me/${zaloPhone}`"
            target="_blank"
            class="btn btn-outline-primary btn-sm font-weight-bold mr-2 shadow-sm"
          >
            <i class="fas fa-comment-dots text-primary mr-1"></i> Nhắn Zalo
          </a>
          <button
            type="button"
            class="btn btn-outline-info btn-sm font-weight-bold mr-2 shadow-sm"
            :disabled="exportingImage"
            @click="downloadReceiptImage"
          >
            <i class="fas" :class="exportingImage ? 'fa-spinner fa-spin mr-1' : 'fa-download mr-1'"></i>
            {{ exportingImage ? 'Đang xuất...' : 'Lưu ảnh' }}
          </button>
        </div>
        <div>
          <button type="button" class="btn btn-secondary btn-sm mr-2 font-weight-bold" @click="showModal = false">
            Đóng
          </button>
          <button type="button" class="btn btn-success btn-sm font-weight-bold shadow-sm" @click="printReceipt">
            <i class="fas fa-print mr-1"></i> In biên bản
          </button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    receipt: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      exportingImage: false,
    };
  },
  computed: {
    showModal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    receiptData() {
      return this.receipt || {};
    },
    zaloPhone() {
      const p = this.receiptData.parentPhone;
      if (!p || p === '—') return '';
      return String(p).replace(/\D/g, '');
    },
  },
  methods: {
    formatMoney(val) {
      return Number(val || 0).toLocaleString('vi-VN');
    },
    async downloadReceiptImage() {
      if (this.exportingImage || !this.$refs.liquidationPrintRef) return;
      this.exportingImage = true;
      try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(this.$refs.liquidationPrintRef, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        });
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `BienBanThanhLy-${this.receiptData.code || 'MN-NgocHoang'}.png`;
        link.href = imgData;
        link.click();
      } catch (err) {
        this.$bvToast.toast('Lỗi khi xuất ảnh biên bản: ' + err.message, { variant: 'danger', solid: true });
      } finally {
        this.exportingImage = false;
      }
    },
    printReceipt() {
      window.print();
    },
  },
};
</script>

<style scoped>
.liquidation-paper {
  background: #ffffff;
  color: #212529;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
.liquidation-table th,
.liquidation-table td {
  padding: 0.45rem 0.55rem;
}
@media print {
  body * {
    visibility: hidden;
  }
  .liquidation-paper,
  .liquidation-paper * {
    visibility: visible;
  }
  .liquidation-paper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: none !important;
    box-shadow: none !important;
  }
}
</style>
