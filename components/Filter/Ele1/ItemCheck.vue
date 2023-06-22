<template>
    <div class="form-check">
        <label class="form-check-label">
            <input 
                type="checkbox" 
                class="form-check-input" 
                v-model="chose"
            >{{ lophoc.name }} - ( {{ lophoc.hocsinhs.length }} )
        </label>
    </div>
</template>
<script>
/*
    PROPS   : lophoc
    COMMIT  :   

*/
export default {
    data: () => {
        return {
            chose: false
        }
    },
    watch: {
        chose: function(nV, oV){
            this.$store.commit("filter/hocsinh/updateFilterEle1", {
                lophoc: this.lophoc,
                chose: this.chose
            })
        }, 
        monitor: function(){
            this.chose = this.lophoc.chose;
            this.$forceUpdate();
        }
    },
    computed: {
        monitor(){
            return this.$store.state.filter.hocsinh.monitor;
        }
    },
    mounted(){
        if(this.lophoc.chose){
            this.chose = this.lophoc.chose;
        } else { 
            this.chose = false;
        }
    },
    props: ['lophoc']
}
</script>