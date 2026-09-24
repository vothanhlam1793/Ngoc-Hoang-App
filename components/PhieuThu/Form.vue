<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-2">
            <FromToDate @update-data="updateDate"></FromToDate>
            <button class="btn btn-outline-success" @click="exportPhieuThuToExcel">
                <i class="fas fa-file-excel mr-1"></i>Xuất Excel Báo cáo Thu
            </button>
        </div>
        <div>
            <p class="font-weight-bold">Tổng: {{ $formatTotal(total) }} - THU: <span class="text-success">{{ $formatTotal(thu) }}</span> | CHI: <span class="text-danger">{{ $formatTotal(chi) }}</span></p>
        </div>
        <b-table
            striped hover
            :items="items"
            :fields="fields"
        >
        </b-table>
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