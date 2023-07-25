<template>
    <b-form-group class="m-1">
        <label for="datepicker-sm">{{ title }}</label>
        <b-input-group class="">
            <b-form-input
                id="example-input"
                type="text"
                placeholder="YYYY-MM-DD"
                autocomplete="off"
                :value="formatDate(value)"
                @input="onInput"
            >
            </b-form-input>
            <b-input-group-append>
                <b-form-datepicker
                    v-model="value"
                    button-only
                    right
                    :min="min"
                    :max="max"
                    locale="en-US"
                    aria-controls="example-input"
                    @context="onContext"
                ></b-form-datepicker>
            </b-input-group-append>
        </b-input-group>
    </b-form-group>
</template>
<script>
import moment from 'moment'
export default {
    props: {
        min: {
            type: String,
            default: undefined
        },
        max: {
            type: String,
            default: undefined
        },
        keyValue: {
            type: String,
            default: undefined
        },
        defaultValue: {
            type: String,
            default: "",
        },
        title: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            value: '',
            formatted: '',
            selected: ''
        }
    },
    watch: {
        value: function (n, o) {
            if (this.keyValue) {
                this.$emit('update-data', {
                    keyValue: this.keyValue,
                    value: n
                });
            } else {
                this.$emit('update-data', n);
            }
        }
    },
    methods: {
        onContext(ctx) {
            // The date formatted in the locale, or the `label-no-date-selected` string
            this.formatted = ctx.selectedFormatted
            // The following will be an empty string until a valid date is entered
            this.selected = ctx.selectedYMD
        },
        formatDate(date) {
            if (!date) return '';
            const [year, month, day] = date.split('-');
            return `${day}/${month}/${year}`;
        },
        onInput(event) {
            const inputValue = event;
            // Kiểm tra nếu người dùng nhập đủ 10 ký tự (DD/MM/YYYY)
            if (inputValue.length === 10) {
                const [day, month, year] = inputValue.split('/');
                // Kiểm tra nếu day, month, year là số và có giá trị hợp lệ
                if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                    const formattedValue = `${year}-${month}-${day}`;
                    this.$data.value = formattedValue; // Sửa đổi cách gán giá trị vào biến value
                } else {
                    // Nếu nhập không hợp lệ, không làm gì cả hoặc có thể hiển thị thông báo lỗi
                    console.log('Ngày không hợp lệ');
                }
            }
        },
    },
    mounted() {
        if (this.defaultValue == "") {
            this.value = moment().format("YYYY-MM-DD");
        } else {
            this.value = this.defaultValue;
        }
    }
}

</script>