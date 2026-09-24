<template>
  <div class="container-fluid py-3">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="font-weight-bold mb-1">
          <i class="fas fa-calendar-check text-success mr-2"></i> Điểm Danh Hàng Ngày
        </h4>
        <p class="text-muted small mb-0">Chọn lớp học để ghi nhận chuyên cần, bữa ăn và theo dõi các bé trong tháng {{ month }}/{{ year }}</p>
      </div>
      <div>
        <span class="badge badge-light border px-3 py-2 text-primary font-weight-bold">
          Tháng {{ month }}/{{ year }}
        </span>
      </div>
    </div>

    <!-- Danh sách lớp học dạng Cards -->
    <div class="row">
      <div
        v-for="lophoc in lophocs"
        :key="lophoc.id"
        v-if="checkLopHoc(lophoc)"
        class="col-md-6 col-lg-4 mb-3"
      >
        <div
          class="class-card card shadow-sm border-0 h-100 p-3"
          @click="$router.push(`/dihoc/${year}/${month}/${lophoc.id}`)"
        >
          <div class="d-flex align-items-center mb-3">
            <div class="class-icon bg-success-light text-success mr-3">
              <i class="fas fa-chalkboard"></i>
            </div>
            <div>
              <h5 class="font-weight-bold text-dark mb-0">{{ lophoc.name }}</h5>
              <small class="text-muted">Mã lớp: {{ lophoc.code || lophoc.id.substring(0, 6) }}</small>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
            <span class="small text-muted"><i class="fas fa-calendar-alt mr-1"></i> Sổ điểm danh</span>
            <span class="btn btn-sm btn-outline-success rounded-pill px-3">
              Vào lớp <i class="fas fa-arrow-right ml-1"></i>
            </span>
          </div>
        </div>
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
            if(this.checkRole(['quan-tri-vien', 'hieu-truong', 'hieu-pho', 'ke-toan'])){
                return true;
            }
            if(this.checkRole(['giao-vien'])){
                // console.log(this.$store.state.user);
                if(this.$store.state.user && this.$store.state.user.user && this.$store.state.user.user.lophoc){
                    this.$store.state.user.user.lophoc.forEach(function(lophoc){
                        if(lophoc.id == lh.id){
                            ret = true;
                        }
                    })
                }
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
<style scoped>
.class-card {
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s ease-in-out;
}
.class-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
}
.class-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}
.bg-success-light {
  background-color: rgba(25, 135, 84, 0.12);
}
</style>
