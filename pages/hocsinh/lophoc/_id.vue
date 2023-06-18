<template>
    <div class="row">
        <div class="col">
            <div v-if="lophoc.id">
                <table class="table table-bordered table-striped">
                    <thead
                        class="text-center"
                    >
                        <tr>
                            <th>Tên</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <HocSinhItem
                            v-for="hocsinh in lophoc.hocsinhs"
                            :hocsinh="hocsinh"
                            :key="hocsinh.id"
                        >
                        </HocSinhItem>
                    </tbody>
                </table>
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
            idLopHoc: "",
            lophoc: {}
        }
    },
    methods: {
        getLopHoc(){
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    LopHoc(where: {id: "${this.idLopHoc}"}){
                        id
                        name
                        hocsinhs {
                        id
                        name
                        parent {
                            id
                            name
                            phone {
                            number
                            name
                            id
                            }
                        }
                        }
                    }
                }
                `
            }).then(data => {
                that.lophoc = data.data.LopHoc;
            }).catch(err => {
                console.log("ERROR - LOPHOC", err);
            });
        }
    },
    created(){
        if(typeof window !== undefined){
            this.idLopHoc = this.$route.params.id;
            this.getLopHoc();
        }
    },
    layout: "app"
}
</script>