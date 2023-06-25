<template>
    <div class="row">
        <div class="col">
            <div class="my-3">
                <button class="btn btn-warning" @click="saveChanged()">
                    Lưu lại
                </button>
            </div>
            <!-- <ShowDiemDanh v-if="phieuketso.items"
                :hocsinh="phieuketso.items[0]"
                :type="'DIHOCHANGNGAY'"
                :year="'2023'"
                :month="'06'"
            /> -->
            <table class="table table-bordered table-striped">
                <thead>
                    <tr class="text-center">
                        <th style="width: 10%">Tên</th>
                        <th style="width: 5%">Tổng</th>
                        <th>Học phí</th>
                        <th>CSVC<br>
                            <select @change="$store.commit('ketso/updateStateCSVC', csvc)" v-model="csvc">
                                <option value="NONE" selected>Không</option>
                                <option value="HALF">Nửa</option>
                                <option value="FULL">Nguyên</option>
                            </select>
                        </th>
                        <th>Camera</th>
                        <th>Hóa Đơn</th>
                        <th>Ngoài giờ</th>
                        <th>Ăn 4g45</th>
                        <th>Khác</th>
                        <th>Diễn giải</th>
                        <th>Ngày nghỉ</th>
                        <th>Tiền nghỉ</th>
                    </tr>
                </thead>
                <tbody>
                    <KetSoElement v-for="item in sortItem(phieuketso.items)" :item="item" :key="item.id"
                        :month="month"
                        :year="year"
                    ></KetSoElement>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import ShowDiemDanh from '~/components/KetSo/ShowDiemDanh.vue';
export default {
    components: {
        ShowDiemDanh
    },
    data() {
        return {
            csvc: "NONE",
            year: "",
            month: "",
            idLopHoc: "",
        }
    },
    methods: {
        chuyentiengviet(str) {
            if (str == undefined) {
                return "";
            }
            return str.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D');
        },
        sortItem(items) {
            console.log(items);
            var ret = [];
            if (items) {
                var that = this;
                items.forEach(function (item) {
                    ret.push(item);
                });
                ret.sort(function (a, b) {
                    var t = a.hocsinh.name.split(" ");
                    var u = b.hocsinh.name.split(" ");
                    if (that.chuyentiengviet(t[t.length - 1]) < that.chuyentiengviet(u[u.length - 1])) {
                        return -1;
                    }
                    if (that.chuyentiengviet(t[t.length - 1]) > that.chuyentiengviet(u[u.length - 1])) {
                        return 1;
                    }
                    return 0;
                });
                return ret;
            }
            return ret;
        },
        sortHocSinh(hocsinhs) {
            var ret = [];
            if (hocsinhs) {
                var that = this;
                hocsinhs.forEach(function (hocsinh) {
                    ret.push(hocsinh);
                });
                ret.sort(function (a, b) {
                    var t = a.name.split(" ");
                    var u = b.name.split(" ");
                    if (that.chuyentiengviet(t[t.length - 1]) < that.chuyentiengviet(u[u.length - 1])) {
                        return -1;
                    }
                    if (that.chuyentiengviet(t[t.length - 1]) > that.chuyentiengviet(u[u.length - 1])) {
                        return 1;
                    }
                    return 0;
                });
                return ret;
            }
            return ret;
        },
        saveChanged() {
            this.$store.dispatch("pks/updatePhieuKetSo");
        }
    },
    computed: {
        phieuketso() {
            // console.log(this.$store.state.pks.phieuketso);
            // Cap nhat lai phieu ket so
            // var phieuketso = this.$store.state.pks.phieuketso;
            return this.$store.state.pks.phieuketso;
        },
        stateEdit() {
            return this.$store.state.pks.stateEdit;
        }
    },
    mounted() {
        this.year = this.$route.params.year;
        this.month = this.$route.params.month;
        this.idLopHoc = this.$route.params.id;
        // this.createOrUpdatePhieuKetSo();
        this.$store.commit("pks/updateCode", `${this.year}_${this.month}`);
        this.$store.commit("pks/updateIdLopHoc", this.$route.params.id);

        this.$store.dispatch("pks/createOrUpdatePhieuKetSo");
    },

    layout: "app"
}
</script>