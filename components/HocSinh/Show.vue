<template>
  <div class="student-profile-form">
    <div v-if="loading" class="text-center py-4">
      <b-spinner variant="primary"></b-spinner>
      <div class="text-muted mt-2 small">Đang tải hồ sơ học sinh...</div>
    </div>

    <form v-else @submit.prevent="saveAllProfile">
      <div class="row">
        <!-- CỘT TRÁI (60%): Thông tin học sinh, Lớp học & Biểu phí -->
        <div class="col-lg-7 pr-lg-3">
          <!-- Nhóm 1: Thông tin học sinh -->
          <div class="card border-0 shadow-sm bg-white p-3 mb-3 rounded-lg">
            <h6 class="font-weight-bold text-primary mb-3 d-flex align-items-center">
              <i class="fas fa-id-card mr-2"></i> Thông Tin Học Sinh
            </h6>
            <div class="row">
              <div class="col-md-7 mb-3">
                <label class="small font-weight-bold">Họ và tên bé *</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  placeholder="Nhập họ tên bé"
                  required
                />
              </div>
              <div class="col-md-5 mb-3">
                <label class="small font-weight-bold">Tên ở nhà (Nickname)</label>
                <input
                  v-model="form.sName"
                  type="text"
                  class="form-control"
                  placeholder="Ví dụ: Bắp, Sữa..."
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold">Ngày sinh</label>
                <input
                  v-model="form.birthday"
                  type="date"
                  class="form-control"
                />
              </div>
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold">Ngày vào học</label>
                <input
                  v-model="form.dateAccess"
                  type="date"
                  class="form-control"
                />
              </div>
            </div>
          </div>

          <!-- Nhóm 2: Lớp học & Học phí -->
          <div class="card border-0 shadow-sm bg-white p-3 mb-3 rounded-lg">
            <h6 class="font-weight-bold text-primary mb-3 d-flex align-items-center">
              <i class="fas fa-graduation-cap mr-2"></i> Phân Lớp & Biểu Phí
            </h6>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold">Lớp học hiện tại</label>
                <select v-model="form.lophocId" class="form-control">
                  <option value="">-- Chưa phân lớp --</option>
                  <option v-for="lh in lophocs" :key="lh.id" :value="lh.id">
                    {{ lh.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold">Trạng thái học</label>
                <select v-model="form.status" class="form-control font-weight-bold">
                  <option value="DANG_HOC">Đang học</option>
                  <option value="TAM_NGHI">Tạm nghỉ</option>
                  <option value="DANG_KY">Đăng ký mới</option>
                  <option value="NGHI_LUON">Nghỉ luôn / Thôi học</option>
                </select>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold">Áp dụng Biểu phí năm</label>
                <select v-model="form.namhocphi" class="form-control">
                  <option v-for="y in yearOptions" :key="y.value" :value="y.value">
                    {{ y.label }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="small font-weight-bold">Miễn giảm học phí (VND/tháng)</label>
                <input
                  v-model="form.hocphigiam"
                  type="text"
                  class="form-control text-right"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- CỘT PHẢI (40%): Dịch vụ ăn uống, camera & ghi chú -->
        <div class="col-lg-5">
          <!-- Nhóm 3: Dịch vụ ngoài giờ -->
          <div class="card border-0 shadow-sm bg-white p-3 mb-3 rounded-lg">
            <h6 class="font-weight-bold text-info mb-3 d-flex align-items-center">
              <i class="fas fa-utensils mr-2"></i> Dịch Vụ Ngoài Giờ & Bữa Ăn
            </h6>
            <div class="form-group mb-3">
              <label class="small font-weight-bold">Đăng ký suất ăn xế chiều</label>
              <select v-model="form.an545" class="form-control">
                <option value="1">Có đăng ký ăn chiều</option>
                <option value="0">Không đăng ký</option>
              </select>
            </div>
            <div class="form-group mb-3">
              <label class="small font-weight-bold">Gói Camera phụ huynh</label>
              <input
                v-model="form.camera"
                type="text"
                class="form-control"
                placeholder="Ghi chú gói camera (nếu có)"
              />
            </div>
          </div>

          <!-- Nhóm 4: Ghi chú đặc biệt -->
          <div class="card border-0 shadow-sm bg-white p-3 mb-3 rounded-lg">
            <h6 class="font-weight-bold text-warning mb-3 d-flex align-items-center">
              <i class="fas fa-sticky-note mr-2"></i> Lưu Ý Đặc Biệt Của Bé
            </h6>
            <textarea
              v-model="form.luuy"
              rows="4"
              class="form-control"
              placeholder="Ví dụ: Bé dị ứng tôm cua, cần uống sữa bột lúc 15h, người đưa đón..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="d-flex justify-content-between align-items-center pt-3 border-top mt-2">
        <span class="text-muted small">
          <i class="fas fa-shield-alt text-success mr-1"></i> Dữ liệu được bảo lưu tự động vào hệ thống
        </span>
        <button
          type="submit"
          class="btn btn-primary rounded-pill px-4 shadow-sm"
          :disabled="saving"
        >
          <b-spinner v-if="saving" small class="mr-1"></b-spinner>
          <i v-else class="fas fa-save mr-1"></i> Lưu toàn bộ hồ sơ
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { getVariableByKey, createVariable, updateVariable } from '~/plugins/variable.js';

export default {
  props: ['hocsinh'],
  data() {
    return {
      loading: true,
      saving: false,
      lophocs: [],
      sNameVar: null,
      cameraVar: null,
      an545Var: null,
      dateAccessVar: null,
      form: {
        name: '',
        sName: '',
        birthday: '',
        dateAccess: '',
        lophocId: '',
        status: 'DANG_HOC',
        namhocphi: 'HPN_2023',
        hocphigiam: '0',
        an545: '1',
        camera: '',
        luuy: '',
      },
    };
  },
  computed: {
    yearOptions() {
      const cur = new Date().getFullYear();
      const list = [];
      for (let i = 0; i <= 5; i++) {
        const y = cur - i;
        list.push({
          value: `HPN_${y}`,
          label: `Năm học ${y} - ${y + 1}`,
        });
      }
      return list;
    },
  },
  methods: {
    async loadFullProfile() {
      this.loading = true;
      const client = this.$apolloProvider.defaultClient;

      try {
        // 1. Tải danh sách tất cả lớp học
        const resLop = await client.query({
          query: gql`
            query {
              allLopHocs(sortBy: name_ASC) {
                id
                name
              }
            }
          `,
          fetchPolicy: 'network-only',
        });
        this.lophocs = resLop.data.allLopHocs || [];

        // 2. Tải thông tin chi tiết học sinh
        const resHs = await client.query({
          query: gql`
            query getStudentDetail($id: ID!) {
              Student(where: { id: $id }) {
                id
                name
                status
                birthday
                lophoc {
                  id
                  name
                }
                namhocphi
                hocphigiam
                luuy
              }
            }
          `,
          variables: { id: this.hocsinh.id },
          fetchPolicy: 'network-only',
        });

        const hs = resHs.data.Student || {};
        this.form.name = hs.name || this.hocsinh.name || '';
        this.form.status = hs.status || this.hocsinh.status || 'DANG_HOC';
        this.form.lophocId = (hs.lophoc && hs.lophoc.id) || (this.hocsinh.lophoc && this.hocsinh.lophoc.id) || '';
        this.form.namhocphi = hs.namhocphi || 'HPN_2023';
        this.form.hocphigiam = hs.hocphigiam || '0';
        this.form.luuy = hs.luuy || '';
        if (hs.birthday) {
          this.form.birthday = hs.birthday.substring(0, 10);
        }

        // 3. Tải các biến mở rộng (Tên ở nhà, Ăn chiều, Camera, Ngày vào học)
        try {
          this.sNameVar = await getVariableByKey(client, { item: 'Student', idItem: this.hocsinh.id, key: 'SNAME' });
          if (this.sNameVar && this.sNameVar.value) this.form.sName = this.sNameVar.value;
        } catch (e) {}

        try {
          this.an545Var = await getVariableByKey(client, { item: 'Student', idItem: this.hocsinh.id, key: 'AN545' });
          if (this.an545Var && this.an545Var.value !== undefined) this.form.an545 = this.an545Var.value;
        } catch (e) {}

        try {
          this.cameraVar = await getVariableByKey(client, { item: 'Student', idItem: this.hocsinh.id, key: 'CAMERA' });
          if (this.cameraVar && this.cameraVar.value) this.form.camera = this.cameraVar.value;
        } catch (e) {}

        try {
          // Thử lấy key DATE-ACCESS trước, fallback DATE_ACCESS
          let dVar = await getVariableByKey(client, { item: 'Student', idItem: this.hocsinh.id, key: 'DATE-ACCESS' });
          if (!dVar || !dVar.id) {
            dVar = await getVariableByKey(client, { item: 'Student', idItem: this.hocsinh.id, key: 'DATE_ACCESS' });
          }
          this.dateAccessVar = dVar;
          if (this.dateAccessVar && this.dateAccessVar.value) {
            this.form.dateAccess = this.dateAccessVar.value.substring(0, 10);
          }
        } catch (e) {}
      } catch (err) {
        console.error('Lỗi khi tải hồ sơ:', err);
      } finally {
        this.loading = false;
      }
    },
    async saveAllProfile() {
      this.saving = true;
      const client = this.$apolloProvider.defaultClient;

      try {
        // 1. Cập nhật bản ghi Student
        const updateData = {
          name: this.form.name,
          status: this.form.status,
          namhocphi: this.form.namhocphi,
          hocphigiam: this.form.hocphigiam,
          luuy: this.form.luuy,
        };

        if (this.form.birthday) {
          updateData.birthday = new Date(this.form.birthday).toISOString();
        }

        if (this.form.lophocId) {
          updateData.lophoc = { connect: { id: this.form.lophocId } };
        } else {
          updateData.lophoc = { disconnectAll: true };
        }

        await client.mutate({
          mutation: gql`
            mutation updateStudentProfile($id: ID!, $data: StudentUpdateInput!) {
              updateStudent(id: $id, data: $data) {
                id
                name
                status
              }
            }
          `,
          variables: {
            id: this.hocsinh.id,
            data: updateData,
          },
        });

        // 2. Cập nhật các biến mở rộng (SNAME, AN545, CAMERA, DATE-ACCESS)
        await this.syncVariable('SNAME', this.form.sName, this.sNameVar);
        await this.syncVariable('AN545', this.form.an545, this.an545Var);
        await this.syncVariable('CAMERA', this.form.camera, this.cameraVar);
        await this.syncVariable('DATE-ACCESS', this.form.dateAccess, this.dateAccessVar);

        this.$bvToast.toast(`Đã lưu toàn bộ thông tin học sinh: ${this.form.name}`, {
          title: 'Cập nhật thành công',
          variant: 'success',
          solid: true,
          autoHideDelay: 3000,
        });

        // Refresh danh sách bên ngoài
        this.$store.dispatch('filter/hocsinh/getAllHocsinhs');
      } catch (err) {
        console.error('Lỗi khi lưu hồ sơ:', err);
        this.$bvToast.toast('Không thể lưu hồ sơ, vui lòng kiểm tra lại dữ liệu.', {
          title: 'Lỗi',
          variant: 'danger',
          solid: true,
        });
      } finally {
        this.saving = false;
      }
    },
    async syncVariable(key, val, existingVar) {
      const client = this.$apolloProvider.defaultClient;
      if (!val && !existingVar) return;
      try {
        if (existingVar && existingVar.id) {
          await updateVariable(client, { id: existingVar.id, value: val || '' });
        } else if (val) {
          await createVariable(client, {
            item: 'Student',
            idItem: this.hocsinh.id,
            key: key,
            value: val,
          });
        }
      } catch (e) {
        console.error(`Lỗi cập nhật biến ${key}:`, e);
      }
    },
  },
  mounted() {
    this.loadFullProfile();
  },
};
</script>

<style scoped>
.student-profile-form {
  font-size: 0.95rem;
}
.form-control {
  border-radius: 6px;
  font-size: 0.9rem;
}
</style>
