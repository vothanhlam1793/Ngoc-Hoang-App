<template>
    <div class="row">
        <div class="col">
            <div class="row my-3">
                <div class="col">
                    <select class="selectpicker"  data-live-search="true"
                        v-model="hocsinh"
                        @change="selectHocSinh()"
                    >
                        <option
                            v-for="hocsinh in hocsinhs"
                            :key="hocsinh.id"
                            :data-tokens="chuyentiengviet(hocsinh.name)"
                            :value="hocsinh"
                        >{{ hocsinh.name }}</option>
                    </select>
                </div>
            </div>
            <br>
            <div class="row my-3" v-if="hocsinh.id">
                <div class="col">
                    <h2>{{ hocsinh.name }}</h2>
                    <table v-if="hocsinh.parent.id"
                        class="table table-bordered table-striped"
                    >
                        <tbody>
                            <tr>
                                <td>Điện thoại</td>
                                <td>
                                    <ul>
                                        <li
                                            v-for="phone in hocsinh.parent.phone"
                                        >{{ phone.number }}</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td>Nợ</td>
                                <td>{{ numberWithCommas(hocsinh.parent.debt) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            hocsinh: {

            }
        }
    },
    methods: {
        selectHocSinh(){
            this.$store.commit("hd/updateHocSinhSelect", this.hocsinh);    
        },
        chuyentiengviet(str) {
            if(str == undefined){
                return "";
            }
            return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
        },
        numberWithCommas(x) {
            if(x){
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
                return 0;
            }
        },
    },
    watch: {
        hocsinhs: {
            deep: true,
            handler(n,o){
                setTimeout(function(){
                    jQuery(".selectpicker").selectpicker("refresh");
                }, 0);
                this.$forceUpdate();
            }
        }
    },
    computed: {
        hocsinhs(){
            return this.$store.state.hd.hocsinhs;
        }
    },
    created(){
        if(typeof window !== undefined){
            this.$store.dispatch("hd/getHocSinhs");
        }
    },
    mounted(){
        $('#my-select').selectpicker();
    }
}
</script>