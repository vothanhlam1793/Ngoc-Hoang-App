<template>
    <tr style="width: 10%;"
        :class="getColor()"
    >
        <td
            class="text-center p-2"
        >{{ index + 1 }}</td>
        <td style="width: 55%;" class="pl-2">{{ hocsinh.name }}</td>
        <td style="width: 35%;" class="p-2">
            <div class="text-center">
                <input 
                    @click="btnClick()"
                    class="" type="radio" id="one" value="1" v-model="result" 
                    v-if="hocsinh.status != 'TAM_NGHI'"
                />
                <input 
                    @click="btnClick()"
                    class="" type="radio" id="one" value="1" v-model="result" 
                    disabled
                    v-else
                />
                <label for="one">C</label> | 
                <input 
                @click="btnClick()"
                    class="" type="radio" id="one" value="0" v-model="result" 
                    v-if="hocsinh.status != 'TAM_NGHI'"
                />
                <input 
                @click="btnClick()"
                    class="" type="radio" id="one" value="0" v-model="result"  
                    disabled
                    v-else
                />
                <label for="one">K</label>
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
            getColor(){
                if(this.hocsinh.status == "TAM_NGHI"){
                    // this.result = "0";
                    return "table-secondary"
                }
                if(this.result == "0"){
                    return "table-danger"
                } else {
                    return "table-success"
                }
            },
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
        props: ['hocsinh', 'counter', 'index'],
    }
</script>