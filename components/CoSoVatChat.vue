<template>
    <div class="row">
        <div class="col">
            <div class="d-flex justify-content-between mb-3">
                <div class="">
                    <h4>Tiền cơ sở vật chất</h4>
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
                <label for="usr">Cả năm:</label>
                <input type="text" class="form-control" id="usr"
                    v-model="full"
                    @change="changed()"
                >
            </div>
            <div class="form-group">
                <label for="usr">Học kì:</label>
                <input type="text" class="form-control" id="usr"
                    v-model="half"
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
            full: 200000,
            half: 100000,
            state: "NORMAL",
            oHalf: {},
            oFull: {}
        }
    },
    methods: {
        loadCoSoVatChat(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    allVariables (where: {
                        OR: [
                        {
                            key_contains: "CSVC_FULL"
                        },
                        {
                            key_contains: "CSVC_HALF"
                        }
                        ]
                    }){
                        id
                        key
                        value
                    }
                }
                `
            }).then(data => {
                data.data.allVariables.forEach(function(variable){
                    if(variable.key == "CSVC_FULL"){
                        that.full = variable.value;
                        that.oFull = variable;
                    } else if (variable.key == "CSVC_HALF"){
                        that.half = variable.value;
                        that.oHalf = variable;
                    }
                });
            }).catch (err => {
                console.log(err);
            });
        },
        async saveChange(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            // Tạo cái full
            if(this.oFull.id){
                // Luu
                await client.mutate({
                    mutation: gql`
                    mutation {
                        updateVariable(id: "${this.oFull.id}", data: {
                            value: "${this.full}"
                        }){
                            id
                        }
                    }
                    `
                })
            } else {
                // Tao moi
                await client.mutate({
                    mutation: gql`
                    mutation {
                        createVariable(data: {
                            key: "CSVC_FULL",
                            value: "${this.full}"
                        }){
                            id
                        }
                    }
                    `
                })
            }

            if(this.oHalf.id){
                // Luu
                await client.mutate({
                    mutation: gql`
                    mutation {
                        updateVariable(id: "${this.oHalf.id}", data: {
                            value: "${this.half}"
                        }){
                            id
                        }
                    }
                    `
                })
            } else {
                // Tao moi
                await client.mutate({
                    mutation: gql`
                    mutation {
                        createVariable(data: {
                            key: "CSVC_HALF",
                            value: "${this.half}"
                        }){
                            id
                        }
                    }
                    `
                })
            }
            this.state = "NORMAL";

        },
        changed(){
            this.state = "CHANGED";
        },
    },
    created(){
        this.loadCoSoVatChat();
    }
}
</script>