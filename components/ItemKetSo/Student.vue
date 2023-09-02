<template>
    <div class="row">
        <div class="col">
            <div class="row">
                <div class="col">
                    <div class="d-flex justify-content-between">
                        <div>
                            <div v-if="hocsinh.id">
                                <div class="">
                                    <h3>{{ hocsinh.name }}</h3>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button
                                v-if="hocsinh.id == undefined"
                                type="button"
                                class="btn btn-primary"
                                data-toggle="modal"
                                data-target="#findHocSinhModal"
                            >
                                <i class="fa-solid fa-plus"></i>
                            </button>
                            <button
                                v-else
                                type="button"
                                class="btn btn-warning"
                                data-toggle="modal"
                                data-target="#findHocSinhModal"
                            >
                                <i class="fa-sharp fa-solid fa-pen-to-square"></i>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            <div class="row my-3">
                <div class="col">
                    <div class="mt-2">
                        <b-table
                            :items="items"
                            :fields="fields"
                        >
                            <template #cell(data)="row">
                                {{ numberWithCommas(row.item.data.total) }}
                            </template>
                            <template #cell(button)="row">
                                <b-button
                                    variant="warning"
                                    @click="selectItem(row.item)"
                                >
                                    V
                                </b-button>
                            </template>
                        </b-table>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">


                    <!-- The Modal -->
                    <div
                        class="modal"
                        id="findHocSinhModal"
                    >
                        <div class="modal-dialog">
                            <div class="modal-content">

                                <!-- Modal Header -->
                                <div class="modal-header">
                                    <h4 class="modal-title">Tìm học sinh</h4>
                                    <button
                                        type="button"
                                        class="close"
                                        data-dismiss="modal"
                                    >&times;</button>
                                </div>

                                <!-- Modal body -->
                                <div class="modal-body">
                                    <Find @update-data="updateHocSinh" />
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
        </div>
    </div>
</template>
<script>
import Find from '~/components/NgoaiGio/Find.vue'
import { getItemKetSoWithStudent } from '~/plugins/itemketso.js'
export default {
    components: {
        Find
    },
    data() {
        return {
            items: [],
            fields: [{
                label: "Kỳ",
                key: "phieuketso.code"
            }, {
                label: "Tổng",
                key: "data"
            }, {
                label: "Chỉnh",
                key: "button"
            }],
            hocsinh: {},
            itemSelect: {}
        }
    },
    methods: {
        selectItem(item) {
            this.itemSelect = item;
            this.$emit("update-item", item);
        },
        numberWithCommas(x) {
            if (x == undefined) {
                return "0";
            }
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        updateHocSinh(hocsinh) {
            console.log(hocsinh);
            var that = this;
            $("#findHocSinhModal").modal('hide');
            this.hocsinh = hocsinh;
            getItemKetSoWithStudent(this.$apolloProvider.defaultClient, this.hocsinh.id)
                .then(data => {
                    console.log(data);
                    data.forEach(function(item){
                        let a = {};
                        try {
                            a = JSON.parse(item.data);
                        } catch (e) {
                            a = {}
                        };
                        item.data = a;
                    });
                    that.items = data;
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    computed: {

    },
    created() {

    }
}
</script>