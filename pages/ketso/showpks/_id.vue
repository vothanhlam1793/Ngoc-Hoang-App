<template>
    <div class="row">
        <div class="col">
            <!-- <div v-if="phieuketso.id"> -->
                <KetSoShowNH
                v-for="item in phieuketso.items"
                :item="item"
                :key="item.id"
                :phieuketso="phieuketso"
            >
            </KetSoShowNH>
            <!-- </div> -->
        </div>
    </div>
</template>
<style>
table, td, th {
  border: 1px solid black;
}

td.tb-col-2{
    text-align: right;
    padding-right: 5px;
    padding-top: 2px;
    padding-bottom: 2px;
}
td.tb-col-1{
    text-align: left;
    padding-left: 5px;
    padding-top: 2px;
    padding-bottom: 2px;
}
td.tb-col-3{
    text-align: left;
    padding-left: 5px;
    padding-top: 2px;
    padding-bottom: 2px;
}
table {
  width: 80%; 
  margin: 0 auto; /* or margin: 0 auto 0 auto */
}

</style>
<script>
import gql from 'graphql-tag'
export default {
    components: {
        
    },
    data(){
        return {
            idPhieuKetSo: "",
            phieuketso: {}
        }
    },
    created(){
        this.idPhieuKetSo = this.$route.params.id;
    },
    mounted(){
        this.getPhieuKetSo();
    },
    methods: {
        getPhieuKetSo(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.query({ query: gql`
            query {
  allPhieuKetSos (where: {id: "${this.idPhieuKetSo}"}){
    id
    items {
id
data
code
lophoc {
id
name
}
hocsinh {
    id
    name
    namhocphi
    hocphigiam
    luuy
    status
    lophoc {id name}
    parent {
        id
        phone {
            number
            id
            name
        }
        hocsinhs {
            id
            name
            lophoc {
                id
                name
            }
        }
    }
}
total
    }
    code
    createdAt
  }
}
            `}).then(data => {
                data.data.allPhieuKetSos[0].items.forEach(function(item){
                    try {
                        item.data = JSON.parse(item.data);
                        item.lophoc = item.hocsinh.lophoc;
                    } catch (e) {
                        item.data = {};
                    }
                });
                that.phieuketso = data.data.allPhieuKetSos[0];
                console.log(that.phieuketso)
                
            }).catch(err => {
                console.log(err);
            })
        }
    },
    layout: "app"
}
</script>