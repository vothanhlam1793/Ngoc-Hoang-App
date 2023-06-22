<template>
    <div class="row">
        <div class="col-3">
            <Find
            
            />
        </div>
        <div class="col-9">
            <List 
                :phuhuynhs="phuhuynhs"
            />
        </div>
    </div>
</template>
<script>
import Find from '~/components/V2/PhuHuynh/Find/Index.vue';
import List from '~/components/V2/PhuHuynh/List/Index.vue';
export default {
    components: {
        Find,
        List
    },
    data(){
        return {
            
        }
    },
    computed: {
        phuhuynhs(){
            return this.$store.state.debt.phuhuynh.filterPhuHuynhs;
        }
    },
    created(){
        console.log("Hello World"); 
        this.$store.dispatch("debt/phuhuynh/getAllPhuHuynh");
    }
}
</script>