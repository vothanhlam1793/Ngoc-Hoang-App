<template>
    <div class="row">
        <div class="col">
            <div class="form-group">
                <label for="usr">Tên lớp:</label>
                <input type="text" class="form-control" id="usr"
                    v-model="nameClass"
                >
            </div>
            <div class="row text-center">
                <div class="col">
                    <button class="btn btn-success"
                    @click="createLopHoc()"
                    >Tạo mới</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data(){
        return {
            nameClass: ""
        }
    },
    methods: {
        createLopHoc(){
            if(this.nameClass.length < 3){
                alert("Tên lớp phải dài hơn 3 kí tự");
                return;
            }
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`
                mutation {
                    createLopHoc(data: {
                        name: "${this.nameClass}"
                    }){
                        id
                        name
                    }
                }
                `
            }).then(data => {
                that.nameClass = "";
                location.reload();
            }).catch (err => {
                console.log(err);
            });
        }
    },
    created(){

    }
}
</script>