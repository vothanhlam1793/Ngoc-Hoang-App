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
            <div class="d-flex align-items-center justify-content-between mb-3">
                <button class="btn btn-outline-primary" :disabled="page === 1 || loading" @click="getAllPhieuDiemDanh(page - 1)">Trang trước</button>
                <span>Trang {{ page }}/{{ totalPages }} ({{ total }} phiếu)</span>
                <button class="btn btn-outline-primary" :disabled="page === totalPages || loading" @click="getAllPhieuDiemDanh(page + 1)">Trang sau</button>
            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data(){
        return {
            phieuketsos: [],
            page: 1,
            pageSize: 50,
            total: 0,
            loading: false
        }
    },
    computed: {
        totalPages(){
            return Math.max(1, Math.ceil(this.total / this.pageSize));
        }
    },
    methods: {
        getAllPhieuDiemDanh(page = 1){
            var that = this;
            this.loading = true;
            let client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
            query getPhieuKetSos($first: Int, $skip: Int) {
                allPhieuKetSos(first: $first, skip: $skip, sortBy: createdAt_DESC) {
                    id
                    items {
                        id
                    }
                    code
                    createdAt
                }
                _allPhieuKetSosMeta {
                    count
                }
            }
            `,
                variables: {
                    first: this.pageSize,
                    skip: (page - 1) * this.pageSize
                },
                fetchPolicy: 'network-only'
            }).then(data => {
                that.phieuketsos = data.data.allPhieuKetSos;
                that.total = data.data._allPhieuKetSosMeta.count;
                that.page = page;
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                that.loading = false;
            })
        }
    },
    mounted(){
        this.getAllPhieuDiemDanh();
    }
}
</script>
