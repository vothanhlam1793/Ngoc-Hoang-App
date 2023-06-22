<template>
    <div class="row">
        <div class="col-2">

        </div>
        <div class="col-4">
            <InputMonthYear 
                @date-updated="updateFromDate" 
                :defaultDate="defaultFromDate"
                :maxDate="toDate"
                :title="'Từ'"
            />
        </div>
        <div class="col-4">
            <InputMonthYear 
                @date-updated="updateToDate" 
                :defaultDate="defaultToDate"
                :minDate="fromDate"
                :title="'Đến'"
            />
        </div>
        <div class="col-2">

        </div>
    </div>
</template>
<script>
import InputMonthYear from '~/components/BaoCao/V1/InputMonthYear.vue';
export default {
    components: {
        InputMonthYear
    },
    props: {
        defaultFromDate: {
            type: String,
            default: ''
        },
        defaultToDate: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            fromDate: '2023-01-01',
            toDate: '2023-12-31'
        }
    },
    methods: {
        updateFromDate(date){
            this.fromDate = date;
            this.sendDateToParent();
        },
        updateToDate(date){
            this.toDate = date;
            this.sendDateToParent();
        },
        sendDateToParent(){
            this.$emit('update-date', {
                fromDate: this.fromDate,
                toDate: this.toDate
            })
        }
    },
    mounted(){
        this.fromDate = this.defaultFromDate;
        this.toDate = this.defaultToDate;
    }
}
</script>