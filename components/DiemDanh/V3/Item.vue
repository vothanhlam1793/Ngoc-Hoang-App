<template>
    <div :class="'row ' + getColor()">
        <div class="col-6">
            <p>{{ hocsinh.name }}</p>
        </div>
        <div class="col-2">
            <p>{{ hocsinh.status }}</p>
        </div>
        <div class="col-4">
            <div class="text-center">
                <input class="larger" type="radio" id="one" value="1" v-model="result" />
                <label for="one">Có</label> |
                <input class="larger" type="radio" id="one" value="0" v-model="result" />
                <label for="one">Không</label>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            result: "0"
        }
    },
    methods: {
        getColor(){
            if(this.result == "1"){
                return 'alert alert-success'
            } else {
                return 'alert alert-danger'
            }
        }
    },
    watch: {
        result: function(nV, oV){
            this.$store.commit("diemdanh/v3/create/updateResultDiemDanh", {
                hocsinh: this.hocsinh,
                result: nV
            });
            this.$store.dispatch("diemdanh/v3/create/createDiemDanh");
        }
    },
    props: ['hocsinh']
}
</script>