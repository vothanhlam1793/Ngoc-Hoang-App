<template>
    <div class="row">
        <div class="col">
            <div class="d-flex justify-content-between mb-3">
                <div class="">
                    <h6>Ngày nhập học</h6>
                </div>
                <div class="">
                    <button 
                        class="btn btn-warning"
                        v-if="state == 'CHANGED'"
                        @click="saveChange()"
                    >Lưu lại</button>
                </div>
            </div>
            <div class="form-group">
                <!-- <textarea 
                    class="form-control"
                    v-model="variable.value"
                    @change="changed"
                    rows="5"
                ></textarea> -->
                <b-input-group class="mb-3">
                    <b-form-input
                        id="example-input"
                        v-model="dateText"
                        type="text"
                        placeholder="DD/MM/YYYY"
                        autocomplete="off"
                        @change="changed"
                    ></b-form-input>
                    <b-input-group-append>
                        <b-form-datepicker
                             v-model="pickerDate"
                            button-only
                            right
                             locale="vi-VN"
                            aria-controls="example-input"
                            @context="onContext"
                        ></b-form-datepicker>
                    </b-input-group-append>
                </b-input-group>
            </div>
        </div>
    </div>
</template>
<script>
import { BFormDatepicker, BFormInput, BInputGroupAppend, BInputGroup } from 'bootstrap-vue'
import { schoolDate, displaySchoolDate } from '~/utils/schoolDate';
import {getVariableByKey, createVariable, updateVariable} from '~/plugins/variable.js'
export default {
    components: {
        "b-form-datepicker": BFormDatepicker,
        "b-form-input": BFormInput,
        "b-input-group": BInputGroup,
        "b-input-group-append": BInputGroupAppend
    },
    props: ['hocsinh'],
    computed: {
        dateText: {
            get() { return displaySchoolDate(this.variable.value); },
            set(value) { this.$set(this.variable, 'value', value); }
        },
        pickerDate: {
            get() { return schoolDate(this.variable.value) || ''; },
            set(value) { this.$set(this.variable, 'value', value); this.changed(); }
        }
    },
    data(){
        return {
            variable: {},
            state: "NONE",
            key: "DATE-ACCESS",
            value: '',
            formatted: '',
            selected: '',
            counter: 0
        }
    },
    methods: {
        onContext(ctx) {
            // The date formatted in the locale, or the `label-no-date-selected` string
            this.formatted = ctx.selectedFormatted
            // The following will be an empty string until a valid date is entered
            this.selected = ctx.selectedYMD
            if(this.counter > 1){
                this.changed();
            }
            this.counter += 1;
        },
        changed(){
            this.state = "CHANGED";
        },
        saveChange(){
            const date = schoolDate(this.variable.value);
            if (!date) { this.$bvToast.toast('Ngày nhập học không hợp lệ. Nhập DD/MM/YYYY', { variant: 'danger' }); return; }
            this.variable.value = date;
            var that = this;
            if(this.variable.id){
                // update
                updateVariable(this.$apolloProvider.defaultClient, this.variable)
                .then(variable => {
                    that.state = "NONE";
                }).catch(err => {
                    console.log("UPDATE: ", err);
                });
            } else {
                // create new
                createVariable(this.$apolloProvider.defaultClient, this.variable)
                .then(variable => {
                    that.variable = variable;
                    that.state = "NONE";
                }).catch(err => {
                    console.log("CREATED: ", err);
                });
            }
        },
        queryVariable(){
            var that = this;
            getVariableByKey(this.$apolloProvider.defaultClient, {
                item: "Student",
                idItem: this.hocsinh.id,
                key: this.key
            }).then(variable => {
                that.variable = variable;
            }).catch(err => {
                console.log(err);
            });
        }
    },
    watch: {
        
    },
    created(){
        // this.createOrUpdateCamera();
        this.queryVariable();
    },
}
</script>
