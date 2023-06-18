<template>
    <div class="row">
        <div class="col">
            <h4>Thu tiền</h4>
            <div>
                <p>Nợ còn: {{ numberWithCommas(debt - purchar) }}</p>
            </div>
            <div class="">
                <div class="form-group">
                    <input type="text" class="form-control" id="usr"
                        placeholder="Nhập số tiền cần thu"
                        v-model="purchar"
                    >
                </div>
            </div>
            <div class="text-center">
                <button
                    class="btn btn-primary"
                    @click="createPhieuThu()"
                >Thu tiền</button>
            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    props: ['phuhuynh'],
    methods: {
        createPhieuThu(){
            var client = this.$apolloProvider.defaultClient;
            if(this.purchar <= 0){
                alert("Nhập số tiền > 0 đồng nhé");
                return;
            }
            client.mutate({
                mutation: gql`
                mutation {
                createPhieuThu(data: {
                      total: ${this.purchar},
                  parent: {
                    connect: {
                      id: "${this.phuhuynh.id}"
                    }
                  },
                  createdAt: "${(new Date()).toISOString()}",
                }){
                  id
                }
              }
                `
            }).then(data => {
                console.log(data);
                location.reload();
            }).catch(err => {
                console.log(err);
            })
        },
        numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
    },
    data(){
        return {
            debt: 0,
            purchar: ""
        }
    },
    watch: {
        phuhuynh(n,o){
            this.debt = n.debt;
        }
    },
    created(){
        this.debt = this.phuhuynh.debt;
    }
}
</script>