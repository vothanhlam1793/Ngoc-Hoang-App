<template>
    <div class="row">   
        <div class="col">
            <div class="form-group">
            <label>Tên giáo viên:</label>
            <input type="text" class="form-control"
                v-model="name"
            >
            </div>
            <div class="form-group">
            <label>Tên đăng nhập:</label>
            <input type="text" class="form-control"
                v-model="username"
            >
            </div>
            <div class="form-group">
            <label>Mật khẩu:</label>
            <input type="password" class="form-control"
                v-model="password"
            >
            </div> 
            <div class="row">
                <div class="col text-center">
                    <button
                        class="btn btn-success"
                        @click="createGiaoVien()"
                    >Tạo giáo viên</button>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
// var client = this.$apolloProvider.defaultClient;
export default {
    data(){
        return {
            name: "",
            username: "",
            password: "",
            roles: []
        }
    },
    methods:{
        createGiaoVien(){
            if(this.name.length < 5){
                alert("Tên không được ngắn hơn 5 kí tự");
                return;
            }
            if(this.password.length < 5){
                alert("Mật khẩu không ngắn hơn 8 kí tự");
                return;
            }
            var that = this;
            var idGiaoVien = "";
            // console.log(that.roles);
            that.roles.forEach(function(lh){
                if(lh.slug == "giao-vien"){
                    idGiaoVien = lh.id
                }
            });

            var client = this.$apolloProvider.defaultClient;
            console.log(`
            mutation {
                    createUser (data: {
                        name: "${that.name}",
                        username: "${that.username}",
                        password: "${that.password}",
                        roles: {
                        connect: {
                            id: "${idGiaoVien}"
                        }
                        }
                    }){
                        id
                        name
                    }
                }
            `)
            client.mutate({
                mutation: gql`
                mutation {
                    createUser (data: {
                        name: "${that.name}",
                        username: "${that.username}",
                        password: "${that.password}",
                        roles: {
                        connect: {
                            id: "${idGiaoVien}"
                        }
                        }
                    }){
                        id
                        name
                    }
                }
                `
            }).then(data => {
                location.reload();
            }).catch(err => {
                console.log(err);
            })
        },
        getAllLopHoc(){
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    allRoles {
                        id
                        name
                        slug
                    }
                }
                `
            }).then(data => {
                that.roles = data.data.allRoles;
            }).catch(err => {
                console.log(err);
            })
        }
    },
    mounted(){

    },
    created(){
        if (typeof window !== 'undefined') {
            this.getAllLopHoc();
        }
    }
}
</script>