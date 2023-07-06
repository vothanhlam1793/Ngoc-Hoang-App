<template>
    <div class="row my-3">
        <div class="col">
            <div class="">
                <h2>Thông tin học sinh</h2>
            </div>
            <div class="">
                <ul class="list-group">
                    <li 
                        class="list-group-item" 
                        v-for="lophoc in lophocs" 
                        :key="lophoc.id"
                        v-if="checkLopHoc(lophoc)"    
                        @click="$router.push(`/hocsinh/lophoc/${lophoc.id}`)"
                    >
                        <a>{{ lophoc.name }}</a>
                    </li>                    
                </ul>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    data(){
        var d = new Date();
        return {
            year: (d.getFullYear()),
            month: ("0" + (d.getMonth() + 1)).substring(("0" + (d.getMonth() + 1)).length - 2, ("0" + (d.getMonth() + 1)).length),
            lhs: []
        }
    },
    methods: {
        checkRole(slugs){
            var ret = false;
            this.roles.forEach(function(e1){
            slugs.forEach(function(e2){
                if(e1 == e2){
                ret = true;
                }
            });
            })
            return ret;
        },
        checkLopHoc(lh){
            var ret = false;
            if(this.checkRole(['giao-vien'])){
                console.log(this.$store.state.user);
                this.$store.state.user.user.lophoc.forEach(function(lophoc){
                    if(lophoc.id == lh.id){
                        ret = true;
                    }
                })
            }
            return ret;
        }
    },
    mounted(){
        this.$store.dispatch("createhocsinh/getLopHoc");
    },
    watch: {
        lophocs: function(newLH, oldLH){
        },
        roles: function(newR, oldR){
            this.$forceUpdate();
        }
    },
    computed:{
        lophocs(){
            return  this.$store.state.createhocsinh.lophocs;
        },
        roles(){
            return this.$store.state.user.roles;
        }
    },
    layout: "app"
}
</script>