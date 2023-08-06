<template>
    <div class="mt-2">
        <div
            class="row"
            v-if="type"
        >
            <div class="col-4">
                <b-form-group
                    v-slot="{ ariaDescribedby }"
                >
                    <b-form-radio-group
                        v-model="type"
                        :options="options"
                        :aria-describedby="ariaDescribedby"
                        name="radio-inline"
                    ></b-form-radio-group>
                </b-form-group>
            </div>
            <div class="col-4">
                <DatePicker
                    @update-data="updateDateSelect"
                    keyValue="to"
                    :defaultValue="date.to"
                    :min="$moment('2023-07-20').format('YYYY-MM-DD')"
                    :max="$moment().format('YYYY-MM-DD')"
                    title="Ngày"
                ></DatePicker>
            </div>
            <div class="col-4">

            </div>
        </div>
        <div
            class="row"
            v-else
        >
            <div class="col-3">
                <b-form-group
                    v-slot="{ ariaDescribedby }"
                >
                    <b-form-radio-group
                        v-model="type"
                        :options="options"
                        :aria-describedby="ariaDescribedby"
                        name="radio-inline"
                    ></b-form-radio-group>
                </b-form-group>
            </div>
            <div class="col-3">
                <DatePicker
                    @update-data="updateDate"
                    keyValue="from"
                    :defaultValue="date.from"
                    :max="date.to"
                    :min="$moment('2023-07-20').format('YYYY-MM-DD')"
                    :title="titleFrom"
                ></DatePicker>
            </div>
            <div class="col-3">
                <DatePicker
                    @update-data="updateDate"
                    keyValue="to"
                    :defaultValue="date.to"
                    :min="date.from"
                    :max="$moment().format('YYYY-MM-DD')"
                    :title="titleTo"
                ></DatePicker>
            </div>
            <div class="col-3">

            </div>
        </div>
    </div>
</template>
<script>
import DatePicker from '~/components/DatePicker.vue';
export default {
    props: {
        titleFrom: {
            type: String,
            default: "Từ"
        },
        titleTo: {
            type: String,
            default: "Đến"
        }
    },
    components: {
        DatePicker
    },
    data() {
        return {
            selected: 'first',
            options: [
                { text: 'Theo ngày', value: true },
                { text: 'Khoản thời gian', value: false }
            ],
            type: true,
            date: {
                from: this.$moment().subtract(10, 'days').isBefore(this.$moment("2023-07-20")) ? this.$moment("2023-07-20").format("YYYY-MM-DD") : this.$moment().subtract(10, 'days').format("YYYY-MM-DD"),
                to: this.$moment().format("YYYY-MM-DD")
            }
        }
    },
    methods: {
        updateDateSelect(date) {
            if (date.keyValue) {
                this.date.from = date.value;
                this.date.to = date.value;
                this.$emit('update-data', this.date);
            }
        },
        updateDate(date) {
            if (date.keyValue) {
                this.date[date.keyValue] = date.value;
            }
            this.$emit('update-data', this.date);
        }
    },
}
</script>