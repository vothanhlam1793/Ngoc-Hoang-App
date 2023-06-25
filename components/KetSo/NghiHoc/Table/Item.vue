<template>
    <tr>
        <td style="width: 5%;" class="text-center">{{ index + 1 }}</td>
        <td style="width: 20%;">{{ hocsinh.name }}</td>
        <td style="width: 10%;" class="text-center">{{ hocsinh.lophoc.name }}</td>
        <td style="width: 15%;">
        <NgoaiGio 
            :hocsinh="hocsinh"
            @update-data="updateCamera"
            :year="year"
            :month="month"
        />
        </td>
        <td style="width: 15%;">
        <AnChieu 
            :hocsinh="hocsinh"
            @update-data="updateCamera"
            :year="year"
            :month="month"
        />
        </td>
        <td style="width: 15%;">
        <Camera 
            :hocsinh="hocsinh"
            @update-data="updateCamera"
        />
        </td>
        <td style="width: 20%;"></td>
    </tr>
</template>
<script>
import NgoaiGio from '~/components/KetSo/EDiemDanhVeTreV4.vue';
import Camera from '~/components/KetSo/ECameraV3.vue';
import AnChieu from '~/components/KetSo/EDiemDanhAn545V3.vue';
export default {
    components: {
        Camera,
        AnChieu,
        NgoaiGio
    },
    props: ['index', 'hocsinh'],
    methods: {
        updateCamera(data){
            console.log(data);
        }
    },
    data() {
        return {
            month: "06",
            year: "2023"
        }
    }
}
</script>