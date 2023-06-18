<template>
    <div class="row">
        <div class="col">
            <div class="d-flex justify-content-between mb-3">
                <div class="">
                    <h4>Đăng ký lớp</h4>
                </div>
                <div class="">
                    <button 
                        class="btn btn-warning"
                        v-if="state == 'CHANGED'"
                        @click="saveChange()"
                    >Lưu lại</button>
                </div>
            </div>
            <select 
                class="form-control" v-model="idLopHoc"
                @change="changed()"
            >
                <option v-for="lophoc in lophocs" :value="lophoc.id">{{ lophoc.name }}</option>
            </select>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    props: ['hocsinh'],
    data(){
        return {
            lophocs: [],
            idLopHoc: "",
            state: "NORMAL"
        }
    },
    methods: {
        getLopHoc(){
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    allLopHocs {
                    name
                    id
                    chunhiem {
                        name
                    }
                    }
                }
                `
            }).then(data => {
                that.lophocs = data.data.allLopHocs;
            })
        },
        changed(){
            this.state = "CHANGED";
        },
        saveChange(){
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`
                mutation {
                    updateStudent (id: "${this.hocsinh.id}", data: {
                        lophoc: {
                            connect: {
                                id: "${this.idLopHoc}"
                            }
                        }
                    }){
                        id
                        name
                    }
                }
                `
            }).then(data => {
                if(data.data.updateStudent.id){
                    that.state = "NORMAL"
                }
            })
        }
    },
    computed: {

    },
    created(){
        if(this.hocsinh.lophoc){
            this.idLopHoc = this.hocsinh.lophoc.id;
        } else {
            this.idLopHoc = "";
        }
        this.getLopHoc();
    }
}
</script>