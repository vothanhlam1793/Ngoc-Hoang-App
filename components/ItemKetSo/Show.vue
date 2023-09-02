<template>
    <div class="row">
        <div class="col">
            <div
                class="row"
                v-if="item.id"
            >
                <div class="col">
                    <div class="row">
                        <div class="col-6">
                            <h4>Kỳ: {{ item.phieuketso.code }}</h4>
                            <p>Số tiền: {{ numberWithCommas(hocphi.total) }}</p>
                        </div>
                        <div
                            class="col-6 text-right"
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
import { updateItemKetSo } from '~/plugins/itemketso.js'
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
                khac: "Thu khác",
                thanhtiennghi: "Thành tiền nghỉ",
                total: "Tổng"
            }
        }
    },
    watch: {
        item(n, o) {
            this.updateData();
        },
        state(n, o) {
            this.$emit("update-state", n);
        }
    },
    methods: {
        actionButton(action) {
            var that = this;
            if (action == "SAVE") {
                // Tạo mới dữ liệu
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
        showModal(key) {
            this.value = this.hocphi[key].toString();
            this.key = key;
            this.openModalEdit = true;
        },
        uploadHocPhi(key) {
            this.hocphi.total = this.hocphi.total - this.hocphi[key];
            this.hocphi[key] = parseInt(this.value);
            this.hocphi.total += this.hocphi[key];
            console.log(this.hocphi);
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
                            total: this.item.data.total || 0,

                        }
                        return;
                    }
                    for (var key in this.item.data) {
                        if (this.item.data.hasOwnProperty(key)) {
                            this.hocphi[key] = this.item.data[key];
                        }
                    }
                } break;
            }
        }
    },
    mounted() {
        this.updateData();
    }
}
</script>