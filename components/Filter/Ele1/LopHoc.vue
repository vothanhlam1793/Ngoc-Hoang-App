<template>
    <div class="row">
        <div class="col">
            <div class="form-check">
                <label class="form-check-label">
                    <input 
                        type="checkbox" 
                        class="form-check-input"
                        v-model="choseAll"
                        @change="changed()"
                    >Tất cả
                </label>
            </div>
            <FilterEle1ItemCheck     
                v-for="lophoc in lophocs"
                :lophoc="lophoc"
                :key="lophoc.id"

                />
        </div>
    </div>
</template>
<script>
export default {
    data: ()=>{
        return {
            choseAll: true
        }
    },
    methods:{
        changed(){
            this.$store.commit("filter/hocsinh/updateFilterEle1All", this.choseAll);
        }
    },
    watch: {
        choseAllState: function(nV, oV){
            this.choseAll = nV;
        },
        lophocs: function(){
            if(this.lophocs.length > 0){
                this.$store.commit("filter/hocsinh/updateFilterEle1All", true);
            }
        }

    },
    computed: {
        lophocs(){
            return this.$store.state.filter.hocsinh.lophocs;
        },
        choseAllState(){
            return this.$store.state.filter.hocsinh.choseAll;
        }
    },
    mounted(){
        this.$store.dispatch("filter/hocsinh/getAllLopHoc");
    }
}
</script>