<template>
    <div class="row">
        <div class="col">
            <h1>{{ hocsinh.name }}</h1>
            <div class="row">
                <div class="col">
                    <h4>Trạng thái</h4>
                    <select class="form-control" v-model="status" @change="updateStatus()">
                        <option value="DANG_KY">Đăng ký</option>
                        <option value="DANG_HOC">Đang học</option>
                        <option value="TAM_NGHI">Tạm nghỉ</option>
                        <option value="NGHI_LUON">Nghỉ luôn</option>
                    </select>
                </div>
                <div class="col">
                    <h4>Học lớp</h4>
                    <select class="form-control" v-model="idLH" @change="updateLophoc()">
                        <option v-for="lophoc in lophocs" :value="lophoc.id">{{ lophoc.name }}</option>
                    </select>
                </div>
            </div>
            <div class="row my-3">
                <div class="col">
                    <HocPhi :id="hocsinh.id"></HocPhi>
                </div>
                <div class="col">
                    <HocSinhCamera></HocSinhCamera>
                </div>
                <div class="col">
                    <HocSinhAn545></HocSinhAn545>
                </div>
            </div>
            <div class="">

            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            idLH: "",
            status: "",
            hocphi: 0,
            luuy: {}
        }
    },
    methods: {
        updateHocPhi(){
            this.$store.commit('edithocsinh/updateState', 'EDITTING');     
            this.$store.commit('edithocsinh/updateHocPhi', this.hocphi);       
        },
        updateStatus(){
            this.$store.commit('edithocsinh/updateState', 'EDITTING');
            this.$store.commit('edithocsinh/updateStatus', this.status);
        },
        updateLophoc(){
            this.$store.commit('edithocsinh/updateState', 'EDITTING');
            this.$store.commit('edithocsinh/updateIdLophoc', this.idLH);
        },
        updateLuuY(){
            this.$store.commit('edithocsinh/updateState', 'EDITTING');
            this.$store.commit('edithocsinh/updateLuuY', this.luuy);
        }
    },
    computed: {
        lophocs(){
            console.log(this.$store.state);
            return this.$store.state.createhocsinh.lophocs;
        },
        idLophoc(){
            if(this.$store.state.edithocsinh.lophoc){
                return this.$store.state.edithocsinh.lophoc.id;
            } else {
                return "";
            }
        }
    },
    created(){
        this.$store.dispatch("createhocsinh/getLopHoc");
        if(this.hocsinh.lophoc){
                this.idLH = this.hocsinh.lophoc.id;
        } else {
            return "";
        }
        this.status = this.hocsinh.status;
        this.hocphi = this.hocsinh.hocphi || 0;
        this.$store.commit('edithocsinh/updateHocsinh', this.hocsinh);
        this.luuy = JSON.parse(this.hocsinh.luuy);
        if(this.luuy == null){
            this.luuy = {};
        }
        if(this.luuy.camera == undefined){
            this.luuy.camera = 0;
        }
    },
    props: ['hocsinh']
}
</script>