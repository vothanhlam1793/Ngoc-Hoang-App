<template>
    <div class="row">
        <div class="col">
            <table class="table">
                <tbody>
                    <tr>
                        <td style="width: 50%;">Phụ huynh trả: </td>
                        <td style="width: 50%;"><input 
                            style="text-align: right;"
                            class="form-control"
                        /></td>
                    </tr>
                    <tr style="width: 40%;">
                        <td style="width: 50%;">Ghi vào công nợ: </td>
                        <td style="width: 50%;" class="text-right"><b>{{ 100000 }}</b></td>
</tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import Index from '~/components/Filter/Table/Index.vue';
export default {
    components: {
        Index
    },
    data(){
        return {

        }
    }
}
</script>