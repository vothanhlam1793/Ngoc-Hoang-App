<template>
    <div>
        <div class="form-group my-3">
            <label for="usr">Tên phụ huynh:</label>
            <input type="text" class="form-control" v-model="name">
        </div>
        <div class="form-group my-3">
            <label for="pwd">Số điện thoại</label>
            <input type="text" class="form-control" v-model="phone">
        </div>
        <div class="text-center my-2">
            <button type="submit" class="btn btn-primary" @click="createPhuHuynh()">Tạo</button> 
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
const FILTER_PHONE = gql`
    query filterPhone($phone: String){
        allPhones (where: { number: $phone}){
           id
           number
        }
    }
`
export default {
    data(){
        return {
            name: "",
            phone: ""
        }
    },
    methods: {
        async checkPhoneAvailable(){
            var client = this.$apolloProvider.defaultClient;
            var data = await client.query({
                query: FILTER_PHONE,
                variables: {
                    phone: this.phone
                }
            })
            console.log(data);
            if(data.data.allPhones.length > 0){
                return false;
            } else {
                return true;
            }
        },
        async createPhuHuynh(){
            if(await this.checkPhoneAvailable()){
                this.$store.dispatch("phuhuynh/create", {
                    name: this.name,
                    phone: this.phone
                }).then((ph)=>{
                    location.href = "/phuhuynh/" + ph.data.createParent.id;
                }).catch((err) => {
                    console.log(err);
                })
            } else {
                alert("Số điện thoại đã được đăng ký");
            }
            
        }    
    }
}
</script>