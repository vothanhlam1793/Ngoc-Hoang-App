<template>
    <div class="row">   
        <div class="col">
            <GiaoVienItem
                v-for="giaovien in giaoviens"
                v-if="checkRole(giaovien, 'giao-vien')"
                :user="giaovien"
                :lophocs="lophocs"
                :key="giaovien.id"
            />
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
// var client = this.$apolloProvider.defaultClient;
export default {
    data(){
        return {
            giaoviens: [],
            lophocs: []
        }
    },
    methods:{
        checkRole(user, role){
            var ret = false;
            user.roles.forEach(function(item){
                if(item.slug == role){
                    ret= true;
                }
            });            
            return ret;
        },
        getAllGiaoVien(){
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    allUsers{
                        id
                        name
                        username
                        roles {
                        id
                        name
                        slug
                        lophoc {
                            id
                            name
                        }
                        }
                        lophoc {
                        id
                        name
                        }
                    }
                }
                `
            }).then(data => {
                console.log(data);
                that.giaoviens = data.data.allUsers;
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
                    allLopHocs {
                        id
                        name
                    }
                }
                `
            }).then(data => {
                that.lophocs = data.data.allLopHocs;
            }).catch(err => {
                console.log(err);
            })
        },
    },
    mounted(){

    },
    created(){
        if (typeof window !== 'undefined') {
            this.getAllGiaoVien();
            this.getAllLopHoc();
        }
    }
}
</script>