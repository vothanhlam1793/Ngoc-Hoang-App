<template>
    <div class="row">
        <div class="col">
            <h1>{{ getType() }} - {{ lophoc.name }} - {{ month }}/{{ year }}</h1>
            <FormDiemDanh 
                :hocsinhs="sortHocSinh(lophoc.hocsinhs)"
                :year="year"
                :month="month"
                :type="type"
                :idLopHoc="idLopHoc"
            />
        </div>
    </div>
</template>
<style>
  /* .sticky {
    position: sticky;
    left: 0;
    background-color: #f5f5f5;
  }

  .sticky-col {
    position: sticky;
    top: 0;
    background-color: #f5f5f5;
  } */
</style>
<script>
import FormDiemDanh from '~/components/XemDiemDanh/Form.vue';
import gql from 'graphql-tag'
export default {
    components: {
        FormDiemDanh
    },    
    data(){
        return {
            hocsinhs: [],
            year: "2023",
            month: "06",
            type: "DIHOCHANGNGAY",
            idLopHoc: "642f81dd9a34bd0026c035a2",
        }
    },    
    methods: {
        getType() {
            switch(this.type){
                case "DIHOCHANGNGAY": {
                    return "ĐI HỌC"
                }
                case "VETRE": {
                    return "VỀ TRỄ"
                }
                case "ANCHIEU": {
                    return "ĂN CHIỀU"
                }
            }
        },
        chuyentiengviet(str) {
            if(str == undefined){
                return "";
            }
            return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
        },
        sortHocSinh(hocsinhs){
            if(hocsinhs == undefined){
                return [];
            }
            var ret = [];
            if(hocsinhs){
                var that = this;
                ret = hocsinhs.filter(function(hocsinh){
                    return hocsinh.status != "NGHI_LUON";
                });
                ret.sort(function(a,b){
                    let t = a.name.split(" ");
                    t = t.filter(e => e != "");
                    let u = b.name.split(" ");
                    u = u.filter(e => e != "");
                    if(that.chuyentiengviet(t[t.length - 1]) < that.chuyentiengviet(u[u.length - 1])){
                        return -1;
                    } else if(that.chuyentiengviet(t[t.length - 1]) > that.chuyentiengviet(u[u.length - 1])){
                        return 1;
                    } else {
                        return 0;
                    }
                });
                return ret;
            }
            return ret;
        },
    },
    computed: {
        lophoc() {
            return this.$store.state.ndd.lophoc;
        },
        stateLopHoc(){
            return this.$store.state.ndd.stateLopHoc;
        }
    },
    created() {
        // Setup
        if(typeof window !== undefined){
            if(this.$route.query.type){
                this.type = this.$route.query.type;
            }
            if(this.$route.query.year){
                this.year = this.$route.query.year;
            }
            if(this.$route.query.month){
                this.month = this.$route.query.month;
            }
            if(this.$route.query.idLopHoc){
                this.idLopHoc = this.$route.query.idLopHoc;
            }
            this.$store.commit("ndd/updateIdLopHoc", this.idLopHoc);
            this.$store.dispatch("ndd/getLopHoc");
        }
    },
    layout: "pdf",
}
</script>