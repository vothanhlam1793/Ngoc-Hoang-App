<template>
    <tr>
        <td style="width: 5%;" class="text-center">{{ index }}</td>
        <td style="width: 50%;" >
            <div class="" v-if="sanpham.type == 'HOC_PHI_THANG'">
                <div v-if="hocsinh.id == undefined">
                    <div class="alert alert-danger">
                        <p>Học phí tháng cần chọn học sinh</p>
                    </div>
                </div>
                <div class="" v-else>
                    <div class="form-group">
                        <label for="usr">Học phí tháng:</label>
                        <select
                            class="form-control"
                            v-model="hocphithang"
                        >
                            <option 
                                v-for="month in getMonth()"
                                :value="month"
                            >{{ month.split("_").join("/") }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="" v-else>
                {{ sanpham.name }}
            </div>
        </td>
        <td style="width: 10%;"  class="text-center"  @dblclick="editWithModal(price, 'amount')">{{ numberWithCommas(amount) }}
            <ModalEditInput 
                :id="`amount${sanpham.id}`"
                :value="amount"
                @update-data="updateAmount"
            />
        </td>
        <td style="width: 15%;"  class="text-right pl-3" @dblclick="editWithModal(price, 'price')">{{ numberWithCommas(price) }}
            <ModalEditInput 
                :id="`price${sanpham.id}`"
                :value="price"
                @update-data="updatePrice"
            />
        </td>
        <td style="width: 20%;"  class="text-right pl-3">{{ numberWithCommas(amount * price) }}</td>
    </tr>
</template>
<script>
import ModalEditInput from '~/components/Support/ModalEditInput.vue';
export default {
    props: ['sanpham', 'index'],
    components: {
        ModalEditInput
    },
    watch: {
        hocsinh: {
            immediate: true,
            handler: function(nV, oV){
                this.tinhhocphi();
            }
        },
        hocphithang: function(nV, oV){
            this.tinhhocphi();
            this.$store.commit("hd/updateHocPhiThang", this.hocphithang);
        }
    },
    computed: {
        hocsinh(){
            return this.$store.state.hd.hocsinh;
        },
        hocphis(){
            console.log(this.$store.hocphi);
            return this.$store.state.hocphi.hocphis;
        }
    },
    methods: {
        tinhhocphi(){
            // console.log("TINH-HOC-PHÍ");
            if(this.sanpham.type != "HOC_PHI_THANG"){
                return;
            }

            var hp = 0;
            var that = this;
            this.hocphis.forEach(function(e){
                console.log(e);
                if(that.hocsinh.namhocphi == e.key){
                    hp = e.value;
                }
            });
            var g=parseInt(that.hocsinh.hocphigiam);
            if( g >= 0){
                 
            } else {
                g = 0;
            }
            // console.log("TINH-HOC-PHÍ", this.hocphis, that.hocsinh, hp-g);
            this.updatePrice(hp-g);
        },
        numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        editWithModal(value, name){
            console.log(this.sanpham.id, value, name);
            console.log(`myModal${name}${this.sanpham.id}`);
            $(`#myModal${name}${this.sanpham.id}`).modal('show');
        },
        updatePrice(price){
            this.price = price;
            this.$store.commit("hd/updateElement", {
                sanpham: this.sanpham,
                amount: this.amount,
                price: this.price,
            })
        },
        updateAmount(amount){
            this.amount = amount;
            this.$store.commit("hd/updateElement", {
                sanpham: this.sanpham,
                amount: this.amount,
                price: this.price,
            })
        },
        getMonth(){
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1; // Tháng tính từ 0, cần +1 để lấy tháng thực tế
            const currentYear = currentDate.getFullYear();

            const months = [];
            for (let i = 1; i < 4; i++) {
                let month = currentMonth + i;
                let year = currentYear;
                if (month > 12) {
                month -= 12;
                year += 1;
                }
                months.push(`${month.toString().padStart(2, '0')}_${year}`);
            }
            console.log(months, "HOS", this.sanpham);
            this.hocphithang = months[0];
            return months;
        }
    },
    data(){
        return {
            amount: 1,
            price: 0,
            hocphithang: ""
        }
    },
    created(){
        // console.log(this.sanpham);
        this.price = this.sanpham.price;
        this.$store.dispatch("hocphi/getInfoHocPhi");
    },
}
</script>