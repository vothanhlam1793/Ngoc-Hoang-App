<template>
    <td class="text-right">
        {{ numberWithCommas(total) }}
    </td>
</template>
<script>
import gql from 'graphql-tag'
export default {
    props: ['item'],
    data(){
        return {
            type: "DIEMDANH545",
            diemdanhs: [],
            total: 0,
            priceVeTre: 0
        }
    },
    methods: {
        numberWithCommas(x) {
            if(x){
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
                return 0;
            }
        },
        getPhieuDiemDanh(){
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    allDiemDanhs(where: {
                        AND: [{
                        type: "${this.type}"
                        }, {
                        co_some: {
                            id: "${this.item.hocsinh.id}"
                        }
                        }]
                    }){
                        id
                        code
                        type
                    }
                }
                `
            }).then(data => {
                that.diemdanhs = data.data.allDiemDanhs;
                that.total = that.diemdanhs.length * that.priceVeTre;
                that.$emit("update-data", that.total);
                // that.$store.commit("pks/updateAnChieu", {
                //     item: that.item,
                //     total: that.total,
                // })
            }).catch(err => {
                console.log(err);
            })
        },
        get545(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    allVariables(where: {
                        key: "PRICE_545"
                    }){
                        id
                        key
                        value
                    }
                }
                `
            }).then(data => {
                if(data.data.allVariables.length > 0){
                    that.priceVeTre = parseInt(data.data.allVariables[0].value) | 0;
                    that.total = that.diemdanhs.length * that.priceVeTre;
                    that.$emit("update-data", that.total);
                    // that.$store.commit("pks/updateAnChieu", {
                    //     item: that.item,
                    //     total: that.total,
                    // })
                } else {
                    that.priceVeTre = 0;
                }
            }).catch(err => {
                console.log(err);
            });
        }
    },
    created(){
        this.getPhieuDiemDanh();   
        this.get545(); 
    }
}
</script>