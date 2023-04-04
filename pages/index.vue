<template>
<div class="row">
    <div class="col">
        <h2>{{ user.name }}</h2>
        <div class="row">
            <div class="col">
                <ul>
                    <li
                        v-for="role in user.roles"
                    >{{ role.name }}</li>
                </ul>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    layout: "app",
    watch: {

    },
    computed: {
        user(){
            return this.$store.state.user.user;
        }
    }
}
</script>