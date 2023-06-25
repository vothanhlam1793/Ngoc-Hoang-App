<template>
    <tr>
        <td style="width: 5%;" class="text-center">{{ index + 1 }}</td>
        <td style="width: 15%;">{{ hocsinh.name }}</td>
        <td style="width: 5%;" class="text-center">{{ hocsinh.lophoc.name }}</td>
        <td style="width: 10%;" class="text-right">
        <NgoaiGio 
            :hocsinh="hocsinh"
            @update-data="updateNgoaiGio"
            :year="year"
            :month="month"
        />
        </td>
        <td style="width: 10%;" class="text-right">
        <AnChieu 
            :hocsinh="hocsinh"
            @update-data="updateAnChieu"
            :year="year"
            :month="month"
        />
        </td>
        <td style="width: 10%;" class="text-right">
        <Camera 
            :hocsinh="hocsinh"
            @update-data="updateCamera"
        />
        </td>
        <td style="width: 10%;" class="text-right">
        <HocPhi 
            :hocsinh="hocsinh"
            @update-data="updateHocPhi"
        />
        </td>
        <td style="width: 15%;">
        <input 
            class="form-control text-right"
            v-model="hocphithang"
        />
        </td>
        <td style="width: 10%;"
            class="text-right"
        >
            <div>
                {{ numberWithCommas(total) }}
            </div>
        </td>
    </tr>
</template>
<script>
import NgoaiGio from '~/components/KetSo/EDiemDanhVeTreV4.vue';
import Camera from '~/components/KetSo/ECameraV3.vue';
import AnChieu from '~/components/KetSo/EDiemDanhAn545V3.vue';
import HocPhi from '~/components/KetSo/EHocPhiV2.vue';
export default {
    components: {
        Camera,
        AnChieu,
        NgoaiGio,
        HocPhi
    },
    props: ['index', 'hocsinh', 'month', 'year'],
    watch: {
        hocphithang(n,o){
            this.getTotal();
        }
    },
    methods: {
        numberWithCommas(x) {
            if(x){
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
                return 0;
            }
        },
        updateCamera(data){
            this.camera = data;
            this.getTotal();
        },
        updateHocPhi(hocphi){
            // console.log("HJ: ", hocphi);
            this.hocphidadong = hocphi;
            this.getTotal();
        },
        updateNgoaiGio(ngoaigio){
            this.ngoaigio = ngoaigio;
            this.getTotal();
        },
        updateAnChieu(anchieu){
            this.anchieu = anchieu;
            this.getTotal();
        },
        getTotal(){
            this.total = this.hocphidadong - this.camera - this.ngoaigio - this.anchieu - this.hocphithang;
            this.$store.commit("ksnh/updateItems", {
                camera: this.camera,
                anchieu: this.anchieu,
                total: this.total,
                ngoaigio: this.ngoaigio,
                hocphidadong: this.hocphidadong,
                hocphithangcuoi: this.hocphithang,
                hocsinh: this.hocsinh
            })
        }
    },
    data() {
        return {
            camera: 0,
            anchieu: 0,
            ngoaigio: 0,
            hocphidadong: 0,
            hocphithang: 0,
            total: 0
        }
    }
}
</script>