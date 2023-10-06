<template>
    <td style="padding: 7px;">
        <div v-if="hocphi[code] == undefined"
            style="padding: 0;"
        >
            <b-button
                variant="success"
                @click="openModal"
                size="sm"
            >   
                Thêm
            </b-button>
        </div>
        <div v-else
        style="padding: 0;"
        >
            {{ hocphi[code] }}
            <b-button
                variant="warning"
                @click="openModal('EDIT')"
                size="sm"
            >
                Sửa
            </b-button>
        </div>
        <b-modal
            size="lg"
            :id="`modal-hd-${id}`"
            :title="`Chỉnh ghi chú`"
        >
        <input
            class="form-control"
            v-model="content"
        />
        <template #modal-footer>
            <div class="text-center">
            <button @click="updateContent()" class="btn btn-success">Lưu lại</button>
            <button @click="$bvModal.hide(`modal-hd-${id}`)" class="btn btn-secondary">Đóng</button>
            </div>
        </template>
        </b-modal>
    </td>
</template>
<script>
export default {
    props: ['code', 'hocphi', 'monitor'],
    watch: {
        monitor(n,o){
            this.$forceUpdate();
        }
    },
    data(){
        return {
            id: parseInt(Math.random()*1000000),
            content: ""
        }
    },
    methods: {
        openModal(state){
            if(state == "EDIT"){
                this.content = this.hocphi[this.code];
            }
            this.$bvModal.show(`modal-hd-${this.id}`);
        },
        updateContent(){
            this.$emit('updateNote', {
                code: this.code,
                content: this.content
            });
            this.$bvModal.hide(`modal-hd-${this.id}`);
            this.$forceUpdate();
        }
    }
}
</script>