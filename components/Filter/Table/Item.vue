<template>
    <div class="row">
        <div class="col">
            <div class="row" @click="run()">
                <div class="col-6">
                    <p>{{ hocsinh.name }}</p>
                </div>
                <div class="col-3">
                    <p>{{ hocsinh.lophoc.name }}</p>
                </div>
                <div class="col-3 text-right">
                    <p>{{ numberWithCommas(hocsinh.parent.debt) }}</p>
                </div>
            </div>
            <div class="row">
                <div class="col p-2">
                    <div :id="'demo' + hocsinh.id" class="collapse p-3 border border-secondary rounded">
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <a class="nav-link active" data-toggle="tab" :href="'#home' + hocsinh.id">Thông tin</a>
                            </li>
                            <li class="nav-item">
                                <a 

                                class="nav-link" data-toggle="tab" :href="'#menu1' + hocsinh.id">Công nợ 1</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" :href="'#menu2'+hocsinh.id">Phụ huynh</a>
                            </li>
                        </ul>

                        <!-- Tab panes -->
                        <div class="tab-content border border-topborder-secondary rounded">
                            <div class="tab-pane container active" :id="'home' + hocsinh.id">
                                <Info :hocsinh="hocsinh" />
                            </div>
                            <div class="tab-pane container fade" :id="'menu1' + hocsinh.id"
                                @click="load"
                            >
                                <Debt :hocsinh="hocsinh" 
                                :loadData="loadDataDebt"
                                />
                            </div>
                            <div class="tab-pane container fade" :id="'menu2'+hocsinh.id">
                                <Parent 
                                    :hocsinh="hocsinh"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Info from '~/components/Filter/Table/Info/Index.vue';
import Debt from '~/components/Filter/Table/Debt/Index.vue';
import Parent from '~/components/HocSinh/Info.vue';
export default {
    components: {
        Info,
        Debt,
        Parent
    },
    data: () => {
        return {
            loadDataDebt: false
        }
    },
    methods: {
        loadData(){
            console.log("LOAD-DATA", this.hocsinh);
            if(this.loadDataDebt){

            } else {
                this.loadDataDebt = true;
            }
        },
        numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        run() {
            // Đóng tất cả các TAB lại
            var cols = $('.collapse');
            for (var j = 0; j < cols.length; j++) {
                $(cols[j]).collapse('hide');
            }
            $('#demo' + this.hocsinh.id).collapse('toggle');
        }
    },
    props: ['hocsinh']
}
</script>