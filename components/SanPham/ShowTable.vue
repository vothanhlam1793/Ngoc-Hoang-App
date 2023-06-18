<template>
    <div class="row">
        <div class="col">
            <div class="d-flex justify-content-between ">
                <div>
                    <h2 class="my-3">Danh sách sản phẩm</h2>
                </div>
            </div>
            <table class="table table-bordered table-striped">
                    <thead>
                        <tr class="text-center">
                            <th>Tên</th>
                            <th>Giá</th>
                            <th>Tồn</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="sanpham in sanphams"
                            :key="sanpham.id"
                        >
                            <td>{{ sanpham.name }}</td>
                            <td class="text-right">{{ numberWithCommas(sanpham.price) }}</td>
                            <td class="text-right">{{ numberWithCommas(sanpham.amount) }}</td>
                            <td class="text-center"><button
                                class="btn btn-danger"
                                @click="deleteSanPham(sanpham)"
                                >
                                x
                            </button></td>
                        </tr>
                    </tbody>
                </table>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    methods: {        
        numberWithCommas(x) {
            if(x){
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
                return 0;
            }
        },
        deleteSanPham(sanpham){
            if(confirm("Đây là hành động không phục hồi được, bạn chắc chứ?")){

            } else {
                return;
            }
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`
                mutation {
                    deleteSanPham(id: "${sanpham.id}"){
                        id
                    }
                }
                `
            }).then(data => {
                location.reload();
            })
        }
    },
    computed: {
        sanphams(){
            
            return this.$store.state.sanpham.sanphams;
        }
    }
}
</script>