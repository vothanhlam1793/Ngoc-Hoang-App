<template>
    <div>
        <h1>Hello {{name}}</h1>
        <ComA></ComA>
    </div>
</template>

<script>

export default {
    async asyncData ({params, query, store}) {
        console.log(store);
        return {
            name: "Vo Thanh Lam"
        }
    },
    computed: {
        todos () {
            return this.$store.state.todos.lists;
        }
    }
}
</script>
