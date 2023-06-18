<template>
    <td>{{ numberWithCommas(item.total) }}</td>
</template>
<script>
export default {
    data(){
        return {
            state: "IDLE"
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
            immediate: true,
            handler(n, o){
                // console.log(n);
            }
    }
    },
    props: ['item'],
    computed: {

    },
    created(){
        console.log(this.item);
    }
}
</script>