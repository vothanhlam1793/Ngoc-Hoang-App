<template>
    <tr>
        <td>{{ hocsinh.name }}</td>
        <td class="text-center">
            <div>
                <button type="button" class="btn btn-primary" data-toggle="modal" :data-target="`#viewModal${hocsinh.id}`">
                Xem thông tin
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
                        <div class="row">
                            <div class="col">
                                <table 
                                    class="table table-bordered text-center"
                                >
                                    <tr
                                        v-for="phone in hocsinh.parent.phone"
                                    >
                                        <td>{{ phone.name }}</td>
                                        <td>{{ phone.number }}</td>
                                        <td>
                                            <a 
                                            :href="`tel:${phone.number}`" 
                                            class="btn btn-info"
                                            target="_blank"
                                            >Gọi</a> | 
                                            <a
                                            :href="`https://zalo.me/${phone.number}`"
                                            class="btn btn-primary"
                                            target="_blank"
                                            >Zalo</a>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Modal footer -->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    </div>

                    </div>
                </div>
                </div>
            </div>
        </td>
    </tr>
</template>
<script>
export default {
    props: ['hocsinh'],
    data(){
        return {

        }
    }
}
</script>