<template>
  <div class="debt-detail-container" v-if="phuhuynh">
    <!-- Header Thông tin Phụ huynh & Tổng quan Tài chính -->
    <div class="card border-0 shadow-sm bg-white p-3 mb-3 rounded-lg">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
        <div class="mb-3 mb-md-0">
          <div class="d-flex align-items-center">
            <div class="avatar-ph mr-2 bg-primary text-white">
              <i class="fas fa-user"></i>
            </div>
            <div>
              <h5 class="font-weight-bold text-dark mb-0">{{ phuhuynh.name }}</h5>
              <small class="text-muted">
                Mã PH: <strong class="text-secondary">{{ phuhuynh.code || 'N/A' }}</strong>
                <span v-if="phuhuynh.phone && phuhuynh.phone.length" class="ml-2">
                  <i class="fas fa-phone mr-1"></i>{{ phuhuynh.phone.map(p => p.number || p).join(', ') }}
                </span>
              </small>
            </div>
          </div>
        </div>

        <!-- 2 KPI Cards: Nợ & Số dư ví + Action Buttons -->
        <div class="d-flex align-items-center flex-wrap">
          <div class="kpi-mini-card bg-light px-3 py-2 rounded mr-2 text-right">
            <small class="text-muted d-block font-weight-bold">SỐ DƯ VÍ (BALANCE)</small>
            <strong class="text-success font-weight-bold">
              +{{ numberWithCommas(phuhuynh.balance || 0) }} đ
            </strong>
          </div>
          <div class="kpi-mini-card bg-light px-3 py-2 rounded mr-3 text-right">
            <small class="text-muted d-block font-weight-bold">CÒN NỢ (DEBT - 131)</small>
            <strong :class="phuhuynh.debt > 0 ? 'text-danger' : 'text-success'" class="font-weight-bold">
              {{ numberWithCommas(phuhuynh.debt || 0) }} đ
            </strong>
          </div>

          <div class="btn-group shadow-sm">
            <!-- Nút Thu tiền / Nạp ví -->
            <button
              type="button"
              class="btn btn-success rounded-left px-3 font-weight-bold"
              @click="showCreatePaymentModal = true"
            >
              <i class="fas fa-plus mr-1"></i> Thu tiền
            </button>

            <!-- Nút Cấn trừ nợ (Chuyển tiền từ Balance sang Debt) -->
            <button
              type="button"
              class="btn btn-info text-white px-3 font-weight-bold"
              :disabled="!phuhuynh.balance || phuhuynh.balance <= 0 || !phuhuynh.debt || phuhuynh.debt <= 0"
              @click="openSettleModal"
              title="Chuyển tiền từ số dư ví để cấn trừ nợ"
            >
              <i class="fas fa-arrow-right-arrow-left mr-1"></i> Cấn trừ nợ
            </button>

            <!-- Nút Chi hoàn tiền -->
            <button
              type="button"
              class="btn btn-outline-danger px-3 font-weight-bold"
              :disabled="!phuhuynh.balance || phuhuynh.balance <= 0"
              @click="openRefundModal"
              title="Chi trả lại tiền thừa từ số dư ví cho phụ huynh"
            >
              <i class="fas fa-hand-holding-dollar mr-1"></i> Hoàn tiền
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bảng Sổ nợ & Lịch sử biến động -->
    <div class="card border-0 shadow-sm bg-white rounded-lg">
      <div class="card-header bg-white font-weight-bold d-flex justify-content-between align-items-center py-3 border-bottom">
        <div>
          <i class="fas fa-history text-primary mr-2"></i> Lịch Sử Giao Dịch, Chứng Từ & Cấn Trừ Nợ
        </div>
        <button class="btn btn-sm btn-outline-secondary" @click="fetchFullHistory">
          <i class="fas fa-sync-alt mr-1"></i> Làm mới
        </button>
      </div>
      <div class="card-body p-0">
        <div v-if="!historyItems || !historyItems.length" class="text-center py-4 text-muted">
          <i class="fas fa-file-invoice fa-2x mb-2 d-block text-secondary opacity-50"></i>
          Chưa có giao dịch biến động nào được ghi nhận.
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-muted small">
              <tr>
                <th style="width: 14%;">NGÀY</th>
                <th style="width: 12%;">MÃ CHỨNG TỪ</th>
                <th style="width: 38%;">LOẠI PHIẾU / NỘI DUNG</th>
                <th style="width: 18%;" class="text-right">SỐ TIỀN</th>
                <th style="width: 18%;" class="text-center">PHÂN LOẠI THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in historyItems" :key="idx">
                <td class="small text-muted">{{ showDate(item.date) }}</td>
                <td>
                  <span class="badge badge-light border text-dark font-weight-normal">{{ item.code || 'N/A' }}</span>
                </td>
                <td>
                  <div class="font-weight-bold text-dark">{{ item.title }}</div>
                  <small class="text-muted" v-if="item.note">{{ item.note }}</small>
                </td>
                <td class="text-right font-weight-bold">
                  <span :class="item.amountClass">
                    {{ item.amountSign }}{{ numberWithCommas(item.amount) }} đ
                  </span>
                </td>
                <td class="text-center">
                  <span :class="['badge', item.badgeClass]">{{ item.typeLabel }}</span>
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
          <input
            type="number"
            class="form-control"
            v-model.number="settleForm.amount"
            :max="maxSettleAmount"
            min="1000"
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
          <button class="btn btn-secondary mr-2" @click="showSettleModal = false">Hủy</button>
          <button class="btn btn-primary font-weight-bold" :disabled="settling" @click="executeSettle">
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
          <input
            type="number"
            class="form-control"
            v-model.number="refundForm.amount"
            :max="phuhuynh.balance || 0"
            min="1000"
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
          <button class="btn btn-secondary mr-2" @click="showRefundModal = false">Hủy</button>
          <button class="btn btn-danger font-weight-bold" :disabled="refunding" @click="executeRefund">
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

export default {
  components: {
    PhieuThuCreate,
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
    phuhuynhById() {
      return this.$store.state.phuhuynhv2.phuhuynhById;
    },
    monitorPhuhuynh() {
      return this.$store.state.phuhuynhv2.monitor;
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

        // Cập nhật lại balance và debt của Phụ huynh
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
        // Tạo CashTransaction OUTFLOW
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

        // Trừ balance
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
        // 1. Tải lại chi tiết Phụ huynh
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
              }
            }
          `,
          variables: { id: this.idPhuHuynh },
          fetchPolicy: 'network-only',
        });
        if (pRes.data?.Parent) {
          this.phuhuynh = pRes.data.Parent;
        }

        // 2. Tải Sổ cái Dòng tiền (CashTransaction)
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

        // 3. Tải Lịch sử Cấn trừ (PaymentSettlement)
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

        // 4. Tải Hóa đơn & Kết sổ tháng
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

        // Map Cash Transactions
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

        // Map Settlements
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

        // Map Hóa đơn
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

        // Sắp xếp theo ngày giảm dần
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
.avatar-ph {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}
.kpi-mini-card {
  border: 1px solid #e2e8f0;
  min-width: 140px;
}
</style>
