<template>
    <div class="row">
        <div class="col">

        </div>
    </div>
</template>
<script>
import VeTreForm from '~/components/NgoaiGio/Form.vue';
export default {
    components: {
        VeTreForm
    },
    created(){
        if(typeof window !== undefined){
            console.log(this.$route.params);
        }  
    },
    layout: "app",
}
</script>