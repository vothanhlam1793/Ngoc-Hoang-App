<template>
    <div class="row">
        <div class="col">
            <List/>
        </div>
    </div>
</template>
<script>
import List from '~/components/KetSo/List.vue';
export default {
    components: {
        List
    },
    data(){
        return {
            id: ""
        }
    },
    created(){

    },
    layout: "app"
}
</script>