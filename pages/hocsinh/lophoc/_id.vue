<template>
  <div class="container-fluid py-3">
    <!-- Header thông tin lớp học -->
    <div class="card border-0 shadow-sm rounded-lg mb-3 bg-white p-3">
      <div class="d-flex flex-wrap justify-content-between align-items-center">
        <div class="d-flex align-items-center mb-2 mb-md-0">
          <div class="class-avatar bg-primary-light text-primary mr-3 d-flex align-items-center justify-content-center">
            <i class="fas fa-shapes fs-4"></i>
          </div>
          <div>
            <h4 class="font-weight-bold text-dark mb-0">
              {{ lophoc.name || 'Đang tải thông tin lớp...' }}
            </h4>
            <span class="text-muted small">
              Sĩ số: <strong class="text-primary">{{ filteredStudents.length }}</strong> bé
              <span v-if="searchQuery" class="text-secondary">(Lọc từ {{ (lophoc.hocsinhs || []).length }})</span>
            </span>
          </div>
        </div>

        <div class="d-flex align-items-center">
          <nuxt-link
            v-if="lophoc.id"
            :to="`/dihoc/${currentYear}/${currentMonth}/${currentDate}/${lophoc.id}`"
            class="btn btn-sm btn-success font-weight-bold rounded-pill px-3 shadow-sm mr-2"
          >
            <i class="fas fa-calendar-check mr-1"></i> Điểm danh hôm nay
          </nuxt-link>
          <button
            class="btn btn-sm btn-light border rounded-pill px-3"
            @click="getLopHoc"
            :disabled="loading"
            title="Tải lại danh sách"
          >
            <i :class="['fas fa-sync-alt', { 'fa-spin': loading }]"></i>
          </button>
        </div>
      </div>

      <!-- Ô tìm kiếm học sinh -->
      <div class="mt-3">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text bg-light border-right-0 rounded-left">
              <i class="fas fa-search text-muted"></i>
            </span>
          </div>
          <input
            type="text"
            class="form-control bg-light border-left-0 rounded-right"
            v-model="searchQuery"
            placeholder="Tìm theo tên bé, biệt danh, tên phụ huynh, SĐT..."
          />
          <div class="input-group-append" v-if="searchQuery">
            <button class="btn btn-light border" type="button" @click="searchQuery = ''">
              <i class="fas fa-times text-muted"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Trạng thái đang tải -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Đang tải...</span>
      </div>
      <p class="text-muted mt-2 small">Đang tải hồ sơ học sinh...</p>
    </div>

    <!-- Danh sách thẻ học sinh dạng Cards (Touch Mobile First) -->
    <div v-else-if="filteredStudents && filteredStudents.length > 0" class="row">
      <div
        v-for="(hs, index) in filteredStudents"
        :key="hs.id"
        class="col-12 col-md-6 col-lg-4 mb-3"
      >
        <div class="student-card card border-0 shadow-sm rounded-lg h-100 p-3 bg-white">
          <div class="d-flex align-items-start">
            <!-- Avatar tròn -->
            <div
              class="student-avatar text-white font-weight-bold mr-3 flex-shrink-0 d-flex align-items-center justify-content-center shadow-sm"
              :style="{ backgroundColor: getAvatarColor(hs.name, index) }"
              @click="openModalDetail(hs)"
            >
              {{ getInitials(hs.name) }}
            </div>

            <!-- Thông tin chính bé -->
            <div class="flex-grow-1 overflow-hidden" @click="openModalDetail(hs)">
              <div class="d-flex align-items-center justify-content-between mb-1">
                <h6 class="font-weight-bold text-dark mb-0 text-truncate student-name" :title="hs.name">
                  {{ hs.name }}
                </h6>
                <span class="badge badge-light border text-muted small ml-1 flex-shrink-0">
                  #{{ index + 1 }}
                </span>
              </div>

              <div class="student-meta mb-2">
                <span v-if="hs.sName" class="badge badge-warning text-dark mr-1" style="font-size: 0.7rem;">
                  {{ hs.sName }}
                </span>
                <span v-if="hs.birthday" class="badge badge-light text-secondary mr-1" style="font-size: 0.7rem;">
                  <i class="fas fa-birthday-cake text-danger mr-1"></i>{{ formatBirthday(hs.birthday) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Khu vực liên lạc Phụ huynh (Chạm gọi nhanh) -->
          <div class="parent-contact-box mt-2 pt-2 border-top">
            <div v-if="getParentPhones(hs).length > 0">
              <div
                v-for="(p, pIdx) in getParentPhones(hs)"
                :key="pIdx"
                class="d-flex align-items-center justify-content-between mb-1"
              >
                <div class="small text-muted text-truncate mr-2">
                  <i class="fas fa-user text-secondary mr-1"></i>
                  <span>{{ p.label }}:</span>
                  <strong class="text-dark ml-1">{{ p.name }}</strong>
                </div>

                <a
                  :href="'tel:' + p.number"
                  class="btn btn-sm btn-outline-success font-weight-bold rounded-pill px-2 py-0 call-btn"
                  title="Gọi điện ngay"
                  @click.stop
                >
                  <i class="fas fa-phone-alt mr-1"></i>{{ p.number }}
                </a>
              </div>
            </div>

            <div v-else class="text-muted small py-1">
              <i class="fas fa-info-circle mr-1"></i> Chưa cập nhật SĐT phụ huynh
            </div>
          </div>

          <!-- Nút hành động nhanh -->
          <div class="d-flex justify-content-end mt-2 pt-2 border-top">
            <button
              type="button"
              class="btn btn-sm btn-light text-primary font-weight-bold rounded-pill px-3"
              @click="openModalDetail(hs)"
            >
              <i class="fas fa-id-card mr-1"></i> Chi tiết bé
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Không tìm thấy học sinh -->
    <div v-else class="text-center py-5 bg-white rounded-lg shadow-sm">
      <i class="fas fa-search text-muted fa-3x mb-3"></i>
      <h6 class="text-dark font-weight-bold">Không tìm thấy học sinh nào</h6>
      <p class="text-muted small mb-0">Thử tìm kiếm với từ khóa khác hoặc làm mới danh sách.</p>
    </div>

    <!-- Modal Chi Tiết Học Sinh -->
    <StudentQuickModal
      :show="showDetailModal"
      :student="selectedStudent"
      @close="showDetailModal = false"
    />
  </div>
</template>

<script>
import gql from 'graphql-tag';
import StudentQuickModal from '~/components/DiemDanh/StudentQuickModal.vue';

export default {
  layout: 'app',
  components: {
    StudentQuickModal
  },
  data() {
    return {
      idLopHoc: '',
      lophoc: {},
      loading: true,
      searchQuery: '',
      showDetailModal: false,
      selectedStudent: null,
      avatarColors: [
        '#4F46E5', '#06B6D4', '#10B981', '#F59E0B',
        '#EC4899', '#8B5CF6', '#3B82F6', '#14B8A6'
      ]
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear().toString();
    },
    currentMonth() {
      const m = new Date().getMonth() + 1;
      return m < 10 ? '0' + m : m.toString();
    },
    currentDate() {
      const d = new Date().getDate();
      return d < 10 ? '0' + d : d.toString();
    },
    filteredStudents() {
      const list = this.lophoc.hocsinhs || [];
      if (!this.searchQuery.trim()) {
        return list;
      }
      const q = this.removeVietnameseTones(this.searchQuery.trim().toLowerCase());
      return list.filter(hs => {
        const nameMatch = this.removeVietnameseTones(hs.name || '').toLowerCase().includes(q);
        const sNameMatch = this.removeVietnameseTones(hs.sName || '').toLowerCase().includes(q);
        
        let parentMatch = false;
        if (hs.parent) {
          const pName = this.removeVietnameseTones(hs.parent.name || '').toLowerCase();
          if (pName.includes(q)) parentMatch = true;

          // Check phones
          if (hs.parent.phone && hs.parent.phone.length) {
            hs.parent.phone.forEach(p => {
              if ((p.number || '').includes(q)) parentMatch = true;
            });
          }
        }
        return nameMatch || sNameMatch || parentMatch;
      });
    }
  },
  methods: {
    removeVietnameseTones(str) {
      if (!str) return '';
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
    },
    getInitials(name) {
      if (!name) return 'B';
      const parts = name.trim().split(/\s+/);
      const last = parts[parts.length - 1];
      return last ? last.charAt(0).toUpperCase() : 'B';
    },
    getAvatarColor(name, index) {
      const idx = (name ? name.charCodeAt(0) : index) % this.avatarColors.length;
      return this.avatarColors[idx];
    },
    formatBirthday(str) {
      if (!str) return '';
      try {
        const d = new Date(str);
        if (isNaN(d.getTime())) return str;
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      } catch (e) {
        return str;
      }
    },
    getParentPhones(hs) {
      const results = [];
      if (!hs.parent) return results;

      // Parse JSON parents nếu có cấu hình dadName/dadPhone
      if (hs.parent.parents) {
        try {
          const obj = JSON.parse(hs.parent.parents);
          if (obj.dadPhone) {
            results.push({
              label: 'Bố',
              name: obj.dadName || 'Bố bé',
              number: obj.dadPhone.trim()
            });
          }
          if (obj.momPhone) {
            results.push({
              label: 'Mẹ',
              name: obj.momName || 'Mẹ bé',
              number: obj.momPhone.trim()
            });
          }
        } catch (e) {}
      }

      // Nếu chưa có từ JSON, đọc từ mảng hs.parent.phone
      if (results.length === 0 && hs.parent.phone && hs.parent.phone.length) {
        hs.parent.phone.forEach((p, idx) => {
          if (p.number) {
            results.push({
              label: p.name || `SĐT ${idx + 1}`,
              name: hs.parent.name || 'Phụ huynh',
              number: p.number.trim()
            });
          }
        });
      }

      return results;
    },
    openModalDetail(hs) {
      this.selectedStudent = hs;
      this.showDetailModal = true;
    },
    getLopHoc() {
      this.loading = true;
      const client = this.$apolloProvider.defaultClient;
      client.query({
        fetchPolicy: 'network-only',
        query: gql`
          query GetLopHocDetails($id: ID!) {
            LopHoc(where: { id: $id }) {
              id
              name
              hocsinhs {
                id
                name
                sName
                birthday
                luuy
                status
                parent {
                  id
                  name
                  parents
                  phone {
                    id
                    name
                    number
                  }
                }
              }
            }
          }
        `,
        variables: { id: this.idLopHoc }
      }).then(data => {
        this.loading = false;
        const lh = data.data.LopHoc || {};
        const rawStudents = (lh.hocsinhs || []).filter(h => h.status !== 'NGHI_LUON');

        // Sắp xếp học sinh theo Tên (A-Z)
        rawStudents.sort((a, b) => {
          const partsA = (a.name || '').trim().split(/\s+/);
          const partsB = (b.name || '').trim().split(/\s+/);
          const lastA = this.removeVietnameseTones(partsA[partsA.length - 1] || '');
          const lastB = this.removeVietnameseTones(partsB[partsB.length - 1] || '');
          return lastA.localeCompare(lastB);
        });

        this.lophoc = {
          ...lh,
          hocsinhs: rawStudents
        };
      }).catch(err => {
        this.loading = false;
        console.error('LOPHOC_LOAD_ERROR:', err);
      });
    }
  },
  created() {
    this.idLopHoc = this.$route.params.id;
    if (this.idLopHoc) {
      this.getLopHoc();
    }
  }
};
</script>

<style scoped>
.class-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
}

.student-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.student-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08) !important;
}

.student-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  font-size: 1.15rem;
}

.student-name {
  font-size: 1rem;
}

.call-btn {
  font-size: 0.75rem;
  line-height: 1.6;
}

.call-btn:hover {
  background-color: #10b981;
  color: #ffffff;
}

.bg-primary-light {
  background-color: #e0e7ff;
}
</style>
