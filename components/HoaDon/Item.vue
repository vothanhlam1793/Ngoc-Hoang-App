<template>
    <tr>
        <td>
            <button
                @click="deleteItem()"
            >x</button>
        </td>
        <td>{{ sanpham.name }}</td>
        <td><input
                class="form-control"
                type="number"
                v-model="amount"
                min="0"
                @change="changedItem()"
            ></td>
        <td><input
                class="form-control"
                type="number"
                v-model="price"
                min="0"
                @change="changedItem()"
            ></td>
        <td>{{ price*amount }}</td>
    </tr>
</template>
<script>
export default {
    data(){
        return {
            amount: 1,
            price: 0
        }
    },
    methods: {
        changedItem(){
            console.log("hihi");
            this.$store.commit("hd/updateElement", {
                sanpham: this.sanpham,
                amount: this.amount,
                price: this.price,
            })
        },
        deleteItem(){
            this.$store.commit("hd/removeSanPhamChoose", this.sanpham);
        }
    },
    created(){
        this.price = this.sanpham.price;
    },
    props: ["sanpham"]
}
</script>