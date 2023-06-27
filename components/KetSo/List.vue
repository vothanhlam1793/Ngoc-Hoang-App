<template>
    <div class="row">
        <div class="col">
            <h2>Tất cả phiếu</h2>
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <td></td>
                        <td>Số lượng</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="phieuketso in phieuketsos"
                    >
                        <td>{{ phieuketso.createdAt }}</td>
                        <td>{{ phieuketso.items.length }}</td>
                        <td><a :href="`ketso/showpks/${phieuketso.id}`">Phiếu gởi</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data(){
        return {
            phieuketsos: []
        }
    },
    methods: {
        getAllPhieuDiemDanh(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
            query {
                allPhieuKetSos {
                    id
                    items {
                    id
                    data
                    }
                    code
                    createdAt
                }
            }
            `
            }).then(data => {
                that.phieuketsos = data.data.allPhieuKetSos;
                console.log(that.phieuketsos)
            }).catch(err => {
                console.log(err);
            })
        }
    },
    mounted(){
        this.getAllPhieuDiemDanh();
    }
}
</script>