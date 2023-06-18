<template>
    <div class="row">
        <div class="col-3">
            <ul class="list-group list-group-flush">
                <li class="list-group-item list-group-item-action"
                @click="chooseStudent({id: ''})"
                >
                    Chưa phân lớp
                </li>
                <li class="list-group-item list-group-item-action"
                    v-for="lh in lophocs"
                    :key="lh.id"
                    @click="choose(lh)"
                >
                    {{ lh.name }}
                </li>
            </ul> 
        </div>
        <div class="col-9">
            <div class="text-right">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">
                Thêm học sinh mới
                </button>
            </div>
            <div class="">

                

                <!-- The Modal -->
                <div class="modal" id="myModal">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">

                    <!-- Modal Header -->
                    <div class="modal-header">
                        <h4 class="modal-title">Modal Heading</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>

                    <!-- Modal body -->
                    <div class="modal-body">
                        <HocSinhCreate></HocSinhCreate>
                    </div>

                    <!-- Modal footer -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    </div>

                    </div>
                </div>
                </div>
            </div>
            <div class="row" v-if="lophoc.id">
                <div class="col">
                    <h4>{{ lophoc.name }}</h4>
                    <div 
                    v-if="hocsinhs.length == 0"
                    >
                    <p>Không tìm thấy học sinh nào</p>
                    </div>
                    <div
                    v-else
                    >
                        <table class="table table-bordered">
                            <thead> 
                                <tr>
                                    <th>Tên</th>
                                    <th>Nợ học phí</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                v-for="hocsinh in hocsinhs"
                                >
                                    <td>{{ hocsinh.name }}</td>
                                    <td class="text-right">{{ numberWithCommas(hocsinh.parent.debt) }}</td>
                                    <td>
                                        <a
                                            class="btn btn-info"
                                            @click="choose(hocsinh)"
                                            :href="`/hocsinh/${hocsinh.id}`"
                                        >Xem chi tiết</a>
                                        <a
                                            class="btn btn-warning"
                                            @click="choose(hocsinh)"
                                            :href="`/hocsinh/congno/${hocsinh.id}`"
                                        >Xem nợ</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
            lophoc: {},
            hocsinhs: []
        }
    },
    methods: {
        choose(hocsinh){

        }
    },
    mounted(){

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
        sortHocSinh(hocsinhs){
            var ret = [];
            var that = this;
            hocsinhs.forEach(function(hocsinh){
                ret.push(hocsinh);
            });
            ret.sort(function(a,b){
                var t = a.name.split(" ");
                var u = b.name.split(" ");
                if(that.chuyentiengviet(t[t.length - 1]) < that.chuyentiengviet(u[u.length - 1])){
                    return -1;
                }
                if(that.chuyentiengviet(t[t.length - 1]) > that.chuyentiengviet(u[u.length - 1])){
                    return 1;
                }
                return 0;
            });
            return ret;
        },
        chooseStudent(){
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                allStudents(where: {
                        lophoc_is_null: true    
                }){
                    id name status parent {id debt phone {number name id}}
                }
                }
                `
            }).then(data => {
                that.hocsinhs = this.sortHocSinh(data.data.allStudents);
            }).catch(err => {
                console.log(err);
            });
        },
        numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        choose(lophoc){
            var that = this;
            this.lophoc = lophoc;
            var client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    LopHoc(where: {id: "${lophoc.id}"}){
                        id
                        hocsinhs {id name status parent {id debt phone {number name id}}}
                        name
                    }
                }
                `
            }).then(data => {
                that.hocsinhs = this.sortHocSinh(data.data.LopHoc.hocsinhs);
            }).catch(err => {
                console.log(err);
            });
        }
    },
    watch: {
        lophocs: function(n, o){
            this.choose(n[0]);
        },
    },
    computed: {
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