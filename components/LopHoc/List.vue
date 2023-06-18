<template>
    <div class="row">
        <div class="col">
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Sỉ số</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                     v-for="lophoc in lophocs"
                    >
                        <td>{{ lophoc.name }}</td>
                        <td>{{ lophoc.hocsinhs.length }}</td>
                        <td><button
                            class="btn btn-danger"
                            @click="deleteClass(lophoc)"
                            >x</button></td>
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

        }
    },
    methods: {
        deleteClassId(id){
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            return client.mutate({
                mutation: gql`
                mutation {
                    deleteLopHoc(id: "${id}"){
                        id
                    }
                }
                `
            });
        },
        deleteClass(lophoc){
            if(lophoc.hocsinhs.length == 0){
                this.deleteClassId(lophoc.id)
                    .then(data => {
                        location.reload();
                    }).catch (err => {

                    });
            } else {
                alert("Bạn không được phép xoá lớp nếu còn học sinh");
            }
        }
    },
    computed: {
        lophocs(){
            return this.$store.state.lophoc.lophocs;
        }
    },
    created(){
        this.$store.dispatch("lophoc/getAllLopHoc");
    }
}
</script>