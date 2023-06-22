<template>
    <div class="row">
        <div class="col">
            <Item 
                v-for="phuhuynh in phuhuynhs"
                :key="phuhuynh.id"
                :phuhuynh="phuhuynh"
            />
        </div>
    </div>
</template>
<script>
import Item from '~/components/V2/PhuHuynh/List/Item.vue';
export default {
    components: {
        Item
    },
    data(){
        return {

        }
    },
    props: ['phuhuynhs']
}
</script>