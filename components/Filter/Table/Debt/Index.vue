<template>
    <div class="row">
        <div class="col">
            <Table
                :idPhuHuynh="hocsinh.parent.id"
            />
        </div>
    </div>
</template>
<script>
import Table from '~/components/CongNo/TableV2.vue';
export default {
    components: {
        Table
    },
    data(){
        return {

        }
    },
    props: ['hocsinh']
}
</script>