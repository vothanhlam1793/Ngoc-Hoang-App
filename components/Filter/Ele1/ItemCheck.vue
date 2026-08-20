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
            chose: false,
            syncing: false
        }
    },
    watch: {
        chose: function(nV, oV){
            this.$store.commit("filter/hocsinh/updateFilterEle1", {
                lophoc: this.lophoc,
                chose: this.chose
            })
            if (!this.syncing) {
                this.$store.dispatch("filter/hocsinh/applyFilters");
            }
        }, 
        monitor: function(){
            this.syncing = true;
            this.chose = this.lophoc.chose;
            this.$nextTick(() => {
                this.syncing = false;
            });
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
