<template>
    <div class="row">
        <div class="col">
            <List 
                :hocsinhs="pageHocsinhs"
            />
            <!-- <Pagn /> -->
        </div>
    </div>
</template>
<script>
import List from '~/components/Filter/Table/List.vue';
import Pagn from '~/components/Filter/Table/Pagn.vue';
export default {
    components: {
        List,
        Pagn
    },
    methods: {
        
    },
    watch: {
        hocsinhs: function(nV, oV){
            this.$store.commit("filter/result/updateHocsinhs", this.hocsinhs);      
        }
    },
    computed: {
        pageHocsinhs(){
            return this.$store.state.filter.result.pageHocsinhs;
        }
    },
    mounted(){
        this.$store.commit("filter/result/updateHocsinhs", this.hocsinhs);
    },
    props: ['hocsinhs']
}
</script>