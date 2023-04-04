<template>
    <tr>
        <td>{{ hocsinh.name }}</td>
        <td>
            <div class="text-center">
                <input 
                    @click="btnClick()"
                    class="larger" type="radio" id="one" value="1" v-model="result" 
                />
                <label for="one">Có</label> | 
                <input 
                    @click="btnClick()"
                    class="larger" type="radio" id="one" value="0" v-model="result" 
                />
                <label for="one">Không</label>
            </div>
        </td>
    </tr>
</template>
<script>
    export default {
        data(){
            return {
                result: "0"
            }
        },
        methods: {
            btnClick(){
                this.$store.commit("ndd/updateStateButtonEdit", true);
            }
        },
        watch: {
            result: function(nR, oR){
                if(nR != oR){
                    this.$store.commit("ndd/updateDiemDanhHocSinh", {
                        hocsinh: this.hocsinh,
                        result: this.result
                    })
                }
            },
            monitor: {
                immediate: true,
                handler(nS, oS){
                    if(this.hocsinh.result == "1"){
                        this.result = "1";
                    } else {
                        this.result = "0";
                    }
                    this.$forceUpdate();
                }
            }
        },
        computed: {
            monitor(){
                return this.$store.state.ndd.monitor;
            }
        },
        props: ['hocsinh', 'counter'],
    }
</script>