<template>
    <div class="row">
        <div class="col">
            <template v-if="version === '2'">
                <KetSoShowV2
                    v-for="item in phieuketso.items"
                    :item="item"
                    :key="item.id"
                    :phieuketso="phieuketso"
                >
                </KetSoShowV2>
            </template>
            <template v-else>
                <KetSoShow
                    v-for="item in phieuketso.items"
                    :item="item"
                    :key="item.id"
                    :phieuketso="phieuketso"
                >
                </KetSoShow>
            </template>
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

export default {
    data(){
        return {

        }
    },
    methods: {
        calculation(){
            var h= location.href.split("/");
            h.pop();
            location.href = h.join("/");
        }
    },
    computed: {
        version(){
            return this.$route.query.v || '1';
        },
        phieuketso(){
            return this.$store.state.pks.phieuketso;
        },
    },
    mounted(){
        this.year = this.$route.params.year;
        this.month = this.$route.params.month;
        this.idLopHoc = this.$route.params.id;
        // this.createOrUpdatePhieuKetSo();
        this.$store.commit("pks/updateCode", `${this.year}_${this.month}`);
        this.$store.commit("pks/updateIdLopHoc", this.$route.params.id);
        
        this.$store.dispatch("pks/createOrUpdatePhieuKetSo");
    },
    layout: "pdf",
}
</script>