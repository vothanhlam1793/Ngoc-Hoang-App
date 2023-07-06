<template>
    <div class="row m-2 p-2">
        <div class="col">
            <table class="table table-bordered text-center">
                <thead>
                    <tr>
                        <!-- <td></td> -->
                        <td>SĐT</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="phone, index in hocsinh.parent.phone">
                    <!-- <td style="width: 10%;">{{ index + 1}}</td> -->
                    <td style="width: 50%;">{{ phone.number }}</td>
                    <td style="width: 50%;">
                        <a :href="`tel:${phone.number}`" class="btn btn-info my-2" target="_blank"><i class="fa-sharp fa-solid fa-phone"></i></a> |
                        <a :href="`https://zalo.me/${phone.number}`" class="btn btn-primary" target="_blank">Zalo</a>
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

        }
    },
    props: ['hocsinh']
}
</script>