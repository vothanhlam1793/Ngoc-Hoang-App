<template>
    <div class="row">
        <div class="col">
            <table class="table table-bordered table-striped">
                <thead>
                    <tr class="text-center">
                        <td>Ngày điểm danh</td>
                        <td>GV tăng ca</td>
                        <td>Số lượng bé</td>
                        <td>Xem</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="diemdanh, index in diemdanhs">
                        <td>{{ getDate(diemdanh.date) }}</td>
                        <td>{{ diemdanh.note }}</td>
                        <td class="text-center">{{ diemdanh.co.length }}</td>
                        <td
                        class="text-center"
                        ><a 
                            class="btn btn-success"
                            :href="`/vetre/18g_detail?id=${diemdanh.id}`"><i class="fa-solid fa-eye"></i></a>
                        | | | <button
                            class="btn btn-danger"
                            @click="deleteDiemdanh(diemdanh)"
                            style="width: 3em;"
                        >
                            <b>x</b>
                        </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data() {
        return {
            diemdanhs: []
        }
    },
    mounted() {
        this.getAllDiemDanhs();
    },
    methods: {
        deleteDiemdanh(diemdanh){
            if(confirm(`Bạn đang dự định xoá phiếu điểm danh ngày ${this.getDate(diemdanh.date)}. Đây là hành động không phục hồi được nhé. Tiếp tục?.`)){
                var that = this;
            let client = this.$apolloProvider.defaultClient;
            console.log(`
                    mutation {
                    deleteDiemDanh(id: "${diemdanh.id}"){
                        id
                    }
                    }
                `);
            client.mutate({
                mutation: gql`
                    mutation {
                    deleteDiemDanh(id: "${diemdanh.id}"){
                        id
                    }
                    }
                `
            }).then(data => {
                console.log(data);
                console.log("DONE");
                for(let j = 0; j < that.diemdanhs.length; j++){
                    if(that.diemdanhs[j].id == diemdanh.id){
                        that.diemdanhs.splice(j, 1);
                        break;
                    }
                }
            }).catch(err => {
                console.log(err);
                // alert(err);
            })
            }
        },
        getDate(inputDate) {
            const date = new Date(inputDate);

            // Lấy ngày, tháng, năm
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();

            // Định dạng lại theo định dạng "dd/mm/yyyy"
            const formattedDate = `${day}/${month}/${year}`;
            return formattedDate;
        },
        getAllDiemDanhs() {
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                allDiemDanhs(where: {
                    type: "VETRE2"
                }) {
                    id
                    date
                    co {
                    id
                    name
                    lophoc {
                        id
                        name
                    }
                    status
                    }
                    note
                }
                }
                `
            }).then(data => {
                console.log(data);
                that.diemdanhs = data.data.allDiemDanhs;
            }).catch(err => {
                console.log(err);
            });
        }
    }
}
</script>