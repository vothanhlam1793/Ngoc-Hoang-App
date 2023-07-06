<template>
    <div class="row">
        <div class="col">
            <div class="row my-3">
                <div class="col text-right">
                    <a href="/diemdanhvetre"
                        class="btn btn-primary"
                    >
                        Tạo mới điểm danh
                    </a>
                </div>
            </div>  
            <div class="row">
                <div class="col">
                    <ViewVeTre />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ViewVeTre from '~/components/NgoaiGio/View.vue';
export default {
    components: {
        ViewVeTre
    },
    layout: "app"
}
</script>