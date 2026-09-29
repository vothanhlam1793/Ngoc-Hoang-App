<template>
  <b-modal
    v-model="showModal"
    :title="`Hóa đơn: ${invoiceData.code || ''}`"
    size="lg"
    hide-footer
    centered
    no-close-on-backdrop
  >
    <div v-if="invoiceData && invoiceData.id">
      <!-- Vùng in Hóa Đơn -->
      <div class="invoice-paper p-4 bg-white border rounded shadow-sm" ref="invoicePrintRef">
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

        <!-- Tên hóa đơn -->
        <div class="text-center my-3">
          <h4 class="font-weight-bold text-dark text-uppercase mb-1">
            {{ invoiceTitle }}
          </h4>
          <div class="small text-muted font-italic">
            Mã hóa đơn: <strong class="text-primary">{{ invoiceData.code }}</strong> — Ngày lập: {{ formatDateTime(invoiceData.createdAt) }}
          </div>
        </div>

        <!-- Thông tin học sinh & Phụ huynh -->
        <div class="bg-light p-3 rounded mb-3 border small">
          <div class="row align-items-center">
            <div class="col-7">
              <div class="mb-1">
                Họ và tên học sinh: <strong class="text-dark" style="font-size: 1.05rem;">{{ displayStudentName }}</strong>
              </div>
              <div>Lớp học: <strong class="text-primary">{{ displayClassName }}</strong></div>
            </div>
            <div class="col-5 border-left pl-3">
              <div class="mb-1">
                Mã Phụ Huynh: 
                <span class="badge badge-danger font-weight-bold px-2 py-1" style="font-size: 0.9rem;">
                  {{ displayParentCode }}
                </span>
              </div>
              <div>Phụ huynh: <strong>{{ displayParentName }}</strong></div>
              <div class="text-muted">SĐT: <strong>{{ displayParentPhone }}</strong></div>
            </div>
          </div>
        </div>

        <!-- Bảng chi tiết khoản thu -->
        <div class="table-responsive mb-3">
          <table class="table table-bordered table-sm mb-0 align-middle invoice-table">
            <thead class="thead-light small text-uppercase font-weight-bold">
              <tr>
                <th class="text-center" style="width: 5%;">STT</th>
                <th style="width: 45%;">Nội dung khoản thu</th>
                <th class="text-center" style="width: 15%;">Số lượng</th>
                <th class="text-right" style="width: 17%;">Đơn giá</th>
                <th class="text-right" style="width: 18%;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, idx) in invoiceData.items" :key="idx">
                <td class="text-center font-weight-bold text-muted">{{ idx + 1 }}</td>
                <td>
                  <span class="font-weight-bold text-dark d-block">{{ it.name }}</span>
                  <small v-if="it.note" class="text-muted font-italic">{{ it.note }}</small>
                </td>
                <td class="text-center font-weight-bold">{{ it.amount || 1 }}</td>
                <td class="text-right">{{ formatMoney(it.price || it.total) }} đ</td>
                <td class="text-right font-weight-bold text-dark">{{ formatMoney(it.total) }} đ</td>
              </tr>
            </tbody>
            <tfoot>
              <tr v-if="invoiceData.discount > 0">
                <td colspan="4" class="text-right font-weight-bold text-muted">Giảm giá / Ưu đãi:</td>
                <td class="text-right font-weight-bold text-danger">- {{ formatMoney(invoiceData.discount) }} đ</td>
              </tr>
              <tr class="table-warning">
                <td colspan="4" class="text-right font-weight-bold text-uppercase text-dark" style="font-size: 1.05rem;">
                  Tổng số tiền thanh toán:
                </td>
                <td class="text-right font-weight-bold text-danger" style="font-size: 1.15rem;">
                  {{ formatMoney(invoiceData.total) }} đ
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Khối thanh toán QR & Ký tên -->
        <div class="row align-items-center pt-2">
          <!-- Cột trái: QR Code ACB -->
          <div class="col-6 border-right pr-3">
            <div class="d-flex align-items-center">
              <div class="mr-3 text-center">
                <img
                  v-if="invoiceData.vietqrUrl"
                  :src="invoiceData.vietqrUrl"
                  alt="VietQR ACB"
                  style="width: 110px; height: 110px; object-fit: contain;"
                  class="border rounded p-1 bg-white"
                />
              </div>
              <div class="small">
                <div class="font-weight-bold text-primary mb-1">
                  <i class="fas fa-qrcode mr-1"></i> Quét mã VietQR chuyển khoản
                </div>
                <div class="text-muted" style="font-size: 0.8rem;">
                  Ngân hàng: <strong>ACB</strong> — STK: <strong>77229966</strong><br />
                  Chủ TK: <strong>TRUONG MAM NON NGOC HOANG</strong><br />
                  Nội dung CK: <strong class="text-danger font-weight-bold d-inline-block px-1 bg-warning rounded" style="font-size: 0.95rem;">{{ displayQrNote }}</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Cột phải: Chữ ký -->
          <div class="col-6 text-center small">
            <div class="text-muted font-italic mb-3">Ngày ..... tháng ..... năm 2026</div>
            <div class="row">
              <div class="col-6">
                <strong>Người nộp tiền</strong>
                <div class="text-muted" style="height: 45px;"></div>
                <div class="text-muted font-italic">(Ký, họ tên)</div>
              </div>
              <div class="col-6">
                <strong>Người lập phiếu</strong>
                <div class="text-muted" style="height: 45px;"></div>
                <div class="text-muted font-italic">(Ký, họ tên)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons (Không nằm trong bản in) -->
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
            @click="downloadInvoiceImage"
          >
            <i class="fas" :class="exportingImage ? 'fa-spinner fa-spin mr-1' : 'fa-download mr-1'"></i>
            {{ exportingImage ? 'Đang xuất...' : 'Lưu ảnh' }}
          </button>
        </div>
        <div>
          <button type="button" class="btn btn-secondary btn-sm mr-2 font-weight-bold" @click="showModal = false">
            Đóng
          </button>
          <button type="button" class="btn btn-success btn-sm font-weight-bold shadow-sm" @click="printInvoice">
            <i class="fas fa-print mr-1"></i> In hóa đơn
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
    invoice: {
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
    invoiceData() {
      return this.invoice || {};
    },
    invoiceTitle() {
      if (this.invoiceData.type === 'NHAPHOC') return 'Hóa đơn nhập học & Thu phí đầu năm';
      if (this.invoiceData.type === 'BANLE') return 'Hóa đơn bán lẻ & Dịch vụ';
      return 'Hóa đơn thu phí';
    },
    displayStudentName() {
      const s = this.invoiceData.student;
      return this.invoiceData.studentName || (s && s.name) || '—';
    },
    displayClassName() {
      const s = this.invoiceData.student;
      const lh = s && s.lophoc;
      return this.invoiceData.className || (lh && lh.name) || 'Chưa phân lớp';
    },
    displayParentName() {
      const p = this.invoiceData.parent;
      return this.invoiceData.parentName || (p && p.name) || '—';
    },
    displayParentCode() {
      const p = this.invoiceData.parent;
      return this.invoiceData.parentCode || (p && p.code) || 'PH';
    },
    displayParentPhone() {
      const p = this.invoiceData.parent;
      return this.invoiceData.parentPhone || (p && p.phone) || '—';
    },
    displayQrNote() {
      if (this.invoiceData.qrInfo) return this.invoiceData.qrInfo;
      const pCode = this.displayParentCode;
      const hdCode = this.invoiceData.code || '';
      return pCode && pCode !== 'PH' ? `${pCode} ${hdCode}` : hdCode;
    },
    zaloPhone() {
      const p = this.displayParentPhone;
      if (!p || p === '—') return '';
      return String(p).replace(/\D/g, '');
    },
  },
  methods: {
    formatMoney(val) {
      return Number(val || 0).toLocaleString('vi-VN');
    },
    formatDateTime(val) {
      if (!val) return '—';
      const d = new Date(val);
      return Number.isNaN(d.getTime())
        ? '—'
        : new Intl.DateTimeFormat('vi-VN', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'Asia/Ho_Chi_Minh',
          }).format(d);
    },
    async downloadInvoiceImage() {
      if (this.exportingImage || !this.$refs.invoicePrintRef) return;
      this.exportingImage = true;
      try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(this.$refs.invoicePrintRef, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        });
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `HoaDon-${this.invoiceData.code || 'MN-NgocHoang'}.png`;
        link.href = imgData;
        link.click();
      } catch (err) {
        this.$bvToast.toast('Lỗi khi xuất ảnh hóa đơn: ' + err.message, { variant: 'danger', solid: true });
      } finally {
        this.exportingImage = false;
      }
    },
    printInvoice() {
      window.print();
    },
  },
};
</script>

<style scoped>
.invoice-paper {
  background: #ffffff;
  color: #212529;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
.invoice-table th,
.invoice-table td {
  padding: 0.5rem 0.6rem;
}
@media print {
  body * {
    visibility: hidden;
  }
  .invoice-paper,
  .invoice-paper * {
    visibility: visible;
  }
  .invoice-paper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: none !important;
    box-shadow: none !important;
  }
}
</style>
