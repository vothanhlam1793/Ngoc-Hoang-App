<template>
    <div class="row">
        <div class="col">
            <div v-if="lophoc.id">
                <table class="table table-bordered table-striped">
                    <thead
                        class="text-center"
                    >
                        <tr class="text-center">
                            <th>STT</th>
                            <th>Tên</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <HocSinhItem
                            v-for="hocsinh, index in lophoc.hocsinhs"
                            :hocsinh="hocsinh"
                            :key="hocsinh.id"
                            :index="index"
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
        chuyentiengviet(str) {
            if(str == undefined){
                return "";
            }
            return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
        },
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
                that.lophoc.hocsinhs.sort(function(a,b){
                    let t = a.name.split(" ");
                    t = t.filter(e => e != "");
                    let u = b.name.split(" ");
                    u = u.filter(e => e != "");
                    if(that.chuyentiengviet(t[t.length - 1]) < that.chuyentiengviet(u[u.length - 1])){
                        return -1;
                    } else if(that.chuyentiengviet(t[t.length - 1]) > that.chuyentiengviet(u[u.length - 1])){
                        return 1;
                    } else {
                        return 0;
                    }
                });
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