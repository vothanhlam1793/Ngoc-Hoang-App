<template>
  <div class="debt-detail-container" v-if="phuhuynh">
    <!-- Header Thông tin Phụ huynh & Tổng quan Tài chính -->
    <div class="card border-0 shadow-sm bg-white p-3 mb-3 rounded-lg">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
        <div class="mb-3 mb-md-0">
          <div class="d-flex align-items-center">
            <div class="avatar-ph mr-2 bg-primary text-white">
              <i class="fas fa-user"></i>
            </div>
            <div>
              <h5 class="font-weight-bold text-dark mb-0">{{ phuhuynh.name }}</h5>
              <small class="text-muted">
                Mã PH: <strong class="text-secondary">{{ phuhuynh.code || 'N/A' }}</strong>
                <span v-if="phuhuynh.phone && phuhuynh.phone.length" class="ml-2">
                  <i class="fas fa-phone mr-1"></i>{{ phuhuynh.phone.map(p => p.number || p).join(', ') }}
                </span>
              </small>
            </div>
          </div>
        </div>

        <!-- 2 KPI Cards: Nợ & Số dư ví -->
        <div class="d-flex align-items-center">
          <div class="kpi-mini-card bg-light px-3 py-2 rounded mr-2 text-right">
            <small class="text-muted d-block font-weight-bold">SỐ DƯ VÍ</small>
            <strong class="text-success font-weight-bold">
              +{{ numberWithCommas(phuhuynh.balance || 0) }} đ
            </strong>
          </div>
          <div class="kpi-mini-card bg-light px-3 py-2 rounded mr-3 text-right">
            <small class="text-muted d-block font-weight-bold">CÒN NỢ</small>
            <strong :class="phuhuynh.debt > 0 ? 'text-danger' : 'text-success'" class="font-weight-bold">
              {{ numberWithCommas(phuhuynh.debt || 0) }} đ
            </strong>
          </div>
          <button
            type="button"
            class="btn btn-success rounded-pill px-3 shadow-sm"
            @click="showCreatePaymentModal = true"
          >
            <i class="fas fa-plus mr-1"></i> Thu tiền
          </button>
        </div>
      </div>
    </div>

    <!-- Bảng Sổ nợ & Lịch sử biến động -->
    <div class="card border-0 shadow-sm bg-white rounded-lg">
      <div class="card-header bg-white font-weight-bold d-flex align-items-center py-3 border-bottom">
        <i class="fas fa-history text-primary mr-2"></i> Lịch Sử Biến Động Công Nợ & Hoá Đơn
      </div>
      <div class="card-body p-0">
        <div v-if="!logs || !logs.length" class="text-center py-4 text-muted">
          <i class="fas fa-file-invoice fa-2x mb-2 d-block text-secondary opacity-50"></i>
          Chưa có giao dịch biến động nào được ghi nhận.
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light text-muted small">
              <tr>
                <th style="width: 15%;">NGÀY</th>
                <th style="width: 40%;">LOẠI PHIẾU / NỘI DUNG</th>
                <th style="width: 18%;" class="text-right">BIẾN ĐỘNG</th>
                <th style="width: 18%;" class="text-right">CÒN NỢ</th>
                <th style="width: 9%;" class="text-center">CHI TIẾT</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logs" :key="log.id">
                <td class="small">{{ showDate(log.createdAt) }}</td>
                <td>
                  <span class="font-weight-bold text-dark">{{ getType(log) }}</span>
                </td>
                <td class="text-right font-weight-bold">
                  <span :class="log.valueChange >= 0 ? 'text-danger' : 'text-success'">
                    {{ log.valueChange > 0 ? '+' : '' }}{{ numberWithCommas(log.valueChange) }} đ
                  </span>
                </td>
                <td class="text-right font-weight-bold text-secondary">
                  {{ numberWithCommas(log.value) }} đ
                </td>
                <td class="text-center">
                  <!-- Xem Kết Sổ -->
                  <b-button
                    v-if="log.itemS === 'ItemKetSo'"
                    variant="outline-primary"
                    size="sm"
                    class="rounded-pill px-2 py-0"
                    title="Xem chi tiết kết sổ"
                    @click="showTableKetSo(log)"
                  >
                    <i class="fas fa-eye"></i>
                  </b-button>

                  <!-- Xem Hoá Đơn -->
                  <b-button
                    v-if="log.itemS === 'HoaDon'"
                    variant="outline-info"
                    size="sm"
                    class="rounded-pill px-2 py-0"
                    title="Xem chi tiết hoá đơn"
                    @click="showHoaDon(log)"
                  >
                    <i class="fas fa-file-invoice"></i>
                  </b-button>

                  <!-- Xoá Phiếu Thu -->
                  <b-button
                    v-if="log.itemS === 'PhieuThu'"
                    variant="outline-danger"
                    size="sm"
                    class="rounded-pill px-2 py-0"
                    title="Xoá phiếu thu"
                    @click="deletePhieuThu(log)"
                  >
                    <i class="fas fa-trash"></i>
                  </b-button>

                  <!-- Modal Xem Kết Sổ -->
                  <b-modal
                    size="xl"
                    :id="`modal-${log.id}`"
                    :title="getType(log)"
                    v-if="log.itemS === 'ItemKetSo'"
                    hide-footer
                  >
                    <div v-if="itemKetSo.id" class="p-2">
                      <ShowKSComponent
                        :phieuketso="itemKetSo.phieuketso"
                        :item="itemKetSo"
                      />
                    </div>
                  </b-modal>

                  <!-- Modal Xem Hoá Đơn -->
                  <b-modal
                    size="lg"
                    :id="`modal-hd-${log.id}`"
                    :title="getType(log)"
                    v-if="log.itemS === 'HoaDon'"
                    hide-footer
                  >
                    <ShowHoaDon :idHoaDon="log.idItemS" />
                    <div class="d-flex justify-content-between mt-3 pt-3 border-top">
                      <button @click="deleteHoaDon(log.idItemS)" class="btn btn-outline-danger">
                        <i class="fas fa-trash mr-1"></i> Xoá hoá đơn này
                      </button>
                      <b-button
                        variant="secondary"
                        @click="$bvModal.hide(`modal-hd-${log.id}`)"
                      >Đóng</b-button>
                    </div>
                  </b-modal>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Thu tiền Phụ huynh chuẩn Bootstrap-Vue tích hợp VietQR -->
    <b-modal
      v-model="showCreatePaymentModal"
      size="lg"
      title="Thu Tiền Học Phí & VietQR Phụ Huynh"
      hide-footer
    >
      <div class="p-1">
        <PhieuThuCreate
          :phuhuynh="phuhuynh"
          @update-state="createPhieuThu"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { getItemKetSo } from '~/plugins/itemketso';
import ShowKSComponent from '~/components/KetSo/ShowComponentV2.vue';
import ShowHoaDon from '~/components/HoaDon/Show.vue';
import PhieuThuCreate from '~/components/PhieuThu/Create.vue';

export default {
  components: {
    ShowKSComponent,
    ShowHoaDon,
    PhieuThuCreate,
  },
  props: ['idPhuHuynh', 'loadData'],
  data() {
    return {
      phuhuynh: null,
      logs: [],
      itemKetSo: {},
      showCreatePaymentModal: false,
    };
  },
  methods: {
    deleteHoaDon(idHoaDon) {
      if (confirm('Bạn đang tiến hành xoá hoá đơn - lưu ý, đây là thao tác không phục hồi được. Tiếp tục?')) {
        const client = this.$apolloProvider.defaultClient;
        client
          .mutate({
            mutation: gql`
              mutation {
                deleteHoaDon(id: "${idHoaDon}") {
                  id
                }
              }
            `,
          })
          .then(() => {
            this.$store.dispatch('logv2/getLogsDebt', this.idPhuHuynh);
            this.$store.dispatch('phuhuynhv2/getPhuHuynh', this.idPhuHuynh);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    createPhieuThu(state) {
      if (state === 'CREATED') {
        this.showCreatePaymentModal = false;
        this.$store.dispatch('logv2/getLogsDebt', this.idPhuHuynh);
        this.$store.dispatch('phuhuynhv2/getPhuHuynh', this.idPhuHuynh);
        this.$bvToast.toast('Tạo phiếu thu thành công', {
          title: 'Thành công',
          variant: 'success',
          solid: true,
        });
      }
    },
    showHoaDon(log) {
      this.$bvModal.show(`modal-hd-${log.id}`);
    },
    showTableKetSo(log) {
      getItemKetSo(this.$apolloProvider.defaultClient, log.idItemS)
        .then((data) => {
          this.itemKetSo = data;
          this.itemKetSo.data = JSON.parse(data.data);
          try {
            this.itemKetSo.lophoc = this.itemKetSo.hocsinh.lophoc;
          } catch (err) {
            this.itemKetSo.lophoc = {};
          }
          this.$bvModal.show(`modal-${log.id}`);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    deletePhieuThu(log) {
      if (!confirm('Bạn có chắc chắn muốn xoá phiếu thu này không?')) return;
      const client = this.$apolloProvider.defaultClient;
      client
        .mutate({
          mutation: gql`
            mutation {
              deletePhieuThu(id: "${log.idItemS}") {
                id
              }
            }
          `,
        })
        .then(() => {
          this.$store.dispatch('logv2/getLogsDebt', this.idPhuHuynh);
          this.$store.dispatch('phuhuynhv2/getPhuHuynh', this.idPhuHuynh);
          this.$bvToast.toast('Đã xoá phiếu thu', {
            variant: 'info',
            solid: true,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    showDate(d) {
      if (!d) return '';
      const d1 = new Date(d);
      return `${String(d1.getDate()).padStart(2, '0')}/${String(d1.getMonth() + 1).padStart(2, '0')}/${d1.getFullYear()}`;
    },
    numberWithCommas(x) {
      if (!x && x !== 0) return '0';
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
    getType(log) {
      switch (log.itemS) {
        case 'ItemKetSo': {
          const l = this.getItemKetSo(log);
          if (l) {
            if (l.phieuketso && l.phieuketso.code) {
              const parts = l.phieuketso.code.split('_');
              return `Kết sổ tháng ${parts[1]}/${parts[0]} - ${l.hocsinh ? l.hocsinh.name : ''}`;
            }
            return `${l.code} - ${l.hocsinh ? l.hocsinh.name : ''}`;
          }
          return 'Phiếu kết sổ tháng';
        }
        case 'HoaDon':
          return 'Hoá đơn dịch vụ / Bán lẻ';
        case 'PhieuThu':
          return 'Thu tiền học phí / Nạp ví';
        default:
          return 'Biến động công nợ';
      }
    },
    getItemKetSo(log) {
      if (log.itemS === 'ItemKetSo') {
        return this.$store.state.pkssp.itemKetSoById[log.idItemS];
      }
    },
    reloadData() {
      if (!this.logs) return;
      this.logs.forEach((log) => {
        if (log.itemS === 'ItemKetSo') {
          this.$store.dispatch('pkssp/getPhieuKetSo', log.idItemS);
        }
      });
    },
  },
  watch: {
    loadData() {
      this.reloadData();
    },
    monitorPhuhuynh() {
      this.phuhuynh = this.phuhuynhById[this.idPhuHuynh];
      this.logs = this.logsById[this.idPhuHuynh];
    },
    monitorLog() {
      this.phuhuynh = this.phuhuynhById[this.idPhuHuynh];
      this.logs = this.logsById[this.idPhuHuynh];
      this.reloadData();
    },
  },
  computed: {
    logsById() {
      return this.$store.state.logv2.logs;
    },
    phuhuynhById() {
      return this.$store.state.phuhuynhv2.phuhuynhById;
    },
    monitorPhuhuynh() {
      return this.$store.state.phuhuynhv2.monitor;
    },
    monitorLog() {
      return this.$store.state.logv2.monitor;
    },
  },
  mounted() {
    if (this.idPhuHuynh) {
      this.$store.dispatch('logv2/getLogsDebt', this.idPhuHuynh);
      this.$store.dispatch('phuhuynhv2/getPhuHuynh', this.idPhuHuynh);
    }
  },
};
</script>

<style scoped>
.avatar-ph {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}
.kpi-mini-card {
  border: 1px solid #e2e8f0;
  min-width: 130px;
}
</style>
