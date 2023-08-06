<template>
    <div>
        <FromToDate @update-data="updateDate"></FromToDate>
        <div>
            <p>Tổng: {{ $formatTotal(total) }} - THU: {{ $formatTotal(thu) }} | CHI: {{ $formatTotal(chi) }}</p>
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