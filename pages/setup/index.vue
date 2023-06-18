<template>
    <div class="row">
        <div class="col">
            <h1>Trang cài đặt</h1>
            <div class="row">
                <div class="col-4">
                    <HocPhiYear></HocPhiYear>
                </div>
                <div class="col-4">
                    <CoSoVatChat />
                </div>
                <div class="col-4">
                    <VeTre></VeTre>
                    <br>
                    <AnChieu></AnChieu>
                    <br>
                    <NghiLienTiep></NghiLienTiep>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        layout: "app"
    }
</script>