<template>
    <div class="row">
        <div class="col">
            <div class="row">
                <div class="col">
                    <h4>Tìm theo lớp</h4>
            <FilterEle1LopHoc></FilterEle1LopHoc>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <Status />
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
import Status from '~/components/Filter/Ele2/Status.vue';
export default {
    components: {
        Status
    },

}
</script>