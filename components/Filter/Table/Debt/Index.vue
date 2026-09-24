<template>
    <div class="row">
        <div class="col" v-if="hocsinh && hocsinh.parent && hocsinh.parent.id">
            <Table
                :idPhuHuynh="hocsinh.parent.id"
                :loadData="loadData"
            />
        </div>
        <div class="col text-center py-3 text-muted" v-else>
            Học sinh chưa được gán hồ sơ Phụ huynh.
        </div>
    </div>
</template>
<script>
import Table from '~/components/CongNo/TableV2.vue';
export default {
    components: {
        Table
    },
    props: ['hocsinh', 'loadData']
}
</script>
