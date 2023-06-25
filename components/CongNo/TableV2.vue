<template>
    <div class="row">
        <div class="col" v-if="phuhuynh">
            <div class="d-flex justify-content-between mt-3">
                <div>
                    <h1>{{ phuhuynh.name }}</h1>
                    <p>Nợ: {{ numberWithCommas(phuhuynh.debt) }}</p>
                </div>
                <div>
                    <button type="button" class="btn btn-primary" data-toggle="modal"
                        :data-target="'#myModal' + phuhuynh.id">
                        Thu tiền phụ huynh
                    </button>

                    <!-- The Modal -->
                    <div class="modal" :id="'myModal' + phuhuynh.id">
                        <div class="modal-dialog">
                            <div class="modal-content">

                                <!-- Modal Header -->
                                <div class="modal-header">
                                    <h4 class="modal-title">Phiếu thu tiền</h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>

                                <!-- Modal body -->
                                <div class="modal-body">
                                    <PhieuThuCreate :phuhuynh="phuhuynh"></PhieuThuCreate>
                                </div>

                                <!-- Modal footer -->
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr class="text-center">
                                <td>Ngày</td>
                                <td>Phiếu</td>
                                <td>Số tiền</td>
                                <td>Còn nợ</td>
                                <td>Hành động</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="log in logs">
                                <td>{{ showDate(log.createdAt) }}</td>
                                <td>{{ getType(log) }}</td>
                                <td class="text-right">{{ numberWithCommas(log.valueChange) }}</td>
                                <td class="text-right">{{ numberWithCommas(log.value)}}</td>
                                <td class="text-center"><button class="btn btn-danger" v-if="log.itemS == 'PhieuThu'"
                                        @click="deletePhieuThu(log)">
                                        x
                                    </button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    props: ['idPhuHuynh', 'loadData'],
    data() {
        return {
            item: {},
            phuhuynh: {},
            logs: []
        }
    },
    methods: {
        deletePhieuThu(log) {
            if (confirm("Bạn đang dự định xoá phiếu thu? Không phục hồi được đâu.")) {

            } else {
                return;
            }
            var client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`
                mutation {
                    deletePhieuThu(id: "${log.idItemS}"){
                        id
                    }
                }
                `
            }).then(data => {
                location.reload();
            }).catch(err => {

            })
        },
        getDate(d) {
            return (new Date(d * 1000)).toISOString();
        },
        showDate(d) {
            var d1 = new Date(d);
            return `${d1.getDate()}/${d1.getMonth() + 1}/${d1.getFullYear()}`;
        },
        numberWithCommas(x) {
            if (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
                return 0;
            }
        },
        getType(log) {
            // console.log("TABLEV2-", log);
            switch (log.itemS) {
                case "ItemKetSo": {
                    var l = this.getItemKetSo(log);
                    if(l != undefined){
                        // var d = JSON.parse(l.data);
                        if(l.phieuketso){
                            return `KS tháng ${l.phieuketso.code.split("_")[1]}/${l.phieuketso.code.split("_")[0]} : ${l.hocsinh.name}`;
                        } else {
                            return `${l.code} : ${l.hocsinh.name}`
                        }
                    } else {
                        return "Kết sổ tháng";
                    }
                } break;
                case "HoaDon": {
                    return "Mua hàng trực tiếp"
                } break;
                case "PhieuThu": {
                    return "Thu tiền phụ huynh"
                } break;
                default: {
                    return "Không xác định"
                }
            }
        },
        getItem(item) {
            var infoItem = `id`;
            switch (item.name) {
                case "ItemKetSo": {
                    infoItem = `id code total createdAt`;
                } break;
                case "HoaDon": {
                    infoItem = `id total`;
                } break;
                case "PhieuThu": {
                    infoItem = `id`;
                } break;
                default: {
                    infoItem = `id`;
                }
            }
            var client = this.$apolloProvider.defaultClient;
            var str = `
                    query {
                        ${item.name} (where: {id: "${item.id}"}){
                            ${infoItem}
                        } 
                    }
                `;

            console.log(str);
            client.query({
                query: gql(str)
            }).then(data => {
                console.log(data);
            }).catch(err => {
                console.log(err);
            })
        },
        choose(log) {
            this.getItem({
                name: log.itemS,
                id: log.idItemS
            });

        },
        getItemKetSo(log){
            if(log.itemS == "ItemKetSo"){
                return this.$store.state.pkssp.itemKetSoById[log.idItemS];
            }
        }
    },
    watch: {
        loadData: function(){
            // console.log("LOAD DATA", this.phuhuynh);
            if(this.logs == undefined){
                return;
            }
            var that = this;
            this.logs.forEach(function(log){
                if(log.itemS == "ItemKetSo"){
                    that.$store.dispatch("pkssp/getPhieuKetSo", log.idItemS);
                }
            });
        },
        monitorPhuhuynh: function(){
            this.phuhuynh = this.phuhuynhById[this.idPhuHuynh];
            this.logs = this.logsById[this.idPhuHuynh];
        },
        monitorLog: function(){
            this.phuhuynh = this.phuhuynhById[this.idPhuHuynh];
            this.logs = this.logsById[this.idPhuHuynh];
        },
        monitorItemKetSo: function(){
            this.$forceUpdate();
        }
    },
    computed: {
        logsById() {
            return this.$store.state.logv2.logs;
        },
        phuhuynhById() {
            return this.$store.state.phuhuynhv2.phuhuynhById;
        },
        monitorPhuhuynh(){
            return this.$store.state.phuhuynhv2.monitor;
        },
        monitorLog(){
            return this.$store.state.logv2.monitor;
        },
        monitorItemKetSo(){
            return this.$store.state.pkssp.monitor;
        }
    },
    mounted() {
        if (typeof window !== undefined) {
            // console.log(this.idPhuHuynh);
            if (this.idPhuHuynh) {
                this.$store.dispatch("logv2/getLogsDebt", this.idPhuHuynh);
                this.$store.dispatch("phuhuynhv2/getPhuHuynh", this.idPhuHuynh);
            }
        }
    }
}
</script>