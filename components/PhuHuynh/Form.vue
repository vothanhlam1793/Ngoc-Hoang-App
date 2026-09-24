<template>
  <div>
    <!-- Bộ lọc & Thống kê nhanh -->
    <div class="card shadow-sm border-0 mb-3 bg-light">
      <div class="card-body py-3">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <b-form inline class="align-items-center" @submit.prevent="applySort">
            <span class="mr-2 font-weight-bold text-secondary"><i class="fas fa-filter mr-1"></i>Sắp xếp:</span>
            <b-form-select
              id="parent-sort-field"
              v-model="selectedSortField"
              :options="sortFieldOptions"
              class="mr-2 mb-2 mb-md-0 rounded-pill"
            />
            <b-form-select
              v-model="selectedSortDirection"
              :options="sortDirectionOptions"
              class="mr-2 mb-2 mb-md-0 rounded-pill"
              aria-label="Chiều sắp xếp"
            />
            <b-button type="submit" variant="primary" class="rounded-pill px-3" :disabled="busyTable">
              <i class="fas fa-check mr-1"></i> Áp dụng
            </b-button>
          </b-form>

          <div class="mt-2 mt-md-0">
            <span class="badge badge-light border px-3 py-2 text-dark font-weight-bold">
              Tổng số: <span class="text-primary">{{ total }}</span> phụ huynh
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm border-0 mb-3">
      <div class="card-body p-0">
        <div v-if="busyTable" class="text-center py-5">
          <b-spinner variant="primary" label="Loading..."></b-spinner>
          <div class="text-muted mt-2">Đang tải danh bạ phụ huynh...</div>
        </div>
        <b-table
          v-else
          hover
          responsive
          class="mb-0 align-middle"
          :items="phuhuynhs"
          :fields="fields"
        >
          <template #cell(code)="row">
            <span class="badge badge-secondary font-weight-normal px-2 py-1">{{ row.item.code || 'N/A' }}</span>
          </template>

          <template #cell(name)="row">
            <div class="d-flex align-items-center flex-wrap">
              <a
                href="#"
                class="font-weight-bold text-primary mr-2 parent-name-link"
                @click.prevent="openEditModal(row.item)"
                title="Bấm để xem/sửa hồ sơ, đổi trạng thái hoặc xóa"
              >
                {{ row.item.name }}
                <i class="fas fa-edit text-muted ml-1 small opacity-75"></i>
              </a>
              <span
                v-if="row.item.status === 'DEACTIVE'"
                class="badge badge-dark small font-weight-normal px-1"
                title="Tài khoản đã vô hiệu hóa"
              >
                Tạm ngưng
              </span>
            </div>
            <div v-if="getPhoneDisplay(row.item.phone)" class="small text-muted mt-1 d-flex align-items-center">
              <i class="fas fa-phone-alt text-success mr-1"></i>
              <span>{{ getPhoneDisplay(row.item.phone) }}</span>
              <a
                v-if="getFirstPhoneNumber(row.item.phone)"
                :href="`https://zalo.me/${getFirstPhoneNumber(row.item.phone)}`"
                target="_blank"
                class="badge badge-primary ml-2 px-2 py-1"
                title="Nhắn Zalo"
              >
                Zalo
              </a>
            </div>
          </template>

          <template #cell(student)="row">
            <div class="d-flex flex-wrap align-items-center">
              <span
                v-for="hs in row.item.hocsinhs"
                :key="hs.id"
                class="badge badge-light border text-dark mr-1 mb-1 px-2 py-1"
              >
                <i class="fas fa-child text-info mr-1"></i>{{ hs.name }}
                <small class="text-muted" v-if="hs.lophoc && hs.lophoc.name">({{ hs.lophoc.name }})</small>
                <span v-if="hs.status === 'THOI_HOC'" class="badge badge-danger ml-1">Thôi học</span>
              </span>
              <span v-if="!row.item.hocsinhs || !row.item.hocsinhs.length" class="text-muted small">
                Chưa có hồ sơ bé
              </span>
            </div>
          </template>

          <template #cell(balance)="row">
            <span
              v-if="row.item.balance > 0"
              class="badge badge-success font-weight-bold px-2 py-1"
            >
              +{{ $formatTotal(row.item.balance) }}
            </span>
            <span v-else class="text-muted small">0 đ</span>
          </template>

          <template #cell(debt)="row">
            <span
              :class="[
                'font-weight-bold',
                row.item.debt > 0 ? 'text-danger' : (row.item.debt < 0 ? 'text-success' : 'text-muted')
              ]"
            >
              {{ $formatTotal(row.item.debt) }}
            </span>
          </template>

          <template #cell(button)="row">
            <div class="btn-group btn-group-sm">
              <b-button variant="outline-primary" class="rounded-pill px-3 mr-1" @click="showModal(row)">
                <i class="fas fa-wallet mr-1"></i> Sổ nợ
              </b-button>
              <b-button variant="light" class="rounded-pill px-2 border" @click="openEditModal(row.item)" title="Hồ sơ & Trạng thái">
                <i class="fas fa-user-cog text-secondary"></i>
              </b-button>
            </div>
          </template>
        </b-table>
      </div>

      <!-- Phân trang -->
      <div class="card-footer bg-white d-flex flex-column flex-sm-row align-items-center justify-content-between py-2">
        <b-button
          variant="outline-secondary"
          size="sm"
          class="rounded-pill px-3 mb-2 mb-sm-0"
          :disabled="page === 1 || busyTable"
          @click="changePage(page - 1)"
        >
          <i class="fas fa-chevron-left mr-1"></i> Trang trước
        </b-button>
        <span class="text-muted small">Trang <strong>{{ page }}</strong> / {{ totalPages }}</span>
        <b-button
          variant="outline-secondary"
          size="sm"
          class="rounded-pill px-3"
          :disabled="page === totalPages || busyTable"
          @click="changePage(page + 1)"
        >
          Trang sau <i class="fas fa-chevron-right ml-1"></i>
        </b-button>
      </div>
    </div>

    <!-- Modal Chi tiết Sổ Nợ -->
    <b-modal v-model="showModalFlag" size="xl" :title="'Sổ Nợ & Lịch Sử Biến Động Tài Chính: ' + slPhuHuynh.name" hide-footer>
      <DebtForm 
        :idPhuHuynh="slPhuHuynh.id" 
        :loadData="loadData"
      />
    </b-modal>

    <!-- Modal Hồ sơ & Trạng thái Phụ Huynh -->
    <b-modal
      v-model="showEditModalFlag"
      size="lg"
      title="Hồ Sơ & Thiết Lập Trạng Thái Phụ Huynh"
      hide-footer
    >
      <ParentEditModal
        v-if="selectedParentForEdit"
        :parentData="selectedParentForEdit"
        @updated="handleParentUpdated"
        @deleted="handleParentDeleted"
        @close="showEditModalFlag = false"
      />
    </b-modal>
  </div>
</template>

<script>
import { getPhuHuynh } from '~/plugins/phuhuynh.js';
import DebtForm from '~/components/PhuHuynh/Debt.vue';
import ParentEditModal from '~/components/PhuHuynh/EditModal.vue';

export default {
  components: {
    DebtForm,
    ParentEditModal,
  },
  data() {
    return {
      slPhuHuynh: {
        name: '',
      },
      selectedParentForEdit: null,
      loadData: 0,
      showModalFlag: false,
      showEditModalFlag: false,
      busyTable: true,
      phuhuynhs: [],
      total: 0,
      page: 1,
      pageSize: 50,
      selectedSortField: 'code',
      selectedSortDirection: 'DESC',
      sortBy: 'code_DESC',
      sortFieldOptions: [
        { value: 'code', text: 'Mã phụ huynh' },
        { value: 'debt', text: 'Công nợ' },
      ],
      sortDirectionOptions: [
        { value: 'ASC', text: 'Tăng dần' },
        { value: 'DESC', text: 'Giảm dần' },
      ],
      fields: [
        {
          thClass: 'text-center',
          label: 'Mã',
          key: 'code',
          thStyle: {
            width: '10%',
          },
        },
        {
          thClass: 'text-center',
          label: 'Tên phụ huynh',
          key: 'name',
          thStyle: {
            width: '24%',
          },
        },
        {
          thClass: 'text-center',
          label: 'Học sinh',
          key: 'student',
          thStyle: {
            width: '28%',
          },
        },
        {
          thClass: 'text-center',
          label: 'Số dư ví',
          key: 'balance',
          thStyle: {
            width: '14%',
          },
          tdClass: 'text-right',
        },
        {
          thClass: 'text-center',
          label: 'Còn nợ',
          key: 'debt',
          thStyle: {
            width: '14%',
          },
          tdClass: 'text-right',
        },
        {
          thClass: 'text-center',
          label: 'Thao tác',
          key: 'button',
          thStyle: {
            width: '10%',
          },
          tdClass: 'text-center',
        },
      ],
    };
  },
  methods: {
    openEditModal(parent) {
      this.selectedParentForEdit = parent;
      this.showEditModalFlag = true;
    },
    handleParentUpdated() {
      this.loadPhuHuynh();
    },
    handleParentDeleted() {
      this.showEditModalFlag = false;
      this.loadPhuHuynh();
    },
    getPhoneDisplay(phoneData) {
      if (!phoneData) return '';
      if (Array.isArray(phoneData)) {
        return phoneData.map((p) => p.number || p).filter(Boolean).join(', ');
      }
      return typeof phoneData === 'string' ? phoneData : '';
    },
    getFirstPhoneNumber(phoneData) {
      if (!phoneData) return '';
      if (Array.isArray(phoneData) && phoneData.length > 0) {
        const first = phoneData[0];
        const num = typeof first === 'string' ? first : first.number;
        return num ? String(num).replace(/\D/g, '') : '';
      }
      if (typeof phoneData === 'string') {
        const cleaned = phoneData.split(',')[0].trim();
        return cleaned.replace(/\D/g, '');
      }
      return '';
    },
    showModal(row) {
      this.slPhuHuynh = row.item;
      this.loadData += 1;
      this.showModalFlag = true;
    },
    applySort() {
      this.sortBy = `${this.selectedSortField}_${this.selectedSortDirection}`;
      this.page = 1;
      this.loadPhuHuynh();
    },
    changePage(newPage) {
      if (newPage < 1 || newPage > this.totalPages) return;
      this.page = newPage;
      this.loadPhuHuynh();
    },
    loadPhuHuynh() {
      const that = this;
      that.busyTable = true;
      const skip = (that.page - 1) * that.pageSize;
      getPhuHuynh(this.$apolloProvider.defaultClient, {
        first: that.pageSize,
        skip,
        sortBy: that.sortBy,
      })
        .then((data) => {
          that.phuhuynhs = data.items;
          that.total = data.total;
          that.busyTable = false;
        })
        .catch((err) => {
          console.error(err);
          that.busyTable = false;
        });
    },
  },
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.total / this.pageSize));
    },
  },
  mounted() {
    this.loadPhuHuynh();
  },
};
</script>

<style scoped>
.parent-name-link {
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.15s ease;
}
.parent-name-link:hover {
  text-decoration: underline;
  color: #0b5ed7 !important;
}
</style>
