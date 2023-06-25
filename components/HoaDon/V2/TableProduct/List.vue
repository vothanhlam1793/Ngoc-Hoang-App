<template>
    <div class="row">
        <div class="col">
            <table class="table table-striped table-bordered">
                <thead>
                    <tr
                        class="text-center"
                    >
                        <th>STT</th>
                        <th>Tên hàng</th>
                        <th>SL</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    <Item 
                        v-for="sanpham, index in sanphams"
                        :key="sanpham.id"
                        :sanpham="sanpham"
                        :index="index + 1"  
                    />
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import Item from '~/components/HoaDon/V2/TableProduct/Item.vue';
export default {
    components: {
        Item
    },
    computed: {
        sanphams() {
            return this.$store.state.hd.sanphamChoose;
        },
    },
    data(){
        return {

        }
    }
}
</script>