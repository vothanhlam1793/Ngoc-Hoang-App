<template>
    <div class="row rounded border border-primary p-2 m-3">
        <div class="col-3">
            <div class="row">
                <div class="col">
                    <h4>{{ user.name }}</h4>
                    <p>Chức vụ</p>
                    <ul>
                        <li v-for="role in user.roles">
                            {{ role.name }}
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <div class="modal" :id="`myModal${user.id}`">
                    <div class="modal-dialog">
                        <div class="modal-content">

                        <!-- Modal Header -->
                        <div class="modal-header">
                            <h4 class="modal-title">{{ user.name }}</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>

                        <!-- Modal body -->
                        <div class="modal-body">
                            <GiaoVienResetPassword 
                                :user="user"
                                @stateResetPassword="changeStateRP($event)"
                                :state="stateRP"
                            ></GiaoVienResetPassword>
                        </div>

                        <!-- Modal footer -->
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-7">
            <h5>Lớp quản lý</h5>
            <div>
                <select class="selectpicker" multiple 
                    :id="`slh${user.id}`"
                    @change="changed()"
                    v-model="lhs"
                >
                    <option
                        v-for="lophoc in lophocs"
                        :key="lophoc.id"
                        :value="lophoc.id"
                    >
                        {{ lophoc.name }}
                    </option>
                </select>
            </div>
        </div>
        <div class="col-2">
            <button type="button" class="btn btn-warning m-3"
                @click="changePassword()"
            >
            Đổi mật khẩu
            </button>
            <button
                class="btn btn-danger m-3"
                @click="deleteGiaoVien()"                
                > 
            Xoá giáo viên
            </button>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
// var client = this.$apolloProvider.defaultClient;
export default {
    data(){
        return {
            lhs: [],
            stateRP: "IDLE"
        }
    },
    props: ['user', 'lophocs'],
    methods: {
        changeStateRP(state){
            this.stateRP = state;
            if(state == "DONE"){
                $(`#myModal${this.user.id}`).modal("hide");
                this.stateRP = "IDLE";
            }
        },
        changePassword(){
            $(`#myModal${this.user.id}`).modal("show");
        },
        deleteGiaoVien(){
            if(confirm("Đây là thao tác không thể phục hồi!. Bạn chắc chứ?")){
                var that = this;
                var client = this.$apolloProvider.defaultClient;
                client.mutate({
                    mutation: gql`
                    mutation {
                        deleteUser(id: "${this.user.id}"){
                            id
                        }
                    }
                    `
                }).then(data => {
                    location.reload();
                }).catch (err => {

                }) 
            }
        },
        changed(){
            // console.log(this.lhs);
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`
                mutation {
                    updateUser(id: "${that.user.id}", data: {
                        lophoc: {
                        disconnectAll: true
                        }
                    }) {
                        id
                    }
                }
                `
            }).then(data => {
                // console.log(data);
                var str = `[`;
                that.lhs.forEach(function(id, index){
                    if(index !== 0){
                        str += ",";
                    }
                    str += `{id: "${id}"}`
                });
                str += `]`;
                client.mutate({
                    mutation: gql`
                    mutation {
                        updateUser(id: "${that.user.id}", data: {
                            lophoc: {
                                    connect: ${str}
                            }
                        }) {
                            id
                        }
                    }
                    `
                }).then(data => {
                    // console.log(data);
                }).catch(err => {

                })
            })
        }
    },
    mounted(){
        $(`#slh${this.user.id}`).selectpicker();    
    },
    created(){
        if (typeof window !== 'undefined') {
            var that = this;
            this.user.lophoc.forEach(function(lh){
                that.lhs.push(lh.id);
            });
        }
    }
}
</script>