<template>
    <div>
        {{ numberWithCommas(total) }}
    </div>
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
    props: ['hocsinh', 'month', 'year'],
    data() {
        return {
            type: "VETRE",
            diemdanhs: [],
            total: 0,
            priceVeTre: 0,
            priceVeTre2: 0
        }
    },
    methods: {
        numberWithCommas(x) {
            if (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
                return 0;
            }
        },
        getPhieuDiemDanh() {
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`query {
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
                    }
                }`
            }).then(data => {
                that.diemdanhs = data.data.allDiemDanhs;
                that.total = 0;
                that.diemdanhs.forEach(function (diemdanh) {
                    if (diemdanh.type == "VETRE") {
                        that.total += parseInt(that.priceVeTre);
                    }
                    if (diemdanh.type == "VETRE2") {
                        that.total += parseInt(that.priceVeTre2);
                    }
                })
                // that.total = that.diemdanhs.length * that.priceVeTre;
                that.$store.commit("pks/updateAnChieu", {
                    item: that.item,
                    total: that.total,
                })
                // that.$emit("update-data", that.total);
            }).catch(err => {
                console.log(err);
            })
        },
        getVeTre() {
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    allVariables(where: {
                        key_contains: "PRICE_VE_TRE"
                    }){
                        id
                        key
                        value
                    }
                }
                `
            }).then(data => {
                if (data.data.allVariables.length > 0) {
                    data.data.allVariables.forEach(function (variable) {
                        if (variable.key == 'PRICE_VE_TRE') {
                            that.priceVeTre = variable.value;
                        }
                        if (variable.key == 'PRICE_VE_TRE_2') {
                            that.priceVeTre2 = variable.value;
                        }

                    });
                    that.total = 0;
                    that.diemdanhs.forEach(function (diemdanh) {
                        if (diemdanh.type == "VETRE") {
                            that.total += parseInt(that.priceVeTre);
                        }
                        if (diemdanh.type == "VETRE2") {
                            that.total += parseInt(that.priceVeTre2);
                        }
                    })
                    // that.total = that.diemdanhs.length * that.priceVeTre;
                    // that.$emit("update-data", that.total);
                    that.$store.commit("pks/updateAnChieu", {
                        item: that.item,
                        total: that.total,
                    })
                } else {
                    that.priceVeTre = 0;
                }
            }).catch(err => {
                console.log(err);
            });
        }
    },
    created() {
        this.getPhieuDiemDanh();
        this.getVeTre();
    }
}
</script>