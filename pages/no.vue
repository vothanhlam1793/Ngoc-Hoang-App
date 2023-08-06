<template>
    <div>
        <h3 class="mt-2">Phụ huynh</h3>
        <FormPhuHuynh />
    </div>
</template>
<script>
import FormPhuHuynh from '~/components/PhuHuynh/Form.vue'
export default {
    components: {
        FormPhuHuynh
    },
    layout: "app"
}
</script>