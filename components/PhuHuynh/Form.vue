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
            <small class="text-muted" v-if="row.item.phone"><i class="fas fa-phone mr-1"></i>{{ row.item.phone }}</small>
          </template>

          <template #cell(student)="row">
            <div class="d-flex align-items-center">
              <b-button
                v-b-toggle="`collapse-${row.index}`"
                variant="outline-info"
                size="sm"
                class="rounded-pill mr-2 px-2 py-0"
              >
                <i class="fas fa-child mr-1"></i>{{ (row.item.hocsinhs || []).length }} bé
              </b-button>
              <span class="small text-muted" v-if="row.item.hocsinhs && row.item.hocsinhs.length">
                {{ row.item.hocsinhs.map(h => h.name).join(', ') }}
              </span>
            </div>

            <b-collapse :id="`collapse-${row.index}`" class="mt-2">
              <div class="p-2 bg-light rounded border">
                <b-table
                  small
                  bordered
                  head-variant="light"
                  class="bg-white mb-0"
                  :items="row.item.hocsinhs"
                  :fields="[{
                    label: 'Tên bé',
                    key: 'name'
                  }, {
                    label: 'Lớp',
                    key: 'lophoc.name'
                  }, {
                    label: 'Trạng thái',
                    key: 'status'
                  }]"
                >
                  <template #cell(status)="stRow">
                    <span v-if="stRow.item.status === 'DANG_HOC'" class="badge badge-success">Đang học</span>
                    <span v-else-if="stRow.item.status === 'THOI_HOC'" class="badge badge-danger">Thôi học</span>
                    <span v-else class="badge badge-secondary">{{ stRow.item.status || 'Chưa rõ' }}</span>
                  </template>
                </b-table>
              </div>
            </b-collapse>
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
                        width: '10%', // Thiết lập chiều rộng của tiêu đề cột là 50%
                    },
                },                
                {
                    thClass: "text-center",
                    label: "Tên",
                    key: "name",
                    thStyle: {
                        width: '20%', // Thiết lập chiều rộng của tiêu đề cột là 50%
                    },
                },
                {
                    thClass: "text-center",
                    label: "Học sinh",
                    key: "student",
                    thStyle: {
                        width: '40%', // Thiết lập chiều rộng của tiêu đề cột là 50%
                    },
                },
                {
                    thClass: "text-center",
                    label: "Nợ",
                    key: "debt",
                    formatter: this.$formatTotal,
                    // tdClass: "text-right"
                    thStyle: {
                        width: '20%', // Thiết lập chiều rộng của tiêu đề cột là 50%
                    },
                },
                {
                    thClass: "text-center",
                    label: "Xem chi tiết",
                    key: "button",
                    thStyle: {
                        width: '10%', // Thiết lập chiều rộng của tiêu đề cột là 50%
                    },
                    tdClass: "text-center"
                }
            ]
        }
    },
    methods: {
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
