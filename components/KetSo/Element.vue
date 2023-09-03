<template>
    <tr>
        <td>{{ item.hocsinh.name }}</td>
        <KetSoETotal :item="item"></KetSoETotal>
        <KetSoEHocPhi :item="item"></KetSoEHocPhi>
        <KetSoECoSoVatChat :item="item"></KetSoECoSoVatChat>
        <KetSoECamera :item="item">
        </KetSoECamera>
        <KetSoEHoaDon :item="item">
        </KetSoEHoaDon>
        <KetSoEDiemDanhVeTre :item="item" :month="month" :year="year"></KetSoEDiemDanhVeTre>
        <KetSoEDiemDanhAn545V5 :item="item" :month="month" :year="year"></KetSoEDiemDanhAn545V5>
        <KetSoEPhiMoRong :item="item" :pmrs="pmrs" :statePmrs="statePmrs"></KetSoEPhiMoRong>
        <KetSoEKhac :item="item">
        </KetSoEKhac>
        <KetSoEDienGiai :item="item">
        </KetSoEDienGiai>
        <KetSoEDiemDanhV2 :item="item" type="DIHOCHANGNGAY"  :month="month" :year="year"></KetSoEDiemDanhV2>
        <KetSoEThanhTienNghi :item="item">
        </KetSoEThanhTienNghi>
    </tr>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data() {
        return {
            hocphi: 0,
            total: 0,
            csvc: 0,
            camera: 0,
            dongphuc: 0,
            balo: 0,
            ngoaigio: 0,
            an545: 0,
            khac: 0,
            thanhtiennghi: 0,
            phimorong: 0,
            full: 0,
            half: 0
        }
    },
    methods: {
        getHocPhi() {
            var year = this.item.hocsinh.namhocphi;
            var hp = this.item.hocsinh.hocphigiam;
            var ret = 0;
            this.hocphis.forEach(function (hp) {
                if (hp.key == year) {
                    ret = parseInt(hp.value);
                }
            });
            if (hp == null || hp == 'null') {
                hp = 0;
            } else {
                hp = parseInt(hp);
            }
            this.hocphi = ret - hp;
        },
        getTotal() {
            this.total =
                this.hocphi
                + parseInt(this.csvc)
                + this.camera
                + this.dongphuc
                + this.balo
                + this.ngoaigio
                + this.an545
                + this.khac
                + this.phimorong
                + this.thanhtiennghi;
        },
        createItemKetSo() {
            console.log(this.item);
        }
    },
    mounted() {

    },
    watch: {
        stateCSVC: function (nS, oS) {
            switch (nS) {
                case "NONE": {
                    this.csvc = 0;
                } break;
                case "FULL": {
                    this.csvc = this.full;
                } break;
                case "HALF": {
                    this.csvc = this.half;
                } break;
            }
            this.getTotal();
        }
    },
    computed: {
        hocphis() {
            return this.$store.state.hocphi.hocphis;
        },
        stateCSVC() {
            return this.$store.state.ketso.stateCSVC;
        }
    },
    props: ["item", 'month', 'year', 'pmrs', 'statePmrs'],
}
</script>