<template>
    <div class="row">
        <div class="col">
            <h4>Danh sách tổng hợp</h4>
            <div class="row my-3">
                <div class="col">
                    <label>Tháng:</label>
                    <select
                        v-model="month"
                        class="form-control"
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
                    <label>Năm:</label>
                    <select
                        v-model="year"
                        class="form-control"
                    >
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                    </select>
                </div>
            </div>
            <table class="table table-striped table-bordered">
                <thead class="text-center">
                    <tr>
                        <th>Tên</th>
                        <th>Đi học</th>
                        <th>Về trễ</th>
                        <th>Ăn chiều</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="lophoc in lophocs"
                        :key="lophoc.id"
                    >
                        <td>{{ lophoc.name }}</td>
                        <td class="text-center">
                            <a 
                    class="btn btn-info"
                :href="`/xemdiemdanh?type=DIHOCHANGNGAY&idLopHoc=${lophoc.id}&year=${year}&month=${month}`">Đi học</a>
                        </td>
                        <td class="text-center">
                            <a 
                    class="btn btn-danger"
                :href="`/xemdiemdanh?type=VETRE&idLopHoc=${lophoc.id}&year=${year}&month=${month}`">Về trễ</a>
                        </td>
                        <td class="text-center">
                            <a 
                    class="btn btn-warning"
                :href="`/xemdiemdanh?type=DIEMDANH545&idLopHoc=${lophoc.id}&year=${year}&month=${month}`">Ăn chiều</a>
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
    layout: "app",
    data(){
        return {
            lophocs: [],
            year: String((new Date()).getFullYear()),
            month: String((new Date()).getMonth() + 1).padStart(2, '0')
        }
    },
    methods: {
        getAllLopHoc(){
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    allLopHocs {
                        id
                        name
                    }
                }
                `
            }).then(data => {
                that.lophocs = data.data.allLopHocs;
            }).catch(err => {
                console.log(err);
            })
        },
    },
    mounted(){
        this.getAllLopHoc();
    }
}
</script>