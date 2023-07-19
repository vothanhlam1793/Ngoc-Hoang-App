<template>
    <div>
        <h1 
            @dblclick="editName()"
        >{{ name }}</h1>
        <BModal id="mEditName"
        hide-footer
        >
            <template #modal-title>
                <p>Sửa tên: {{ hocsinh.name }}</p>
            </template>
            <div class="">
                <BFormInput type="text" v-model="name"
                    ></BFormInput>
            </div>
            <div class="my-3 text-center">
                <BButton 
                    variant="success"
                    @click="save()"
                >
                    Lưu
                </BButton>
            </div>
        </BModal>
    </div>
</template>
<script>
import Vue from 'vue'
import { BModal, BButton, BFormInput } from 'bootstrap-vue'
import { ToastPlugin } from 'bootstrap-vue'
Vue.use(ToastPlugin)
import {saveNameStudent} from '~/plugins/student.js';
export default {
    props: ['hocsinh'],
    components: {
        BModal, BButton, BFormInput
    },
    data(){
        return {
            name: ""
        }
    },
    methods: {
        editName(){
            this.$bvModal.show("mEditName");
        },
        save(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            saveNameStudent(client, {
                id: this.hocsinh.id,
                name: this.name
            }).then(data => {
                that.$bvModal.hide("mEditName");
                that.$bvToast.toast(`Thay đổi tên ${that.name} thành công`, {
                    title: `Cập nhật thành công`,
                    variant: "success",
                    solid: true
                });
            }).catch(err => {
                console.log(err);
                that.$bvModal.hide("mEditName");
            });
        },
    },
    mounted(){
        this.name = this.$props.hocsinh.name;
    }
}
</script>