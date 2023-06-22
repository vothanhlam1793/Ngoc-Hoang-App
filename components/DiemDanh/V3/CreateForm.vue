<template>
    <div class="row">
        <div class="col">
            <DiemDanhV3Info/>
            <DiemDanhV3Result/>
            <DiemDanhV3List/>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    mounted(){
        if(typeof window !== undefined){
            this.$store.commit("diemdanh/v3/create/updateType", "DIHOCHANGNGAY");
            this.$store.commit("diemdanh/v3/create/updateDate", this.date);
            if(this.idLopHoc){
                this.$store.dispatch("diemdanh/v3/create/getLophocById", this.idLopHoc);
            }
            if(this.idUser){
                this.$store.dispatch("diemdanh/v3/create/getUserById", this.idUser);
            }
        }
    },
    props: [
        "idLopHoc",
        "idUser",
        "date"
    ]
}
</script>