<template>
    <td class="text-right">
        {{ numberWithCommas(total) }}
    </td>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data(){
        return {
            total: 0,
            hoadons: []
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
        getHoaDonChuaKetSo(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    allHoaDons (where: {
                        OR: [
                        {
                            type: "KETSO",
                            student: {
                                id: "${this.item.hocsinh.id}"
                            },
                            item: "",
                            idItem: ""
                        },
                        {
                            type: "KETSO",
                            student: {
                                id: "${this.item.hocsinh.id}"
                            },
                            item: "ItemKetSo",
                            idItem: "${this.item.id}"
                        }]
                    }) {
                        id
                        total
                        parent {
                        id
                        name
                        hocsinhs {
                            id
                            name
                        }
                        }
                    }
                }`
            }).then(data => {
                console.log(data);
                that.total = 0;
                data.data.allHoaDons.forEach(function(hoadon){
                    that.total += hoadon.total;
                });
                that.hoadons = data.data.allHoaDons;
                that.$store.commit("pks/updateHoaDon", {
                    item: that.item,
                    hoadons: that.hoadons,
                    total: that.total
                })
            }).catch(err => {
                console.loe(err);
            })
        }
    },
    watch: {
        item: {
            immediate: true,
            handler(n, o){
                // console.log(n);
            }
        }
    },
    props: ['item'],
    created(){
        this.getHoaDonChuaKetSo();
        // console.log(this.item);
    },
    computed: {

    }
}
</script>