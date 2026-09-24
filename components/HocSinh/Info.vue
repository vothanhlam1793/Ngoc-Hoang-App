<template>
    <div class="row m-2 p-2">
        <div class="col">
            <div class="row" v-if="sName && sName.value">
                <div class="col">
                    <p class="font-weight-bold">Tên ở nhà: {{ sName.value }}</p>
                </div>
            </div>
            <div v-if="parentPhones.length">
                <table class="table table-bordered text-center mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th>Người liên hệ & SĐT</th>
                            <th>Liên lạc</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(phone, index) in parentPhones" :key="index">
                            <td style="width: 60%;">
                                <strong>{{ phone.name || 'Phụ huynh' }}</strong>
                                <div class="text-primary">{{ phone.number }}</div>
                            </td>
                            <td style="width: 40%;">
                                <a v-if="phone.number" :href="`tel:${phone.number}`" class="btn btn-sm btn-info mr-1" target="_blank" title="Gọi điện">
                                    <i class="fas fa-phone"></i>
                                </a>
                                <a v-if="phone.number" :href="`https://zalo.me/${phone.number}`" class="btn btn-sm btn-primary" target="_blank">
                                    Zalo
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else class="text-muted text-center py-2">
                Chưa có thông tin số điện thoại phụ huynh
            </div>
        </div>
    </div>
</template>
<script>
import {getVariableByKey} from '~/plugins/variable.js'
export default {
    props: ['hocsinh'],
    data() {
        return {
            sName: {},
        }
    },
    computed: {
        parentPhones() {
            if (!this.hocsinh || !this.hocsinh.parent || !this.hocsinh.parent.phone) return [];
            return Array.isArray(this.hocsinh.parent.phone) ? this.hocsinh.parent.phone : [this.hocsinh.parent.phone];
        }
    },
    methods: {
        querySName(){
            if (!this.hocsinh || !this.hocsinh.id) return;
            var that = this;
            getVariableByKey(this.$apolloProvider.defaultClient, {
                item: "Student",
                idItem: this.hocsinh.id,
                key: "SNAME"
            }).then(variable => {
                that.sName = variable;
            }).catch(err => {
                console.log(err);
            });
        },
    },
    mounted(){
        this.querySName();
    }
}
</script>
