<template>
    <div class="row">
        <div class="col-8">
            <p>{{ hocsinh.name }}</p>
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
    data() {
        return {
            result: "0"
        }
    },
    methods: {
        
    },
    watch: {
        result: function (nR, oR) {
            if (nR != oR) {
                this.$store.commit("ndd/updateDiemDanhHocSinh", {
                    hocsinh: this.hocsinh,
                    result: this.result
                });
                this.$store.dispatch('ndd/createPhieuDiemDanhV2');
            }
        },
    },
    props: ['hocsinh']
}
</script>