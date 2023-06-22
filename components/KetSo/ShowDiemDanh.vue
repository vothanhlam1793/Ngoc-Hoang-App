<template>
    <div class="table-bordered">
        <table class="" v-if="stateResult">
            <thead>
                <tr>
                    <th>Tên</th>
                    <th
                        v-for="r, i in result"
                        :key="i"
                        class="p-1"
                    >{{ String(i).padStart(2, '0') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Lịch học</td>
                    <td
                    v-for="r, i in result"
                    :key="i"
                    :class="getColorLichHoc(r)"
                    ></td>                    
                </tr>
                <tr>
                    <td
                        class="p-1"
                    >{{ hocsinh.hocsinh.name }}</td>
                    <td
                    v-for="r, i in result"
                    :key="i"
                    :class="getColorDiHoc(r)"
                    >{{ getValueDiHoc(r) }}</td>                    
                </tr>
            </tbody>
            <tbody>

            </tbody>
        </table>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    props: ['hocsinh', 'type', 'month', 'year'],
    data(){
        return {
            diemdanhs: [],
            lichhoc: [],
            stateLichHoc: "NONE",
            stateDiemDanh: "NONE",
            result: [],
            stateResult: false
        }
    },
    created(){
        if(typeof window !== undefined){
            this.getPhieuDiemDanh();
            this.getLichHoc();
        }
    },
    watch: {
        stateDiemDanh: function(n, o){
            if(n == "DONE" && this.stateLichHoc == "DONE"){
                this.calculate();
            }
        },
        stateLichHoc: function(n, o){
            if(n == "DONE" && this.stateDiemDanh == "DONE"){
                this.calculate();
            }   
        }
    },
    methods: {
        getColorDiHoc(r){
            if(r.result == "2"){
                return "table-danger"
            }
            if(r.result == "3"){
                return "table-success"
            }
            return "table-secondary";
        },
        getValueDiHoc(r){
            if(r.result == "2"){
                return "K"
            }
            if(r.result == "3"){
                return "C"
            }
        },
        getColorLichHoc(r){
            if(r.state == "CO"){
                return ""
            } else {
                return "table-secondary"
            }
        },
        calculate(){
            var dates = [];
            for(var j = 0; j < this.lichhoc.length; j++){
                if(this.lichhoc[j].state == "CO"){
                    // Ket qua la 2 hoac 3
                    let code = `${this.year}_${this.month}_${this.lichhoc[j].date}`;
                    let temp = false;
                    let index = this.diemdanhs.findIndex(function(item){
                        // return item.
                        return item.code == code;
                    });
                    if(index != -1){
                        // Có đi học
                        dates.push("3");
                    } else {
                        // Nghi hoc
                        dates.push("2");
                    }
                } else {
                    // Ket qua bang 0
                    dates.push("0");
                }
                this.result[this.lichhoc[j].date] = {
                    state: this.lichhoc[j].state,
                    result: dates[j]
                }
            }
            for(var j = 0; j < this.lichhoc.length; j++){
                if(this.result[j] == undefined){
                    this.result[j] = {
                        state: "KHONG",
                        result: "2"
                    }
                }
            }
            this.stateResult = true;
        },
        getPhieuDiemDanh(){
            var that = this;
            var client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    allDiemDanhs(where: {
                        AND: [{
                        type: "${this.type}"
                        }, {
                        co_some: {
                            id: "${this.hocsinh.hocsinh.id}"
                        }
                        }]
                    }){
                        id
                        code
                        type
                    }
                }
                `
            }).then(data => {
                that.diemdanhs = data.data.allDiemDanhs;
                that.stateDiemDanh = "DONE";
            }).catch(err => {
                console.log(err);
            })
        },
        getLichHoc(){
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
                    if(data.data.allVariables.length > 0){
                        that.variable = data.data.allVariables[0];  
                        that.lichhoc = JSON.parse(that.variable.value)
                        that.stateLichHoc = "DONE";
                    } else {
                        location.href = "/lichhoc?year=" + that.year + "&month=" + that.month;
                    }
                }).catch(err => {
                    console.log(err);
                });
        },
    }
}
</script>