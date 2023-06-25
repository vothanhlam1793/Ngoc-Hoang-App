<template>
    <div class="row">
        <div class="col-4">

        </div>
        <div class="col-8">
            <table class="table">
                <tbody>
                    <tr>
                        <td class="text-right">Tiền phải thu: </td>
                        <td class="text-right"><b>{{ numberWithCommas(total) }}</b></td>
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
    },
    methods: {
        numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
    },
    computed: {
        total() {
            return this.$store.state.hd.total;
        },
    }
}
</script>