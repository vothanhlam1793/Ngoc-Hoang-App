<template>
    <td class="text-right">
        {{ numberWithCommas(camera) }}
    </td>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data(){
        return {
            camera: 0
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
        getCamera(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`
                mutation {
                    createOrUpdateCamera(idHocSinh: "${this.item.hocsinh.id}"){
                        id
                        key
                        value
                        item
                        idItem
                    }
                }
                `
            }).then(data => {
                that.camera = parseInt(data.data.createOrUpdateCamera.value) * 50000;
                that.$store.commit("pks/updateCamera", {
                    item: that.item,
                    camera: that.camera
                })
                // that.getTotal();
            }).catch(err => {
                console.log(err);
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
        this.getCamera();
    },
    computed: {

    }
}
</script>