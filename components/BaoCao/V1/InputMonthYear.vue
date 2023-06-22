<template>
    <div class="form-inline">
        <label for="email" class="mr-sm-2">{{ title }}</label>   
        <input 
            class="form-control mb-2 mr-sm-2"
            type="date" 
            :min="minDate" 
            v-model="selectedMonthYear" 
            @change="sendDateToParent" 
            :max="maxDate"    
        />
    </div>
</template>
  
<script>
export default {
    props: {
        title: {
            type: String,
            default: "Chưa có tiêu đề"
        },
        defaultDate: {
            type: String,
            default: ''
        },
        minDate: {
            type: String,
            default: ''
        },
        maxDate: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            selectedMonthYear: this.defaultDate
        };
    },
    methods: {
        sendDateToParent() {
            this.$emit('date-updated', this.selectedMonthYear);
        }
    }
};
</script>
  