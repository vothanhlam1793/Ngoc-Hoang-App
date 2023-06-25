<template>
    <div class="row">
        <div class="col">
            <table class="table table-striped table-bordered">
                <thead>
                    <tr
                        class="text-center"
                    >
                        <th>STT</th>
                        <th>Tên học sinh</th>
                        <th>Lớp học</th>
                        <th>Ngoài giờ</th>
                        <th>Ăn chiều</th>
                        <th>Camera</th>
                        <th>HP-{{ `${month}/${year}` }}</th>
                        <th>HP học</th>
                        <th>Hoàn trả</th>
                    </tr>
                </thead>
                <tbody>
                    <Item 
                        v-for="hocsinh, index in hocsinhs"
                        :index="index"
                        :hocsinh="hocsinh"
                        :key="hocsinh.id"
                        :month="month"
                        :year="year"
                    />
                </tbody>
            </table>
            
        </div>
    </div>
</template>
<script>
import Item from '~/components/KetSo/NghiHoc/Table/Item.vue';
export default {
    components: {
        Item
    },
    props: ['month', 'year'],
    data(){
        return {

        }
    },
    computed: {
        hocsinhs(){
            return this.$store.state.ksnh.hocsinhs;
        }
    }
}
</script>