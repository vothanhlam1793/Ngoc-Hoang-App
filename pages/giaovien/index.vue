<template>
    <div class="row">
        <div class="col">
            <div class="row my-3">
                <div class="col text-right">
                    <!-- Button to Open the Modal -->
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
                        Thêm giáo viên
                    </button>

                    <!-- The Modal -->
                    <div class="modal" id="myModal">
                    <div class="modal-dialog  modal-xl">
                        <div class="modal-content">

                        <!-- Modal Header -->
                        <div class="modal-header">
                            <h4 class="modal-title">Thêm giáo viên mới</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>

                        <!-- Modal body -->
                        <div class="modal-body">
                            <GiaoVienCreate></GiaoVienCreate>
                        </div>

                        <!-- Modal footer -->
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Đóng</button>
                        </div>

                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <GiaoVienList></GiaoVienList>
                </div>
            </div>
        </div>
    </div>
    </template>
    <script>
    export default {
        data() {
            return {
    
            }
        },
        layout: "app",
        watch: {
    
        },
        computed: {
    
        }
    }
    </script>