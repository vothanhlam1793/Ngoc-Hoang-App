<template>
    <div class="modal" :id="`myModal${id}`">
        <div class="modal-dialog">
            <div class="modal-content">

                <!-- Modal Header -->
                <div class="modal-header">
                    <h4 class="modal-title">{{ title }}</h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>

                <!-- Modal body -->
                <div class="modal-body">
                    <input 
                        class="form-control"
                        v-model="dataEdit"
                    />
                </div>

                <!-- Modal footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" @click="saveData()" data-dismiss="modal">Lưu</button>
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Đóng</button>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        value: {

        },
        title: {
            type: String,
            default: 'Chưa có tiêu đề'
        },
        id: {
            type: String
        }
    },
    methods: {
        saveData(){
            $(`#myModal${this.id}`).modal('hide');
            this.$emit('update-data', this.dataEdit);
        }
    },
    watch: {
        value: {
            immediate: true,
            handler: function(nV, oV){
                this.dataEdit = nV;
            }
        }
    },
    data: () => {
        return {
            dataEdit: ""
        }
    },

}
</script>