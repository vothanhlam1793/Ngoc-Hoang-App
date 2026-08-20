<template>
    <div class="row">
        <div class="col p-3">
            <FindByName />
            <Index :hocsinhs="filterHocsinhs"></Index>
        </div>
    </div>
</template>
<script>
import Index from '~/components/Filter/Table/Index.vue';
import FindByName from '~/components/Filter/Table/FindByName.vue';
export default {
    components: {
        Index,
        FindByName
    },
    computed: {
        filterHocsinhs() {
            return this.hocsinhs;
        }
    },
    props: ['hocsinhs']
}
</script>
