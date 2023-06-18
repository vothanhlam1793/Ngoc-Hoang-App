<template>
    <td>
        <input
        class="form-control"
        v-model="note"
        @change="updateNote()"
        >
    </td>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data(){
        return {
            note: ""
        }
    },
    methods: {
        updateNote(){
            this.$store.commit("pks/updateDienGiai",{
                item: this.item,
                note: this.note
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