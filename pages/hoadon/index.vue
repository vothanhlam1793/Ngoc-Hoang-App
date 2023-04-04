<template>
    <div class="row">
        <div class="col-2">

        </div>
        <div class="col-10">
            <HoaDonCreate></HoaDonCreate>
        </div>
    </div>
</template>
<script>
    export default {
        layout: "app",
        mounted(){
            this.$store.dispatch("sanpham/getSanPham");
        }
    }
</script>