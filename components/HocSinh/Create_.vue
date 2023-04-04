<template>
    <div>
        <div class="row border border-success p-3 rounded m-2">
            <div class="row" v-if="(step == 1) || (step == 2) || (step == 3)">
                <h4>Tìm số điện thoại phụ huynh</h4>
                <div class="input-group mb-3">
                    <input 
                        type="text" 
                        class="form-control" 
                        placeholder="Nhập số điện thoại"
                        v-model="phone"
                    >
                    <div class="input-group-append">
                    <button 
                        class="btn btn-success"
                        @click="checkPhone()"    
                    >Tìm</button>  
                    </div>
                </div>
                <HocSinhStatusCreate :type="type" :content="content"></HocSinhStatusCreate>
            </div>
            <div class="row" v-if="step == 3">
                <h4>Tạo mới phụ huynh</h4>
            </div>
        </div>
        <div class="row border border-primary p-3 rounded m-2" v-if="step == 2">
            <h4>Thông tin học sinh</h4>
            <div>

            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            phone: "",
            findPhone: {},
            type: "",
            content: "",
        }
    },
    methods: {
        changeAlert(type, content){
            this.type = type;
            this.content = content;
        },
        async checkPhone(){
            this.$store.dispatch("apphs/checkPhone", {
                phone: this.phone
            }).then(data => {
                if(data.id){
                    // Co so dien thoai
                    this.$store.commit("apphs/updateStep", 2);
                    this.changeAlert('success', 'Tìm thấy số điện thoại');
                } else {
                    // Khong co so dien thoai
                    this.$store.commit("apphs/updateStep", 3);
                    this.changeAlert('danger', 'Không tìm thấy số điện thoại');
                }
            }).catch(err => {
                console.log(err);
            });
        }
    },
    computed: {
        step(){
            return this.$store.state.apphs.step;
        }
    }
}
</script>