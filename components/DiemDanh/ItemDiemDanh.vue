<template>
  <div
    class="student-touch-card card mb-2 border-0 shadow-sm"
    :class="[
      getResultClass(),
      { 'border-tam-nghi': hocsinh.status === 'TAM_NGHI' }
    ]"
  >
    <div class="card-body p-2 p-sm-3 d-flex align-items-center justify-content-between">
      <!-- Left: STT + Tên bé (Bỏ icon, cho phép click xem chi tiết bé, chữ xuống dòng tự nhiên không bị mất) -->
      <div
        class="student-main-info d-flex align-items-start flex-grow-1 pr-2 cursor-pointer"
        role="button"
        tabindex="0"
        :aria-label="'Xem thông tin của ' + hocsinh.name"
        @click="$emit('select-student', hocsinh)"
        @keydown.enter.prevent="$emit('select-student', hocsinh)"
        @keydown.space.prevent="$emit('select-student', hocsinh)"
        title="Bấm để xem thông tin chi tiết của bé"
      >
        <span class="stt-badge font-weight-bold text-muted mr-2 flex-shrink-0 mt-1">
          #{{ index + 1 }}
        </span>

        <div class="student-text-block">
          <!-- Tên bé: white-space normal để tên 4-5 chữ tự xuống dòng trọn vẹn -->
          <div class="student-name font-weight-bold text-dark">
            {{ hocsinh.name }}
            <i class="fas fa-info-circle text-primary ml-1 small" style="font-size: 0.75rem;"></i>
          </div>

          <div class="d-flex align-items-center mt-1 flex-wrap gap-1">
            <span v-if="sName && sName.value" class="badge badge-info font-weight-normal mr-1 py-0 px-1" style="font-size: 0.72rem;">
              {{ sName.value }}
            </span>
            <span v-if="hocsinh.code" class="text-muted small font-italic" style="font-size: 0.72rem;">
              {{ hocsinh.code }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right: Touch Pill Segmented Buttons (Có mặt / Vắng) -->
      <div class="btn-group-touch flex-shrink-0 ml-2">
        <div v-if="hocsinh.status === 'TAM_NGHI'" class="text-muted small font-italic px-2">
          Đang tạm nghỉ
        </div>
        <div v-else class="segmented-control">
          <!-- Button Có mặt -->
          <button
            type="button"
            class="seg-btn seg-btn-present"
            :class="{ 'active': currentResult === '1' }"
            @click.stop="setPresence('1')"
          >
            <i class="fas fa-check mr-1"></i>
            <span class="seg-label">Có mặt</span>
          </button>

          <!-- Button Vắng -->
          <button
            type="button"
            class="seg-btn seg-btn-absent"
            :class="{ 'active': currentResult === '0' }"
            @click.stop="setPresence('0')"
          >
            <i class="fas fa-times mr-1"></i>
            <span class="seg-label">Vắng</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getVariableByKey } from '~/plugins/variable.js';

export default {
  props: {
    hocsinh: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      sName: {}
    };
  },
  computed: {
    monitor() {
      return this.$store.state.ndd.monitor;
    },
    currentResult() {
      // Re-evaluate whenever monitor or hocsinh change
      if (this.monitor !== undefined && this.hocsinh) {
        return this.hocsinh.result === '1' ? '1' : '0';
      }
      return '0';
    }
  },
  methods: {
    setPresence(val) {
      if (this.hocsinh.status === 'TAM_NGHI') return;
      this.$store.commit('ndd/updateDiemDanhHocSinh', {
        hocsinh: this.hocsinh,
        result: val
      });
    },
    getResultClass() {
      if (this.hocsinh.status === 'TAM_NGHI') return 'card-tam-nghi';
      return this.currentResult === '1' ? 'card-present' : 'card-absent';
    },
    querySName() {
      if (!this.hocsinh || !this.hocsinh.id) return;
      getVariableByKey(this.$apolloProvider.defaultClient, {
        item: 'Student',
        idItem: this.hocsinh.id,
        key: 'SNAME'
      })
        .then(variable => {
          this.sName = variable;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.querySName();
  }
};
</script>

<style scoped>
.student-touch-card {
  border-radius: 12px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5px solid transparent;
  background-color: #ffffff;
}

.student-touch-card.card-present {
  border-color: #bbf7d0;
  background-color: #f0fdf4;
}

.student-touch-card.card-absent {
  border-color: #fecaca;
  background-color: #fff5f5;
}

.student-touch-card.card-tam-nghi {
  border-color: #e2e8f0;
  background-color: #f8fafc;
  opacity: 0.75;
}

.cursor-pointer {
  cursor: pointer;
}

.student-main-info:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 3px;
  border-radius: 4px;
}

.stt-badge {
  font-size: 0.85rem;
  width: 24px;
}

.student-text-block {
  min-width: 0;
  flex: 1;
}

/* Đảm bảo tên dài tự xuống dòng mượt mà, không bị mất chữ */
.student-name {
  font-size: 0.95rem;
  line-height: 1.35;
  white-space: normal;
  word-break: break-word;
  color: #1e293b;
}

.student-touch-card:hover .student-name {
  color: #2563eb;
}

/* Touch Segmented Control */
.segmented-control {
  display: inline-flex;
  background-color: #e2e8f0;
  padding: 3px;
  border-radius: 30px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.06);
}

.seg-btn {
  border: none;
  outline: none;
  background: transparent;
  padding: 8px 14px;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 78px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.seg-btn:active {
  transform: scale(0.96);
}

.seg-btn-present.active {
  background-color: #16a34a;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(22, 163, 74, 0.35);
}

.seg-btn-absent.active {
  background-color: #dc2626;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(220, 38, 38, 0.35);
}

@media (max-width: 576px) {
  .seg-btn {
    padding: 7px 10px;
    font-size: 0.8rem;
    min-width: 66px;
  }
  .student-name {
    font-size: 0.9rem;
  }
}
</style>
