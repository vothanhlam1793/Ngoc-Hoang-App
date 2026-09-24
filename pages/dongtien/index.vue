<template>
  <div class="container-fluid py-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4><i class="fas fa-money-bill-wave text-success mr-2"></i>Sổ cái Dòng tiền & Gạch nợ</h4>
      <div>
        <button class="btn btn-outline-success mr-2" @click="exportToExcel">
          <i class="fas fa-file-excel mr-1"></i>Xuất Excel
        </button>
        <button class="btn btn-success" @click="openModalAddCash">
          <i class="fas fa-plus mr-1"></i>Ghi nhận Thu tiền mặt / Bank
        </button>
      </div>
    </div>

    <!-- Bộ lọc & Thống kê nhanh -->
    <div class="row mb-3">
      <div class="col-md-4">
        <div class="card bg-light border-0 shadow-sm p-3">
          <small class="text-muted">Tổng dòng tiền thu</small>
          <h4 class="text-success mb-0">{{ formatCurrency(totalInflow) }}</h4>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-light border-0 shadow-sm p-3">
          <small class="text-muted">Đã gạch nợ thành công</small>
          <h4 class="text-primary mb-0">{{ formatCurrency(totalSettled) }}</h4>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-light border-0 shadow-sm p-3">
          <small class="text-muted">Chờ xử lý / Chưa gán Phụ huynh</small>
          <h4 class="text-warning mb-0">{{ formatCurrency(totalPending) }}</h4>
        </div>
      </div>
    </div>

    <!-- Tabs: Dòng tiền & Lịch sử gạch nợ -->
    <b-tabs content-class="mt-3" fill>
      <b-tab title="Sổ cái Biến động Dòng tiền" active>
        <div class="card shadow-sm">
          <div class="card-body p-0">
            <b-table
              hover
              responsive
              :items="cashTransactions"
              :fields="cashFields"
              :busy="loading"
            >
              <template #table-busy>
                <div class="text-center my-3 text-muted">
                  <b-spinner small class="mr-2"></b-spinner>Đang tải dòng tiền...
                </div>
              </template>

              <template #cell(amount)="data">
                <span class="font-weight-bold text-success">
                  +{{ formatCurrency(data.item.amount) }}
                </span>
              </template>

              <template #cell(parent)="data">
                <div v-if="data.item.parent">
                  <strong>{{ data.item.parent.name }}</strong>
                  <div class="small text-muted">{{ data.item.parent.code }}</div>
                </div>
                <span v-else class="badge bg-warning text-dark">Chưa gán</span>
              </template>

              <template #cell(status)="data">
                <span v-if="data.item.status === 'SETTLED'" class="badge bg-success text-white">Đã gạch nợ</span>
                <span v-else-if="data.item.status === 'PARTIALLY_SETTLED'" class="badge bg-info text-white">Gạch nợ 1 phần</span>
                <span v-else-if="data.item.status === 'UNALLOCATED'" class="badge bg-warning text-dark">Sai mã / Chưa gán</span>
                <span v-else class="badge bg-secondary text-white">{{ data.item.status }}</span>
              </template>

              <template #cell(createdAt)="data">
                {{ formatDateTime(data.item.createdAt) }}
              </template>

              <template #cell(action)="data">
                <button
                  v-if="data.item.status === 'UNALLOCATED' || !data.item.parent"
                  class="btn btn-sm btn-primary"
                  @click="openModalAssign(data.item)"
                >
                  <i class="fas fa-link mr-1"></i>Gán Phụ huynh
                </button>
              </template>
            </b-table>
          </div>
        </div>
      </b-tab>

      <b-tab title="Audit Log: Lịch sử Gạch nợ Hóa đơn">
        <div class="card shadow-sm">
          <div class="card-body p-0">
            <b-table
              hover
              responsive
              :items="settlements"
              :fields="settlementFields"
              :busy="loading"
            >
              <template #table-busy>
                <div class="text-center my-3 text-muted">
                  <b-spinner small class="mr-2"></b-spinner>Đang tải lịch sử gạch nợ...
                </div>
              </template>

              <template #cell(amount)="data">
                <span class="font-weight-bold text-primary">
                  {{ formatCurrency(data.item.amount) }}
                </span>
              </template>

              <template #cell(parent)="data">
                <strong>{{ data.item.parent?.name }}</strong>
                <div class="small text-muted">{{ data.item.parent?.code }}</div>
              </template>

              <template #cell(settleType)="data">
                <span v-if="data.item.settleType === 'AUTO_ACB'" class="badge bg-success text-white">Auto ACB</span>
                <span v-else class="badge bg-info text-white">Kế toán gạch nợ</span>
              </template>

              <template #cell(settledAt)="data">
                {{ formatDateTime(data.item.settledAt) }}
              </template>
            </b-table>
          </div>
        </div>
      </b-tab>
    </b-tabs>

    <!-- Modal Ghi nhận thu tiền -->
    <b-modal id="modal-add-cash" title="Ghi nhận Dòng tiền Thu" hide-footer>
      <form @submit.prevent="submitAddCash">
        <div class="form-group mb-3">
          <label class="font-weight-bold">Chọn Phụ huynh *</label>
          <select v-model="cashForm.parentId" class="form-control" required>
            <option value="">-- Chọn phụ huynh --</option>
            <option v-for="p in parents" :key="p.id" :value="p.id">
              {{ p.code }} - {{ p.name }} (Nợ: {{ formatCurrency(p.debt) }})
            </option>
          </select>
        </div>

        <div class="form-group mb-3">
          <label class="font-weight-bold">Số tiền (VNĐ) *</label>
          <InputCurrency
            v-model="cashForm.amount"
            placeholder="Ví dụ: 3.000.000"
          />
        </div>

        <div class="form-group mb-3">
          <label class="font-weight-bold">Hình thức thu</label>
          <select v-model="cashForm.paymentMethod" class="form-control">
            <option value="ACB_BANK">Chuyển khoản ACB</option>
            <option value="CASH">Tiền mặt</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>

        <div class="form-group mb-3">
          <label class="font-weight-bold">Ghi chú / Mã tham chiếu</label>
          <input
            v-model="cashForm.bankDescription"
            type="text"
            class="form-control"
            placeholder="Ví dụ: Đóng tiền mặt tại văn phòng"
          />
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary mr-2" @click="$bvModal.hide('modal-add-cash')">
            Hủy
          </button>
          <button type="submit" class="btn btn-success" :disabled="submitting">
            <b-spinner v-if="submitting" small class="mr-1"></b-spinner> Xác nhận & Tự gạch nợ
          </button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import InputCurrency from '~/components/Common/InputCurrency.vue';

const GET_FINANCIAL_DATA = gql`
  query GetFinancialData {
    allCashTransactions(sortBy: createdAt_DESC, first: 100) {
      id
      code
      amount
      type
      paymentMethod
      bankRef
      bankDescription
      status
      createdAt
      parent {
        id
        code
        name
      }
    }
    allPaymentSettlements(sortBy: settledAt_DESC, first: 100) {
      id
      code
      amount
      settleType
      status
      note
      settledAt
      parent {
        id
        code
        name
      }
      student {
        id
        name
      }
    }
    allParents(first: 500) {
      id
      code
      name
      debt
      balance
    }
  }
`;

export default {
  components: {
    InputCurrency,
  },
  layout: 'app',
  data() {
    return {
      loading: false,
      submitting: false,
      cashTransactions: [],
      settlements: [],
      parents: [],
      cashFields: [
        { key: 'code', label: 'Mã Dòng tiền', sortable: true },
        { key: 'amount', label: 'Số tiền', sortable: true },
        { key: 'paymentMethod', label: 'Phương thức' },
        { key: 'parent', label: 'Phụ huynh' },
        { key: 'bankDescription', label: 'Nội dung CK' },
        { key: 'status', label: 'Trạng thái' },
        { key: 'createdAt', label: 'Thời gian', sortable: true },
        { key: 'action', label: 'Thao tác', class: 'text-center' }
      ],
      settlementFields: [
        { key: 'code', label: 'Mã Settlement', sortable: true },
        { key: 'amount', label: 'Số tiền gạch nợ', sortable: true },
        { key: 'parent', label: 'Phụ huynh' },
        { key: 'settleType', label: 'Hình thức' },
        { key: 'note', label: 'Chi tiết gạch nợ' },
        { key: 'settledAt', label: 'Thời gian gạch nợ', sortable: true }
      ],
      cashForm: {
        parentId: '',
        amount: '',
        paymentMethod: 'CASH',
        bankDescription: ''
      }
    };
  },
  computed: {
    totalInflow() {
      return this.cashTransactions
        .filter(t => t.type === 'INFLOW')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
    },
    totalSettled() {
      return this.settlements
        .filter(s => s.status === 'SUCCESS')
        .reduce((sum, s) => sum + (s.amount || 0), 0);
    },
    totalPending() {
      return this.cashTransactions
        .filter(t => t.status === 'PENDING' || t.status === 'UNALLOCATED')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    formatCurrency(val) {
      return ((val || 0).toLocaleString('vi-VN')) + ' đ';
    },
    formatDateTime(dateStr) {
      if (!dateStr) return '';
      return this.$moment(dateStr).format('DD/MM/YYYY HH:mm');
    },
    async fetchData() {
      this.loading = true;
      try {
        const client = this.$apolloProvider.defaultClient;
        const res = await client.query({ query: GET_FINANCIAL_DATA, fetchPolicy: 'network-only' });
        this.cashTransactions = res.data?.allCashTransactions || [];
        this.settlements = res.data?.allPaymentSettlements || [];
        this.parents = res.data?.allParents || [];
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    openModalAddCash() {
      this.cashForm = {
        parentId: '',
        amount: '',
        paymentMethod: 'CASH',
        bankDescription: ''
      };
      this.$bvModal.show('modal-add-cash');
    },
    async submitAddCash() {
      this.submitting = true;
      try {
        const client = this.$apolloProvider.defaultClient;
        // Tạo CashTransaction
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
              type: 'INFLOW',
              amount: parseInt(this.cashForm.amount, 10),
              paymentMethod: this.cashForm.paymentMethod,
              bankDescription: this.cashForm.bankDescription,
              status: 'SETTLED',
              parent: { connect: { id: this.cashForm.parentId } }
            }
          }
        });

        // Giảm debt phụ huynh
        const targetParent = this.parents.find(p => p.id === this.cashForm.parentId);
        if (targetParent) {
          const newDebt = Math.max(0, (targetParent.debt || 0) - parseInt(this.cashForm.amount, 10));
          await client.mutate({
            mutation: gql`
              mutation UpdateParentDebt($id: ID!, $debt: Int!) {
                updateParent(id: $id, data: { debt: $debt }) {
                  id
                }
              }
            `,
            variables: { id: targetParent.id, debt: newDebt }
          });
        }

        this.$bvModal.hide('modal-add-cash');
        this.fetchData();
      } catch (err) {
        alert('Lỗi: ' + err.message);
      } finally {
        this.submitting = false;
      }
    },
    exportToExcel() {
      // Xuất dữ liệu CSV/Excel đơn giản
      let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
      csvContent += 'Mã Dòng tiền,Số tiền,Hình thức,Mã Phụ huynh,Tên Phụ huynh,Nội dung,Thời gian\n';

      this.cashTransactions.forEach(t => {
        const row = [
          t.code,
          t.amount,
          t.paymentMethod,
          t.parent?.code || '',
          `"${t.parent?.name || ''}"`,
          `"${t.bankDescription || ''}"`,
          this.formatDateTime(t.createdAt)
        ].join(',');
        csvContent += row + '\n';
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `so-cai-dong-tien-${this.$moment().format('YYYY-MM-DD')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>
