<template>
    <div class="table-bordered">
        <table
            class=""
            v-if="stateResult"
        >
            <thead>
                <tr>
                    <th>Tên</th>
                    <th
                        v-for="r, i in result"
                        :key="i"
                        class="p-1"
                    >{{ r.date }}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Lịch học</td>
                    <td
                        v-for="r, i in result"
                        :key="i"
                        :class="getColorLichHoc(r)"
                    ></td>
                </tr>
                <tr>
                    <td class="p-1">{{ hocsinh.hocsinh.name }}</td>
                    <td
                        v-for="r, i in result"
                        :key="i"
                        :class="getColorDiHoc(r)"
                    >{{ getValueDiHoc(r) }}</td>
                </tr>
            </tbody>
            <tbody>

            </tbody>
        </table>
    </div>
</template>
<script>
import moment from 'moment';
function getMonthRange(month, year) {
    // Tạo đối tượng Date cho ngày đầu tiên của tháng
    var startDate = new Date(Date.UTC(year, month - 1, 1));
    startDate.setUTCHours(0, 0, 0, 0); // Đặt giờ, phút, giây, mili-giây cho 00:00:00.000 UTC

    // Tạo đối tượng Date cho ngày cuối cùng của tháng
    var endDate = new Date(Date.UTC(year, month, 0));
    endDate.setUTCHours(23, 59, 59, 999); // Đặt giờ, phút, giây, mili-giây cho 23:59:59.999 UTC

    // Chuyển đổi thành chuỗi ISO 8601
    var startDateISO = startDate.toISOString();
    var endDateISO = endDate.toISOString();

    // Tạo đối tượng chứa kết quả
    var result = {
        date_gte: startDateISO,
        date_lte: endDateISO
    };

    return result;
}
import gql from 'graphql-tag'
import { getVariableByKey, createVariable, updateVariable } from '~/plugins/variable.js'
export default {
    props: ['hocsinh', 'type', 'month', 'year'],
    data() {
        return {
            diemdanhs: [],
            lichhoc: [],
            stateLichHoc: "NONE",
            stateDiemDanh: "NONE",
            result: [],
            stateResult: false,
            accessDate: {}
        }
    },
    created() {
        if (typeof window !== undefined) {
            this.getPhieuDiemDanh();
            this.getLichHoc();
        }
    },
    watch: {
        stateDiemDanh: function (n, o) {
            if (n == "DONE" && this.stateLichHoc == "DONE") {
                this.calculate();
            }
        },
        stateLichHoc: function (n, o) {
            if (n == "DONE" && this.stateDiemDanh == "DONE") {
                this.calculate();
            }
        },
        year: function (n, o) {
            this.reloadPage();
        },
        month: function (n, o) {
            this.reloadPage();
        }
    },
    methods: {
        reloadPage() {
            this.diemdanhs = [];
            this.lichhoc = [];
            this.stateLichHoc = "NONE";
            this.stateDiemDanh = "NONE";
            this.result = [];
            this.stateResult = false;
            this.getPhieuDiemDanh();
            this.getLichHoc();
        },
        getColorDiHoc(r) {
            if (r.result == "2") {
                return "table-danger"
            }
            if (r.result == "3") {
                return "table-success"
            }
            return "table-secondary";
        },
        getValueDiHoc(r) {
            if (r.result == "2") {
                return "K"
            }
            if (r.result == "3") {
                return "C"
            }
        },
        getColorLichHoc(r) {
            if (r.state == "CO") {
                return ""
            } else {
                return "table-secondary"
            }
        },
        calculate() {
            var that = this;
            var dates = [];
            // console.log(this.lichhoc);
            for (var j = 0; j < this.lichhoc.length; j++) {
                if (this.lichhoc[j].state == "CO") {
                    // Ket qua la 2 hoac 3
                    if (this.accessDate.id) {
                        // console.log(this.accessDate.value);
                        let d1 = moment(`${this.year}-${this.month}-${this.lichhoc[j].date.toString().padStart(2, '0')}`);
                        let d2 = moment(this.accessDate.value);
                        // console.log(d1.unix(), d1, d2.unix(), d2);
                        if (d1.unix() < d2.unix()) {
                            dates.push("0");
                            continue;
                        }
                    }
                    let code = `${this.year}_${this.month}_${this.lichhoc[j].date.toString().padStart(2, '0')}`;
                    let index = this.diemdanhs.findIndex(function (item) {
                        // return item
                        // if(that.accessDate.id){
                        //     let d1 = moment(that.accessDate.value);
                        //     let d2 = moment(item.date);
                        //     if(date )
                        //     console.log(that.accessDate.value, that.hocsinh.hocsinh.name);
                        //     console.log(item);
                        // } else {
                        //     return item.code == code;
                        // }
                        return item.code == code;
                    });

                    if (index != -1) {
                        // Có đi học
                        dates.push("3");
                    } else {
                        dates.push("2");
                    }
                } else {
                    // Ket qua bang 0
                    dates.push("0");
                }
                this.result[this.lichhoc[j].date] = {
                    state: this.lichhoc[j].state,
                    result: dates[j],
                    date: this.lichhoc[j].date
                }
            }
            for (var j = 0; j < this.lichhoc.length; j++) {
                if (this.result[j] == undefined) {
                    this.result[j] = {
                        state: "KHONG",
                        result: "2"
                    }
                }
            }
            // console.log(this.result);
            this.result = this.result.filter(function (e) {
                return e.date;
            });
            this.result.sort(function (a, b) {
                return parseInt(a.date) - parseInt(b.date);
            });
            this.$emit("update-data", this.result);
            // console.log(this.hocsinh.hocsinh.name, this.result);
            this.stateResult = true;
        },
        getPhieuDiemDanh() {
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    allDiemDanhs(where: {
                        AND: [{
                            type_contains: "${this.type}"
                        }, {
                        co_some: {
                            id: "${this.hocsinh.hocsinh.id}"
                        }
                        }, 
                        
                            {
                                date_gte: "${getMonthRange(this.month, this.year).date_gte}",
                                date_lte: "${getMonthRange(this.month, this.year).date_lte}"
                            }
                    ]
                    }){
                        id
                        code
                        type
                        date
                    }
                }
                `
            }).then(data => {
                // console.log(data.data.allDiemDanhs);
                // console.log(that.hocsinh.name, {
                //     item: "Student",
                //     idItem: that.hocsinh.id,
                //     key: "DATE-ACCESS"
                // })
                getVariableByKey(client, {
                    item: "Student",
                    idItem: that.hocsinh.hocsinh.id,
                    key: "DATE-ACCESS"
                }).then(variable => {
                    // console.log(variable);
                    that.accessDate = variable;
                    that.diemdanhs = data.data.allDiemDanhs;
                    that.stateDiemDanh = "DONE";
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                console.log(err);
            })
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
                if (data.data.allVariables.length > 0) {
                    that.variable = data.data.allVariables[0];
                    that.lichhoc = JSON.parse(that.variable.value)
                    that.stateLichHoc = "DONE";
                } else {
                    location.href = "/lichhoc?year=" + that.year + "&month=" + that.month;
                }
            }).catch(err => {
                console.log(err);
            });
        },
    }
}
</script>