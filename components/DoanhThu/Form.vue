<template>
    <div>
        <FromToDate 
            @update-data="updateDate"
        />
        <div>
            <p>Tổng: {{ $formatTotal(total) }}</p>
        </div>
        <b-spinner v-if="busyTable" label="Loading..."></b-spinner>
        <b-table
            v-else
            striped hover
            :items="items"
            :fields="fields"
            :busy="busyTable"
            >
            <template #cell(button)="row">
                <!-- Thêm nội dung bạn muốn vào cột 'button' ở đây -->
                <b-button variant="primary" @click="showModal(row)">Xem</b-button>
            </template>
        </b-table>
        <b-modal v-model="showModalFlag" size="lg" :title="slPhieuKetSo.lophoc.name">
            <!-- Nội dung của modal -->
            <ModalView :phieuketso="slPhieuKetSo" />
        </b-modal>
    </div>
</template>
<script>
import {getPhieuKetSo} from '~/plugins/phieuketso.js'
import FromToDate from '~/components/DateMonthSelect.vue';
import ModalView from '~/components/DoanhThu/ModalView.vue';
export default {
    data(){
        return {
            busyTable: true,
            showModalFlag: false,
            slPhieuKetSo: {
                lophoc: {

                }
            },
            date: {
                year: "",
                month: ""
            },           
            code: "", 
            phieuketsos: [],
            total: 0,
            items: [],
            fields: [
                {
                    label: "Lớp",
                    key: "name"
                },
                {
                    label: "Tổng tiền thu",
                    key: "total",
                    formatter: this.$formatTotal,
                    // tdClass: "text-right"
                },
                {
                    label: "Tổng phiếu",
                    key: "count"
                },
                {
                    label: "Xem",
                    key: "button"
                }
            ]
        }
    },
    methods: {
        showModal(row){
            console.log(row);
            this.slPhieuKetSo = row.item.pks;
            this.showModalFlag = true;
        },
        updateDate(date) {
            this.date = date;
            let year = date.year.toString();
            let month = date.month.toString().padStart(2, '0'); // Đảm bảo tháng luôn có 2 chữ số
            this.code = `${year}_${month}`;
            this.getPhieuKetSo();
        },
        getPhieuKetSo(){
            this.busyTable = true;
            var that = this;
            getPhieuKetSo(this.$apolloProvider.defaultClient, this.code)
            .then(data => {
                that.phieuketsos = data;
                that.createItemTable();
            }).catch(error => {
                console.log(error);
            });
        },
        createItemTable(){
            var that = this;
            that.items = [];
            that.total = 0;
            that.phieuketsos.forEach(function(phieuketso){
                let total = 0;
                let debt = 0;
                phieuketso.items.forEach(function(item){
                    let o;
                    try {
                        o = JSON.parse(item.data);
                    } catch {
                        o = {
                            total: 0
                        }
                    }
                    item.object = o;
                    if(typeof o.total == "number"){
                        total += o.total;
                    }
                    if(typeof item.hocsinh.parent.debt == "number"){
                        debt += item.hocsinh.parent.debt;
                    }
                });
                phieuketso.total = total;
                phieuketso.debt = debt;
                // console.log(phieuketso);
                that.items.push({
                    name: phieuketso.lophoc.name,
                    type: phieuketso.type,
                    total: total,
                    count: phieuketso.items.length,
                    pks: phieuketso
                })
                that.total += total;
            });
            that.busyTable = false;
        }
    },
    components: {
        FromToDate, ModalView,
    },
    mounted(){
        if (typeof window !== undefined) {
            this.getPhieuKetSo();
        }

    }
}
</script>