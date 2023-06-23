<template>
    <div class="row m-2 p-2">
        <div class="col">
            <table class="table table-bordered text-center">
                <tr v-for="phone in hocsinh.parent.phone">
                    <td>{{ phone.name }}</td>
                    <td>{{ phone.number }}</td>
                    <td>
                        <a :href="`tel:${phone.number}`" class="btn btn-info" target="_blank">Gọi</a> |
                        <a :href="`https://zalo.me/${phone.number}`" class="btn btn-primary" target="_blank">Zalo</a>
                    </td>
                </tr>
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