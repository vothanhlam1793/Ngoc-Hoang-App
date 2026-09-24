<template>
  <div class="login-wrapper d-flex align-items-center justify-content-center min-vh-100">
    <div class="login-card-container">
      <div class="card border-0 shadow-lg login-card">
        <div class="card-body p-4 p-md-5">
          <!-- Logo & Brand Header -->
          <div class="text-center mb-4">
            <div class="brand-badge-icon mx-auto mb-3 shadow-sm d-flex align-items-center justify-content-center">
              <i class="fas fa-graduation-cap fa-2x text-white"></i>
            </div>
            <h4 class="fw-bold text-dark mb-1 font-brand">MẦM NON NGỌC HOÀNG</h4>
            <p class="text-muted small mb-0">Hệ thống Quản trị & Vận hành Nội bộ</p>
          </div>

          <!-- Alert Notification -->
          <div v-if="alert" class="alert alert-danger d-flex align-items-center py-2 px-3 mb-4 rounded-3 border-0 shadow-sm" role="alert">
            <i class="fas fa-circle-exclamation me-2 fs-5"></i>
            <div class="small fw-medium">{{ alert }}</div>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="userLogin" autocomplete="on">
            <!-- Username Input -->
            <div class="mb-3">
              <label class="form-label text-secondary small fw-semibold">Tên đăng nhập</label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0 text-muted px-3">
                  <i class="fas fa-user"></i>
                </span>
                <input
                  v-model.trim="login.username"
                  type="text"
                  class="form-control bg-light border-start-0 ps-1"
                  placeholder="Nhập tài khoản"
                  required
                  autofocus
                  autocomplete="username"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div class="mb-4">
              <label class="form-label text-secondary small fw-semibold d-flex justify-content-between">
                <span>Mật khẩu</span>
              </label>
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0 text-muted px-3">
                  <i class="fas fa-lock"></i>
                </span>
                <input
                  v-model="login.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control bg-light border-start-0 border-end-0 ps-1"
                  placeholder="Nhập mật khẩu"
                  required
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="input-group-text bg-light border-start-0 text-muted px-3"
                  tabindex="-1"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="btn btn-primary w-100 py-2 fw-semibold rounded-3 shadow-sm btn-login d-flex align-items-center justify-content-center"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <i v-else class="fas fa-arrow-right-to-bracket me-2"></i>
              <span>{{ loading ? 'Đang xác thực...' : 'Đăng nhập hệ thống' }}</span>
            </button>
          </form>

          <!-- Footer Note -->
          <div class="text-center mt-4 pt-2 border-top">
            <span class="badge bg-light text-secondary border px-2 py-1 small fw-normal">
              Phiên bản v2.0.2
            </span>
            <div class="text-muted mt-2" style="font-size: 0.75rem;">
              © CRETA • Hệ thống quản lý trường mầm non
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const credentials = { username: '', password: '' };

export default {
  layout: 'default',
  data() {
    return {
      login: {
        username: '',
        password: ''
      },
      showPassword: false,
      loading: false,
      alert: ''
    };
  },
  head() {
    return {
      title: 'Đăng nhập - Mầm Non Ngọc Hoàng'
    };
  },
  methods: {
    async userLogin() {
      this.alert = '';
      this.loading = true;
      credentials.username = this.login.username;
      credentials.password = this.login.password;

      try {
        await this.$auth.loginWith('graphql', credentials)
          .then((data) => {
            console.log('SUCCESS', data);
            this.$router.push('/');
          })
          .catch((err) => {
            console.log('FAIL', err);
            this.alert = 'Tên đăng nhập hoặc mật khẩu không chính xác!';
          });
      } catch (err) {
        console.error(err);
        this.alert = 'Lỗi kết nối tới máy chủ!';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-wrapper {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0d9488 100%);
  min-height: 100vh;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.login-wrapper::before {
  content: "";
  position: absolute;
  top: -20%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.login-wrapper::after {
  content: "";
  position: absolute;
  bottom: -20%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.login-card-container {
  width: 100%;
  max-width: 440px;
  z-index: 10;
}

.login-card {
  border-radius: 1.25rem !important;
  background: rgba(255, 255, 255, 0.96) !important;
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.3) !important;
}

.brand-badge-icon {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%);
}

.font-brand {
  letter-spacing: 0.5px;
  color: #0f172a;
}

.input-group-text {
  border-color: #e2e8f0;
}

.form-control {
  border-color: #e2e8f0;
  font-size: 0.95rem;
  padding-top: 0.65rem;
  padding-bottom: 0.65rem;
  transition: all 0.2s ease;
}

.form-control:focus {
  background-color: #ffffff !important;
  border-color: #0d9488 !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 148, 136, 0.15) !important;
}

.input-group .btn,
.input-group .input-group-text button {
  cursor: pointer;
}

.btn-login {
  background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
  border: none;
  font-size: 1rem;
  letter-spacing: 0.3px;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  transition: all 0.25s ease;
}

.btn-login:hover:not(:disabled) {
  background: linear-gradient(135deg, #0f766e 0%, #115e59 100%);
  transform: translateY(-1px);
  box-shadow: 0 8px 16px -4px rgba(13, 148, 136, 0.4) !important;
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}
</style>
