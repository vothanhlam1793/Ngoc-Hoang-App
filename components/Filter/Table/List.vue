<template>
    <div class="row mt-3">
        <div class="col">
            <div class="row header px-3 text-center">
                <div class="col border p-2">Tên</div>
                <div class="col border p-2">Điện thoại</div>
                <div
                    class="col border p-2"
                    @click="change()"
                >Công nợ</div>
                <div class="col border p-2">Trạng thái</div>
            </div>
            <ItemTable
                v-for="hocsinh in first20Hocsinhs"
                :key="hocsinh.id"
                :hocsinh="hocsinh"
            />
        </div>
    </div>
</template>
<script>
import Item from '~/components/Filter/Table/Item.vue';
import ItemTable from '~/components/Filter/Table/ItemTable.vue';
export default {
    components: {
        Item,
        ItemTable
    },
    data: () => {
        return {
            sortHocsinhs: [],
            sortType: 0
        }
    },
    watch: {
        hocsinhs: {
            handler: function () {
                this.sortHocsinhs = this.hocsinhs.filter(function () {
                    return true;
                });;
            },
            immediate: true
        }
    },
    computed: {
        first20Hocsinhs() {
            return this.sortHocsinhs.slice(0, 60);
        }
    },
    methods: {
        change() {
            this.sortType += 1;
            if (this.sortType % 2 == 0) {
                // Tang dan theo no
                this.sortHocsinhs.sort((a, b) => {
                    return parseInt(a.parent.debt) - parseInt(b.parent.debt);
                })
            } else {
                // Giam dan theo no
                this.sortHocsinhs.sort((a, b) => {
                    return parseInt(b.parent.debt) - parseInt(a.parent.debt);
                })
            }
        }
    },
    props: ['hocsinhs']
}
</script>