<template>
  <div class="container-fluid py-3 pb-5 ketso-class-detail">
    <!-- Top Nav Back & Title Header -->
    <div class="card border-0 shadow-sm rounded-lg mb-3 bg-white p-3">
      <div class="d-flex flex-wrap justify-content-between align-items-center">
        <div class="d-flex align-items-center mb-2 mb-md-0">
          <nuxt-link
            :to="`/ketso/${year}/${month}`"
            class="btn btn-sm btn-light border rounded-pill px-3 font-weight-bold text-secondary mr-3"
            title="Quay lại danh sách lớp"
          >
            <i class="fas fa-arrow-left mr-1"></i> Danh sách lớp
          </nuxt-link>
          <div>
            <h4 class="font-weight-bold text-dark mb-0">
              KẾT SỔ LỚP {{ className }} • THÁNG {{ month }}/{{ year }}
            </h4>
            <span class="text-muted small">
              Kiểm tra số ngày nghỉ, các khoản phí bù trừ và chốt học phí cho {{ studentList.length }} học sinh
            </span>
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <!-- Button Thêm phí mở rộng -->
          <button
            type="button"
            class="btn btn-sm btn-outline-info font-weight-bold rounded-pill px-3 mr-2 shadow-sm"
            @click="show = true"
          >
            <i class="fas fa-plus-circle mr-1"></i> Phí mở rộng
          </button>

          <!-- Button Lưu Lại có Loading Feedback -->
          <button
            type="button"
            class="btn btn-sm btn-success font-weight-bold rounded-pill px-4 shadow-sm"
            :disabled="saving"
            @click="saveChanged"
          >
            <i class="fas" :class="saving ? 'fa-spinner fa-spin mr-1' : 'fa-save mr-1'"></i>
            {{ saving ? 'Đang lưu kết sổ...' : 'Lưu lại & Chốt sổ' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Financial Counters của Lớp -->
    <div class="row mb-3">
      <div class="col-6 col-md-3 mb-2 mb-md-0">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100 border-left-primary">
          <span class="text-muted small font-weight-bold text-uppercase d-block">Sĩ số lớp</span>
          <span class="h4 font-weight-bold text-dark mb-0">{{ studentList.length }} <small class="text-muted font-weight-normal" style="font-size: 0.9rem;">bé</small></span>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-2 mb-md-0">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100 border-left-info">
          <span class="text-muted small font-weight-bold text-uppercase d-block">Tổng học phí gốc</span>
          <span class="h4 font-weight-bold text-info mb-0">{{ formatMoney(totalBaseTuition) }} đ</span>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-2 mb-md-0">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100 border-left-danger">
          <span class="text-muted small font-weight-bold text-uppercase d-block">Tổng tiền trừ nghỉ</span>
          <span class="h4 font-weight-bold text-danger mb-0">-{{ formatMoney(totalAbsentRefund) }} đ</span>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-2 mb-md-0">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100 border-left-success">
          <span class="text-muted small font-weight-bold text-uppercase d-block">Tổng thực thu dự kiến</span>
          <span class="h4 font-weight-bold text-success mb-0">{{ formatMoney(totalNetReceivable) }} đ</span>
        </div>
      </div>
    </div>

    <!-- Modal Phí Mở Rộng -->
    <b-modal v-model="show" title="Các khoản phí mở rộng của trường" ok-only ok-title="Xong" size="lg">
      <div class="table-responsive">
        <table class="table table-bordered table-hover mb-0">
          <thead class="thead-light">
            <tr>
              <th style="width: 50px;" class="text-center">STT</th>
              <th>Khoản phí mở rộng</th>
              <th class="text-right" style="width: 180px;">Số tiền (đ)</th>
              <th class="text-center" style="width: 120px;">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pmr, pidx) in pmrs" :key="pmr.idValue || pidx">
              <td class="text-center text-muted font-weight-bold">{{ pidx + 1 }}</td>
              <td class="font-weight-semibold text-dark">{{ pmr.label }}</td>
              <td class="text-right font-weight-bold text-primary">{{ formatMoney(pmr.value) }} đ</td>
              <td class="text-center">
                <button
                  type="button"
                  v-if="pmr.checked"
                  class="btn btn-sm btn-danger rounded-pill px-3 font-weight-bold"
                  @click="handleCheckboxChange(pmr)"
                >
                  <i class="fas fa-times mr-1"></i> Hủy
                </button>
                <button
                  type="button"
                  v-else
                  class="btn btn-sm btn-outline-success rounded-pill px-3 font-weight-bold"
                  @click="handleCheckboxChange(pmr)"
                >
                  <i class="fas fa-check mr-1"></i> Chọn
                </button>
              </td>
            </tr>
            <tr v-if="!pmrs.length">
              <td colspan="4" class="text-center py-4 text-muted">Chưa cấu hình danh mục phí mở rộng trong cài đặt.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>

    <!-- Main Calculation Table -->
    <div class="card border-0 shadow-sm rounded-lg overflow-hidden bg-white mb-4">
      <div class="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
        <h6 class="font-weight-bold text-dark mb-0">
          <i class="fas fa-calculator text-success mr-2"></i> Bảng Tính Chi Tiết Từng Bé
        </h6>
        <div class="d-flex align-items-center">
          <small class="text-muted mr-3">CSVC toàn lớp:</small>
          <select
            v-model="csvc"
            class="form-control form-control-sm font-weight-bold rounded-pill"
            style="width: 140px;"
            @change="$store.commit('ketso/updateStateCSVC', csvc)"
          >
            <option value="NONE">Không thu CSVC</option>
            <option value="HALF">Thu 1/2 CSVC</option>
            <option value="FULL">Thu nguyên CSVC</option>
          </select>
        </div>
      </div>

      <div class="table-responsive table-sticky-wrapper">
        <table class="table table-bordered table-hover align-middle mb-0 fee-calc-table">
          <thead class="thead-light sticky-header">
            <tr class="text-center small font-weight-bold text-uppercase">
              <th style="min-width: 170px;" class="text-left sticky-col-first">Họ và Tên Bé</th>
              <th style="min-width: 110px;" class="text-success text-right">Tổng Thu (đ)</th>
              <th style="min-width: 100px;">Học Phí</th>
              <th style="min-width: 90px;">CSVC</th>
              <th style="min-width: 85px;">Camera</th>
              <th style="min-width: 95px;">Phí Mở Rộng</th>
              <th style="min-width: 85px;">Khoản Khác</th>
              <th style="min-width: 120px;">Diễn Giải</th>
              <th style="min-width: 75px;">Nghỉ (ngày)</th>
              <th style="min-width: 100px;" class="text-danger text-right">Trừ Tiền Nghỉ</th>
            </tr>
          </thead>
          <tbody>
            <KetSoElement
              v-for="item in studentList"
              :key="item.id"
              :item="item"
              :month="month"
              :year="year"
              :pmrs="pmrs"
              :statePmrs="statePmrs"
            />
            <tr v-if="!studentList.length">
              <td colspan="10" class="text-center py-5 text-muted">
                <i class="fas fa-spinner fa-spin mr-1"></i> Đang tải dữ liệu học sinh của lớp...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import ShowDiemDanh from '~/components/KetSo/ShowDiemDanh.vue';
import { getVariablesStartWithKey } from '~/plugins/variable.js';

export default {
  layout: 'app',
  components: {
    ShowDiemDanh
  },
  data() {
    return {
      csvc: 'NONE',
      year: '',
      month: '',
      idLopHoc: '',
      pmrs: [],
      statePmrs: 0,
      show: false,
      saving: false
    };
  },
  computed: {
    phieuketso() {
      return this.$store.state.pks.phieuketso || {};
    },
    className() {
      return this.phieuketso?.lophoc?.name || '...';
    },
    studentList() {
      const items = this.phieuketso?.items;
      if (!items || !items.length) return [];
      const copy = [...items];
      const that = this;
      copy.sort((a, b) => {
        const t = (a.hocsinh?.name || '').trim().split(' ');
        const u = (b.hocsinh?.name || '').trim().split(' ');
        const lastNameA = that.chuyentiengviet(t[t.length - 1]);
        const lastNameB = that.chuyentiengviet(u[u.length - 1]);
        return lastNameA.localeCompare(lastNameB);
      });
      return copy;
    },
    totalBaseTuition() {
      return this.studentList.reduce((sum, item) => sum + (Number(item.hocphi) || 0), 0);
    },
    totalAbsentRefund() {
      return this.studentList.reduce((sum, item) => sum + (Number(item.thanhtiennghi) || 0), 0);
    },
    totalNetReceivable() {
      return this.studentList.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    }
  },
  mounted() {
    this.year = this.$route.params.year;
    this.month = this.$route.params.month;
    this.idLopHoc = this.$route.params.id;

    this.$store.commit('pks/updateCode', `${this.year}_${this.month}`);
    this.$store.commit('pks/updateIdLopHoc', this.idLopHoc);
    this.$store.dispatch('pks/createOrUpdatePhieuKetSo');
    this.getPhiMoRongs();
  },
  methods: {
    formatMoney(val) {
      return Number(val || 0).toLocaleString('vi-VN');
    },
    handleCheckboxChange(pmr) {
      pmr.checked = !pmr.checked;
      this.statePmrs += 1;
    },
    chuyentiengviet(str) {
      if (!str) return '';
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    },
    async saveChanged() {
      if (this.saving) return;
      this.saving = true;
      try {
        await this.$store.dispatch('pks/updatePhieuKetSo');
      } catch (e) {
        console.error('Error saving phieu ket so:', e);
        alert('Lỗi lưu kết sổ: ' + (e.message || 'Lỗi kết nối'));
        this.saving = false;
      }
    },
    parseKey(key) {
      const parts = key.split('_');
      const part2 = parts.slice(1, -1).join('_');
      const part3 = parts[parts.length - 1];
      return { key: part2, value: part3 };
    },
    updatePMRs(variables) {
      const that = this;
      const pmrs = {};
      variables.forEach(variable => {
        const p = that.parseKey(variable.key);
        if (!pmrs[p.key]) {
          pmrs[p.key] = { key: p.key };
        }
        pmrs[p.key][p.value] = variable.value;
        pmrs[p.key]['ID' + p.value] = variable.id;
      });
      that.pmrs = [];
      for (const key in pmrs) {
        if (Object.prototype.hasOwnProperty.call(pmrs, key)) {
          that.pmrs.push({
            idLabel: pmrs[key].IDLABEL,
            idValue: pmrs[key].IDVALUE,
            idType: pmrs[key].IDTYPE,
            label: pmrs[key].LABEL,
            value: pmrs[key].VALUE,
            type: pmrs[key].TYPE,
            key: pmrs[key].key,
            state: 'IDLE',
            checked: false
          });
        }
      }
    },
    getPhiMoRongs() {
      const client = this.$apollo?.defaultClient || this.$apolloProvider?.defaultClient;
      if (!client) return;
      getVariablesStartWithKey(client, 'MR_')
        .then(data => {
          this.updatePMRs(data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style scoped>
.ketso-class-detail {
  min-height: 85vh;
}

.border-left-primary { border-left: 4px solid #007bff !important; }
.border-left-info { border-left: 4px solid #17a2b8 !important; }
.border-left-danger { border-left: 4px solid #dc3545 !important; }
.border-left-success { border-left: 4px solid #28a745 !important; }

/* Sticky Container with Max Height */
.table-sticky-wrapper {
  max-height: 68vh;
  overflow-y: auto;
  overflow-x: auto;
  position: relative;
}

/* Sticky Header (Vertical) */
.fee-calc-table thead.sticky-header th {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f8f9fa !important;
  box-shadow: inset 0 -1px 0 #dee2e6, 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Sticky First Column (Horizontal Freeze) */
.fee-calc-table thead th.sticky-col-first {
  position: sticky;
  left: 0;
  top: 0;
  z-index: 15;
  background-color: #f1f3f5 !important;
  box-shadow: inset -1px 0 0 #dee2e6, inset 0 -1px 0 #dee2e6, 2px 0 4px rgba(0, 0, 0, 0.04);
}

.fee-calc-table th,
.fee-calc-table td {
  vertical-align: middle;
  padding: 0.45rem 0.5rem;
  font-size: 0.9rem;
}
</style>
