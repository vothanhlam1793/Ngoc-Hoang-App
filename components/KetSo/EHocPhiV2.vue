<template>
    <div>
        {{ numberWithCommas(hocphi)  }}
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    props: ['hocsinh'],
    data() {
        return {
            dadonghocphi: false,
            checkDone: false,
            checkHocPhi: false,
            logs: [],
            hocphi: 0
        }
    },
    methods: {
        alert: function(str){
            alert(str);
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
                if (that.hocsinh.namhocphi == e.key) {
                    hp = e.value;
                }
            });
            var g = parseInt(that.hocsinh.hocphigiam);
            if (g >= 0) {

            } else {
                g = 0;
            }
            this.hocphi = hp-g;
            this.$emit("update-data", this.hocphi);
            console.log("HJP:", this.hocphi);    
            return hp-g;
        }
    },
    watch: {
        checkDone(n, o) {
            if (this.checkHocPhi) {
                this.$emit("update-data", this.calculator());
                this.$forceUpdate();
            }
        },
        hocphis(n, o) {
            this.$emit("update-data", this.calculator());
        }
    },
    computed: {
        hocphis() {
            return this.$store.state.hocphi.hocphis;
        }
    },
    created() {
        // this.checkHocPhiDaThu();
        if(this.$store.state.hocphi.hocphis.length > 0){
            this.calculator();
        } else {
            this.$store.dispatch("hocphi/getInfoHocPhi");
        }
    }
}
</script>