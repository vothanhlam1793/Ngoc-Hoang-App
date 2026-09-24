<template>
  <div>
    <!-- Bộ lọc ngày và Thống kê tổng quan -->
    <div class="card shadow-sm border-0 mb-3 bg-light">
      <div class="card-body py-3">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <FromToDate @update-data="updateDate" class="mb-2 mb-md-0" />
          <button class="btn btn-success rounded-pill px-3 shadow-sm" @click="exportPhieuThuToExcel">
            <i class="fas fa-file-excel mr-1"></i> Xuất File Excel
          </button>
        </div>
      </div>
    </div>

    <!-- 3 KPI Cards -->
    <div class="row mb-3">
      <div class="col-md-4 mb-2 mb-md-0">
        <div class="card border-0 shadow-sm p-3 bg-white border-left-success">
          <small class="text-muted font-weight-bold">TỔNG THU HỌC PHÍ</small>
          <h4 class="text-success font-weight-bold mb-0 mt-1">{{ $formatTotal(thu) }}</h4>
        </div>
      </div>
      <div class="col-md-4 mb-2 mb-md-0">
        <div class="card border-0 shadow-sm p-3 bg-white border-left-danger">
          <small class="text-muted font-weight-bold">TỔNG CHI / HOÀN TIỀN</small>
          <h4 class="text-danger font-weight-bold mb-0 mt-1">{{ $formatTotal(chi) }}</h4>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm p-3 bg-white border-left-primary">
          <small class="text-muted font-weight-bold">THỰC THU TỒN QUỸ</small>
          <h4 class="text-primary font-weight-bold mb-0 mt-1">{{ $formatTotal(total) }}</h4>
        </div>
      </div>
    </div>

    <!-- Bảng danh sách phiếu thu -->
    <div class="card shadow-sm border-0 mb-3">
      <div class="card-body p-0">
        <b-table
          hover
          responsive
          class="mb-0"
          :items="items"
          :fields="fields"
        >
          <template #cell(code)="row">
            <span class="badge badge-secondary font-weight-normal">{{ row.item.code }}</span>
          </template>

          <template #cell(parent.name)="row">
            <span class="font-weight-bold text-dark">{{ row.item.parent ? row.item.parent.name : 'Khách vãng lai' }}</span>
          </template>

          <template #cell(total)="row">
            <span :class="['font-weight-bold', row.item.total >= 0 ? 'text-success' : 'text-danger']">
              {{ $formatTotal(row.item.total) }}
            </span>
          </template>

          <template #cell(createdBy.name)="row">
            <span class="small text-muted">{{ row.item.createdBy ? row.item.createdBy.name : 'Hệ thống' }}</span>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import {getPhieuThu} from '~/plugins/phieuthu.js'
import FromToDate from '~/components/PhieuThu/FromToDate.vue';
export default {
    data(){
        return {
            date: {
                from: this.$moment().subtract(0, 'days').startOf('day').valueOf(),
                to: this.$moment().endOf('day').valueOf()
            },
            phieuthus: [],
            total: 0,
            thu: 0,
            chi: 0,
            items: [],
            fields: [
                'code',
                {
                    label: "Phụ huynh",
                    key: "parent.name"
                },
                {
                    label: "Số tiền",
                    key: "total",
                    formatter: this.$formatTotal,
                    tdClass: "text-right"
                },
                {
                    label: "Người thu",
                    key: "createdBy.name"
                }
            ]
        }
    },
    methods: {
        updateDate(date) {
            this.date.from = this.$moment(date.from).startOf('day').valueOf();
            this.date.to = this.$moment(date.to).endOf('day').valueOf();
            this.getPhieuThu();
            // console.log("MOMENT: ",this.$formatTotal);
        },
        getPhieuThu(){
            var that = this;
            getPhieuThu(this.$apolloProvider.defaultClient, {
                from: this.$moment(this.date.from).toISOString(),
                to: this.$moment(this.date.to).toISOString()
            }).then(data => {
                that.phieuthus = data;
                that.createItemTable();
            }).catch(err => {
                console.log(err);
            });
        },
        createItemTable(){
            var that = this;
            that.items = [];
            that.total = 0;
            that.thu = 0;
            that.chi = 0;
            that.phieuthus.forEach(function(phieuthu){
                let cB;
                if(phieuthu.createdBy){
                    cB = phieuthu.createdBy;
                } else {
                    cB = {
                        name: ""
                    }
                }
                that.items.push({
                    code: phieuthu.code,
                    total: phieuthu.total,
                    parent: phieuthu.parent,
                    createdBy: cB
                });
                if(phieuthu.total >= 0){
                    that.thu += phieuthu.total;
                } else {
                    that.chi += phieuthu.total;
                }
                that.total += phieuthu.total;
            });

        },
        exportPhieuThuToExcel() {
            let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
            csvContent += 'Mã Phiếu,Tên Phụ huynh,Số tiền,Người thu\n';

            this.items.forEach(item => {
                const row = [
                    item.code || '',
                    `"${item.parent?.name || ''}"`,
                    item.total || 0,
                    `"${item.createdBy?.name || ''}"`
                ].join(',');
                csvContent += row + '\n';
            });

            const fromStr = this.$moment(this.date.from).format('YYYYMMDD');
            const toStr = this.$moment(this.date.to).format('YYYYMMDD');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `bao-cao-thu-tien-${fromStr}-${toStr}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },
    components: {
        // Form,
        FromToDate
    },
    mounted(){
        console.log("FORM");
        this.getPhieuThu();
    }
}
</script>