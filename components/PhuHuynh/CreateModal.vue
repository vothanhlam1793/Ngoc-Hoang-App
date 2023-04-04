<template>
<div class="mx-1">
    <button type="button" class="btn btn-success" data-toggle="modal" data-target="#create-phuhuynh-modal">Tạo mới</button>
    <!-- The Modal -->
    <div class="modal" id="create-phuhuynh-modal">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
        
                <!-- Modal Header -->
                <div class="modal-header">
                <h4 class="modal-title">Tạo phụ huynh mới</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                
                <!-- Modal body -->
                <div class="modal-body">
                    <PhuHuynhCreate />
                </div>
                
                <!-- Modal footer -->
                <div class="modal-footer">
                    <p>Mầm non Ngọc Hoàng</p>
                </div>
            
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    data(){
        return {


        }
    }
}
</script>