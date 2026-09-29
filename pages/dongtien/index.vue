<template>
  <div class="container-fluid py-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>Thu chi phụ huynh</h4>
      <div>
        <nuxt-link to="/quytruong" class="btn btn-outline-primary mr-2">Quỹ trường</nuxt-link>
        <button v-if="isPaymentHubAdmin" class="btn btn-outline-primary mr-2" :disabled="syncing" @click="syncBankTransactions">
          <i class="fas mr-1" :class="syncing ? 'fa-spinner fa-spin' : 'fa-sync-alt'"></i>
          {{ syncing ? 'Đang kiểm tra...' : 'Kiểm tra chuyển khoản' }}
        </button>
        <button class="btn btn-outline-success mr-2" @click="exportToExcel">
          <i class="fas fa-download mr-1" aria-hidden="true"></i>Xuất CSV
        </button>
        <button v-if="isPaymentHubAdmin" class="btn btn-success" @click="openModalAddCash">
          <i class="fas fa-plus mr-1" aria-hidden="true"></i>Thu tiền
        </button>
      </div>
    </div>

    <section class="cash-period mb-3" aria-label="Chu kỳ dòng tiền">
      <div>
        <h5 class="mb-1">Chu kỳ</h5>
        <p class="small text-muted mb-0">{{ periodLabel }}: {{ displayDate(range.from) }} - {{ displayDate(range.to) }}</p>
      </div>
      <div class="period-actions" role="group" aria-label="Chọn chu kỳ dòng tiền">
        <button v-for="option in periodOptions" :key="option.value" type="button" class="btn btn-sm" :class="period === option.value ? 'btn-primary' : 'btn-outline-secondary'" :disabled="loading" @click="selectPeriod(option.value)">{{ option.label }}</button>
      </div>
    </section>
    <b-modal v-model="customPeriodOpen" title="Chọn khoảng thời gian" centered hide-footer
      :no-close-on-backdrop="loading" :no-close-on-esc="loading" :hide-header-close="loading">
      <form @submit.prevent="applyCustomRange">
        <div class="custom-period-fields">
          <div><label for="cash-from">Từ ngày</label><input id="cash-from" v-model="customRange.from" type="date" required class="form-control" @input="customRangeError = ''"></div>
          <div><label for="cash-to">Đến ngày</label><input id="cash-to" v-model="customRange.to" type="date" required class="form-control" @input="customRangeError = ''"></div>
        </div>
        <div class="range-preview mt-3" :class="customRangeError ? 'range-preview-error' : ''">
          <i class="far fa-calendar-alt mr-2" aria-hidden="true"></i>
          <span v-if="customRange.from && customRange.to">{{ displayDate(customRange.from) }} đến {{ displayDate(customRange.to) }}</span>
          <span v-else>Chọn ngày bắt đầu và ngày kết thúc</span>
        </div>
        <p v-if="customRangeError" class="text-danger small mt-2 mb-0" role="alert">{{ customRangeError }}</p>
        <div class="modal-period-actions mt-4">
          <button type="button" class="btn btn-outline-secondary" :disabled="loading" @click="cancelCustomRange">Hủy</button>
          <button class="btn btn-primary" :disabled="loading">{{ loading ? 'Đang tải...' : 'Áp dụng' }}</button>
        </div>
      </form>
    </b-modal>

    <div v-if="loadError" class="alert alert-danger" role="alert">
      Không tải được giao dịch. <button class="btn btn-link" :disabled="loading" @click="fetchData">Thử lại</button>
    </div>
    <p class="text-muted small">Thống kê tối đa 100 giao dịch trong chu kỳ đã chọn.</p>
    <div class="row mb-3">
      <div class="col-md-4">
        <div class="card bg-light border-0 shadow-sm p-3">
          <small class="text-muted">Tiền thu</small>
          <h4 class="text-success mb-0">{{ loading || loadError ? '—' : formatCurrency(totalInflow) }}</h4>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-light border-0 shadow-sm p-3">
          <small class="text-muted">Đã gán phụ huynh</small>
          <h4 class="text-primary mb-0">{{ loading || loadError ? '—' : formatCurrency(totalAllocated) }}</h4>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-light border-0 shadow-sm p-3">
          <small class="text-muted">Chưa xác định phụ huynh</small>
          <h4 class="text-warning mb-0">{{ loading || loadError ? '—' : formatCurrency(totalUnallocated) }}</h4>
        </div>
      </div>
    </div>

    <!-- Tabs: Dòng tiền & Lịch sử gạch nợ -->
    <b-tabs content-class="mt-3" fill>
      <b-tab title="Giao dịch" active>
        <div class="card shadow-sm">
          <div class="card-body p-0">
            <b-table
              hover
              responsive
              :items="cashTransactions"
              :fields="cashFields"
              :busy="loading"
            >
              <template #table-busy>
                <div class="text-center my-3 text-muted">
                  <b-spinner small class="mr-2"></b-spinner>Đang tải dòng tiền...
                </div>
              </template>

              <template #cell(amount)="data">
                <span class="font-weight-bold d-block text-right" :class="data.item.status === 'CANCELLED' ? 'text-muted' : data.item.type === 'OUTFLOW' ? 'text-danger' : 'text-success'">
                  {{ data.item.type === 'OUTFLOW' ? '−' : '+' }}{{ formatCurrency(data.item.amount) }}
                </span>
              </template>

              <template #cell(parent)="data">
                <div v-if="data.item.parent">
                  <a
                    href="#"
                    class="font-weight-bold text-primary parent-link"
                    @click.prevent="openParentModal(data.item.parent)"
                    title="Bấm để xem hồ sơ và sổ nợ phụ huynh"
                  >
                    <i class="fas fa-user-circle mr-1 text-info"></i>{{ data.item.parent.name }}
                  </a>
                  <div class="small text-muted font-monospace">{{ data.item.parent.code }}</div>
                </div>
                <span v-else class="badge bg-warning text-dark">Chưa gán</span>
              </template>

              <template #cell(status)="data">
                <span v-if="data.item.status === 'CANCELLED'" class="badge badge-secondary">Đã hủy</span>
                <span v-else-if="data.item.status === 'ALLOCATED' || data.item.parent" class="badge bg-success text-white">
                  Đã gán
                </span>
                <span v-else-if="data.item.status === 'UNALLOCATED' || data.item.status === 'PENDING'" class="badge bg-warning text-dark">
                  Chưa xác định
                </span>
                <span v-else class="badge bg-secondary text-white">{{ data.item.status }}</span>
              </template>

              <template #cell(createdAt)="data">
                {{ formatDateTime(data.item.createdAt) }}
              </template>

              <template #cell(action)="data">
                <button
                  v-if="isPaymentHubAdmin && data.item.type === 'INFLOW' && data.item.status !== 'CANCELLED' && (data.item.status === 'UNALLOCATED' || !data.item.parent)"
                  class="btn btn-sm btn-primary"
                  title="Gán phụ huynh"
                  aria-label="Gán phụ huynh"
                  @click="openModalAssign(data.item)"
                >
                  <i class="fas fa-link"></i>
                </button>
              </template>
            </b-table>
          </div>
        </div>
      </b-tab>

      <b-tab title="Lịch sử thanh toán">
        <div class="card shadow-sm">
          <div class="card-body p-0">
            <b-table
              hover
              responsive
              :items="settlements"
              :fields="settlementFields"
              :busy="loading"
            >
              <template #table-busy>
                <div class="text-center my-3 text-muted">
                  <b-spinner small class="mr-2"></b-spinner>Đang tải lịch sử gạch nợ...
                </div>
              </template>

              <template #cell(amount)="data">
                <span class="font-weight-bold text-primary">
                  {{ formatCurrency(data.item.amount) }}
                </span>
              </template>

              <template #cell(parent)="data">
                <div v-if="data.item.parent">
                  <a
                    href="#"
                    class="font-weight-bold text-primary parent-link"
                    @click.prevent="openParentModal(data.item.parent)"
                    title="Bấm để xem hồ sơ và sổ nợ phụ huynh"
                  >
                    <i class="fas fa-user-circle mr-1 text-info"></i>{{ data.item.parent.name }}
                  </a>
                  <div class="small text-muted font-monospace">{{ data.item.parent.code }}</div>
                </div>
                <span v-else class="text-muted">-</span>
              </template>

              <template #cell(settleType)="data">
                <span v-if="data.item.settleType === 'AUTO_ACB'" class="badge bg-success text-white">Auto ACB</span>
                <span v-else class="badge bg-info text-white">Kế toán gạch nợ</span>
              </template>

              <template #cell(settledAt)="data">
                {{ formatDateTime(data.item.settledAt) }}
              </template>
            </b-table>
          </div>
        </div>
      </b-tab>
    </b-tabs>

    <!-- Modal Gán Dòng tiền cho Phụ huynh / Bé -->
    <b-modal
      id="modal-assign-parent"
      title="🔗 Gán Dòng Tiền Chưa Nhận Diện Cho Bé / Phụ Huynh"
      size="lg"
      hide-footer
      no-close-on-backdrop
      no-close-on-esc
    >
      <div v-if="selectedTx">
        <!-- Thông tin giao dịch đang gán -->
        <div class="card bg-light border-0 mb-3 p-3">
          <div class="row">
            <div class="col-sm-6 mb-2 mb-sm-0">
              <div class="small text-muted">Mã dòng tiền:</div>
              <strong class="text-dark">{{ selectedTx.code }}</strong>
              <div class="small text-muted mt-1">Nội dung chuyển khoản:</div>
              <div class="small font-monospace text-primary bg-white p-2 rounded border">
                {{ selectedTx.bankDescription || '(Không có nội dung)' }}
              </div>
            </div>
            <div class="col-sm-6 text-sm-right">
              <div class="small text-muted">Số tiền tiếp nhận:</div>
              <h4 class="text-success font-weight-bold mb-1">+{{ formatCurrency(selectedTx.amount) }}</h4>
              <div class="small text-muted">Thời gian: {{ formatDateTime(selectedTx.createdAt) }}</div>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitAssign">
          <!-- Ô tìm kiếm nhanh ưu tiên THEO TÊN BÉ -->
          <div class="form-group mb-3">
            <label class="font-weight-bold text-dark d-flex justify-content-between">
              <span><i class="fas fa-search text-primary mr-1"></i> Tìm nhanh theo Tên Bé / Lớp / Tên Phụ Huynh:</span>
              <span class="badge badge-info small font-weight-normal">Ưu tiên tìm theo tên bé</span>
            </label>
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text bg-white"><i class="fas fa-child text-info"></i></span>
              </div>
              <input
                type="text"
                class="form-control"
                placeholder="Gõ tên bé (vd: Gia Hân, An Nhiên...), tên lớp, hoặc tên ba mẹ..."
                v-model.trim="searchStudentKeyword"
                autofocus
              />
              <div class="input-group-append" v-if="searchStudentKeyword">
                <button class="btn btn-outline-secondary" type="button" @click="searchStudentKeyword = ''">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>

            <!-- Danh sách kết quả gợi ý -->
            <div
              v-if="filteredParentOptions.length > 0"
              class="list-group shadow-sm border rounded"
              style="max-height: 240px; overflow-y: auto;"
            >
              <button
                type="button"
                v-for="item in filteredParentOptions"
                :key="item.id"
                :class="['list-group-item list-group-item-action p-2 d-flex justify-content-between align-items-center', assignForm.parentId === item.id ? 'active' : '']"
                @click="selectParent(item)"
              >
                <div>
                  <div class="font-weight-bold d-flex align-items-center">
                    <i class="fas fa-child text-warning mr-1"></i>
                    <span>{{ item.studentNames || '(Chưa có tên bé)' }}</span>
                    <span v-if="item.classNames" class="badge badge-secondary ml-2 font-weight-normal">
                      {{ item.classNames }}
                    </span>
                  </div>
                  <div class="small" :class="assignForm.parentId === item.id ? 'text-white-50' : 'text-muted'">
                    <i class="fas fa-user-friends mr-1"></i>PH: <strong>{{ item.name }}</strong> (Mã: {{ item.code }})
                  </div>
                </div>
                <div class="text-right small">
                  <div>Nợ: <strong :class="assignForm.parentId === item.id ? 'text-white' : 'text-danger'">{{ formatCurrency(item.debt) }}</strong></div>
                  <div>Ví dư: <strong :class="assignForm.parentId === item.id ? 'text-white' : 'text-success'">{{ formatCurrency(item.balance) }}</strong></div>
                </div>
              </button>
            </div>
            <div v-else-if="searchStudentKeyword" class="p-3 text-center text-muted bg-light rounded border">
              <i class="fas fa-exclamation-circle mr-1"></i> Không tìm thấy bé hoặc phụ huynh nào khớp với "{{ searchStudentKeyword }}"
            </div>
          </div>

          <!-- Thông tin bé & Phụ huynh đã chọn -->
          <div v-if="selectedParentObj" class="alert alert-success d-flex align-items-center justify-content-between p-3 mb-3">
            <div>
              <div class="font-weight-bold text-success">
                <i class="fas fa-check-circle mr-1"></i> Đã chọn bé: {{ selectedParentObj.studentNames }} ({{ selectedParentObj.classNames }})
              </div>
              <div class="small text-dark mt-1">
                Phụ huynh: <strong>{{ selectedParentObj.name }}</strong> (Mã: {{ selectedParentObj.code }})
                | Học phí nợ: <span class="text-danger font-weight-bold">{{ formatCurrency(selectedParentObj.debt) }}</span>
              </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline-danger" @click="assignForm.parentId = ''">
              Chọn lại
            </button>
          </div>

          <!-- Tùy chọn Tự động cấn trừ -->
          <div class="custom-control custom-checkbox mb-4 p-3 bg-light rounded border">
            <input
              type="checkbox"
              class="custom-control-input"
              id="autoSettleCheck"
              v-model="assignForm.autoSettle"
            />
            <label class="custom-control-label font-weight-bold text-dark" for="autoSettleCheck">
              Tự động cấn trừ học phí nếu bé / phụ huynh đang có nợ
            </label>
            <div class="small text-muted ml-0 mt-1">
              Hệ thống sẽ tự động gạch nợ hóa đơn và nạp phần tiền còn dư vào Ví khả dụng của phụ huynh.
            </div>
          </div>

          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-secondary mr-2" @click="$bvModal.hide('modal-assign-parent')">
              Hủy bỏ
            </button>
            <button
              type="submit"
              class="btn btn-primary font-weight-bold px-4"
              :disabled="!assignForm.parentId || assigning"
            >
              <b-spinner v-if="assigning" small class="mr-1"></b-spinner>
              <i v-else class="fas fa-link mr-1"></i>
              Xác nhận Gán Dòng Tiền
            </button>
          </div>
        </form>
      </div>
    </b-modal>

    <!-- Modal Ghi nhận thu tiền -->
    <b-modal id="modal-add-cash" title="Ghi nhận Dòng tiền Thu" hide-footer size="lg">
      <form @submit.prevent="submitAddCash">
        <div class="form-group mb-3">
          <label class="font-weight-bold">Chọn Bé / Phụ huynh *</label>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text bg-white"><i class="fas fa-child text-info"></i></span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Gõ tên bé, tên lớp, hoặc tên phụ huynh để tìm nhanh..."
              v-model.trim="searchCashStudentKeyword"
            />
          </div>

          <!-- Danh sách kết quả gợi ý -->
          <div
            v-if="filteredCashParentOptions.length > 0"
            class="list-group shadow-sm border rounded mb-2"
            style="max-height: 180px; overflow-y: auto;"
          >
            <button
              type="button"
              v-for="item in filteredCashParentOptions"
              :key="item.id"
              :class="['list-group-item list-group-item-action p-2 d-flex justify-content-between align-items-center', cashForm.parentId === item.id ? 'active' : '']"
              @click="cashForm.parentId = item.id"
            >
              <div>
                <div class="font-weight-bold d-flex align-items-center">
                  <i class="fas fa-child text-warning mr-1"></i>
                  <span>{{ item.studentNames || '(Chưa có tên bé)' }}</span>
                  <span v-if="item.classNames" class="badge badge-secondary ml-2 font-weight-normal">
                    {{ item.classNames }}
                  </span>
                </div>
                <div class="small" :class="cashForm.parentId === item.id ? 'text-white-50' : 'text-muted'">
                  PH: <strong>{{ item.name }}</strong> (Mã: {{ item.code }})
                </div>
              </div>
              <div class="text-right small">
                <div>Nợ: <strong :class="cashForm.parentId === item.id ? 'text-white' : 'text-danger'">{{ formatCurrency(item.debt) }}</strong></div>
                <div>Ví dư: <strong :class="cashForm.parentId === item.id ? 'text-white' : 'text-success'">{{ formatCurrency(item.balance) }}</strong></div>
              </div>
            </button>
          </div>

          <div v-if="selectedCashParentObj" class="alert alert-success p-2 small mb-0 d-flex justify-content-between align-items-center">
            <div>
              <i class="fas fa-check-circle mr-1"></i> Đang chọn: <strong>{{ selectedCashParentObj.studentNames }} ({{ selectedCashParentObj.classNames }})</strong>
              - PH: {{ selectedCashParentObj.name }}
            </div>
            <span class="badge badge-light border text-danger">Nợ: {{ formatCurrency(selectedCashParentObj.debt) }}</span>
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="font-weight-bold">Số tiền thu (VNĐ) *</label>
          <InputCurrency
            v-model="cashForm.amount"
            placeholder="Ví dụ: 3.000.000"
            required
          />
        </div>

        <div class="row">
          <div class="col-md-6 form-group mb-3">
            <label class="font-weight-bold">Hình thức thu</label>
            <select v-model="cashForm.paymentMethod" class="form-control">
              <option value="CASH">Tiền mặt tại trường</option>
              <option value="ACB_BANK">Chuyển khoản ACB</option>
              <option value="OTHER">Hình thức khác</option>
            </select>
          </div>
          <div class="col-md-6 form-group mb-3">
            <label class="font-weight-bold">Ghi chú / Nội dung chuyển khoản</label>
            <input
              v-model="cashForm.bankDescription"
              type="text"
              class="form-control"
              placeholder="Ví dụ: Đóng tiền mặt tại văn phòng"
            />
          </div>
        </div>

        <div v-if="['ACB_BANK', 'MONA_PAY'].includes(cashForm.paymentMethod)" class="row">
          <div class="col-md-6 form-group mb-3">
            <label for="cash-bank-ref">Mã giao dịch ngân hàng (bankRef) *</label>
            <input id="cash-bank-ref" class="form-control" v-model.trim="cashForm.bankRef" required maxlength="100" />
            <small class="text-muted">Dùng đúng mã giao dịch ngân hàng để đối soát và tránh ghi nhận trùng.</small>
          </div>
          <div class="col-md-6 form-group mb-3">
            <label for="cash-receiving">Tài khoản nhận (receivingAccount) *</label>
            <input id="cash-receiving" class="form-control" v-model.trim="cashForm.receivingAccount" required maxlength="50" />
            <small class="text-muted">Phải thuộc receiving_accounts trong cấu hình MONA Pay.</small>
          </div>
        </div>

        <!-- Tùy chọn Tự động gạch nợ học phí -->
        <div class="custom-control custom-checkbox mb-4 p-3 bg-light rounded border">
          <input
            type="checkbox"
            class="custom-control-input"
            id="cashAutoSettleCheck"
            v-model="cashForm.autoSettle"
          />
          <label class="custom-control-label font-weight-bold text-dark" for="cashAutoSettleCheck">
            {{ cashForm.autoSettle ? '🟢 Tự động gạch nợ học phí (Nợ giảm ngay)' : '⚪ Chỉ nạp vào Ví khả dụng (Giữ nguyên nợ để kế toán đối soát sau)' }}
          </label>
          <div class="small text-muted mt-1">
            <span v-if="cashForm.autoSettle">Số tiền thu sẽ ưu tiên thanh toán dứt điểm các hóa đơn nợ trước, tiền dư thừa sẽ được lưu vào Ví phụ huynh.</span>
            <span v-else>Toàn bộ số tiền thu sẽ được cộng vào Ví khả dụng (balance), số nợ (debt) giữ nguyên cho đến khi kế toán bấm nút Cấn trừ nợ.</span>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary mr-2" @click="$bvModal.hide('modal-add-cash')">
            Hủy
          </button>
          <button type="submit" class="btn btn-success font-weight-bold" :disabled="!cashForm.parentId || submitting">
            <b-spinner v-if="submitting" small class="mr-1"></b-spinner>
            <i v-else class="fas fa-save mr-1"></i>
            {{ cashForm.autoSettle ? 'Xác nhận & Tự Gạch Nợ' : 'Xác nhận Nạp Ví Khả Dụng' }}
          </button>
        </div>
      </form>
    </b-modal>

    <!-- Master Modal: Xem Hồ Sơ & Sổ Nợ Phụ Huynh Trực Tiếp -->
    <b-modal
      v-model="showParentModalFlag"
      size="xl"
      :title="'Thông Tin & Sổ Nợ Phụ Huynh: ' + (activeParent ? (activeParent.name + ' (' + (activeParent.code || 'N/A') + ')') : '')"
      hide-footer
      no-close-on-backdrop
    >
      <div v-if="loadingParent" class="text-center py-5">
        <b-spinner variant="primary"></b-spinner>
        <div class="text-muted mt-2">Đang tải chi tiết hồ sơ & sổ nợ phụ huynh...</div>
      </div>
      <div v-else-if="activeParent">
        <b-tabs pills card v-model="parentTabIndex">
          <!-- Tab 1: Hồ sơ & Trạng thái -->
          <b-tab title="👤 1. Hồ Sơ & Liên Lạc" active>
            <ParentEditModal
              :parentData="activeParent"
              @updated="handleParentUpdated"
              @deleted="handleParentDeleted"
              @close="showParentModalFlag = false"
            />
          </b-tab>

          <!-- Tab 2: Sổ nợ & Dòng tiền -->
          <b-tab title="💳 2. Sổ Nợ & Biến Động Tài Chính">
            <DebtForm
              :idPhuHuynh="activeParent.id"
              :loadData="loadDataCounter"
            />
          </b-tab>
        </b-tabs>
      </div>
    </b-modal>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { paymentHubAdmin, paymentHubRequest, manualCashPayload } from '~/utils/paymentHub';
import InputCurrency from '~/components/Common/InputCurrency.vue';
import DebtForm from '~/components/PhuHuynh/Debt.vue';
import ParentEditModal from '~/components/PhuHuynh/EditModal.vue';

function chuyentiengviet(str) {
  if (!str) return '';
  return str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

const GET_PARENT_DETAIL = gql`
  query GetParentDetail($id: ID!) {
    Parent(where: { id: $id }) {
      id
      code
      name
      status
      parents
      debt
      balance
      phone {
        id
        number
        name
      }
      hocsinhs {
        id
        name
        status
        lophoc {
          id
          name
        }
      }
    }
  }
`;

const GET_FINANCIAL_DATA = gql`
  query GetFinancialData($cashWhere: CashTransactionWhereInput, $settlementWhere: PaymentSettlementWhereInput) {
    allCashTransactions(where: $cashWhere, sortBy: createdAt_DESC, first: 100) {
      id
      code
      amount
      type
      paymentMethod
      bankRef
      bankDescription
      status
      createdAt
      parent {
        id
        code
        name
      }
    }
    allPaymentSettlements(where: $settlementWhere, sortBy: settledAt_DESC, first: 100) {
      id
      code
      amount
      settleType
      status
      note
      settledAt
      parent {
        id
        code
        name
      }
      student {
        id
        name
      }
    }
    allParents(first: 2000) {
      id
      code
      name
      debt
      balance
      hocsinhs {
        id
        name
        lophoc {
          id
          name
        }
      }
    }
  }
`;

export default {
  components: {
    InputCurrency,
    DebtForm,
    ParentEditModal,
  },
  layout: 'app',
  data() {
    return {
      loading: false,
      loadError: false,
      submitting: false,
      syncing: false,
      cashTransactions: [],
      settlements: [],
      parents: [],
      period: 'this-week',
      range: { from: '', to: '' },
      customRange: { from: '', to: '' },
      customPeriodOpen: false,
      customRangeError: '',
      periodOptions: [{ value: 'this-week', label: 'Tuần này' }, { value: 'last-week', label: 'Tuần trước' },
        { value: 'this-month', label: 'Tháng này' }, { value: 'last-month', label: 'Tháng trước' }, { value: 'custom', label: 'Tùy chỉnh' }],
      showParentModalFlag: false,
      activeParent: null,
      loadingParent: false,
      parentTabIndex: 0,
      loadDataCounter: 0,
      cashFields: [
        { key: 'code', label: 'Mã Dòng tiền', sortable: true },
        { key: 'amount', label: 'Số tiền', sortable: true },
        { key: 'paymentMethod', label: 'Phương thức' },
        { key: 'parent', label: 'Phụ huynh' },
        { key: 'bankDescription', label: 'Nội dung CK' },
        { key: 'status', label: 'Trạng thái' },
        { key: 'createdAt', label: 'Thời gian', sortable: true },
        { key: 'action', label: 'Thao tác', class: 'text-center' }
      ],
      settlementFields: [
        { key: 'code', label: 'Mã Settlement', sortable: true },
        { key: 'amount', label: 'Số tiền gạch nợ', sortable: true },
        { key: 'parent', label: 'Phụ huynh' },
        { key: 'settleType', label: 'Hình thức' },
        { key: 'note', label: 'Chi tiết gạch nợ' },
        { key: 'settledAt', label: 'Thời gian gạch nợ', sortable: true }
      ],
      cashForm: {
        parentId: '',
        amount: '',
        paymentMethod: 'CASH',
        bankRef: '',
        receivingAccount: '',
        bankDescription: '',
        autoSettle: true
      },
      searchCashStudentKeyword: '',
      selectedTx: null,
      assigning: false,
      searchStudentKeyword: '',
      assignForm: {
        parentId: '',
        autoSettle: true
      }
    };
  },
  computed: {
    isPaymentHubAdmin() { return paymentHubAdmin(this.$store); },
    periodLabel() { return this.periodOptions.find(option => option.value === this.period)?.label || 'Tùy chỉnh'; },
    normalizedParentList() {
      return this.parents.map(p => {
        const studentNames = (p.hocsinhs || []).map(h => h.name).filter(Boolean).join(', ');
        const classNames = (p.hocsinhs || []).map(h => h.lophoc?.name).filter(Boolean).join(', ');
        const rawFullStr = `${studentNames} ${classNames} ${p.name || ''} ${p.code || ''}`;
        return {
          ...p,
          studentNames,
          classNames,
          searchOriginal: rawFullStr.toLowerCase(),
          searchNonAccent: chuyentiengviet(rawFullStr)
        };
      });
    },
    filteredParentOptions() {
      if (!this.searchStudentKeyword) {
        return this.normalizedParentList.slice(0, 20);
      }
      const rawKw = this.searchStudentKeyword.toLowerCase().trim();
      const nonAccentKw = chuyentiengviet(this.searchStudentKeyword);
      const keywords = nonAccentKw.split(/\s+/).filter(Boolean);

      return this.normalizedParentList.filter(p => {
        if (p.searchOriginal.includes(rawKw)) return true;
        if (p.searchNonAccent.includes(nonAccentKw)) return true;
        return keywords.every(kw => p.searchNonAccent.includes(kw));
      }).slice(0, 30);
    },
    filteredCashParentOptions() {
      if (!this.searchCashStudentKeyword) {
        return this.normalizedParentList.slice(0, 15);
      }
      const rawKw = this.searchCashStudentKeyword.toLowerCase().trim();
      const nonAccentKw = chuyentiengviet(this.searchCashStudentKeyword);
      const keywords = nonAccentKw.split(/\s+/).filter(Boolean);

      return this.normalizedParentList.filter(p => {
        if (p.searchOriginal.includes(rawKw)) return true;
        if (p.searchNonAccent.includes(nonAccentKw)) return true;
        return keywords.every(kw => p.searchNonAccent.includes(kw));
      }).slice(0, 30);
    },
    selectedCashParentObj() {
      if (!this.cashForm.parentId) return null;
      return this.normalizedParentList.find(p => p.id === this.cashForm.parentId);
    },
    selectedParentObj() {
      if (!this.assignForm.parentId) return null;
      return this.normalizedParentList.find(p => p.id === this.assignForm.parentId);
    },
    totalInflow() {
      return this.cashTransactions
        .filter(t => t.type === 'INFLOW' && t.status !== 'CANCELLED')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
    },
    totalAllocated() {
      return this.cashTransactions
        .filter(t => t.type === 'INFLOW' && t.status !== 'CANCELLED' && (t.status === 'ALLOCATED' || t.parent))
        .reduce((sum, t) => sum + (t.amount || 0), 0);
    },
    totalUnallocated() {
      return this.cashTransactions
        .filter(t => t.type === 'INFLOW' && !t.parent && (t.status === 'UNALLOCATED' || t.status === 'PENDING'))
        .reduce((sum, t) => sum + (t.amount || 0), 0);
    },
    totalSettled() {
      return this.settlements
        .filter(s => s.status === 'SUCCESS')
        .reduce((sum, s) => sum + (s.amount || 0), 0);
    }
  },
  mounted() {
    this.range = this.periodRange('this-week');
    this.customRange = { ...this.range };
    this.fetchData();
  },
  methods: {
    formatCurrency(val) {
      return ((val || 0).toLocaleString('vi-VN')) + ' đ';
    },
    formatDateTime(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      if (Number.isNaN(date.getTime())) return '';
      return new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit',
        year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);
    },
    localDate(date) {
      const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
      const value = type => parts.find(part => part.type === type).value;
      return `${value('year')}-${value('month')}-${value('day')}`;
    },
    periodRange(period, now = new Date()) {
      const todayText = this.localDate(now);
      const today = new Date(`${todayText}T12:00:00Z`);
      const day = today.getUTCDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      const shift = (date, days) => { const result = new Date(date); result.setUTCDate(result.getUTCDate() + days); return result; };
      if (period === 'this-week') return { from: this.localDate(shift(today, mondayOffset)), to: this.localDate(shift(today, mondayOffset + 6)) };
      if (period === 'last-week') return { from: this.localDate(shift(today, mondayOffset - 7)), to: this.localDate(shift(today, mondayOffset - 1)) };
      const year = Number(todayText.slice(0, 4)), month = Number(todayText.slice(5, 7));
      const start = period === 'last-month' ? new Date(Date.UTC(year, month - 2, 1, 12)) : new Date(Date.UTC(year, month - 1, 1, 12));
      const end = period === 'last-month' ? new Date(Date.UTC(year, month - 1, 1, 12)) : new Date(Date.UTC(year, month, 1, 12));
      end.setUTCDate(end.getUTCDate() - 1);
      return { from: this.localDate(start), to: this.localDate(end) };
    },
    displayDate(value) { return value ? value.split('-').reverse().join('/') : ''; },
    dateVariables() {
      if (!this.range.from || !this.range.to) this.range = this.periodRange('this-week');
      const from = new Date(`${this.range.from}T00:00:00+07:00`).toISOString();
      const to = new Date(`${this.range.to}T23:59:59.999+07:00`).toISOString();
      return { cashWhere: { createdAt_gte: from, createdAt_lte: to }, settlementWhere: { settledAt_gte: from, settledAt_lte: to } };
    },
    async selectPeriod(period) {
      if (this.loading) return;
      if (period === 'custom') {
        this.customRange = { ...this.range };
        this.customRangeError = '';
        this.customPeriodOpen = true;
        return;
      }
      this.period = period;
      this.range = this.periodRange(period);
      await this.fetchData();
    },
    cancelCustomRange() {
      if (this.loading) return;
      this.customPeriodOpen = false;
      this.customRangeError = '';
      this.customRange = { ...this.range };
    },
    async applyCustomRange() {
      if (!this.customRange.from || !this.customRange.to || this.customRange.from > this.customRange.to) {
        this.customRangeError = 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc';
        return;
      }
      this.period = 'custom';
      this.range = { ...this.customRange };
      this.customPeriodOpen = false;
      this.customRangeError = '';
      await this.fetchData();
    },
    async fetchData() {
      this.loading = true;
      this.loadError = false;
      try {
        const client = this.$apolloProvider.defaultClient;
        const res = await client.query({ query: GET_FINANCIAL_DATA, variables: this.dateVariables(), fetchPolicy: 'network-only' });
        this.cashTransactions = res.data?.allCashTransactions || [];
        this.settlements = res.data?.allPaymentSettlements || [];
        this.parents = res.data?.allParents || [];
      } catch (err) {
        console.error(err);
        this.loadError = true;
      } finally {
        this.loading = false;
      }
    },
    async syncBankTransactions() {
      if (!this.isPaymentHubAdmin || this.syncing) return;
      this.syncing = true;
      try {
        const res = await paymentHubRequest(this, 'post', 'sync');
        if (res.data?.success) {
          this.$bvToast.toast(res.data.message || 'Đã đồng bộ ngân hàng thành công!', {
            title: 'Thành công',
            variant: 'success',
            solid: true
          });
          await this.fetchData();
        } else {
          this.$bvToast.toast(res.data?.message || res.data?.error || 'Không thể đồng bộ từ cổng ngân hàng', {
            title: 'Thông báo',
            variant: 'warning',
            solid: true
          });
        }
      } catch (err) {
        console.error(err);
        this.$bvToast.toast(err.response?.data?.error || err.message || 'Lỗi kết nối đồng bộ', {
          title: 'Lỗi',
          variant: 'danger',
          solid: true
        });
      } finally {
        this.syncing = false;
      }
    },
    openModalAddCash() {
      if (!this.isPaymentHubAdmin) return;
      this.cashForm = {
        parentId: '',
        amount: '',
        paymentMethod: 'CASH',
        bankRef: '',
        receivingAccount: '',
        bankDescription: '',
        autoSettle: true
      };
      this.searchCashStudentKeyword = '';
      this.$bvModal.show('modal-add-cash');
    },
    async submitAddCash() {
      if (!this.isPaymentHubAdmin || this.submitting || !this.cashForm.parentId) return;
      this.submitting = true;
      try {
        const res = await paymentHubRequest(this, 'post', 'assign-parent', {
          cashTxData: manualCashPayload(this.cashForm),
          parentId: this.cashForm.parentId,
          autoSettle: this.cashForm.autoSettle,
          isNewTx: true
        });

        if (res.data?.success) {
          const newTx = res.data.data?.cashTransaction;
          const parentObj = this.parents.find(p => p.id === this.cashForm.parentId);

          // Cập nhật số dư local của phụ huynh
          if (parentObj && res.data.data) {
            if (typeof res.data.data.remainingBalance === 'number') parentObj.balance = res.data.data.remainingBalance;
            if (typeof res.data.data.remainingDebt === 'number') parentObj.debt = res.data.data.remainingDebt;
          }

          // Chèn trực tiếp dòng tiền mới vào đầu danh sách (Optimistic / In-place update)
          if (newTx) {
            this.cashTransactions.unshift({
              ...newTx,
              parent: parentObj ? { id: parentObj.id, code: parentObj.code, name: parentObj.name } : null
            });
          }

          // Chèn các chứng từ gạch nợ mới (nếu có)
          if (Array.isArray(res.data.data?.settlements) && res.data.data.settlements.length > 0) {
            res.data.data.settlements.forEach(st => {
              this.settlements.unshift({
                ...st,
                parent: parentObj ? { id: parentObj.id, code: parentObj.code, name: parentObj.name } : null
              });
            });
          }

          this.$bvToast.toast(
            this.cashForm.autoSettle
              ? 'Đã thu tiền và tự động gạch nợ học phí thành công!'
              : 'Đã nạp số tiền vào Ví khả dụng của phụ huynh!',
            { title: 'Thành công', variant: 'success', solid: true }
          );
          this.$bvModal.hide('modal-add-cash');
        } else {
          this.$bvToast.toast('Lỗi: ' + (res.data?.message || 'Không thể ghi nhận dòng tiền'), {
            title: 'Lỗi',
            variant: 'danger',
            solid: true
          });
        }
      } catch (err) {
        this.$bvToast.toast('Lỗi: ' + (err.response?.data?.error || err.response?.data?.message || err.message), {
          title: 'Lỗi',
          variant: 'danger',
          solid: true
        });
      } finally {
        this.submitting = false;
      }
    },
    openModalAssign(item) {
      if (!this.isPaymentHubAdmin) return;
      this.selectedTx = item;
      this.searchStudentKeyword = '';
      this.assignForm = {
        parentId: '',
        autoSettle: true
      };
      this.$bvModal.show('modal-assign-parent');
    },

    selectParent(item) {
      this.assignForm.parentId = item.id;
    },

    async submitAssign() {
      if (!this.isPaymentHubAdmin || this.assigning || !this.selectedTx || !this.assignForm.parentId) return;
      this.assigning = true;
      try {
        const res = await paymentHubRequest(this, 'post', 'assign-parent', {
          cashTxId: this.selectedTx.id,
          parentId: this.assignForm.parentId,
          autoSettle: this.assignForm.autoSettle
        });

        if (res.data?.success) {
          const parentObj = this.parents.find(p => p.id === this.assignForm.parentId);

          // Cập nhật số dư local của phụ huynh
          if (parentObj && res.data) {
            if (typeof res.data.remainingBalance === 'number') parentObj.balance = res.data.remainingBalance;
            if (typeof res.data.remainingDebt === 'number') parentObj.debt = res.data.remainingDebt;
          }

          // Cập nhật trực tiếp dòng giao dịch trong bảng ngay lập tức (Không reload toàn bộ dữ liệu)
          const targetTx = this.cashTransactions.find(t => t.id === this.selectedTx.id);
          if (targetTx) {
            targetTx.status = 'ALLOCATED';
            targetTx.parent = parentObj ? {
              id: parentObj.id,
              code: parentObj.code,
              name: parentObj.name
            } : res.data.cashTransaction?.parent || { id: this.assignForm.parentId };
          }

          // Thêm các chứng từ gạch nợ mới (nếu có)
          if (Array.isArray(res.data.settlements) && res.data.settlements.length > 0) {
            res.data.settlements.forEach(st => {
              this.settlements.unshift({
                ...st,
                parent: parentObj ? { id: parentObj.id, code: parentObj.code, name: parentObj.name } : null
              });
            });
          }

          this.$bvToast.toast('Đã gán dòng tiền và cập nhật số dư/nợ cho bé thành công!', {
            title: 'Thành công',
            variant: 'success',
            solid: true
          });
          this.$bvModal.hide('modal-assign-parent');
        } else {
          this.$bvToast.toast('Lỗi: ' + (res.data?.message || 'Không thể gán dòng tiền'), {
            title: 'Thất bại',
            variant: 'danger',
            solid: true
          });
        }
      } catch (err) {
        this.$bvToast.toast('Lỗi hệ thống: ' + (err.response?.data?.error || err.response?.data?.message || err.message), {
          title: 'Lỗi',
          variant: 'danger',
          solid: true
        });
      } finally {
        this.assigning = false;
      }
    },

    exportToExcel() {
      // Xuất dữ liệu CSV/Excel đơn giản
      let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
      csvContent += 'Mã giao dịch,Số tiền,Hình thức,Mã phụ huynh,Tên phụ huynh,Nội dung,Thời gian,Trạng thái\n';

      this.cashTransactions.forEach(t => {
        const row = [
          t.code,
          t.type === 'OUTFLOW' ? -t.amount : t.amount,
          t.paymentMethod,
          t.parent?.code || '',
          t.parent?.name || '',
          t.bankDescription || '',
          this.formatDateTime(t.createdAt),
          t.status
        ].map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',');
        csvContent += row + '\n';
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `so-cai-dong-tien-${this.$moment().format('YYYY-MM-DD')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    async openParentModal(parentSummary) {
      if (!parentSummary || !parentSummary.id) return;
      this.showParentModalFlag = true;
      this.loadingParent = true;
      this.parentTabIndex = 0; // Mặc định mở Sổ nợ & Biến động tài chính
      this.activeParent = { ...parentSummary };

      try {
        const client = this.$apolloProvider.defaultClient;
        const res = await client.query({
          query: GET_PARENT_DETAIL,
          variables: { id: parentSummary.id },
          fetchPolicy: 'network-only'
        });
        if (res.data?.Parent) {
          this.activeParent = res.data.Parent;
        }
      } catch (err) {
        console.error('Lỗi khi tải thông tin phụ huynh:', err);
      } finally {
        this.loadingParent = false;
      }
    },

    handleParentUpdated(updatedParent) {
      if (updatedParent && this.activeParent) {
        this.activeParent = { ...this.activeParent, ...updatedParent };
        const pInList = this.parents.find(p => p.id === updatedParent.id);
        if (pInList) Object.assign(pInList, updatedParent);

        this.cashTransactions.forEach(t => {
          if (t.parent?.id === updatedParent.id) {
            t.parent.name = updatedParent.name;
            t.parent.code = updatedParent.code;
          }
        });
      }
      this.loadDataCounter++;
    },

    handleParentDeleted(deletedId) {
      this.showParentModalFlag = false;
      const targetId = deletedId || this.activeParent?.id;
      if (targetId) {
        this.parents = this.parents.filter(p => p.id !== targetId);
        this.cashTransactions.forEach(t => {
          if (t.parent?.id === targetId) {
            t.parent = null;
            t.status = 'UNALLOCATED';
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.parent-link {
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}
.parent-link:hover {
  color: #0056b3 !important;
  text-decoration: underline;
}
.cash-period { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding: .75rem 1rem; border: 1px solid #dee2e6; border-radius: .5rem; background: #fff; }
.period-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
.custom-period-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.custom-period-fields label { font-weight: 600; font-size: .875rem; }
.range-preview { display: flex; align-items: center; min-height: 3rem; padding: .75rem 1rem; color: #35506b; background: #f3f8fc; border: 1px solid #d8e7f2; border-radius: .5rem; }
.range-preview-error { color: #842029; background: #f8d7da; border-color: #f5c2c7; }
.modal-period-actions { display: flex; justify-content: flex-end; gap: .5rem; }
@media (max-width: 575px) { .period-actions { width: 100%; } .period-actions .btn { flex: 1 0 40%; } .custom-period-fields { grid-template-columns: 1fr; } .modal-period-actions .btn { flex: 1; } }
</style>
