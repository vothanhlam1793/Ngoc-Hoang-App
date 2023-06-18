<template>
    <td><div>
            <select
                class="form-control"
                v-model="csvc"
            >
                <option
                :value="0"
                >0</option>
                <option
                :value="half"
                >{{ numberWithCommas(half) }}</option>
                <option
                :value="full"
                >{{ numberWithCommas(full) }}</option>
            </select>
        </div></td> <!-- CSVC => Tạo mới hàng loạt-->
</template>
<script>
export default {
    props: ['item'],
    data(){
        return {
            csvc: 0
        }
    },
    methods: {
        numberWithCommas(x) {
            if(x){
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
                return 0;
            }
        },
    },
    watch: {
        csvc: function(n, o){
            this.$store.commit('pks/updateCSVC', {
                item: this.item,
                csvc: this.csvc
            })
        },
        stateCSVC: {
            immediate: true,
            handler(n,o){
                switch(n){
                    case "FULL": {
                        this.csvc = this.full;
                    } break;
                    case "HALF": {
                        this.csvc = this.half;
                    } break;
                    default: {
                        this.csvc = 0;
                    }
                }
            }
        }
    },
    computed: {
        half() {
            return this.$store.state.pks.half;
        },
        full() {
            return this.$store.state.pks.full;
        },
        stateCSVC(){
            return this.$store.state.ketso.stateCSVC;
        }
    },
    created(){
        this.$store.dispatch("pks/getCSVC");
    }
}
</script>