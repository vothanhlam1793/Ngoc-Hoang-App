<template>
    <div class="row">
        <div class="col-3">
            <FilterElement></FilterElement>
        </div>
        <div class="col-9">
            <HocSinhCreateModal></HocSinhCreateModal>
            <FilterResult
                :hocsinhs="hocsinhs"
            />
        </div>
    </div>
</template>
<script>
export default {
    computed: {
        hocsinhs(){
            return this.$store.state.filter.hocsinh.filterHocsinhs;
        }
    },
    mounted(){
        this.$store.dispatch("filter/hocsinh/getAllHocsinhs");
    }
}
</script>