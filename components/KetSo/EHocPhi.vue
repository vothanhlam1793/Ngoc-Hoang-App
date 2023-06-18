<template>
    <td
        class="text-right"
    >
        <p v-if="item">{{ numberWithCommas(item.hocphi) }}</p>
        <p v-else>HP</p>
    </td>

</template>
<script>
export default {
    props: ['item'],
    data() {
        return {
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
        calculator(){
            var hp = 0;
            var that = this;
            // console.log(that.item)
            this.hocphis.forEach(function(e){
                if(that.item.hocsinh.namhocphi == e.key){
                    hp = e.value;
                }
            });
            var g=parseInt(that.item.hocsinh.hocphigiam);
            if( g >= 0){
                 
            } else {
                g = 0;
            }

            return hp - g;
        }
    },
    watch: {
        hocphis(n, o){
            // console.log(this.item, n);
            // console.log(this.calculator(), this.item);
            this.$store.commit("pks/updateHocPhiItem", {
                item: this.item,
                hocphi: this.calculator(),
            })
            this.$forceUpdate();
        }
    },
    computed: {
        hocphis(){
            return this.$store.state.hocphi.hocphis;
        }
    },
    created(){
        this.$store.dispatch("hocphi/getInfoHocPhi");
    }
}
</script>