<template>
    <div>
        {{ numberWithCommas(camera) }}
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data() {
        return {
            camera: 0
        }
    },
    methods: {
        numberWithCommas(x) {
            if (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
                return 0;
            }
        },
        getCamera() {
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`
                mutation {
                    createOrUpdateCamera(idHocSinh: "${this.hocsinh.id}"){
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
                that.$emit("update-data", that.camera);
            }).catch(err => {
                console.log(err);
            })
        }
    },
    props: ['hocsinh'],
    created() {
        this.getCamera();
    },
    computed: {

    }
}
</script>