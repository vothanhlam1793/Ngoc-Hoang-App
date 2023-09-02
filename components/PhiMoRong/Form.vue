<template>
    <div class="row">
        <div class="col">
            <div class="row">
                <div class="col">
                    <h4>Phí mở rộng</h4>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <table class="table table-bordered table-striped">
                        <tr>
                            <th>Tên</th>
                            <th>Giá tiền</th>
                            <th>Loại</th>
                            <th></th>
                        </tr>
                        <tr v-for="pmr in pmrs">
                            <td>{{ pmr.label }}</td>
                            <td v-if="pmr.state == 'EDIT'">
                                <input 
                                class="form-control"
                                    v-model="pmr.value"
                                />
                            </td>
                            <td v-else>{{ pmr.value }}</td>
                            <td v-if="pmr.state == 'EDIT'">
                                <select
                                    class="form-control"
                                    v-model="pmr.type"
                                >
                                    <option value="NORMAL">Chung</option>
                                    <option value="YEAR">Theo năm sinh</option>
                                </select>
                            </td>
                            <td
                                v-else
                            >{{ pmr.type }}</td>
                            <td v-if="pmr.state == 'EDIT'">
                                <button
                                    @click="save(pmr)"
                                >
                                    Lưu lại
                                </button>
                            </td>
                            <td v-else>
                                <button
                                    @click="edit(pmr)"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input 
                                    class="form-control border"
                                    v-model="label"
                                />
                            </td>
                            <td>
                                <input 
                                    class="form-control border"
                                    v-model="value"
                                />
                            </td>
                            <td>
                                <select
                                    class="form-control"
                                    v-model="type"
                                >
                                    <option value="NORMAL">Chung</option>
                                    <option value="YEAR">Theo năm sinh</option>
                                </select>
                            </td>
                            <td>
                                <button
                                    class="btn btn-primary"
                                    v-if="value !== '' || label !== '' || type !== ''"
                                    @click="createPhiMoRong"
                                >
                                    Tạo mới
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Index from '~/components/Filter/Table/Index.vue';
import { createVariable, updateVariable, getVariablesStartWithKey } from '~/plugins/variable.js'
export default {
    components: {
        Index
    },
    data(){
        return {
            pmrs: [],
            key: "",
            label: "", 
            value: "",
            type: ""
        }
    },
    methods: {
        async save(pmr){
            await updateVariable(this.$apolloProvider.defaultClient, {
                key: `MR_${pmr.key}_VALUE`,
                value: pmr.value,
                id: pmr.idValue
            });
            await updateVariable(this.$apolloProvider.defaultClient, {
                key: `MR_${pmr.key}_TYPE`,
                value: pmr.type,
                id: pmr.idType
            });
            await updateVariable(this.$apolloProvider.defaultClient, {
                key: `MR_${pmr.key}_LABEL`,
                value: pmr.label,
                id: pmr.idLabel
            });
            pmr.state = "IDLE";
        },
        edit(pmr){
            console.log(pmr)
            pmr.state = "EDIT";
        },
        parseKey(key){
            var parts = key.split("_");
            var part1 = parts[0]; // MR
            var part2 = parts.slice(1, -1).join("_"); // bo_him_y_t
            var part3 = parts[parts.length - 1]; // VALUE
            return {
                key: part2,
                value: part3
            }
        },
        updatePMRs(variables){
            var that = this;
            var pmrs = {};
            variables.forEach(function(variable){
                let p = that.parseKey(variable.key);
                if(pmrs[p.key] == undefined){
                    pmrs[p.key] = {
                        key: p.key
                    };
                }
                pmrs[p.key][p.value] = variable.value;
                pmrs[p.key]["ID" + p.value] = variable.id;
            });
            that.pmrs = [];
            for (const key in pmrs) {
                if (pmrs.hasOwnProperty(key)) {
                    that.pmrs.push({ 
                        idLabel: pmrs[key].IDLABEL,
                        idValue: pmrs[key].IDVALUE,
                        idType: pmrs[key].IDTYPE,
                        label: pmrs[key].LABEL,
                        value: pmrs[key].VALUE,
                        type: pmrs[key].TYPE,
                        key: pmrs[key].key,
                        state: "IDLE"
                    });
                }
            }
            return arr;
        },
        getPhiMoRongs(){
            var that = this;
            getVariablesStartWithKey(this.$apolloProvider.defaultClient, "MR_")
            .then(data => {
                that.updatePMRs(data);
            }).catch(err => {
                console.log(err);
            });
        },
        async createPhiMoRong(){
            var slug = this.label
                .toLowerCase() // Chuyển chuỗi thành chữ thường
                .replace(/\s+/g, '_') // Thay thế khoảng trắng bằng gạch dưới (_)
                .replace(/[^\w-]+/g, '') // Loại bỏ tất cả các ký tự không phải chữ cái, số, gạch dưới, hoặc gạch ngang
                .replace(/-+/g, '_') // Thay thế nhiều gạch ngang liên tiếp bằng một gạch dưới
                .replace(/^-+/, '') // Loại bỏ các ký tự gạch dưới ở đầu chuỗi
                .replace(/-+$/, ''); // Loại bỏ các ký tự gạch dưới ở cuối chuỗi
            let a = await createVariable(this.$apolloProvider.defaultClient, {
                item: "",
                idItem: "",
                value: this.label,
                key: `MR_${slug}_LABEL`
            });
            let b = await createVariable(this.$apolloProvider.defaultClient, {
                item: "",
                idItem: "",
                value: this.value,
                key: `MR_${slug}_VALUE`
            });
            let c = await createVariable(this.$apolloProvider.defaultClient, {
                item: "",
                idItem: "",
                value: this.type,
                key: `MR_${slug}_TYPE`
            });
            console.log(a,b,c);
        }
    },
    mounted(){
        this.getPhiMoRongs();
    }
}
</script>