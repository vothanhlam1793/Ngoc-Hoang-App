<template>
    <div class="row">
        <div class="col">
            <h4>Cài đặt lịch học - Tháng {{ month }}/{{ year }}</h4>
            <p v-if="status == 'LOAD'">
                Đây là lịch học đã được lưu sẵn - <button @click="deleteLichHoc()" class="btn btn-danger">Tạo lịch
                    mới</button>
            </p>
            <div class="text-right my-2">
                <button class="btn btn-warning" v-if="(state == 'EDIT') || (status == 'NEW')" @click="saveData()">
                    Lưu lại
                </button>
            </div>
            <div>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Tình trạng</th>
                            <th>Thứ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in lichhoc" :key="item.date" :class="getColor(item)">
                            <td>{{ item.date }}</td>
                            <td class="text-center">
                                <div class="">
                                    <div class="form-check-inline">
                                        <label class="form-check-label">
                                            <input type="radio" class="form-check-input" :name="'optradio' + item.date"
                                                value="CO" v-model="item.state" @change="change">Bình thường
                                        </label>
                                    </div>
                                    <div class="form-check-inline">
                                        <label class="form-check-label">
                                            <input type="radio" class="form-check-input" :name="'optradio' + item.date"
                                                value="KHONG" v-model="item.state" @change="change">Nghỉ học
                                        </label>
                                    </div>
                                </div>
                            </td>
                            <td>
                                {{ getThu(item.date) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    props: ['month', 'year'],
    data() {
        return {
            lichhoc: [],
            status: "NONE",
            state: "NORMAL",
            variable: {}
        }
    },
    watch: {
        dateForm: {
            deep: false,
            immediate: false,
            handler(n, o) {
                if (this.status == "LOAD") {
                    return;
                } else {
                    this.status = "NEW";
                }
                var that = this;
                n.forEach(function (date) {
                    let index = that.lichhoc.findIndex(function (item) {
                        return item.date == date;
                    })
                    if (index == -1) {
                        that.lichhoc.push({
                            date: date,
                            state: "CO"
                        })
                    }
                });
                this.$forceUpdate();
            }
        }
    },
    computed: {
        dateForm() {
            return this.$store.state.diemdanh.dateForm;
        }
    },
    methods: {
        getColor(item) {
            if (item.state == 'KHONG') {
                return "table-secondary";
            }
        },
        getThu(d) {
            var t = (new Date(`${this.year}-${this.month}-${d}`)).getDay();
            switch (t) {
                case 0: return "Chủ nhật";
                case 1: return "Thứ 2";
                case 2: return "Thứ 3";
                case 3: return "Thứ 4";
                case 4: return "Thứ 5";
                case 5: return "Thứ 6";
                case 6: return "Thứ 7";
            }
        },
        deleteLichHoc() {
            let client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`
                    mutation {
                        deleteVariable(id: "${this.variable.id}"){
                            id
                        }
                    }
                    `
            }).then(data => {
                location.reload();
            }).catch(err => {
                console.log(err);
            })
        },
        change() {
            this.state = "EDIT";
        },
        saveData() {
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            if (this.variable.id) {
                // Update
                client.mutate({
                    mutation: gql`
                            mutation {
                            updateVariable (id: "${this.variable.id}", data: {
                                value: "${JSON.stringify(this.lichhoc).split('"').join('\\"')}"
                            }){
                                id
                                key
                                value
                            }
                        }
                        `
                }).then(data => {
                    that.state = "NORMAL";
                    that.getLichHoc();
                    location.reload();
                }).catch(err => {
                    console.log(err);
                });
            } else {
                // Create
                client.mutate({
                    mutation: gql`
                        mutation {
                            createVariable(data: {
                                key: "LICH_HOC_${this.year}_${this.month}",
                                value: "${JSON.stringify(this.lichhoc).split('"').join('\\"')}"
                            }){
                                id
                                key
                                value
                            }
                        }
                        `
                }).then(data => {
                    // console.log(data);
                    that.state = "NORMAL";
                    that.getLichHoc();
                    location.reload();
                })
            }

        },
        getLichHoc() {
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                    query {
                        allVariables(where: {
                            key: "LICH_HOC_${this.year}_${this.month}"
                        }){
                            id
                            key
                            value
                        }
                    }
                    `
            }).then(data => {
                console.log(data);
                if (data.data.allVariables.length > 0) {
                    that.variable = data.data.allVariables[0];
                    that.lichhoc = JSON.parse(that.variable.value)
                    that.status = "LOAD";
                } else {
                    that.lichhoc = [];
                }
                that.$store.commit("diemdanh/updateDateForm", {
                    year: this.year,
                    month: this.month
                });
            }).catch(err => {
                console.log(err);
            });
        }
    },
    created() {

        this.getLichHoc();
    },
}
</script>