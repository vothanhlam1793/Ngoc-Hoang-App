<template>
    <div class="row">
        <div class="col">
            <table class="table table-bordered table-striped">
                <thead>
                    <tr
                        class="text-center"
                    >
                        <th>Tháng</th>
                        <th>Doanh thu</th>
                        <th>Thu tiền</th>
                        <th>Chưa thu</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="code, index in codes"
                        :key="index"
                    >
                        <td
                            class="text-center"
                        >{{ code }}</td>
                        <td
                            class="text-right pr-4"
                        > {{ numberWithCommas(getBaoCao(code).doanhthu) }} </td>
                        <td
                            class="text-right pr-4"
                        >{{ numberWithCommas(getBaoCao(code).thutien) }}</td>
                        <td 
                            class="text-right pr-4"
                        >{{ numberWithCommas(getBaoCao(code).doanhthu -getBaoCao(code).thutien) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import Index from '~/components/Filter/Table/Index.vue';
export default {
    components: {
        Index
    },
    props: {
        oBaoCaos: {
            type: Object,
            default: {}
        },
        codes: {
            type: Array,
            default: []
        }        
    },
    watch: {
        monitor: function(){
            this.$forceUpdate();
        }
    },
    computed: {
        monitor(){
            return this.$store.state.baocao.v1.month.monitor;
        }
    },
    methods: {
        numberWithCommas(x) {
            if(x){
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
                return 0;
            }
        },
        getBaoCao(code){
            if(this.oBaoCaos[code]){
                return this.oBaoCaos[code];
            } else {
                return {
                    doanhthu: 0,
                    thutien: 0
                }
            }
        }
    },
    data(){
        return {

        }
    }
}
</script>