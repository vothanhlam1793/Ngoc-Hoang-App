<template>
  <div class="debt-detail-container" v-if="phuhuynh">
    <!-- 1. Header Card: Hồ sơ Phụ huynh & 2 Thẻ KPI Tài chính lớn -->
    <div class="card border-0 shadow-sm bg-white p-3 p-md-4 mb-3 rounded-12">
      <div class="row align-items-center">
        <!-- Thông tin Phụ huynh bên trái -->
        <div class="col-lg-6 mb-3 mb-lg-0">
          <div class="d-flex align-items-center">
            <div class="avatar-ph mr-3 shadow-sm text-white">
              <i class="fas fa-user"></i>
            </div>
            <div>
              <div class="d-flex align-items-center flex-wrap mb-1">
                <h5 class="font-weight-bold text-dark mb-0 mr-2">{{ phuhuynh.name }}</h5>
                <span class="badge badge-light border text-secondary font-weight-normal px-2 py-1">
                  Mã: <strong>{{ phuhuynh.code || 'N/A' }}</strong>
                </span>
              </div>
              <div class="text-muted small">
                <span v-if="phuhuynh.phone && phuhuynh.phone.length" class="mr-3">
                  <i class="fas fa-phone-alt text-success mr-1"></i>
                  <strong>{{ phuhuynh.phone.map(p => p.number || p).join(', ') }}</strong>
                </span>
                <span v-if="phuhuynh.hocsinhs && phuhuynh.hocsinhs.length">
                  <i class="fas fa-child text-info mr-1"></i>
                  <span>Con: {{ phuhuynh.hocsinhs.map(h => h.name).join(', ') }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2 KPI Cards nổi bật bên phải -->
        <div class="col-lg-6">
          <div class="row no-gutters">
            <div class="col-6 pr-2">
              <div class="kpi-box kpi-box-balance p-3 rounded-lg text-right">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="badge badge-pill badge-success-soft font-weight-normal small">Ví Khả Dụng</span>
                  <i class="fas fa-wallet text-success opacity-75"></i>
                </div>
                <div class="kpi-amount text-success font-weight-bold">
                  +{{ numberWithCommas(phuhuynh.balance || 0) }} đ
                </div>
                <div class="kpi-subtext text-muted">Số dư tiền đóng trước</div>
              </div>
            </div>

            <div class="col-6 pl-2">
              <div class="kpi-box kpi-box-debt p-3 rounded-lg text-right">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="badge badge-pill badge-danger-soft font-weight-normal small">Học Phí Còn Nợ</span>
                  <i class="fas fa-file-invoice-dollar text-danger opacity-75"></i>
                </div>
                <div :class="['kpi-amount font-weight-bold', phuhuynh.debt > 0 ? 'text-danger' : 'text-success']">
                  {{ numberWithCommas(phuhuynh.debt || 0) }} đ
                </div>
                <div class="kpi-subtext text-muted">Tài khoản 131 Phải thu</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Action Toolbar: Các tác vụ kế toán riêng biệt -->
      <div class="action-toolbar mt-3 pt-3 border-top d-flex flex-column flex-sm-row justify-content-between align-items-sm-center">
        <div class="small text-muted mb-2 mb-sm-0">
          <i class="fas fa-shield-alt text-primary mr-1"></i>
          Nghiệp vụ hạch toán độc lập giữa <strong>Số dư ví</strong> và <strong>Công nợ</strong>
        </div>

        <div class="d-flex align-items-center flex-wrap">
          <!-- 1. Thu tiền & Quét VietQR -->
          <button
            type="button"
            class="btn btn-success rounded-pill px-3 py-2 mr-2 shadow-sm font-weight-bold d-flex align-items-center"
            @click="showCreatePaymentModal = true"
          >
            <i class="fas fa-qrcode mr-2"></i> Thu tiền & VietQR
          </button>

          <!-- 2. Cấn trừ nợ từ Ví sang Nợ -->
          <button
            type="button"
            class="btn btn-info text-white rounded-pill px-3 py-2 mr-2 shadow-sm font-weight-bold d-flex align-items-center"
            :disabled="!phuhuynh.balance || phuhuynh.balance <= 0 || !phuhuynh.debt || phuhuynh.debt <= 0"
            @click="openSettleModal"
            title="Trích tiền từ số dư ví để gạch nợ học phí"
          >
            <i class="fas fa-arrow-right-arrow-left mr-2"></i> Cấn trừ nợ
          </button>

          <!-- 3. Chi hoàn tiền -->
          <button
            type="button"
            class="btn btn-outline-danger rounded-pill px-3 py-2 shadow-sm font-weight-bold d-flex align-items-center"
            :disabled="!phuhuynh.balance || phuhuynh.balance <= 0"
            @click="openRefundModal"
            title="Chi trả lại tiền thừa từ số dư ví"
          >
            <i class="fas fa-hand-holding-dollar mr-2"></i> Hoàn tiền
          </button>
        </div>
      </div>
    </div>

    <!-- 3. Bảng Lịch sử biến động & Chứng từ -->
    <div class="card border-0 shadow-sm bg-white rounded-12">
      <div class="card-header bg-white font-weight-bold d-flex justify-content-between align-items-center py-3 border-bottom">
        <div class="d-flex align-items-center">
          <i class="fas fa-history text-primary mr-2 fs-5"></i>
          <div>
            <span class="text-dark font-weight-bold">Lịch Sử Biến Động & Chứng Từ Hạch Toán</span>
            <small class="text-muted d-block font-weight-normal">Theo dõi chi tiết dòng tiền thu/chi và các đợt cấn trừ nợ</small>
          </div>
        </div>
        <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="fetchFullHistory">
          <i class="fas fa-sync-alt mr-1"></i> Làm mới
        </button>
      </div>

      <div class="card-body p-0">
        <div v-if="!historyItems || !historyItems.length" class="text-center py-5 text-muted">
          <i class="fas fa-file-invoice fa-3x mb-3 d-block text-secondary opacity-25"></i>
          <h6 class="text-secondary font-weight-bold">Chưa có giao dịch biến động</h6>
          <p class="small text-muted mb-0">Hồ sơ phụ huynh này chưa có phiếu thu, chi hoặc hóa đơn nào được ghi nhận.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0 custom-datatable">
            <thead class="bg-light text-secondary small text-uppercase">
              <tr>
                <th style="width: 14%;" class="pl-3">NGÀY GIAO DỊCH</th>
                <th style="width: 13%;">MÃ CHỨNG TỪ</th>
                <th style="width: 38%;">LOẠI PHIẾU / NỘI DUNG CHI TIẾT</th>
                <th style="width: 18%;" class="text-right">SỐ TIỀN BIẾN ĐỘNG</th>
                <th style="width: 17%;" class="text-center pr-3">PHÂN LOẠI THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in historyItems" :key="idx">
                <td class="small text-muted pl-3">
                  <i class="far fa-calendar-alt mr-1 text-secondary"></i>
                  {{ showDate(item.date) }}
                </td>
                <td>
                  <span class="badge badge-light border text-dark font-weight-normal px-2 py-1">
                    {{ item.code || 'N/A' }}
                  </span>
                </td>
                <td>
                  <div class="font-weight-bold text-dark">{{ item.title }}</div>
                  <small class="text-muted" v-if="item.note">{{ item.note }}</small>
                </td>
                <td class="text-right font-weight-bold">
                  <span :class="item.amountClass" class="amount-badge">
                    {{ item.amountSign }}{{ numberWithCommas(item.amount) }} đ
                  </span>
                </td>
                <td class="text-center pr-3">
                  <span :class="['badge badge-pill font-weight-normal px-3 py-1', item.badgeClass]">
                    {{ item.typeLabel }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Thu tiền Phụ huynh tích hợp VietQR -->
    <b-modal
      v-model="showCreatePaymentModal"
      size="lg"
      title="Thu Tiền Học Phí & VietQR Phụ Huynh"
      hide-footer
    >
      <div class="p-1">
        <PhieuThuCreate
          :phuhuynh="phuhuynh"
          @update-state="createPhieuThu"
        />
      </div>
    </b-modal>

    <!-- Modal Cấn trừ nợ từ Balance sang Debt -->
    <b-modal
      v-model="showSettleModal"
      title="Cấn Trừ Nợ Từ Số Dư Ví (Balance -> Debt)"
      hide-footer
    >
      <div class="p-2" v-if="phuhuynh">
        <div class="alert alert-info py-2 small mb-3">
          <i class="fas fa-info-circle mr-1"></i>
          Thao tác này sẽ trích tiền từ <strong>Số dư ví</strong> (+{{ numberWithCommas(phuhuynh.balance || 0) }} đ) để gạch nợ cho <strong>Công nợ</strong> ({{ numberWithCommas(phuhuynh.debt || 0) }} đ).
        </div>

        <div class="form-group mb-3">
          <label class="font-weight-bold small">Số tiền cấn trừ (VNĐ)</label>
          <InputCurrency
            v-model="settleForm.amount"
            :max="maxSettleAmount"
            placeholder="Nhập số tiền cần cấn trừ..."
          />
          <small class="text-muted">Tối đa có thể cấn trừ: <strong>{{ numberWithCommas(maxSettleAmount) }} đ</strong></small>
        </div>

        <div class="form-group mb-3">
          <label class="font-weight-bold small">Hình thức thao tác</label>
          <select class="form-control" v-model="settleForm.settleType">
            <option value="SCHOOL_TRANSFER">Trường chuyển cấn trừ</option>
            <option value="PARENT_TRANSFER">Phụ huynh chuyển cấn trừ</option>
            <option value="MANUAL_ACCOUNTANT">Kế toán gạch nợ thủ công</option>
          </select>
        </div>

        <div class="form-group mb-4">
          <label class="font-weight-bold small">Ghi chú chứng từ</label>
          <input
            type="text"
            class="form-control"
            v-model="settleForm.note"
            placeholder="Ví dụ: Cấn trừ học phí tháng 09/2026"
          />
        </div>

        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary mr-2 rounded-pill px-4" @click="showSettleModal = false">Hủy</button>
          <button class="btn btn-primary font-weight-bold rounded-pill px-4" :disabled="settling" @click="executeSettle">
            <i class="fas fa-check mr-1"></i> {{ settling ? 'Đang xử lý...' : 'Xác nhận Cấn trừ' }}
          </button>
        </div>
      </div>
    </b-modal>

    <!-- Modal Chi Hoàn Tiền -->
    <b-modal
      v-model="showRefundModal"
      title="Lập Phiếu Chi Hoàn Tiền Thừa Cho Phụ Huynh"
      hide-footer
    >
      <div class="p-2" v-if="phuhuynh">
        <div class="alert alert-warning py-2 small mb-3">
          <i class="fas fa-exclamation-triangle mr-1"></i>
          Rút tiền mặt/chuyển khoản từ <strong>Số dư ví</strong> (+{{ numberWithCommas(phuhuynh.balance || 0) }} đ) để hoàn trả cho phụ huynh.
        </div>

        <div class="form-group mb-3">
          <label class="font-weight-bold small">Số tiền hoàn trả (VNĐ)</label>
          <InputCurrency
            v-model="refundForm.amount"
            :max="phuhuynh.balance || 0"
            placeholder="Nhập số tiền hoàn..."
          />
          <small class="text-muted">Số dư ví khả dụng: <strong>{{ numberWithCommas(phuhuynh.balance || 0) }} đ</strong></small>
        </div>

        <div class="form-group mb-3">
          <label class="font-weight-bold small">Phương thức hoàn tiền</label>
          <select class="form-control" v-model="refundForm.paymentMethod">
            <option value="CASH">Tiền mặt tại trường</option>
            <option value="ACB_BANK">Chuyển khoản ACB</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>

        <div class="form-group mb-4">
          <label class="font-weight-bold small">Lý do hoàn trả *</label>
          <input
            type="text"
            class="form-control"
            v-model="refundForm.reason"
            placeholder="Ví dụ: Hoàn tiền ăn xế/thôi học"
            required
          />
        </div>

        <div class="d-flex justify-content-end">
          <button class="btn btn-secondary mr-2 rounded-pill px-4" @click="showRefundModal = false">Hủy</button>
          <button class="btn btn-danger font-weight-bold rounded-pill px-4" :disabled="refunding" @click="executeRefund">
            <i class="fas fa-hand-holding-dollar mr-1"></i> {{ refunding ? 'Đang xử lý...' : 'Xác nhận Chi tiền' }}
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import PhieuThuCreate from '~/components/PhieuThu/Create.vue';
import InputCurrency from '~/components/Common/InputCurrency.vue';

export default {
  components: {
    PhieuThuCreate,
    InputCurrency,
  },
  props: ['idPhuHuynh', 'loadData'],
  data() {
    return {
      phuhuynh: null,
      historyItems: [],
      showCreatePaymentModal: false,
      showSettleModal: false,
      showRefundModal: false,
      settling: false,
      refunding: false,
      settleForm: {
        amount: 0,
        settleType: 'SCHOOL_TRANSFER',
        note: '',
      },
      refundForm: {
        amount: 0,
        paymentMethod: 'CASH',
        reason: '',
      },
    };
  },
  computed: {
    maxSettleAmount() {
      if (!this.phuhuynh) return 0;
      return Math.min(this.phuhuynh.balance || 0, this.phuhuynh.debt || 0);
    },
  },
  methods: {
    openSettleModal() {
      this.settleForm.amount = this.maxSettleAmount;
      this.settleForm.note = 'Trường chuyển cấn trừ nợ từ số dư ví';
      this.showSettleModal = true;
    },
    openRefundModal() {
      this.refundForm.amount = this.phuhuynh?.balance || 0;
      this.refundForm.reason = 'Hoàn trả số dư ví cho phụ huynh';
      this.showRefundModal = true;
    },
    async executeSettle() {
      if (!this.settleForm.amount || this.settleForm.amount <= 0) return;
      this.settling = true;
      const client = this.$apolloProvider.defaultClient;

      try {
        const createSettlementQuery = gql`
          mutation CreateSettlement($data: PaymentSettlementCreateInput!) {
            createPaymentSettlement(data: $data) {
              id
              code
              amount
            }
          }
        `;

        await client.mutate({
          mutation: createSettlementQuery,
          variables: {
            data: {
              parent: { connect: { id: this.idPhuHuynh } },
              amount: parseInt(this.settleForm.amount, 10),
              settleType: this.settleForm.settleType,
              status: 'SUCCESS',
              note: this.settleForm.note || 'Cấn trừ nợ từ số dư ví',
            },
          },
        });

        const newBalance = Math.max(0, (this.phuhuynh.balance || 0) - this.settleForm.amount);
        const newDebt = Math.max(0, (this.phuhuynh.debt || 0) - this.settleForm.amount);

        await client.mutate({
          mutation: gql`
            mutation UpdateParent($id: ID!, $balance: Int!, $debt: Int!) {
              updateParent(id: $id, data: { balance: $balance, debt: $debt }) {
                id
                balance
                debt
              }
            }
          `,
          variables: {
            id: this.idPhuHuynh,
            balance: newBalance,
            debt: newDebt,
          },
        });

        this.$bvToast.toast(`Đã cấn trừ ${this.numberWithCommas(this.settleForm.amount)} đ thành công!`, {
          title: 'Thành công',
          variant: 'success',
          solid: true,
        });

        this.showSettleModal = false;
        await this.fetchFullHistory();
      } catch (err) {
        console.error('Lỗi khi cấn trừ nợ:', err);
        this.$bvToast.toast('Không thể thực hiện cấn trừ nợ.', {
          title: 'Lỗi',
          variant: 'danger',
          solid: true,
        });
      } finally {
        this.settling = false;
      }
    },
    async executeRefund() {
      if (!this.refundForm.amount || this.refundForm.amount <= 0) return;
      this.refunding = true;
      const client = this.$apolloProvider.defaultClient;

      try {
        await client.mutate({
          mutation: gql`
            mutation CreateCashTx($data: CashTransactionCreateInput!) {
              createCashTransaction(data: $data) {
                id
                code
              }
            }
          `,
          variables: {
            data: {
              type: 'OUTFLOW',
              amount: parseInt(this.refundForm.amount, 10),
              paymentMethod: this.refundForm.paymentMethod,
              bankDescription: this.refundForm.reason || 'Chi hoàn tiền phụ huynh',
              status: 'SETTLED',
              parent: { connect: { id: this.idPhuHuynh } },
            },
          },
        });

        const newBalance = Math.max(0, (this.phuhuynh.balance || 0) - this.refundForm.amount);
        await client.mutate({
          mutation: gql`
            mutation UpdateParentBalance($id: ID!, $balance: Int!) {
              updateParent(id: $id, data: { balance: $balance }) {
                id
                balance
              }
            }
          `,
          variables: {
            id: this.idPhuHuynh,
            balance: newBalance,
          },
        });

        this.$bvToast.toast(`Đã lập phiếu chi hoàn tiền ${this.numberWithCommas(this.refundForm.amount)} đ thành công!`, {
          title: 'Thành công',
          variant: 'success',
          solid: true,
        });

        this.showRefundModal = false;
        await this.fetchFullHistory();
      } catch (err) {
        console.error('Lỗi khi hoàn tiền:', err);
        this.$bvToast.toast('Không thể lập phiếu chi hoàn tiền.', {
          title: 'Lỗi',
          variant: 'danger',
          solid: true,
        });
      } finally {
        this.refunding = false;
      }
    },
    async fetchFullHistory() {
      if (!this.idPhuHuynh) return;
      const client = this.$apolloProvider.defaultClient;

      try {
        const pRes = await client.query({
          query: gql`
            query GetParentDetail($id: ID!) {
              Parent(where: { id: $id }) {
                id
                code
                name
                debt
                balance
                phone {
                  number
                }
                hocsinhs {
                  id
                  name
                }
              }
            }
          `,
          variables: { id: this.idPhuHuynh },
          fetchPolicy: 'network-only',
        });
        if (pRes.data?.Parent) {
          this.phuhuynh = pRes.data.Parent;
        }

        const ctRes = await client.query({
          query: gql`
            query GetParentCashTxs($parentId: ID!) {
              allCashTransactions(where: { parent: { id: $parentId } }, sortBy: createdAt_DESC) {
                id
                code
                type
                amount
                paymentMethod
                bankDescription
                status
                createdAt
              }
            }
          `,
          variables: { parentId: this.idPhuHuynh },
          fetchPolicy: 'network-only',
        });

        const stRes = await client.query({
          query: gql`
            query GetParentSettlements($parentId: ID!) {
              allPaymentSettlements(where: { parent: { id: $parentId } }, sortBy: settledAt_DESC) {
                id
                code
                amount
                settleType
                status
                note
                settledAt
              }
            }
          `,
          variables: { parentId: this.idPhuHuynh },
          fetchPolicy: 'network-only',
        });

        const hdRes = await client.query({
          query: gql`
            query GetParentHoaDons($parentId: ID!) {
              allHoaDons(where: { parent: { id: $parentId } }, sortBy: createdAt_DESC) {
                id
                code
                total
                type
                createdAt
              }
            }
          `,
          variables: { parentId: this.idPhuHuynh },
          fetchPolicy: 'network-only',
        });

        const items = [];

        (ctRes.data?.allCashTransactions || []).forEach((ct) => {
          const isOut = ct.type === 'OUTFLOW';
          items.push({
            date: ct.createdAt,
            code: ct.code,
            title: isOut ? 'Phiếu Chi Hoàn Tiền' : 'Phiếu Thu Tiền Mặt / ACB',
            note: ct.bankDescription,
            amount: ct.amount,
            amountSign: isOut ? '-' : '+',
            amountClass: isOut ? 'text-danger' : 'text-success',
            typeLabel: isOut ? 'CHI TIỀN MẶT' : (ct.paymentMethod === 'ACB_BANK' ? 'ACB BANK' : 'TIỀN MẶT'),
            badgeClass: isOut ? 'badge-danger' : 'badge-success',
          });
        });

        (stRes.data?.allPaymentSettlements || []).forEach((st) => {
          let typeLabel = 'CẤN TRỪ NỢ';
          if (st.settleType === 'AUTO_ACB') typeLabel = 'TỰ ĐỘNG ACB';
          if (st.settleType === 'SCHOOL_TRANSFER') typeLabel = 'TRƯỜNG CHUYỂN';
          if (st.settleType === 'PARENT_TRANSFER') typeLabel = 'PHỤ HUYNH CHUYỂN';

          items.push({
            date: st.settledAt,
            code: st.code,
            title: 'Nghiệp vụ Cấn trừ nợ (Ví -> Nợ)',
            note: st.note,
            amount: st.amount,
            amountSign: '⇄ ',
            amountClass: 'text-info',
            typeLabel,
            badgeClass: 'badge-info',
          });
        });

        (hdRes.data?.allHoaDons || []).forEach((hd) => {
          items.push({
            date: hd.createdAt,
            code: hd.code,
            title: 'Hóa đơn dịch vụ / Bán lẻ',
            note: hd.type === 'THANHTOAN' ? 'Thanh toán ngay tại quầy' : 'Ghi nợ',
            amount: hd.total,
            amountSign: '+',
            amountClass: 'text-dark',
            typeLabel: 'PHÁT SINH NỢ',
            badgeClass: 'badge-warning text-dark',
          });
        });

        items.sort((a, b) => new Date(b.date) - new Date(a.date));
        this.historyItems = items;
      } catch (err) {
        console.error('Lỗi khi tải lịch sử:', err);
      }
    },
    createPhieuThu(state) {
      if (state === 'CREATED') {
        this.showCreatePaymentModal = false;
        this.fetchFullHistory();
        this.$bvToast.toast('Tạo phiếu thu thành công', {
          title: 'Thành công',
          variant: 'success',
          solid: true,
        });
      }
    },
    showDate(d) {
      if (!d) return '';
      const d1 = new Date(d);
      return `${String(d1.getDate()).padStart(2, '0')}/${String(d1.getMonth() + 1).padStart(2, '0')}/${d1.getFullYear()}`;
    },
    numberWithCommas(x) {
      if (!x && x !== 0) return '0';
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
  },
  watch: {
    idPhuHuynh: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchFullHistory();
        }
      },
    },
    loadData() {
      this.fetchFullHistory();
    },
  },
};
</script>

<style scoped>
.rounded-12 {
  border-radius: 12px !important;
}

.avatar-ph {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%);
}

.kpi-box {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  transition: all 0.2s ease;
}

.kpi-box-balance {
  border-left: 4px solid #10b981;
  background: #f0fdf4;
}

.kpi-box-debt {
  border-left: 4px solid #ef4444;
  background: #fef2f2;
}

.badge-success-soft {
  background-color: #dcfce7;
  color: #15803d;
}

.badge-danger-soft {
  background-color: #fee2e2;
  color: #b91c1c;
}

.kpi-amount {
  font-size: 1.35rem;
  line-height: 1.2;
}

.kpi-subtext {
  font-size: 0.75rem;
}

.action-toolbar {
  background-color: #ffffff;
}

.custom-datatable th {
  border-top: none;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.custom-datatable td {
  vertical-align: middle;
  padding: 0.85rem 0.75rem;
}

.amount-badge {
  font-size: 0.95rem;
}
</style>
