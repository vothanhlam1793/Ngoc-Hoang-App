<template>
    <tr>
        <td style="width: 5%;" class="text-center">{{ index }}</td>
        <td style="width: 50%;" >{{ sanpham.name }}</td>
        <td style="width: 10%;"  class="text-center"  @dblclick="editWithModal(price, 'amount')">{{ numberWithCommas(amount) }}
            <ModalEditInput 
                :id="`amount${sanpham.id}`"
                :value="amount"
                @update-data="updateAmount"
            />
        </td>
        <td style="width: 15%;"  class="text-right pl-3" @dblclick="editWithModal(price, 'price')">{{ numberWithCommas(price) }}
            <ModalEditInput 
                :id="`price${sanpham.id}`"
                :value="price"
                @update-data="updatePrice"
            />
        </td>
        <td style="width: 20%;"  class="text-right pl-3">{{ numberWithCommas(amount * price) }}</td>
    </tr>
</template>
<script>
import ModalEditInput from '~/components/Support/ModalEditInput.vue';
export default {
    props: ['sanpham', 'index'],
    components: {
        ModalEditInput
    },
    methods: {
        numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        editWithModal(value, name){
            console.log(this.sanpham.id, value, name);
            console.log(`myModal${name}${this.sanpham.id}`);
            $(`#myModal${name}${this.sanpham.id}`).modal('show');
        },
        updatePrice(price){
            this.price = price;
            this.$store.commit("hd/updateElement", {
                sanpham: this.sanpham,
                amount: this.amount,
                price: this.price,
            })
        },
        updateAmount(amount){
            this.amount = amount;
            this.$store.commit("hd/updateElement", {
                sanpham: this.sanpham,
                amount: this.amount,
                price: this.price,
            })
        }
    },
    data(){
        return {
            amount: 1,
            price: 0
        }
    },
    created(){
        this.price = this.sanpham.price;
    },
}
</script>