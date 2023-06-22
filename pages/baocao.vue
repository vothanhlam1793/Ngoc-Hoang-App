<template>
    <div class="row">
        <div class="col">
            <h3>Báo cáo số liệu</h3>
            <FormBaoCao />
        </div>
    </div>
</template>
<script>
import FormBaoCao from '~/components/BaoCao/V1/Form.vue';
export default {
    components: {
        FormBaoCao
    },
    layout: "app"
}
</script>