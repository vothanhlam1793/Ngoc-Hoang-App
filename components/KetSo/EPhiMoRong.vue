<template>
    <td class="text-right">
        <div>
            {{ numberWithCommas(total) }}
            <b-button 
            :key="`btn-${item.id}`"
            @click="showModal(`md-${item.id}`)"
            variant="warning">Chỉnh</b-button>
            <b-modal 
            :key="`md-${item.id}`"
            :id="`md-${item.id}`" 
            :title="item.hocsinh.name" ok-only>
                <table class="table table-bordered table-striped">
                    <tr>
                        <th>Phí</th>
                        <th>Tiền</th>
                        <td></td>
                    </tr>
                    <tr v-for="key in Object.keys(pmr)" :class="getClass(key)">
                        <td>{{ pmr[key].label }}</td>
                        <td>
                            <input
                                class="form-control"
                                v-model="pmr[key].value"
                                @change="calcTotal(true)"
                            />
                        </td>
                        <td>
                            <button class="btn btn-danger" v-if="pmr[key].checked" @click="addLocal(key)">Huỷ</button>
                            <button class="btn btn-success" v-else @click="addLocal(key)">Thêm</button>
                        </td>
                    </tr>
                </table>
            </b-modal>
        </div>
    </td>
</template>
<script>
export default {
    data() {
        return {
            pmr: {

            },
            total: 0
        }
    },
    methods: {
        getClass(key){
            if(this.pmr[key].checked){
                return "table-success"
            } else {
                return ""
            }
        },
        addLocal(key){
            this.pmr[key].checked = !this.pmr[key].checked;
            this.calcTotal();
        },
        calcTotal(local){
            var that = this;
            var total = 0;
            Object.keys(this.pmr).forEach(function(key){
                if(that.pmr[key].checked == true){
                    total += parseInt(that.pmr[key].value);
                }
            });
            that.total = total;
            that.$store.commit("pks/updatePhiMoRong", {
                item: that.item,
                total: that.total,
                detail: that.pmr
            })
        },
        showModal(id){
            this.$bvModal.show(id);
        },
        numberWithCommas(x) {
            if (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
                return 0;
            }
        },
        updatePmrs(){
            var that = this;
            this.pmrs.forEach(function(pmr){
                if(that.pmr[pmr.key] == undefined){
                    that.pmr[pmr.key] = {};
                }
                that.pmr[pmr.key].checked = pmr.checked;
                that.pmr[pmr.key].value = pmr.value;
                that.pmr[pmr.key].label = pmr.label;
            });
            this.calcTotal();
        }
    },
    watch: {
        statePmrs(n,o){
            // console.log(this.statePmrs);
            this.updatePmrs();
        }
    },
    props: ['item', 'pmrs', 'statePmrs'],
    created() {

    },
    computed: {

    }
}
</script>