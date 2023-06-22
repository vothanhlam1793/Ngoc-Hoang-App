<template>
    <div class="row p-3 rounded">
        <div class="col">
            <p>Sỉ số: {{ lophoc.hocsinhs.length }}</p>
        </div>
        <div class="col">
            <p>Đi học: {{ dihoc }}</p>
        </div>
        <div class="col">
            <p>Vắng: {{ lophoc.hocsinhs.length - dihoc }}</p>
        </div>
    </div>
</template>
<script>
export default {
    data: ()=> {
        return {
            dihoc: 0,
        }
    },
    watch: {
        monitor: function(n,o){
            this.dihoc = this.lophoc.hocsinhs.filter(function(hocsinh){
                return hocsinh.result == "1";
            }).length;
        }
    },
    computed: {
        lophoc(){
            return this.$store.state.diemdanh.v3.create.lophoc;
        },
        monitor(){
            return this.$store.state.diemdanh.v3.create.monitor;
        }
    }
}
</script>