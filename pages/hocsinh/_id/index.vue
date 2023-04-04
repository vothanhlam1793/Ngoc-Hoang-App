<template>
    <div class="row">
        <div class="col">
            <div class="row">
                <div class="col">
                    <div class="d-flex justify-content-between mb-3">
                        <div class="p-2"><a href="/hocsinh" class="btn btn-secondary">Trở về</a></div>
                        <div class="p-2">
                            <button class="btn btn-warning" v-if="stateEditHocSinh == 'EDITTING'" @click="saveChange()">Lưu</button>
                            <a class="btn btn-primary" href="/hocsinh/create">Tạo mới</a>
                            <button class="btn btn-danger" @click="deleteParent()">Xoá</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <HocSinhShow :hocsinh="hocsinh" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    async asyncData({app, params}){
        let client = app.apolloProvider.defaultClient;
        var data = await client.query({
            query: gql`
            query {
                Student(where: {id: "${params.id}"}){
                    id
                    name
                    status
                    lophoc {
                        name
                        chunhiem {
                            name
                        }
                        id
                    }
                    parent {
                        name
                        id
                        phone {
                            number
                        }
                    }
                    hocphi
                    luuy
                }
            }
            `
        })
        return {
            hocsinh: data.data.Student,
            id: params.id
        }
    },
    methods: {
        saveChange(){
            this.$store.dispatch("edithocsinh/saveChange");
        }
    },  
    computed: {
        stateEditHocSinh(){
            return this.$store.state.edithocsinh.state;
        }
    },
    layout: "app"
}
</script>