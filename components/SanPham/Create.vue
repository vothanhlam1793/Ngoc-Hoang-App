<template>
    <div class="row p-2">
        <div class="col">
            <div class="row">
                <div class="col" v-if="stateCreate=='IDLE'">
                    <div class="form-group">
                        <label for="usr">Tên sản phẩm</label>
                        <input type="text" class="form-control" v-model="name">
                    </div>
                    <div class="form-group">
                        <label for="usr">Giá bán</label>
                        <input type="number" class="form-control" v-model="price">
                    </div>
                    <div class="text-center">
                        <button class="btn btn-success" @click="createSanPham()">Tạo</button>
                    </div>
                </div>
                <div class="col" v-if="stateCreate=='DONE'">
                    <h4>Sản phẩm mới tạo</h4>
                    <p><strong>{{ sanphamCreated.name }}</strong></p>
                    <p>Giá: <strong>{{ sanphamCreated.price }}</strong></p>
                    <div class="text-center">
                        <button class="btn btn-primary" @click="continueCreate()">Tiếp tục tạo sản phẩm</button>
                    </div>
                </div>
            </div>
            <div v-if="stateCreate == 'CREATING'" class="alert alert-warning">
                <p>Đang tạo sản phẩm</p>
            </div>
            <div v-if="stateCreate == 'DONE'" class="alert alert-warning">
                <p>Tạo sản phẩm thành công</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            name: "",
            price: 1000
        }
    },
    methods: {
        createSanPham(){
            this.$store.dispatch("sanpham/createSanPham", {
                name: this.name,
                price: this.price
            })
        },
        continueCreate(){
            this.$store.commit("sanpham/updateCreateState", "IDLE");
            this.name = "";
            this.price = 1000;
        }
    },
    watch: {
        stateCreate: function(newState, oldState){
            
        },
    },
    computed: {
        stateCreate(){
            return this.$store.state.sanpham.createState;
        },
        sanphamCreated(){
            return this.$store.state.sanpham.sanphamCreated;
        }
    }
}
</script>