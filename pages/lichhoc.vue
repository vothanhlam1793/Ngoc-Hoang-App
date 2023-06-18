<template>
    <div class="row">
        <div class="col">
            <LichHoc
                :year="year"
                :month="month"
            ></LichHoc>
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
    created(){
        if(typeof window !== undefined){
            this.year = this.$route.query.year;
            this.month = this.$route.query.month;
        }
    },
    layout: "app"    
}
</script>