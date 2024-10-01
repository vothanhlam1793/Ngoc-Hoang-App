<template>
    <div class="row">
        <div class="col">
            <input class="form-control" placeholder="Nhập tên học sinh - lớp" @keyup="findHocSinh" v-model="inputName">
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
function chuyentiengviet(str) {
    if (str == undefined) {
        return "";
    }
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
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
        }
    },
    methods: {
        findHocSinh() {
            var changeSearchReg = chuyentiengviet(this.inputName).split(" ").join("[ -w]+");
            var reg = new RegExp(changeSearchReg, "i");
            this.filterByNameHocSinh = this.fHocSinhs.filter(function (hocsinh) {
                if (hocsinh.lophoc) {
                    var temp = [hocsinh.name, hocsinh.lophoc.name];
                } else {
                    var temp = [hocsinh.name];
                }
                return reg.test(chuyentiengviet(temp.join(" ")));
            });
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
            this.findHocSinh();
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
    }
}
</script>