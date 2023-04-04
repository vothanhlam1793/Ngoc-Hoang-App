<template>
    <div class="row">
        <div class="col">
            <div class="d-flex justify-content-between mb-3">
                <div class="">
                    <h4>Camera</h4>
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
                <input type="text" class="form-control" id="usr"
                    v-model="camera.value"
                    @change="changed()"
                >
            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data(){
        return {
            camera: {},
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
                    createOrUpdateCamera(idHocSinh: "${this.$route.params.id}"){
                        id
                        key
                        value
                        item
                        idItem
                    }
                }
                `
            }).then(data => {
                that.camera = data.data.createOrUpdateCamera;
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
                    updateVariable(id: "${this.camera.id}", data: {
                       value: "${this.camera.value}" 
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
        console.log(this.$route.params.id);
    },
}
</script>