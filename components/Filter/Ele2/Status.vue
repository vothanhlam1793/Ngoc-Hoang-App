<template>
    <div class="row my-3">
        <div class="col">
            <h4>Lọc theo trạng thái</h4>
            <div class="custom-control custom-checkbox"
                v-for="s in state"
            >
                <input type="checkbox" class="custom-control-input" :id="s.value" :value="s.value" v-model="checkedStatus">
                <label class="custom-control-label" :for="s.value">{{ s.title }}</label>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data: () => {
        return {
            checkedStatus: ['DANG_HOC','TAM_NGHI','DANG_KY','NGHI_LUON'],
            state: [
                {
                    value: 'DANG_HOC',
                    title: "Đang học"
                },{
                    value: 'TAM_NGHI',
                    title: "Tạm nghỉ"
                },{
                    value: 'DANG_KY',
                    title: "Đăng ký"
                },{
                    value: 'NGHI_LUON',
                    title: "Nghỉ luôn"
                }]
        }
    },
    watch: {
        checkedStatus: function(n,o){
            this.$store.commit("filter/hocsinh/updateFilterEle2", this.checkedStatus);
        }
    },
    computed: {
        status() {
            return this.$store.state.filter.hocsinh.status;
        }
    }
}
</script>