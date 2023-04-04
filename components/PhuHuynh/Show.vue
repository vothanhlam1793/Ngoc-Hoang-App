<template>
    <div class="row">
        <div class="col">
            <div class="row border border-secondary rounded m-3 p-2">
                <div class="col">
                    <h2>{{ parent.name }}</h2>
                </div>
                <div class="col">
                    <h4>Điện thoại</h4>
                    <ul>
                        <li v-for="number in parent.phone">{{ number.number }}</li>
                    </ul>
                </div>
            </div>
            <div class="row border border-secondary rounded m-3 p-2">
                <div class="col">
                    <div class="d-flex justify-content-between mb-3">
                        <div class="p-2"><h4>Học sinh</h4></div>
                            <div class="p-2">
                                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#createHocsinh" @click="createHocsinh()">Thêm học sinh</button>
                            </div>
                    </div>
                    <div class="row" v-if="parent.hocsinhs.length > 0">
                        <div class="col">
                            <HocSinhShowItem v-for="hocsinh in parent.hocsinhs" :key="hocsinh.id" :student="hocsinh" />
                        </div>
                    </div>
                    <div>
                        <div class="modal" id="createHocsinh">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h4 class="modal-title">Tạo học sinh mới</h4>
                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    </div>
                                    <!-- Modal body -->
                                    <div class="modal-body">                    
                                        <AppCreateHocSinh />
                                    </div>
                                </div>
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

        }
    },
    methods: {
        createHocsinh(){
            console.log(this.parent);
            this.$store.commit("createhocsinh/updatePhuHuynh", this.parent);
        }
    },
    watch: {
        stateCreateHocSinh: function(newState, oldState){
            if(newState == "DONE"){
                location.reload();
            }
        }
    },
    computed: {
        stateCreateHocSinh(){
            return this.$store.state.createhocsinh.state;
        }
    },
    props: ['parent']
}
</script>