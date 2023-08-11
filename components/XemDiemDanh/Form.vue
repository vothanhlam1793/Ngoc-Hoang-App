<template>
    <div class="">
        <table
            class="table-bordered"
            data-spy="scroll"
            data-target=".black"
            data-offset="50"
        >
            <thead class="black">
                <tr>
                    <th></th>
                    <th class="">Tên</th>
                    <th
                        v-for="r, i in lichhoc"
                        :key="i"
                        class="p-1"
                    >{{ r.date }}</th>
                </tr>
            </thead>
            <tbody>
                <tr class="">
                    <td>STT</td>
                    <td class="">Lịch học</td>
                    <td
                        v-for="r, i in lichhoc"
                        :key="i"
                        :class="getColorLichHoc(r)"
                    >{{ getDiHoc(r) }}</td>
                </tr>
                <Item
                    v-for="hocsinh, index in hocsinhs"
                    :key="hocsinh.id"
                    :hocsinh="hocsinh"
                    :type="type"
                    :month="month"
                    :year="year"
                    :lichhoc="lichhoc"
                    :stateLichHoc="stateLichHoc"
                    :index="index"
                />
            </tbody>
        </table>
    </div>
</template>
<script>
import gql from 'graphql-tag'
import Item from '~/components/XemDiemDanh/Item.vue';
import {getPhieuDiemDanh} from '~/plugins/phieudiemdanh.js';
export default {
    components: {
        Item
    },
    props: ['month', 'year', 'type', 'hocsinhs', 'idLopHoc'],
    data() {
        return {
            lichhoc: [],
            stateLichHoc: "NONE",
            variable: {},
            diemdanhs: [],
        }
    },
    watch: {
        diemdanhs(n,o){
            this.$forceUpdate();
        }
    },
    methods: {
        getDiHoc(r){
            let t = 0;
            let n = "";
            var that  = this;
            this.diemdanhs.forEach(function(diemdanh){
                if(diemdanh.code == `${that.year}_${that.month}_${r.date.padStart(2, "0")}`){
                    t = diemdanh.co.length;
                    // if(diemdanh.giaovien){
                    //     n = diemdanh.giaovien.name;
                    // }
                }
            });
            return t + " " + n;
        },
        getColorLichHoc(r) {
            if (r.state == "CO") {
                return ""
            } else {
                return "table-secondary"
            }
        },
        getLichHoc() {
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                    query {
                        allVariables(where: {
                            key: "LICH_HOC_${this.year}_${this.month}"
                        }){
                            id
                            key
                            value
                        }
                    }
                    `
            }).then(data => {
                // console.log(data);
                if (data.data.allVariables.length > 0) {
                    that.variable = data.data.allVariables[0];
                    that.lichhoc = JSON.parse(that.variable.value)
                    // console.log(that.lichhoc);
                    that.stateLichHoc = "DONE";
                } else {
                    location.href = "/lichhoc?year=" + that.year + "&month=" + that.month;
                }
            }).catch(err => {
                console.log(err);
            });
        },
    },
    mounted() {
        var that = this;
        getPhieuDiemDanh(this.$apolloProvider.defaultClient, `${this.year}_${this.month}`, this.type, this.idLopHoc)
        .then(data => {
            console.log(data);
            that.diemdanhs = data;
        }).catch(err => {
            console.log(err);
        })
    },
    created() {
        if (typeof window !== undefined) {
            // this.getPhieuDiemDanh();
            this.getLichHoc();
        }
    },
}
</script>