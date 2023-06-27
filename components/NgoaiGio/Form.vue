<template>
    <div class="row">
        <div class="col">
            <div class="row my-3">
                <div class="col">
                    <InputName @update-data="updateInputName" :defaultValue="name" />
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="col">
                        <InputMonthYear @date-updated="updateInputDate" :defaultDate="date" :title="'Ngày: '" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="row">
                        <div class="col text-right">
                            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
                                Thêm học sinh
                            </button>
                        </div>
                    </div>

                    <!-- The Modal -->
                    <div class="modal" id="myModal">
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content">

                                <!-- Modal Header -->
                                <div class="modal-header">
                                    <h4 class="modal-title">Thêm học sinh</h4>
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                </div>

                                <!-- Modal body -->
                                <div class="modal-body">
                                    <Find @update-data="updateHocSinhs" />
                                </div>

                                <!-- Modal footer -->
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-danger" data-dismiss="modal">Đóng</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" v-if="hocsinhs.length > 0">
                <div class="col">
                    <table class="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Lớp</th>
                                <th>Giờ về</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="hocsinh, index in hocsinhs">
                                <td>{{ hocsinh.name }}</td>
                                <td>{{ hocsinh.lophoc.name }}</td>
                                <td><select class="form-control" v-model="results[hocsinh.id]">
                                        <option value="VETRE2" selected>18 giờ</option>
                                        <!-- <option value="VETRE2">18 giờ</option> -->
                                    </select></td>
                                <td class="text-center"><button @click="deleteHocsinh(hocsinh)"
                                        class="btn btn-danger">x</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="row" v-if="hocsinhs.length > 0">
                <div class="col">
                    <button class="btn btn-success" @click="saveVeTre()">
                        Lưu lại
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
import InputName from '~/components/NgoaiGio/InputName.vue';
import Find from '~/components/NgoaiGio/Find.vue';
import InputMonthYear from '~/components/BaoCao/V1/InputMonthYear.vue';
export default {
    components: {
        InputName,
        Find,
        InputMonthYear
    },
    props: ['month', 'year'],
    data() {
        return {
            date: new Date().toISOString().slice(0, 10),
            name: "",
            hocsinhs: [],
            results: {}
        }
    },
    methods: {
        updateInputName(name) {
            this.name = name;
        },
        updateInputDate(date) {
            this.date = date;
        },
        updateHocSinhs(hocsinh) {
            this.hocsinhs.push(hocsinh);
            this.results[hocsinh.id] = "VETRE2";
            $("#myModal").modal("hide");
        },
        deleteHocsinh(hs) {
            this.hocsinhs = this.hocsinhs.filter(function (hocsinh) {
                return hocsinh.id != hs.id;
            })
        },
        saveVeTre() {
            if (this.name == "") {
                alert("Nhập tên giáo viên");
                return;
            }
            var code = `VT_${this.date.split("-").join("_")}`;
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    allDiemDanhs(where: {
                        code_contains: "${code}"
                    }){
                        id
                        type
                    }
                }
                `
            }).then(data => {
                console.log("PHIEUDIEMDANH:", data.data);
                if (data.data.allDiemDanhs.length > 0) {
                    var str = `[`;
                    data.data.allDiemDanhs.forEach(function (diemdanh, index) {
                        if (index != 0) {
                            str += ",";
                        }
                        str += `"${diemdanh.id}"`
                    });
                    str += ']';
                    client.mutate({
                        mutation: gql`
                        mutation {
                            deleteDiemDanhs(ids: ${str}){
                                id
                            }
                        }
                        `
                    }).then(data => {

                    }).catch(err => {
                        console.log(err);
                    })
                }
                that.createVeTre(code);
            }).catch(err => {
                console.log(err);
            });
        },
        createVeTre(code) {
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            var v1 = this.hocsinhs.filter(function (hocsinh) {
                return that.results[hocsinh.id] == "VETRE1";
            });
            var v2 = this.hocsinhs.filter(function (hocsinh) {
                return that.results[hocsinh.id] == "VETRE2";
            });
            if (v1.length > 0) {
                var vt1 = `[`;
                v1.forEach(function (hocsinh, index) {
                    if (index != 0) {
                        vt1 += ",";
                    }
                    vt1 += `{id: "${hocsinh.id}"}`
                });
                vt1 += `]`
                client.mutate({
                    mutation: gql`
                    mutation {
                        createDiemDanh(data: {
                            co: {
                            connect: ${vt1}
                            },
                            type: "VETRE1",
                            code: "${code}",
                            note: "${that.name}"
                        }) {
                            id
                        }
                    }
                        `
                }).then(data => {
                    console.log("VETRE1", data);
                }).catch(err => {
                    console.log(err);
                });
            }
            if (v2.length > 0) {
                var vt2 = `[`;
                v2.forEach(function (hocsinh, index) {
                    if (index != 0) {
                        vt2 += ",";
                    }
                    vt2 += `{id: "${hocsinh.id}"}`
                });
                vt2 += `]`
                client.mutate({
                    mutation: gql`
                mutation {
                    createDiemDanh(data: {
                        co: {
                        connect: ${vt2}
                        },
                        type: "VETRE2",
                        code: "${code}",
                        note: "${that.name}"
                    }) {
                        id
                    }
                }
                    `
                }).then(data => {
                    console.log("VETRE2", data);
                    that.$router.push(`/vetre/18g_detail?id=${data.data.createDiemDanh.id}`);
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    },
    computed: {

    },
    mounted() {

    }
}
</script>