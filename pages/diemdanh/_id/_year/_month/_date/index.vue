<template>
    <div class="col">
        <div class="row">
            <div class="">
                <p v-if="phieudiemdanh.id">Đã điểm danh</p>
                <p v-else>Chưa điểm danh</p>
            </div>
        </div>
        <div v-if="((phieudiemdanh.id == undefined) || state == 'EDIT')" class="row">
            <div class="col">
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr class="text-center">
                            <th>Tên</th>
                            <th>Có</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="hocsinh in lophoc.hocsinhs"
                        >
                            <td>{{ hocsinh.name }}</td>
                            <td class="">
                                <div class="text-center">
                                    <input 
                                    @change="checkDiemDanh()"
                                    class="larger" type="radio" id="one" value="online" v-model="status[hocsinh.id]" />
                                    <label for="one">Có</label> | 
                                    <input 
                                    @change="checkDiemDanh()"
                                    class="larger" type="radio" id="one" value="offline" v-model="status[hocsinh.id]" checked />
                                    <label for="one">Không</label>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="text-center">
                    <p>Tổng: {{ thongtindiemdanh.total }} | Có: {{ thongtindiemdanh.online }} | Vắng: {{ thongtindiemdanh.offline }}</p>
                    <button 
                        @click="nopDiemDanh()"
                        class="btn btn-success"
                        v-if="state=='CREATE'"                    
                    >Lưu điểm danh</button>

                    <button 
                        @click="suaPhieuDiemDanh()"
                        class="btn btn-warning"
                        v-if="state=='EDIT'"                    
                    >Sửa phiếu</button>
                </div>
            </div>
        </div>
        <div v-else class="row">
            <div class="col">
                <button 
                    class="btn btn-warning"
                    @click="editDiemDanh()"
                >Sửa điểm danh</button>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Kết quả</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="hocsinh in lophoc.hocsinhs"
                        >
                            <td>{{ hocsinh.name }}</td>
                            <td
                                :class="checkHocSinhTuPhieu(hocsinh).color"
                            >
                            {{ checkHocSinhTuPhieu(hocsinh).message }}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            status: {},
            state: "CREATE"
        }
    },
    methods: {
        checkDiemDanh(){
            this.$store.commit("diemdanh/dadiemdanh", {
                hocsinhs: this.lophoc.hocsinhs,
                status: this.status
            })
        },
        nopDiemDanh(){
            if(this.thongtindiemdanh.total != this.lophoc.hocsinhs.length){
                alert("Chưa điểm danh xong");
                return;
            }
            this.$store.dispatch("diemdanh/create", {
                hocsinhs: this.lophoc.hocsinhs, 
                lophoc: this.lophoc,
                status: this.status,
                code: this.$route.params.year + "_" + this.$route.params.month + "_" + this.$route.params.date,
                idLopHoc: this.$route.params.id
            }).then(data => {
                    console.log(data);
                    location.reload();
                }).catch(err => {

                })
        },
        suaPhieuDiemDanh(){
            var that = this;
            this.$store.dispatch("diemdanh/deletePhieuDiemDanh", this.phieudiemdanh.id)
            .then(data => {
                console.log(data);
                that.$store.dispatch("diemdanh/create", {
                    hocsinhs: that.lophoc.hocsinhs, 
                    lophoc: that.lophoc,
                    status: that.status,
                    code: that.$route.params.year + "_" + that.$route.params.month + "_" + that.$route.params.date,
                    idLopHoc: that.$route.params.id
                }).then(data => {
                    console.log(data);
                    location.reload();
                }).catch(err => {

                })
            }).catch(err => {
                console.log(err);
            })
        },
        checkHocSinhTuPhieu(hocsinh){
            // Kiểm tra đi học
            var ret = {};
            this.phieudiemdanh.dihoc.forEach(function(hs){
                if(hs.id == hocsinh.id){
                    ret.message = "Có";
                    ret.color = "table-success";
                }
            })
            this.phieudiemdanh.nghi.forEach(function(hs){
                if(hs.id == hocsinh.id){
                    ret.message = "Vắng"
                    ret.color = "table-danger";
                }
            }) 
            if(ret.message == undefined){
                ret.message = "Không điểm danh";
                ret.color = "table-secondary"
            }  
            return ret;
        },
        editDiemDanh(){
            this.state = "EDIT";
            // Tạo status
            var status = {};
            this.phieudiemdanh.dihoc.forEach(function(hocsinh){
                status[hocsinh.id] = "online";
            });
            this.phieudiemdanh.nghi.forEach(function(hocsinh){
                status[hocsinh.id] = "offline";
            });
            // 
            this.status = status;
        }
    },
    watch: {
        lophoc: function(newValue, oldValue){
        }
    },
    computed: {
        lophoc(){
            return this.$store.state.lophoc.lophoc;
        },
        phieudiemdanh(){
            if(this.$store.state.diemdanh.searchPhieuDiemDanh.length == 0){
                return {}
            } else {
                return this.$store.state.diemdanh.searchPhieuDiemDanh[0];
            }
        },
        thongtindiemdanh(){
            return {
                online: this.$store.state.diemdanh.online,
                offline: this.$store.state.diemdanh.offline,
                total: this.$store.state.diemdanh.dadiemdanh,
            }
        }
    },
    mounted(){
        console.log(this.$route.params);
        this.$store.dispatch("lophoc/getLopHoc", this.$route.params.id);
        this.$store.dispatch("diemdanh/searchDiemDanh", {
            code: this.$route.params.year + "_" + this.$route.params.month + "_" + this.$route.params.date,
            id: this.$route.params.id
        })
    }
}
</script>