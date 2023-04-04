<template>
    <div class="row">
        <div class="col">
            <div class="row">
                <div class="col">
                    <h2>Mầm 1 - Điểm danh</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <h4>Năm</h4>
                    <select class="form-control" v-model="year" @change="updateDateForm()">
                        <option 
                            v-for="y in yearForm"
                            :value="y">{{y}}</option>
                    </select>
                </div>
                <div class="col-6">
                    <h4>Tháng</h4>
                    <select class="form-control" v-model="month" @change="updateDateForm()">
                        <option
                            v-for="m in monthForm"
                            :value="m"
                            >{{ m }}</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Điểm danh</th>
                            <th>Hoạt động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="date in dateForm"
                        >
                            <td>{{ date }}/{{ month }}</td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </template>
    <script>
    export default {
        data() {
            return {
                yearForm: ['2023', '2024', '2025', '2026'],
                monthForm: ['01','02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                year: "2023",
                month: ("0" + ((new Date()).getMonth() + 1).toString()).substring(("0" + (new Date()).getMonth().toString()).length - 2, ("0" + (new Date()).getMonth().toString()).length)

            }
        },
        methods: {
            updateDateForm(){
                this.$store.commit("diemdanh/updateDateForm", {
                    year: this.year,
                    month: this.month
                })
            }
        },
        layout: "app",
        watch: {

        },
        computed: {
            dateForm(){
                return this.$store.state.diemdanh.dateForm;
            }
        },
        mounted(){
            this.updateDateForm();
        }
    }
    </script>