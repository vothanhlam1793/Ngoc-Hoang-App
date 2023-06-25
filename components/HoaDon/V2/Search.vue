<template>
    <div class="row">
        <div class="col">
            <div class="form-group">
                <input type="text" class="form-control" v-model="cntSearch" @keyup="searchSanPham"
                    placeholder="Nhập tên sản phẩm">
            </div>
            <div class="table-responsive p-3" style="height: 200px; overflow-y: auto;">
                <table class="table table-bordered table-striped">
                    <tbody>
                        <tr v-for="sanpham in filSanPhams">
                            <td>{{ sanpham.name }}</td>
                            <td
                                class="text-right"
                            >{{ numberWithCommas(sanpham.price) }}</td>
                            <td
                                class="text-center" 
                            ><button class="btn btn-success" @click="sanphamchon(sanpham)">
                                    Chọn
                                </button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
function chuyentiengviet(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
export default {
    props: ['sanphams'],
    data() {
        return {
            cntSearch: "",
            filSanPhams: []
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
        sanphamchon(sp){
            // console.log(sp);
            this.$emit('update-data', sp);
        },
        searchSanPham() {
            // console.log(this.filSanPhams, this.cntSearch, this.sanphams);
            var changeSearchReg = chuyentiengviet(this.cntSearch).split(" ").join("[ -w]+");
            var reg = new RegExp(changeSearchReg, "i");
            this.filSanPhams = this.sanphams.filter(function (sanpham) {
                var temp = [sanpham.name];
                return reg.test(chuyentiengviet(temp.join(" ")));
            });
        }
    },
    watch: {
        sanphams: function (n, o) {
            this.searchSanPham();
        }
    },
    // computed: {
    //     sanphams() {
    //         return this.$store.state.hd.sanphams;
    //     }
    // }
}
</script>