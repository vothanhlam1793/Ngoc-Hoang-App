<template>
    <div class="m-3">
        Sỉ số: {{ hocsinhs.length }}
        <br>
        Điểm danh: {{ co.length }}
    </div>
</template>
<script>
export default {
    data() {
        return {
            co: [],
            khong: []
        }
    },
    watch: {
        monitor: {
            handler: function (nV, oV) {
                this.co = this.hocsinhs.filter(function (hocsinh) {
                    return hocsinh.result == "1";
                })
            }
        }
    },
    computed: {
        hocsinhs() {
            return this.$store.state.ndd.lophoc.hocsinhs || [];
        },
        monitor(){
            return this.$store.state.ndd.monitor;
        }
    }
}
</script>