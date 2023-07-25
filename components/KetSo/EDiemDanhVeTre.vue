<template>
    <td class="text-right">
        {{ numberWithCommas(total) }}
    </td>
</template>
<script>
import moment from 'moment';
import gql from 'graphql-tag'
export default {
    props: ['item', 'month', 'year'],
    data() {
        return {
            type: "VETRE",
            diemdanhs: [],
            total: 0,
            priceVeTre: 0,
            priceVeTre2: 0,
            startDate: "",
            endDate: "",
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
        calculatorVeTre() {
            var that = this;
            var d1 = 0;
            var d2 = 0;
            that.diemdanhs.forEach(function(diemdanh){
                if(diemdanh.type == "VETRE"){
                    d1 += 1;
                } else if (diemdanh.type == "VETRE2") {
                    d2 += 1;
                }
            });
            that.total = d1 * that.priceVeTre + d2 * that.priceVeTre2;
            // console.log(this.item.hocsinh.name,": ", this.diemdanhs, this.priceVeTre, this.priceVeTre2);
            that.$store.commit("pks/updateVeTre", {
                item: that.item,
                total: that.total,
            })
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
                            id: "${this.item.hocsinh.id}"
                        }
                        },
                        {
                                date_gte: "${this.startDate}",
                                date_lte: "${this.endDate}"
                        }
                        ]
                    }){
                        id
                        code
                        type
                    }
                }
                `
            }).then(data => {
                that.diemdanhs = data.data.allDiemDanhs;
                that.calculatorVeTre();
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
                that.priceVeTre = 0;
                that.priceVeTre2 = 0;
                data.data.allVariables.forEach(function (item) {
                    if (item.key == "PRICE_VE_TRE") {
                        that.priceVeTre = parseInt(item.value) | 0;
                    } else if (item.key == "PRICE_VE_TRE_2") {
                        that.priceVeTre2 = parseInt(item.value) | 0;
                    }
                });
                that.calculatorVeTre();
            }).catch(err => {
                console.log(err);
            });
        }
    },
    created() {
        this.startDate = moment(`${this.year}-${this.month}`).toISOString();
        this.endDate = moment(`${this.year}-${this.month}`).endOf('month').toISOString();
        this.getPhieuDiemDanh();
        this.getVeTre();
    }
}
</script>