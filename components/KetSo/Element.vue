<template>
    <tr>
        <td>{{ item.hocsinh.name }}</td>
        <td>{{ total }}</td>
        <td>{{ hocphi }}</td>
        <td><div>
            <select
                class="form-control"
                v-model="csvc"
                @change="getTotal()"
            >
                <option
                :value="0"
                >0</option>
                <option
                :value="half"
                >{{ half }}</option>
                <option
                :value="full"
                >{{ full }}</option>
            </select>
        </div></td> <!-- CSVC => Tạo mới hàng loạt-->
        <td>{{ camera }}</td> <!-- CAMERA -->
        <td>{{ item.total }}</td> <!-- Đồng phục -->
        <td>{{ item.total }}</td> <!-- Balo -->
        <td>{{ item.total }}</td> <!-- Ngoài giờ -->
        <td>{{ item.total }}</td> <!-- Ăn 16g45 -->
        <td>{{ item.total }}</td> <!-- Khác -->
        <td>{{ item.total }}</td> <!-- Diễn giải -->
        <td>{{ item.total }}</td> <!-- Ngày nghỉ liên tục -->
        <td>{{ item.total }}</td> <!-- Tiền nghỉ -->
    </tr>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data(){
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
            full: 0,
            half: 0
        }
    },
    methods: {
        getHocPhi(){
            var year = this.item.hocsinh.namhocphi;
            var hp = this.item.hocsinh.hocphigiam;
            var ret = 0;
            this.hocphis.forEach(function(hp){
                if(hp.key == year){
                    ret = parseInt(hp.value);
                }
            });
            if(hp == null || hp == 'null'){
                hp = 0;
            } else {
                hp = parseInt(hp);
            }
            this.hocphi = ret - hp;
        },
        getCamera(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`
                mutation {
                    createOrUpdateCamera(idHocSinh: "${this.item.hocsinh.id}"){
                        id
                        key
                        value
                        item
                        idItem
                    }
                }
                `
            }).then(data => {
                that.camera = parseInt(data.data.createOrUpdateCamera.value) * 50000;
                that.getTotal();
            }).catch(err => {
                console.log(err);
            })
        },
        getCSVC(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    allVariables (where: {
                        OR: [
                        {
                            key_contains: "CSVC_FULL"
                        },
                        {
                            key_contains: "CSVC_HALF"
                        }
                        ]
                    }){
                        id
                        key
                        value
                    }
                }
                `
            }).then(data => {
                data.data.allVariables.forEach(function(variable){
                    if(variable.key == "CSVC_FULL"){
                        that.full = variable.value;
                    } else if (variable.key == "CSVC_HALF"){
                        that.half = variable.value;
                    }
                });

            }).catch (err => {
                console.log(err);
            });
        },
        getTotal(){
            this.total = 
                this.hocphi 
                + parseInt(this.csvc) 
                + this.camera 
                + this.dongphuc 
                + this.balo 
                + this.ngoaigio 
                + this.an545 
                + this.khac 
                + this.thanhtiennghi;
        }
    },
    mounted(){
        if(this.item.hocsinh.luuy == null){
            this.item.hocsinh.luuy = {};
        } else {
            this.item.hocsinh.luuy = JSON.parse(this.item.hocsinh.luuy);
        }
        if(this.item.hocsinh.luuy.camera == undefined){
            this.item.hocsinh.luuy.camera = 0;
        }
        if(this.item.hocsinh.luuy.an545 == undefined){
            this.item.hocsinh.luuy.an545 = "YES";
        }
        
        this.getHocPhi();
        this.getCamera();
        this.getCSVC();
        this.getTotal();
    },
    watch: {
        stateCSVC: function(nS, oS){
            switch(nS){
                case "NONE": {
                    this.csvc = 0;
                } break;
                case "FULL": {
                    this.csvc = this.full;
                } break;
                case "HALF": {
                    this.csvc = this.half;
                }break;
            }
            this.getTotal();
        }
    },
    computed: {
        hocphis(){
            return this.$store.state.hocphi.hocphis;
        },
        stateCSVC(){
            return this.$store.state.ketso.stateCSVC;
        }
    },
    props: ["item"],
}
</script>