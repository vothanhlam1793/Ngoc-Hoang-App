<template>
    <div class="row">
        <div class="col">
            <h1>{{ lophoc.name }}</h1>
            <div class="row" v-if="phieuketso.id == undefined">
                <div class="col">
                    <div class="row my-3">
                        <div class="col text-right">
                            <button 
                                class="btn btn-primary"
                                @click="createKetSo()"
                            >Tạo kết sổ</button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th style="width: 10%">Tên</th>
                                        <th style="width: 5%">Tổng</th>
                                        <th>Học phí</th> 
                                        <th>CSVC</th>
                                        <th>Camera</th>
                                        <th>Đồng phục</th>
                                        <th>Balo</th>
                                        <th>Ngoài giờ</th>
                                        <th>Ăn 4g45</th>
                                        <th>Khác</th>
                                        <th>Diễn giải</th>
                                        <th>Ngày nghỉ</th>
                                        <th>Tiền nghỉ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <KetSoItem 
                                        v-for="hocsinh in lophoc.hocsinhs"
                                        :key="hocsinh.id"
                                        :hocsinh="hocsinh" 
                                    />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            year: "",
            month: ""
        }
    },
    methods: {
        changeTime(){
            console.log(this.$route);
            location.href = `/ketso/${this.year}/${this.month}`;
        },
        createKetSo(){
            console.log("TAO KET SO");
            this.$store.commit("ketso/controlState", "SAVE")
        }

    },
    computed: {
        lophoc(){
            return this.$store.state.lophoc.lophoc;
        },
        stateItems(){
            return this.$store.state.ketso.stateItem;
        },
        monitor(){
            return this.$store.state.ketso.monitor;
        },
        phieuketso(){
            return this.$store.state.ketso.phieuketso;
        }
    },
    watch: {
        monitor: function(newState, oldState){
            var doneState = true;
            this.stateItems.forEach(function(item){
                if(item.state != "DONE"){
                    doneState = false;
                }
            });
            if(doneState){
                this.$store.dispatch("ketso/createKetSo", {
                    idLopHoc: this.lophoc.id,
                    code: `${this.$route.params.year}_${this.$route.params.month}`      
                }).then(data => {
                    location.reload();
                })
            }
        }
    },
    mounted(){
        this.year = this.$route.params.year;
        this.month = this.$route.params.month;
        this.$store.dispatch("lophoc/getLopHoc", this.$route.params.id);
        this.$store.dispatch("ketso/getPhieuKetSo", {
            idLopHoc: this.$route.params.id,
            code: `${this.$route.params.year}_${this.$route.params.month}`  
        })
    },
    layout: "app"
}
</script>