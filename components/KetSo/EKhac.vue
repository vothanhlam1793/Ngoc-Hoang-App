<template>
    <td>
        <input
        class="form-control"
        min="0"
        v-model="total"
        @change="updateTotal()"
        >
    </td>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data(){
        return {
            total: 0
        }
    },
    methods: {
        updateTotal(){
            this.$store.commit("pks/updateKhac",{
                item: this.item,
                total: this.total
            })
        }
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
    created(){

    },
    computed: {

    }
}
</script>