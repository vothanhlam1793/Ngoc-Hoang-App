<template>
    <div class="row">
        <div class="col p-3">
            <FindByName />
            <Index :hocsinhs="filterHocsinhs"></Index>
        </div>
    </div>
</template>
<script>
import Index from '~/components/Filter/Table/Index.vue';
import FindByName from '~/components/Filter/Table/FindByName.vue';
function chuyentiengviet(str) {
    if (str == undefined) {
        return "";
    }
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
export default {
    components: {
        Index,
        FindByName
    },
    data: () => {
        return {
            filterHocsinhs: []
        }
    },
    methods: {
        filterByName: function (n, o) {
            var changeSearchReg = chuyentiengviet(this.findByName).split(" ").join("[ -w]+");
            var reg = new RegExp(changeSearchReg, "i");
            this.filterHocsinhs = this.hocsinhs.filter(function (hocsinh) {
                var temp = [hocsinh.name, hocsinh.lophoc.name];
                return reg.test(chuyentiengviet(temp.join(" ")));
            });
        }
    },
    watch: {
        findByName: {
            handler: function (n, o) {
                this.filterByName();
            },
            immediate: true
        },
        hocsinhs: {
            handler: function(n, o){
                this.filterByName();
            }
        }
    },
    computed: {
        findByName() {
            return this.$store.state.filter.list.findByName;
        }
    },
    mounted() {
        if (typeof window !== 'undefined') {
            this.filterByName();
        }
    },
    props: ['hocsinhs']
}
</script>