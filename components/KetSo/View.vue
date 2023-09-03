<template>
    <tr>
        <td>{{ item.hocsinh.name }}</td>
        <td class="text-right" >{{ numberWithCommas(item.data.total) }}</td>
        <td class="text-right" >{{ numberWithCommas(item.data.hocphi) }}</td>
        <td class="text-right" >{{ numberWithCommas(item.data.csvc) }}</td>
        <td class="text-right" >{{ numberWithCommas(item.data.camera) }}</td>
        <!-- <td class="text-right" >{{ numberWithCommas(item.data.totalHoaDon) }}</td> -->
        <td class="text-right" >{{ numberWithCommas(item.data.ngoaigio) }}</td>
        <td class="text-right" >{{ numberWithCommas(item.data.an545) }}</td>
        <td class="text-right" >{{ numberWithCommas(item.data.phimorong) }} 
            <b-button 
            :key="`btn-${item.id}`"
            @click="showModal(`md-${item.id}`)"
            >v</b-button>
            <b-modal 
            :key="`md-${item.id}`"
            :id="`md-${item.id}`" 
            :title="item.hocsinh.name" ok-only>
                <table class="table table-bordered table-striped">
                    <tr>
                        <th>Phí</th>
                        <th>Tiền</th>
                    </tr>
                    <tr v-for="key in Object.keys(item.data.detailPhiMoRong)" :class="getClass(item.data.detailPhiMoRong[key].checked)">
                        <td>{{ item.data.detailPhiMoRong[key].label }}</td>
                        <td class="text-right">
                            {{ numberWithCommas(item.data.detailPhiMoRong[key].value) }}
                        </td>
                    </tr>
                </table>
            </b-modal>
        </td>
        <td class="text-right" >{{ numberWithCommas(item.data.khac) }}</td>
        <td>{{ item.data.note }}</td>
        <td class="text-center" >{{ numberWithCommas(item.data.ngaynghi) }}</td>
        <td class="text-right" >{{ numberWithCommas(item.data.thanhtiennghi) }}</td>
    </tr>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    methods: {
        getClass(checked){
            if(checked){
                return "table-success"
            } else {
                return ""
            }
        },
        showModal(id){
            this.$bvModal.show(id);
        },
        numberWithCommas(x) {
            if(x){
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
                return "0";
            }
        }
    },
    created(){
        console.log(this.item);
    },
    props: ['item']
}
</script>