<template>
    <div>
        <b-form inline class="mb-3" @submit.prevent="applySort">
            <label class="mr-2" for="parent-sort-field">Sắp xếp</label>
            <b-form-select
                id="parent-sort-field"
                v-model="selectedSortField"
                :options="sortFieldOptions"
                class="mr-2 mb-2 mb-sm-0"
            />
            <b-form-select
                v-model="selectedSortDirection"
                :options="sortDirectionOptions"
                class="mr-2 mb-2 mb-sm-0"
                aria-label="Chiều sắp xếp"
            />
            <b-button type="submit" variant="primary" :disabled="busyTable">Xác nhận</b-button>
        </b-form>
        <b-spinner v-if="busyTable" label="Loading..."></b-spinner>
        <b-table
            v-else
            striped hover bordered
            :items="phuhuynhs"
            :fields="fields"
            >
            <template #cell(student)="row">
                <!-- Thêm nội dung bạn muốn vào cột 'button' ở đây -->
                <b-button v-b-toggle="`collapse-${row.index}`"
                    variant="info"
                >+/-</b-button>
                <b-collapse :id="`collapse-${row.index}`" class="mt-2 mb-2">
                    <b-table
                    :items="row.item.hocsinhs"
                    :fields="[{
                        label: 'Tên',
                        key: 'name'
                    }, {
                        label: 'Lớp',
                        key: 'lophoc.name'
                    }, {
                        label: 'TT',
                        key: 'status'
                    }]"
                >

                </b-table>
                </b-collapse>
            </template>
            <template #cell(button)="row">
                <!-- Thêm nội dung bạn muốn vào cột 'button' ở đây -->
                <b-button variant="primary" @click="showModal(row)">Xem</b-button>
            </template>
        </b-table>
        <div class="d-flex align-items-center justify-content-between mb-3">
            <b-button variant="outline-primary" :disabled="page === 1 || busyTable" @click="changePage(page - 1)">Trang trước</b-button>
            <span>Trang {{ page }}/{{ totalPages }} ({{ total }} phụ huynh)</span>
            <b-button variant="outline-primary" :disabled="page === totalPages || busyTable" @click="changePage(page + 1)">Trang sau</b-button>
        </div>
        <b-modal v-model="showModalFlag" size="lg" :title="slPhuHuynh.name">
            <!-- Nội dung của modal -->
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
