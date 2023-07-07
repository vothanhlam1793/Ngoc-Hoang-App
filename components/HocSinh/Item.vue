<template>
    <tr :class="getColor()">
        <td class="text-center">{{ index }}</td>
        <td>{{ hocsinh.name }} <span v-if="sName.value != ''">({{ sName.value }})</span></td>
        <td class="text-center">
            <div>
                <button type="button" class="btn btn-primary" data-toggle="modal" :data-target="`#viewModal${hocsinh.id}`">
                    <i class="fa-solid fa-eye"></i>
                </button>

                <!-- The Modal -->
                <div class="modal" :id="`viewModal${hocsinh.id}`">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">

                            <!-- Modal Header -->
                            <div class="modal-header">
                                <h4 class="modal-title">{{ hocsinh.name }}</h4>
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                            </div>

                            <!-- Modal body -->
                            <div class="modal-body">
                                <Info :hocsinh="hocsinh" />
                            </div>

                            <!-- Modal footer -->
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Đóng</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </td>
    </tr>
</template>
<script>
import Info from '~/components/HocSinh/Info.vue';
import {getVariableByKey, createVariable, updateVariable} from '~/plugins/variable.js'
export default {
    components: {
        Info
    },
    methods: {
        getColor(){
            if(this.camera.value != undefined){
                if(parseInt(this.camera.value) > 0) {
                    return "table-warning"
                }
            } else {
                return "";
            }
        },
        querySName(){
            var that = this;
            getVariableByKey(this.$apolloProvider.defaultClient, {
                item: "Student",
                idItem: this.hocsinh.id,
                key: "SNAME"
            }).then(variable => {
                that.sName = variable;
            }).catch(err => {
                console.log(err);
            });
        },
        queryCamera(){
            var that = this;
            getVariableByKey(this.$apolloProvider.defaultClient, {
                item: "Student",
                idItem: this.hocsinh.id,
                key: "CAMERA"
            }).then(variable => {
                that.camera = variable;
            }).catch(err => {
                console.log(err);
            });
        }
    },
    mounted(){
        this.querySName();
        this.queryCamera();
    },
    props: ['hocsinh', 'index'],
    data() {
        return {
            sName: {},
            camera: {}
        }
    }
}
</script>