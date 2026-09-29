<template>
  <div class="container-fluid py-3 ketsonghihoc-page">
    <!-- Header -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb bg-transparent p-0 mb-1 small">
            <li class="breadcrumb-item"><nuxt-link to="/">Trang chủ</nuxt-link></li>
            <li class="breadcrumb-item"><nuxt-link to="/ketso">Kết sổ</nuxt-link></li>
            <li class="breadcrumb-item active">Kết sổ nghỉ học</li>
          </ol>
        </nav>
        <h1 class="h4 mb-0 font-weight-bold text-dark">
          <i class="fas fa-user-minus text-danger mr-2"></i>Kết Sổ Nghỉ Học & Quyết Toán Thôi Học
        </h1>
      </div>
      <div class="d-flex flex-wrap gap-2 mt-2 mt-md-0">
        <nuxt-link to="/hoadon" class="btn btn-sm btn-outline-primary font-weight-bold mr-2 shadow-sm">
          <i class="fas fa-file-invoice-dollar mr-1"></i> Hóa đơn & Bán hàng
        </nuxt-link>
        <nuxt-link to="/no" class="btn btn-sm btn-outline-info font-weight-bold shadow-sm">
          <i class="fas fa-user-friends mr-1"></i> Sổ nợ phụ huynh
        </nuxt-link>
      </div>
    </div>

    <div class="row">
      <!-- CỘT TRÁI: CHỌN HỌC SINH & ĐỐI SOÁT CHI TIẾT -->
      <div class="col-lg-8 mb-3">
        <!-- Khối 1: Chọn Học Sinh & Kỳ Quyết Toán -->
        <div class="card border-0 shadow-sm rounded-lg mb-3 bg-white">
          <div class="card-header bg-white py-2 border-bottom d-flex justify-content-between align-items-center">
            <span class="font-weight-bold text-dark small text-uppercase">
              <i class="fas fa-user-check text-primary mr-1"></i> 1. Học sinh thôi học & Kỳ quyết toán
            </span>
            <div class="d-flex align-items-center">
              <span class="small font-weight-bold text-muted mr-2">Kỳ thôi học:</span>
              <input
                v-model="billingMonth"
                type="month"
                class="form-control form-control-sm font-weight-bold"
                style="max-width: 150px;"
                @change="onMonthChange"
              />
            </div>
          </div>
          <div class="card-body py-2">
            <!-- Ô tìm kiếm học sinh nhanh -->
            <div class="position-relative mb-2">
              <div class="input-group input-group-sm">
                <div class="input-group-prepend">
                  <span class="input-group-text bg-light border-right-0"><i class="fas fa-search text-muted"></i></span>
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control form-control-sm border-left-0"
                  placeholder="Tìm tên bé, SĐT, Mã PH (ví dụ: an, binh, 0909, PH001)..."
                  @focus="searchFocused = true"
                />
                <div class="input-group-append" v-if="searchQuery">
                  <button class="btn btn-outline-secondary" type="button" @click="searchQuery = ''">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>

              <!-- Dropdown kết quả tìm kiếm -->
              <div
                v-if="searchFocused && filteredStudents.length"
                class="search-results-dropdown shadow border rounded bg-white position-absolute w-100 p-1"
                style="z-index: 1050; max-height: 260px; overflow-y: auto;"
              >
                <div
                  v-for="s in filteredStudents.slice(0, 10)"
                  :key="s.id"
                  class="search-item p-2 border-bottom cursor-pointer rounded hover-bg-light"
                  @mousedown="selectStudent(s)"
                >
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong class="text-dark">{{ s.name }}</strong>
                      <span class="badge badge-light border ml-1">{{ s.lophoc ? s.lophoc.name : 'Chưa xếp lớp' }}</span>
                      <span class="badge ml-1" :class="s.status === 'NGHI_LUON' ? 'badge-danger' : 'badge-success'">
                        {{ s.status === 'NGHI_LUON' ? 'Đã nghỉ học' : 'Đang học' }}
                      </span>
                      <div class="small text-muted mt-1">
                        PH: <strong>{{ s.parent ? s.parent.name : '—' }}</strong>
                        <span v-if="s.parent && s.parent.code" class="badge badge-danger ml-1">{{ s.parent.code }}</span>
                        <span v-if="s.parentPhoneText" class="ml-1 text-primary">({{ s.parentPhoneText }})</span>
                      </div>
                    </div>
                    <div class="text-right">
                      <span class="badge" :class="(s.parent && s.parent.balance > 0) ? 'badge-success' : 'badge-light border'">
                        Ví: {{ formatMoney(s.parent ? s.parent.balance : 0) }} đ
                      </span>
                      <button type="button" class="btn btn-xs btn-primary d-block mt-1 ml-auto">Chọn</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Thẻ học sinh đã chọn -->
            <div v-if="selectedStudent" class="bg-light p-2 rounded border small">
              <div class="d-flex flex-wrap justify-content-between align-items-center">
                <div>
                  <strong class="text-dark font-weight-bold" style="font-size: 0.95rem;">{{ selectedStudent.name }}</strong>
                  <span class="badge badge-info ml-1">{{ selectedStudent.lophoc ? selectedStudent.lophoc.name : 'Chưa xếp lớp' }}</span>
                  <span class="text-muted ml-2">PH: <strong>{{ selectedStudent.parent ? selectedStudent.parent.name : '—' }}</strong></span>
                  <span v-if="selectedParentPhone" class="text-muted">({{ selectedParentPhone }})</span>
                </div>
                <div class="mt-1 mt-md-0">
                  <span class="badge badge-danger px-2 py-1 mr-2">{{ selectedParentCode }}</span>
                  <span>Ví khả dụng: <strong :class="selectedParentBalance > 0 ? 'text-success' : 'text-muted'">{{ formatMoney(selectedParentBalance) }} đ</strong></span>
                </div>
              </div>
            </div>
            <div v-else class="text-muted small py-3 text-center border rounded border-dashed bg-light">
              <i class="fas fa-search mr-1"></i> Vui lòng tìm và chọn bé thôi học để hệ thống tự động đối soát.
            </div>
          </div>
        </div>

        <!-- Khối 2: Bảng Đối Soát Chi Tiết Quyết Toán -->
        <div class="card border-0 shadow-sm rounded-lg mb-3 bg-white" v-if="selectedStudent">
          <div class="card-header bg-white py-2 border-bottom d-flex justify-content-between align-items-center">
            <span class="font-weight-bold text-dark small text-uppercase">
              <i class="fas fa-calculator text-success mr-1"></i> 2. Bảng đối soát chi phí & Tiền đã đóng
            </span>
            <span class="badge badge-info" v-if="loadingPreview">
              <i class="fas fa-spinner fa-spin mr-1"></i> Đang tính toán...
            </span>
          </div>
          <div class="card-body p-3">
            <div class="row">
              <!-- Cột A: Tiền đã đóng / Có sẵn -->
              <div class="col-md-6 mb-3">
                <div class="p-2 border rounded bg-light h-100">
                  <h6 class="font-weight-bold text-primary small text-uppercase border-bottom pb-1 mb-2">
                    <i class="fas fa-wallet mr-1"></i> I. Tiền phụ huynh đã nộp
                  </h6>
                  <div class="form-group mb-2">
                    <label class="small text-muted mb-1 font-weight-bold">Học phí tháng {{ billingMonth }} đã đóng (đ)</label>
                    <input
                      v-model.number="calc.paidTuition"
                      type="number"
                      step="1000"
                      class="form-control form-control-sm font-weight-bold text-success"
                      placeholder="0"
                    />
                    <small class="text-muted">Tự động lấy từ hóa đơn / học phí đã thu.</small>
                  </div>
                  <div class="d-flex justify-content-between py-1 border-top small">
                    <span class="text-muted">Số dư ví hiện có:</span>
                    <strong class="text-success">{{ formatMoney(selectedParentBalance) }} đ</strong>
                  </div>
                  <div class="d-flex justify-content-between py-2 border-top bg-white px-2 rounded mt-2 font-weight-bold small">
                    <span>TỔNG TIỀN ĐÃ CÓ:</span>
                    <span class="text-success">{{ formatMoney(totalAvailable) }} đ</span>
                  </div>
                </div>
              </div>

              <!-- Cột B: Chi phí thực tế sử dụng -->
              <div class="col-md-6 mb-3">
                <div class="p-2 border rounded bg-light h-100">
                  <h6 class="font-weight-bold text-danger small text-uppercase border-bottom pb-1 mb-2">
                    <i class="fas fa-receipt mr-1"></i> II. Chi phí thực tế bé sử dụng
                  </h6>
                  <div class="form-group mb-2">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <label class="small text-muted mb-0 font-weight-bold">Số ngày đi học thực tế</label>
                      <span class="badge badge-primary">{{ calc.actualDays }} ngày</span>
                    </div>
                    <div class="input-group input-group-sm">
                      <input
                        v-model.number="calc.actualDays"
                        type="number"
                        min="0"
                        max="31"
                        class="form-control form-control-sm font-weight-bold text-center"
                        @input="recalculateDailyTuition"
                      />
                      <div class="input-group-append">
                        <span class="input-group-text small">ngày</span>
                      </div>
                    </div>
                  </div>

                  <div class="form-group mb-2">
                    <label class="small text-muted mb-1 font-weight-bold">Tiền học phí ngày thực tế (đ)</label>
                    <input
                      v-model.number="calc.actualTuition"
                      type="number"
                      step="1000"
                      class="form-control form-control-sm font-weight-bold text-danger"
                    />
                  </div>

                  <div class="row no-gutters">
                    <div class="col-6 pr-1 form-group mb-2">
                      <label class="small text-muted mb-1">Ăn chiều (đ)</label>
                      <input
                        v-model.number="calc.anChieuAmount"
                        type="number"
                        step="1000"
                        class="form-control form-control-sm font-weight-bold"
                      />
                    </div>
                    <div class="col-6 pl-1 form-group mb-2">
                      <label class="small text-muted mb-1">Về trễ / Ngoài giờ (đ)</label>
                      <input
                        v-model.number="calc.veTreAmount"
                        type="number"
                        step="1000"
                        class="form-control form-control-sm font-weight-bold"
                      />
                    </div>
                  </div>

                  <div class="form-group mb-2">
                    <label class="small text-muted mb-1">Camera (đ)</label>
                    <input
                      v-model.number="calc.cameraAmount"
                      type="number"
                      step="1000"
                      class="form-control form-control-sm font-weight-bold"
                    />
                  </div>

                  <div class="d-flex justify-content-between py-2 border-top bg-white px-2 rounded mt-2 font-weight-bold small">
                    <span>TỔNG CHI PHÍ THỰC TẾ:</span>
                    <span class="text-danger">{{ formatMoney(totalActualCost) }} đ</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dòng Giảm trừ / Thỏa thuận khác -->
            <div class="row align-items-center border-top pt-2">
              <div class="col-md-6">
                <span class="small font-weight-bold text-muted">Giảm trừ / Thỏa thuận riêng (đ):</span>
              </div>
              <div class="col-md-6 text-right">
                <input
                  v-model.number="calc.discount"
                  type="number"
                  step="1000"
                  class="form-control form-control-sm text-right text-danger font-weight-bold d-inline-block"
                  style="max-width: 160px;"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CỘT PHẢI: KẾT QUẢ QUYẾT TOÁN & XỬ LÝ DÒNG TIỀN -->
      <div class="col-lg-4 mb-3">
        <div class="card border-0 shadow-sm rounded-lg bg-white sticky-top" style="top: 1rem;">
          <div class="card-header bg-dark text-white py-2">
            <h6 class="font-weight-bold mb-0 text-uppercase small">
              <i class="fas fa-balance-scale mr-1"></i> Kết Quả Quyết Toán Thôi Học
            </h6>
          </div>
          <div class="card-body p-3">
            <!-- Box Kết quả làm nổi bật -->
            <div
              class="p-3 rounded mb-3 text-center border"
              :class="isRefund ? 'bg-success-light border-success text-success' : 'bg-warning-light border-warning text-dark'"
            >
              <div class="small font-weight-bold text-uppercase mb-1">
                {{ isRefund ? '🟢 Nhà trường hoàn tiền cho PH' : '🔴 Phụ huynh cần nộp thêm' }}
              </div>
              <div class="h3 font-weight-bold mb-0" :class="isRefund ? 'text-success' : 'text-danger'">
                {{ formatMoney(settlementAmount) }} đ
              </div>
            </div>

            <!-- Tóm tắt số liệu -->
            <div class="small mb-3">
              <div class="d-flex justify-content-between py-1 border-bottom">
                <span class="text-muted">Tổng tiền đã có:</span>
                <strong class="text-success">+ {{ formatMoney(totalAvailable) }} đ</strong>
              </div>
              <div class="d-flex justify-content-between py-1 border-bottom">
                <span class="text-muted">Tổng chi phí thực tế:</span>
                <strong class="text-danger">- {{ formatMoney(totalActualCost) }} đ</strong>
              </div>
              <div class="d-flex justify-content-between py-1 border-bottom" v-if="calc.discount > 0">
                <span class="text-muted">Giảm trừ thỏa thuận:</span>
                <strong class="text-danger">- {{ formatMoney(calc.discount) }} đ</strong>
              </div>
            </div>

            <!-- Chọn phương thức xử lý dòng tiền -->
            <div class="mb-3">
              <label class="font-weight-bold small text-muted mb-2 text-uppercase">Phương thức xử lý dòng tiền</label>
              
              <!-- Nếu là HOÀN TIỀN -->
              <div v-if="isRefund">
                <div class="custom-control custom-radio mb-2">
                  <input type="radio" id="refCash" value="REFUND_CASH" v-model="settlementAction" class="custom-control-input" />
                  <label class="custom-control-label small font-weight-bold text-success cursor-pointer" for="refCash">
                    💵 Chi tiền mặt hoàn trả phụ huynh
                  </label>
                </div>
                <div class="custom-control custom-radio mb-2">
                  <input type="radio" id="refBank" value="REFUND_BANK" v-model="settlementAction" class="custom-control-input" />
                  <label class="custom-control-label small font-weight-bold text-primary cursor-pointer" for="refBank">
                    🏦 Chuyển khoản ngân hàng hoàn tiền
                  </label>
                </div>
              </div>

              <!-- Nếu là THU THÊM TIỀN -->
              <div v-else>
                <div class="custom-control custom-radio mb-2">
                  <input type="radio" id="colCash" value="COLLECT_CASH" v-model="settlementAction" class="custom-control-input" />
                  <label class="custom-control-label small font-weight-bold text-success cursor-pointer" for="colCash">
                    💵 Thu tiền mặt trực tiếp
                  </label>
                </div>
                <div class="custom-control custom-radio mb-2">
                  <input type="radio" id="colQr" value="COLLECT_ACB_QR" v-model="settlementAction" class="custom-control-input" />
                  <label class="custom-control-label small font-weight-bold text-primary cursor-pointer" for="colQr">
                    📱 Phụ huynh chuyển khoản VietQR ACB
                  </label>
                </div>
              </div>
            </div>

            <!-- Tùy chọn trạng thái học sinh -->
            <div class="form-group mb-3 pt-2 border-top">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="chkInactive" v-model="markInactive" />
                <label class="custom-control-label small font-weight-bold text-danger cursor-pointer" for="chkInactive">
                  Đánh dấu bé sang trạng thái "Đã nghỉ học" (NGHI_LUON)
                </label>
              </div>
              <small class="text-muted d-block mt-1">Bé sẽ không xuất hiện trong danh sách điểm danh và kết sổ các tháng sau.</small>
            </div>

            <!-- Ghi chú -->
            <div class="form-group mb-3">
              <input
                v-model.trim="settlementNote"
                type="text"
                class="form-control form-control-sm"
                placeholder="Ghi chú thanh lý thôi học..."
              />
            </div>

            <!-- Nút bấm xác nhận -->
            <button
              type="button"
              class="btn btn-danger btn-block font-weight-bold py-2 shadow-sm"
              :disabled="submitting || !selectedStudent"
              @click="submitWithdrawalSettlement"
            >
              <i class="fas" :class="submitting ? 'fa-spinner fa-spin mr-1' : 'fa-check-circle mr-1'"></i>
              {{ submitting ? 'Đang quyết toán...' : 'Xác Nhận Kết Sổ & In Biên Bản' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL IN BIÊN BẢN THANH LÝ THÔI HỌC -->
    <WithdrawalModal v-model="showReceiptModal" :receipt="currentReceipt" />
  </div>
</template>

<script>
import { paymentHubRequest } from '~/utils/paymentHub';
import WithdrawalModal from '~/components/KetSo/WithdrawalModal.vue';
import gql from 'graphql-tag';

function removeVietnameseTones(str) {
  if (!str) return '';
  str = String(str).toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  return str;
}

export default {
  layout: 'app',
  components: {
    WithdrawalModal,
  },
  data() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return {
      billingMonth: `${y}-${m}`,
      studentList: [],
      selectedStudentId: '',
      searchQuery: '',
      searchFocused: false,
      loadingPreview: false,
      submitting: false,
      markInactive: true,
      settlementAction: 'REFUND_CASH',
      settlementNote: '',
      tuitionFeesMap: {},
      calc: {
        actualDays: 10,
        actualTuition: 0,
        anChieuAmount: 0,
        veTreAmount: 0,
        cameraAmount: 0,
        paidTuition: 0,
        discount: 0,
        dailyStandard: 0,
      },
      showReceiptModal: false,
      currentReceipt: {},
    };
  },
  computed: {
    filteredStudents() {
      if (!this.searchQuery) return [];
      const q = removeVietnameseTones(this.searchQuery);
      return this.studentList.filter(s => {
        const sName = removeVietnameseTones(s.name);
        const pName = removeVietnameseTones(s.parent ? s.parent.name : '');
        const pCode = removeVietnameseTones(s.parent ? s.parent.code : '');
        const pPhone = s.parentPhoneText || '';
        return sName.includes(q) || pName.includes(q) || pCode.includes(q) || pPhone.includes(q);
      });
    },
    selectedStudent() {
      return this.studentList.find(s => String(s.id) === String(this.selectedStudentId)) || null;
    },
    selectedParentCode() {
      const p = this.selectedStudent ? this.selectedStudent.parent : null;
      return (p && p.code) || 'PH0000';
    },
    selectedParentPhone() {
      return this.selectedStudent ? this.selectedStudent.parentPhoneText : '';
    },
    selectedParentBalance() {
      const p = this.selectedStudent ? this.selectedStudent.parent : null;
      return (p && Number(p.balance)) || 0;
    },
    totalAvailable() {
      return (Number(this.calc.paidTuition) || 0) + this.selectedParentBalance;
    },
    totalActualCost() {
      return (
        (Number(this.calc.actualTuition) || 0) +
        (Number(this.calc.anChieuAmount) || 0) +
        (Number(this.calc.veTreAmount) || 0) +
        (Number(this.calc.cameraAmount) || 0)
      );
    },
    rawNet() {
      return this.totalAvailable - this.totalActualCost - (Number(this.calc.discount) || 0);
    },
    isRefund() {
      return this.rawNet >= 0;
    },
    settlementAmount() {
      return Math.abs(this.rawNet);
    },
  },
  watch: {
    isRefund(newVal) {
      if (newVal) {
        if (!['REFUND_CASH', 'REFUND_BANK'].includes(this.settlementAction)) {
          this.settlementAction = 'REFUND_CASH';
        }
      } else {
        if (!['COLLECT_CASH', 'COLLECT_ACB_QR'].includes(this.settlementAction)) {
          this.settlementAction = 'COLLECT_CASH';
        }
      }
    },
  },
  mounted() {
    this.loadStudentsAndFees();
  },
  methods: {
    async loadStudentsAndFees() {
      try {
        const client = this.$apolloProvider.defaultClient;
        const res = await client.query({
          query: gql`
            query {
              allStudents(sortBy: name_ASC) {
                id name sName birthday namhocphi hocphigiam status
                parent { id name code balance phone { number } }
                lophoc { id name }
              }
              allVariables(where: { key_starts_with: "HPN_" }) { key value }
            }
          `,
          fetchPolicy: 'network-only',
        });

        const rawStudents = (res.data && res.data.allStudents) || [];
        this.studentList = rawStudents.map(s => {
          const phones = (s.parent && s.parent.phone) || [];
          const phoneNumbers = phones.map(p => p.number).filter(Boolean).join(', ');
          return {
            ...s,
            parentPhoneText: phoneNumbers,
          };
        });

        const feeMap = {};
        const vars = (res.data && res.data.allVariables) || [];
        for (const v of vars) {
          feeMap[v.key] = Number(v.value) || 0;
        }
        this.tuitionFeesMap = feeMap;
      } catch (err) {
        console.error('Lỗi tải danh sách học sinh:', err);
      }
    },
    selectStudent(s) {
      this.selectedStudentId = s.id;
      this.searchQuery = s.name;
      this.searchFocused = false;
      this.fetchWithdrawalPreview();
    },
    onMonthChange() {
      if (this.selectedStudentId) {
        this.fetchWithdrawalPreview();
      }
    },
    async fetchWithdrawalPreview() {
      if (!this.selectedStudentId) return;
      this.loadingPreview = true;
      try {
        const parts = this.billingMonth.split('-');
        const year = parts[0];
        const month = parts[1];
        const res = await paymentHubRequest(this, 'get', 'settlements/withdrawal-preview', {
          params: { studentId: this.selectedStudentId, month, year },
        });

        const previewData = res.data?.data || {};
        const c = previewData.calculation || {};

        this.calc.actualDays = c.actualDays || 10;
        this.calc.actualTuition = c.actualTuition || 0;
        this.calc.anChieuAmount = c.anChieuAmount || 0;
        this.calc.veTreAmount = c.veTreAmount || 0;
        this.calc.cameraAmount = c.cameraAmount || 0;
        this.calc.paidTuition = c.paidTuition || 0;
        this.calc.discount = 0;
        this.calc.dailyStandard = (previewData.student && previewData.student.dailyTuitionStandard) || 0;
      } catch (err) {
        console.error('Lỗi lấy preview kết sổ thôi học:', err);
        // Fallback tự tính nếu API gặp sự cố
        const s = this.selectedStudent;
        const key = (s && s.namhocphi) || 'HPN_2026';
        const base = this.tuitionFeesMap[key] || 3000000;
        const net = Math.max(0, base - (Number(s?.hocphigiam) || 0));
        this.calc.dailyStandard = Math.round(net / 22);
        this.calc.actualDays = 10;
        this.calc.actualTuition = Math.round((net / 22) * 10);
        this.calc.paidTuition = net;
      } finally {
        this.loadingPreview = false;
      }
    },
    recalculateDailyTuition() {
      if (this.calc.dailyStandard > 0) {
        this.calc.actualTuition = Math.round(this.calc.dailyStandard * (Number(this.calc.actualDays) || 0));
      }
    },
    async submitWithdrawalSettlement() {
      if (this.submitting || !this.selectedStudentId) return;
      this.submitting = true;
      try {
        const payload = {
          studentId: this.selectedStudentId,
          billingMonth: this.billingMonth,
          actualDays: Number(this.calc.actualDays) || 0,
          actualTuition: Number(this.calc.actualTuition) || 0,
          anChieuAmount: Number(this.calc.anChieuAmount) || 0,
          veTreAmount: Number(this.calc.veTreAmount) || 0,
          cameraAmount: Number(this.calc.cameraAmount) || 0,
          paidTuition: Number(this.calc.paidTuition) || 0,
          discount: Number(this.calc.discount) || 0,
          settlementAction: this.settlementAction,
          markInactive: this.markInactive,
          note: this.settlementNote,
        };

        const res = await paymentHubRequest(this, 'post', 'settlements/withdrawal', payload);
        const receipt = res.data?.receipt || res.data?.data;
        this.currentReceipt = receipt;
        this.showReceiptModal = true;
        this.$bvToast.toast(`Đã hoàn tất kết sổ nghỉ học cho bé ${receipt.studentName}!`, { variant: 'success', solid: true });
        // Tải lại danh sách học sinh để cập nhật trạng thái
        this.loadStudentsAndFees();
      } catch (err) {
        this.$bvToast.toast(err.response?.data?.error || err.message || 'Lỗi quyết toán thôi học', { variant: 'danger', solid: true });
      } finally {
        this.submitting = false;
      }
    },
    formatMoney(val) {
      return Number(val || 0).toLocaleString('vi-VN');
    },
  },
};
</script>

<style scoped>
.ketsonghihoc-page {
  min-height: 85vh;
}
.btn-xs {
  padding: 0.15rem 0.4rem;
  font-size: 0.75rem;
}
.cursor-pointer {
  cursor: pointer;
}
.search-results-dropdown {
  background-color: #ffffff;
  border-color: #dee2e6;
}
.hover-bg-light:hover {
  background-color: #f1f5f9;
}
.border-dashed {
  border-style: dashed !important;
}
.bg-success-light {
  background-color: #f0fdf4;
}
.bg-warning-light {
  background-color: #fefce8;
}
</style>
