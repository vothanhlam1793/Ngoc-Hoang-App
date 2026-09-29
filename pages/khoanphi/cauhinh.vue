<template>
  <div class="container-fluid py-3 fee-config-page">
    <!-- Header -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb bg-transparent p-0 mb-1 small">
            <li class="breadcrumb-item"><nuxt-link to="/khoanphi">Khoản phí</nuxt-link></li>
            <li class="breadcrumb-item active" aria-current="page">Hệ thống cấu hình & Cron</li>
          </ol>
        </nav>
        <h1 class="h4 mb-1 font-weight-bold text-dark">
          <i class="fas fa-sliders-h text-info mr-2"></i>Cấu hình hệ thống khoản phí
        </h1>
        <p class="text-muted mb-0 small">
          Quản lý các danh mục phí tự động (Học phí, Camera) và phí chủ động (Cơ sở vật chất, Phí mở rộng).
        </p>
      </div>
      <div class="d-flex flex-wrap gap-2 mt-2 mt-md-0">
        <button type="button" class="btn btn-outline-info font-weight-bold mr-2 shadow-sm" @click="openRunsModal">
          <i class="fas fa-history mr-1"></i> Nhật ký Cron
        </button>
        <button type="button" class="btn btn-outline-primary font-weight-bold mr-2 shadow-sm" @click="openCreateDefModal">
          <i class="fas fa-plus mr-1"></i> Thêm hạng mục phí
        </button>
        <button type="button" class="btn btn-success font-weight-bold shadow-sm" @click="openManualBulkModal">
          <i class="fas fa-plus-circle mr-1"></i> Tạo phí thủ công ít click
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger shadow-sm d-flex justify-content-between align-items-center">
      <span><i class="fas fa-exclamation-triangle mr-2"></i>{{ error }}</span>
      <button type="button" class="btn btn-sm btn-outline-danger" @click="loadDefinitions">Thử lại</button>
    </div>

    <!-- Main Table of Definitions -->
    <div class="card border-0 shadow-sm rounded-lg mb-4 bg-white">
      <div class="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
        <h6 class="font-weight-bold text-dark mb-0">
          <i class="fas fa-list-check text-primary mr-2"></i> Danh mục các hạng mục khoản phí
        </h6>
        <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="loading" @click="loadDefinitions">
          <i class="fas fa-sync-alt mr-1" :class="{ 'fa-spin': loading }"></i> Tải lại
        </button>
      </div>

      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="thead-light">
            <tr class="small text-uppercase font-weight-bold text-muted">
              <th>Mã / Tên hạng mục</th>
              <th>Loại phí</th>
              <th>Kiểu phát sinh</th>
              <th>Lịch chạy tự động</th>
              <th>Lần chạy gần nhất</th>
              <th class="text-center">Trạng thái</th>
              <th class="text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading && !definitions.length">
              <td colspan="7" class="text-center py-5 text-muted">
                <i class="fas fa-spinner fa-spin mr-1"></i> Đang tải danh mục cấu hình...
              </td>
            </tr>
            <tr v-for="item in definitions" :key="item.id">
              <td>
                <span class="font-weight-bold text-dark d-block">{{ item.name }}</span>
                <code class="small text-muted">{{ item.code }}</code>
              </td>
              <td>
                <span class="badge" :class="feeTypeBadge(item.feeType)">{{ feeTypeLabel(item.feeType) }}</span>
              </td>
              <td>
                <span v-if="item.generationMode === 'AUTOMATIC'" class="badge badge-info">
                  <i class="fas fa-robot mr-1"></i> Tự động (Cron)
                </span>
                <span v-else class="badge badge-secondary">
                  <i class="fas fa-hand-paper mr-1"></i> Chủ động
                </span>
              </td>
              <td>
                <div v-if="item.generationMode === 'AUTOMATIC'" class="small">
                  <i class="far fa-calendar-alt text-muted mr-1"></i> Ngày <strong>{{ item.scheduleDay }}</strong> lúc <strong>{{ formatHour(item.scheduleHour) }}</strong>
                  <div class="text-muted" style="font-size: 0.75rem;">Lần tới: {{ formatDateTime(item.nextRunAt) }}</div>
                </div>
                <div v-else class="text-muted small">—</div>
              </td>
              <td>
                <div v-if="item.lastRunAt" class="small">
                  {{ formatDateTime(item.lastRunAt) }}
                  <span class="badge ml-1" :class="item.lastRunStatus === 'SUCCESS' ? 'badge-success' : 'badge-warning'">
                    {{ item.lastRunStatus }}
                  </span>
                </div>
                <div v-else class="text-muted small">Chưa chạy</div>
              </td>
              <td class="text-center">
                <div class="custom-control custom-switch">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    :id="`switch-${item.id}`"
                    :checked="item.status === 'ENABLED'"
                    @change="toggleStatus(item)"
                  />
                  <label class="custom-control-label" :for="`switch-${item.id}`">
                    <span class="small font-weight-bold" :class="item.status === 'ENABLED' ? 'text-success' : 'text-muted'">
                      {{ item.status === 'ENABLED' ? 'Bật' : 'Tắt' }}
                    </span>
                  </label>
                </div>
              </td>
              <td class="text-right text-nowrap">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary mr-1"
                  @click="openEditDefModal(item)"
                  title="Chỉnh sửa cấu hình & lịch"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  v-if="item.generationMode === 'AUTOMATIC'"
                  type="button"
                  class="btn btn-sm btn-outline-primary mr-1"
                  @click="openRunModal(item)"
                >
                  <i class="fas fa-play mr-1"></i> Chạy ngay
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-info"
                  @click="openDetailRuns(item)"
                  title="Xem lịch sử chạy của mục này"
                >
                  <i class="fas fa-history"></i>
                </button>
              </td>
            </tr>
            <tr v-if="!loading && !definitions.length">
              <td colspan="7" class="text-center py-5 text-muted">
                Chưa có cấu hình nào. Bấm "Tải lại" để tự động khởi tạo mặc định.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL: THÊM / SỬA HẠNG MỤC PHÍ -->
    <!-- ======================================================== -->
    <b-modal v-model="defFormModalOpen" :title="isEditingDef ? 'Chỉnh sửa hạng mục phí' : 'Thêm hạng mục phí mới'" hide-footer size="lg">
      <form @submit.prevent="submitDefForm">
        <div class="row">
          <div class="col-md-6 form-group mb-2">
            <label class="small font-weight-bold">Tên hạng mục <span class="text-danger">*</span></label>
            <input v-model.trim="defForm.name" class="form-control form-control-sm" required placeholder="Ví dụ: Học phí hàng tháng" />
          </div>
          <div class="col-md-6 form-group mb-2">
            <label class="small font-weight-bold">Mã hạng mục (Code) <span class="text-danger">*</span></label>
            <input v-model.trim="defForm.code" class="form-control form-control-sm" :disabled="isEditingDef" required placeholder="Ví dụ: TUITION_MONTHLY" />
          </div>
        </div>

        <div class="row">
          <div class="col-md-4 form-group mb-2">
            <label class="small font-weight-bold">Loại phí</label>
            <select v-model="defForm.feeType" class="form-control form-control-sm" :disabled="isEditingDef">
              <option value="TUITION">Học phí (TUITION)</option>
              <option value="CAMERA">Camera (CAMERA)</option>
              <option value="FACILITY">Cơ sở vật chất (FACILITY)</option>
              <option value="EXTENDED">Phí mở rộng (EXTENDED)</option>
              <option value="ABSENCE_CREDIT">Giảm nghỉ học (ABSENCE_CREDIT)</option>
            </select>
          </div>
          <div class="col-md-4 form-group mb-2">
            <label class="small font-weight-bold">Kiểu phát sinh</label>
            <select v-model="defForm.generationMode" class="form-control form-control-sm" :disabled="isEditingDef">
              <option value="AUTOMATIC">Tự động định kỳ (Cron)</option>
              <option value="MANUAL">Chủ động nghiệp vụ</option>
            </select>
          </div>
          <div class="col-md-4 form-group mb-2">
            <label class="small font-weight-bold">Đối tượng</label>
            <select v-model="defForm.subjectType" class="form-control form-control-sm" :disabled="isEditingDef">
              <option value="STUDENT">Học sinh</option>
              <option value="PARENT">Phụ huynh</option>
            </select>
          </div>
        </div>

        <!-- Lịch chạy tự động -->
        <div v-if="defForm.generationMode === 'AUTOMATIC'" class="card bg-light border p-3 my-2">
          <h6 class="font-weight-bold text-dark mb-2 small"><i class="far fa-clock mr-1"></i> Cài đặt lịch chạy tự động</h6>
          <div class="row">
            <div class="col-md-6 form-group mb-2">
              <label class="small font-weight-bold">Ngày chạy trong tháng (1 - 31)</label>
              <input v-model.number="defForm.scheduleDay" type="number" min="1" max="31" class="form-control form-control-sm" />
            </div>
            <div class="col-md-6 form-group mb-2">
              <label class="small font-weight-bold">Giờ chạy (0 - 23h)</label>
              <input v-model.number="defForm.scheduleHour" type="number" min="0" max="23" class="form-control form-control-sm" />
              <small class="text-muted">Giờ Việt Nam (Ví dụ 1 là 01:00 sáng).</small>
            </div>
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="small font-weight-bold">Số tiền mặc định (đ) (nếu là loại số tiền cố định)</label>
          <input v-model.number="defForm.defaultAmount" type="number" step="1000" class="form-control form-control-sm" />
        </div>

        <div class="d-flex justify-content-end gap-2 mt-3">
          <button type="button" class="btn btn-light border mr-2" :disabled="savingDef" @click="defFormModalOpen = false">Đóng</button>
          <button type="submit" class="btn btn-primary font-weight-bold" :disabled="savingDef">
            <i class="fas" :class="savingDef ? 'fa-spinner fa-spin mr-1' : 'fa-save mr-1'"></i>
            {{ savingDef ? 'Đang lưu...' : 'Lưu cấu hình' }}
          </button>
        </div>
      </form>
    </b-modal>

    <!-- ======================================================== -->
    <!-- MODAL 1: CHẠY THỦ CÔNG / CHẠY THỬ MỘT MỤC TỰ ĐỘNG -->
    <!-- ======================================================== -->
    <b-modal v-model="runModalOpen" title="Kích hoạt phát sinh phí tự động" hide-footer size="md">
      <div v-if="selectedDef">
        <div class="alert alert-info py-2 small mb-3">
          Bạn đang yêu cầu phát sinh cho hạng mục: <strong>{{ selectedDef.name }}</strong> (<code>{{ selectedDef.code }}</code>).
        </div>
        <div class="form-group">
          <label class="font-weight-bold small">Tháng tính phí</label>
          <input v-model="runOptions.billingMonth" type="month" class="form-control" />
        </div>
        <div class="form-group mb-4">
          <div class="custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="checkDryRun" v-model="runOptions.dryRun" />
            <label class="custom-control-label font-weight-bold text-primary" for="checkDryRun">
              Chỉ chạy thử (Xem trước số liệu, không lưu vào hệ thống)
            </label>
          </div>
        </div>
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-light border mr-2" :disabled="running" @click="runModalOpen = false">Đóng</button>
          <button type="button" class="btn btn-primary font-weight-bold" :disabled="running" @click="executeRun">
            <i class="fas" :class="running ? 'fa-spinner fa-spin mr-1' : 'fa-play mr-1'"></i>
            {{ running ? 'Đang xử lý...' : (runOptions.dryRun ? 'Xem trước kết quả' : 'Xác nhận tạo phí') }}
          </button>
        </div>
      </div>
    </b-modal>

    <!-- ======================================================== -->
    <!-- MODAL 2: TẠO THỦ CÔNG ÍT CLICK CHO NHIỀU BÉ / LỚP -->
    <!-- ======================================================== -->
    <b-modal v-model="manualBulkOpen" title="Tạo khoản phí chủ động cho bé" hide-footer size="xl">
      <div class="row">
        <!-- Cột trái: Thông tin khoản phí -->
        <div class="col-md-5 border-right">
          <h6 class="font-weight-bold text-dark border-bottom pb-2">1. Thông tin khoản phí</h6>
          <div class="form-group mb-2">
            <label class="small font-weight-bold">Hạng mục / Loại phí</label>
            <select v-model="manualForm.feeType" class="form-control form-control-sm">
              <option value="FACILITY">Cơ sở vật chất đầu năm (FACILITY)</option>
              <option value="EXTENDED">Phí mở rộng / Dã ngoại / Khác (EXTENDED)</option>
              <option value="ABSENCE_CREDIT">Giảm trừ nghỉ học (ABSENCE_CREDIT)</option>
            </select>
          </div>
          <div class="form-group mb-2">
            <label class="small font-weight-bold">Số tiền (đ)</label>
            <input v-model.number="manualForm.amount" type="number" step="1000" class="form-control form-control-sm font-weight-bold text-primary" />
          </div>
          <div class="row">
            <div class="col-6 form-group mb-2">
              <label class="small font-weight-bold">Tháng tính phí</label>
              <input v-model="manualForm.billingMonth" type="month" class="form-control form-control-sm" />
            </div>
            <div class="col-6 form-group mb-2">
              <label class="small font-weight-bold">Năm học</label>
              <input v-model="manualForm.schoolYear" class="form-control form-control-sm" placeholder="2026-2027" />
            </div>
          </div>
          <div class="form-group mb-3">
            <label class="small font-weight-bold">Lý do / Diễn giải</label>
            <textarea v-model="manualForm.reason" rows="2" class="form-control form-control-sm" placeholder="Ghi chú đính kèm khoản phí..."></textarea>
          </div>

          <div class="alert alert-light border small">
            Đã chọn: <strong class="text-success">{{ selectedStudentIds.length }}</strong> học sinh.
            <div v-if="selectedStudentIds.length">
              Tổng tiền dự kiến: <strong>{{ formatMoney(selectedStudentIds.length * (manualForm.amount || 0)) }} đ</strong>
            </div>
          </div>

          <button
            type="button"
            class="btn btn-success btn-block font-weight-bold shadow-sm mt-3"
            :disabled="submittingManual || !selectedStudentIds.length || !manualForm.amount"
            @click="submitManualBulk"
          >
            <i class="fas" :class="submittingManual ? 'fa-spinner fa-spin mr-1' : 'fa-check-circle mr-1'"></i>
            {{ submittingManual ? 'Đang tạo...' : `Tạo phí cho ${selectedStudentIds.length} bé đã chọn` }}
          </button>
        </div>

        <!-- Cột phải: Chọn học sinh theo lớp hoặc tìm kiếm -->
        <div class="col-md-7">
          <h6 class="font-weight-bold text-dark border-bottom pb-2 d-flex justify-content-between align-items-center">
            <span>2. Chọn học sinh nhận phí</span>
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-outline-secondary" @click="selectAllFiltered">Chọn tất cả</button>
              <button type="button" class="btn btn-outline-secondary" @click="selectedStudentIds = []">Bỏ chọn hết</button>
            </div>
          </h6>

          <div class="row mb-2">
            <div class="col-6">
              <select v-model="filterClassId" class="form-control form-control-sm" @change="onClassFilterChange">
                <option value="">Tất cả các lớp</option>
                <option v-for="c in classList" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div class="col-6">
              <input v-model.trim="searchStudentText" class="form-control form-control-sm" placeholder="Tìm tên bé..." />
            </div>
          </div>

          <div class="student-select-box border rounded p-2" style="max-height: 400px; overflow-y: auto;">
            <div v-if="loadingStudents" class="text-center py-4 text-muted small">
              <i class="fas fa-spinner fa-spin mr-1"></i> Đang nạp danh sách học sinh...
            </div>
            <div v-for="s in filteredStudents" :key="s.id" class="d-flex justify-content-between align-items-center py-1 border-bottom">
              <div class="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  :id="`chk-std-${s.id}`"
                  :value="s.id"
                  v-model="selectedStudentIds"
                />
                <label class="custom-control-label font-weight-bold small text-dark" :for="`chk-std-${s.id}`">
                  {{ s.name }}
                </label>
              </div>
              <span class="badge badge-light border small text-muted">{{ s.lophoc ? s.lophoc.name : 'Chưa xếp lớp' }}</span>
            </div>
            <div v-if="!loadingStudents && !filteredStudents.length" class="text-center py-4 text-muted small">
              Không có học sinh phù hợp.
            </div>
          </div>
        </div>
      </div>
    </b-modal>

    <!-- ======================================================== -->
    <!-- MODAL 3: NHẬT KÝ LẦN CHẠY CRON (RUN LOGS) -->
    <!-- ======================================================== -->
    <b-modal v-model="runsModalOpen" title="Lịch sử nhật ký phát sinh phí tự động (Cron Logs)" hide-footer size="xl">
      <div v-if="loadingRuns" class="text-center py-4 text-muted">
        <i class="fas fa-spinner fa-spin mr-1"></i> Đang tải nhật ký...
      </div>
      <div v-else>
        <div class="table-responsive" style="max-height: 500px; overflow-y: auto;">
          <table class="table table-sm table-bordered table-hover mb-0">
            <thead class="thead-light small font-weight-bold">
              <tr>
                <th>Mã lần chạy</th>
                <th>Hạng mục</th>
                <th>Kỳ</th>
                <th>Loại</th>
                <th>Thời gian</th>
                <th>Kết quả</th>
                <th class="text-right">Đã tạo</th>
                <th class="text-right">Bỏ qua</th>
                <th class="text-right">Lỗi</th>
                <th class="text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in runsList" :key="r.id">
                <td><code>{{ r.code }}</code></td>
                <td class="font-weight-bold text-dark">{{ r.defName }}</td>
                <td>{{ r.billingMonth || r.schoolYear }}</td>
                <td>
                  <span class="badge" :class="r.trigger === 'CRON' ? 'badge-primary' : (r.trigger === 'PREVIEW' ? 'badge-warning' : 'badge-info')">
                    {{ r.trigger }}
                  </span>
                </td>
                <td class="small">{{ formatDateTime(r.startedAt) }}</td>
                <td>
                  <span class="badge" :class="r.status === 'SUCCESS' ? 'badge-success' : (r.status === 'PARTIAL' ? 'badge-warning' : 'badge-danger')">
                    {{ r.status }}
                  </span>
                </td>
                <td class="text-right text-success font-weight-bold">{{ r.createdCount }}</td>
                <td class="text-right text-muted">{{ r.skippedCount }}</td>
                <td class="text-right text-danger font-weight-bold">{{ r.failedCount }}</td>
                <td class="text-center">
                  <button type="button" class="btn btn-xs btn-outline-info" @click="viewRunDetail(r.id)">
                    <i class="fas fa-eye"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="!runsList.length">
                <td colspan="10" class="text-center py-4 text-muted">Chưa có nhật ký lần chạy nào.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </b-modal>

    <!-- ======================================================== -->
    <!-- MODAL 4: CHI TIẾT TỪNG BÉ TRONG 1 LẦN CHẠY -->
    <!-- ======================================================== -->
    <b-modal v-model="runDetailModalOpen" :title="`Chi tiết đợt chạy: ${runDetail ? runDetail.code : ''}`" hide-footer size="lg">
      <div v-if="runDetail">
        <div class="row mb-3 small">
          <div class="col-4">Hạng mục: <strong>{{ runDetail.defName }}</strong></div>
          <div class="col-4">Kỳ phí: <strong>{{ runDetail.billingMonth || runDetail.schoolYear }}</strong></div>
          <div class="col-4">Người chạy: <strong>{{ runDetail.runByName }}</strong></div>
        </div>

        <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
          <table class="table table-sm table-hover mb-0">
            <thead class="thead-light small">
              <tr>
                <th>Đối tượng</th>
                <th class="text-right">Số tiền</th>
                <th>Trạng thái</th>
                <th>Ghi chú / Lý do</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, idx) in runDetail.items" :key="idx">
                <td class="font-weight-bold text-dark">{{ it.targetName }}</td>
                <td class="text-right font-weight-bold">{{ formatMoney(it.amount) }} đ</td>
                <td>
                  <span class="badge" :class="it.status === 'CREATED' || it.status === 'WILL_CREATE' ? 'badge-success' : (it.status === 'ALREADY_EXISTS' ? 'badge-secondary' : 'badge-danger')">
                    {{ it.status }}
                  </span>
                </td>
                <td class="small text-muted">{{ it.reason || it.feeCode || '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { paymentHubRequest } from '~/utils/paymentHub';
import gql from 'graphql-tag';

export default {
  layout: 'app',
  data() {
    return {
      loading: false,
      error: '',
      definitions: [],
      // Modal Thêm/Sửa Def
      defFormModalOpen: false,
      isEditingDef: false,
      savingDef: false,
      defForm: {
        id: '',
        code: '',
        name: '',
        feeType: 'TUITION',
        generationMode: 'AUTOMATIC',
        subjectType: 'STUDENT',
        scheduleDay: 25,
        scheduleHour: 1,
        defaultAmount: 0,
      },
      // Modal Run
      runModalOpen: false,
      selectedDef: null,
      running: false,
      runOptions: {
        billingMonth: '',
        dryRun: false,
      },
      // Modal Manual Bulk
      manualBulkOpen: false,
      submittingManual: false,
      manualForm: {
        feeType: 'FACILITY',
        amount: 2000000,
        billingMonth: '',
        schoolYear: '2026-2027',
        reason: '',
      },
      classList: [],
      studentList: [],
      loadingStudents: false,
      filterClassId: '',
      searchStudentText: '',
      selectedStudentIds: [],
      // Modal Runs Log
      runsModalOpen: false,
      loadingRuns: false,
      runsList: [],
      // Modal Run Detail
      runDetailModalOpen: false,
      runDetail: null,
    };
  },
  computed: {
    filteredStudents() {
      let list = this.studentList;
      if (this.filterClassId) {
        list = list.filter(s => s.lophoc && String(s.lophoc.id) === String(this.filterClassId));
      }
      if (this.searchStudentText) {
        const q = this.searchStudentText.toLowerCase();
        list = list.filter(s => (s.name || '').toLowerCase().includes(q));
      }
      return list;
    },
  },
  mounted() {
    this.setDefaultMonth();
    this.loadDefinitions();
  },
  methods: {
    async ensureUserLoaded() {
      if (!this.$store.state.user.user?.id) {
        await this.$store.dispatch('user/getRole');
      }
    },
    setDefaultMonth() {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      this.runOptions.billingMonth = `${y}-${m}`;
      this.manualForm.billingMonth = `${y}-${m}`;
    },
    async loadDefinitions() {
      this.loading = true;
      this.error = '';
      try {
        await this.ensureUserLoaded();
        const res = await paymentHubRequest(this, 'get', 'fee-definitions');
        this.definitions = res.data?.data || [];
      } catch (err) {
        this.error = err.response?.data?.error || err.message || 'Lỗi nạp cấu hình';
      } finally {
        this.loading = false;
      }
    },
    openCreateDefModal() {
      this.isEditingDef = false;
      this.defForm = {
        id: '',
        code: '',
        name: '',
        feeType: 'EXTENDED',
        generationMode: 'MANUAL',
        subjectType: 'STUDENT',
        scheduleDay: 25,
        scheduleHour: 1,
        defaultAmount: 0,
      };
      this.defFormModalOpen = true;
    },
    openEditDefModal(item) {
      this.isEditingDef = true;
      this.defForm = {
        id: item.id,
        code: item.code,
        name: item.name,
        feeType: item.feeType,
        generationMode: item.generationMode,
        subjectType: item.subjectType,
        scheduleDay: item.scheduleDay || 25,
        scheduleHour: item.scheduleHour || 1,
        defaultAmount: item.defaultAmount || 0,
      };
      this.defFormModalOpen = true;
    },
    async submitDefForm() {
      if (this.savingDef) return;
      this.savingDef = true;
      try {
        await this.ensureUserLoaded();
        if (this.isEditingDef) {
          await paymentHubRequest(this, 'put', `fee-definitions/${this.defForm.id}`, {
            name: this.defForm.name,
            scheduleDay: this.defForm.scheduleDay,
            scheduleHour: this.defForm.scheduleHour,
            defaultAmount: this.defForm.defaultAmount,
          });
          this.$bvToast.toast('Đã cập nhật cấu hình thành công!', { variant: 'success', solid: true });
        } else {
          await paymentHubRequest(this, 'post', 'fee-definitions', this.defForm);
          this.$bvToast.toast('Đã thêm hạng mục phí mới!', { variant: 'success', solid: true });
        }
        this.defFormModalOpen = false;
        await this.loadDefinitions();
      } catch (err) {
        this.$bvToast.toast(err.response?.data?.error || err.message || 'Lỗi lưu cấu hình', { variant: 'danger', solid: true });
      } finally {
        this.savingDef = false;
      }
    },
    async toggleStatus(item) {
      const nextStatus = item.status === 'ENABLED' ? 'DISABLED' : 'ENABLED';
      try {
        await this.ensureUserLoaded();
        await paymentHubRequest(this, 'put', `fee-definitions/${item.id}`, { status: nextStatus });
        item.status = nextStatus;
        this.$bvToast.toast(`Đã ${nextStatus === 'ENABLED' ? 'bật' : 'tắt'} ${item.name}`, { variant: 'success', solid: true });
      } catch (err) {
        this.$bvToast.toast(err.response?.data?.error || err.message || 'Lỗi cập nhật', { variant: 'danger', solid: true });
        this.loadDefinitions();
      }
    },
    openRunModal(def) {
      this.selectedDef = def;
      this.runOptions.dryRun = false;
      this.runModalOpen = true;
    },
    async executeRun() {
      if (!this.selectedDef || this.running) return;
      this.running = true;
      try {
        await this.ensureUserLoaded();
        const res = await paymentHubRequest(this, 'post', `fee-definitions/${this.selectedDef.id}/run`, this.runOptions);
        const data = res.data?.data;
        this.runModalOpen = false;
        this.$bvToast.toast(
          `Hoàn tất: Tạo mới ${data.createdCount}, Bỏ qua ${data.skippedCount}, Lỗi ${data.failedCount}`,
          { variant: data.failedCount > 0 ? 'warning' : 'success', solid: true, title: 'Kết quả chạy' }
        );
        this.loadDefinitions();
        if (data.runId) {
          this.viewRunDetail(data.runId);
        }
      } catch (err) {
        this.$bvToast.toast(err.response?.data?.error || err.message || 'Lỗi thực thi', { variant: 'danger', solid: true });
      } finally {
        this.running = false;
      }
    },
    async openRunsModal() {
      this.runsModalOpen = true;
      this.loadingRuns = true;
      try {
        await this.ensureUserLoaded();
        const res = await paymentHubRequest(this, 'get', 'fee-runs?limit=30');
        this.runsList = res.data?.data?.rows || [];
      } catch (err) {
        this.$bvToast.toast(err.response?.data?.error || err.message || 'Lỗi tải lịch sử', { variant: 'danger', solid: true });
      } finally {
        this.loadingRuns = false;
      }
    },
    async openDetailRuns(item) {
      this.runsModalOpen = true;
      this.loadingRuns = true;
      try {
        await this.ensureUserLoaded();
        const res = await paymentHubRequest(this, 'get', `fee-runs?defId=${item.id}&limit=30`);
        this.runsList = res.data?.data?.rows || [];
      } catch (err) {
        this.$bvToast.toast(err.response?.data?.error || err.message || 'Lỗi tải lịch sử', { variant: 'danger', solid: true });
      } finally {
        this.loadingRuns = false;
      }
    },
    async viewRunDetail(runId) {
      try {
        await this.ensureUserLoaded();
        const res = await paymentHubRequest(this, 'get', `fee-runs/${runId}`);
        this.runDetail = res.data?.data;
        this.runDetailModalOpen = true;
      } catch (err) {
        this.$bvToast.toast(err.response?.data?.error || err.message || 'Lỗi tải chi tiết', { variant: 'danger', solid: true });
      }
    },
    async openManualBulkModal() {
      this.manualBulkOpen = true;
      this.selectedStudentIds = [];
      if (!this.studentList.length) {
        this.loadClassesAndStudents();
      }
    },
    async loadClassesAndStudents() {
      this.loadingStudents = true;
      try {
        const client = this.$apolloProvider.defaultClient;
        const res = await client.query({
          query: gql`
            query {
              allLopHocs(sortBy: name_ASC) { id name }
              allStudents(where: { status: "DANG_HOC" }, sortBy: name_ASC) {
                id name sName status lophoc { id name } parent { id name }
              }
            }
          `,
        });
        this.classList = res.data?.allLopHocs || [];
        this.studentList = res.data?.allStudents || [];
      } catch (err) {
        console.error(err);
      } finally {
        this.loadingStudents = false;
      }
    },
    onClassFilterChange() {
      if (this.filterClassId) {
        const classStudents = this.studentList.filter(s => s.lophoc && String(s.lophoc.id) === String(this.filterClassId));
        this.selectedStudentIds = classStudents.map(s => s.id);
      }
    },
    selectAllFiltered() {
      this.selectedStudentIds = this.filteredStudents.map(s => s.id);
    },
    async submitManualBulk() {
      if (this.submittingManual || !this.selectedStudentIds.length) return;
      this.submittingManual = true;
      try {
        await this.ensureUserLoaded();
        const payload = {
          feeType: this.manualForm.feeType,
          amount: this.manualForm.amount,
          billingMonth: this.manualForm.billingMonth,
          schoolYear: this.manualForm.schoolYear,
          reason: this.manualForm.reason,
          studentIds: this.selectedStudentIds,
        };
        const res = await paymentHubRequest(this, 'post', 'fees/manual-bulk', payload);
        const data = res.data?.data;
        this.manualBulkOpen = false;
        this.$bvToast.toast(`Đã tạo thành công ${data.createdCount} khoản phí!`, { variant: 'success', solid: true });
      } catch (err) {
        this.$bvToast.toast(err.response?.data?.error || err.message || 'Lỗi phát sinh', { variant: 'danger', solid: true });
      } finally {
        this.submittingManual = false;
      }
    },
    feeTypeBadge(type) {
      const map = {
        TUITION: 'badge-primary',
        CAMERA: 'badge-info',
        FACILITY: 'badge-warning text-dark',
        EXTENDED: 'badge-dark',
        ABSENCE_CREDIT: 'badge-danger',
      };
      return map[type] || 'badge-secondary';
    },
    feeTypeLabel(type) {
      const map = {
        TUITION: 'Học phí',
        CAMERA: 'Camera',
        FACILITY: 'Cơ sở vật chất',
        EXTENDED: 'Phí mở rộng',
        ABSENCE_CREDIT: 'Giảm nghỉ học',
      };
      return map[type] || type;
    },
    formatMoney(val) {
      return Number(val || 0).toLocaleString('vi-VN');
    },
    formatHour(hour) {
      return `${String(hour || 0).padStart(2, '0')}:00`;
    },
    formatDateTime(val) {
      if (!val) return '—';
      const d = new Date(val);
      return Number.isNaN(d.getTime()) ? '—' : new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'Asia/Ho_Chi_Minh',
      }).format(d);
    },
  },
};
</script>

<style scoped>
.fee-config-page {
  min-height: 85vh;
}
.btn-xs {
  padding: 0.2rem 0.4rem;
  font-size: 0.75rem;
}
</style>
