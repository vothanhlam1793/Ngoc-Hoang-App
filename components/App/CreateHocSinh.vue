<template>
    <div class="">
        <div class="form-group my-3">
            <label for="usr">Tên học sinh:</label>
            <input type="text" class="form-control" v-model="name">
        </div>
        <div class="form-group my-3">
            <label for="pwd">Lớp học</label>
            <select class="form-control" v-model="sLophoc">
                <option v-for="lophoc in lophocs" :key="lophoc.id" :value="lophoc">{{ lophoc.name }}</option>
            </select>
        </div>
        <div class="text-center my-2">
            <button class="btn btn-success" @click="createHocSinh()">Tạo học sinh</button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            name: "",
            sLophoc: {}
        }
    },
    methods: {
        createHocSinh(){
            if(this.phuhuynh.id){
                this.$store.dispatch("createhocsinh/create", {
                    name: this.name,
                    lophoc: this.sLophoc
                })
            } else {
                alert("Cần cập nhật phụ huynh");
            }

        }
    },  
    mounted(){
        this.$store.dispatch("createhocsinh/getLopHoc");
    },
    computed: {
        lophocs(){
            return this.$store.state.createhocsinh.lophocs;
        },
        phuhuynh(){
            return this.$store.state.createhocsinh.phuhuynh;
        }
    }
}
</script>