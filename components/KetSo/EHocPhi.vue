<template>
    <td v-if="item">
        {{ getHocPhi(item.hocsinh.namhocphi) - getHocPhiGiam(item.hocsinh.hocphigiam) }}        
        <button @click="giamtien()">Giam</button>
    </td>
</template>
<script>
export default {
    props: ['idItem'],
    data() {
        return {
        }
    },
    methods: {
        getHocPhi(year){
            var ret = 0;
            this.hocphis.forEach(function(hp){
                if(hp.key == year){
                    ret = parseInt(hp.value);
                }
            });
            return ret;
        },
        getHocPhiGiam(hp){
            if(hp == null || hp == 'null'){
                return 0;
            } else {
                return parseInt(hp);
            }
        },
        giamtien(){
            this.$store.commit("ketso/updateItem", {
                id: this.idItem, 
                    
            })
        }
    },
    computed: {
        hocphis(){
            return this.$store.state.hocphi.hocphis;
        },
        item(){
            return this.$store.state.ketso.items[this.idItem];
        }
    },
    mounted(){

    }
}
</script>