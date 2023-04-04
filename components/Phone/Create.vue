<template>
    <div class="row">
        <div class="col-8">
            <div class="form-group">
                <label for="usr">Họ và tên {{parent}}:</label>
                <input type="text" class="form-control" :id="`name${parent}`">
            </div>
        </div>
        <div class="col-4">
            <div class="form-group">
                <label for="usr">Số điện thoại {{ parent }}:</label>
                <input type="text" class="form-control" :id="`usrPhone${parent}`">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    props: ['parent']
}
</script>