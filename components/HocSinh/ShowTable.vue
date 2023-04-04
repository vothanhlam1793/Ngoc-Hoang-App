<template>
    <div>
        <div class="row">
        </div>
        <div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Lớp</th>
                        <th>Trạng thái</th>
                        <th>Phụ huynh</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="hocsinh in hocsinhs" :key="hocsinh.id">
                        <td 
                            v-if="checkRole(['quan-tri-vien', 'hieu-truong', 'hieu-pho', 'ke-toan'])"
                        ><a :href="'/hocsinh/' + hocsinh.id">{{ hocsinh.name }}</a></td>
                        <td
                            v-else
                        >{{ hocsinh.name }}</td>
                        <td v-if="hocsinh.lophoc">{{ hocsinh.lophoc.name }}</td>
                        <td v-else>Chưa có lớp</td>
                        <td>{{ plaintTextStatus(hocsinh.status) }}</td>
                        <td v-if="hocsinh.parent">
                            <button 
                                @click="viewPhuHuynh(hocsinh)"
                                class="btn btn-primary"
                            >Xem thông tin</button>
                        </td>
                        <td v-else="Chưa có thông tin phụ huynh"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <div class="modal" id="showPhuHuynh">
            <div class="modal-dialog">
                <div class="modal-content">

                <!-- Modal Header -->
                <div class="modal-header">
                    <h4 class="modal-title">{{ hs.name }}</h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>

                <!-- Modal body -->
                <div class="modal-body">
                    <table class="table table-bordered table-striped">
                        <tbody>
                            <tr>
                                <td>Tên phụ huynh</td>
                                <td>{{ hs.parent.name }}</td>
                            </tr>
                            <tr
                                v-for="p,i in hs.parent.phone"
                            >
                                <td>SĐT-{{ i }}</td>
                                <td>{{ p.number }}</td>
                            </tr>
                        </tbody>
                    </table>
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
</template>
<script>
    export default {
        data(){
            return {
                hs: {
                    parent: {}
                }
            };
        },
        mounted(){
            this.$store.dispatch('hocsinh/get_data');
        },
        computed: {
            hocsinhs(){
                return this.$store.state.hocsinh.hocsinhs;
            },
            roles(){
                return this.$store.state.user.roles;
            }
        },
        methods: {
            checkRole(slugs){
                var ret = false;
                this.roles.forEach(function(e1){
                slugs.forEach(function(e2){
                    if(e1 == e2){
                    ret = true;
                    }
                });
                })
                return ret;
            },
            viewPhuHuynh(hs){
                $("#showPhuHuynh").modal("show");
                this.hs = hs;
            },
            plaintTextStatus(code){
                switch(code){
                    case "DANG_KY": {
                        return "Đăng ký"
                    }
                    break;
                    case "DANG_HOC": {
                        return "Đang học"
                    }
                    break;
                    case "TAM_NGHI": {
                        return "Tạm nghỉ"
                    }
                    break;
                    case "NGHI_LUON": {
                        return "Nghỉ luôn"
                    }
                    break;
                    default: {
                        return "Không xác định"
                    }
                }
            }
        }
    }
</script>