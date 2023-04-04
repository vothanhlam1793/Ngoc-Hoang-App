<template>
    <div class="row">
        <div class="col">
            <h4>Tạo học sinh mới</h4>
            <div class="row border">
                <div class="col border">
                    <h5>* Thông tin phụ huynh</h5>
                    <div class="row my-3"   >
                        <div class="col">
                            <div class="input-group mb-3">
                                <div class="input-group-append">
                                    <select 
                                        class="form-control"
                                        v-model="sltSearch"
                                        @change="changeContent()"
                                    >
                                        <option value="PHONE">Số điện thoại</option>
                                        <option value="NAME_HOCSINH">Tên học sinh</option>
                                    </select>
                                </div>
                                <input type="text" class="form-control" :placeholder="contentInputSearch"
                                    v-model="inpSearch"
                                >
                                <div class="input-group-append">
                                    <button 
                                        class="btn btn-success" 
                                        type="submit"
                                        @click="findParent()"    
                                    >Tìm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <h5>* Kết quả</h5>
                            <div class="row"
                                v-if="resultSearch.message == 'FOUND'"
                            >
                                <div class="col">
                                    <table class="table table-bordered tabled-striped">
                                        <thead>
                                            <tr>
                                                <td>Điện thoại</td>
                                                <td>Học sinh</td>
                                                <td>Hành động</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-for="parent in resultSearch.data"
                                            >
                                                <td>
                                                    <p>
                                                        <span
                                                        v-for="phone in parent.phone"
                                                        >
                                                        {{ phone.number }}
                                                        <br>
                                                        </span>
                                                    </p> 
                                                </td>
                                                <td>
                                                    <p>
                                                        <span
                                                        v-for="hocsinh in parent.hocsinhs"
                                                        >
                                                        {{ hocsinh.name }} - {{ hocsinh.lophoc.name }}
                                                        <br>
                                                        </span>
                                                    </p>  
                                                </td>
                                                <td>
                                                    <button
                                                        class="btn btn-warning"
                                                    >Sử dụng</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="row"
                                v-if="resultSearch.message == 'NOT_FOUND'"
                            > 
                                <div class="col">
                                    <p>Không tìm thấy</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col border">
                    <h5>Thông tin học sinh</h5>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            name: "", 
            inpSearch: "",
            contentInputSearch: "Nhập số điện thoại phụ huynh",
            sltSearch: "PHONE"
        }
    },
    methods: {
        findParent(){
            if(this.sltSearch == "PHONE"){
                this.$store.dispatch("phuhuynh/searchPhuHuynhWithPhone", this.inpSearch);
            }
            if(this.sltSearch == "NAME_HOCSINH"){
                this.$store.dispatch("phuhuynh/searchPhuHuynhWithNameHocSinh", this.inpSearch);
            }

        },
        changeContent(){
            this.inpSearch = "";
            switch(this.sltSearch){
                case "PHONE": {
                    this.contentInputSearch = "Nhập số điện thoại phụ huynh"
                }
                break;
                case "NAME_HOCSINH": {
                    this.contentInputSearch = "Nhập tên học sinh"
                }
                break;
            }
        }
    },
    watch: {
        stateSearchPhone: function(newState, oldState){
            console.log(this.resultSearch)
        }
    },
    computed: {
        lophocs(){
            return this.$store.state.apphs.lophocs;
        },
        stateSearchPhone(){
            return this.$store.state.phuhuynh.stateSearchPhuHuynhWithPhone;
        },
        resultSearch(){
            return this.$store.state.phuhuynh.resultSearchPhuHuynhWithPhone;
        }
    },
    mounted(){
        this.$store.dispatch("apphs/getLophoc");
    }, 
}
</script>