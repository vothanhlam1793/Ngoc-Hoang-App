<template>
    <tr>
        <td>{{ hocsinh.name }}</td>
        <td> {{ getTotal() }}</td><!--  Tổng cộng -->
        <td><input
            class="form-control"
            @change="$forceUpdate()"
            v-model="hsItem.hocphi"    
        ></td>
        <td><input
            class="form-control"
            @change="$forceUpdate()"
            v-model="hsItem.csvc"    
        ></td><!--  CSVC -->
        <td><input
            class="form-control"
            @change="$forceUpdate()"
            v-model="hsItem.camera"    
        ></td><!--  Camera -->
        <td><input
            class="form-control"
            @change="$forceUpdate()"
            v-model="hsItem.dongphuc"    
        ></td><!--  Đồng phục -->
        <td><input
            class="form-control"
            @change="$forceUpdate()"
            v-model="hsItem.balo"    
        ></td><!--  Balo -->
        <td><input
            class="form-control"
            @change="$forceUpdate()"
            v-model="hsItem.ngoaigio"    
        ></td><!--  Ngoài giờ -->
        <td><input
            class="form-control"
            @change="$forceUpdate()"
            v-model="hsItem.an545"    
        ></td><!--  Ăn 4g45 -->
        <td><input
            class="form-control"
            @change="$forceUpdate()"
            v-model="hsItem.khac"    
        ></td><!--  Khác -->
        <td><input
            class="form-control"
            @change="$forceUpdate()"
            v-model="hsItem.diengiai"    
        ></td><!--  Diễn giải -->
        <td><input
            class="form-control"
            @change="$forceUpdate()"
            v-model="hsItem.ngaynghi"    
        ></td><!--  Ngày nghỉ -->
        <td><input
            class="form-control"
            @change="$forceUpdate()"
            v-model="hsItem.thanhtiennghi"    
        ></td><!--  Thành tiền -->
    </tr>
</template>
<script>
export default {
    data(){
        return {
            hsItem: {}        
        }
    },
    methods: {
        getTotal(){
            var total = 0;
            total += parseInt(this.hsItem.hocphi);
            total += parseInt(this.hsItem.csvc);
            total += parseInt(this.hsItem.camera);
            total += parseInt(this.hsItem.dongphuc);
            total += parseInt(this.hsItem.balo);
            total += parseInt(this.hsItem.ngoaigio);
            total += parseInt(this.hsItem.an545);
            total += parseInt(this.hsItem.khac);
            total -= parseInt(this.hsItem.thanhtiennghi);
            return total;
        },
        getHocPhi(hp){
            if(hp){
                return hp;
            } else {
                return this.hocsinh.lophoc.hocphi;
            }
        },
        updateRun(){
            console.log("CHILDERN", this.hsItem);
        }
    },
    created(){
        this.hsItem.luuy = JSON.parse(this.hocsinh.luuy);
        this.hsItem.hocphi = this.getHocPhi(this.hocsinh.hocphi);
        this.hsItem.csvc = 0;
        if(this.hsItem.luuy == null){
            this.hsItem.luuy = {};
        }
        if(this.hsItem.luuy.camera == undefined){
            this.hsItem.luuy.camera = 0;
        }
        this.hsItem.camera = 50000 * this.hsItem.luuy.camera;     
        this.hsItem.dongphuc = 0;
        this.hsItem.balo = 0;
        this.hsItem.ngoaigio = 0;
        this.hsItem.an545 = 0;
        this.hsItem.khac = 0;
        this.hsItem.diengiai = "";
        this.hsItem.ngaynghi = 0;
        this.hsItem.thanhtiennghi = 0;  
        this.$store.commit("ketso/updateItemState", {
            id: this.hocsinh.id,
            state: "READY"
        });
    },
    watch: {
        state: function(newState, oldState){
            if((oldState == "READY") && (newState == "SAVE")){
                this.$store.dispatch("ketso/createItem", {
                    idLopHoc: this.hocsinh.lophoc.id,
                    data: JSON.stringify(this.hsItem),
                    code: `${this.$route.params.year}_${this.$route.params.month}`,
                    hocsinh: this.hocsinh,
                    total: this.getTotal()
                })
            }
        }
    },
    computed: {
        lophoc(){
            return this.$store.state.lophoc.lophoc;
        },
        state(){
            var s = "";
            var that = this;
            this.$store.state.ketso.stateItem.forEach(function(e){
                if(e.id == that.hocsinh.id){
                    s = e.state;
                }
            });
            return s;
        }
    },
    props: ['hocsinh']
}
</script>