<template>
    <div class="row">
        <div class="col">
            <div class="row my-2">
                <div class="col">
                    <a
                        class="btn btn-secondary"
                        :href="`/vetre/18g`"
                    > << Lui về </a>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <ViewDiemDanh 
                        :diemdanh="diemdanh"
                    ></ViewDiemDanh>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import gql from 'graphql-tag'
import ViewDiemDanh from '~/components/NgoaiGio/Detail.vue';
export default {
    components: {
        ViewDiemDanh
    },
    layout: "app",
    data(){
        return {
            idDiemDanh: "",
            diemdanh: {}
        }
    },
    methods: {
        getDiemDanh(){
            var that = this;
            let client = this.$apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
  allDiemDanhs(where: {
    id: "${this.idDiemDanh}"
  }) {
        id
    date
    co {
      id
      name
      lophoc {
        id
        name
      }
      status
    }
  }
}
                `
            }).then(data => {
                that.diemdanh = data.data.allDiemDanhs[0];
            }).catch(err => {
                console.log(err);
            });
        }
    },
    created(){
        console.log(this.$route.query);
        this.idDiemDanh = this.$route.query.id;
        this.getDiemDanh();
    }
}
</script>