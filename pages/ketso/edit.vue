<template>
    <div class="row p-2" style="height: 600px;">
        <div class="col-4 p-4 border border-primary rounded h-100">
            <Student
                @update-item="updateItem"
            ></Student>
        </div>
        <div class="col-8 p-4 border border-success rounded h-100">
            <Show
                v-if="item.id"
                :item="item"
                @update-state="updateStateShow"
            ></Show>
        </div>
    </div>
</template>
<script>
import Student from '~/components/ItemKetSo/Student.vue';
import Show from '~/components/ItemKetSo/Show.vue';
export default {
    layout: "app",
    components: {
        Show, Student
    },
    data(){
        return {
            item: {},
            state: "IDLE"
        }
    },
    methods: {
        updateItem(item){
            switch(this.state){
                case "IDLE": {
                    this.item = item;
                } break;
                case "EDIT": {
                    alert("Bạn cần lưu thay đổi trước khi hành động");
                } break;
            }
        },
        updateStateShow(state){
            this.state = state;
        }
    }
}
</script>