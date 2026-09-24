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
            <div class="font-weight-bold text-dark">{{ row.item.name }}</div>
            <div v-if="getPhoneDisplay(row.item.phone)" class="small text-muted mt-1 d-flex align-items-center">
              <i class="fas fa-phone-alt text-primary mr-1"></i>
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
            <b-button variant="outline-primary" size="sm" class="rounded-pill px-3" @click="showModal(row)">
              <i class="fas fa-eye mr-1"></i> Sổ nợ
            </b-button>
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

    <!-- Modal Chi tiết công nợ -->
    <b-modal v-model="showModalFlag" size="lg" :title="'Chi tiết công nợ: ' + slPhuHuynh.name" hide-footer>
      <DebtForm 
        :idPhuHuynh="slPhuHuynh.id" 
        :loadData="loadData"
      />
    </b-modal>
  </div>
</template>

<script>
import {getPhuHuynh} from '~/plugins/phuhuynh.js'
import DebtForm from '~/components/PhuHuynh/Debt.vue'
export default {
    components: {
        DebtForm
    },
    data(){
        return {
            slPhuHuynh: {
                name: ""
            },
            loadData: 0,
            showModalFlag: false,
            busyTable: true, 
            phuhuynhs: [],
            total: 0,
            page: 1,
            pageSize: 50,
            selectedSortField: "code",
            selectedSortDirection: "DESC",
            sortBy: "code_DESC",
            sortFieldOptions: [
                { value: "code", text: "Mã phụ huynh" },
                { value: "debt", text: "Công nợ" }
            ],
            sortDirectionOptions: [
                { value: "ASC", text: "Tăng dần" },
                { value: "DESC", text: "Giảm dần" }
            ],
            fields: [
                {
                    thClass: "text-center",
                    label: "Mã",
                    key: "code",
                    thStyle: {
                        width: '10%',
                    },
                },                
                {
                    thClass: "text-center",
                    label: "Tên phụ huynh",
                    key: "name",
                    thStyle: {
                        width: '20%',
                    },
                },
                {
                    thClass: "text-center",
                    label: "Học sinh",
                    key: "student",
                    thStyle: {
                        width: '30%',
                    },
                },
                {
                    thClass: "text-center",
                    label: "Số dư ví",
                    key: "balance",
                    thStyle: {
                        width: '15%',
                    },
                    tdClass: "text-right"
                },
                {
                    thClass: "text-center",
                    label: "Còn nợ",
                    key: "debt",
                    thStyle: {
                        width: '15%',
                    },
                    tdClass: "text-right"
                },
                {
                    thClass: "text-center",
                    label: "Thao tác",
                    key: "button",
                    thStyle: {
                        width: '10%',
                    },
                    tdClass: "text-center"
                }
            ]
        }
    },
    methods: {
        getPhoneDisplay(phoneData) {
            if (!phoneData) return "";
            if (Array.isArray(phoneData)) {
                return phoneData.map(p => p.number || p).filter(Boolean).join(", ");
            }
            if (typeof phoneData === "object" && phoneData.number) {
                return phoneData.number;
            }
            return String(phoneData);
        },
        getFirstPhoneNumber(phoneData) {
            if (!phoneData) return "";
            if (Array.isArray(phoneData) && phoneData.length > 0) {
                return phoneData[0].number || phoneData[0] || "";
            }
            if (typeof phoneData === "object" && phoneData.number) {
                return phoneData.number;
            }
            return String(phoneData);
        },
        showModal(row){
            console.log(row);
            this.slPhuHuynh = row.item;
            this.loadData += 1;
            this.showModalFlag = true;
        },
        getPhuHuynh(page = 1){
            var that = this;
            that.busyTable = true;
            getPhuHuynh(this.$apolloProvider.defaultClient, {
                first: this.pageSize,
                skip: (page - 1) * this.pageSize,
                sortBy: this.sortBy
            }).then(data => {
                that.phuhuynhs = data.items;
                that.total = data.total;
                that.page = page;
                that.busyTable = false;
            }).catch (err => {
                console.log(err);
            });
        },
        toggleCollapse(index) {
        // Hàm để mở/đóng cột "Học sinh" tương ứng với chỉ số index
            this.$set(this.collapsedRows, index, !this.collapsedRows[index]);
        },
        changePage(page) {
            this.getPhuHuynh(page);
        },
        applySort() {
            this.sortBy = `${this.selectedSortField}_${this.selectedSortDirection}`;
            this.getPhuHuynh(1);
        }
    },
    computed: {
        totalPages() {
            return Math.max(1, Math.ceil(this.total / this.pageSize));
        }
    },
    mounted(){
        this.getPhuHuynh();
    }
}
</script>
