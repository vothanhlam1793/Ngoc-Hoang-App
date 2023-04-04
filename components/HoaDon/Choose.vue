<template>
    <div class="row">
        <div class="col">
            <div class="form-group">
                    <label for="usr">Tên sản phẩm</label>
                    <input type="text" class="form-control" v-model="search" @keypress="searchSanPham()">
                </div>
                <p>Tìm thấy <strong>{{ sanphams.length }}</strong> sản phẩm phù hợp</p>
                <ul class="list-group">
                    <li class="list-group-item"
                        v-for="sanpham in sanphams"
                    >
                    <div @click="chooseSanPham(sanpham)">
                        <p>{{ sanpham.name }} - {{ sanpham.price }}</p>
                    </div>
                    </li>
                </ul> 
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            search: ""
        }
    },
    methods: {
        searchSanPham(){
            this.$store.commit("sanpham/searchSanPham", this.search);
            this.$store.commit("sanpham/updateStateChoose", "SEARCHING");
        },
        chooseSanPham(sanpham){
            console.log(sanpham);
            this.$store.commit("sanpham/updateSanPhamChoose", sanpham);
            this.$store.commit("sanpham/updateStateChoose", "DONE");
        }
    },
    computed: {
        sanphams(){
            return this.$store.state.sanpham.resultSearchSanPhams;
        }
    }
}
</script>