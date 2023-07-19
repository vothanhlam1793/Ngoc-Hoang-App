<template>
    <div>
        <button type="button" data-toggle="modal" :data-target="`#myModal${hocsinh.id}`"
            class="btn btn-info"
        >
                Xem điểm danh
            </button>
            <div class="modal" :id="`myModal${hocsinh.id}`">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">

                        <!-- Modal Header -->
                        <div class="modal-header">
                            <h4 class="modal-title">{{ hocsinh.name }} - Tháng {{ month }} / {{ year }}</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>

                        <!-- Modal body -->
                        <div class="modal-body">
                            <div class="">
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col">
                                            <select
                                                class="form-control"
                                                v-model="month"
                                            > 
                                                <option value="01">Tháng 1</option>
                                                <option value="02">Tháng 2</option>
                                                <option value="03">Tháng 3</option>
                                                <option value="04">Tháng 4</option>
                                                <option value="05">Tháng 5</option>
                                                <option value="06">Tháng 6</option>
                                                <option value="07">Tháng 7</option>
                                                <option value="08">Tháng 8</option>
                                                <option value="09">Tháng 9</option>
                                                <option value="10">Tháng 10</option>
                                                <option value="11">Tháng 11</option>
                                                <option value="12">Tháng 12</option>
                                            </select>
                                        </div>
                                        <div class="col">
                                            <select
                                                class="form-control"
                                                v-model="year"
                                            > 
                                                <option>2023</option>

                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <Show
                                    :hocsinh="item" 
                                    type="DIHOCHANGNGAY" 
                                    :year="year" 
                                    :month="month" 
                                />
                            </div>
                        </div>

                        <!-- Modal footer -->
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Đóng</button>
                        </div>

                    </div>
                </div>
            </div>

    </div>
</template>
<script>
import { BButton } from 'bootstrap-vue';
import Show from '~/components/KetSo/ShowDiemDanh.vue';
// import { BButton, BModal } from 'bootstrap-vue'
export default {
    props: ['hocsinh'],
    components: {
        Show,
        "b-button": BButton
    },
    data(){
        return {
            item: {},
            month: "06",
            year: "2023"
        }
    },
    created(){
        this.item.hocsinh = this.hocsinh;
    }
}
</script>