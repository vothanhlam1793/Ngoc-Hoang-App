<template>
    <div class="row">
        <div class="col">
            <div class="row">
                <h1>Menu + Title</h1>
            </div>
            <div class="row">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="sanpham in sanphams"
                            :key="sanpham.id"
                        >
                            <td>{{ sanpham.name }}</td>
                            <td>{{ sanpham.price }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    computed: {
        sanphams(){
            
            return this.$store.state.sanpham.sanphams;
        }
    }
}
</script>