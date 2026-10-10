<template>
  <div class="debt-detail-container" v-if="phuhuynh">
    <!-- 1. Header Card: Hồ sơ Phụ huynh & 2 Thẻ KPI Tài chính lớn -->
    <div class="card border-0 shadow-sm bg-white p-3 p-md-4 mb-3 rounded-12">
      <p v-if="historyError" class="alert alert-danger" role="alert">{{ historyError }} <button class="btn btn-link" @click="fetchFullHistory">Tải lại</button></p>
      <div class="row align-items-center">
        <!-- Thông tin Phụ huynh bên trái -->
        <div class="col-lg-6 mb-3 mb-lg-0">
          <div class="d-flex align-items-center">
            <div class="avatar-ph mr-3 shadow-sm text-white">
              <i class="fas fa-user"></i>
            </div>
            <div>
              <div class="d-flex align-items-center flex-wrap mb-1">
                <h5 class="font-weight-bold text-dark mb-0 mr-2">{{ phuhuynh.name }}</h5>
                <span class="badge badge-light border text-secondary font-weight-normal px-2 py-1">
                  Mã: <strong>{{ phuhuynh.code || 'N/A' }}</strong>
                </span>
              </div>
              <div class="text-muted small">
                <span v-if="phuhuynh.phone && phuhuynh.phone.length" class="mr-3">
                  <i class="fas fa-phone-alt text-success mr-1"></i>
                  <strong>{{ phuhuynh.phone.map(p => p.number || p).join(', ') }}</strong>
                </span>
                <span v-if="phuhuynh.hocsinhs && phuhuynh.hocsinhs.length">
                  <i class="fas fa-child text-info mr-1"></i>
                  <span>Con: {{ phuhuynh.hocsinhs.map(h => h.name).join(', ') }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2 KPI Cards nổi bật bên phải -->
        <div class="col-lg-6">
          <div class="row no-gutters">
            <div class="col-6 pr-2">
              <div class="kpi-box kpi-box-balance p-3 rounded-lg text-right">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="badge badge-pill badge-success-soft font-weight-normal small">Tiền còn dư</span>
                  <i class="fas fa-wallet text-success opacity-75"></i>
                </div>
                <div class="kpi-amount text-success font-weight-bold">
                  {{ numberWithCommas(phuhuynh.balance || 0) }} đ
                </div>
                <div class="kpi-subtext text-muted">Số dư tiền đóng trước</div>
              </div>
            </div>

            <div class="col-6 pl-2">
              <div class="kpi-box kpi-box-debt p-3 rounded-lg text-right">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="badge badge-pill badge-danger-soft font-weight-normal small">Còn phải thu</span>
                  <i class="fas fa-file-invoice-dollar text-danger opacity-75"></i>
                </div>
                <div :class="['kpi-amount font-weight-bold', phuhuynh.debt > 0 ? 'text-danger' : 'text-success']">
                  {{ numberWithCommas(phuhuynh.debt || 0) }} đ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Action Toolbar: Các tác vụ kế toán riêng biệt -->
      <div class="action-toolbar mt-3 pt-3 border-top d-flex flex-column flex-sm-row justify-content-between align-items-sm-center">
        <div class="d-flex align-items-center flex-wrap">
          <!-- 1. Thu tiền & Quét VietQR -->
          <button
            v-if="canManageMoney"
            type="button"
            class="btn btn-success rounded-pill px-3 py-2 mr-2 shadow-sm font-weight-bold d-flex align-items-center"
            @click="showCreatePaymentModal = true"
          >
            <i class="fas fa-qrcode mr-2"></i> Thu tiền
          </button>

          <!-- 2. Cấn trừ nợ từ Ví sang Nợ -->
          <button
            v-if="canManageMoney"
            type="button"
            class="btn btn-outline-info rounded-pill px-3 py-2 mr-2 d-flex align-items-center"
            :disabled="postingLocked || !phuhuynh.balance || phuhuynh.balance <= 0 || !phuhuynh.debt || phuhuynh.debt <= 0"
            @click="openSettleModal"
            title="Thanh toán học phí từ số dư"
          >
            <i class="fas fa-arrow-right-arrow-left mr-2"></i> Thanh toán từ số dư
          </button>

          <!-- 3. Chi hoàn tiền -->
          <button
            v-if="canManageMoney"
            type="button"
            class="btn btn-outline-danger rounded-pill px-3 py-2 d-flex align-items-center"
            :disabled="postingLocked || !phuhuynh.balance || phuhuynh.balance <= 0"
            @click="openRefundModal"
            title="Chi trả lại tiền thừa từ số dư ví"
          >
            <i class="fas fa-hand-holding-dollar mr-2"></i> Hoàn tiền
          </button>
        </div>
      </div>
      <PostingStatus :state="posting" @retry="retryPosting" />
    </div>

    <!-- 3. Bảng 2 Sổ Lũy Tiến Độc Lập: Sổ Công Nợ & Sổ Ví Khả Dụng -->
    <div class="card border-0 shadow-sm bg-white rounded-12">
      <div class="card-header bg-white font-weight-bold d-flex flex-column flex-md-row justify-content-between align-items-md-center py-2 px-3 border-bottom">
        <b-nav pills class="mb-2 mb-md-0">
          <b-nav-item :active="ledgerTabIndex === 0" @click="ledgerTabIndex = 0">
            <i class="fas fa-file-invoice-dollar mr-1 text-danger"></i>
            <strong>Công nợ</strong>
            <span class="badge badge-light border text-danger ml-1">{{ debtHistoryItems.length }}</span>
          </b-nav-item>
          <b-nav-item :active="ledgerTabIndex === 1" @click="ledgerTabIndex = 1">
            <i class="fas fa-wallet mr-1 text-success"></i>
            <strong>Số dư</strong>
            <span class="badge badge-light border text-success ml-1">{{ balanceHistoryItems.length }}</span>
          </b-nav-item>
        </b-nav>

        <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="fetchFullHistory">
          <i class="fas fa-sync-alt mr-1"></i> Làm mới sổ
        </button>
      </div>

      <div class="card-body p-0">
        <!-- NỘI DUNG TAB 1: SỔ CÔNG NỢ HỌC PHÍ -->
        <div v-if="ledgerTabIndex === 0">
          <div v-if="!debtHistoryItems || !debtHistoryItems.length" class="text-center py-5 text-muted">
            <i class="fas fa-file-invoice fa-3x mb-3 d-block text-secondary opacity-25"></i>
            <h6 class="text-secondary font-weight-bold">Chưa có phát sinh công nợ</h6>
            <p class="small text-muted mb-0">Hồ sơ phụ huynh này chưa có hóa đơn hoặc phiếu thu gạch nợ nào.</p>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover align-middle mb-0 custom-datatable">
              <thead class="bg-light text-secondary small text-uppercase">
                <tr>
                  <th style="width: 14%;" class="pl-3">NGÀY GIAO DỊCH</th>
                  <th style="width: 15%;">MÃ CHỨNG TỪ</th>
                  <th style="width: 35%;">LOẠI PHIẾU / DIỄN GIẢI KHOẢN THU</th>
                  <th style="width: 18%;" class="text-right">BIẾN ĐỘNG NỢ</th>
                  <th style="width: 18%;" class="text-right pr-3">DƯ NỢ LŨY TIẾN</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in debtHistoryItems" :key="'debt-' + idx">
                  <td class="small text-muted pl-3">
                    <div><i class="far fa-calendar-alt mr-1 text-secondary"></i><strong>{{ showDate(item.date) }}</strong></div>
                    <div class="text-muted" style="font-size: 11px;">{{ showTime(item.date) }}</div>
                  </td>
                  <td>
                    <span
                      v-if="item.documentType === 'HoaDon'"
                      class="badge badge-light border text-primary font-weight-bold px-2 py-1 voucher-btn"
                      @click="viewInvoice(item)"
                      title="Bấm để xem chi tiết hóa đơn này"
                    >
                      <i class="fas fa-file-invoice mr-1"></i>{{ item.code || 'Hóa đơn' }}
                      <i class="fas fa-search-plus ml-1 small opacity-75"></i>
                    </span>
                    <span
                      v-else-if="item.documentType === 'ItemKetSo'"
                      class="badge badge-light border text-purple font-weight-bold px-2 py-1 voucher-btn"
                      @click="viewKetSo(item)"
                      title="Bấm để xem chi tiết phiếu thu học phí tháng này"
                    >
                      <i class="fas fa-clipboard-list mr-1"></i>{{ item.code || 'Thu học phí' }}
                      <i class="fas fa-search-plus ml-1 small opacity-75"></i>
                    </span>
                    <span
                      v-else-if="item.documentType === 'PaymentSettlement'"
                      class="badge badge-light border text-info font-weight-bold px-2 py-1 voucher-btn"
                      @click="viewSettlement(item)"
                      title="Bấm để xem chi tiết giao dịch cấn trừ"
                    >
                      <i class="fas fa-receipt mr-1"></i>{{ item.code || 'Cấn trừ' }}
                      <i class="fas fa-info-circle ml-1 small opacity-75"></i>
                    </span>
                    <span
                      v-else-if="item.documentType === 'PhieuThu'"
                      class="badge badge-light border text-success font-weight-bold px-2 py-1 voucher-btn"
                      @click="viewReceipt(item)"
                      title="Bấm để xem phiếu thu tiền mặt / gạch nợ"
                    >
                      <i class="fas fa-money-bill-wave mr-1"></i>{{ item.code || 'Phiếu thu' }}
                      <i class="fas fa-search-plus ml-1 small opacity-75"></i>
                    </span>
                    <span
                      v-else-if="item.documentType === 'FinancialCorrection'"
                      class="badge badge-light border text-danger font-weight-bold px-2 py-1 voucher-btn"
                      @click="viewCorrection(item)"
                      title="Bấm để xem chi tiết điều chỉnh / hủy chứng từ"
                    >
                      <i class="fas fa-undo-alt mr-1"></i>{{ item.code || 'Điều chỉnh' }}
                      <i class="fas fa-info-circle ml-1 small opacity-75"></i>
                    </span>
                    <span v-else class="badge badge-light border text-dark font-weight-normal px-2 py-1">
                      {{ item.code || 'N/A' }}
                    </span>
                  </td>
                  <td>
                    <div class="font-weight-bold text-dark">{{ item.title }}</div>
                    <small class="text-muted" v-if="item.note">{{ item.note }}</small>
                  </td>
                  <td class="text-right font-weight-bold">
                    <span :class="item.amountClass" class="amount-badge">
                      {{ item.amountSign }}{{ numberWithCommas(item.amount) }} đ
                    </span>
                    <div class="small text-muted" style="font-size: 11px;">{{ item.typeLabel }}</div>
                  </td>
                  <td class="text-right pr-3 font-weight-bold">
                    <span :class="item.runningBalance > 0 ? 'text-danger' : 'text-success'">
                      {{ numberWithCommas(item.runningBalance) }} đ
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- NỘI DUNG TAB 2: SỔ VÍ KHẢ DỤNG -->
        <div v-else-if="ledgerTabIndex === 1">
          <div v-if="!balanceHistoryItems || !balanceHistoryItems.length" class="text-center py-5 text-muted">
            <i class="fas fa-wallet fa-3x mb-3 d-block text-secondary opacity-25"></i>
            <h6 class="text-secondary font-weight-bold">Chưa có biến động số dư ví</h6>
            <p class="small text-muted mb-0">Hồ sơ phụ huynh này chưa có dòng tiền nạp ví hoặc trích cấn trừ nào.</p>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover align-middle mb-0 custom-datatable">
              <thead class="bg-light text-secondary small text-uppercase">
                <tr>
                  <th style="width: 14%;" class="pl-3">NGÀY GIAO DỊCH</th>
                  <th style="width: 15%;">MÃ GIAO DỊCH</th>
                  <th style="width: 35%;">NỘI DUNG NẠP / TRÍCH VÍ</th>
                  <th style="width: 18%;" class="text-right">BIẾN ĐỘNG VÍ</th>
                  <th style="width: 18%;" class="text-right pr-3">SỐ DƯ VÍ LŨY TIẾN</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in balanceHistoryItems" :key="'bal-' + idx">
                  <td class="small text-muted pl-3">
                    <div><i class="far fa-calendar-alt mr-1 text-secondary"></i><strong>{{ showDate(item.date) }}</strong></div>
                    <div class="text-muted" style="font-size: 11px;">{{ showTime(item.date) }}</div>
                  </td>
                  <td>
                    <span
                      v-if="item.code && item.code.startsWith('STL')"
                      class="badge badge-light border text-info font-weight-bold px-2 py-1 voucher-btn"
                      @click="viewSettlement(item)"
                      title="Bấm để xem chi tiết cấn trừ"
                    >
                      <i class="fas fa-receipt mr-1"></i>{{ item.code }}
                    </span>
                    <span
                      v-else-if="item.code && (item.code.startsWith('CT') || item.code.startsWith('PTT'))"
                      class="badge badge-light border text-success font-weight-bold px-2 py-1"
                    >
                      <i class="fas fa-money-bill-wave mr-1"></i>{{ item.code }}
                    </span>
                    <span v-else class="badge badge-light border text-dark font-weight-normal px-2 py-1">
                      {{ item.code || 'N/A' }}
                    </span>
                  </td>
                  <td>
                    <div class="font-weight-bold text-dark">{{ item.title }}</div>
                    <small class="text-muted" v-if="item.note">{{ item.note }}</small>
                  </td>
                  <td class="text-right font-weight-bold">
                    <span :class="item.amountClass" class="amount-badge">
                      {{ item.amountSign }}{{ numberWithCommas(item.amount) }} đ
                    </span>
                    <div class="small text-muted" style="font-size: 11px;">{{ item.typeLabel }}</div>
                  </td>
                  <td class="text-right pr-3 font-weight-bold text-success">
                    {{ numberWithCommas(item.runningBalance) }} đ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Thu tiền Phụ huynh tích hợp VietQR -->
    <b-modal
      v-model="showCreatePaymentModal"
      size="lg"
      title="Thu tiền"
      hide-footer
      no-close-on-backdrop
    >
      <div class="p-1">
        <PhieuThuCreate
          :phuhuynh="phuhuynh"
          @update-state="createPhieuThu"
        />
      </div>
    </b-modal>

    <!-- Modal Cấn trừ nợ từ Balance sang Debt -->
    <b-modal
      v-model="showSettleModal"
      title="Thanh toán từ số dư"
      hide-footer
      no-close-on-backdrop
    >
      <div class="p-2" v-if="phuhuynh">
        <fieldset :disabled="postingLocked">
        <div class="alert alert-info py-2 small mb-3">
          <i class="fas fa-info-circle mr-1"></i>
          <strong>Tiền còn dư:</strong> {{ numberWithCommas(phuhuynh.balance || 0) }} đ.
          <strong>Còn phải thu:</strong> {{ numberWithCommas(phuhuynh.debt || 0) }} đ.
        </div>

        <div class="form-group mb-3">
          <label><input type="checkbox" v-model="settleForm.maximum"> Cấn trừ tối đa tại thời điểm máy chủ nhận yêu cầu</label>
          <label class="font-weight-bold small">Số tiền thanh toán (VNĐ)</label>
          <InputCurrency
            v-model="settleForm.amount"
            :max="maxSettleAmount"
            placeholder="Nhập số tiền thanh toán"
          />
          <small class="text-muted">Tối đa: <strong>{{ numberWithCommas(maxSettleAmount) }} đ</strong></small>
        </div>

        <p class="small text-muted">Số tiền nhập là số chính xác; máy chủ từ chối nếu không đủ ví hoặc nợ, không tự giảm số tiền.</p>

        <div class="form-group mb-4">
          <label class="font-weight-bold small">Ghi chú chứng từ</label>
          <input
            type="text"
            class="form-control"
            v-model="settleForm.note"
            placeholder="Ví dụ: Cấn trừ học phí tháng 09/2026"
          />
        </div>

        <div class="d-flex justify-content-end">
          <button class="btn btn-outline-secondary mr-2 rounded-pill px-4" @click="showSettleModal = false">Hủy</button>
          <button class="btn btn-outline-primary rounded-pill px-4" :disabled="postingLocked" @click="executeSettle">
            <i class="fas fa-check mr-1"></i> {{ posting.busy ? 'Đang xử lý...' : 'Xác nhận thanh toán' }}
          </button>
        </div>
        </fieldset>
        <PostingStatus :state="posting" @retry="retryPosting" />
      </div>
    </b-modal>

    <!-- Modal Chi Hoàn Tiền -->
    <b-modal
      v-model="showRefundModal"
      title="Hoàn tiền"
      hide-footer
      no-close-on-backdrop
    >
      <div class="p-2" v-if="phuhuynh">
        <fieldset :disabled="postingLocked">
        <div class="alert alert-warning py-2 small mb-3">
          <i class="fas fa-exclamation-triangle mr-1"></i>
          Hoàn trả từ <strong>Tiền còn dư</strong> ({{ numberWithCommas(phuhuynh.balance || 0) }} đ) cho phụ huynh.
          Đây là ghi sổ chi tiền, không tự chuyển tiền ngân hàng.
        </div>

        <div class="form-group mb-3">
          <label class="font-weight-bold small">Số tiền hoàn trả (VNĐ)</label>
          <InputCurrency
            v-model="refundForm.amount"
            :max="phuhuynh.balance || 0"
            placeholder="Nhập số tiền hoàn..."
          />
          <small class="text-muted">Tiền còn dư: <strong>{{ numberWithCommas(phuhuynh.balance || 0) }} đ</strong></small>
        </div>

        <div class="form-group mb-3">
          <label class="font-weight-bold small">Phương thức hoàn tiền</label>
          <select class="form-control" v-model="refundForm.paymentMethod">
            <option value="CASH">Tiền mặt tại trường</option>
            <option value="ACB_BANK">Chuyển khoản ACB</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>

        <div class="form-group mb-4">
          <label class="font-weight-bold small">Lý do hoàn trả *</label>
          <input
            type="text"
            class="form-control"
            v-model="refundForm.reason"
            placeholder="Ví dụ: Hoàn tiền ăn xế/thôi học"
            required
          />
        </div>

        <div class="d-flex justify-content-end">
          <button class="btn btn-outline-secondary mr-2 rounded-pill px-4" @click="showRefundModal = false">Hủy</button>
          <button class="btn btn-outline-danger rounded-pill px-4" :disabled="postingLocked" @click="executeRefund">
            <i class="fas fa-hand-holding-dollar mr-1"></i> {{ posting.busy ? 'Đang xử lý...' : 'Xác nhận hoàn tiền' }}
          </button>
        </div>
        </fieldset>
        <PostingStatus :state="posting" @retry="retryPosting" />
      </div>
    </b-modal>

    <!-- Modal Chi tiết Hóa đơn (In / Xuất hóa đơn) -->
    <InvoiceModal
      v-model="showInvoiceModal"
      :invoice="selectedInvoice"
      :can-cancel="false"
    />

    <!-- Modal Chi tiết Giao dịch Cấn trừ nợ (STL) -->
    <b-modal
      v-model="showSettlementModal"
      title="Chi tiết giao dịch cấn trừ nợ"
      hide-footer
      centered
      size="md"
    >
      <div v-if="selectedSettlement" class="p-2">
        <div class="text-center pb-3 border-bottom mb-3">
          <div class="badge badge-info px-3 py-2 font-weight-bold mb-2" style="font-size: 1rem;">
            {{ selectedSettlement.code || 'Phiếu cấn trừ' }}
          </div>
          <h4 class="font-weight-bold text-success mb-1">
            -{{ numberWithCommas(selectedSettlement.amount || 0) }} đ
          </h4>
          <div class="text-muted small">{{ selectedSettlement.settleTypeLabel }}</div>
        </div>

        <div class="small mb-3">
          <div class="d-flex justify-content-between py-2 border-bottom">
            <span class="text-muted">Thời gian thực hiện:</span>
            <strong>{{ showDateTime(selectedSettlement.date) }}</strong>
          </div>
          <div class="d-flex justify-content-between py-2 border-bottom">
            <span class="text-muted">Nội dung / Ghi chú:</span>
            <span class="text-right font-weight-bold text-dark" style="max-width: 65%;">
              {{ selectedSettlement.note || 'Trích từ ví để cấn trừ nợ' }}
            </span>
          </div>
          <div class="d-flex justify-content-between py-2 border-bottom">
            <span class="text-muted">Trạng thái đối soát:</span>
            <span class="badge badge-success font-weight-normal px-2 py-1">Thành công (Đã đối soát)</span>
          </div>
        </div>

        <div v-if="selectedSettlement.relatedInvoiceId" class="mt-3 text-center">
          <button
            type="button"
            class="btn btn-outline-primary btn-sm rounded-pill px-3 font-weight-bold"
            @click="openRelatedInvoice(selectedSettlement.relatedInvoiceId)"
          >
            <i class="fas fa-file-invoice mr-1"></i> Xem hóa đơn liên quan ({{ selectedSettlement.relatedInvoiceCode }})
          </button>
        </div>

        <div class="d-flex justify-content-end mt-4">
          <button type="button" class="btn btn-secondary btn-sm rounded-pill px-3" @click="showSettlementModal = false">
            Đóng
          </button>
        </div>
      </div>
    </b-modal>

    <!-- Modal Chi tiết Phiếu thu tiền (PTT) -->
    <b-modal
      v-model="showReceiptModal"
      title="Phiếu thu tiền mặt / Gạch nợ"
      hide-footer
      centered
      size="lg"
    >
      <div v-if="selectedReceipt" class="p-3">
        <!-- Vùng in Phiếu Thu -->
        <div class="receipt-paper p-4 bg-white border rounded shadow-sm">
          <div class="row align-items-center pb-2 border-bottom mb-3">
            <div class="col-3 text-center">
              <img src="/student.png" alt="Logo Mầm non Ngọc Hoàng" class="img-fluid" style="max-height: 65px;" />
              <div class="text-uppercase font-weight-bold mt-1" style="font-size: 8px;">
                Ngoc Hoang Kindergarten
              </div>
            </div>
            <div class="col-9">
              <h5 class="font-weight-bold text-danger mb-1 text-uppercase">Trường Mầm Non Ngọc Hoàng</h5>
              <div class="small text-muted mb-0">
                <i class="fas fa-map-marker-alt text-danger mr-1"></i> Số 14, Đường 16, P. Linh Chiểu, TP. Thủ Đức, TP.HCM
              </div>
              <div class="small text-dark font-weight-bold">
                <i class="fas fa-phone-alt text-success mr-1"></i> Hotline: 0933.064.964 - 0978.087.992
              </div>
            </div>
          </div>

          <div class="text-center my-3">
            <h4 class="font-weight-bold text-dark text-uppercase mb-1">PHIẾU THU TIỀN MẶT</h4>
            <div class="small text-muted font-italic">
              Số phiếu: <strong class="text-primary">{{ selectedReceipt.code }}</strong> — Ngày lập: {{ showDateTime(selectedReceipt.date) }}
            </div>
          </div>

          <div class="bg-light p-3 rounded mb-3 border small">
            <div class="row">
              <div class="col-sm-6 mb-2 mb-sm-0">
                <div>Họ và tên người nộp: <strong class="text-dark">{{ phuhuynh ? phuhuynh.name : '—' }}</strong></div>
                <div class="text-muted">Mã phụ huynh: <span class="badge badge-secondary">{{ phuhuynh ? phuhuynh.code : '—' }}</span></div>
              </div>
              <div class="col-sm-6">
                <div>Nội dung thu: <strong class="text-dark">{{ selectedReceipt.note || 'Thu tiền gạch nợ học phí' }}</strong></div>
                <div class="text-muted">Hình thức: <strong>Tiền mặt tại trường</strong></div>
              </div>
            </div>
          </div>

          <div class="alert alert-success d-flex justify-content-between align-items-center py-3 px-4 mb-4">
            <span class="font-weight-bold text-uppercase">Số tiền đã thu:</span>
            <span class="font-weight-bold text-success" style="font-size: 1.4rem;">
              {{ numberWithCommas(selectedReceipt.amount || 0) }} đ
            </span>
          </div>

          <div class="row text-center mt-4 pt-2">
            <div class="col-6">
              <div class="font-weight-bold small text-uppercase">Người nộp tiền</div>
              <div class="text-muted small font-italic">(Ký, ghi rõ họ tên)</div>
              <div style="height: 60px;"></div>
              <div class="small font-weight-bold text-dark">{{ phuhuynh ? phuhuynh.name : '' }}</div>
            </div>
            <div class="col-6">
              <div class="font-weight-bold small text-uppercase">Người thu tiền / Thủ quỹ</div>
              <div class="text-muted small font-italic">(Ký, đóng dấu)</div>
              <div style="height: 60px;"></div>
              <div class="small font-weight-bold text-dark">Kế toán nhà trường</div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end mt-3">
          <button type="button" class="btn btn-outline-primary btn-sm rounded-pill px-3 mr-2" @click="printWindow">
            <i class="fas fa-print mr-1"></i> In phiếu thu
          </button>
          <button type="button" class="btn btn-secondary btn-sm rounded-pill px-3" @click="showReceiptModal = false">
            Đóng
          </button>
        </div>
      </div>
    </b-modal>

    <!-- Modal Chi tiết Phiếu Thu Học Phí (ItemKetSo) -->
    <b-modal
      v-model="showKetSoModal"
      title="Chi tiết phiếu thu học phí tháng"
      hide-footer
      centered
      size="lg"
    >
      <div v-if="selectedKetSo" class="p-3">
        <!-- Vùng phiếu kết sổ -->
        <div class="receipt-paper p-4 bg-white border rounded shadow-sm">
          <div class="row align-items-center pb-2 border-bottom mb-3">
            <div class="col-3 text-center">
              <img src="/student.png" alt="Logo Mầm non Ngọc Hoàng" class="img-fluid" style="max-height: 65px;" />
              <div class="text-uppercase font-weight-bold mt-1" style="font-size: 8px;">
                Ngoc Hoang Kindergarten
              </div>
            </div>
            <div class="col-9">
              <h5 class="font-weight-bold text-danger mb-1 text-uppercase">Trường Mầm Non Ngọc Hoàng</h5>
              <div class="small text-muted mb-0">
                <i class="fas fa-map-marker-alt text-danger mr-1"></i> Số 14, Đường 16, P. Linh Chiểu, TP. Thủ Đức, TP.HCM
              </div>
              <div class="small text-dark font-weight-bold">
                <i class="fas fa-phone-alt text-success mr-1"></i> Hotline: 0933.064.964 - 0978.087.992
              </div>
            </div>
          </div>

          <div class="text-center my-3">
            <h4 class="font-weight-bold text-danger text-uppercase mb-1">
              PHIẾU THU HỌC PHÍ — {{ selectedKetSo.periodLabel }}
            </h4>
            <div class="small text-muted font-italic">
              Mã phiếu: <strong class="text-primary">{{ selectedKetSo.code }}</strong> — Lớp: <strong class="text-dark">{{ selectedKetSo.className }}</strong>
            </div>
          </div>

          <div class="bg-light p-3 rounded mb-3 border small">
            <div class="row">
              <div class="col-sm-6 mb-2 mb-sm-0">
                <div>Họ và tên học sinh: <strong class="text-dark" style="font-size: 1rem;">{{ selectedKetSo.studentName }}</strong></div>
                <div>Lớp học: <strong class="text-primary">{{ selectedKetSo.className }}</strong></div>
              </div>
              <div class="col-sm-6">
                <div>Phụ huynh: <strong>{{ phuhuynh ? phuhuynh.name : '—' }}</strong></div>
                <div>Mã PH: <span class="badge badge-secondary">{{ phuhuynh ? phuhuynh.code : '—' }}</span></div>
              </div>
            </div>
          </div>

          <!-- Bảng kê các khoản tiền trong kỳ kết sổ -->
          <div class="table-responsive mb-3">
            <table class="table table-bordered table-sm mb-0 align-middle">
              <thead class="thead-light small text-uppercase font-weight-bold">
                <tr>
                  <th style="width: 8%;" class="text-center">STT</th>
                  <th style="width: 62%;">Khoản mục phí</th>
                  <th style="width: 30%;" class="text-right">Số tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">1</td>
                  <td>Học phí chính khóa</td>
                  <td class="text-right font-weight-bold">{{ numberWithCommas(selectedKetSo.details.hocphi || 0) }} đ</td>
                </tr>
                <tr>
                  <td class="text-center">2</td>
                  <td>Cơ sở vật chất</td>
                  <td class="text-right font-weight-bold">{{ numberWithCommas(selectedKetSo.details.csvc || 0) }} đ</td>
                </tr>
                <tr>
                  <td class="text-center">3</td>
                  <td>Phí Camera</td>
                  <td class="text-right font-weight-bold">{{ numberWithCommas(selectedKetSo.details.camera || 0) }} đ</td>
                </tr>
                <tr>
                  <td class="text-center">4</td>
                  <td>Tiền ăn ngoài giờ / Ăn 545</td>
                  <td class="text-right font-weight-bold">{{ numberWithCommas((selectedKetSo.details.an545 || 0) + (selectedKetSo.details.ngoaigio || 0)) }} đ</td>
                </tr>
                <tr v-if="selectedKetSo.details.phimorong > 0">
                  <td class="text-center">5</td>
                  <td>
                    Phí mở rộng
                    <span v-if="selectedKetSo.details.note_phimorong" class="text-muted small ml-1">
                      ({{ selectedKetSo.details.note_phimorong }})
                    </span>
                  </td>
                  <td class="text-right font-weight-bold">{{ numberWithCommas(selectedKetSo.details.phimorong || 0) }} đ</td>
                </tr>
                <tr v-if="selectedKetSo.details.khac && selectedKetSo.details.khac !== 0" class="table-light">
                  <td class="text-center text-muted">•</td>
                  <td>
                    <span :class="selectedKetSo.details.khac < 0 ? 'text-success font-weight-bold' : 'text-dark'">
                      {{ selectedKetSo.details.khac < 0 ? 'Giảm trừ khác' : 'Thu khác' }}
                    </span>
                    <span v-if="selectedKetSo.details.note_khac || selectedKetSo.details.note" class="text-muted small ml-1">
                      ({{ selectedKetSo.details.note_khac || selectedKetSo.details.note }})
                    </span>
                  </td>
                  <td class="text-right font-weight-bold" :class="selectedKetSo.details.khac < 0 ? 'text-success' : 'text-dark'">
                    {{ selectedKetSo.details.khac < 0 ? '-' : '' }}{{ numberWithCommas(selectedKetSo.details.khac < 0 ? -selectedKetSo.details.khac : selectedKetSo.details.khac) }} đ
                  </td>
                </tr>
                <tr v-if="selectedKetSo.details.thanhtiennghi > 0 || selectedKetSo.details.ngaynghi > 0" class="table-light">
                  <td class="text-center text-muted">•</td>
                  <td class="text-muted">
                    Giảm trừ ngày nghỉ <span v-if="selectedKetSo.details.ngaynghi > 0">(Nghỉ <strong>{{ selectedKetSo.details.ngaynghi }}</strong> ngày)</span>
                  </td>
                  <td class="text-right font-weight-bold text-success">
                    -{{ numberWithCommas(selectedKetSo.details.thanhtiennghi || 0) }} đ
                  </td>
                </tr>
                <tr v-if="selectedKetSo.details.totalHoaDon > 0" class="table-light">
                  <td class="text-center text-muted">•</td>
                  <td>
                    Hóa đơn / Phụ phí phát sinh kèm theo
                    <span v-if="selectedKetSo.details.hoadons && selectedKetSo.details.hoadons.length" class="text-muted small">
                      ({{ selectedKetSo.details.hoadons.map(h => h.code).join(', ') }})
                    </span>
                  </td>
                  <td class="text-right font-weight-bold text-primary">
                    +{{ numberWithCommas(selectedKetSo.details.totalHoaDon) }} đ
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="table-warning">
                  <td colspan="2" class="text-right font-weight-bold text-uppercase text-dark" style="font-size: 1rem;">
                    Tổng cộng phiếu thu học phí:
                  </td>
                  <td class="text-right font-weight-bold text-danger" style="font-size: 1.15rem;">
                    {{ numberWithCommas(selectedKetSo.total || 0) }} đ
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="small text-muted font-italic">
            <i class="fas fa-info-circle mr-1"></i> Khoản phí này đã được ghi nhận vào Sổ Công Nợ phụ huynh.
          </div>
        </div>

        <div class="d-flex justify-content-end mt-3">
          <button type="button" class="btn btn-outline-primary btn-sm rounded-pill px-3 mr-2" @click="printWindow">
            <i class="fas fa-print mr-1"></i> In phiếu thu học phí
          </button>
          <button type="button" class="btn btn-secondary btn-sm rounded-pill px-3" @click="showKetSoModal = false">
            Đóng
          </button>
        </div>
      </div>
    </b-modal>

    <!-- Modal Chi tiết Điều Chỉnh Tài Chính (FinancialCorrection) -->
    <b-modal
      v-model="showCorrectionModal"
      title="Chi tiết điều chỉnh / Hủy chứng từ"
      hide-footer
      centered
      size="md"
    >
      <div v-if="selectedCorrection" class="p-2">
        <div class="text-center pb-3 border-bottom mb-3">
          <div class="badge badge-warning px-3 py-2 font-weight-bold mb-2" style="font-size: 1rem;">
            {{ selectedCorrection.code || 'Điều chỉnh tài chính' }}
          </div>
          <h4 :class="['font-weight-bold mb-1', selectedCorrection.isUp ? 'text-danger' : 'text-success']">
            {{ selectedCorrection.isUp ? '+' : '-' }}{{ numberWithCommas(selectedCorrection.amount || 0) }} đ
          </h4>
          <div class="text-muted small">Nghiệp vụ kiểm soát & hủy chứng từ có kiểm toán</div>
        </div>

        <div class="small mb-3">
          <div class="d-flex justify-content-between py-2 border-bottom">
            <span class="text-muted">Thời gian thực hiện:</span>
            <strong>{{ showDateTime(selectedCorrection.date) }}</strong>
          </div>
          <div class="d-flex justify-content-between py-2 border-bottom">
            <span class="text-muted">Lý do điều chỉnh:</span>
            <span class="text-right font-weight-bold text-danger" style="max-width: 65%;">
              {{ selectedCorrection.reason || 'Hủy / điều chỉnh chứng từ sai sót' }}
            </span>
          </div>
          <div v-if="selectedCorrection.documentId" class="d-flex justify-content-between py-2 border-bottom">
            <span class="text-muted">Chứng từ liên quan:</span>
            <span class="text-right text-primary font-weight-bold">{{ selectedCorrection.documentId }}</span>
          </div>
        </div>

        <div class="d-flex justify-content-end mt-4">
          <button type="button" class="btn btn-secondary btn-sm rounded-pill px-3" @click="showCorrectionModal = false">
            Đóng
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import PhieuThuCreate from '~/components/PhieuThu/Create.vue';
import InputCurrency from '~/components/Common/InputCurrency.vue';
import InvoiceModal from '~/components/HoaDon/InvoiceModal.vue';
import { paymentHubAdmin, paymentHubRequest } from '~/utils/paymentHub';
import postingMixin from '~/utils/postingMixin';
import { postingMoney } from '~/utils/financialPosting';

export default {
  mixins: [postingMixin],
  postingScope: 'parent-wallet',
  components: {
    PhieuThuCreate,
    InputCurrency,
    InvoiceModal,
  },
  props: ['idPhuHuynh', 'loadData'],
  data() {
    return {
      phuhuynh: null,
      historyError: '',
      ledgerTabIndex: 0,
      debtHistoryItems: [],
      balanceHistoryItems: [],
      historyItems: [],
      showCreatePaymentModal: false,
      showSettleModal: false,
      showRefundModal: false,
      showInvoiceModal: false,
      selectedInvoice: null,
      showSettlementModal: false,
      selectedSettlement: null,
      showReceiptModal: false,
      selectedReceipt: null,
      showKetSoModal: false,
      selectedKetSo: null,
      showCorrectionModal: false,
      selectedCorrection: null,
      settling: false,
      refunding: false,
      settleForm: {
        maximum: false,
        amount: 0,
        settleType: 'SCHOOL_TRANSFER',
        note: '',
      },
      refundForm: {
        amount: 0,
        paymentMethod: 'CASH',
        reason: '',
      },
    };
  },
  computed: {
    canManageMoney() { return paymentHubAdmin(this.$store); },
    maxSettleAmount() {
      if (!this.phuhuynh) return 0;
      return Math.min(this.phuhuynh.balance || 0, this.phuhuynh.debt || 0);
    },
  },
  methods: {
    openSettleModal() {
      if (!this.canManageMoney || this.postingLocked) return;
      this.settleForm.maximum = false;
      this.settleForm.amount = this.maxSettleAmount;
      this.settleForm.note = 'Trường chuyển cấn trừ nợ từ số dư ví';
      this.showSettleModal = true;
    },
    openRefundModal() {
      if (!this.canManageMoney || this.postingLocked) return;
      this.refundForm.amount = this.phuhuynh?.balance || 0;
      this.refundForm.reason = 'Hoàn trả số dư ví cho phụ huynh';
      this.showRefundModal = true;
    },
    async executeSettle() {
      if (!this.canManageMoney || this.postingLocked) return;
      try {
        await this.submitPosting('settlements/transfer', { parentId: this.idPhuHuynh,
          amount: this.settleForm.maximum ? null : postingMoney(this.settleForm.amount), reason: this.settleForm.note.trim() });
      } catch (error) { this.posting.error = error.message; }
    },
    async executeRefund() {
      if (!this.canManageMoney || this.postingLocked) return;
      try {
        const reason = this.refundForm.reason.trim();
        if (!reason || reason.length > 500) throw new Error('Nhập lý do hoàn tiền, tối đa 500 ký tự.');
        await this.submitPosting('cash-transactions/outflow', { parentId: this.idPhuHuynh,
          amount: postingMoney(this.refundForm.amount), reason, paymentMethod: this.refundForm.paymentMethod });
      } catch (error) { this.posting.error = error.message; }
    },
    async onPostingCompleted(result) {
      if (!result.refreshOnly) { this.showSettleModal = false; this.showRefundModal = false; }
      await this.fetchFullHistory();
      this.$emit('updated');
    },
    async fetchFullHistory() {
      if (!this.idPhuHuynh) return;
      const client = this.$apolloProvider.defaultClient;
      this.historyError = '';

      try {
        const pRes = await client.query({
          query: gql`
            query GetParentDetail($id: ID!) {
              Parent(where: { id: $id }) {
                id
                code
                name
                debt
                balance
                phone {
                  number
                }
                hocsinhs {
                  id
                  name
                }
              }
            }
          `,
          variables: { id: this.idPhuHuynh },
          fetchPolicy: 'network-only',
        });
        if (pRes.data?.Parent) {
          this.phuhuynh = pRes.data.Parent;
        }

        const ctRes = await client.query({
          query: gql`
            query GetParentCashTxs($parentId: ID!) {
              allCashTransactions(where: { parent: { id: $parentId } }, sortBy: createdAt_DESC) {
                id
                code
                type
                amount
                paymentMethod
                bankDescription
                status
                createdAt
              }
            }
          `,
          variables: { parentId: this.idPhuHuynh },
          fetchPolicy: 'network-only',
        });

        const stRes = await client.query({
          query: gql`
            query GetParentSettlementsAndDocuments($parentId: ID!) {
              allPaymentSettlements(where: { parent: { id: $parentId } }, sortBy: settledAt_DESC) {
                id
                code
                amount
                settleType
                status
                note
                settledAt
              }
              allHoaDons(where: { parent: { id: $parentId } }, sortBy: createdAt_DESC) {
                id
                code
                type
                total
                giamgia
                createdAt
                status
                student {
                  id
                  name
                  lophoc {
                    id
                    name
                  }
                }
                items {
                  id
                  price
                  amount
                  total
                  sanpham {
                    id
                    name
                    code
                  }
                }
              }
              allPhieuThus(where: { parent: { id: $parentId } }, sortBy: createdAt_DESC) {
                id
                code
                total
                status
                ghichu
                createdAt
              }
              allItemKetSos(where: { hocsinh: { parent: { id: $parentId } } }) {
                id
                data
                total
                code
                status
                lophoc {
                  id
                  name
                }
                phieuketso {
                  id
                  code
                }
                hocsinh {
                  id
                  name
                }
              }
            }
          `,
          variables: { parentId: this.idPhuHuynh },
          fetchPolicy: 'network-only',
        });

        // Query vết Log công nợ chuẩn (Nguồn sự thật cho Sổ Công Nợ Lũy Tiến)
        const logRes = await client.query({
          query: gql`
            query GetParentDebtLogs($parentId: String!) {
              allLogs(where: { item: "Parent", idItem: $parentId, key: "debt" }) {
                id
                itemS
                idItemS
                type
                value
                valueChange
                createdAt
                createdTime
              }
            }
          `,
          variables: { parentId: String(this.idPhuHuynh) },
          fetchPolicy: 'network-only',
        });

        // 1. SỔ CÔNG NỢ HỌC PHÍ (DEBT LEDGER)
        const rawLogs = logRes.data?.allLogs || [];
        const settlements = stRes.data?.allPaymentSettlements || [];
        const hoadons = stRes.data?.allHoaDons || [];
        const phieuThus = stRes.data?.allPhieuThus || [];
        const itemKetSos = stRes.data?.allItemKetSos || [];

        const hdMap = new Map(hoadons.map(h => [String(h.id), h]));
        const stlMap = new Map(settlements.map(s => [String(s.id), s]));
        const ptMap = new Map(phieuThus.map(pt => [String(pt.id), pt]));
        const iksMap = new Map(itemKetSos.map(iks => [String(iks.id), iks]));

        // 1.1 Khởi tạo các sự kiện với mã chứng từ chuẩn xác
        const rawEvents = rawLogs.map((log) => {
          const isUp = log.type === 'UP';
          let doc = null;
          let docType = log.itemS;
          let code = '';
          let title = '';
          let note = '';
          let relatedInvoiceCode = '';
          let relatedInvoiceId = '';

          if (log.itemS === 'HoaDon') {
            doc = hdMap.get(log.idItemS);
            code = doc?.code || (log.idItemS ? `HD_${log.idItemS.slice(-6).toUpperCase()}` : 'HD');
            title = doc?.type === 'NHAPHOC'
              ? 'Hóa đơn nhập học & Thu phí'
              : (doc?.type === 'BANLE' ? 'Hóa đơn dịch vụ / Bán lẻ' : 'Hóa đơn học phí');
            const studentText = doc?.student?.name ? `Bé ${doc.student.name} • ` : '';
            const itemsText = doc?.items?.length
              ? doc.items.map(it => it.sanpham?.name || 'Khoản thu').join(', ')
              : 'Phát sinh nợ hóa đơn';
            note = studentText + itemsText;
          } else if (log.itemS === 'PaymentSettlement') {
            doc = stlMap.get(log.idItemS);
            code = doc?.code || (log.idItemS ? `STL_${log.idItemS.slice(-6).toUpperCase()}` : '');
            title = doc?.settleType === 'SCHOOL_TRANSFER'
              ? 'Trường trích số dư cấn trừ nợ'
              : (doc?.settleType === 'AUTO_ACB'
                ? 'Tự động cấn trừ từ số dư ví'
                : (doc?.settleType === 'MANUAL_ACCOUNTANT'
                  ? 'Kế toán cấn trừ tiền mặt / ngân hàng'
                  : 'Nghiệp vụ cấn trừ nợ từ ví'));
            note = doc?.note || 'Trích số dư ví để cấn trừ nợ';
            if (doc?.note) {
              const m = doc.note.match(/HD\w+/);
              if (m) {
                relatedInvoiceCode = m[0];
                const matchedHd = hoadons.find(h => h.code === m[0]);
                if (matchedHd) relatedInvoiceId = matchedHd.id;
              }
            }
          } else if (log.itemS === 'PhieuThu') {
            doc = ptMap.get(log.idItemS);
            code = doc?.code || (log.idItemS ? `PTT_${log.idItemS.slice(-6).toUpperCase()}` : 'PTT');
            title = 'Phiếu thu tiền (Kế toán)';
            note = doc?.ghichu || 'Thu tiền gạch nợ học phí';
          } else if (log.itemS === 'ItemKetSo') {
            doc = iksMap.get(log.idItemS);
            const pksCode = doc?.phieuketso?.code || '';
            if (pksCode && pksCode.includes('_')) {
              const [y, m] = pksCode.split('_');
              code = `KS-${m}/${y}`;
            } else if (doc?.code) {
              code = doc.code;
            } else {
              code = log.idItemS ? `KS_${log.idItemS.slice(-6).toUpperCase()}` : 'KẾT SỔ';
            }
            title = 'Phiếu thu học phí định kỳ';
            const studentText = doc?.hocsinh?.name ? `Bé ${doc.hocsinh.name}` : '';
            const classText = doc?.lophoc?.name ? ` • Lớp ${doc.lophoc.name}` : '';
            const periodText = pksCode ? ` • Kỳ ${pksCode}` : '';
            note = (studentText || classText || periodText) ? `${studentText}${classText}${periodText}` : 'Phát sinh công nợ học phí định kỳ';
          } else if (log.itemS === 'FinancialCorrection') {
            code = log.idItemS ? `DC_${log.idItemS.slice(-6).toUpperCase()}` : 'ĐIỀU CHỈNH';
            title = 'Điều chỉnh / Hoàn tác tài chính';
            note = log.reason || 'Hủy hoặc điều chỉnh chứng từ công nợ';
          } else if (log.itemS === 'FinancialDataRemediation') {
            code = 'QUỸ VÍ';
            title = 'Hiệu chỉnh kỹ thuật hệ thống';
            note = log.reason || 'Đối soát và chuyển nợ âm thành số dư ví';
          } else if (log.itemS === 'PhieuThuCancellation') {
            code = log.idItemS ? `HUY_${log.idItemS.slice(-6).toUpperCase()}` : 'HỦY';
            title = 'Hủy phiếu thu';
            note = 'Hoàn lại công nợ từ phiếu thu bị hủy';
          } else {
            code = log.idItemS ? `${log.itemS?.substring(0, 3).toUpperCase()}_${log.idItemS.slice(-6).toUpperCase()}` : (log.itemS || 'LOG');
            title = log.itemS || 'Giao dịch hạch toán';
            note = '';
          }

          const changeNum = parseInt(log.valueChange || 0, 10);
          const timeMs = new Date(log.createdAt).getTime();

          return {
            id: log.id,
            rawIdItemS: log.idItemS || '',
            itemS: log.itemS,
            documentType: docType,
            documentId: log.idItemS || doc?.id || '',
            code,
            title,
            note,
            amount: changeNum,
            amountSign: isUp ? '+' : '-',
            amountClass: isUp ? 'text-danger font-weight-bold' : 'text-success font-weight-bold',
            typeLabel: isUp ? 'TĂNG NỢ (+)' : 'GIẢM NỢ (-)',
            type: log.type,
            isUp,
            date: log.createdAt,
            timeMs,
            rawDoc: doc,
            relatedInvoiceCode,
            relatedInvoiceId,
          };
        });

        // 1.2 Lọc khử trùng lặp các bản ghi log kép trong cùng giao dịch:
        const cleanEvents = [];
        for (let i = 0; i < rawEvents.length; i++) {
          const cur = rawEvents[i];
          if (cur.itemS === 'PaymentSettlement' && !cur.rawIdItemS) {
            const hasSibling = rawEvents.some((other, oIdx) => oIdx !== i && other.itemS === 'PaymentSettlement' && other.rawIdItemS && Math.abs(other.timeMs - cur.timeMs) < 1500 && other.amount === cur.amount);
            if (hasSibling) continue;
          }
          if (cur.itemS === 'PhieuThu') {
            const hasSibling = rawEvents.some((other, oIdx) => oIdx !== i && other.itemS === 'PaymentSettlement' && other.rawIdItemS === cur.rawIdItemS && Math.abs(other.timeMs - cur.timeMs) < 1500);
            if (hasSibling) continue;
          }
          cleanEvents.push(cur);
        }

        // 1.3 Bổ sung Phiếu Cấn Trừ Mới (PaymentSettlement STL) nếu chưa có trong Log
        settlements.forEach((st) => {
          if (st.status === 'SUCCESS' && (st.amount || 0) > 0) {
            const alreadyInLog = cleanEvents.some((ev) => ev.documentId === st.id || (ev.code && ev.code === st.code));
            if (!alreadyInLog) {
              const settleDate = st.settledAt || new Date().toISOString();
              cleanEvents.push({
                id: st.id,
                rawIdItemS: st.id,
                itemS: 'PaymentSettlement',
                documentType: 'PaymentSettlement',
                documentId: st.id,
                date: settleDate,
                timeMs: new Date(settleDate).getTime(),
                code: st.code || 'STL',
                title: st.settleType === 'SCHOOL_TRANSFER'
                  ? 'Trường trích số dư cấn trừ nợ'
                  : (st.settleType === 'AUTO_ACB'
                    ? 'Tự động cấn trừ từ số dư ví'
                    : 'Cấn trừ nợ từ số dư ví'),
                note: st.note || 'Cấn trừ nợ từ số dư ví',
                amount: st.amount || 0,
                amountSign: '-',
                amountClass: 'text-success font-weight-bold',
                typeLabel: 'CẤN TRỪ (-)',
                isUp: false,
                rawDoc: st,
              });
            }
          }
        });

        // 1.4 Sắp xếp dòng thời gian từ Cũ đến Mới (ASC) để tính Dư nợ lũy tiến chính xác:
        // Trong cùng khoảng thời gian 1.5s: Hóa đơn phát sinh nợ (UP) luôn đứng trước, Cấn trừ (DOWN) đứng sau
        cleanEvents.sort((a, b) => {
          if (Math.abs(a.timeMs - b.timeMs) < 1500) {
            if (a.isUp !== b.isUp) return a.isUp ? -1 : 1;
          }
          return a.timeMs - b.timeMs;
        });

        let currentRunningDebt = 0;
        cleanEvents.forEach((ev) => {
          if (ev.isUp) {
            currentRunningDebt += ev.amount;
          } else {
            currentRunningDebt = Math.max(0, currentRunningDebt - ev.amount);
          }
          ev.runningBalance = currentRunningDebt;
        });

        // 1.5 Đảo ngược thứ tự để hiển thị MỚI NHẤT LÊN TRÊN CÙNG (DESC)
        cleanEvents.reverse();
        this.debtHistoryItems = cleanEvents;

        // --- 2. TÍNH TOÁN SỔ VÍ KHẢ DỤNG (BALANCE LEDGER) ---
        const balanceEvents = [];

        (ctRes.data?.allCashTransactions || []).forEach((ct) => {
          if (ct.status === 'CANCELLED') return;
          const isOut = ct.type === 'OUTFLOW';
          balanceEvents.push({
            date: ct.createdAt,
            timeMs: new Date(ct.createdAt).getTime(),
            code: ct.code,
            title: isOut ? 'Phiếu Chi Hoàn Tiền' : 'Nạp Ví Tiền Mặt / ACB Bank',
            note: ct.bankDescription || (isOut ? 'Hoàn tiền ví' : 'Nạp tiền vào ví'),
            amount: ct.amount || 0,
            amountSign: isOut ? '-' : '+',
            amountClass: isOut ? 'text-danger font-weight-bold' : 'text-success font-weight-bold',
            typeLabel: isOut ? 'CHI TIỀN (-)' : (ct.paymentMethod === 'ACB_BANK' ? 'NẠP ACB BANK (+)' : 'NẠP TIỀN MẶT (+)'),
            change: isOut ? -(ct.amount || 0) : (ct.amount || 0),
            rawDoc: ct,
          });
        });

        (stRes.data?.allPaymentSettlements || []).forEach((st) => {
          if (st.status !== 'SUCCESS') return;
          balanceEvents.push({
            date: st.settledAt,
            timeMs: new Date(st.settledAt).getTime(),
            code: st.code,
            title: 'Trích Ví Cấn Trừ Học Phí',
            note: st.note || 'Trích từ ví để gạch nợ học phí',
            amount: st.amount || 0,
            amountSign: '-',
            amountClass: 'text-warning text-dark font-weight-bold',
            typeLabel: 'TRÍCH VÍ (-)',
            change: -(st.amount || 0),
            rawDoc: st,
          });
        });

        // Sắp xếp thời gian tăng dần để cộng dồn lũy tiến số dư ví
        balanceEvents.sort((a, b) => a.timeMs - b.timeMs);
        let runningBal = 0;
        balanceEvents.forEach((ev) => {
          runningBal = Math.max(0, runningBal + ev.change);
          ev.runningBalance = runningBal;
        });
        // Đảo lại thời gian giảm dần để giao dịch MỚI NHẤT LÊN ĐẦU BẢNG
        balanceEvents.reverse();
        this.balanceHistoryItems = balanceEvents;
      } catch (err) {
        console.error('Lỗi khi tải lịch sử:', err);
        this.historyError = 'Không tải được số dư/sổ mới nhất. Dữ liệu đang hiển thị có thể đã cũ; hãy tải lại trước khi ghi sổ.';
      }
    },
    createPhieuThu(state) {
      if (state === 'REFRESH') { this.fetchFullHistory(); return; }
      if (state === 'CREATED') {
        this.showCreatePaymentModal = false;
        this.fetchFullHistory();
        this.$bvToast.toast('Tạo phiếu thu thành công', {
          title: 'Thành công',
          variant: 'success',
          solid: true,
        });
      }
    },
    async viewInvoice(item) {
      if (item.rawDoc && item.rawDoc.id) {
        this.selectedInvoice = item.rawDoc;
        this.showInvoiceModal = true;
      }
      const invoiceId = item.documentId || item.rawDoc?.id;
      if (invoiceId) {
        try {
          const res = await paymentHubRequest(this, 'get', `invoices/${invoiceId}`);
          if (res.data?.data) {
            this.selectedInvoice = res.data.data;
            this.showInvoiceModal = true;
          }
        } catch (err) {
          console.error('Lỗi tải chi tiết hóa đơn:', err);
          if (!this.selectedInvoice) {
            this.$bvToast.toast('Không tải được hóa đơn: ' + (err.response?.data?.error || err.message || ''), {
              variant: 'danger',
              solid: true,
            });
          }
        }
      }
    },
    async openRelatedInvoice(invoiceId) {
      if (!invoiceId) return;
      this.showSettlementModal = false;
      await this.viewInvoice({ documentId: invoiceId });
    },
    viewSettlement(item) {
      this.selectedSettlement = {
        code: item.code,
        date: item.date,
        amount: item.amount,
        settleTypeLabel: item.title,
        note: item.note,
        rawDoc: item.rawDoc,
        relatedInvoiceCode: item.relatedInvoiceCode || '',
        relatedInvoiceId: item.relatedInvoiceId || '',
      };
      this.showSettlementModal = true;
    },
    viewReceipt(item) {
      this.selectedReceipt = {
        code: item.code,
        date: item.date,
        amount: item.amount,
        note: item.note,
        rawDoc: item.rawDoc,
      };
      this.showReceiptModal = true;
    },
    viewKetSo(item) {
      const doc = item.rawDoc || {};
      let parsed = {};
      try {
        parsed = typeof doc.data === 'string' ? JSON.parse(doc.data) : (doc.data || {});
      } catch (_) {
        parsed = {};
      }
      const pksCode = doc.phieuketso?.code || '';
      let periodLabel = pksCode;
      if (pksCode && pksCode.includes('_')) {
        const [y, m] = pksCode.split('_');
        const numM = parseInt(m, 10);
        const numY = parseInt(y, 10);
        const nextM = numM === 12 ? 1 : numM + 1;
        const nextY = numM === 12 ? numY + 1 : numY;
        const nextMStr = String(nextM).padStart(2, '0');
        periodLabel = `Tháng ${nextMStr}/${nextY}`;
      }
      this.selectedKetSo = {
        code: item.code,
        periodLabel: periodLabel || 'Định kỳ',
        studentName: doc.hocsinh?.name || (this.phuhuynh?.hocsinhs?.[0]?.name) || 'Học sinh',
        className: doc.lophoc?.name || 'Chưa phân lớp',
        total: item.amount || doc.total || parsed.total || 0,
        details: parsed,
      };
      this.showKetSoModal = true;
    },
    viewCorrection(item) {
      this.selectedCorrection = {
        code: item.code,
        date: item.date,
        amount: item.amount,
        isUp: item.isUp,
        reason: item.note || 'Điều chỉnh chứng từ',
        documentId: item.rawIdItemS || '',
      };
      this.showCorrectionModal = true;
    },
    printWindow() {
      window.print();
    },
    showDate(d) {
      if (!d) return '';
      const d1 = new Date(d);
      if (isNaN(d1.getTime())) return '';
      return `${String(d1.getDate()).padStart(2, '0')}/${String(d1.getMonth() + 1).padStart(2, '0')}/${d1.getFullYear()}`;
    },
    showTime(d) {
      if (!d) return '';
      const d1 = new Date(d);
      if (isNaN(d1.getTime())) return '';
      return `${String(d1.getHours()).padStart(2, '0')}:${String(d1.getMinutes()).padStart(2, '0')}`;
    },
    showDateTime(d) {
      if (!d) return '';
      const d1 = new Date(d);
      if (isNaN(d1.getTime())) return '';
      const time = `${String(d1.getHours()).padStart(2, '0')}:${String(d1.getMinutes()).padStart(2, '0')}`;
      const date = `${String(d1.getDate()).padStart(2, '0')}/${String(d1.getMonth() + 1).padStart(2, '0')}/${d1.getFullYear()}`;
      return `${time} ${date}`;
    },
    numberWithCommas(x) {
      if (!x && x !== 0) return '0';
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
  },
  watch: {
    idPhuHuynh: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchFullHistory();
        }
      },
    },
    loadData() {
      this.fetchFullHistory();
    },
  },
};
</script>

<style scoped>
.rounded-12 {
  border-radius: 12px !important;
}

.avatar-ph {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%);
}

.kpi-box {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  transition: all 0.2s ease;
}

.kpi-box-balance {
  border-left: 4px solid #10b981;
  background: #f0fdf4;
}

.kpi-box-debt {
  border-left: 4px solid #ef4444;
  background: #fef2f2;
}

.badge-success-soft {
  background-color: #dcfce7;
  color: #15803d;
}

.badge-danger-soft {
  background-color: #fee2e2;
  color: #b91c1c;
}

.kpi-amount {
  font-size: 1.35rem;
  line-height: 1.2;
}

.kpi-subtext {
  font-size: 0.75rem;
}

.action-toolbar {
  background-color: #ffffff;
}

.custom-datatable th {
  border-top: none;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.custom-datatable td {
  vertical-align: middle;
  padding: 0.85rem 0.75rem;
}

.amount-badge {
  font-size: 0.95rem;
}

.text-purple {
  color: #7c3aed !important;
}

.voucher-btn {
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  user-select: none;
}

.voucher-btn:hover {
  background-color: #e2e8f0 !important;
  color: #0b5ed7 !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

.receipt-paper {
  background: #ffffff;
  color: #212529;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>
