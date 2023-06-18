<template>
    <tr>
        <td>{{ item.hocsinh.name }}</td>
        <td class="text-right" >{{ numberWithCommas(item.data.total) }}</td>
        <td class="text-right" >{{ numberWithCommas(item.data.hocphi) }}</td>
        <td class="text-right" >{{ numberWithCommas(item.data.csvc) }}</td>
        <td class="text-right" >{{ numberWithCommas(item.data.camera) }}</td>
        <td class="text-right" >{{ numberWithCommas(item.data.totalHoaDon) }}</td>
        <td class="text-right" >{{ numberWithCommas(item.data.ngoaigio) }}</td>
        <td class="text-right" >{{ numberWithCommas(item.data.an545) }}</td>
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
        numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    },
    created(){
        console.log(this.item);
    },
    props: ['item']
}
</script>