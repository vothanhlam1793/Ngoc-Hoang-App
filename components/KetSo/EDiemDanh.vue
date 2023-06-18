<template>
    <td>
        {{ numberWithCommas(ngaynghilientiep) }}
    </td>
</template>
<script>
import gql from 'graphql-tag'
// let client = this.$apolloProvider.defaultClient;
export default {
    props: ['item', 'type'],
    data(){
        return {
            diemdanhs: [],
            year: "",
            month: "",
            lichhoc: [],
            variable: {},
            stateLichHoc: "NONE",
            stateDiemDanh: "NONE",
            dates: [],
            counts: {
                "0": 0,
                "2": 0,
                "3": 0
            },
            priceNghi: 0,
            ngaynghilientiep: 0,
            total: 0
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
        numberWithCommas(x) {
            if(x){
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
                return 0;
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
            }
            this.dates = dates;
            this.counts = {
                "0": 0,
                "2": 0,
                "3": 0
            };
            var dateOff = 0;
            // console.log(this.item.hocsinh.name, this.dates);
            for (let i = 0; i < this.dates.length; i++) {
                this.counts[this.dates[i]] = this.counts[this.dates[i]] ? this.counts[this.dates[i]] + 1 : 1;
                switch(this.dates[i]){
                    case "2": {
                        // Nghi hoc
                        dateOff += 1;
                    } break;
                    case "3": {
                        // Di hoc   
                        if(dateOff > 2){
                            this.ngaynghilientiep += (dateOff - 2);
                        }
                        dateOff = 0;
                    } break;
                    case "0": {
                        // Truong nghi

                    } break;
                    default: {
                        // Khong biet

                    }
                }
            }
            if(dateOff > 2){
                this.ngaynghilientiep += (dateOff - 2);
            }
            dateOff = 0;
            // console.log(this.item.hocsinh.name, this.dates, this.ngaynghilientiep);
            this.getNghiLienTiep();
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
                            id: "${this.item.hocsinh.id}"
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
                    // console.log(data);
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
        getNghiLienTiep(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    allVariables(where: {
                        key: "NGHI_LIEN_TIEP"
                    }){
                        id
                        key
                        value
                    }
                }
                `
            }).then(data => {
                if(data.data.allVariables.length > 0){
                    that.priceNghi = parseInt(data.data.allVariables[0].value) | 0;
                    that.total = that.ngaynghilientiep * that.priceNghi;
                    that.$store.commit("pks/updateNghiLienTiep", {
                        item: that.item,
                        total: that.total,
                        ngaynghi: that.ngaynghilientiep
                    })
                } else {
                    that.priceNghi = 0;
                }
            }).catch(err => {
                console.log(err);
            });
        }
    },
    created(){
        this.getPhieuDiemDanh();    
        this.month = this.$route.params.month;
        this.year = this.$route.params.year;
        this.getLichHoc();
    }
}
</script>