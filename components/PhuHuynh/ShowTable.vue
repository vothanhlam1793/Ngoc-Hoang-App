<template>
    <div>
        <div class="">
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Mã</th>
                        <th>Tên</th>
                        <th>Điện thoại</th>
                        <th>Nợ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="phuhuynh in phuhuynhs" :id="phuhuynh.id">
                        <td><a :href="'/phuhuynh/' + phuhuynh.id">{{ phuhuynh.code }}</a></td>
                        <td>{{ phuhuynh.name }}</td>
                        <td>{{ phuhuynh.phone[0].number }}</td>
                        <td>{{ phuhuynh.debt }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            <p>Chỗ này là trang page</p>
        </div>
    </div>
</template>
<script>
    export default {
        mounted(){
            this.$store.dispatch('phuhuynh/get_data');
        },
        computed: {
            phuhuynhs(){
                return this.$store.state.phuhuynh.phuhuynhs;
            }
        }
    }
</script>