<template>
    <td>
        {{ numberWithCommas(item.thanhtiennghi) }}
    </td>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    methods: {
        numberWithCommas(x) {
            if(x){
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
                return 0;
            }
        },
    },
    watch: {
        item: {
            deep: true,
            handler(){
                this.$forceUpdate();
            }
        }
    },
    computed: {

    },
    props: ['item']
}
</script>