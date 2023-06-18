<template>
    <div class="row">
        <div class="col">
            <div class="d-flex justify-content-between mb-3">
                <div class="">
                    <h4>Trạng thái học sinh</h4>
                </div>
                <div class="">
                    <button 
                        class="btn btn-warning"
                        v-if="state == 'CHANGED'"
                        @click="saveChange()"
                    >Lưu lại</button>
                </div>
            </div>
            <select class="form-control" v-model="status" 
            @change="changed()"
            >
                        <option value="DANG_KY">Đăng ký</option>
                        <option value="DANG_HOC">Đang học</option>
                        <option value="TAM_NGHI">Tạm nghỉ</option>
                        <option value="NGHI_LUON">Nghỉ luôn</option>
            </select>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    props: ['hocsinh'],
    data(){
        return {
            state: "NORMAL",
            status: ""
        }
    },
    methods: {
        changed(){
            this.state = "CHANGED";
        },
        saveChange(){
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`
                mutation {
                    updateStudent (id: "${this.hocsinh.id}", data: {
                        status: "${this.status}"
                    }){
                        id
                        name
                    }
                }
                `
            }).then(data => {
                if(data.data.updateStudent.id){
                    that.state = "NORMAL"
                }
            })
        }
    },
    computed: {

    },
    created(){
        if(this.hocsinh.status){
            this.status = this.hocsinh.status;
        } else {
            this.status = "";
        }
    }
}
</script>