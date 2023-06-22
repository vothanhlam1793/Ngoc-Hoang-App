<template>
    <div class="row">
        <div class="col">
            <HocSinhShow :hocsinh="hocsinh" />
        </div>
    </div>
</template>
<script>
import HSShow from '~/components/HocSinh/Show.vue';
export default {
    components: {
        HSShow
    },
    data(){
        return {

        }
    },
    props: ['hocsinh']
}
</script>