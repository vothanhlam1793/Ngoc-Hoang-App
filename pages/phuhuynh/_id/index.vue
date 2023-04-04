<template>
    <div class="row">
        <div class="col-2">
            <PhuHuynhSideBar />
        </div>
        <div class="col-10">
            <div class="row my-3">   
                <div class="col">
                    <div class="d-flex justify-content-between mb-3">
                        <div class="p-2"><a href="/phuhuynh" class="btn btn-secondary">Trở về</a></div>
                        <div class="p-2">
                            <button class="btn btn-warning">Sửa</button>
                            <button class="btn btn-danger" @click="deleteParent()">Xoá</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <PhuHuynhShow :parent="parent" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    async asyncData({app, params}) {
        let client = app.apolloProvider.defaultClient;
        var data = await client.query({
            query: gql`
            query {
                Parent(where: {id: "${params.id}"}){
                    id
                    name
                    status
                    hocsinhs {
                        name
                        status
                        lophoc {
                            name
                            chunhiem {
                                name
                            }
                            id
                        }
                        id
                    }
                    phone {
                        number
                        id
                    }
                }
            }
            `
        })
        return {
            parent: data.data.Parent,
            id: params.id,
        }
    },  
    data(){
        return {

        }
    },
    methods: {
        async deleteParent(){ 
            if(confirm("Bạn đang xoá dữ liệu, việc này không thể phục hồi?. Tiếp tục?")){

            } else {
                return;
            }
            var client = this.$apolloProvider.defaultClient;
            var data = await client.mutate({
                mutation: gql`
                mutation {
                    deleteParent (id: "${this.parent.id}"){
                        id
                    }
                }
                `
            })
            location.href = "/phuhuynh"
        }
    },
    layout: "app"
}
</script>