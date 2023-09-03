<template>
    <div class="row">
        <div class="col">
            <div class="row my-3">
                <div class="col-6 p-3">
                    <button class="btn btn-warning" @click="saveChanged()">
                        Lưu lại
                    </button>
                </div>
                <div class="col-6 p-3 text-right">
                    <b-button @click="showModal" class="btn btn-success">Thêm phí mở rộng</b-button>
                    <b-modal v-model="show" title="Các phí mở rộng" ok-only>
                        <div>
                            <table class="table table-bordered">
                                <tr>
                                    <th>Phí</th>
                                    <th>Số tiền</th>
                                    <th></th>
                                </tr>
                                <tr v-for="pmr in pmrs">
                                    <td>{{ pmr.label }}</td>
                                    <td>{{ pmr.value }}</td>
                                    <td><div>
                                        <button v-if="pmr.checked" class="btn btn-danger" @click="handleCheckboxChange(pmr)">Huỷ</button>
                                        <button v-else class="btn btn-success" @click="handleCheckboxChange(pmr)">Chọn</button>
                                    </div></td>
                                </tr>
                            </table>
                        </div>
                    </b-modal>
                </div>
            </div>
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
                        <th>Phí mở rộng</th>
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
                        :pmrs="pmrs"
                        :statePmrs="statePmrs"
                    ></KetSoElement>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import ShowDiemDanh from '~/components/KetSo/ShowDiemDanh.vue';
import {  getVariablesStartWithKey } from '~/plugins/variable.js'
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
            pmrs: [],
            statePmrs: 0,
            show: false,
            fields: [
                {
                    key: 'label',
                    label: "Phí"
                },
                {
                    key: 'value',
                    label: "Số tiền"
                },
                { key: 'checked', label: 'Chọn' },
            ]
        }
    },
    methods: {
        handleCheckboxChange(pmr) {
            pmr.checked = !pmr.checked;
            this.statePmrs += 1;
        },
        showModal(){
            this.show = true;
        },
        chuyentiengviet(str) {
            if (str == undefined) {
                return "";
            }
            return str.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D');
        },
        sortItem(items) {
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
        },
        parseKey(key){
            var parts = key.split("_");
            var part1 = parts[0]; // MR
            var part2 = parts.slice(1, -1).join("_"); // bo_him_y_t
            var part3 = parts[parts.length - 1]; // VALUE
            return {
                key: part2,
                value: part3
            }
        },
        updatePMRs(variables){
            var that = this;
            var pmrs = {};
            variables.forEach(function(variable){
                let p = that.parseKey(variable.key);
                if(pmrs[p.key] == undefined){
                    pmrs[p.key] = {
                        key: p.key
                    };
                }
                pmrs[p.key][p.value] = variable.value;
                pmrs[p.key]["ID" + p.value] = variable.id;
            });
            that.pmrs = [];
            for (const key in pmrs) {
                if (pmrs.hasOwnProperty(key)) {
                    that.pmrs.push({ 
                        idLabel: pmrs[key].IDLABEL,
                        idValue: pmrs[key].IDVALUE,
                        idType: pmrs[key].IDTYPE,
                        label: pmrs[key].LABEL,
                        value: pmrs[key].VALUE,
                        type: pmrs[key].TYPE,
                        key: pmrs[key].key,
                        state: "IDLE",
                        checked: false
                    });
                }
            }
            console.log("PMR:", this.pmrs);
        },
        getPhiMoRongs(){
            var that = this;
            getVariablesStartWithKey(this.$apolloProvider.defaultClient, "MR_")
            .then(data => {
                that.updatePMRs(data);
            }).catch(err => {
                console.log(err);
            });
        },
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
        this.getPhiMoRongs();
    },

    layout: "app"
}
</script>