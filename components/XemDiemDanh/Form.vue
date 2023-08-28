<template>
    <div class="">
        <div>
            <b-button
                variant="success"
                @click="exportToExcel"
                class="my-3"
            >Tải Excel</b-button>
        </div>
        <table
            class="table-bordered"
            data-spy="scroll"
            data-target=".black"
            data-offset="50"
            id="myTable"
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
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}
import gql from 'graphql-tag'
import Item from '~/components/XemDiemDanh/Item.vue';
import { getPhieuDiemDanh } from '~/plugins/phieudiemdanh.js';
export default {
    components: {
        Item
    },
    props: ['month', 'year', 'type', 'hocsinhs', 'idLopHoc', 'lophoc'],
    data() {
        return {
            lichhoc: [],
            stateLichHoc: "NONE",
            variable: {},
            diemdanhs: [],
        }
    },
    watch: {
        diemdanhs(n, o) {
            this.$forceUpdate();
        }
    },
    methods: {
        getDiHoc(r) {
            let t = 0;
            let n = "";
            var that = this;
            this.diemdanhs.forEach(function (diemdanh) {
                if (diemdanh.code == `${that.year}_${that.month}_${r.date.padStart(2, "0")}`) {
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
        convertToAsciiString(input) {
  // Loại bỏ dấu và chuyển thành chữ thường
  var normalized = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
  // Thay thế khoảng trắng bằng dấu gạch ngang
  var result = normalized.replace(/\s+/g, "-");
  
  return result;
},
        exportToExcel() {
            console.log(this.lophoc);
            var table = document.getElementById("myTable");
            var wb = XLSX.utils.table_to_book(table);
            var wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

            var blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            var url = URL.createObjectURL(blob);

            var a = document.createElement("a");
            a.href = url;
            a.download = `${this.convertToAsciiString(this.lophoc.name)}-${this.year}-${this.month}-${this.type.replace(/\d+$/, "")}.xlsx`;
            a.style.display = "none";
            document.body.appendChild(a);

            a.click();

            setTimeout(function () {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        },
        loadScript(url, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.onload = callback;
            document.head.appendChild(script);
        }
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
        this.loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.1/xlsx.full.min.js", function () {
            });
    },
    created() {
        if (typeof window !== undefined) {
            // this.getPhieuDiemDanh();
            this.getLichHoc();
        }
    },
}
</script>