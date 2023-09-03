<template>
    <div class="row">
        <div class="col">
            <div
                class="row"
                v-if="item.id"
            >
                <div class="col">
                    <div class="row">
                        <div class="col-4">
                            <h4>Kỳ: {{ item.phieuketso.code }}</h4>
                            <p>Số tiền: {{ numberWithCommas(hocphi.total) }}</p>
                        </div>
                        <div
                            class="col-4 text-right"
                            v-if="state == 'EDIT'"
                        >
                            <b-button
                                variant="warning"
                                @click="actionButton('SAVE')"
                            >
                                Lưu lại
                            </b-button>
                            <b-button
                                variant="danger"
                                @click="actionButton('CANCEL')"
                            >
                                Huỷ
                            </b-button>
                        </div>
                        <div class="col-4">
                            <b-button @click="addPhiMoRong" class="btn btn-success">Thêm phí mở rộng</b-button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <table class="table table-bordered table-striped ">
                                <tr @dblclick="showModal('hocphi')">
                                    <td><b>{{ keyToLabel('hocphi') }}</b></td>
                                    <td class="text-right pr-5">{{ numberWithCommas(hocphi.hocphi) }}</td>
                                </tr>
                                <tr @dblclick="showModal('csvc')">
                                    <td><b>{{ keyToLabel('csvc') }}</b></td>
                                    <td class="text-right pr-5">{{ numberWithCommas(hocphi.csvc) }}</td>
                                </tr>
                                <tr @dblclick="showModal('camera')">
                                    <td><b>{{ keyToLabel('camera') }}</b></td>
                                    <td class="text-right pr-5">{{ numberWithCommas(hocphi.camera) }}</td>
                                </tr>
                                <tr @dblclick="showModal('ngoaigio')">
                                    <td><b>{{ keyToLabel('ngoaigio') }}</b></td>
                                    <td class="text-right pr-5">{{ numberWithCommas(hocphi.ngoaigio) }}</td>
                                </tr>
                                <tr @dblclick="showModal('an545')">
                                    <td><b>{{ keyToLabel('an545') }}</b></td>
                                    <td class="text-right pr-5">{{ numberWithCommas(hocphi.an545) }}</td>
                                </tr>
                                <tr>
                                    <td><b>{{ keyToLabel('phimorong') }}</b></td>
                                    <td class="text-right pr-5">{{ numberWithCommas(hocphi.phimorong) }}
                                        <b-button
                                            :key="`btn-${item.id}`"
                                            @click="showModalId(`md-${item.id}`)"
                                            variant="warning"
                                        >Chỉnh</b-button>
                                    </td>
                                </tr>
                                <tr @dblclick="showModal('khac')">
                                    <td><b>{{ keyToLabel('khac') }}</b></td>
                                    <td class="text-right pr-5">{{ numberWithCommas(hocphi.khac) }}</td>
                                </tr>
                                <tr @dblclick="showModal('thanhtiennghi')">
                                    <td><b>{{ keyToLabel('thanhtiennghi') }}</b></td>
                                    <td class="text-right pr-5">{{ numberWithCommas(hocphi.thanhtiennghi) }}</td>
                                </tr>
                                <tr>
                                    <td><b>{{ keyToLabel('total') }}</b></td>
                                    <td class="text-right pr-5">{{ numberWithCommas(hocphi.total) }}</td>
                                </tr>
                            </table>
                            <EModal
                                :isOpen="openModalEdit"
                                :inputData="value"
                                :label="keyToLabel(key)"
                                @update-data="updateDataEdit"
                            />
                            <b-modal
                                :key="`md-${item.id}`"
                                :id="`md-${item.id}`"
                                :title="item.hocsinh.name"
                                ok-only
                            >
                                <table class="table table-bordered table-striped">
                                    <tr>
                                        <th>Phí</th>
                                        <th>Tiền</th>
                                        <td></td>
                                    </tr>
                                    <tr
                                        v-for="key in Object.keys(pmr)"
                                        :class="getClass(key)"
                                    >
                                        <td>{{ pmr[key].label }}</td>
                                        <td>
                                            <input
                                                class="form-control"
                                                v-model="pmr[key].value"
                                                @change="calcTotal(true)"
                                            />
                                        </td>
                                        <td>
                                            <button
                                                class="btn btn-danger"
                                                v-if="pmr[key].checked"
                                                @click="addLocal(key)"
                                            >Huỷ</button>
                                            <button
                                                class="btn btn-success"
                                                v-else
                                                @click="addLocal(key)"
                                            >Thêm</button>
                                        </td>
                                    </tr>
                                </table>
                            </b-modal>
                        </div>
                    </div>
                </div>

            </div>
            <div
                class="row"
                v-else
            >
                <div class="col">
                    <p>Chưa có phiếu được chọn</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import EModal from '~/components/ItemKetSo/EditModal.vue';
import { updateItemKetSo } from '~/plugins/itemketso.js';
import {  getVariablesStartWithKey } from '~/plugins/variable.js';
export default {
    props: ['item'],
    components: {
        // Index
        EModal,
    },
    data() {
        return {
            hocphi: {},
            state: "IDLE",
            key: "",
            value: "",
            openModalEdit: false,
            keyLabels: {
                hocphi: "Học phí",
                csvc: "Cơ sở vật chất",
                camera: "Camera",
                ngoaigio: "Ngoài giờ",
                an545: "Ăn chiều",
                phimorong: "Phí mở rộng",
                khac: "Thu khác",
                thanhtiennghi: "Thành tiền nghỉ",
                total: "Tổng"
            },
            pmr: {},
            pmrs: []
        }
    },
    watch: {
        item(n, o) {
            this.updateData();
            console.log(this.hocphi);
        },
        state(n, o) {
            this.$emit("update-state", n);
        }
    },
    methods: {
        handleCheckboxChange(pmr) {
            pmr.checked = !pmr.checked;
            this.calcPMR();
        },
        addPhiMoRong(local){
            var that = this;
            that.pmrs.forEach(function(variable){
                if(that.pmr[variable.key] == undefined){
                    that.pmr[variable.key] = {};
                    that.pmr[variable.key].label = variable.label;
                    that.pmr[variable.key].value = variable.value;
                    that.pmr[variable.key].type = variable.type;
                    that.pmr[variable.key].checked = false;
                }
            });
            this.calcPMR();    
            // console.log(this.pmr, this.pmrs, this.hocphi);
            this.$forceUpdate();
        },
        calcPMR(){
            var that = this;
            var total = 0;
            Object.keys(this.pmr).forEach(function(key){
                if(that.pmr[key].checked == true){
                    total += parseInt(that.pmr[key].value);
                }
            });
            if(that.hocphi.phimorong != total){
                this.state = "EDIT";
                that.hocphi.phimorong = total;
                this.uploadHocPhi();
            }
            that.hocphi.phimorong = total;
            that.hocphi.detailPhiMoRong = that.pmr;
            // that.calcTotal();
        },
        addLocal(key){
            // console.log(key, this.pmr[key]);
            this.pmr[key].checked = !this.pmr[key].checked;
            this.calcPMR();
            this.calcTotal();
            this.$forceUpdate();
        },
        calcTotal(local){
            var that = this;
            var total = 0;
            Object.keys(this.pmr).forEach(function(key){
                if(that.pmr[key].checked == true){
                    total += parseInt(that.pmr[key].value);
                }
            });
            if(that.hocphi.phimorong != total){
                this.state = "EDIT";
                that.hocphi.phimorong = total;
                this.uploadHocPhi();
            }
        },
        getClass(key){
            if(this.pmr[key].checked){
                return "table-success"
            } else {
                return ""
            }
        },
        actionButton(action) {
            var that = this;
            if (action == "SAVE") {
                // Tạo mới dữ liệu
                this.hocphi.detailPhiMoRong = this.pmr;
                updateItemKetSo(this.$apolloProvider.defaultClient, this.item.id, this.hocphi)
                    .then(data => {
                        that.state = "IDLE";
                    }).catch(err => {
                        console.log(err);
                    })
                // Xoá phiếu cũ


            } else if (action == "CANCEL") {
                this.state = "IDLE";
                this.updateData();
            }
        },
        showModalId(id){
            this.$bvModal.show(id);
        },
        showModal(key) {
            this.value = this.hocphi[key].toString();
            this.key = key;
            this.openModalEdit = true;
        },
        uploadHocPhi(key) {
            var that = this;
            var total = 0;
            total = that.hocphi.hocphi
            + that.hocphi.csvc
            + that.hocphi.camera
            + that.hocphi.totalHoaDon
            + that.hocphi.ngoaigio
            + that.hocphi.phimorong
            + that.hocphi.khac
            - that.hocphi.thanhtiennghi;

            that.hocphi.total = total;
        },
        updateDataEdit(data) {
            if (this.value !== data) {
                this.state = "EDIT";
                this.value = data;
                this.uploadHocPhi(this.key);
            }
            this.openModalEdit = false;
        },
        keyToLabel(key) {
            return this.keyLabels[key] || key;
        },
        objectToArray(obj) {
            const arr = [];
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    arr.push({ key, value: obj[key] });
                }
            }
            return arr;
        },
        numberWithCommas(x) {
            if (x == undefined) {
                return "0";
            }
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        updateData() {
            switch (this.state) {
                case "IDLE": {
                    if (this.item.data.total == undefined) {
                        this.hocphi = {
                            hocphi: this.item.data.hocphi || 0,
                            csvc: this.item.data.csvc || 0,
                            camera: this.item.data.camera || 0,
                            ngoaigio: this.item.data.ngoaigio || 0,
                            an545: this.item.data.an545 || 0,
                            khac: this.item.data.khac || 0,
                            thanhtiennghi: this.item.data.thanhtiennghi || 0,
                            phimorong: this.item.data.phimorong || 0,
                            total: this.item.data.total || 0,

                        }
                        return;
                    }
                    for (var key in this.item.data) {
                        if (this.item.data.hasOwnProperty(key)) {
                            this.hocphi[key] = this.item.data[key];
                        }
                    }
                    if(this.item.data.phimorong == undefined){
                        this.hocphi.phimorong = 0;
                        this.pmr = {}
                    } else {
                        this.pmr = this.item.data.detailPhiMoRong;
                    }
                } break;
            }
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
    mounted() {
        this.updateData();
        this.getPhiMoRongs();
    }
}
</script>