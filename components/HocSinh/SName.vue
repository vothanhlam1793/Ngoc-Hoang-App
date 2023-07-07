<template>
    <div class="row">
        <div class="col">
            <div class="d-flex justify-content-between mb-3">
                <div class="">
                    <h4>Tên ở nhà</h4>
                </div>
                <div class="">
                    <button 
                        class="btn btn-warning"
                        v-if="state == 'CHANGED'"
                        @click="saveChange()"
                    >Lưu lại</button>
                </div>
            </div>
            <div class="form-group">
                <input 
                    class="form-control"
                    v-model="variable.value"
                    @change="changed"
                />
            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
// var client = this.$apolloProvider.defaultClient;
import {getVariableByKey, createVariable, updateVariable} from '~/plugins/variable.js'
export default {
    props: ['hocsinh'],
    data(){
        return {
            variable: {},
            state: "NONE"
        }
    },
    methods: {
        changed(){
            this.state = "CHANGED";
        },
        saveChange(){
            var that = this;
            if(this.variable.id){
                // update
                updateVariable(this.$apolloProvider.defaultClient, this.variable)
                .then(variable => {
                    that.state = "NONE";
                }).catch(err => {
                    console.log("UPDATE: ", err);
                });
            } else {
                // create new
                createVariable(this.$apolloProvider.defaultClient, this.variable)
                .then(variable => {
                    that.variable = variable;
                    that.state = "NONE";
                }).catch(err => {
                    console.log("CREATED: ", err);
                });
            }
        },
        querySName(){
            var that = this;
            getVariableByKey(this.$apolloProvider.defaultClient, {
                item: "Student",
                idItem: this.hocsinh.id,
                key: "SNAME"
            }).then(variable => {
                that.variable = variable;
            }).catch(err => {
                console.log(err);
            });
        }
    },
    created(){
        // this.createOrUpdateCamera();
        this.querySName();
    },
}
</script>