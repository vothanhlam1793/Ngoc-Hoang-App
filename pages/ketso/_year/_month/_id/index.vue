<template>
    <div class="row">
        <div class="col">
                <div>
                    <button class="btn btn-secondary"
                        @click="$store.commit('ketso/updateStateCSVC', 'NONE')"
                    >NONE</button>
                    <button class="btn btn-danger"
                    @click="$store.commit('ketso/updateStateCSVC', 'FULL')"
                    >FULL</button>
                    <button class="btn btn-warning"
                    @click="$store.commit('ketso/updateStateCSVC', 'HALF')"
                    >HALF</button>
                </div>
                <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th style="width: 10%">Tên</th>
                                        <th style="width: 5%">Tổng</th>
                                        <th>Học phí</th> 
                                        <th>CSVC</th>
                                        <th>Camera</th>
                                        <th>Đồng phục</th>
                                        <th>Balo</th>
                                        <th>Ngoài giờ</th>
                                        <th>Ăn 4g45</th>
                                        <th>Khác</th>
                                        <th>Diễn giải</th>
                                        <th>Ngày nghỉ</th>
                                        <th>Tiền nghỉ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <KetSoElement 
                                        v-for="item in phieuketso.items"
                                        :item="item"
                                        :key="item.id"
                                    ></KetSoElement>
                                </tbody>
                            </table>
            
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
export default {
    data(){
        return {
            year: "",
            month: "",
            idLopHoc: "",
            phieuketso: {},
        }
    },
    methods: {
        createOrUpdatePhieuKetSo(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.mutate({
                mutation: gql`
                mutation {
                    createOrUpdatePhieuKetSo(code: "${this.year}_${this.month}", idLopHoc: "${this.idLopHoc}"){
                        message
                        content
                        data {
                        id
                        status
                        items {
                            id
                            data
                            code
                            lophoc {
                            id
                            }
                            hocsinh {
                                id
                                name
                                namhocphi
                                hocphigiam
                                luuy
                                status
                                parent {
                                    id
                                    phone {
                                        number
                                        id
                                        name
                                    }
                                }
                            }
                            total
                        }
                        }
                    }
                }
                `
            }).then(data => {
                console.log(data);
                if(data.data.createOrUpdatePhieuKetSo.message == "SUCCESS"){
                    that.phieuketso = data.data.createOrUpdatePhieuKetSo.data;
                } else {
                    console.log(data.data.createOrUpdatePhieuKetSo.message, data.data.createOrUpdatePhieuKetSo.content);    
                }
            }).then(err => {
                console.log(err);
            })
        }
    },
    mounted(){
        this.year = this.$route.params.year;
        this.month = this.$route.params.month;
        this.idLopHoc = this.$route.params.id;
        this.createOrUpdatePhieuKetSo();
        this.$store.dispatch("hocphi/getInfoHocPhi");
    },
    layout: "app"
}
</script>