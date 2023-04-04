<template>
    <div class="row">
        <div class="col">
            <h4>Tạo học sinh mới</h4>
            <div class="row my-5">
                <div class="col-8">
                    <div class="form-group">
                        <label for="usr">Tên học sinh:</label>
                        <input type="text" class="form-control" id="nameHocSinh"
                        v-model="nameHocSinh"
                        >
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <label for="usr">Ngày tháng năm sinh:</label>
                        <input type="date" class="form-control" id="birthday"
                            v-model="birthday.split('T')[0]"
                        >
                    </div>
                </div>
            </div>
            <div class="row my-2">
                <div class="col">
                    <div class="row">
                        <div class="col-8">
                            <div class="form-group">
                                <label for="usr">Họ và tên bố:</label>
                                <input type="text" class="form-control" :id="`nameDad`"
                                    v-model="nameDad"
                                >
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="usr">Số điện thoại bố:</label>
                                <input type="text" class="form-control" :id="`usrPhoneDad`"
                                    v-model="phoneDad"
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row my-2">
                <div class="col">
                    <div class="row">
                        <div class="col-8">
                            <div class="form-group">
                                <label for="usr">Họ và tên mẹ:</label>
                                <input type="text" class="form-control" :id="`nameMom`"
                                    v-model="nameMom"
                                >
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="usr">Số điện thoại mẹ:</label>
                                <input type="text" class="form-control" :id="`usrPhoneMom`"
                                    v-model="phoneMom"
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row my-2">
                <div class="col text-center">
                    <button
                        class="btn btn-success"
                        @click="createHocSinh()"
                    >Tạo</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data(){
        return {
            name: "", 
            inpSearch: "",
            contentInputSearch: "Nhập số điện thoại phụ huynh",
            sltSearch: "PHONE",
            nameHocSinh: "",
            birthday: (new Date()).toISOString(),
            nameDad: "",
            nameMom: "",
            phoneDad: "",
            phoneMom: ""
        }
    },
    methods: {
        createHocSinh(){
            var client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`
                mutation {
                    createStudentFromFull(
                        nameDad: "${this.nameDad}", 
                        phoneDad: "${this.phoneDad}", 
                        nameMom: "${this.nameMom}", 
                        phoneMom: "${this.phoneMom}", 
                        nameStudent: "${this.nameHocSinh}",
                        birthday: "${this.birthday}"
                    ) {
                        message
                        content
                        data {
                        student {
                            id
                            name
                        }
                        parent {
                            id
                            name
                            phone {
                            number
                            }
                        }
                        }
                    }
                }
                `
            }).then(data => {
                if(data.data.createStudentFromFull.message == "SUCCESS"){
                    location.href="/hocsinh/" + data.data.createStudentFromFull.data.student.id;
                }
            }).catch(err => {
                console.log(err);
            });
        },
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
        console.log(this.birthday);
    }, 
}
</script>