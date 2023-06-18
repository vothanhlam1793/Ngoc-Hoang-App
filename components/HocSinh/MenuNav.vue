<template>
    <div class="row">
        <div class="col">
            <div class="row">
                <div class="col">
                    <div class="d-flex justify-content-between mb-3">
                        <div class="p-2"><a href="/hocsinh/quanly" class="btn btn-secondary">Trở về</a></div>
                    </div>
                </div>
            </div>
            <div class="list-group">
                <a class="list-group-item list-group-item-action"
                    :href="`/hocsinh/${hocsinh.id}`"
                >
                    Chi tiết
                </a>
                <a class="list-group-item list-group-item-action"
                    :href="`/hocsinh/congno/${hocsinh.id}`"
                >
                    Công nợ
                </a>
            </div> 
        </div>
    </div>
</template>
<script>
export default {
    props: ['hocsinh']
}
</script>