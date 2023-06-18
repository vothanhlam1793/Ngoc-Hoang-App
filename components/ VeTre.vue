<template>
    <div class="row">
        <div class="col">
            <div class="d-flex justify-content-between mb-3">
                <div class="">
                    <h4>Phí về trễ</h4>
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
                <label for="usr">Phí:</label>
                <input type="text" class="form-control" id="usr"
                    v-model="price"
                    @change="changed()"
                >
            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data(){
        return {
            price: 0,
            state: "NORMAL",
            variable: {}
        }
    },
    methods: {
        saveChange(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            if(this.variable.id){
                // Update
                client.mutate({
                    mutation: gql`
                        mutation {
                        updateVariable (id: "${this.variable.id}", data: {
                            value: "${this.price}"
                        }){
                            id
                            key
                            value
                        }
                    }
                    `
                }).then(data => {
                    that.state="NORMAL";
                }).catch (err => {
                    console.log(err);
                });
            } else {
                // Create
                client.mutate({
                    mutation: gql`
                    mutation {
                        createVariable(data: {
                            key: "PRICE_VE_TRE",
                            value: "${this.price}"
                        }){
                            id
                            key
                            value
                        }
                    }
                    `
                }).then(data => {
                    console.log(data);
                    that.state = "NORMAL";
                })
            }
        },
        getVeTre(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    allVariables(where: {
                        key: "PRICE_VE_TRE"
                    }){
                        id
                        key
                        value
                    }
                }
                `
            }).then(data => {
                if(data.data.allVariables.length > 0){
                    that.price = parseInt(data.data.allVariables[0].value) | 0;
                    that.variable = data.data.allVariables[0];
                } else {
                    that.price = 0;
                }
            }).catch(err => {

            });
        },
        changed(){
            this.state = "CHANGED";
        }
    },
    created(){
        this.getVeTre();
    }
}
</script>