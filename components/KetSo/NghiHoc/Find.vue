<template>
    <div class="row">
        <div class="col">
            <button type="button" class="btn btn-primary" data-toggle="modal"
                data-target="#findHocSinhModal">
                <i class="fa-solid fa-plus"></i>
            </button>

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
            // console.log(hocsinh);
            $("#findHocSinhModal").modal('hide');
            this.hocsinh = hocsinh;
            this.$store.commit("ksnh/updateHocSinh", this.hocsinh);
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