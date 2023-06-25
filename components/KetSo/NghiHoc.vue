<template>
    <div class="row">
        <div class="col">
            <h3>{{ idHocSinh }}</h3>
            <button @click="createItem()">Tạo phiếu</button>
            <div v-if="item.id">
                <KetSoECameraV2 :item="item"
                    @update-data="updateCamera"
                /><br>
                <KetSoEDiemDanhV4 :item="item" :month="'06'" :year="'2023'"
                    @update-data="updateDiemDanh"
                /><br>
                <KetSoEDiemDanhVeTreV2 :item="item" :month="'06'" :year="'2023'"
                    @update-data="updateVeTre"
                /><br>
                <KetSoEDiemDanhAn545V2 :item="item" :month="'06'" :year="'2023'"
                    @update-data="updateAnChieu"
                />
                {{ item }}
            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
import Index from '~/components/Filter/Table/Index.vue';
export default {
    props: ['idHocSinh'],
    components: {
        Index
    },
    data(){
        return {
            item: {
                camera: 0,
                diemdanh: 0,
                vetre: 0,
                anchieu: 0,
                total: 0,
            },
            hocphi: -5000000
        }
    },
    methods: {
        updateCamera(total){
            this.camera = total;
            console.log(total);
            this.updateTotal();
        },
        updateDiemDanh(total){
            console.log(total);
            this.diemdanh = total;
            this.updateTotal();
        },
        updateVeTre(total){
            console.log(total);
            this.vetre = total;
            this.updateTotal();
        },
        updateAnChieu(total){
            console.log(total);
            this.anchieu = total;
            this.updateTotal();
        },
        updateTotal(){
            this.total = this.anchieu + this.vetre + this.diemdanh + this.camera;
            console.log(this.total, this.anchieu, this.vetre, this.diemdanh, this.camera, this.hocphi);
            if(this.total >= 0){
                if(this.item.id){
                    this.updateItemKetSo();
                }
            }
        },
        createItem(){
            this.createItemKetSo();
        },
        createItemKetSo(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            //{"total":-430000,"hocphi":0,"csvc":0,"camera":50000,"totalHoaDon":0,"ngoaigio":0,"an545":0,"khac":0,"ngaynghi":24,"thanhtiennghi":480000,"hoadons":[],"state":"SAVED"}
            client.mutate({
                mutation: gql`
                    mutation {
                    createItemKetSo(data: {
                        data: "{}",
                        code: "KS_NGHI_LUON",
                        hocsinh: {
                        connect: {
                            id: "${that.idHocSinh}"
                        }
                        },
                        total: 0
                    }) {
                        id data code 
                        lophoc {id name} 
                        hocsinh {id name lophoc {id}}   
                        createdAt
                        total
                    }
                }
                `
            }).then(data => {
                console.log("CREATE", data);
                that.item = data.data.createItemKetSo;
                if(that.total >= 0){
                    that.updateItemKetSo();
                }
            }).catch(err => {
                console.log(err);
            });
        },
        updateItemKetSo(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`mutation {
                    updateItemKetSo(id: "${that.item.id}", data: {
                        data: "${JSON.stringify({
                            total: that.total + that.hocphi,
                            camera: that.camera,
                            ngoaigio: that.vetre,
                            thanhtiennghi: that.diemdanh,
                            an545: that.anchieu,
                            hoadons: [],
                            hocphi: that.hocphi
                            
                        }).split('"').join('\\"')}",
                        lophoc: {
                        connect: {
                            id: "${that.item.hocsinh.lophoc.id}"
                        }
                        }
                    }){
                        id data code 
                        lophoc {id name} 
                        hocsinh {id name}   
                        createdAt
                        total
                    }
                }`
            }).then(data => {
                console.log("UPDATE", data);
                that.item = data.data.updateItemKetSo;
            }).catch(err => {
                console.log(err);
            });
        }
    },
    mounted(){

    }
}
</script>