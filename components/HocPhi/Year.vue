<template>
    <div class="row">
        <div class="col">
            <h4>Học phí các năm</h4>
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Năm</th>
                        <th>Học phí</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                        v-for="index in 10"
                    >
                        <td>{{ year - 8 + index }}</td>
                        <td>{{ numberWithCommas(getHocPhi(year - 8 + index)) }}</td>
                        <td>
                            <div v-if=" getHocPhi(year - 8 + index) == 0">
                                <button @click="createHocPhi(year - 8 + index, 0,'CREATE')"
                                class="btn btn-primary"
                                >Tạo mới</button>
                            </div>
                            <div v-else>
                                <button
                                class="btn btn-warning"
                                @click="createHocPhi(year - 8 + index, getHocPhi(year - 8 + index),'CREATE')"
                                >Sửa</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="modal" id="editHocPhi">
                <div class="modal-dialog">
                    <div class="modal-content">

                    <!-- Modal Header -->
                    <div class="modal-header">
                        <h4 class="modal-title">Học phí năm {{ editYear }}</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>

                    <!-- Modal body -->
                    <div class="modal-body">
                        <div class="row">
                            <div class="col">
                                <div class="form-group">
                                    <label for="usr">Học phí:</label>
                                    <input type="text" class="form-control" id="usr"
                                        v-model="hocphi"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal footer -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success"
                            @click="saveHocPhi()"
                        >Lưu lại</button>
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Đóng</button>
                    </div>

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
                year: (new Date()).getFullYear(),
                state: "IDLE",
                editYear: 2020,
                hocphi: 0
            }
        },
        methods: {
            numberWithCommas(x) {
                x = x.toString();
                var pattern = /(-?\d+)(\d{3})/;
                while (pattern.test(x))
                    x = x.replace(pattern, "$1,$2");
                return x;
            },
            getHocPhi(year){
                var ret = "";
                this.hocphis.forEach(function(hocphi){
                    if(hocphi.key == ("HPN_" + year)){
                        ret = hocphi.value;
                    }
                });
                if(ret == ""){
                    return 0;
                } else {
                    return parseInt(ret);
                }
            },
            createHocPhi(year, hocphi, control){
                this.editYear = year;
                this.state = control;
                this.hocphi = hocphi;
                $("#editHocPhi").modal("show");
            },
            saveHocPhi(){
                this.$store.dispatch("hocphi/saveHocPhi", {
                    key: "HPN_" + this.editYear,
                    value: this.hocphi
                }).then(data => {
                    location.reload();
                })
            }
        },
        computed: {
            hocphis(){
                return this.$store.state.hocphi.hocphis;
            }
        },
        mounted(){
            this.$store.dispatch("hocphi/getInfoHocPhi");
        }
    }
</script>