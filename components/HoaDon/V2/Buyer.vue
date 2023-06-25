<template>
    <div class="row">
        <div class="col">
            <div class="d-flex justify-content-between">
                <div>
                    <div v-if="hocsinh.id">
                        <table class="">
                            <tbody>
                                <tr>
                                    <td><b>{{ hocsinh.name }}</b></td>
                                </tr>
                                <tr>
                                    <td>Nợ: </td>
                                    <td class="text-right pr-5">{{ numberWithCommas(hocsinh.parent.debt) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <button v-if="hocsinh.id == undefined" type="button" class="btn btn-primary" data-toggle="modal"
                        data-target="#findHocSinhModal">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                    <button v-else type="button" class="btn btn-warning" data-toggle="modal"
                        data-target="#findHocSinhModal">
                        <i class="fa-sharp fa-solid fa-pen-to-square"></i>
                    </button>

                </div>
            </div>

            <!-- The Modal -->
            <div class="modal" id="findHocSinhModal">
                <div class="modal-dialog">
                    <div class="modal-content">

                        <!-- Modal Header -->
                        <div class="modal-header">
                            <h4 class="modal-title">Tìm học sinh</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>

                        <!-- Modal body -->
                        <div class="modal-body">
                            <Find @update-data="updateHocSinh" />
                        </div>

                        <!-- Modal footer -->
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Find from '~/components/NgoaiGio/Find.vue'
export default {
    components: {
        Find
    },
    methods: {
        numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        updateHocSinh(hocsinh) {
            console.log(hocsinh);
            $("#findHocSinhModal").modal('hide');
            this.hocsinh = hocsinh;
            this.$store.commit("hd/updateHocSinhSelect", this.hocsinh);    
        }
    },
    data() {
        return {
            hocsinh: {

            }
        }
    },
    computed: {

    },
    created() {

    }
}
</script>