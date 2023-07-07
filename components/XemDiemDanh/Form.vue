<template>
    <div class="">
        <table class="table-bordered" data-spy="scroll" data-target=".black" data-offset="50">
            <thead class="black"> 
                <tr>
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
                    <td class="">Lịch học</td>
                    <td
                    v-for="r, i in lichhoc"
                    :key="i"
                    :class="getColorLichHoc(r)"
                    ></td>                    
                </tr>
                <Item v-for="hocsinh in hocsinhs" :key="hocsinh.id" :hocsinh="hocsinh" :type="type" :month="month"
                    :year="year" :lichhoc="lichhoc" :stateLichHoc="stateLichHoc" />
            </tbody>
        </table>
    </div>
</template>
<script>
import gql from 'graphql-tag'
import Item from '~/components/XemDiemDanh/Item.vue';
export default {
    components: {
        Item
    },
    props: ['month', 'year', 'type', 'hocsinhs'],
    data() {
        return {
            // hocsinhs: [{
            //     name: "Nguyễn Lê Khánh An",
            //     id: "649c5ed04350495522dd70d9"
            // }],
            lichhoc: [],
            stateLichHoc: "NONE",
            variable: {},
            // year: "2023",
            // month: "07",
            // type: "DIHOCHANGNGAY"
        }
    },
    methods: {
        getColorLichHoc(r){
            if(r.state == "CO"){
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

    },
    created() {
        if (typeof window !== undefined) {
            // this.getPhieuDiemDanh();
            this.getLichHoc();
        }
    },
}
</script>