<template>
  <b-modal
    id="modal-student-quick-info"
    :title="student ? `Thông Tin Bé: ${student.name}` : 'Thông Tin Học Sinh'"
    hide-footer
    centered
    size="md"
  >
    <div v-if="student" class="student-detail-popup">
      <!-- 1. Header: Avatar Khung Nhận diện khuôn mặt (Face ID Ready) -->
      <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
        <div class="face-avatar-container mr-3 flex-shrink-0 shadow-sm">
          <!-- Khung ảnh bé / Sau này load URL ảnh khuôn mặt từ Backend -->
          <img
            v-if="student.avatarUrl"
            :src="student.avatarUrl"
            class="face-avatar-img"
            alt="Face ID"
          />
          <div v-else class="face-avatar-placeholder">
            <i class="fas fa-camera text-primary mb-1 d-block" style="font-size: 1.5rem;"></i>
            <span class="face-scan-badge">Chưa có ảnh</span>
          </div>
        </div>

        <div class="overflow-hidden">
          <h5 class="font-weight-bold text-dark mb-1 text-break">
            {{ student.name }}
          </h5>
          <div class="d-flex align-items-center flex-wrap gap-1 mb-1">
            <span v-if="student.sName" class="badge badge-info font-weight-normal px-2 py-1 mr-1">
              Biệt danh: {{ student.sName }}
            </span>
            <span v-if="student.status === 'DANG_HOC' || !student.status" class="badge badge-success font-weight-normal px-2 py-1">
              Đang học
            </span>
            <span v-else-if="student.status === 'TAM_NGHI'" class="badge badge-warning text-dark font-weight-normal px-2 py-1">
              Tạm nghỉ
            </span>
          </div>
          <small class="text-muted d-block">
            <i class="fas fa-id-badge mr-1"></i> Mã định danh: <code>{{ student.id.substring(0, 8) }}</code>
          </small>
        </div>
      </div>

      <!-- 2. Thông tin cá nhân & Lớp học -->
      <div class="card border-0 bg-light p-3 mb-3 rounded-lg">
        <div class="row small">
          <div class="col-6 mb-2">
            <span class="text-muted d-block">Ngày sinh:</span>
            <strong class="text-dark">{{ formatDate(student.birthday) }}</strong>
          </div>
          <div class="col-6 mb-2">
            <span class="text-muted d-block">Lớp học:</span>
            <strong class="text-primary">{{ className || '---' }}</strong>
          </div>
          <div class="col-12" v-if="student.luuy">
            <span class="text-danger font-weight-bold d-block">
              <i class="fas fa-exclamation-triangle mr-1"></i> Lưu ý đặc biệt:
            </span>
            <span class="text-dark font-italic">{{ student.luuy }}</span>
          </div>
        </div>
      </div>

      <!-- 3. Liên hệ Phụ huynh (Nút gọi nhanh) -->
      <h6 class="font-weight-bold text-dark mb-2">
        <i class="fas fa-phone-alt text-success mr-2"></i> Liên Hệ Phụ Huynh (Gọi nhanh)
      </h6>

      <div v-if="parentPhones.length > 0" class="parent-contacts mb-2">
        <div
          v-for="(contact, idx) in parentPhones"
          :key="idx"
          class="d-flex align-items-center justify-content-between p-2 mb-2 bg-white rounded border"
        >
          <div>
            <strong class="text-dark d-block small">{{ contact.label }}</strong>
            <span class="text-muted small">{{ contact.phone }}</span>
          </div>
          <a
            :href="'tel:' + contact.phone"
            class="btn btn-sm btn-success rounded-pill px-3 font-weight-bold shadow-sm"
          >
            <i class="fas fa-phone-alt mr-1"></i> Gọi ngay
          </a>
        </div>
      </div>

      <div v-else class="text-muted small font-italic p-2 bg-light rounded text-center">
        Chưa có số điện thoại phụ huynh đăng ký.
      </div>

      <div class="d-flex justify-content-end mt-4 pt-2 border-top">
        <button type="button" class="btn btn-secondary rounded-pill px-4" @click="$bvModal.hide('modal-student-quick-info')">
          Đóng
        </button>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'StudentQuickModal',
  props: {
    student: {
      type: Object,
      default: null
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    parentPhones() {
      if (!this.student) return [];
      const results = [];

      // 1. Kiểm tra JSON parents
      if (this.student.parent && this.student.parent.parents) {
        try {
          const parsed = JSON.parse(this.student.parent.parents);
          if (parsed.dadPhone) {
            results.push({
              label: parsed.dadName ? `Bố: ${parsed.dadName}` : 'Bố',
              phone: parsed.dadPhone
            });
          }
          if (parsed.momPhone) {
            results.push({
              label: parsed.momName ? `Mẹ: ${parsed.momName}` : 'Mẹ',
              phone: parsed.momPhone
            });
          }
        } catch (e) {}
      }

      // 2. Kiểm tra mảng phone relation
      if (results.length === 0 && this.student.parent && this.student.parent.phone) {
        const phones = Array.isArray(this.student.parent.phone)
          ? this.student.parent.phone
          : [this.student.parent.phone];
        phones.forEach(p => {
          if (p && p.number) {
            results.push({
              label: p.name || 'Phụ huynh',
              phone: p.number
            });
          }
        });
      }

      return results;
    }
  },
  methods: {
    formatDate(isoStr) {
      if (!isoStr) return '---';
      try {
        const d = new Date(isoStr);
        const date = ('0' + d.getDate()).slice(-2);
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const year = d.getFullYear();
        return `${date}/${month}/${year}`;
      } catch (e) {
        return isoStr;
      }
    }
  }
};
</script>

<style scoped>
.face-avatar-container {
  width: 74px;
  height: 74px;
  border-radius: 16px;
  border: 2px dashed #3b82f6;
  background-color: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.face-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.face-avatar-placeholder {
  text-align: center;
}

.face-scan-badge {
  font-size: 0.65rem;
  color: #64748b;
  font-weight: 600;
  display: block;
}
</style>
