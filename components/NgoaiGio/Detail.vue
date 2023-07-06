<template>
    <div class="row">
        <div class="col">
            <div v-if="diemdanh.id">
                <h1>Về trễ: {{ getDate(diemdanh.date) }}</h1>
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr
                            class="text-center"
                        >
                            <td>STT</td>
                            <td>Tên</td>
                            <td>Lớp</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="hocsinh, index in diemdanh.co"
                        >
                            <td
                                class="text-center"
                                style="width: 15%;"
                            >{{ index + 1 }}</td>
                            <td
                            style="width: 65%;"
                            >{{ hocsinh.name }}</td>
                            <td
                            style="width: 20%;"
                            class="text-center"
                            >{{ hocsinh.lophoc.name }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
// import Index from '~/components/Filter/Table/Index.vue';
export default {
    props: ['diemdanh'],
    data(){
        return {

        }
    },
    methods: {
        getDate(d){
            let isoString = d;
            let isoDate = new Date(isoString);

            let day = isoDate.getDate();
            let month = isoDate.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1
            let year = isoDate.getFullYear();

            // Đảm bảo định dạng dd/mm/yyyy
            let formattedDate = (day < 10 ? "0" : "") + day + "/" + (month < 10 ? "0" : "") + month + "/" + year;

            // console.log(formattedDate); // Kết quả: 27/06/2023
            return formattedDate;
        }
    }
}
</script>