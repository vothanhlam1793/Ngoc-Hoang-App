<template>
    <td>{{ item.total }}</td>
</template>
<script>
export default {
    props: ['idItem'],
    computed: {
        item(){
            return this.$store.state.ketso.items[this.idItem];
        }
    }
}
</script>