<template>
    <div>
        <input 
            class="form-control"
            v-model="newPassWord"
            placeholder="Nhập mật khẩu"
        >
        <button
            class="btn btn-success"
            @click="save()"
        >
            Lưu lại
        </button>
    </div>
</template>
<script>
import gql from 'graphql-tag'
// var client = this.$apolloProvider.defaultClient;
export default {
    data(){
        return {
            newPassWord: "",
        }
    },
    methods: {
        save(){
            var that = this;
            if(this.newPassWord.length < 8){
                alert("Mật khẩu phải có ít nhất 8 kí tự");
                return;
            }
            var client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`
                mutation {
                    updateUser(id: "${this.user.id}", data: {
                        password: "${this.newPassWord}"
                    }) {
                        id
                    }
                }
                `
            }).then(data => {
                this.$emit('stateResetPassword', 'DONE');
                that.newPassWord = "";
            }).catch(err => {

            });
        }
    },
    props: ['user', 'state'],
    created(){
        if(typeof window !== undefined){
            // Render in client

        }
    }
}
</script>