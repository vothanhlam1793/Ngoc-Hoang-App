<template>
    <div class="row">
        <div class="col">
            <h4>Tạo học sinh mới</h4>
            <div class="row my-5">
                <div class="col-8">
                    <div class="row">
                        <div class="col-9">
                            <div class="form-group">
                                <label for="usr">Tên học sinh:</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="nameHocSinh"
                                    v-model="nameHocSinh"
                                >
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="form-group">
                                <label for="usr">Biệt danh:</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="nameHocSinh"
                                    v-model="sName"
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-group">
                        <DatePicker
                            @update-data="updateBirthDay"
                            title="Ngày tháng năm sinh: "
                        ></DatePicker>
                        <!-- <input
                            type="date"
                            class="form-control"
                            id="birthday"
                            v-model="birthday.split('T')[0]"
                        > -->
                    </div>
                </div>
            </div>
            <div class="row my-2">
                <div class="col">
                    <div class="row">
                        <div class="col-8">
                            <div class="form-group">
                                <label for="usr">Họ và tên bố:</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    :id="`nameDad`"
                                    v-model="nameDad"
                                >
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="usr">Số điện thoại bố:</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    :id="`usrPhoneDad`"
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
                                <input
                                    type="text"
                                    class="form-control"
                                    :id="`nameMom`"
                                    v-model="nameMom"
                                >
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="usr">Số điện thoại mẹ:</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    :id="`usrPhoneMom`"
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
import moment from 'moment'
import gql from 'graphql-tag'
import { createVariable } from '~/plugins/variable.js'
export default {
    data() {
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
            phoneMom: "",
            sName: ""
        }
    },
    methods: {
        updateBirthDay(date){
            this.birthday = moment(date).toISOString();
            console.log(this.birthday);
        },
        createHocSinh() {
            const cleanNameStudent = (this.nameHocSinh || '').trim();
            const cleanNameDad = (this.nameDad || '').trim();
            const cleanNameMom = (this.nameMom || '').trim();
            const cleanPhoneDad = (this.phoneDad || '').replace(/\D/g, '');
            const cleanPhoneMom = (this.phoneMom || '').replace(/\D/g, '');

            if (cleanNameStudent.length === 0) {
                alert("Vui lòng nhập họ và tên học sinh");
                return;
            }
            if (cleanNameDad.length === 0 && cleanNameMom.length === 0) {
                alert("Vui lòng nhập ít nhất tên của Bố hoặc Mẹ");
                return;
            }
            if (cleanPhoneDad.length < 9 && cleanPhoneMom.length < 9) {
                alert("Vui lòng nhập ít nhất một số điện thoại phụ huynh hợp lệ (tối thiểu 9 số)");
                return;
            }
            var client = this.$apolloProvider.defaultClient;
            var that = this;

            client.mutate({
                mutation: gql`
                mutation CreateStudentFull(
                    $nameDad: String,
                    $phoneDad: String,
                    $nameMom: String,
                    $phoneMom: String,
                    $nameStudent: String,
                    $birthday: String
                ) {
                    createStudentFromFull(
                        nameDad: $nameDad, 
                        phoneDad: $phoneDad, 
                        nameMom: $nameMom, 
                        phoneMom: $phoneMom, 
                        nameStudent: $nameStudent,
                        birthday: $birthday
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
                                    id
                                    number
                                    name
                                }
                            }
                        }
                    }
                }
                `,
                variables: {
                    nameDad: cleanNameDad,
                    phoneDad: cleanPhoneDad,
                    nameMom: cleanNameMom,
                    phoneMom: cleanPhoneMom,
                    nameStudent: cleanNameStudent,
                    birthday: this.birthday
                }
            }).then(data => {
                if (data.data.createStudentFromFull.message == "SUCCESS") {
                    const studentId = data.data.createStudentFromFull.data.student.id;
                    if (that.sName && that.sName.trim() !== "") {
                        createVariable(client, {
                            item: "Student",
                            idItem: studentId,
                            key: "SNAME",
                            value: that.sName.trim()
                        }).finally(() => {
                            location.href = "/hocsinh/" + studentId;
                        });
                    } else {
                        location.href = "/hocsinh/" + studentId;
                    }
                } else {
                    alert("Có lỗi xảy ra: " + (data.data.createStudentFromFull.content || data.data.createStudentFromFull.message));
                }
            }).catch(err => {
                console.error(err);
                alert("Lỗi kết nối khi tạo học sinh!");
            });
        },
        findParent() {
            if (this.sltSearch == "PHONE") {
                this.$store.dispatch("phuhuynh/searchPhuHuynhWithPhone", this.inpSearch);
            }
            if (this.sltSearch == "NAME_HOCSINH") {
                this.$store.dispatch("phuhuynh/searchPhuHuynhWithNameHocSinh", this.inpSearch);
            }

        },
        changeContent() {
            this.inpSearch = "";
            switch (this.sltSearch) {
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
        birthday() {
            console.log(this);
        },
        stateSearchPhone: function (newState, oldState) {
            console.log(this.resultSearch)
        }
    },
    computed: {
        lophocs() {
            return this.$store.state.apphs.lophocs;
        },
        stateSearchPhone() {
            return this.$store.state.phuhuynh.stateSearchPhuHuynhWithPhone;
        },
        resultSearch() {
            return this.$store.state.phuhuynh.resultSearchPhuHuynhWithPhone;
        }
    },
    mounted() {
        this.$store.dispatch("apphs/getLophoc");
        console.log(this.birthday);
    },
}
</script>