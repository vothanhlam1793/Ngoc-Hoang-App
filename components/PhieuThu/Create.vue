<template>
  <div class="collect-money-container">
    <div class="row">
      <!-- CỘT TRÁI: QUÉT MÃ VIETQR CHUYỂN KHOẢN TỰ ĐỘNG -->
      <div class="col-md-5 pr-md-3 border-md-right mb-3 mb-md-0 text-center">
        <div class="qr-preview-wrapper p-3 bg-light rounded border shadow-sm">
          <h6 class="font-weight-bold text-primary mb-2">
            <i class="fas fa-qrcode mr-1"></i> Quét Mã VietQR Chuyển Khoản
          </h6>
          <div class="qr-image-container bg-white p-2 rounded border mb-2 d-inline-block">
            <img :src="vietqrUrl" alt="VietQR ACB" class="img-fluid qr-img" />
          </div>
          <div class="small text-muted mb-2">Hỗ trợ tất cả ứng dụng Ngân hàng & MoMo</div>

          <!-- Thông tin chuyển khoản sao chép nhanh -->
          <div class="bank-details-box text-left p-2 bg-white rounded border small">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="text-muted">Ngân hàng:</span>
              <strong>ACB - CN TP.HCM</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="text-muted">Số tài khoản:</span>
              <div class="d-flex align-items-center">
                <strong class="text-dark mr-1">77229966</strong>
                <button
                  type="button"
                  class="btn btn-xs btn-outline-secondary py-0 px-1"
                  @click="copyText('77229966', 'Số tài khoản')"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="text-muted">Chủ tài khoản:</span>
              <strong class="text-truncate ml-1" style="max-width: 140px;">TRUONG MAM NON NGOC HOANG</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center pt-1 border-top">
              <span class="text-muted font-weight-bold">Nội dung CK:</span>
              <div class="d-flex align-items-center">
                <span class="badge badge-warning text-dark font-weight-bold px-2 py-1 mr-1">
                  {{ qrContent }}
                </span>
                <button
                  type="button"
                  class="btn btn-xs btn-outline-primary py-0 px-1"
                  @click="copyText(qrContent, 'Nội dung chuyển khoản')"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CỘT PHẢI: FORM GHI NHẬN THU TIỀN TẠI TRƯỜNG -->
      <div class="col-md-7 pl-md-3 d-flex flex-column justify-content-between">
        <div>
          <!-- Thông tin Phụ huynh & Số dư -->
          <div class="bg-light p-3 rounded mb-3 border">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="text-muted small">Phụ huynh:</span>
              <strong class="text-dark">{{ phuhuynh.name }}</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="text-muted small">Mã phụ huynh:</span>
              <span class="badge badge-secondary">{{ phuhuynh.code || 'N/A' }}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="text-muted small">Công nợ hiện tại:</span>
              <strong :class="phuhuynh.debt > 0 ? 'text-danger' : 'text-success'">
                {{ numberWithCommas(phuhuynh.debt || 0) }} đ
              </strong>
            </div>
            <div class="d-flex justify-content-between align-items-center" v-if="phuhuynh.balance">
              <span class="text-muted small">Số dư ví khả dụng:</span>
              <strong class="text-success">+{{ numberWithCommas(phuhuynh.balance) }} đ</strong>
            </div>
          </div>

            <!-- Nhập số tiền thu -->
            <div class="form-group mb-3">
              <label class="font-weight-bold small text-dark d-flex justify-content-between">
                <span>Số tiền thu / nạp vào ví (VND) *</span>
                <span v-if="purcharNum > 0" class="text-primary font-weight-normal">
                  Còn lại: <strong>{{ numberWithCommas(Math.max(0, (phuhuynh.debt || 0) - purcharNum)) }} đ</strong>
                </span>
              </label>
              <InputCurrency
                v-model="purchar"
                placeholder="Nhập số tiền..."
                inputClass="font-weight-bold text-success text-right text-large"
              />

              <!-- Gợi ý số tiền nhanh -->
            <div class="d-flex flex-wrap gap-1 mt-2">
              <button
                v-if="phuhuynh.debt > 0"
                type="button"
                class="btn btn-outline-danger btn-sm rounded-pill py-0 px-2 mr-1 mb-1 small"
                @click="purchar = phuhuynh.debt"
              >
                Đóng đủ nợ ({{ numberWithCommas(phuhuynh.debt) }} đ)
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary btn-sm rounded-pill py-0 px-2 mr-1 mb-1 small"
                @click="purchar = 1000000"
              >
                1.000.000 đ
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary btn-sm rounded-pill py-0 px-2 mr-1 mb-1 small"
                @click="purchar = 2000000"
              >
                2.000.000 đ
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary btn-sm rounded-pill py-0 px-2 mb-1 small"
                @click="purchar = 3000000"
              >
                3.000.000 đ
              </button>
            </div>
          </div>

          <!-- Phương thức thu -->
          <div class="form-group mb-3">
            <label class="font-weight-bold small text-dark">Hình thức ghi nhận</label>
            <div>
              <div class="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="method-cash"
                  value="CASH"
                  v-model="paymentMethod"
                  class="custom-control-input"
                />
                <label class="custom-control-label small" for="method-cash">Tiền mặt tại trường</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline">
                <input
                  type="radio"
                  id="method-bank"
                  value="BANK_TRANSFER"
                  v-model="paymentMethod"
                  class="custom-control-input"
                />
                <label class="custom-control-label small" for="method-bank">Chuyển khoản thủ công</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Nút hành động -->
        <div class="pt-3 border-top mt-2">
          <button
            type="button"
            class="btn btn-success btn-block rounded-pill py-2 shadow-sm font-weight-bold"
            :disabled="!purcharNum || purcharNum <= 0 || submitting"
            @click="createPhieuThu()"
          >
            <b-spinner v-if="submitting" small class="mr-1"></b-spinner>
            <i v-else class="fas fa-check-circle mr-1"></i>
            Xác nhận Ghi nhận {{ purcharNum > 0 ? numberWithCommas(purcharNum) + ' đ' : '' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import InputCurrency from '~/components/Common/InputCurrency.vue';

export default {
  components: {
    InputCurrency,
  },
  props: ['phuhuynh'],
  data() {
    return {
      purchar: '',
      paymentMethod: 'CASH',
      submitting: false,
    };
  },
  computed: {
    purcharNum() {
      const val = parseInt(this.purchar, 10);
      return isNaN(val) ? 0 : val;
    },
    qrContent() {
      if (this.phuhuynh && this.phuhuynh.code) {
        return this.phuhuynh.code.trim();
      }
      return 'PH000000';
    },
    vietqrUrl() {
      const bankCode = 'ACB';
      const accountNo = '77229966';
      const accountName = encodeURIComponent('TRUONG MAM NON NGOC HOANG');
      const addInfo = encodeURIComponent(this.qrContent);

      let url = `https://img.vietqr.io/image/${bankCode}-${accountNo}-print.png?accountName=${accountName}&addInfo=${addInfo}`;
      if (this.purcharNum > 0) {
        url += `&amount=${this.purcharNum}`;
      } else if (this.phuhuynh && this.phuhuynh.debt > 0) {
        url += `&amount=${this.phuhuynh.debt}`;
      }
      return url;
    },
  },
  watch: {
    phuhuynh: {
      handler(newVal) {
        if (newVal && newVal.debt > 0) {
          this.purchar = newVal.debt;
        } else {
          this.purchar = '';
        }
      },
      immediate: true,
    },
  },
  methods: {
    numberWithCommas(x) {
      if (!x && x !== 0) return '0';
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
    copyText(text, label) {
      if (!text) return;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          this.$bvToast.toast(`Đã sao chép ${label}: ${text}`, {
            variant: 'info',
            solid: true,
            autoHideDelay: 2000,
          });
        });
      }
    },
    async createPhieuThu() {
      if (!this.purcharNum || this.purcharNum <= 0) return;
      this.submitting = true;
      const client = this.$apolloProvider.defaultClient;

      try {
        await client.mutate({
          mutation: gql`
            mutation CreatePhieuThu($data: PhieuThuCreateInput!) {
              createPhieuThu(data: $data) {
                id
                total
              }
            }
          `,
          variables: {
            data: {
              total: this.purcharNum,
              parent: {
                connect: {
                  id: this.phuhuynh.id,
                },
              },
              createdAt: new Date().toISOString(),
            },
          },
        });

        this.$bvToast.toast(`Ghi nhận thu ${this.numberWithCommas(this.purcharNum)} đ thành công`, {
          title: 'Thành công',
          variant: 'success',
          solid: true,
          autoHideDelay: 3000,
        });

        this.$emit('update-state', 'CREATED');
      } catch (err) {
        console.error('Lỗi khi tạo phiếu thu:', err);
        this.$bvToast.toast('Không thể ghi nhận phiếu thu, vui lòng kiểm tra lại.', {
          title: 'Lỗi',
          variant: 'danger',
          solid: true,
        });
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.qr-img {
  max-height: 220px;
  object-fit: contain;
}
.btn-xs {
  font-size: 0.72rem;
  line-height: 1.2;
}
::v-deep .text-large {
  font-size: 1.15rem !important;
}
@media (min-width: 768px) {
  .border-md-right {
    border-right: 1px solid #dee2e6;
  }
}
</style>
