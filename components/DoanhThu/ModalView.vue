<template>
<div>
    <p>Tổng: {{ $formatTotal(phieuketso.total) }} - Chưa thu: {{ $formatTotal(phieuketso.debt) }}</p>
    <b-table
        :fields="fields"
        :items="phieuketso.items"
    >
    <template #cell(index)="data">
      {{ data.index + 1 }}
    </template>
    </b-table>
</div>
</template>
<script>
export default {
    props: ['phieuketso'],
    watch: {
        phieuketso: function(n, o){

        }
    },
    data(){
        return {
            fields: [
            {
          key: 'index', // Định nghĩa key cho cột STT
          label: 'STT', // Nhãn cột STT
        },
                {
                    label: "Tên học sinh",
                    key: "hocsinh.name"
                }, {
                    label: "Tổng",
                    key: "object.total",
                    formatter: this.$formatTotal,
                    sortable: true, // Cho phép sắp xếp theo cột này
                    tdClass: "text-right"

                }, {
                    label: "Còn nợ",
                    key: "hocsinh.parent.debt",
                    formatter: this.$formatTotal,
                    sortable: true, // Cho phép sắp xếp theo cột này
                    tdClass: "text-right"

                }, {
                    label: "Trạng thái",
                    key: "hocsinh.status"
                }
            ]
        }
    }
}
</script>