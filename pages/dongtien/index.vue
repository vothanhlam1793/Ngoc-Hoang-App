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
                  title="Gán phụ huynh / bé"
                  @click="openModalAssign(data.item)"
                >
                  <i class="fas fa-link mr-1"></i>Gán
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

    <!-- Modal Gán Dòng tiền cho Phụ huynh / Bé -->
    <b-modal
      id="modal-assign-parent"
      title="🔗 Gán Dòng Tiền Chưa Nhận Diện Cho Bé / Phụ Huynh"
      size="lg"
      hide-footer
      no-close-on-backdrop
      no-close-on-esc
    >
      <div v-if="selectedTx">
        <!-- Thông tin giao dịch đang gán -->
        <div class="card bg-light border-0 mb-3 p-3">
          <div class="row">
            <div class="col-sm-6 mb-2 mb-sm-0">
              <div class="small text-muted">Mã dòng tiền:</div>
              <strong class="text-dark">{{ selectedTx.code }}</strong>
              <div class="small text-muted mt-1">Nội dung chuyển khoản:</div>
              <div class="small font-monospace text-primary bg-white p-2 rounded border">
                {{ selectedTx.bankDescription || '(Không có nội dung)' }}
              </div>
            </div>
            <div class="col-sm-6 text-sm-right">
              <div class="small text-muted">Số tiền tiếp nhận:</div>
              <h4 class="text-success font-weight-bold mb-1">+{{ formatCurrency(selectedTx.amount) }}</h4>
              <div class="small text-muted">Thời gian: {{ formatDateTime(selectedTx.createdAt) }}</div>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitAssign">
          <!-- Ô tìm kiếm nhanh ưu tiên THEO TÊN BÉ -->
          <div class="form-group mb-3">
            <label class="font-weight-bold text-dark d-flex justify-content-between">
              <span><i class="fas fa-search text-primary mr-1"></i> Tìm nhanh theo Tên Bé / Lớp / Tên Phụ Huynh:</span>
              <span class="badge badge-info small font-weight-normal">Ưu tiên tìm theo tên bé</span>
            </label>
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text bg-white"><i class="fas fa-child text-info"></i></span>
              </div>
              <input
                type="text"
                class="form-control"
                placeholder="Gõ tên bé (vd: Gia Hân, An Nhiên...), tên lớp, hoặc tên ba mẹ..."
                v-model.trim="searchStudentKeyword"
                autofocus
              />
              <div class="input-group-append" v-if="searchStudentKeyword">
                <button class="btn btn-outline-secondary" type="button" @click="searchStudentKeyword = ''">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>

            <!-- Danh sách kết quả gợi ý -->
            <div
              v-if="filteredParentOptions.length > 0"
              class="list-group shadow-sm border rounded"
              style="max-height: 240px; overflow-y: auto;"
            >
              <button
                type="button"
                v-for="item in filteredParentOptions"
                :key="item.id"
                :class="['list-group-item list-group-item-action p-2 d-flex justify-content-between align-items-center', assignForm.parentId === item.id ? 'active' : '']"
                @click="selectParent(item)"
              >
                <div>
                  <div class="font-weight-bold d-flex align-items-center">
                    <i class="fas fa-child text-warning mr-1"></i>
                    <span>{{ item.studentNames || '(Chưa có tên bé)' }}</span>
                    <span v-if="item.classNames" class="badge badge-secondary ml-2 font-weight-normal">
                      {{ item.classNames }}
                    </span>
                  </div>
                  <div class="small" :class="assignForm.parentId === item.id ? 'text-white-50' : 'text-muted'">
                    <i class="fas fa-user-friends mr-1"></i>PH: <strong>{{ item.name }}</strong> (Mã: {{ item.code }})
                  </div>
                </div>
                <div class="text-right small">
                  <div>Nợ: <strong :class="assignForm.parentId === item.id ? 'text-white' : 'text-danger'">{{ formatCurrency(item.debt) }}</strong></div>
                  <div>Ví dư: <strong :class="assignForm.parentId === item.id ? 'text-white' : 'text-success'">{{ formatCurrency(item.balance) }}</strong></div>
                </div>
              </button>
            </div>
            <div v-else-if="searchStudentKeyword" class="p-3 text-center text-muted bg-light rounded border">
              <i class="fas fa-exclamation-circle mr-1"></i> Không tìm thấy bé hoặc phụ huynh nào khớp với "{{ searchStudentKeyword }}"
            </div>
          </div>

          <!-- Thông tin bé & Phụ huynh đã chọn -->
          <div v-if="selectedParentObj" class="alert alert-success d-flex align-items-center justify-content-between p-3 mb-3">
            <div>
              <div class="font-weight-bold text-success">
                <i class="fas fa-check-circle mr-1"></i> Đã chọn bé: {{ selectedParentObj.studentNames }} ({{ selectedParentObj.classNames }})
              </div>
              <div class="small text-dark mt-1">
                Phụ huynh: <strong>{{ selectedParentObj.name }}</strong> (Mã: {{ selectedParentObj.code }})
                | Học phí nợ: <span class="text-danger font-weight-bold">{{ formatCurrency(selectedParentObj.debt) }}</span>
              </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline-danger" @click="assignForm.parentId = ''">
              Chọn lại
            </button>
          </div>

          <!-- Tùy chọn Tự động cấn trừ -->
          <div class="custom-control custom-checkbox mb-4 p-3 bg-light rounded border">
            <input
              type="checkbox"
              class="custom-control-input"
              id="autoSettleCheck"
              v-model="assignForm.autoSettle"
            />
            <label class="custom-control-label font-weight-bold text-dark" for="autoSettleCheck">
              Tự động cấn trừ học phí nếu bé / phụ huynh đang có nợ
            </label>
            <div class="small text-muted ml-0 mt-1">
              Hệ thống sẽ tự động gạch nợ hóa đơn và nạp phần tiền còn dư vào Ví khả dụng của phụ huynh.
            </div>
          </div>

          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-secondary mr-2" @click="$bvModal.hide('modal-assign-parent')">
              Hủy bỏ
            </button>
            <button
              type="submit"
              class="btn btn-primary font-weight-bold px-4"
              :disabled="!assignForm.parentId || assigning"
            >
              <b-spinner v-if="assigning" small class="mr-1"></b-spinner>
              <i v-else class="fas fa-link mr-1"></i>
              Xác nhận Gán Dòng Tiền
            </button>
          </div>
        </form>
      </div>
    </b-modal>

    <!-- Modal Ghi nhận thu tiền -->
    <b-modal id="modal-add-cash" title="Ghi nhận Dòng tiền Thu" hide-footer size="lg">
      <form @submit.prevent="submitAddCash">
        <div class="form-group mb-3">
          <label class="font-weight-bold">Chọn Bé / Phụ huynh *</label>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text bg-white"><i class="fas fa-child text-info"></i></span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Gõ tên bé, tên lớp, hoặc tên phụ huynh để tìm nhanh..."
              v-model.trim="searchCashStudentKeyword"
            />
          </div>

          <!-- Danh sách kết quả gợi ý -->
          <div
            v-if="filteredCashParentOptions.length > 0"
            class="list-group shadow-sm border rounded mb-2"
            style="max-height: 180px; overflow-y: auto;"
          >
            <button
              type="button"
              v-for="item in filteredCashParentOptions"
              :key="item.id"
              :class="['list-group-item list-group-item-action p-2 d-flex justify-content-between align-items-center', cashForm.parentId === item.id ? 'active' : '']"
              @click="cashForm.parentId = item.id"
            >
              <div>
                <div class="font-weight-bold d-flex align-items-center">
                  <i class="fas fa-child text-warning mr-1"></i>
                  <span>{{ item.studentNames || '(Chưa có tên bé)' }}</span>
                  <span v-if="item.classNames" class="badge badge-secondary ml-2 font-weight-normal">
                    {{ item.classNames }}
                  </span>
                </div>
                <div class="small" :class="cashForm.parentId === item.id ? 'text-white-50' : 'text-muted'">
                  PH: <strong>{{ item.name }}</strong> (Mã: {{ item.code }})
                </div>
              </div>
              <div class="text-right small">
                <div>Nợ: <strong :class="cashForm.parentId === item.id ? 'text-white' : 'text-danger'">{{ formatCurrency(item.debt) }}</strong></div>
                <div>Ví dư: <strong :class="cashForm.parentId === item.id ? 'text-white' : 'text-success'">{{ formatCurrency(item.balance) }}</strong></div>
              </div>
            </button>
          </div>

          <div v-if="selectedCashParentObj" class="alert alert-success p-2 small mb-0 d-flex justify-content-between align-items-center">
            <div>
              <i class="fas fa-check-circle mr-1"></i> Đang chọn: <strong>{{ selectedCashParentObj.studentNames }} ({{ selectedCashParentObj.classNames }})</strong>
              - PH: {{ selectedCashParentObj.name }}
            </div>
            <span class="badge badge-light border text-danger">Nợ: {{ formatCurrency(selectedCashParentObj.debt) }}</span>
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="font-weight-bold">Số tiền thu (VNĐ) *</label>
          <InputCurrency
            v-model="cashForm.amount"
            placeholder="Ví dụ: 3.000.000"
            required
          />
        </div>

        <div class="row">
          <div class="col-md-6 form-group mb-3">
            <label class="font-weight-bold">Hình thức thu</label>
            <select v-model="cashForm.paymentMethod" class="form-control">
              <option value="CASH">Tiền mặt tại trường</option>
              <option value="ACB_BANK">Chuyển khoản ACB</option>
              <option value="OTHER">Hình thức khác</option>
            </select>
          </div>
          <div class="col-md-6 form-group mb-3">
            <label class="font-weight-bold">Ghi chú / Mã tham chiếu</label>
            <input
              v-model="cashForm.bankDescription"
              type="text"
              class="form-control"
              placeholder="Ví dụ: Đóng tiền mặt tại văn phòng"
            />
          </div>
        </div>

        <!-- Tùy chọn Tự động gạch nợ học phí -->
        <div class="custom-control custom-checkbox mb-4 p-3 bg-light rounded border">
          <input
            type="checkbox"
            class="custom-control-input"
            id="cashAutoSettleCheck"
            v-model="cashForm.autoSettle"
          />
          <label class="custom-control-label font-weight-bold text-dark" for="cashAutoSettleCheck">
            {{ cashForm.autoSettle ? '🟢 Tự động gạch nợ học phí (Nợ giảm ngay)' : '⚪ Chỉ nạp vào Ví khả dụng (Giữ nguyên nợ để kế toán đối soát sau)' }}
          </label>
          <div class="small text-muted mt-1">
            <span v-if="cashForm.autoSettle">Số tiền thu sẽ ưu tiên thanh toán dứt điểm các hóa đơn nợ trước, tiền dư thừa sẽ được lưu vào Ví phụ huynh.</span>
            <span v-else>Toàn bộ số tiền thu sẽ được cộng vào Ví khả dụng (balance), số nợ (debt) giữ nguyên cho đến khi kế toán bấm nút Cấn trừ nợ.</span>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary mr-2" @click="$bvModal.hide('modal-add-cash')">
            Hủy
          </button>
          <button type="submit" class="btn btn-success font-weight-bold" :disabled="!cashForm.parentId || submitting">
            <b-spinner v-if="submitting" small class="mr-1"></b-spinner>
            <i v-else class="fas fa-save mr-1"></i>
            {{ cashForm.autoSettle ? 'Xác nhận & Tự Gạch Nợ' : 'Xác nhận Nạp Ví Khả Dụng' }}
          </button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import InputCurrency from '~/components/Common/InputCurrency.vue';

function chuyentiengviet(str) {
  if (!str) return '';
  return str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

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
    allParents(first: 2000) {
      id
      code
      name
      debt
      balance
      hocsinhs {
        id
        name
        lophoc {
          id
          name
        }
      }
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
        bankDescription: '',
        autoSettle: true
      },
      searchCashStudentKeyword: '',
      selectedTx: null,
      assigning: false,
      searchStudentKeyword: '',
      assignForm: {
        parentId: '',
        autoSettle: true
      }
    };
  },
  computed: {
    normalizedParentList() {
      return this.parents.map(p => {
        const studentNames = (p.hocsinhs || []).map(h => h.name).filter(Boolean).join(', ');
        const classNames = (p.hocsinhs || []).map(h => h.lophoc?.name).filter(Boolean).join(', ');
        const rawFullStr = `${studentNames} ${classNames} ${p.name || ''} ${p.code || ''}`;
        return {
          ...p,
          studentNames,
          classNames,
          searchOriginal: rawFullStr.toLowerCase(),
          searchNonAccent: chuyentiengviet(rawFullStr)
        };
      });
    },
    filteredParentOptions() {
      if (!this.searchStudentKeyword) {
        return this.normalizedParentList.slice(0, 20);
      }
      const rawKw = this.searchStudentKeyword.toLowerCase().trim();
      const nonAccentKw = chuyentiengviet(this.searchStudentKeyword);
      const keywords = nonAccentKw.split(/\s+/).filter(Boolean);

      return this.normalizedParentList.filter(p => {
        if (p.searchOriginal.includes(rawKw)) return true;
        if (p.searchNonAccent.includes(nonAccentKw)) return true;
        return keywords.every(kw => p.searchNonAccent.includes(kw));
      }).slice(0, 30);
    },
    filteredCashParentOptions() {
      if (!this.searchCashStudentKeyword) {
        return this.normalizedParentList.slice(0, 15);
      }
      const rawKw = this.searchCashStudentKeyword.toLowerCase().trim();
      const nonAccentKw = chuyentiengviet(this.searchCashStudentKeyword);
      const keywords = nonAccentKw.split(/\s+/).filter(Boolean);

      return this.normalizedParentList.filter(p => {
        if (p.searchOriginal.includes(rawKw)) return true;
        if (p.searchNonAccent.includes(nonAccentKw)) return true;
        return keywords.every(kw => p.searchNonAccent.includes(kw));
      }).slice(0, 30);
    },
    selectedCashParentObj() {
      if (!this.cashForm.parentId) return null;
      return this.normalizedParentList.find(p => p.id === this.cashForm.parentId);
    },
    selectedParentObj() {
      if (!this.assignForm.parentId) return null;
      return this.normalizedParentList.find(p => p.id === this.assignForm.parentId);
    },
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
        bankDescription: '',
        autoSettle: true
      };
      this.searchCashStudentKeyword = '';
      this.$bvModal.show('modal-add-cash');
    },
    async submitAddCash() {
      if (!this.cashForm.parentId || !this.cashForm.amount) return;
      this.submitting = true;
      try {
        const res = await this.$axios.post('/api/payment-hub/assign-parent', {
          cashTxData: {
            amount: parseInt(this.cashForm.amount, 10),
            paymentMethod: this.cashForm.paymentMethod,
            bankDescription: this.cashForm.bankDescription || (this.cashForm.paymentMethod === 'CASH' ? 'Thu tiền mặt tại trường' : 'Chuyển khoản')
          },
          parentId: this.cashForm.parentId,
          autoSettle: this.cashForm.autoSettle,
          isNewTx: true
        });

        if (res.data?.success) {
          this.$bvToast.toast(
            this.cashForm.autoSettle
              ? 'Đã thu tiền và tự động gạch nợ học phí thành công!'
              : 'Đã nạp số tiền vào Ví khả dụng của phụ huynh!',
            { title: 'Thành công', variant: 'success', solid: true }
          );
          this.$bvModal.hide('modal-add-cash');
          await this.fetchData();
        } else {
          this.$bvToast.toast('Lỗi: ' + (res.data?.message || 'Không thể ghi nhận dòng tiền'), {
            title: 'Lỗi',
            variant: 'danger',
            solid: true
          });
        }
      } catch (err) {
        this.$bvToast.toast('Lỗi: ' + (err.response?.data?.message || err.message), {
          title: 'Lỗi',
          variant: 'danger',
          solid: true
        });
      } finally {
        this.submitting = false;
      }
    },
    openModalAssign(item) {
      this.selectedTx = item;
      this.searchStudentKeyword = '';
      this.assignForm = {
        parentId: '',
        autoSettle: true
      };
      this.$bvModal.show('modal-assign-parent');
    },

    selectParent(item) {
      this.assignForm.parentId = item.id;
    },

    async submitAssign() {
      if (!this.selectedTx || !this.assignForm.parentId) return;
      this.assigning = true;
      try {
        const res = await this.$axios.post('/api/payment-hub/assign-parent', {
          cashTxId: this.selectedTx.id,
          parentId: this.assignForm.parentId,
          autoSettle: this.assignForm.autoSettle
        });

        if (res.data?.success) {
          this.$bvToast.toast('Đã gán dòng tiền và cập nhật số dư/nợ cho bé thành công!', {
            title: 'Thành công',
            variant: 'success',
            solid: true
          });
          this.$bvModal.hide('modal-assign-parent');
          await this.fetchData();
        } else {
          this.$bvToast.toast('Lỗi: ' + (res.data?.message || 'Không thể gán dòng tiền'), {
            title: 'Thất bại',
            variant: 'danger',
            solid: true
          });
        }
      } catch (err) {
        this.$bvToast.toast('Lỗi hệ thống: ' + (err.response?.data?.message || err.message), {
          title: 'Lỗi',
          variant: 'danger',
          solid: true
        });
      } finally {
        this.assigning = false;
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
