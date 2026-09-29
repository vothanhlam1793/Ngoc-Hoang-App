<template>
  <div class="container-fluid py-3 sanpham-page">
    <!-- Header -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb bg-transparent p-0 mb-1 small">
            <li class="breadcrumb-item"><nuxt-link to="/">Trang chủ</nuxt-link></li>
            <li class="breadcrumb-item active">Sản phẩm & Đồng phục</li>
          </ol>
        </nav>
        <h1 class="h4 mb-0 font-weight-bold text-dark">
          <i class="fas fa-boxes text-info mr-2"></i>Danh mục Sản phẩm & Đồng phục
        </h1>
      </div>
      <div class="d-flex flex-wrap gap-2 mt-2 mt-md-0">
        <nuxt-link to="/hoadon" class="btn btn-sm btn-outline-primary font-weight-bold mr-2 shadow-sm">
          <i class="fas fa-file-invoice-dollar mr-1"></i> Hóa đơn & Bán hàng
        </nuxt-link>
        <button type="button" class="btn btn-sm btn-success font-weight-bold shadow-sm" @click="openCreateModal">
          <i class="fas fa-plus mr-1"></i> Thêm sản phẩm
        </button>
      </div>
    </div>

    <!-- Thanh tìm kiếm & thống kê -->
    <div class="card border-0 shadow-sm rounded-lg mb-3 bg-white">
      <div class="card-body p-3">
        <div class="row align-items-center">
          <div class="col-md-6 mb-2 mb-md-0">
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text bg-light border-right-0"><i class="fas fa-search text-muted"></i></span>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                class="form-control form-control-sm border-left-0"
                placeholder="Tìm sản phẩm, đồng phục, mã SP..."
              />
              <div class="input-group-append" v-if="searchQuery">
                <button class="btn btn-outline-secondary" type="button" @click="searchQuery = ''">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-6 text-md-right small text-muted">
            Tổng cộng: <strong class="text-dark">{{ filteredProducts.length }}</strong> sản phẩm
            <button class="btn btn-xs btn-outline-secondary ml-2" :disabled="loading" @click="loadProducts">
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i> Tải lại
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bảng danh sách sản phẩm -->
    <div class="card border-0 shadow-sm rounded-lg bg-white">
      <div class="table-responsive">
        <table class="table table-hover table-sm align-middle mb-0">
          <thead class="thead-light small text-uppercase font-weight-bold text-muted">
            <tr>
              <th style="width: 80px;" class="text-center">STT</th>
              <th style="width: 120px;">Mã SP</th>
              <th>Tên sản phẩm / Đồng phục</th>
              <th class="text-right" style="width: 160px;">Đơn giá bán</th>
              <th class="text-center" style="width: 120px;">Tồn kho</th>
              <th class="text-center" style="width: 160px;">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-4 text-muted">
                <i class="fas fa-spinner fa-spin mr-1"></i> Đang tải dữ liệu sản phẩm...
              </td>
            </tr>
            <tr v-for="(sp, idx) in filteredProducts" :key="sp.id">
              <td class="text-center text-muted small font-weight-bold">{{ idx + 1 }}</td>
              <td>
                <span class="badge badge-light border text-monospace font-weight-bold text-dark">
                  {{ sp.code || '—' }}
                </span>
              </td>
              <td>
                <div class="font-weight-bold text-dark">{{ sp.name }}</div>
                <small v-if="sp.note" class="text-muted font-italic">{{ sp.note }}</small>
              </td>
              <td class="text-right font-weight-bold text-primary">
                {{ formatMoney(sp.price) }} đ
              </td>
              <td class="text-center">
                <span class="badge" :class="Number(sp.amount) > 0 ? 'badge-success' : 'badge-secondary'">
                  {{ sp.amount != null ? sp.amount : '—' }}
                </span>
              </td>
              <td class="text-center">
                <button type="button" class="btn btn-xs btn-outline-info font-weight-bold mr-1" @click="openEditModal(sp)">
                  <i class="fas fa-edit mr-1"></i> Sửa
                </button>
                <button type="button" class="btn btn-xs btn-outline-danger" @click="confirmDelete(sp)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
            <tr v-if="!loading && !filteredProducts.length">
              <td colspan="6" class="text-center py-5 text-muted">
                <i class="fas fa-box-open fa-2x mb-2 d-block opacity-50"></i>
                Không tìm thấy sản phẩm nào phù hợp.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL THÊM / CHỈNH SỬA SẢN PHẨM -->
    <b-modal
      v-model="showProductModal"
      :title="modalMode === 'CREATE' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'"
      hide-footer
      centered
      no-close-on-backdrop
    >
      <form @submit.prevent="saveProduct">
        <div class="form-group mb-2">
          <label class="small font-weight-bold text-dark mb-1">Tên sản phẩm / Đồng phục <span class="text-danger">*</span></label>
          <input
            v-model.trim="productForm.name"
            type="text"
            required
            class="form-control form-control-sm font-weight-bold"
            placeholder="Ví dụ: Bộ đồng phục bé trai, Balo mầm non..."
          />
        </div>

        <div class="row">
          <div class="col-md-6 form-group mb-2">
            <label class="small font-weight-bold text-dark mb-1">Đơn giá bán (đ) <span class="text-danger">*</span></label>
            <input
              v-model.number="productForm.price"
              type="number"
              step="1000"
              required
              class="form-control form-control-sm font-weight-bold text-primary"
            />
          </div>
          <div class="col-md-6 form-group mb-2">
            <label class="small font-weight-bold text-dark mb-1">Số lượng tồn kho</label>
            <input
              v-model.number="productForm.amount"
              type="number"
              min="0"
              class="form-control form-control-sm text-center"
              placeholder="Để trống nếu không quản lý tồn"
            />
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="small font-weight-bold text-dark mb-1">Ghi chú / Mô tả</label>
          <input
            v-model.trim="productForm.note"
            type="text"
            class="form-control form-control-sm"
            placeholder="Size, chất liệu hoặc ghi chú..."
          />
        </div>

        <div class="d-flex justify-content-end gap-2 pt-2 border-top">
          <button type="button" class="btn btn-light btn-sm border mr-2" @click="showProductModal = false">
            Hủy
          </button>
          <button type="submit" class="btn btn-success btn-sm font-weight-bold" :disabled="saving">
            <i class="fas" :class="saving ? 'fa-spinner fa-spin mr-1' : 'fa-check mr-1'"></i>
            {{ saving ? 'Đang lưu...' : (modalMode === 'CREATE' ? 'Tạo sản phẩm' : 'Lưu thay đổi') }}
          </button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
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

const GET_ALL_SAN_PHAM = gql`
  query {
    allSanPhams(sortBy: code_DESC) {
      id
      code
      name
      price
      amount
      note
      type
    }
  }
`;

const CREATE_SAN_PHAM = gql`
  mutation createSP($name: String!, $price: Int!, $amount: Int, $note: String) {
    createSanPham(data: {
      name: $name,
      price: $price,
      amount: $amount,
      note: $note
    }) {
      id
      code
      name
      price
      amount
      note
    }
  }
`;

const UPDATE_SAN_PHAM = gql`
  mutation updateSP($id: ID!, $name: String, $price: Int, $amount: Int, $note: String) {
    updateSanPham(id: $id, data: {
      name: $name,
      price: $price,
      amount: $amount,
      note: $note
    }) {
      id
      code
      name
      price
      amount
      note
    }
  }
`;

const DELETE_SAN_PHAM = gql`
  mutation deleteSP($id: ID!) {
    deleteSanPham(id: $id) {
      id
    }
  }
`;

export default {
  layout: 'app',
  data() {
    return {
      products: [],
      searchQuery: '',
      loading: false,
      saving: false,
      showProductModal: false,
      modalMode: 'CREATE', // 'CREATE' | 'EDIT'
      selectedProductId: null,
      productForm: {
        name: '',
        price: 100000,
        amount: null,
        note: '',
      },
    };
  },
  computed: {
    filteredProducts() {
      if (!this.searchQuery) return this.products;
      const q = removeVietnameseTones(this.searchQuery);
      return this.products.filter(p => {
        const nameMatch = removeVietnameseTones(p.name).includes(q);
        const codeMatch = removeVietnameseTones(p.code || '').includes(q);
        return nameMatch || codeMatch;
      });
    },
  },
  mounted() {
    this.loadProducts();
  },
  methods: {
    async loadProducts() {
      this.loading = true;
      try {
        const client = this.$apolloProvider.defaultClient;
        const res = await client.query({
          query: GET_ALL_SAN_PHAM,
          fetchPolicy: 'network-only',
        });
        this.products = (res.data && res.data.allSanPhams) || [];
      } catch (err) {
        console.error('Lỗi nạp danh sách sản phẩm:', err);
        this.$bvToast.toast('Không thể tải danh sách sản phẩm', { variant: 'danger', solid: true });
      } finally {
        this.loading = false;
      }
    },
    openCreateModal() {
      this.modalMode = 'CREATE';
      this.selectedProductId = null;
      this.productForm = {
        name: '',
        price: 100000,
        amount: null,
        note: '',
      };
      this.showProductModal = true;
    },
    openEditModal(sp) {
      this.modalMode = 'EDIT';
      this.selectedProductId = sp.id;
      this.productForm = {
        name: sp.name || '',
        price: sp.price || 0,
        amount: sp.amount != null ? sp.amount : null,
        note: sp.note || '',
      };
      this.showProductModal = true;
    },
    async saveProduct() {
      if (!this.productForm.name) return;
      this.saving = true;
      try {
        const client = this.$apolloProvider.defaultClient;
        if (this.modalMode === 'CREATE') {
          const res = await client.mutate({
            mutation: CREATE_SAN_PHAM,
            variables: {
              name: this.productForm.name,
              price: Number(this.productForm.price) || 0,
              amount: this.productForm.amount != null ? Number(this.productForm.amount) : null,
              note: this.productForm.note || null,
            },
          });
          const created = res.data && res.data.createSanPham;
          if (created) {
            this.products.unshift(created);
            this.$bvToast.toast(`Đã thêm sản phẩm "${created.name}"`, { variant: 'success', solid: true });
          }
        } else {
          const res = await client.mutate({
            mutation: UPDATE_SAN_PHAM,
            variables: {
              id: this.selectedProductId,
              name: this.productForm.name,
              price: Number(this.productForm.price) || 0,
              amount: this.productForm.amount != null ? Number(this.productForm.amount) : null,
              note: this.productForm.note || null,
            },
          });
          const updated = res.data && res.data.updateSanPham;
          if (updated) {
            const idx = this.products.findIndex(p => String(p.id) === String(updated.id));
            if (idx !== -1) {
              this.$set(this.products, idx, updated);
            }
            this.$bvToast.toast(`Đã cập nhật sản phẩm "${updated.name}"`, { variant: 'success', solid: true });
          }
        }
        this.showProductModal = false;
      } catch (err) {
        console.error('Lỗi lưu sản phẩm:', err);
        this.$bvToast.toast(err.message || 'Lỗi khi lưu sản phẩm', { variant: 'danger', solid: true });
      } finally {
        this.saving = false;
      }
    },
    async confirmDelete(sp) {
      const ok = await this.$bvModal.msgBoxConfirm(`Bạn có chắc chắn muốn xóa sản phẩm "${sp.name}" không?`, {
        title: 'Xác nhận xóa',
        okVariant: 'danger',
        okTitle: 'Xóa',
        cancelTitle: 'Hủy',
        centered: true,
      });
      if (!ok) return;

      try {
        const client = this.$apolloProvider.defaultClient;
        await client.mutate({
          mutation: DELETE_SAN_PHAM,
          variables: { id: sp.id },
        });
        this.products = this.products.filter(p => String(p.id) !== String(sp.id));
        this.$bvToast.toast(`Đã xóa sản phẩm "${sp.name}"`, { variant: 'success', solid: true });
      } catch (err) {
        console.error('Lỗi xóa sản phẩm:', err);
        this.$bvToast.toast(err.message || 'Không thể xóa sản phẩm', { variant: 'danger', solid: true });
      }
    },
    formatMoney(val) {
      return Number(val || 0).toLocaleString('vi-VN');
    },
  },
};
</script>

<style scoped>
.sanpham-page {
  min-height: 85vh;
}
.btn-xs {
  padding: 0.15rem 0.4rem;
  font-size: 0.75rem;
}
</style>
