<template>
    <td>
        <div>
            {{ numberWithCommas(ngaynghilientiep) }}
            <button type="button" data-toggle="modal" :data-target="`#myModal${item.hocsinh.id}`">
                V
            </button>
            <div class="modal" :id="`myModal${item.hocsinh.id}`">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">

                        <!-- Modal Header -->
                        <div class="modal-header">
                            <h4 class="modal-title">{{ item.hocsinh.name }} - Tháng {{ month }} / {{ year }}</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>

                        <!-- Modal body -->
                        <div class="modal-body">
                            <div class="table-responsive">
                                <ShowDiemDanh 
                                    @update-data="updateResult" 
                                    :hocsinh="item" 
                                    :type="type" 
                                    :year="year" 
                                    :month="month" 
                                />
                            </div>
                        </div>

                        <!-- Modal footer -->
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Đóng</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </td>
</template>
<script>
import gql from 'graphql-tag'
import ShowDiemDanh from '~/components/KetSo/ShowDiemDanh.vue';
export default {
    components: {
        ShowDiemDanh
    },
    props: ['item', 'type', 'month', 'year'],
    data() {
        return {
            result: [],
            ngaynghilientiep: 0,
            total: 0
        }
    },
    watch: {
       
    },
    methods: {
        updateResult(result){
            console.log("RESULT: ",result);
            // Loc ra nhung ngay di hoc
            this.result = result.filter(function(r){
                return r.state == "CO";
            });

            // cho chay va dem
            var count = 0;
            var totalCount = 0;
            for(var j = 0; j < this.result.length; j++){
                if(this.result[j].result == "2"){
                    count += 1;
                } else {
                    count = 0;
                }
                if(count == 3){
                    totalCount += 3;
                } else if(count > 3){
                    totalCount += 1;
                } else {
                    totalCount += 0;
                }
                console.log(j, this.result[j].date, this.result[j].result, count, totalCount);
            }
            this.ngaynghilientiep = totalCount;
            console.log(this.ngaynghilientiep, this.result)
            this.getNghiLienTiep();
        },
        numberWithCommas(x) {
            if (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
                return 0;
            }
        },
        getNghiLienTiep() {
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
                if (data.data.allVariables.length > 0) {
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
    created() {
    }
}
</script>