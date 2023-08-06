<template>
    <div class="row">
        <div
            class="col"
            v-if="phuhuynh"
        >
            <div class="d-flex justify-content-between mt-3">
                <div>
                    <h1>{{ phuhuynh.name }}</h1>
                    <p>Nợ: {{ numberWithCommas(phuhuynh.debt) }}</p>
                </div>
                <div>
                    <button
                        type="button"
                        class="btn btn-primary"
                        data-toggle="modal"
                        :data-target="'#myModal' + phuhuynh.id"
                    >
                        Thu/chi phụ huynh
                    </button>

                    <!-- The Modal -->
                    <div
                        class="modal"
                        :id="'myModal' + phuhuynh.id"
                    >
                        <div class="modal-dialog">
                            <div class="modal-content">

                                <!-- Modal Header -->
                                <div class="modal-header">
                                    <h4 class="modal-title">Phiếu thu tiền</h4>
                                    <button
                                        type="button"
                                        class="close"
                                        data-dismiss="modal"
                                    >&times;</button>
                                </div>

                                <!-- Modal body -->
                                <div class="modal-body">
                                    <PhieuThuCreate :phuhuynh="phuhuynh"
                                    @update-state="createPhieuThu"
                                    ></PhieuThuCreate>
                                </div>

                                <!-- Modal footer -->
                                <div class="modal-footer">
                                    <button
                                        type="button"
                                        class="btn btn-danger"
                                        data-dismiss="modal"
                                    >Close</button>
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
                                <td class="text-right">{{ numberWithCommas(log.value) }}</td>
                                <td class="text-center"><button
                                        class="btn btn-danger"
                                        v-if="log.itemS == 'PhieuThu'"
                                        @click="deletePhieuThu(log)"
                                    >
                                        x
                                    </button>


                                    <b-button
                                        v-if="log.itemS == 'ItemKetSo'"
                                        variant="primary"
                                        @click="showTableKetSo(log)"
                                    >
                                        <i class="fa-solid fa-eye"></i>
                                    </b-button>
                                    <b-modal
                                        size="lg"
                                        :id="`modal-${log.id}`"
                                        :title="getType(log)"
                                        v-if="log.itemS == 'ItemKetSo'"
                                    >
                                        <div v-if="itemKetSo.id">
                                            <ShowKSComponent
                                                :phieuketso="itemKetSo.phieuketso"
                                                :item="itemKetSo"
                                            >

                                            </ShowKSComponent>
                                            {{ itemKetSo.oData }}
                                        </div>
                                        <div v-else>

                                        </div>
                                    </b-modal>

                                    <b-button
                                        v-if="log.itemS == 'HoaDon'"
                                        variant="warning"
                                        @click="showHoaDon(log)"
                                    >
                                        <i class="fa-solid fa-eye"></i>
                                    </b-button>
                                    <b-modal
                                        size="lg"
                                        :id="`modal-hd-${log.id}`"
                                        :title="getType(log)"
                                        v-if="log.itemS == 'HoaDon'"
                                    >
                                        <ShowHoaDon :idHoaDon="log.idItemS">
                                        </ShowHoaDon>
                                    </b-modal>
                                </td>
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
import { getItemKetSo } from '~/plugins/itemketso'
import ShowKSComponent from '~/components/KetSo/ShowComponentV2.vue'
import ShowHoaDon from '~/components/HoaDon/Show.vue'
export default {
    components: {
        ShowKSComponent, ShowHoaDon
    },
    props: ['idPhuHuynh', 'loadData'],
    data() {
        return {
            item: {},
            phuhuynh: {},
            logs: [],
            itemKetSo: {},
            hoadon: {}
        }
    },
    methods: {
        createPhieuThu(state){
            if(state == "CREATED"){
                $('#myModal' + this.idPhuHuynh).modal('hide');
                var that = this;
                this.$store.dispatch("logv2/getLogsDebt", this.idPhuHuynh);
                this.$store.dispatch("phuhuynhv2/getPhuHuynh", this.idPhuHuynh);
                setTimeout(function(){
                    that.reloadData();
                }, 2000);
            }
        },
        showHoaDon(log) {
            this.$bvModal.show(`modal-hd-${log.id}`);
        },
        showTableKetSo(log) {
            // console.log(this.phuhuynh);
            // return;
            var that = this;
            getItemKetSo(this.$apolloProvider.defaultClient, log.idItemS)
                .then(data => {
                    this.$bvModal.show(`modal-${log.id}`);
                    that.itemKetSo = data;
                    that.itemKetSo.data = JSON.parse(data.data);
                    that.itemKetSo.lophoc = that.itemKetSo.hocsinh.lophoc;
                    console.log(data);
                }).catch(err => {
                    console.log(err);
                })
        },
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
                    if (l != undefined) {
                        // var d = JSON.parse(l.data);
                        if (l.phieuketso) {
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
        getItemKetSo(log) {
            if (log.itemS == "ItemKetSo") {
                return this.$store.state.pkssp.itemKetSoById[log.idItemS];
            }
        },
        reloadData(){
            if (this.logs == undefined) {
                return;
            }
            var that = this;
            console.log("RELOAD");
            this.logs.forEach(function (log) {
                if (log.itemS == "ItemKetSo") {
                    that.$store.dispatch("pkssp/getPhieuKetSo", log.idItemS);
                }
            });
        }
    },
    watch: {
        loadData: function () {
            this.reloadData();
        },
        monitorPhuhuynh: function () {
            this.phuhuynh = this.phuhuynhById[this.idPhuHuynh];
            this.logs = this.logsById[this.idPhuHuynh];
        },
        monitorLog: function () {
            this.phuhuynh = this.phuhuynhById[this.idPhuHuynh];
            this.logs = this.logsById[this.idPhuHuynh];
            console.log(this.logs);
        },
        monitorItemKetSo: function () {
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
        monitorPhuhuynh() {
            return this.$store.state.phuhuynhv2.monitor;
        },
        monitorLog() {
            return this.$store.state.logv2.monitor;
        },
        monitorItemKetSo() {
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