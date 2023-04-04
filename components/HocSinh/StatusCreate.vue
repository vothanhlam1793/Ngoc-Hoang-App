<template>
    <div :class="getType()" v-if="content != ''">
        {{content}}
    </div>
</template>
<script>
    export default {
        props: ['type', 'content'],
        methods: {
            getType(){
                return 'alert alert-' + this.type;
            }
        }
    }
</script>