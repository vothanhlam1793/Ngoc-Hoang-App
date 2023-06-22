<template>
    <div class="row">
        <div class="col">
            <MonthYear
                :defaultFromDate="defaultFromDate"
                :defaultToDate="defaultToDate"
                @update-date="updateDate"
            />
            <div class="p-3 text-center">
                <button
                    class="btn btn-primary"
                    @click="createBaoCao()"
                >Lập báo cáo</button>
            </div>
            <List 
                :oBaoCaos="oBaoCaos"
                :codes="codes"
            />
        </div>
    </div>
</template>
<script>
import MonthYear from '~/components/BaoCao/V1/MonthYear.vue';
import List from '~/components/BaoCao/V1/List.vue';
export default {
    components: {
        MonthYear,
        List
    },
    data() {
        return {
            // Đừng hỏi, cái này con ChatGPT nó viết đó
            defaultFromDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 10),
            defaultToDate: new Date().toISOString().slice(0, 10),
            fromDate: '',
            toDate: ''
        };
    },
    created(){
        this.fromDate = this.defaultFromDate;
        this.toDate = this.defaultToDate;
    },
    watch: {
        monitor: function(){
            this.$forceUpdate();
        }
    },
    computed: {
        oBaoCaos(){
            return this.$store.state.baocao.v1.month.oBaoCao;
        },
        monitor(){
            return this.$store.state.baocao.v1.month.monitor;
        },
        codes(){
            return this.$store.state.baocao.v1.month.codes;
        }
    },
    methods: {
        updateDate(oDate) {
            this.toDate = oDate.toDate;
            this.fromDate = oDate.fromDate;
        },
        createBaoCao(){
            console.log("Lập báo cáo: ", this.fromDate, this.toDate);
            this.$store.dispatch("baocao/v1/month/createBaoCao", {
                fromDate: this.fromDate,
                toDate: this.toDate
            });
        },
    }
}
</script>