<template>
  <div v-if="localParent">
    <!-- Header thông tin cơ bản -->
    <div class="d-flex align-items-center justify-content-between p-3 bg-light rounded-lg mb-3 border">
      <div class="d-flex align-items-center">
        <div class="avatar-ph mr-3 text-white">
          <i class="fas fa-user-edit"></i>
        </div>
        <div>
          <h5 class="font-weight-bold mb-1 text-dark">{{ localParent.name }}</h5>
          <div class="d-flex align-items-center flex-wrap">
            <span class="badge badge-secondary mr-2 px-2 py-1 font-weight-normal">
              Mã: <strong>{{ localParent.code || 'N/A' }}</strong>
            </span>
            <span :class="['badge px-2 py-1', isDeactive ? 'badge-dark' : 'badge-success']">
              <i :class="['fas mr-1', isDeactive ? 'fa-ban' : 'fa-check-circle']"></i>
              {{ isDeactive ? 'Đã vô hiệu hóa (Deactive)' : 'Đang hoạt động (Active)' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Nút đổi trạng thái nhanh -->
      <div>
        <button
          type="button"
          :class="['btn btn-sm rounded-pill font-weight-bold px-3 shadow-sm', isDeactive ? 'btn-outline-success' : 'btn-outline-warning']"
          :disabled="togglingStatus"
          @click="toggleStatus"
        >
          <i :class="['fas mr-1', isDeactive ? 'fa-unlock' : 'fa-lock']"></i>
          {{ isDeactive ? 'Kích hoạt lại tài khoản' : 'Vô hiệu hóa tài khoản' }}
        </button>
      </div>
    </div>

    <!-- Form Chỉnh sửa thông tin -->
    <form @submit.prevent="saveParentInfo">
      <div class="row">
        <!-- Tên người đại diện -->
        <div class="col-md-6 mb-3">
          <label class="font-weight-bold small text-dark">Họ và Tên Phụ Huynh Đại Diện *</label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text bg-white"><i class="fas fa-user-tie text-primary"></i></span>
            </div>
            <input
              type="text"
              class="form-control"
              v-model.trim="form.name"
              placeholder="Nhập họ tên phụ huynh đại diện"
              required
            />
          </div>
          <!-- Quick suggestions if parent name equals student name -->
          <div v-if="suggestedNames.length > 0" class="mt-1 d-flex flex-wrap align-items-center">
            <small class="text-muted mr-1">Gợi ý nhanh:</small>
            <button
              v-for="(sug, idx) in suggestedNames"
              :key="idx"
              type="button"
              class="btn btn-xs btn-outline-primary py-0 px-2 mr-1 mb-1 rounded-pill"
              style="font-size: 0.75rem;"
              @click="form.name = sug"
            >
              {{ sug }}
            </button>
          </div>
        </div>

        <!-- Trạng thái tài khoản -->
        <div class="col-md-6 mb-3">
          <label class="font-weight-bold small text-dark">Trạng thái hồ sơ</label>
          <select class="form-control" v-model="form.status">
            <option value="ACTIVE">Đang hoạt động (ACTIVE)</option>
            <option value="DEACTIVE">Đã vô hiệu hóa / Tạm ngưng (DEACTIVE)</option>
          </select>
        </div>
      </div>

      <!-- Card Thông tin Bố & Mẹ (Tự động bóc tách từ JSON parents) -->
      <div class="card border-0 bg-light p-3 rounded-lg mb-3">
        <label class="font-weight-bold small text-dark mb-2 d-flex align-items-center justify-content-between">
          <span><i class="fas fa-users-cog text-info mr-1"></i> Thông tin Bố / Mẹ & Người Giám Hộ</span>
          <span class="badge badge-pill badge-info" v-if="isParentsJson">Đã chuẩn hóa JSON</span>
        </label>
        
        <div class="row">
          <!-- Bố -->
          <div class="col-md-6 mb-2">
            <div class="p-2 bg-white rounded border">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <strong class="small text-primary"><i class="fas fa-male mr-1"></i> Thông tin Bố</strong>
                <a
                  v-if="parentsObj.dadPhone"
                  :href="`https://zalo.me/${parentsObj.dadPhone}`"
                  target="_blank"
                  class="badge badge-primary px-2"
                >
                  Zalo
                </a>
              </div>
              <div class="form-group mb-2">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  v-model.trim="parentsObj.dadName"
                  placeholder="Họ tên Bố"
                />
              </div>
              <div class="form-group mb-0">
                <input
                  type="tel"
                  class="form-control form-control-sm"
                  v-model.trim="parentsObj.dadPhone"
                  placeholder="Số điện thoại Bố"
                />
              </div>
            </div>
          </div>

          <!-- Mẹ -->
          <div class="col-md-6 mb-2">
            <div class="p-2 bg-white rounded border">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <strong class="small text-danger"><i class="fas fa-female mr-1"></i> Thông tin Mẹ</strong>
                <a
                  v-if="parentsObj.momPhone"
                  :href="`https://zalo.me/${parentsObj.momPhone}`"
                  target="_blank"
                  class="badge badge-primary px-2"
                >
                  Zalo
                </a>
              </div>
              <div class="form-group mb-2">
                <input
                  type="text"
                  class="form-control form-control-sm"
                  v-model.trim="parentsObj.momName"
                  placeholder="Họ tên Mẹ"
                />
              </div>
              <div class="form-group mb-0">
                <input
                  type="tel"
                  class="form-control form-control-sm"
                  v-model.trim="parentsObj.momPhone"
                  placeholder="Số điện thoại Mẹ"
                />
              </div>
            </div>
          </div>

          <!-- Ghi chú phụ khác -->
          <div class="col-12 mt-2">
            <input
              type="text"
              class="form-control form-control-sm"
              v-model.trim="parentsObj.otherNote"
              placeholder="Ghi chú thêm (Người đón hộ, địa chỉ nhà, thói quen...)"
            />
          </div>
        </div>
      </div>

      <!-- Quản lý Số điện thoại -->
      <div class="card border-0 bg-light p-3 rounded-lg mb-3">
        <label class="font-weight-bold small text-dark d-flex justify-content-between align-items-center mb-2">
          <span><i class="fas fa-phone-alt text-primary mr-1"></i> Danh sách Số điện thoại liên hệ</span>
        </label>

        <!-- Danh sách SĐT hiện tại -->
        <div v-if="phoneList && phoneList.length" class="mb-3">
          <div
            v-for="(p, idx) in phoneList"
            :key="p.id || idx"
            class="d-flex align-items-center justify-content-between p-2 bg-white rounded border mb-2"
          >
            <div class="d-flex align-items-center">
              <i class="fas fa-phone text-success mr-2"></i>
              <strong class="text-dark">{{ p.number || p }}</strong>
              <span class="badge badge-secondary ml-2 font-weight-normal" v-if="p.name">
                {{ p.name }}
              </span>
              <a
                :href="`https://zalo.me/${p.number || p}`"
                target="_blank"
                class="badge badge-primary ml-2 px-2 py-1"
                title="Mở Zalo"
              >
                Zalo
              </a>
            </div>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger border-0 py-0 px-2"
              title="Xóa số điện thoại này"
              :disabled="deletingPhoneId === p.id"
              @click="deletePhone(p)"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div v-else class="text-muted small mb-2">
          Chưa có số điện thoại nào.
        </div>

        <!-- Thêm số điện thoại mới -->
        <div class="input-group input-group-sm">
          <input
            type="tel"
            class="form-control"
            v-model.trim="newPhoneNumber"
            placeholder="Nhập số điện thoại mới cần thêm (Ví dụ: 0912345678)..."
            @keyup.enter.prevent="addNewPhone"
          />
          <input
            type="text"
            class="form-control ml-1"
            style="max-width: 160px;"
            v-model.trim="newPhoneName"
            placeholder="Tên chủ số (Bố/Mẹ/Bà)"
            @keyup.enter.prevent="addNewPhone"
          />
          <div class="input-group-append">
            <button
              type="button"
              class="btn btn-primary px-3"
              :disabled="!newPhoneNumber || addingPhone"
              @click="addNewPhone"
            >
              <i class="fas fa-plus mr-1"></i> Thêm SĐT
            </button>
          </div>
        </div>
      </div>

      <!-- Danh sách các con theo học -->
      <div class="card border-0 bg-light p-3 rounded-lg mb-4">
        <label class="font-weight-bold small text-dark mb-2">
          <i class="fas fa-child text-info mr-1"></i> Học sinh thuộc hồ sơ Phụ huynh này
        </label>
        <div v-if="localParent.hocsinhs && localParent.hocsinhs.length" class="d-flex flex-wrap">
          <span
            v-for="hs in localParent.hocsinhs"
            :key="hs.id"
            class="badge badge-white border text-dark p-2 mr-2 mb-2 shadow-sm rounded-pill d-flex align-items-center"
          >
            <i class="fas fa-user-graduate text-primary mr-1"></i>
            <strong class="mr-1">{{ hs.name }}</strong>
            <small class="text-muted mr-1" v-if="hs.lophoc && hs.lophoc.name">({{ hs.lophoc.name }})</small>
            <span v-if="hs.status === 'THOI_HOC'" class="badge badge-danger ml-1">Thôi học</span>
          </span>
        </div>
        <div v-else class="text-muted small">
          Chưa liên kết học sinh nào.
        </div>
      </div>

      <!-- Footer Actions: Lưu & Xóa tài khoản -->
      <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center pt-3 border-top">
        <!-- Nút Xóa vĩnh viễn (Danger Zone) -->
        <button
          type="button"
          class="btn btn-outline-danger btn-sm rounded-pill px-3 mb-2 mb-sm-0 font-weight-bold"
          :disabled="deletingParent"
          @click="confirmDeleteParent"
        >
          <i class="fas fa-trash-alt mr-1"></i> Xóa vĩnh viễn hồ sơ
        </button>

        <div class="d-flex align-items-center">
          <button
            type="button"
            class="btn btn-secondary rounded-pill px-4 mr-2"
            @click="$emit('close')"
          >
            Đóng
          </button>
          <button
            type="submit"
            class="btn btn-primary font-weight-bold rounded-pill px-4 shadow-sm"
            :disabled="saving"
          >
            <i class="fas fa-save mr-1"></i> {{ saving ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import gql from 'graphql-tag';

export default {
  props: {
    parentData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localParent: null,
      form: {
        name: '',
        status: 'ACTIVE',
      },
      parentsObj: {
        dadName: '',
        dadPhone: '',
        momName: '',
        momPhone: '',
        otherNote: '',
      },
      isParentsJson: false,
      phoneList: [],
      newPhoneNumber: '',
      newPhoneName: '',
      saving: false,
      addingPhone: false,
      deletingPhoneId: null,
      togglingStatus: false,
      deletingParent: false,
    };
  },
  computed: {
    isDeactive() {
      return this.localParent?.status === 'DEACTIVE';
    },
    suggestedNames() {
      const suggestions = [];
      const dad = this.parentsObj.dadName?.trim();
      const mom = this.parentsObj.momName?.trim();
      const firstStudent = this.localParent?.hocsinhs?.[0]?.name?.trim();

      if (dad) suggestions.push(`${dad} (Bố ${firstStudent || ''})`.trim());
      if (mom) suggestions.push(`${mom} (Mẹ ${firstStudent || ''})`.trim());
      if (firstStudent && (!dad && !mom)) suggestions.push(`PH ${firstStudent}`);

      return suggestions.filter(s => s && s !== this.form.name);
    }
  },
  watch: {
    parentData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.localParent = { ...val };
          this.form.name = val.name || '';
          this.form.status = val.status || 'ACTIVE';
          this.phoneList = Array.isArray(val.phone) ? [...val.phone] : [];

          // Parse parents field
          this.parseParents(val.parents);
        }
      },
    },
  },
  methods: {
    parseParents(raw) {
      this.parentsObj = {
        dadName: '',
        dadPhone: '',
        momName: '',
        momPhone: '',
        otherNote: '',
      };
      this.isParentsJson = false;

      if (!raw) return;

      try {
        if (raw.trim().startsWith('{')) {
          const parsed = JSON.parse(raw);
          this.parentsObj.dadName = parsed.dadName || '';
          this.parentsObj.dadPhone = parsed.dadPhone || '';
          this.parentsObj.momName = parsed.momName || '';
          this.parentsObj.momPhone = parsed.momPhone || '';
          this.parentsObj.otherNote = parsed.otherNote || '';
          this.isParentsJson = true;
          return;
        }
      } catch (e) {
        // Not JSON
      }

      this.parentsObj.otherNote = raw;
    },

    composeParentsString() {
      if (this.parentsObj.dadName || this.parentsObj.dadPhone || this.parentsObj.momName || this.parentsObj.momPhone) {
        return JSON.stringify({
          dadName: this.parentsObj.dadName || '',
          dadPhone: this.parentsObj.dadPhone || '',
          momName: this.parentsObj.momName || '',
          momPhone: this.parentsObj.momPhone || '',
          otherNote: this.parentsObj.otherNote || '',
        });
      }
      return this.parentsObj.otherNote || '';
    },

    async saveParentInfo() {
      if (!this.form.name) return;
      this.saving = true;
      const client = this.$apolloProvider.defaultClient;
      const parentsStr = this.composeParentsString();

      try {
        await client.mutate({
          mutation: gql`
            mutation UpdateParentInfo($id: ID!, $data: ParentUpdateInput!) {
              updateParent(id: $id, data: $data) {
                id
                name
                status
                parents
              }
            }
          `,
          variables: {
            id: this.localParent.id,
            data: {
              name: this.form.name,
              status: this.form.status,
              parents: parentsStr,
            },
          },
        });

        this.localParent.name = this.form.name;
        this.localParent.status = this.form.status;
        this.localParent.parents = parentsStr;
        this.isParentsJson = parentsStr.startsWith('{');

        this.$bvToast.toast('Đã cập nhật thông tin phụ huynh thành công!', {
          title: 'Thành công',
          variant: 'success',
          solid: true,
        });

        this.$emit('updated');
      } catch (err) {
        console.error('Lỗi khi lưu thông tin phụ huynh:', err);
        this.$bvToast.toast('Không thể cập nhật thông tin phụ huynh.', {
          title: 'Lỗi',
          variant: 'danger',
          solid: true,
        });
      } finally {
        this.saving = false;
      }
    },

    async toggleStatus() {
      const newStatus = this.isDeactive ? 'ACTIVE' : 'DEACTIVE';
      const actionText = newStatus === 'DEACTIVE' ? 'vô hiệu hóa' : 'kích hoạt lại';

      if (!confirm(`Bạn có chắc chắn muốn ${actionText} hồ sơ phụ huynh ${this.localParent.name}?`)) {
        return;
      }

      this.togglingStatus = true;
      const client = this.$apolloProvider.defaultClient;

      try {
        await client.mutate({
          mutation: gql`
            mutation UpdateParentStatus($id: ID!, $status: String!) {
              updateParent(id: $id, data: { status: $status }) {
                id
                status
              }
            }
          `,
          variables: {
            id: this.localParent.id,
            status: newStatus,
          },
        });

        this.localParent.status = newStatus;
        this.form.status = newStatus;

        this.$bvToast.toast(`Đã ${actionText} hồ sơ thành công!`, {
          title: 'Thành công',
          variant: 'success',
          solid: true,
        });

        this.$emit('updated');
      } catch (err) {
        console.error('Lỗi khi đổi trạng thái phụ huynh:', err);
        this.$bvToast.toast('Lỗi khi đổi trạng thái hồ sơ.', {
          title: 'Lỗi',
          variant: 'danger',
          solid: true,
        });
      } finally {
        this.togglingStatus = false;
      }
    },

    async addNewPhone() {
      const cleanPhone = (this.newPhoneNumber || '').replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 9) {
        alert('Vui lòng nhập số điện thoại hợp lệ (tối thiểu 9 số).');
        return;
      }
      this.addingPhone = true;
      const client = this.$apolloProvider.defaultClient;

      try {
        const res = await client.mutate({
          mutation: gql`
            mutation CreatePhone($data: PhoneCreateInput!) {
              createPhone(data: $data) {
                id
                number
                name
              }
            }
          `,
          variables: {
            data: {
              number: cleanPhone,
              name: this.newPhoneName ? this.newPhoneName.trim() : 'Người thân',
              parent: { connect: { id: this.localParent.id } },
            },
          },
        });

        if (res.data?.createPhone) {
          this.phoneList.push(res.data.createPhone);
          this.newPhoneNumber = '';
          this.newPhoneName = '';
          this.$bvToast.toast('Đã thêm số điện thoại thành công!', {
            variant: 'success',
            solid: true,
          });
          this.$emit('updated');
        }
      } catch (err) {
        console.error('Lỗi khi thêm SĐT:', err);
        this.$bvToast.toast('Không thể thêm số điện thoại.', {
          title: 'Lỗi',
          variant: 'danger',
          solid: true,
        });
      } finally {
        this.addingPhone = false;
      }
    },

    async deletePhone(phoneObj) {
      if (!phoneObj.id) return;
      if (!confirm(`Xóa số điện thoại ${phoneObj.number || phoneObj}?`)) return;

      this.deletingPhoneId = phoneObj.id;
      const client = this.$apolloProvider.defaultClient;

      try {
        await client.mutate({
          mutation: gql`
            mutation DeletePhone($id: ID!) {
              deletePhone(id: $id) {
                id
              }
            }
          `,
          variables: { id: phoneObj.id },
        });

        this.phoneList = this.phoneList.filter((p) => p.id !== phoneObj.id);
        this.$bvToast.toast('Đã xóa số điện thoại.', {
          variant: 'info',
          solid: true,
        });
        this.$emit('updated');
      } catch (err) {
        console.error('Lỗi khi xóa SĐT:', err);
        this.$bvToast.toast('Không thể xóa số điện thoại.', {
          title: 'Lỗi',
          variant: 'danger',
          solid: true,
        });
      } finally {
        this.deletingPhoneId = null;
      }
    },

    async confirmDeleteParent() {
      if (this.localParent.balance > 0 || this.localParent.debt > 0) {
        alert(
          `Không thể xóa hồ sơ này vì phụ huynh vẫn còn số dư ví (+${(this.localParent.balance || 0).toLocaleString('vi-VN')} đ) hoặc còn nợ (${(this.localParent.debt || 0).toLocaleString('vi-VN')} đ). Vui lòng tất toán hoặc chọn "Vô hiệu hóa (Deactive)" thay vì xóa!`
        );
        return;
      }

      if (!confirm(`CẢNH BÁO: Thao tác này sẽ xóa vĩnh viễn hồ sơ phụ huynh [${this.localParent.name}] khỏi hệ thống và không thể phục hồi. Bạn chắc chắn muốn xóa?`)) {
        return;
      }

      this.deletingParent = true;
      const client = this.$apolloProvider.defaultClient;

      try {
        await client.mutate({
          mutation: gql`
            mutation DeleteParent($id: ID!) {
              deleteParent(id: $id) {
                id
              }
            }
          `,
          variables: { id: this.localParent.id },
        });

        this.$bvToast.toast('Đã xóa vĩnh viễn hồ sơ phụ huynh thành công!', {
          title: 'Thành công',
          variant: 'success',
          solid: true,
        });

        this.$emit('deleted');
        this.$emit('close');
      } catch (err) {
        console.error('Lỗi khi xóa phụ huynh:', err);
        this.$bvToast.toast('Không thể xóa hồ sơ phụ huynh.', {
          title: 'Lỗi',
          variant: 'danger',
          solid: true,
        });
      } finally {
        this.deletingParent = false;
      }
    },
  },
};
</script>

<style scoped>
.avatar-ph {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%);
}
.badge-white {
  background-color: #ffffff;
}
</style>
