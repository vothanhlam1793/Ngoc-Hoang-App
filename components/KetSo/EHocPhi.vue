<template>
    <td class="text-right">
        <p v-if="item">{{ numberWithCommas(item.hocphi) }} <button class="" v-if="dadonghocphi" @click="alert('Học phí đã được thanh toán')">*</button></p>
        <p v-else>HP</p>
    </td>
</template>
<script>
import gql from 'graphql-tag'
export default {
    props: ['item'],
    data() {
        return {
            dadonghocphi: false,
            checkDone: false,
            checkHocPhi: false,
            logs: []
        }
    },
    methods: {
        alert: function(str){
            alert(str);
        },
        getNextMonth(m, y) {
            var month = parseInt(m);
            var year = parseInt(y);
            let nextMonth = month + 1;
            let nextYear = year;

            if (nextMonth > 12) {
                nextMonth = 1;
                nextYear++;
            }

            const formattedMonth = nextMonth.toString().padStart(2, '0');
            const formattedYear = nextYear.toString();

            return `${formattedMonth}_${formattedYear}`;
        },
        checkHocPhiDaThu() {
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    allLogs(where: {
                        item: "Student",
                        idItem: "${this.item.hocsinh.id}",
                        key: "HOC_PHI_THANG",
                        value: "${this.getNextMonth(this.$route.params.month, this.$route.params.year)}"
                    }) {
                        id item itemS idItem idItemS key value
                    }
                }
                `
            }).then(data => {
                if (data.data.allLogs.length > 0) {
                    that.dadonghocphi = true;
                    that.logs = data.data.allLogs;
                } else {
                    that.dadonghocphi = false;
                }
                this.checkDone = true;
                // console.log("CHECK", that.dadonghocphi, data);
            }).catch(err => {

            })
        },
        numberWithCommas(x) {
            if (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
                return 0;
            }
        },
        calculator() {
            var hp = 0;
            var that = this;
            // console.log(that.item)
            this.hocphis.forEach(function (e) {
                if (that.item.hocsinh.namhocphi == e.key) {
                    hp = e.value;
                }
            });
            var g = parseInt(that.item.hocsinh.hocphigiam);
            if (g >= 0) {

            } else {
                g = 0;
            }
            // console.log("CHECK2", this.dadonghocphi);
            if (this.dadonghocphi) {
                return 0;
            } else {
                return hp - g;
            }
        }
    },
    watch: {
        checkDone(n, o) {
            if (this.checkHocPhi) {
                this.$store.commit("pks/updateHocPhiItem", {
                    item: this.item,
                    hocphi: this.calculator(),
                })
                this.$forceUpdate();
            }
        },
        hocphis(n, o) {
            if (this.checkDone) {
                this.$store.commit("pks/updateHocPhiItem", {
                    item: this.item,
                    hocphi: this.calculator(),
                })
                this.$forceUpdate();
            } else {
                this.checkHocPhi = true;
            }
        }
    },
    computed: {
        hocphis() {
            return this.$store.state.hocphi.hocphis;
        }
    },
    created() {
        this.checkHocPhiDaThu();
        this.$store.dispatch("hocphi/getInfoHocPhi");
    }
}
</script>