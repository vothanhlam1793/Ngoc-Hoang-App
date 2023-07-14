<template>
    <div>
        <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày"></DatePicker>
        <Table :dataSource="hocsinhs" :columns="columns" :rowKey="hocsinh => hocsinh.id" @change="handleChange"></Table>
    </div>
</template>
<script>
import Vue from 'vue';
import { Button, DatePicker, Icon, Row, Col, Steps, Rate, Switch, Slider, Modal, Table, Divider, Tag, Skeleton } from 'ant-design-vue';
import { Form, Input, Checkbox, InputNumber, TimePicker, message, notification } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'; // or 'ant-design-vue/dist/antd.less'
Vue.use(Modal);
function chuyentiengviet(str) {
    if (str == undefined) {
        return "";
    }
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
export default {
    components: {
        DatePicker,
        Table
    },
    data() {
        return {
            filteredInfo: {},
            sortedInfo: {},
        }
    },
    methods: {
        handleChange(pagination, filters, sorter) {
            console.log('Various parameters', pagination, filters, sorter);
            this.filteredInfo = filters;
            this.sortedInfo = sorter;
        },
        clearFilters() {
            this.filteredInfo = null;
        },
        clearAll() {
            this.filteredInfo = null;
            this.sortedInfo = null;
        },
        setDebtSort() {
            this.sortedInfo = {
                order: 'descend',
                columnKey: 'parent.id'
            }
        },
    },
    computed: {
        hocsinhs() {
            return this.$store.state.filter.hocsinh.hocsinhs;
        },
        lophocs() {
            return this.$store.state.filter.hocsinh.lophocs;
        },
        columns() {
            const { sortedInfo, filteredInfo } = this;
            const dsl = ['Mầm 1', 'Mầm 2', 'Mầm 3', 'Nhà trẻ', "Chồi 1", "Chồi 2", "Chồi 3", "Lá 1", "Dự thính 2", "Dự thính 3"]
            return [
                {
                    title: "Tên",
                    dataIndex: "name",
                    key: "id"
                },
                {
                    title: "Lớp học",
                    dataIndex: "lophoc.name",
                    key: "lophoc",
                    filters: dsl.map(function (item) {
                        return {
                            text: item,
                            value: item
                        }
                    }),
                    filteredValue: filteredInfo.lophoc || null,
                    onFilter: function (value, record) {
                        if (record.lophoc) {
                            return record.lophoc.name.includes(value);
                        } else {
                            return false;
                        }
                    },
                    ellipsis: true,
                },
                {
                    title: "Công nợ",
                    dataIndex: "parent.debt",
                    sorter: (a, b) => {
                        return parseInt(a.parent.debt) - parseInt(b.parent.debt)
                    },
                    sortOrder: sortedInfo.columnKey === 'parent.id' && sortedInfo.order,
                    ellipsis: true,
                    key: "parent.id"
                },
                {
                    title: "Trạng thái",
                    dataIndex: "status",
                    key: "status",
                    customRender: (status) => {
                        if(status == "NGHI_LUON"){
                            return <Tag color="red" key="status">
                                        {status}
                                    </Tag>
                        } else if(status == "DANG_HOC") {
                            return <Tag color="green" key="status">
                                        {status}
                                    </Tag>
                        } else if(status == "DANG_KY") {
                            return <Tag color="purple" key="status">
                                        {status}
                                    </Tag>
                        } else {
                            return <Tag color="blue" key="status">
                                        {status}
                                    </Tag>
                        }
                    },
                    filters: [
                        {value: "DANG_KY", text: "Đăng ký"},
                        {value: "DANG_HOC", text: "Đang học"},
                        {value: "TAM_NGHI", text: "Tạm nghỉ"},
                        {value: "NGHI_LUON", text: "Nghỉ luôn"},
                    ],
                    filteredValue: filteredInfo.status || null,
                    onFilter: function (value, record) {
                        return record.status == value;
                    },
                }
            ]
        }
    },
    mounted() {
        this.$store.dispatch("filter/hocsinh/getAllHocsinhs");
    },
    layout: "ant"
}
</script>