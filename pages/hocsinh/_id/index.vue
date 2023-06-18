<template>
    <div class="row">
        <div class="col-3">
            <HocSinhMenuNav
                :hocsinh="hocsinh"
            >
            </HocSinhMenuNav>
        </div>
        <div class="col-9">
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
        },
        lophocs(){
            return this.$store.state.lophoc.lophocs;
        }
    },
    created(){
        if(typeof window !== undefined){
            this.$store.dispatch("lophoc/getAllLopHoc");
        }
    },
    layout: "app"
}
</script>