<template>
    <div class="row">
        <div class="col">
            <div class="row mb-3">
                <div class="col p-2">
                    <a 
                        class="btn btn-secondary"
                    :href="getHref()">Lui về</a>
                </div>
                <div class=" col p-2"
                    v-if="date == undefined"
                >
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="usr">Năm</label>
                                <select 
                                    class="form-control"
                                    v-model="formYear"
                                    @change="changeHref()"
                                >
                                    <option
                                    v-for="i in 5"
                                    :value="(2023 + i - 1).toString()"
                                    >{{ 2023 + i - 1 }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="usr">Tháng</label>
                                <select 
                                    class="form-control"
                                    v-model="formMonth"
                                    @change="changeHref()"
                                >
                                    <option
                                        v-for="i in 12"
                                        :value="subStr(i, 2)"
                                    >Tháng {{ i }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            formYear: "",
            formMonth: "",
            year: "",
            month: "",
            date: "",
            id: "",
            func: "",
        }
    },
    methods: {
        changeHref(){
          console.log(location);
          location.href = ["", this.func, this.formYear, this.formMonth, this.id].join("/");  
        },
        getHref(){
            if(this.date == undefined){
                return ["", this.func].join("/");
            } else {
                return ["", this.func, this.year, this.month, this.id].join("/");
            }
        },
        subStr(value, len){
            var ret = "0000" + value;
            ret = ret.substring(ret.length -len, ret.length);
            return ret;
        }
    },
    created(){
        this.year = this.$route.params.year;
        this.formYear = this.year;
        this.month = this.$route.params.month;
        this.formMonth = this.month;
        this.date = this.$route.params.date;
        this.id = this.$route.params.id;
        this.func = this.$route.path.split("/")[1];
    }
}
</script>