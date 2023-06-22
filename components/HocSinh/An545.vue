<template>
    <div class="row">
        <div class="col">
            <div class="d-flex justify-content-between mb-3">
                <div class="">
                    <h4>Ăn chiều</h4>
                </div>
                <div class="">
                    <button 
                        class="btn btn-warning"
                        v-if="state == 'CHANGED'"
                        @click="saveChange()"
                    >Lưu lại</button>
                </div>
            </div>
            <div class="form-group">
                <select type="text" class="form-control" id="usr"
                    v-model="an545.value"
                    @change="changed()"
                >
                <option
                    value="1"
                >Đăng ký ăn</option>
                <option
                    value="0"
                >Không</option>
                </select>
            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
// var client = this.$apolloProvider.defaultClient;
export default {
    props: ['hocsinh'],
    data(){
        return {
            an545: {},
            state: "NORMAL"
        }
    },
    methods: {
        createOrUpdateCamera(){
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`
                mutation {
                    createOrUpdateAn545(idHocSinh: "${this.hocsinh.id}"){
                        id
                        key
                        value
                        item
                        idItem
                    }
                }
                `
            }).then(data => {
                that.an545 = data.data.createOrUpdateAn545;
            }).catch(err => {
                console.log(err);
            })
        },
        changed(){
            this.state = "CHANGED";
        },
        saveChange(){
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`
                mutation {
                    updateVariable(id: "${this.an545.id}", data: {
                       value: "${this.an545.value}" 
                    }){
                        id
                        key
                        value
                        item
                        idItem
                    }
                }
                `
            }).then(data => {
                if(data.data.updateVariable.id){
                    that.state = "NORMAL"
                }
            })
        }
    },
    created(){
        this.createOrUpdateCamera();
    },
}
</script>