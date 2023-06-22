<template>
    <div class="row border border-primary rounded p-2">
        <div class="col">
            <div class="d-flex justify-content-between mb-3">
                <div class="">
                    <h4>Học phí</h4>
                </div>
                <div class="">
                    <button class="btn btn-warning" v-if="state == 'CHANGED'" @click="saveChange()">Lưu lại</button>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="usr">Học phí năm</label>
                        <select class="form-control" v-model="hocsinh.namhocphi" @change="changed()">
                            <option v-for="i in 6" :value="`HPN_${(new Date()).getFullYear() - i}`">{{ (new
                                Date()).getFullYear() -
                                i }}</option>
                        </select>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="usr">Giảm:</label>
                        <input type="text" class="form-control" id="usr" v-model="hocsinh.hocphigiam" @change="changed()">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data() {
        return {
            hocsinh: {},
            state: "NORMAL"
        }
    },
    methods: {
        loadStudent: function () {
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
            Student (where: { id: "${this.id}"}){
                id
                name
                status
                parent {
                id
                name
                phone {
                    number
                }
                code
                hocsinhs {
                    name
                    lophoc {
                    id
                    name
                    chunhiem {
                        name
                    }
                    }
                }
                }
                lophoc {
                id
                name
                chunhiem {
                    name
                }
                }
                hocphi
                hocphigiam
                namhocphi
                luuy
            }
            }`
            }).then(data => {
                that.hocsinh = data.data.Student;
            }).catch(err => {
                console.log(err);
            });
        },
        saveChange() {
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`
                mutation {
                    updateStudent (id: "${this.id}", data: {
                        hocphigiam: "${this.hocsinh.hocphigiam}",
                        namhocphi: "${this.hocsinh.namhocphi}"
                    }){
                        id
                    }
                }
                `
            }).then(data => {
                that.state = "NORMAL";
            }).catch(err => {
                console.log(err);
            })
        },
        changed() {
            this.state = "CHANGED";
        }
    },
    mounted() {
        this.loadStudent();
    },
    props: ["id"]
}
</script>