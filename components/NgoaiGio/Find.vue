<template>
    <div class="row">
        <div class="col">
            <input class="form-control" placeholder="Nhập tên học sinh - lớp" @input="findHocSinh" v-model="inputName">
            <div class="table-responsive">
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr class="text-center">
                            <th>Tên</th>
                            <th>Lớp</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="hocsinh in filterByNameHocSinh">
                            <td>{{ hocsinh.name }} <span v-if="getSName(hocsinh.id).length > 0">({{ getSName(hocsinh.id)
                                    }})</span></td>
                            <td v-if="hocsinh.lophoc">{{ hocsinh.lophoc.name }}</td>
                            <td v-else> </td>
                            <td class="text-center"><button class="btn btn-success"
                                    @click="chose(hocsinh)">Chọn</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </div>
</template>
<script>
import InputName from '~/components/NgoaiGio/InputName.vue';
import Index from '~/components/Filter/Table/Index.vue';

import { getVariablesByKey } from '~/plugins/variable.js';

export default {
    components: {
        InputName,
        Index
    },
    data() {
        return {
            fHocSinhs: [],
            filterByNameHocSinh: [],
            inputName: "",
            chosen: [],
            variables: [],
            searchTimer: null,
        }
    },
    methods: {
        findHocSinh() {
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => {
                this.$store.commit("filter/hocsinh/updateSearchName", this.inputName);
                this.$store.dispatch("filter/hocsinh/applyFilters");
            }, 300);
        },
        chose(hocsinh) {
            this.$emit("update-data", hocsinh);
        },
        getVariable() {
            var that = this;
            getVariablesByKey(this.$apolloProvider.defaultClient, "SNAME")
                .then(data => {
                    that.variables = data;
                    // console.log(data);
                }).catch(err => {
                    console.log(err);
                });
        },
        getSName(idItem) {
            let sname = this.variables.filter(function (variable) {
                return variable.idItem == idItem;
            });
            if (sname.length == 0) {
                return "";
            } else {
                return sname[0].value;
            }
        },
    },
    watch: {
        hocsinhs: function () {
            this.fHocSinhs = this.hocsinhs.filter(function (hocsinh) {
                return (hocsinh.status != "NGHI_LUON") && (hocsinh.lophoc != undefined);
            });
            this.filterByNameHocSinh = this.fHocSinhs;
        }
    },
    computed: {
        hocsinhs() {
            return this.$store.state.filter.hocsinh.hocsinhs;
        },
        monitor() {
            return this.$store.state.filter.hocsinh.monitor;
        }
    },
    mounted() {
        this.$store.dispatch("filter/hocsinh/getAllHocsinhs");
        this.getVariable();
    },
    beforeDestroy() {
        clearTimeout(this.searchTimer);
        this.$store.commit("filter/hocsinh/updateSearchName", "");
    }
}
</script>
