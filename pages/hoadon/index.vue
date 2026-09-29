<template>
  <div class="container-fluid py-3 hoadon-page">
    <!-- Header gọn gàng -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb bg-transparent p-0 mb-1 small">
            <li class="breadcrumb-item"><nuxt-link to="/">Trang chủ</nuxt-link></li>
            <li class="breadcrumb-item active">Hóa đơn</li>
          </ol>
        </nav>
        <h1 class="h4 mb-0 font-weight-bold text-dark">
          <i class="fas fa-file-invoice-dollar text-primary mr-2"></i>Quản lý Hóa Đơn
        </h1>
      </div>
      <div class="d-flex flex-wrap gap-2 mt-2 mt-md-0">
        <nuxt-link to="/phieuthu" class="btn btn-sm btn-outline-info font-weight-bold mr-2 shadow-sm">
          <i class="fas fa-receipt mr-1"></i> Sổ thu chi
        </nuxt-link>
        <nuxt-link to="/sanpham" class="btn btn-sm btn-outline-secondary font-weight-bold shadow-sm">
          <i class="fas fa-box-open mr-1"></i> Danh mục sản phẩm
        </nuxt-link>
      </div>
    </div>

    <!-- Segmented Tab Bar Hiện Đại -->
    <div class="d-flex custom-tab-bar mb-3 border">
      <div
        class="custom-tab-item cursor-pointer text-center"
        :class="{ 'active': activeTab === 'ADMISSION' }"
        @click="activeTab = 'ADMISSION'"
      >
        <i class="fas fa-user-graduate mr-1"></i> Nhập học
      </div>
      <div
        class="custom-tab-item cursor-pointer text-center"
        :class="{ 'active': activeTab === 'RETAIL' }"
        @click="activeTab = 'RETAIL'"
      >
        <i class="fas fa-shopping-bag mr-1"></i> Bán lẻ
      </div>
      <div
        class="custom-tab-item cursor-pointer text-center"
        :class="{ 'active': activeTab === 'HISTORY' }"
        @click="loadInvoicesHistory"
      >
        <i class="fas fa-history mr-1"></i> Lịch sử
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 1: HÓA ĐƠN NHẬP HỌC -->
    <!-- ======================================================== -->
    <div v-if="activeTab === 'ADMISSION'" class="tab-pane-content">
      <div class="row">
        <!-- CỘT TRÁI: NHẬP LIỆU -->
        <div class="col-lg-8 mb-3">
          <!-- Khối 1: Học sinh -->
          <div class="card border-0 shadow-sm rounded-lg mb-3 bg-white">
            <div class="card-header bg-white py-2 border-bottom d-flex justify-content-between align-items-center">
              <span class="font-weight-bold text-dark small text-uppercase">
                <i class="fas fa-user-check text-success mr-1"></i> Học sinh
              </span>
              <button type="button" class="btn btn-xs btn-outline-success font-weight-bold" @click="openQuickCreateStudent">
                <i class="fas fa-plus mr-1"></i> Thêm bé mới
              </button>
            </div>
            <div class="card-body py-2">
              <!-- Ô tìm kiếm học sinh nhanh -->
              <div class="position-relative mb-2">
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <span class="input-group-text bg-light border-right-0"><i class="fas fa-search text-muted"></i></span>
                  </div>
                  <input
                    v-model="admissionSearchQuery"
                    type="text"
                    class="form-control form-control-sm border-left-0"
                    placeholder="Tìm bé, SĐT, Mã PH..."
                    @focus="admissionSearchFocused = true"
                  />
                  <div class="input-group-append" v-if="admissionSearchQuery">
                    <button class="btn btn-outline-secondary" type="button" @click="admissionSearchQuery = ''">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>

                <!-- Dropdown kết quả tìm kiếm -->
                <div
                  v-if="admissionSearchFocused && filteredAdmissionStudents.length"
                  class="search-results-dropdown shadow border rounded bg-white position-absolute w-100 p-1"
                  style="z-index: 1050; max-height: 260px; overflow-y: auto;"
                >
                  <div
                    v-for="s in filteredAdmissionStudents.slice(0, 10)"
                    :key="s.id"
                    class="search-item p-2 border-bottom cursor-pointer rounded hover-bg-light"
                    @mousedown="selectStudentAdmission(s)"
                  >
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <strong class="text-dark">{{ s.name }}</strong>
                        <span class="badge badge-light border ml-1">{{ s.lophoc ? s.lophoc.name : 'Chưa xếp lớp' }}</span>
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
                    <span v-if="selectedParentPhone" class="text-muted font-weight-normal">({{ selectedParentPhone }})</span>
                  </div>
                  <div class="mt-1 mt-md-0">
                    <span class="badge badge-danger px-2 py-1 mr-2">{{ selectedParentCode }}</span>
                    <span>Ví: <strong :class="selectedParentBalance > 0 ? 'text-success' : 'text-muted'">{{ formatMoney(selectedParentBalance) }} đ</strong></span>
                  </div>
                </div>
              </div>
              <div v-else class="text-muted small py-2 text-center border rounded border-dashed bg-light">
                <i class="fas fa-search mr-1"></i> Tìm và chọn học sinh để bắt đầu.
              </div>
            </div>
          </div>

          <!-- Khối 2: Cơ sở vật chất -->
          <div class="card border-0 shadow-sm rounded-lg mb-3 bg-white">
            <div class="card-header bg-white py-2 border-bottom d-flex justify-content-between align-items-center">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="chkCsvc" v-model="admission.hasFacility" />
                <label class="custom-control-label font-weight-bold text-dark small text-uppercase cursor-pointer" for="chkCsvc">
                  <i class="fas fa-building text-warning mr-1"></i> Cơ sở vật chất
                </label>
              </div>
              <span class="badge badge-warning text-dark font-weight-bold small" v-if="admission.hasFacility">FACILITY</span>
            </div>
            <div class="card-body py-2" v-if="admission.hasFacility">
              <div class="row align-items-center">
                <div class="col-md-6 form-group mb-2">
                  <label class="small font-weight-bold text-muted mb-1">Năm học</label>
                  <input v-model="admission.schoolYear" class="form-control form-control-sm font-weight-bold" placeholder="2026-2027" />
                </div>
                <div class="col-md-6 form-group mb-2">
                  <label class="small font-weight-bold text-muted mb-1">Số tiền (đ)</label>
                  <input
                    v-model.number="admission.facilityAmount"
                    type="number"
                    step="1000"
                    class="form-control form-control-sm font-weight-bold text-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Khối 3: Học phí -->
          <div class="card border-0 shadow-sm rounded-lg mb-3 bg-white">
            <div class="card-header bg-white py-2 border-bottom d-flex justify-content-between align-items-center">
              <span class="font-weight-bold text-dark small text-uppercase">
                <i class="fas fa-calendar-alt text-primary mr-1"></i> Học phí
              </span>
              <button type="button" class="btn btn-xs btn-outline-primary font-weight-bold" @click="addTuitionMonth">
                <i class="fas fa-plus mr-1"></i> Thêm tháng
              </button>
            </div>
            <div class="card-body py-2">
              <div
                v-for="(tRow, idx) in admission.tuitionList"
                :key="idx"
                class="p-2 mb-2 border rounded bg-light position-relative"
              >
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="font-weight-bold text-primary small">
                    <span class="badge badge-primary mr-1">#{{ idx + 1 }}</span>
                    {{ idx === 0 ? 'Tháng vào học' : 'Tháng đóng trước' }}
                    (Kỳ: <strong class="text-dark">{{ tRow.billingMonth }}</strong>)
                  </span>
                  <button
                    v-if="admission.tuitionList.length > 1"
                    type="button"
                    class="btn btn-xs btn-link text-danger p-0"
                    @click="removeTuitionMonth(idx)"
                    title="Xóa tháng"
                  >
                    <i class="fas fa-times"></i> Xóa
                  </button>
                </div>

                <div class="row align-items-center">
                  <div class="col-md-4 form-group mb-1">
                    <label class="small text-muted mb-1">Kỳ thu</label>
                    <input v-model="tRow.billingMonth" type="month" class="form-control form-control-sm font-weight-bold text-dark" />
                  </div>
                  <div class="col-md-4 form-group mb-1">
                    <label class="small text-muted mb-1">Số tiền (đ)</label>
                    <input
                      v-model.number="tRow.amount"
                      type="number"
                      step="1000"
                      class="form-control form-control-sm font-weight-bold text-success"
                    />
                  </div>
                  <div class="col-md-4 form-group mb-1">
                    <label class="small text-muted mb-1">Tính nhanh</label>
                    <div class="btn-group btn-group-sm w-100">
                      <button type="button" class="btn btn-outline-secondary btn-sm" @click="setTuitionRatio(tRow, 1.0)">100%</button>
                      <button type="button" class="btn btn-outline-secondary btn-sm" @click="setTuitionRatio(tRow, 0.5)">50%</button>
                      <button type="button" class="btn btn-outline-info btn-sm" @click="openDaysCalcModal(tRow)">Theo ngày</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Khối 4: Đồng phục & Đồ dùng -->
          <div class="card border-0 shadow-sm rounded-lg mb-3 bg-white">
            <div class="card-header bg-white py-2 border-bottom d-flex justify-content-between align-items-center">
              <span class="font-weight-bold text-dark small text-uppercase">
                <i class="fas fa-tshirt text-info mr-1"></i> Đồng phục & Đồ dùng
              </span>
              <button type="button" class="btn btn-xs btn-outline-info font-weight-bold" @click="addProductItem">
                <i class="fas fa-plus mr-1"></i> Thêm món
              </button>
            </div>
            <div class="card-body py-2">
              <!-- Nút chọn nhanh 1 chạm -->
              <div class="mb-2" v-if="productCatalog.length">
                <button
                  v-for="sp in productCatalog.slice(0, 5)"
                  :key="`chip-${sp.id}`"
                  type="button"
                  class="btn btn-xs btn-outline-secondary mr-1 mb-1"
                  @click="quickAddProductToAdmission(sp)"
                >
                  <i class="fas fa-plus text-success mr-1"></i> {{ sp.name }} ({{ formatMoney(sp.price) }}đ)
                </button>
              </div>

              <div
                v-for="(pRow, pIdx) in admission.productList"
                :key="pIdx"
                class="row align-items-center py-1 border-bottom small"
              >
                <div class="col-md-5 col-12 mb-1 mb-md-0">
                  <select v-model="pRow.sanphamId" class="form-control form-control-sm" @change="onSelectProduct(pRow)">
                    <option value="">-- Chọn món hàng --</option>
                    <option v-for="sp in productCatalog" :key="sp.id" :value="sp.id">
                      {{ sp.name }} (Gốc: {{ formatMoney(sp.price) }}đ)
                    </option>
                  </select>
                </div>
                <div class="col-md-3 col-5">
                  <input
                    v-model.number="pRow.price"
                    type="number"
                    step="1000"
                    class="form-control form-control-sm font-weight-bold text-primary"
                    placeholder="Đơn giá"
                    title="Đơn giá bán"
                  />
                </div>
                <div class="col-md-2 col-3">
                  <input
                    v-model.number="pRow.amount"
                    type="number"
                    min="1"
                    class="form-control form-control-sm text-center font-weight-bold"
                    placeholder="SL"
                    title="Số lượng"
                  />
                </div>
                <div class="col-md-2 col-4 text-right">
                  <span class="font-weight-bold text-info d-block">{{ formatMoney((pRow.price || 0) * (pRow.amount || 1)) }} đ</span>
                  <button type="button" class="btn btn-xs btn-link text-danger p-0 mt-1" @click="admission.productList.splice(pIdx, 1)">
                    <i class="fas fa-times"></i> Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CỘT PHẢI: TỔNG KẾT & THANH TOÁN -->
        <div class="col-lg-4 mb-3">
          <div class="card border-0 shadow-sm rounded-lg bg-white sticky-top" style="top: 1rem;">
            <div class="card-header bg-dark text-white py-2">
              <h6 class="font-weight-bold mb-0 text-uppercase small">
                <i class="fas fa-calculator mr-1"></i> Tổng kết Hóa đơn
              </h6>
            </div>
            <div class="card-body p-3">
              <div class="small mb-2">
                <div class="d-flex justify-content-between py-1 border-bottom" v-if="admission.hasFacility && admission.facilityAmount > 0">
                  <span class="text-muted">CSVC ({{ admission.schoolYear }}):</span>
                  <strong>{{ formatMoney(admission.facilityAmount) }} đ</strong>
                </div>
                <div
                  v-for="(t, tIdx) in admission.tuitionList"
                  :key="`sum-t-${tIdx}`"
                  class="d-flex justify-content-between py-1 border-bottom"
                >
                  <span class="text-muted">Học phí {{ t.billingMonth }}:</span>
                  <strong class="text-success">{{ formatMoney(t.amount) }} đ</strong>
                </div>
                <div
                  v-for="(p, pIdx) in admission.productList"
                  :key="`sum-p-${pIdx}`"
                  class="d-flex justify-content-between py-1 border-bottom"
                >
                  <span class="text-truncate text-muted" style="max-width: 150px;">{{ p.name || 'Sản phẩm' }} (x{{ p.amount }}):</span>
                  <strong class="text-info">{{ formatMoney((p.price || 0) * (p.amount || 1)) }} đ</strong>
                </div>

                <div class="d-flex justify-content-between align-items-center py-2">
                  <span class="text-muted font-weight-bold">Giảm trừ (đ):</span>
                  <input
                    v-model.number="admission.discount"
                    type="number"
                    step="1000"
                    class="form-control form-control-sm text-right text-danger font-weight-bold"
                    style="max-width: 130px;"
                  />
                </div>

                <div class="d-flex justify-content-between py-2 border-top border-bottom bg-light px-2 rounded mt-1">
                  <span class="font-weight-bold text-dark">TỔNG CỘNG:</span>
                  <span class="font-weight-bold text-danger h5 mb-0">{{ formatMoney(totalAdmissionAmount) }} đ</span>
                </div>
              </div>

              <!-- Nút chọn thanh toán dạng Grid 4 thẻ -->
              <div class="mb-3">
                <label class="font-weight-bold small text-muted mb-2 text-uppercase">Hình thức thanh toán</label>
                <div class="row no-gutters">
                  <div class="col-6 pr-1 pb-2">
                    <div
                      class="payment-tile cursor-pointer p-2 rounded border text-center"
                      :class="{ 'active': admission.paymentMethod === 'CASH' }"
                      @click="admission.paymentMethod = 'CASH'"
                    >
                      <i class="fas fa-money-bill-wave text-success mr-1"></i>
                      <span class="font-weight-bold small">Tiền mặt</span>
                    </div>
                  </div>
                  <div class="col-6 pl-1 pb-2">
                    <div
                      class="payment-tile cursor-pointer p-2 rounded border text-center"
                      :class="{ 'active': admission.paymentMethod === 'ACB_BANK' }"
                      @click="admission.paymentMethod = 'ACB_BANK'"
                    >
                      <i class="fas fa-qrcode text-primary mr-1"></i>
                      <span class="font-weight-bold small">VietQR ACB</span>
                    </div>
                  </div>
                  <div class="col-6 pr-1">
                    <div
                      class="payment-tile cursor-pointer p-2 rounded border text-center"
                      :class="{ 'active': admission.paymentMethod === 'WALLET' }"
                      @click="admission.paymentMethod = 'WALLET'"
                    >
                      <i class="fas fa-wallet text-warning mr-1"></i>
                      <span class="font-weight-bold small">Trừ ví ({{ formatMoney(selectedParentBalance) }}đ)</span>
                    </div>
                  </div>
                  <div class="col-6 pl-1">
                    <div
                      class="payment-tile cursor-pointer p-2 rounded border text-center"
                      :class="{ 'active': admission.paymentMethod === 'DEBT' }"
                      @click="admission.paymentMethod = 'DEBT'"
                    >
                      <i class="fas fa-clock text-secondary mr-1"></i>
                      <span class="font-weight-bold small">Ghi nợ</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                class="btn btn-success btn-block font-weight-bold py-2 shadow-sm"
                :disabled="submittingAdmission || !admission.studentId || totalAdmissionAmount <= 0"
                @click="submitAdmissionInvoice"
              >
                <i class="fas" :class="submittingAdmission ? 'fa-spinner fa-spin mr-1' : 'fa-check-circle mr-1'"></i>
                {{ submittingAdmission ? 'Đang tạo...' : 'Tạo & In Hóa Đơn' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 2: HÓA ĐƠN BÁN LẺ -->
    <!-- ======================================================== -->
    <div v-if="activeTab === 'RETAIL'" class="tab-pane-content">
      <div class="row">
        <!-- Cột trái: Chọn học sinh & Sản phẩm -->
        <div class="col-lg-8 mb-3">
          <div class="card border-0 shadow-sm rounded-lg mb-3 bg-white">
            <div class="card-header bg-white py-2 border-bottom">
              <span class="font-weight-bold text-dark small text-uppercase">
                <i class="fas fa-user text-primary mr-1"></i> Học sinh
              </span>
            </div>
            <div class="card-body py-2">
              <div class="position-relative mb-2">
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <span class="input-group-text bg-light border-right-0"><i class="fas fa-search text-muted"></i></span>
                  </div>
                  <input
                    v-model="retailSearchQuery"
                    type="text"
                    class="form-control form-control-sm border-left-0"
                    placeholder="Tìm bé, SĐT, Mã PH..."
                    @focus="retailSearchFocused = true"
                  />
                  <div class="input-group-append" v-if="retailSearchQuery">
                    <button class="btn btn-outline-secondary" type="button" @click="retailSearchQuery = ''">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>

                <!-- Dropdown kết quả -->
                <div
                  v-if="retailSearchFocused && filteredRetailStudents.length"
                  class="search-results-dropdown shadow border rounded bg-white position-absolute w-100 p-1"
                  style="z-index: 1050; max-height: 250px; overflow-y: auto;"
                >
                  <div
                    v-for="s in filteredRetailStudents.slice(0, 10)"
                    :key="s.id"
                    class="search-item p-2 border-bottom cursor-pointer rounded hover-bg-light"
                    @mousedown="selectStudentRetail(s)"
                  >
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <strong class="text-dark">{{ s.name }}</strong>
                        <span class="badge badge-light border ml-1">{{ s.lophoc ? s.lophoc.name : 'Chưa xếp lớp' }}</span>
                        <div class="small text-muted mt-1">
                          PH: {{ s.parent ? s.parent.name : '—' }}
                          <span v-if="s.parent && s.parent.code" class="badge badge-danger ml-1">{{ s.parent.code }}</span>
                        </div>
                      </div>
                      <button type="button" class="btn btn-xs btn-primary">Chọn</button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="selectedRetailStudent" class="bg-light p-2 rounded border small">
                <strong>{{ selectedRetailStudent.name }}</strong> ({{ selectedRetailStudent.lophoc ? selectedRetailStudent.lophoc.name : '—' }})
                — PH: {{ selectedRetailStudent.parent ? selectedRetailStudent.parent.name : '—' }}
                <span v-if="selectedRetailStudent.parent && selectedRetailStudent.parent.code" class="badge badge-danger ml-1">
                  {{ selectedRetailStudent.parent.code }}
                </span>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm rounded-lg mb-3 bg-white">
            <div class="card-header bg-white py-2 border-bottom d-flex justify-content-between align-items-center">
              <span class="font-weight-bold text-dark small text-uppercase">
                <i class="fas fa-cart-plus text-success mr-1"></i> Sản phẩm & Dịch vụ
              </span>
              <input
                v-model="productSearchText"
                type="text"
                class="form-control form-control-sm"
                style="max-width: 200px;"
                placeholder="Lọc món hàng..."
              />
            </div>
            <div class="card-body p-0">
              <div class="table-responsive" style="max-height: 350px; overflow-y: auto;">
                <table class="table table-hover table-sm mb-0 align-middle">
                  <thead class="thead-light small">
                    <tr>
                      <th>Tên món</th>
                      <th class="text-right">Đơn giá</th>
                      <th class="text-center" style="width: 100px;">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="sp in filteredProductCatalog" :key="sp.id">
                      <td class="font-weight-bold text-dark">{{ sp.name }}</td>
                      <td class="text-right text-primary font-weight-bold">{{ formatMoney(sp.price) }} đ</td>
                      <td class="text-center">
                        <button type="button" class="btn btn-xs btn-outline-success font-weight-bold" @click="addProductToRetail(sp)">
                          <i class="fas fa-plus mr-1"></i> Thêm
                        </button>
                      </td>
                    </tr>
                    <tr v-if="!filteredProductCatalog.length">
                      <td colspan="3" class="text-center py-3 text-muted small">Không tìm thấy sản phẩm.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Cột phải: Giỏ hàng & Thanh toán -->
        <div class="col-lg-4 mb-3">
          <div class="card border-0 shadow-sm rounded-lg bg-white sticky-top" style="top: 1rem;">
            <div class="card-header bg-dark text-white py-2">
              <h6 class="font-weight-bold mb-0 text-uppercase small">
                <i class="fas fa-receipt mr-1"></i> Giỏ hàng & Thanh toán
              </h6>
            </div>
            <div class="card-body p-3">
              <div class="small mb-3">
                <div v-if="!retail.cart.length" class="text-muted text-center py-4 font-italic">
                  <i class="fas fa-shopping-cart fa-2x mb-2 d-block text-muted opacity-50"></i>
                  Chưa có món hàng nào.
                </div>
                <div
                  v-for="(item, idx) in retail.cart"
                  :key="idx"
                  class="p-2 mb-2 border rounded bg-light"
                >
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="font-weight-bold text-dark">{{ item.name }}</span>
                    <button type="button" class="btn btn-xs btn-link text-danger p-0" @click="retail.cart.splice(idx, 1)" title="Xóa món này">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <div class="row no-gutters align-items-center">
                    <div class="col-5 pr-1">
                      <input
                        v-model.number="item.price"
                        type="number"
                        step="1000"
                        class="form-control form-control-sm font-weight-bold text-primary"
                        placeholder="Đơn giá"
                        title="Đơn giá bán"
                      />
                    </div>
                    <div class="col-3 px-1">
                      <div class="d-flex align-items-center">
                        <button type="button" class="btn btn-xs btn-light border" @click="item.amount = Math.max(1, item.amount - 1)">-</button>
                        <span class="px-1 font-weight-bold small">{{ item.amount }}</span>
                        <button type="button" class="btn btn-xs btn-light border" @click="item.amount += 1">+</button>
                      </div>
                    </div>
                    <div class="col-4 pl-1 text-right font-weight-bold text-primary">
                      {{ formatMoney((item.price || 0) * (item.amount || 1)) }} đ
                    </div>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center py-2" v-if="retail.cart.length">
                  <span class="text-muted font-weight-bold">Giảm trừ (đ):</span>
                  <input
                    v-model.number="retail.discount"
                    type="number"
                    step="1000"
                    class="form-control form-control-sm text-right text-danger font-weight-bold"
                    style="max-width: 130px;"
                  />
                </div>

                <div class="d-flex justify-content-between py-2 border-top border-bottom bg-light px-2 rounded mt-2">
                  <span class="font-weight-bold text-dark">TỔNG TIỀN:</span>
                  <span class="font-weight-bold text-danger h5 mb-0">{{ formatMoney(totalRetailAmount) }} đ</span>
                </div>
              </div>

              <!-- Nút chọn thanh toán dạng Grid 4 thẻ -->
              <div class="mb-3">
                <label class="font-weight-bold small text-muted mb-2 text-uppercase">Hình thức thanh toán</label>
                <div class="row no-gutters">
                  <div class="col-6 pr-1 pb-2">
                    <div
                      class="payment-tile cursor-pointer p-2 rounded border text-center"
                      :class="{ 'active': retail.paymentMethod === 'CASH' }"
                      @click="retail.paymentMethod = 'CASH'"
                    >
                      <i class="fas fa-money-bill-wave text-success mr-1"></i>
                      <span class="font-weight-bold small">Tiền mặt</span>
                    </div>
                  </div>
                  <div class="col-6 pl-1 pb-2">
                    <div
                      class="payment-tile cursor-pointer p-2 rounded border text-center"
                      :class="{ 'active': retail.paymentMethod === 'ACB_BANK' }"
                      @click="retail.paymentMethod = 'ACB_BANK'"
                    >
                      <i class="fas fa-qrcode text-primary mr-1"></i>
                      <span class="font-weight-bold small">VietQR ACB</span>
                    </div>
                  </div>
                  <div class="col-6 pr-1">
                    <div
                      class="payment-tile cursor-pointer p-2 rounded border text-center"
                      :class="{ 'active': retail.paymentMethod === 'WALLET' }"
                      @click="retail.paymentMethod = 'WALLET'"
                    >
                      <i class="fas fa-wallet text-warning mr-1"></i>
                      <span class="font-weight-bold small">Trừ ví</span>
                    </div>
                  </div>
                  <div class="col-6 pl-1">
                    <div
                      class="payment-tile cursor-pointer p-2 rounded border text-center"
                      :class="{ 'active': retail.paymentMethod === 'DEBT' }"
                      @click="retail.paymentMethod = 'DEBT'"
                    >
                      <i class="fas fa-clock text-secondary mr-1"></i>
                      <span class="font-weight-bold small">Ghi nợ</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                class="btn btn-primary btn-block font-weight-bold py-2 shadow-sm"
                :disabled="submittingRetail || !retail.studentId || !retail.cart.length"
                @click="submitRetailInvoice"
              >
                <i class="fas" :class="submittingRetail ? 'fa-spinner fa-spin mr-1' : 'fa-check-circle mr-1'"></i>
                {{ submittingRetail ? 'Đang xuất...' : 'Xuất Hóa Đơn & In' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 3: LỊCH SỬ HÓA ĐƠN -->
    <!-- ======================================================== -->
    <div v-if="activeTab === 'HISTORY'" class="tab-pane-content">
      <div class="card border-0 shadow-sm rounded-lg bg-white">
        <div class="card-header bg-white py-2 border-bottom d-flex flex-wrap justify-content-between align-items-center">
          <div class="d-flex align-items-center mb-2 mb-md-0">
            <h6 class="font-weight-bold text-dark mb-0 mr-3">
              <i class="fas fa-list text-primary mr-1"></i> Lịch sử hóa đơn
            </h6>
            <!-- Bộ lọc loại hóa đơn nhanh -->
            <div class="btn-group btn-group-sm">
              <button
                type="button"
                class="btn btn-sm"
                :class="historyTypeFilter === 'ALL' ? 'btn-dark' : 'btn-outline-secondary'"
                @click="historyTypeFilter = 'ALL'"
              >
                Tất cả
              </button>
              <button
                type="button"
                class="btn btn-sm"
                :class="historyTypeFilter === 'NHAPHOC' ? 'btn-success' : 'btn-outline-secondary'"
                @click="historyTypeFilter = 'NHAPHOC'"
              >
                Nhập học
              </button>
              <button
                type="button"
                class="btn btn-sm"
                :class="historyTypeFilter === 'BANLE' ? 'btn-info' : 'btn-outline-secondary'"
                @click="historyTypeFilter = 'BANLE'"
              >
                Bán lẻ
              </button>
            </div>
          </div>

          <div class="d-flex align-items-center">
            <input
              v-model="historyFilterText"
              type="text"
              class="form-control form-control-sm mr-2"
              placeholder="Tìm mã HĐ, tên bé, Mã PH..."
              style="width: 220px;"
            />
            <button type="button" class="btn btn-sm btn-outline-secondary" :disabled="loadingHistory" @click="fetchInvoicesHistory">
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': loadingHistory }"></i>
            </button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-hover table-sm align-middle mb-0">
            <thead class="thead-light small text-uppercase font-weight-bold text-muted">
              <tr>
                <th>Mã HĐ</th>
                <th>Loại</th>
                <th>Học sinh</th>
                <th>Phụ huynh</th>
                <th>Thời gian</th>
                <th class="text-right">Tổng tiền</th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingHistory">
                <td colspan="7" class="text-center py-4 text-muted">
                  <i class="fas fa-spinner fa-spin mr-1"></i> Đang tải dữ liệu...
                </td>
              </tr>
              <tr v-for="hd in filteredHistoryList" :key="hd.id">
                <td><code class="font-weight-bold text-primary">{{ hd.code }}</code></td>
                <td>
                  <span class="badge" :class="hd.type === 'NHAPHOC' ? 'badge-success' : 'badge-info'">
                    {{ hd.type === 'NHAPHOC' ? 'Nhập học' : 'Bán lẻ' }}
                  </span>
                </td>
                <td class="font-weight-bold text-dark">{{ hd.student ? hd.student.name : '—' }}</td>
                <td class="small">
                  {{ hd.parent ? hd.parent.name : '—' }}
                  <span v-if="hd.parent && hd.parent.code" class="badge badge-danger ml-1">{{ hd.parent.code }}</span>
                </td>
                <td class="small text-muted">{{ formatDateTime(hd.createdAt) }}</td>
                <td class="text-right font-weight-bold text-danger">{{ formatMoney(hd.total) }} đ</td>
                <td class="text-center">
                  <button type="button" class="btn btn-xs btn-outline-primary font-weight-bold" @click="viewInvoiceDetail(hd.id)">
                    <i class="fas fa-eye mr-1"></i> Xem & In
                  </button>
                </td>
              </tr>
              <tr v-if="!loadingHistory && !filteredHistoryList.length">
                <td colspan="7" class="text-center py-4 text-muted">Không có hóa đơn phù hợp.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL TÍNH THEO NGÀY -->
    <b-modal v-model="daysCalcModalOpen" title="Tính học phí theo ngày" hide-footer size="sm" centered>
      <div v-if="activeCalcRow">
        <div class="form-group mb-2">
          <label class="small font-weight-bold mb-1">Số ngày học trong tháng</label>
          <input v-model.number="calcDays" type="number" min="1" max="31" class="form-control form-control-sm font-weight-bold text-primary" />
          <small class="text-muted">Chuẩn: 22 ngày/tháng.</small>
        </div>
        <div class="alert alert-light border small py-2 mb-3">
          Học phí chuẩn: <strong>{{ formatMoney(studentBaseFee) }} đ</strong><br />
          Quy đổi: <strong class="text-success">{{ formatMoney(Math.round((studentBaseFee / 22) * calcDays)) }} đ</strong>
        </div>
        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-light btn-sm border mr-2" @click="daysCalcModalOpen = false">Hủy</button>
          <button type="button" class="btn btn-primary btn-sm font-weight-bold" @click="applyDaysCalc">
            Áp dụng
          </button>
        </div>
      </div>
    </b-modal>

    <!-- MODAL XEM & IN HÓA ĐƠN -->
    <InvoiceModal v-model="showInvoiceModal" :invoice="currentInvoice" />
  </div>
</template>

<script>
import { paymentHubRequest } from '~/utils/paymentHub';
import InvoiceModal from '~/components/HoaDon/InvoiceModal.vue';
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
    InvoiceModal,
  },
  data() {
    return {
      activeTab: 'ADMISSION', // 'ADMISSION' | 'RETAIL' | 'HISTORY'
      studentList: [],
      productCatalog: [],
      tuitionFeesMap: {},
      // Tìm kiếm thông minh cho Tab 1 (Nhập học)
      admissionSearchQuery: '',
      admissionSearchFocused: false,
      // Form Nhập học
      admission: {
        studentId: '',
        hasFacility: true,
        schoolYear: '2026-2027',
        facilityAmount: 2000000,
        tuitionList: [],
        productList: [],
        discount: 0,
        paymentMethod: 'CASH',
      },
      submittingAdmission: false,
      // Tìm kiếm thông minh cho Tab 2 (Bán lẻ)
      retailSearchQuery: '',
      retailSearchFocused: false,
      productSearchText: '',
      retail: {
        studentId: '',
        cart: [],
        discount: 0,
        paymentMethod: 'CASH',
      },
      submittingRetail: false,
      // Lịch sử & Tìm kiếm lịch sử
      historyList: [],
      historyFilterText: '',
      historyTypeFilter: 'ALL', // 'ALL' | 'NHAPHOC' | 'BANLE'
      loadingHistory: false,
      // Modal Tính ngày
      daysCalcModalOpen: false,
      activeCalcRow: null,
      calcDays: 15,
      // Modal In Hóa Đơn
      showInvoiceModal: false,
      currentInvoice: {},
    };
  },
  computed: {
    filteredAdmissionStudents() {
      if (!this.admissionSearchQuery) return [];
      const q = removeVietnameseTones(this.admissionSearchQuery);
      return this.studentList.filter(s => {
        const sName = removeVietnameseTones(s.name);
        const pName = removeVietnameseTones(s.parent ? s.parent.name : '');
        const pCode = removeVietnameseTones(s.parent ? s.parent.code : '');
        const pPhone = s.parentPhoneText || '';
        return sName.includes(q) || pName.includes(q) || pCode.includes(q) || pPhone.includes(q);
      });
    },
    filteredRetailStudents() {
      if (!this.retailSearchQuery) return [];
      const q = removeVietnameseTones(this.retailSearchQuery);
      return this.studentList.filter(s => {
        const sName = removeVietnameseTones(s.name);
        const pName = removeVietnameseTones(s.parent ? s.parent.name : '');
        const pCode = removeVietnameseTones(s.parent ? s.parent.code : '');
        return sName.includes(q) || pName.includes(q) || pCode.includes(q);
      });
    },
    filteredProductCatalog() {
      if (!this.productSearchText) return this.productCatalog;
      const q = removeVietnameseTones(this.productSearchText);
      return this.productCatalog.filter(p => removeVietnameseTones(p.name).includes(q));
    },
    filteredHistoryList() {
      let list = this.historyList;
      if (this.historyTypeFilter !== 'ALL') {
        list = list.filter(h => h.type === this.historyTypeFilter);
      }
      if (!this.historyFilterText) return list;
      const q = removeVietnameseTones(this.historyFilterText);
      return list.filter(h => {
        const c = removeVietnameseTones(h.code);
        const s = removeVietnameseTones(h.student ? h.student.name : '');
        const p = removeVietnameseTones(h.parent ? h.parent.name : '');
        const pCode = removeVietnameseTones(h.parent ? h.parent.code : '');
        return c.includes(q) || s.includes(q) || p.includes(q) || pCode.includes(q);
      });
    },
    selectedStudent() {
      return this.studentList.find(s => String(s.id) === String(this.admission.studentId)) || null;
    },
    selectedRetailStudent() {
      return this.studentList.find(s => String(s.id) === String(this.retail.studentId)) || null;
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
    studentBaseFee() {
      if (!this.selectedStudent) return 3000000;
      const key = this.selectedStudent.namhocphi || 'HPN_2026';
      return this.tuitionFeesMap[key] || 3000000;
    },
    studentDiscount() {
      const s = this.selectedStudent;
      return (s && Number(s.hocphigiam)) || 0;
    },
    netStandardTuition() {
      return Math.max(0, this.studentBaseFee - this.studentDiscount);
    },
    totalAdmissionAmount() {
      let sum = 0;
      if (this.admission.hasFacility) {
        sum += Number(this.admission.facilityAmount) || 0;
      }
      for (const t of this.admission.tuitionList) {
        sum += Number(t.amount) || 0;
      }
      for (const p of this.admission.productList) {
        sum += (Number(p.price) || 0) * (Number(p.amount) || 1);
      }
      return Math.max(0, sum - (Number(this.admission.discount) || 0));
    },
    totalRetailAmount() {
      const subtotal = this.retail.cart.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.amount) || 1), 0);
      return Math.max(0, subtotal - (Number(this.retail.discount) || 0));
    },
  },
  mounted() {
    this.initDefaultMonth();
    this.loadCatalogAndStudents();
  },
  methods: {
    initDefaultMonth() {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      this.admission.tuitionList = [
        {
          billingMonth: `${y}-${m}`,
          amount: 3000000,
          note: `Học phí tháng ${m}/${y}`,
        },
      ];
    },
    async loadCatalogAndStudents() {
      try {
        const client = this.$apolloProvider.defaultClient;
        const res = await client.query({
          query: gql`
            query {
              allStudents(sortBy: name_ASC) {
                id name sName birthday namhocphi hocphigiam
                parent { id name code balance phone { number } }
                lophoc { id name }
              }
              allSanPhams(sortBy: code_DESC) { id name price type code }
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

        this.productCatalog = (res.data && res.data.allSanPhams) || [];

        const feeMap = {};
        const vars = (res.data && res.data.allVariables) || [];
        for (const v of vars) {
          feeMap[v.key] = Number(v.value) || 0;
        }
        this.tuitionFeesMap = feeMap;
      } catch (err) {
        console.error('Lỗi nạp dữ liệu danh mục:', err);
      }
    },
    selectStudentAdmission(s) {
      this.admission.studentId = s.id;
      this.admissionSearchQuery = s.name;
      this.admissionSearchFocused = false;
      const standard = this.netStandardTuition;
      if (this.admission.tuitionList.length) {
        this.admission.tuitionList[0].amount = standard;
      }
    },
    selectStudentRetail(s) {
      this.retail.studentId = s.id;
      this.retailSearchQuery = s.name;
      this.retailSearchFocused = false;
    },
    addTuitionMonth() {
      const lastMonth = this.admission.tuitionList[this.admission.tuitionList.length - 1]?.billingMonth;
      let nextMonth = this.admission.tuitionList[0]?.billingMonth || '2026-10';
      if (lastMonth) {
        const parts = lastMonth.split('-');
        const y = Number(parts[0]);
        const m = Number(parts[1]);
        const nextM = m === 12 ? 1 : m + 1;
        const nextY = m === 12 ? y + 1 : y;
        nextMonth = `${nextY}-${String(nextM).padStart(2, '0')}`;
      }
      this.admission.tuitionList.push({
        billingMonth: nextMonth,
        amount: this.netStandardTuition,
        note: `Học phí đóng trước tháng ${nextMonth}`,
      });
    },
    removeTuitionMonth(idx) {
      this.admission.tuitionList.splice(idx, 1);
    },
    setTuitionRatio(row, ratio) {
      row.amount = Math.round(this.netStandardTuition * ratio);
      if (ratio === 0.5) row.note = `Học phí nửa tháng (${row.billingMonth})`;
      else if (ratio === 1.0) row.note = `Học phí tròn tháng (${row.billingMonth})`;
    },
    openDaysCalcModal(row) {
      this.activeCalcRow = row;
      this.calcDays = 15;
      this.daysCalcModalOpen = true;
    },
    applyDaysCalc() {
      if (this.activeCalcRow) {
        this.activeCalcRow.amount = Math.round((this.netStandardTuition / 22) * this.calcDays);
        this.activeCalcRow.note = `Học phí ${this.calcDays} ngày (${this.activeCalcRow.billingMonth})`;
      }
      this.daysCalcModalOpen = false;
    },
    addProductItem() {
      const firstSp = this.productCatalog[0] || {};
      this.admission.productList.push({
        sanphamId: firstSp.id || '',
        name: firstSp.name || '',
        price: firstSp.price || 0,
        amount: 1,
      });
    },
    quickAddProductToAdmission(sp) {
      const exist = this.admission.productList.find(p => String(p.sanphamId) === String(sp.id));
      if (exist) {
        exist.amount += 1;
      } else {
        this.admission.productList.push({
          sanphamId: sp.id,
          name: sp.name,
          price: sp.price || 0,
          amount: 1,
        });
      }
    },
    onSelectProduct(row) {
      const sp = this.productCatalog.find(s => String(s.id) === String(row.sanphamId));
      if (sp) {
        row.name = sp.name;
        row.price = sp.price || 0;
      }
    },
    async submitAdmissionInvoice() {
      if (this.submittingAdmission || !this.admission.studentId) return;
      this.submittingAdmission = true;
      try {
        const payload = {
          studentId: this.admission.studentId,
          paymentMethod: this.admission.paymentMethod,
          facilityAmount: this.admission.hasFacility ? Number(this.admission.facilityAmount) : 0,
          schoolYear: this.admission.schoolYear,
          tuitionItems: this.admission.tuitionList,
          productItems: this.admission.productList.map(p => ({
            sanphamId: p.sanphamId,
            name: p.name,
            price: p.price,
            amount: p.amount,
            total: (p.price || 0) * (p.amount || 1),
          })),
          discount: Number(this.admission.discount) || 0,
        };

        const res = await paymentHubRequest(this, 'post', 'invoices/admission', payload);
        const inv = res.data?.invoice || res.data?.data;
        this.currentInvoice = inv;
        this.showInvoiceModal = true;
        this.$bvToast.toast(`Đã tạo Hóa đơn nhập học ${inv.code}`, { variant: 'success', solid: true });
      } catch (err) {
        this.$bvToast.toast(err.response?.data?.error || err.message || 'Lỗi tạo hóa đơn', { variant: 'danger', solid: true });
      } finally {
        this.submittingAdmission = false;
      }
    },
    addProductToRetail(sp) {
      const exist = this.retail.cart.find(i => String(i.sanphamId) === String(sp.id));
      if (exist) {
        exist.amount += 1;
      } else {
        this.retail.cart.push({
          sanphamId: sp.id,
          name: sp.name,
          price: sp.price || 0,
          amount: 1,
        });
      }
    },
    async submitRetailInvoice() {
      if (this.submittingRetail || !this.retail.studentId || !this.retail.cart.length) return;
      this.submittingRetail = true;
      try {
        const payload = {
          studentId: this.retail.studentId,
          paymentMethod: this.retail.paymentMethod,
          items: this.retail.cart,
          discount: Number(this.retail.discount) || 0,
        };

        const res = await paymentHubRequest(this, 'post', 'invoices/retail', payload);
        const inv = res.data?.invoice || res.data?.data;
        this.currentInvoice = inv;
        this.showInvoiceModal = true;
        this.retail.cart = [];
        this.retail.discount = 0;
        this.$bvToast.toast(`Đã tạo Hóa đơn bán lẻ ${inv.code}`, { variant: 'success', solid: true });
      } catch (err) {
        this.$bvToast.toast(err.response?.data?.error || err.message || 'Lỗi tạo hóa đơn', { variant: 'danger', solid: true });
      } finally {
        this.submittingRetail = false;
      }
    },
    loadInvoicesHistory() {
      this.activeTab = 'HISTORY';
      this.fetchInvoicesHistory();
    },
    async fetchInvoicesHistory() {
      this.loadingHistory = true;
      try {
        const client = this.$apolloProvider.defaultClient;
        const res = await client.query({
          query: gql`
            query {
              allHoaDons(sortBy: createdAt_DESC, first: 30) {
                id code total type createdAt
                student { id name }
                parent { id name code }
              }
            }
          `,
          fetchPolicy: 'network-only',
        });
        this.historyList = (res.data && res.data.allHoaDons) || [];
      } catch (err) {
        console.error('Lỗi nạp lịch sử hóa đơn:', err);
      } finally {
        this.loadingHistory = false;
      }
    },
    async viewInvoiceDetail(invoiceId) {
      try {
        const res = await paymentHubRequest(this, 'get', `invoices/${invoiceId}`);
        this.currentInvoice = res.data?.data || {};
        this.showInvoiceModal = true;
      } catch (err) {
        this.$bvToast.toast(err.response?.data?.error || err.message || 'Lỗi tải chi tiết hóa đơn', { variant: 'danger', solid: true });
      }
    },
    openQuickCreateStudent() {
      this.$router.push('/hocsinh/create');
    },
    formatMoney(val) {
      return Number(val || 0).toLocaleString('vi-VN');
    },
    formatDateTime(val) {
      if (!val) return '—';
      const d = new Date(val);
      return Number.isNaN(d.getTime())
        ? '—'
        : new Intl.DateTimeFormat('vi-VN', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'Asia/Ho_Chi_Minh',
          }).format(d);
    },
  },
};
</script>

<style scoped>
.hoadon-page {
  min-height: 85vh;
}
.btn-xs {
  padding: 0.15rem 0.4rem;
  font-size: 0.75rem;
}
.cursor-pointer {
  cursor: pointer;
}
.custom-tab-bar {
  background: #f8fafc;
  border-radius: 8px;
  padding: 4px;
}
.custom-tab-item {
  flex: 1;
  color: #64748b;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.15s ease-in-out;
}
.custom-tab-item:hover {
  color: #0f172a;
}
.custom-tab-item.active {
  background: #ffffff;
  color: #2563eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
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
.payment-tile {
  background: #f8f9fa;
  border-color: #dee2e6;
  transition: all 0.15s ease-in-out;
  user-select: none;
}
.payment-tile:hover {
  background: #ffffff;
  border-color: #adb5bd;
}
.payment-tile.active {
  background: #eff6ff;
  border-color: #2563eb;
  color: #1d4ed8;
  box-shadow: 0 0 0 1px #2563eb;
}
</style>
