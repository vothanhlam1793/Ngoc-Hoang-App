<template>
    <div class="row">
        <div class="col-2">
            <PhuHuynhSideBar />
        </div>
        <div class="col-10">
            <div class="row" v-if="phuhuynh.hocsinhs != undefined">
                <div class="col" v-if="phuhuynh.hocsinhs.length > 0">
                    <h4>{{ phuhuynh.hocsinhs[0].name  }}</h4>
                    <p>Nợ: {{ phuhuynh.debt     }}</p>
                </div>
            </div>
            <div class="row my-3">
                <div class="col text-right">
                    <button
                        class="btn btn-success"
                    >
                        Thu nợ
                    </button>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    {{ items }}
                    ----
                    {{ phieuthus }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    watch: {
        phuhuynh: function(n, o){
            console.log("OPHUUASJDNJNDVS",n)
            if(n.id){
                this.$store.dispatch("phuhuynh/getDebt", this.phuhuynh);
            }
        }
    },
    computed: {
        phuhuynh(){
            return this.$store.state.phuhuynh.phuhuynh;
        },
        phieuthus(){
            return this.$store.state.phuhuynh.phieuthus;
        },
        items(){
            return this.$store.state.phuhuynh.items;
        }
    },
    mounted(){
        this.$store.dispatch("phuhuynh/getPhuHuynh", this.$route.params.id);
    },
    layout: "app"
}
</script>