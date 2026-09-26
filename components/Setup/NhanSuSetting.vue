<template>
  <div class="nhansu-workspace">
    <!-- 1. Header & Summary Stats -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
      <div>
        <h4 class="font-weight-bold text-dark mb-1">
          <i class="fas fa-users-cog text-primary mr-2"></i> Quản Lý Nhân Sự & Phân Quyền
        </h4>
        <p class="text-muted small mb-0">
          Quản trị toàn diện cán bộ, giáo viên, nhân viên: Thông tin liên hệ, chức vụ phân quyền, phân công lớp và trạng thái làm việc
        </p>
      </div>

      <div class="mt-2 mt-sm-0 d-flex align-items-center">
        <button
          type="button"
          class="btn btn-primary rounded-pill px-3 font-weight-bold shadow-sm"
          @click="openModalCreate"
        >
          <i class="fas fa-user-plus mr-1"></i> Thêm nhân sự mới
        </button>
      </div>
    </div>

    <!-- 2. KPI Summary Cards -->
    <div class="row mb-3">
      <div class="col-6 col-md-3 mb-2">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small font-weight-bold">TỔNG NHÂN SỰ</span>
              <h3 class="font-weight-bold text-dark mb-0 mt-1">{{ stats.total }}</h3>
            </div>
            <div class="stat-icon-sm bg-primary-light text-primary">
              <i class="fas fa-users"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-2">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small font-weight-bold">ĐANG LÀM VIỆC</span>
              <h3 class="font-weight-bold text-success mb-0 mt-1">{{ stats.active }}</h3>
            </div>
            <div class="stat-icon-sm bg-success-light text-success">
              <i class="fas fa-user-check"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-2">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small font-weight-bold">GIÁO VIÊN ĐỨNG LỚP</span>
              <h3 class="font-weight-bold text-info mb-0 mt-1">{{ stats.teachers }}</h3>
            </div>
            <div class="stat-icon-sm bg-info-light text-info">
              <i class="fas fa-chalkboard-teacher"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-3 mb-2">
        <div class="card border-0 shadow-sm rounded-lg p-3 bg-white h-100">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <span class="text-muted small font-weight-bold">TẠM NGHỈ / ĐÃ NGHỈ</span>
              <h3 class="font-weight-bold text-secondary mb-0 mt-1">{{ stats.inactive }}</h3>
            </div>
            <div class="stat-icon-sm bg-light text-secondary">
              <i class="fas fa-user-clock"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Filter & Search Controls -->
    <div class="card border-0 bg-white p-3 mb-3 rounded-lg shadow-sm">
      <div class="row align-items-center">
        <!-- Search Keyword -->
        <div class="col-md-5 col-lg-4 mb-2 mb-md-0">
          <div class="input-group input-group-sm">
            <div class="input-group-prepend">
              <span class="input-group-text bg-light border-right-0"><i class="fas fa-search text-muted"></i></span>
            </div>
            <input
              type="text"
              class="form-control bg-light border-left-0"
              v-model="searchKeyword"
              placeholder="Tìm họ tên, username, SĐT..."
            />
            <div class="input-group-append" v-if="searchKeyword">
              <button class="btn btn-light border" type="button" @click="searchKeyword = ''">&times;</button>
            </div>
          </div>
        </div>

        <!-- Filter Role -->
        <div class="col-md-4 col-lg-3 mb-2 mb-md-0">
          <select class="form-control form-control-sm bg-light" v-model="filterRole">
            <option value="">-- Tất cả chức vụ ({{ allRoles.length }}) --</option>
            <option v-for="r in allRoles" :key="r.id" :value="r.slug">
              {{ r.name }}
            </option>
          </select>
        </div>

        <!-- Filter Status -->
        <div class="col-md-3 col-lg-3 mb-2 mb-md-0">
          <select class="form-control form-control-sm bg-light" v-model="filterStatus">
            <option value="">-- Tất cả trạng thái --</option>
            <option value="DANG_LAM">Đang làm việc</option>
            <option value="TAM_NGHI">Tạm nghỉ</option>
            <option value="DA_NGHI_VIEC">Đã nghỉ việc</option>
          </select>
        </div>

        <!-- Refresh button -->
        <div class="col-lg-2 text-right">
          <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="fetchData">
            <i class="fas fa-sync-alt mr-1" :class="{ 'fa-spin': loadingData }"></i> Làm mới
          </button>
        </div>
      </div>
    </div>

    <!-- 4. Table Nhân Sự -->
    <div class="card border-0 shadow-sm rounded-lg overflow-hidden bg-white">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="thead-light">
            <tr>
              <th style="width: 50px;">STT</th>
              <th>Nhân Sự</th>
              <th>Số Điện Thoại</th>
              <th>Chức Vụ / Quyền Hạn</th>
              <th>Lớp Phụ Trách</th>
              <th class="text-center">Trạng Thái</th>
              <th class="text-right" style="width: 170px;">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in filteredUsers"
              :key="user.id"
              :class="{ 'table-secondary-row': user.status === 'DA_NGHI_VIEC' }"
            >
              <td class="text-muted font-weight-bold">{{ index + 1 }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <div
                    class="avatar-user-table mr-2 flex-shrink-0"
                    :class="user.gender === 'NAM' ? 'bg-primary' : 'bg-pink'"
                  >
                    {{ (user.name || user.username || 'U').charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="d-flex align-items-center">
                      <strong class="text-dark">{{ user.name || '---' }}</strong>
                      <span v-if="user.gender === 'NAM'" class="badge badge-light border text-primary ml-1 small">Thầy</span>
                      <span v-else class="badge badge-light border text-danger ml-1 small">Cô</span>
                      <span v-if="user.isAdmin" class="badge badge-warning text-dark ml-1 font-weight-bold" style="font-size: 0.62rem;">
                        ADMIN
                      </span>
                    </div>
                    <small class="text-muted font-italic">@{{ user.username }}</small>
                    <small class="text-muted d-block" v-if="user.note">Note: {{ user.note }}</small>
                  </div>
                </div>
              </td>
              <td>
                <a
                  v-if="user.phone"
                  :href="'tel:' + user.phone"
                  class="badge badge-light border text-dark font-weight-normal px-2 py-1"
                >
                  <i class="fas fa-phone-alt text-success mr-1"></i> {{ user.phone }}
                </a>
                <span v-else class="text-muted small">---</span>
              </td>
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <span
                    v-for="role in user.roles"
                    :key="role.id"
                    :class="['badge mr-1 mb-1 font-weight-normal py-1 px-2', getRoleBadgeClass(role.slug)]"
                  >
                    {{ role.name }}
                  </span>
                  <span v-if="!user.roles || !user.roles.length" class="text-muted small font-italic">
                    Chưa phân quyền
                  </span>
                </div>
              </td>
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <span
                    v-for="lh in user.lophoc"
                    :key="lh.id"
                    class="badge badge-info mr-1 mb-1 font-weight-normal"
                  >
                    <i class="fas fa-shapes mr-1 small"></i>{{ lh.name }}
                  </span>
                  <span v-if="!user.lophoc || !user.lophoc.length" class="text-muted small">
                    ---
                  </span>
                </div>
              </td>
              <td class="text-center">
                <span v-if="user.status === 'DANG_LAM' || !user.status" class="badge badge-success font-weight-normal px-2 py-1">
                  <i class="fas fa-check-circle mr-1 small"></i> Đang làm việc
                </span>
                <span v-else-if="user.status === 'TAM_NGHI'" class="badge badge-warning text-dark font-weight-normal px-2 py-1">
                  <i class="fas fa-pause-circle mr-1 small"></i> Tạm nghỉ
                </span>
                <span v-else-if="user.status === 'DA_NGHI_VIEC'" class="badge badge-secondary font-weight-normal px-2 py-1">
                  <i class="fas fa-user-slash mr-1 small"></i> Đã nghỉ việc
                </span>
              </td>
              <td class="text-right">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary py-1 px-2 mr-1"
                  title="Đổi mật khẩu"
                  @click="openResetPassword(user)"
                >
                  <i class="fas fa-key"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-primary py-1 px-2 mr-1"
                  title="Chỉnh sửa hồ sơ & Phân quyền"
                  @click="openEditUser(user)"
                >
                  <i class="fas fa-user-edit"></i>
                </button>
                <button
                  v-if="user.username !== 'admin'"
                  type="button"
                  :class="[
                    'btn btn-sm py-1 px-2',
                    user.status === 'DA_NGHI_VIEC' ? 'btn-outline-success' : 'btn-outline-warning text-dark'
                  ]"
                  :title="user.status === 'DA_NGHI_VIEC' ? 'Mở lại làm việc' : 'Đánh dấu nghỉ việc'"
                  @click="toggleUserStatus(user)"
                >
                  <i :class="user.status === 'DA_NGHI_VIEC' ? 'fas fa-user-check' : 'fas fa-user-lock'"></i>
                </button>
              </td>
            </tr>

            <tr v-if="filteredUsers.length === 0">
              <td colspan="7" class="text-center py-5 text-muted">
                <i class="fas fa-user-slash fa-2x mb-2 text-muted"></i>
                <p class="mb-0">Không tìm thấy nhân sự nào khớp với điều kiện tìm kiếm.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal 1: Thêm nhân sự mới -->
    <b-modal id="modal-create-nhansu" title="Thêm Nhân Sự Mới" hide-footer centered size="lg">
      <form @submit.prevent="handleCreateUser">
        <div class="row">
          <div class="col-md-6 form-group">
            <label class="font-weight-bold small">Họ và Tên <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="formCreate.name" required placeholder="Ví dụ: Cô Nguyễn Thị Mai" />
          </div>
          <div class="col-md-6 form-group">
            <label class="font-weight-bold small">Tên đăng nhập <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="formCreate.username" required placeholder="Ví dụ: comai" />
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 form-group">
            <label class="font-weight-bold small">Mật khẩu khởi tạo <span class="text-danger">*</span></label>
            <input type="password" class="form-control" v-model="formCreate.password" required placeholder="Nhập mật khẩu..." />
          </div>
          <div class="col-md-6 form-group">
            <label class="font-weight-bold small">Số điện thoại</label>
            <input type="tel" class="form-control" v-model="formCreate.phone" placeholder="09xxxxxxxx" />
          </div>
        </div>

        <div class="row">
          <div class="col-md-4 form-group">
            <label class="font-weight-bold small">Giới tính</label>
            <select class="form-control" v-model="formCreate.gender">
              <option value="NU">Nữ (Cô)</option>
              <option value="NAM">Nam (Thầy)</option>
            </select>
          </div>
          <div class="col-md-4 form-group">
            <label class="font-weight-bold small">Trạng thái làm việc</label>
            <select class="form-control" v-model="formCreate.status">
              <option value="DANG_LAM">Đang làm việc</option>
              <option value="TAM_NGHI">Tạm nghỉ</option>
              <option value="DA_NGHI_VIEC">Đã nghỉ việc</option>
            </select>
          </div>
          <div class="col-md-4 form-group">
            <label class="font-weight-bold small">Email (nếu có)</label>
            <input type="email" class="form-control" v-model="formCreate.email" placeholder="email@gmail.com" />
          </div>
        </div>

        <div class="form-group">
          <label class="font-weight-bold small">Ghi chú nhân sự</label>
          <input type="text" class="form-control" v-model="formCreate.note" placeholder="Ví dụ: Giáo viên chính thức, vào làm từ 2024..." />
        </div>

        <div class="form-group">
          <label class="font-weight-bold small">Chức vụ / Vai trò phân quyền</label>
          <div class="d-flex flex-wrap p-2 border rounded bg-light">
            <div v-for="r in allRoles" :key="r.id" class="custom-control custom-checkbox mr-3 mb-2">
              <input
                type="checkbox"
                class="custom-control-input"
                :id="`chk_role_${r.id}`"
                :value="r.id"
                v-model="formCreate.roleIds"
              />
              <label class="custom-control-label" :for="`chk_role_${r.id}`">
                <span :class="['badge font-weight-normal py-1 px-2', getRoleBadgeClass(r.slug)]">{{ r.name }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="font-weight-bold small">Lớp phụ trách (dành cho Giáo viên / Bảo mẫu đứng lớp)</label>
          <div class="d-flex flex-wrap p-2 border rounded bg-light">
            <div v-for="lh in allLopHocs" :key="lh.id" class="custom-control custom-checkbox mr-3 mb-2" v-if="lh.name">
              <input
                type="checkbox"
                class="custom-control-input"
                :id="`chk_lh_${lh.id}`"
                :value="lh.id"
                v-model="formCreate.lopHocIds"
              />
              <label class="custom-control-label" :for="`chk_lh_${lh.id}`">{{ lh.name }}</label>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end mt-4 pt-2 border-top">
          <button type="button" class="btn btn-light mr-2" @click="$bvModal.hide('modal-create-nhansu')">Hủy bỏ</button>
          <button type="submit" class="btn btn-primary font-weight-bold px-4" :disabled="loadingAction">
            <span v-if="loadingAction"><i class="fas fa-spinner fa-spin mr-1"></i> Đang tạo...</span>
            <span v-else><i class="fas fa-check mr-1"></i> Tạo nhân sự</span>
          </button>
        </div>
      </form>
    </b-modal>

    <!-- Modal 2: Chỉnh sửa hồ sơ, Chức vụ & Lớp -->
    <b-modal id="modal-edit-nhansu" title="Chỉnh Sửa Hồ Sơ & Phân Quyền" hide-footer centered size="lg">
      <div v-if="selectedUser">
        <form @submit.prevent="handleUpdateUser">
          <div class="row">
            <div class="col-md-6 form-group">
              <label class="font-weight-bold small">Họ và Tên <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="formEdit.name" required />
            </div>
            <div class="col-md-6 form-group">
              <label class="font-weight-bold small">Số điện thoại</label>
              <input type="tel" class="form-control" v-model="formEdit.phone" placeholder="09xxxxxxxx" />
            </div>
          </div>

          <div class="row">
            <div class="col-md-4 form-group">
              <label class="font-weight-bold small">Giới tính</label>
              <select class="form-control" v-model="formEdit.gender">
                <option value="NU">Nữ (Cô)</option>
                <option value="NAM">Nam (Thầy)</option>
              </select>
            </div>
            <div class="col-md-4 form-group">
              <label class="font-weight-bold small">Trạng thái làm việc</label>
              <select class="form-control" v-model="formEdit.status">
                <option value="DANG_LAM">Đang làm việc</option>
                <option value="TAM_NGHI">Tạm nghỉ</option>
                <option value="DA_NGHI_VIEC">Đã nghỉ việc</option>
              </select>
            </div>
            <div class="col-md-4 form-group">
              <label class="font-weight-bold small">Email</label>
              <input type="email" class="form-control" v-model="formEdit.email" />
            </div>
          </div>

          <div class="form-group">
            <label class="font-weight-bold small">Ghi chú</label>
            <input type="text" class="form-control" v-model="formEdit.note" />
          </div>

          <div class="form-group">
            <label class="font-weight-bold small">Chức vụ / Quyền hạn</label>
            <div class="d-flex flex-wrap p-2 border rounded bg-light">
              <div v-for="r in allRoles" :key="r.id" class="custom-control custom-checkbox mr-3 mb-2">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  :id="`chk_edit_role_${r.id}`"
                  :value="r.id"
                  v-model="formEdit.roleIds"
                />
                <label class="custom-control-label" :for="`chk_edit_role_${r.id}`">
                  <span :class="['badge font-weight-normal py-1 px-2', getRoleBadgeClass(r.slug)]">{{ r.name }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="font-weight-bold small">Lớp phụ trách</label>
            <div class="d-flex flex-wrap p-2 border rounded bg-light">
              <div v-for="lh in allLopHocs" :key="lh.id" class="custom-control custom-checkbox mr-3 mb-2" v-if="lh.name">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  :id="`chk_edit_lh_${lh.id}`"
                  :value="lh.id"
                  v-model="formEdit.lopHocIds"
                />
                <label class="custom-control-label" :for="`chk_edit_lh_${lh.id}`">{{ lh.name }}</label>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end mt-4 pt-2 border-top">
            <button type="button" class="btn btn-light mr-2" @click="$bvModal.hide('modal-edit-nhansu')">Đóng</button>
            <button type="submit" class="btn btn-primary font-weight-bold px-4" :disabled="loadingAction">
              <span v-if="loadingAction"><i class="fas fa-spinner fa-spin mr-1"></i> Đang lưu...</span>
              <span v-else><i class="fas fa-save mr-1"></i> Lưu thay đổi</span>
            </button>
          </div>
        </form>
      </div>
    </b-modal>

    <!-- Modal 3: Đổi mật khẩu -->
    <b-modal id="modal-reset-pass" title="Đổi Mật Khẩu Nhân Sự" hide-footer centered>
      <div v-if="selectedUser">
        <p class="small text-muted mb-3">
          Đặt lại mật khẩu đăng nhập cho: <strong>{{ selectedUser.name }}</strong> (<code>{{ selectedUser.username }}</code>)
        </p>

        <form @submit.prevent="handleResetPassword">
          <div class="form-group">
            <label class="font-weight-bold small">Mật khẩu mới <span class="text-danger">*</span></label>
            <input type="password" class="form-control" v-model="newPassword" required placeholder="Nhập ít nhất 6 ký tự..." />
          </div>

          <div class="d-flex justify-content-end mt-4 pt-2 border-top">
            <button type="button" class="btn btn-light mr-2" @click="$bvModal.hide('modal-reset-pass')">Hủy</button>
            <button type="submit" class="btn btn-warning text-dark font-weight-bold px-4" :disabled="loadingAction">
              <span v-if="loadingAction"><i class="fas fa-spinner fa-spin mr-1"></i> Đang lưu...</span>
              <span v-else><i class="fas fa-key mr-1"></i> Cập nhật mật khẩu</span>
            </button>
          </div>
        </form>
      </div>
    </b-modal>
  </div>
</template>

<script>
import gql from 'graphql-tag';

export default {
  name: 'NhanSuSetting',
  data() {
    return {
      users: [],
      allRoles: [],
      allLopHocs: [],
      searchKeyword: '',
      filterRole: '',
      filterStatus: '',
      loadingData: false,
      loadingAction: false,
      selectedUser: null,
      newPassword: '',
      formCreate: {
        name: '',
        username: '',
        password: '',
        phone: '',
        email: '',
        gender: 'NU',
        status: 'DANG_LAM',
        note: '',
        roleIds: [],
        lopHocIds: []
      },
      formEdit: {
        name: '',
        phone: '',
        email: '',
        gender: 'NU',
        status: 'DANG_LAM',
        note: '',
        roleIds: [],
        lopHocIds: []
      }
    };
  },
  computed: {
    stats() {
      const total = this.users.length;
      const active = this.users.filter(u => u.status === 'DANG_LAM' || !u.status).length;
      const inactive = this.users.filter(u => u.status === 'TAM_NGHI' || u.status === 'DA_NGHI_VIEC').length;
      const teachers = this.users.filter(u => u.roles && u.roles.some(r => r.slug === 'giao-vien')).length;
      return { total, active, inactive, teachers };
    },
    filteredUsers() {
      return this.users.filter(u => {
        // Search
        const kw = (this.searchKeyword || '').toLowerCase().trim();
        const matchKw =
          !kw ||
          (u.name && u.name.toLowerCase().includes(kw)) ||
          (u.username && u.username.toLowerCase().includes(kw)) ||
          (u.phone && u.phone.includes(kw));

        // Filter role
        const matchRole =
          !this.filterRole ||
          (u.roles && u.roles.some(r => r.slug === this.filterRole));

        // Filter status
        let matchStatus = true;
        if (this.filterStatus === 'DANG_LAM') {
          matchStatus = u.status === 'DANG_LAM' || !u.status;
        } else if (this.filterStatus) {
          matchStatus = u.status === this.filterStatus;
        }

        return matchKw && matchRole && matchStatus;
      });
    }
  },
  methods: {
    getRoleBadgeClass(slug) {
      switch (slug) {
        case 'quan-tri-vien':
        case 'super-admin':
          return 'badge-danger';
        case 'hieu-truong':
          return 'badge-primary';
        case 'hieu-pho':
          return 'badge-info text-white';
        case 'ke-toan':
          return 'badge-success';
        case 'giao-vien':
          return 'badge-warning text-dark';
        case 'bao-mau':
          return 'badge-secondary';
        case 'cap-duong':
          return 'badge-dark';
        case 'y-te':
          return 'badge-danger';
        case 'tap-vu':
          return 'badge-light border';
        default:
          return 'badge-secondary';
      }
    },
    async fetchData() {
      this.loadingData = true;
      const client = this.$apolloProvider.defaultClient;
      try {
        const res = await client.query({
          query: gql`
            query GetAllUsersAndMetadata {
              allUsers {
                id
                name
                username
                email
                phone
                gender
                status
                note
                isAdmin
                roles {
                  id
                  name
                  slug
                }
                lophoc {
                  id
                  name
                }
              }
              allRoles {
                id
                name
                slug
              }
              allLopHocs {
                id
                name
              }
            }
          `,
          fetchPolicy: 'network-only'
        });

        if (res.data) {
          this.users = res.data.allUsers || [];
          this.allRoles = res.data.allRoles || [];
          this.allLopHocs = res.data.allLopHocs || [];
        }
      } catch (e) {
        console.error('Error fetching users:', e);
      } finally {
        this.loadingData = false;
      }
    },
    openModalCreate() {
      this.formCreate = {
        name: '',
        username: '',
        password: '',
        phone: '',
        email: '',
        gender: 'NU',
        status: 'DANG_LAM',
        note: '',
        roleIds: [],
        lopHocIds: []
      };
      this.$bvModal.show('modal-create-nhansu');
    },
    async handleCreateUser() {
      this.loadingAction = true;
      const client = this.$apolloProvider.defaultClient;
      try {
        const rolesConnect = this.formCreate.roleIds.map(id => ({ id }));
        const lopHocsConnect = this.formCreate.lopHocIds.map(id => ({ id }));

        await client.mutate({
          mutation: gql`
            mutation CreateNewUser($data: UserCreateInput!) {
              createUser(data: $data) {
                id
                name
                username
              }
            }
          `,
          variables: {
            data: {
              name: this.formCreate.name,
              username: this.formCreate.username,
              password: this.formCreate.password,
              phone: this.formCreate.phone,
              email: this.formCreate.email,
              gender: this.formCreate.gender,
              status: this.formCreate.status,
              note: this.formCreate.note,
              roles: { connect: rolesConnect },
              lophoc: { connect: lopHocsConnect }
            }
          }
        });

        this.$bvModal.hide('modal-create-nhansu');
        this.fetchData();
        alert('Tạo nhân sự mới thành công!');
      } catch (e) {
        alert('Lỗi tạo nhân sự: ' + e.message);
      } finally {
        this.loadingAction = false;
      }
    },
    openEditUser(user) {
      this.selectedUser = user;
      this.formEdit = {
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        gender: user.gender || 'NU',
        status: user.status || 'DANG_LAM',
        note: user.note || '',
        roleIds: (user.roles || []).map(r => r.id),
        lopHocIds: (user.lophoc || []).map(l => l.id)
      };
      this.$bvModal.show('modal-edit-nhansu');
    },
    async handleUpdateUser() {
      if (!this.selectedUser) return;
      this.loadingAction = true;
      const client = this.$apolloProvider.defaultClient;
      try {
        const rolesConnect = this.formEdit.roleIds.map(id => ({ id }));
        const lopHocsConnect = this.formEdit.lopHocIds.map(id => ({ id }));

        await client.mutate({
          mutation: gql`
            mutation UpdateUserFull($id: ID!, $data: UserUpdateInput!) {
              updateUser(id: $id, data: $data) {
                id
                name
              }
            }
          `,
          variables: {
            id: this.selectedUser.id,
            data: {
              name: this.formEdit.name,
              phone: this.formEdit.phone,
              email: this.formEdit.email,
              gender: this.formEdit.gender,
              status: this.formEdit.status,
              note: this.formEdit.note,
              roles: { disconnectAll: true, connect: rolesConnect },
              lophoc: { disconnectAll: true, connect: lopHocsConnect }
            }
          }
        });

        this.$bvModal.hide('modal-edit-nhansu');
        this.fetchData();
        alert('Cập nhật thông tin nhân sự thành công!');
      } catch (e) {
        alert('Lỗi cập nhật: ' + e.message);
      } finally {
        this.loadingAction = false;
      }
    },
    async toggleUserStatus(user) {
      const nextStatus = user.status === 'DA_NGHI_VIEC' ? 'DANG_LAM' : 'DA_NGHI_VIEC';
      const actionText = nextStatus === 'DANG_LAM' ? 'mở lại hoạt động' : 'đánh dấu ĐÃ NGHỈ VIỆC';

      if (confirm(`Bạn có chắc muốn ${actionText} cho nhân sự "${user.name || user.username}"?`)) {
        const client = this.$apolloProvider.defaultClient;
        try {
          await client.mutate({
            mutation: gql`
              mutation ToggleStatus($id: ID!, $data: UserUpdateInput!) {
                updateUser(id: $id, data: $data) {
                  id
                  status
                }
              }
            `,
            variables: { id: user.id, data: { status: nextStatus } }
          });
          this.fetchData();
        } catch (e) {
          alert('Lỗi cập nhật trạng thái: ' + e.message);
        }
      }
    },
    openResetPassword(user) {
      this.selectedUser = user;
      this.newPassword = '';
      this.$bvModal.show('modal-reset-pass');
    },
    async handleResetPassword() {
      if (!this.selectedUser || !this.newPassword) return;
      this.loadingAction = true;
      const client = this.$apolloProvider.defaultClient;
      try {
        await client.mutate({
          mutation: gql`
            mutation ResetUserPassword($id: ID!, $password: String!) {
              updateUser(id: $id, data: { password: $password }) {
                id
              }
            }
          `,
          variables: {
            id: this.selectedUser.id,
            password: this.newPassword
          }
        });

        this.$bvModal.hide('modal-reset-pass');
        alert('Đổi mật khẩu thành công!');
      } catch (e) {
        alert('Lỗi đổi mật khẩu: ' + e.message);
      } finally {
        this.loadingAction = false;
      }
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
.nhansu-workspace {
  max-width: 1400px;
  margin: 0 auto;
}

.stat-icon-sm {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
}

.avatar-user-table {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
}

.bg-pink {
  background-color: #ec4899;
}

.bg-primary-light {
  background-color: #e0f2fe;
}

.bg-success-light {
  background-color: #dcfce7;
}

.bg-info-light {
  background-color: #e0e7ff;
}

.table-secondary-row {
  background-color: #f8fafc;
  opacity: 0.65;
}
</style>
