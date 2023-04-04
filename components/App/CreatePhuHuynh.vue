<template>
    <div class="m-3 border border-success rounded p-2">
        <div v-if="state != 'DONE'">
            <h4>Tạo mới phụ huynh</h4>
            <div class="form-group my-3">
                <label for="usr">Tên phụ huynh:</label>
                <input type="text" class="form-control" v-model="name">
            </div>
            <div class="form-group my-3">
                <label for="pwd">Số điện thoại</label>
                <input type="text" class="form-control" v-model="phone" @keyup="searchPhone()">
            </div>
            <div class="row" v-if="phone.length == 10">
                <div class="alert alert-danger" v-if="statePhone == 'FINDED_PHONE'">
                    Số điện thoại đã được đăng ký
                </div>
                <div class="alert alert-info" v-if="statePhone == 'NO_FINDED_PHONE'">
                    Có thể sử dụng số điện thoại này
                </div>
                <div class="alert alert-success" v-if="state == 'DONE'">
                    Đã tạo thành công
                </div>
                <div class="alert alert-warning" v-if="state == 'CREATING'">
                    Đang tạo dữ liệu ...
                </div>
            </div>
            <div class="text-center my-2">
                <button 
                v-if="statePhone == 'FINDED_PHONE'"
                type="submit" class="btn btn-warning" @click="syncPhuHuynh()">Đồng bộ</button> 
                <button 
                v-if="statePhone == 'NO_FINDED_PHONE'"
                type="submit" class="btn btn-primary" @click="createPhuHuynh()">Tạo mới</button> 
            </div>
        </div>
        <div v-if="state == 'DONE'">
            <p>{{ parent.name }}</p>
            <p>{{ parent.phone[0].number }}</p>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                name: "",
                phone: ""
            }
        },
        methods: {
            searchPhone(){
                if(this.phone.length < 10){
                    return;
                }
                this.$store.dispatch("createphuhuynh/checkPhone", {phone: this.phone});
            },
            createPhuHuynh(){
                if(this.phone.length < 10){
                    alert("Số điện thoại phải đủ 10 số");
                    return;
                }
                this.$store.dispatch("createphuhuynh/create", {
                    name: this.name,
                    phone: this.phone
                });
            },
            syncPhuHuynh(){
                this.$store.commit("createphuhuynh/sync");   
            }
        },
        computed: {
            state(){
                return this.$store.state.createphuhuynh.state;
            },
            statePhone(){
                return this.$store.state.createphuhuynh.stateSearchPhone;
            },
            parent(){
                return this.$store.state.createphuhuynh.parent;
            }
        }
    }
</script>