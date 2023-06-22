<template>
    <div class="row">
        <div class="col">
            <h4>Tìm theo tên</h4>
            <input 
                class="form-control"
                v-model="findByName"
                @keyup="change()"
            />
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            findByName: ""
        }
    },
    methods: {
        change(){
            console.log(this.findByName);
            this.$store.commit('debt/phuhuynh/updateFindByName', this.findByName);
        }
    }
}
</script>