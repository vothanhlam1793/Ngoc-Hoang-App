<template>
    <div class="row">
        <div class="col-6">
            <p>{{ phuhuynh.name }}</p>
        </div>
        <div class="col-6">
            <p>{{ phuhuynh.hocsinhs.length }}</p>
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
    props: ['phuhuynh']
}
</script>