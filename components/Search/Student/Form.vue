<template>
    <div class="">
        <SearchBox></SearchBox>
        <hr>
        <SearchStudentList :hocsinhs="fHocsinhs"></SearchStudentList>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    watch: {
        hocsinhs: function(nV, oV){
            this.$store.commit("search/updateHocSinh", nV);
        }
    },
    computed: {
        fHocsinhs: function(){
            return this.$store.state.search.fHocsinhs;
        },
        hocsinhs: function(){
            return this.$store.state.hd.hocsinhs;
        }
    },
    mounted(){
        this.$store.dispatch("hd/getHocSinhs");
    }
}
</script>