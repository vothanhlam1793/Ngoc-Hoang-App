<template>
    <div class="row">
        <div class="col">
            <div class="d-flex justify-content-between mb-3">
                <div class="">
                    <h4>Ghi chú</h4>
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
                <textarea 
                    class="form-control"
                    v-model="variable.value"
                    @change="changed"
                    rows="5"
                ></textarea>
            </div>
        </div>
    </div>
</template>
<script>
import {getVariableByKey, createVariable, updateVariable} from '~/plugins/variable.js'
export default {
    props: ['hocsinh'],
    data(){
        return {
            variable: {},
            state: "NONE",
            key: "NOTE-STUDENT"
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
        queryVariable(){
            var that = this;
            getVariableByKey(this.$apolloProvider.defaultClient, {
                item: "Student",
                idItem: this.hocsinh.id,
                key: this.key
            }).then(variable => {
                that.variable = variable;
            }).catch(err => {
                console.log(err);
            });
        }
    },
    created(){
        // this.createOrUpdateCamera();
        this.queryVariable();
    },
}
</script>