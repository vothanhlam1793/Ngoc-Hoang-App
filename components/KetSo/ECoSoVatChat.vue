<template>
    <td>{{ 0 }}</td>
</template>
<script>
export default {
    props: ['idItem'],
    data(){
        return {

        }
    },
    computed: {
        item(){
            return this.$store.state.ketso.items[this.idItem];
        }
    }
}
</script>