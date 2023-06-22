<template>
    <div class="row">
        <div class="col p-5">
            <h4>Cài đặt ngày nghỉ học</h4>
            <div class="form-inline my-3">
                <label class="mx-3">Chọn năm: </label>
                <select class="form-control" v-model="year">
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                </select>
            </div>
            <table class="table table-bordered table-striped">
                <thead>
                    <tr class="text-center">
                        <th>Tháng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="i in 12"
                        class="text-center"
                    >
                        <td>Tháng {{ String(i).padStart(2, '0') }}/{{ year }}</td>
                        <td>
                            <a
                                class="btn btn-success"
                                :href="`/lichhoc?year=${year}&month=${String(i).padStart(2, '0')}`"
                            >Cài đặt</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            year: "2023",
            month: "01"
        }
    }
}
</script>