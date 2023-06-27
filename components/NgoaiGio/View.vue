<template>
    <div class="row">
        <div class="col">
            <table
                class="table table-bordered table-striped"  
            >
                <thead>
                    <tr>
                        <td></td>
                        <td>Số lượng</td>
                        <td>Xem</td>
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="diemdanh, index in diemdanhs"
                    >   
                    <td>{{ diemdanh.date }}</td>
                    <td>{{ diemdanh.co.length }}</td>
                    <td><a :href="`/vetre/18g_detail?id=${diemdanh.id}`">Xem chi tiết</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data(){
        return {
            diemdanhs: []
        }
    },
    mounted(){
        this.getAllDiemDanhs();
    },
    methods: {
        getAllDiemDanhs(){
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