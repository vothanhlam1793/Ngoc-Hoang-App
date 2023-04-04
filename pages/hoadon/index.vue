<template>
    <div class="row">
        <div class="col-4">
            <HoaDonCustomer></HoaDonCustomer>
        </div>
        <div class="col-8">
            <HoaDonCreate></HoaDonCreate>
        </div>
    </div>
</template>
<script>
    export default {
        layout: "app",
        watch: {
            hoadon: function(o,n){
                console.log(o);
                location.reload();
            }
        },
        computed: {
            hoadon(){
                return this.$store.state.hd.hoadon;
            }
        },
        mounted(){

        },
        created(){
            this.$store.dispatch("hd/getAllSanPham");
        }
    }
</script>