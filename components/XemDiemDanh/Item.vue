<template>
    <tr>
        <td class="p-1 sticky sticky-col">{{ hocsinh.name }}</td>
        <td v-for="r, i in result" :key="i" :class="getColorDiHoc(r)">{{ getValueDiHoc(r) }}</td>
    </tr>
</template>
<script>
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
export default {
    props: ['hocsinh', 'type', 'month', 'year', 'lichhoc', 'stateLichHoc'],
    data() {
        return {
            diemdanhs: [],
            stateDiemDanh: "NONE",
            result: [],
            stateResult: false
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
        }
    },
    created(){
        if(typeof window !== undefined){
            this.getPhieuDiemDanh();
            // this.getLichHoc();
        }
    },
    methods: {
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
            var dates = [];
            for (var j = 0; j < this.lichhoc.length; j++) {
                if (this.lichhoc[j].state == "CO") {
                    // Ket qua la 2 hoac 3
                    let code = `${this.year}_${this.month}_${this.lichhoc[j].date.toString().padStart(2, '0')}`;
                    let temp = false;
                    let index = this.diemdanhs.findIndex(function (item) {
                        // return item.
                        return item.code == code;
                    });
                    if (index != -1) {
                        // Có đi học
                        dates.push("3");
                    } else {
                        // Nghi hoc
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
                            id: "${this.hocsinh.id}"
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
                that.diemdanhs = data.data.allDiemDanhs;
                that.stateDiemDanh = "DONE";
            }).catch(err => {
                console.log(err);
            })
        },
    },

}
</script>