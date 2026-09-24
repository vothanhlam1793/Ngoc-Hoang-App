<template>
  <div class="container-fluid py-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4><i class="fas fa-bullhorn text-primary mr-2"></i>Quản lý Thông báo</h4>
      <button class="btn btn-primary" @click="openModalCreate">
        <i class="fas fa-plus mr-1"></i>Tạo thông báo mới
      </button>
    </div>

    <!-- Danh sách thông báo -->
    <div class="card shadow-sm">
      <div class="card-body p-0">
        <b-table
          hover
          responsive
          :items="notifications"
          :fields="fields"
          :busy="loading"
        >
          <template #table-busy>
            <div class="text-center my-3 text-muted">
              <b-spinner small class="mr-2"></b-spinner>Đang tải danh sách thông báo...
            </div>
          </template>

          <template #cell(scope)="data">
            <span v-if="data.item.scope === 'ALL_SCHOOL'" class="badge bg-success text-white">Toàn trường</span>
            <span v-else class="badge bg-info text-white">
              Theo lớp: {{ (data.item.classes || []).map(c => c.name).join(', ') }}
            </span>
          </template>

          <template #cell(status)="data">
            <span v-if="data.item.status === 'PUBLISHED'" class="badge bg-primary text-white">Đã xuất bản</span>
            <span v-else class="badge bg-secondary text-white">Bản nháp</span>
          </template>

          <template #cell(publishedAt)="data">
            {{ formatDateTime(data.item.publishedAt) }}
          </template>

          <template #cell(action)="data">
            <button class="btn btn-sm btn-outline-danger" @click="deleteNotif(data.item.id)">
              <i class="fas fa-trash"></i>
            </button>
          </template>
        </b-table>
      </div>
    </div>

    <!-- Modal Tạo thông báo -->
    <b-modal id="modal-create-notif" title="Tạo thông báo mới" hide-footer size="lg">
      <form @submit.prevent="submitCreate">
        <div class="form-group mb-3">
          <label class="font-weight-bold">Tiêu đề thông báo *</label>
          <input
            v-model="form.title"
            type="text"
            class="form-control"
            placeholder="Ví dụ: Thông báo nghỉ lễ 30/4 - 1/5"
            required
          />
        </div>

        <div class="form-group mb-3">
          <label class="font-weight-bold">Phạm vi gửi</label>
          <div>
            <div class="form-check form-check-inline">
              <input
                id="scope-school"
                v-model="form.scope"
                class="form-check-input"
                type="radio"
                value="ALL_SCHOOL"
              />
              <label class="form-check-label" for="scope-school">Toàn trường</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                id="scope-class"
                v-model="form.scope"
                class="form-check-input"
                type="radio"
                value="CLASS"
              />
              <label class="form-check-label" for="scope-class">Chọn lớp cụ thể</label>
            </div>
          </div>
        </div>

        <div v-if="form.scope === 'CLASS'" class="form-group mb-3">
          <label class="font-weight-bold">Chọn các lớp nhận thông báo</label>
          <div class="row">
            <div v-for="lop in classes" :key="lop.id" class="col-md-4 mb-2">
              <div class="form-check">
                <input
                  :id="'lop-' + lop.id"
                  v-model="form.selectedClasses"
                  class="form-check-input"
                  type="checkbox"
                  :value="lop.id"
                />
                <label class="form-check-label" :for="'lop-' + lop.id">{{ lop.name }}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="font-weight-bold">Nội dung chi tiết *</label>
          <textarea
            v-model="form.content"
            class="form-control"
            rows="6"
            placeholder="Nhập nội dung thông báo gửi đến phụ huynh..."
            required
          ></textarea>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-secondary mr-2" @click="$bvModal.hide('modal-create-notif')">
            Hủy
          </button>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <b-spinner v-if="submitting" small class="mr-1"></b-spinner> Xuất bản thông báo
          </button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import gql from 'graphql-tag';

const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    allNotifications(sortBy: publishedAt_DESC) {
      id
      code
      title
      content
      scope
      status
      publishedAt
      classes {
        id
        name
      }
    }
  }
`;

const GET_CLASSES = gql`
  query GetClasses {
    allLopHocs {
      id
      name
    }
  }
`;

export default {
  layout: 'app',
  data() {
    return {
      loading: false,
      submitting: false,
      notifications: [],
      classes: [],
      fields: [
        { key: 'code', label: 'Mã TB', sortable: true },
        { key: 'title', label: 'Tiêu đề' },
        { key: 'scope', label: 'Phạm vi' },
        { key: 'status', label: 'Trạng thái' },
        { key: 'publishedAt', label: 'Ngày đăng', sortable: true },
        { key: 'action', label: 'Thao tác', class: 'text-center' }
      ],
      form: {
        title: '',
        content: '',
        scope: 'ALL_SCHOOL',
        selectedClasses: []
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    formatDateTime(dateStr) {
      if (!dateStr) return '';
      return this.$moment(dateStr).format('DD/MM/YYYY HH:mm');
    },
    async fetchData() {
      this.loading = true;
      try {
        const client = this.$apolloProvider.defaultClient;
        const [notifRes, classRes] = await Promise.all([
          client.query({ query: GET_NOTIFICATIONS, fetchPolicy: 'network-only' }),
          client.query({ query: GET_CLASSES, fetchPolicy: 'network-only' })
        ]);
        this.notifications = notifRes.data?.allNotifications || [];
        this.classes = classRes.data?.allLopHocs || [];
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    openModalCreate() {
      this.form = {
        title: '',
        content: '',
        scope: 'ALL_SCHOOL',
        selectedClasses: []
      };
      this.$bvModal.show('modal-create-notif');
    },
    async submitCreate() {
      this.submitting = true;
      try {
        const client = this.$apolloProvider.defaultClient;
        const dataInput = {
          title: this.form.title,
          content: this.form.content,
          scope: this.form.scope,
          status: 'PUBLISHED'
        };

        if (this.form.scope === 'CLASS' && this.form.selectedClasses.length > 0) {
          dataInput.classes = {
            connect: this.form.selectedClasses.map(id => ({ id }))
          };
        }

        await client.mutate({
          mutation: gql`
            mutation CreateNotification($data: NotificationCreateInput!) {
              createNotification(data: $data) {
                id
                code
              }
            }
          `,
          variables: { data: dataInput }
        });

        this.$bvModal.hide('modal-create-notif');
        this.fetchData();
      } catch (err) {
        alert('Lỗi tạo thông báo: ' + err.message);
      } finally {
        this.submitting = false;
      }
    },
    async deleteNotif(id) {
      if (!confirm('Bạn có chắc chắn muốn xóa thông báo này?')) return;
      try {
        const client = this.$apolloProvider.defaultClient;
        await client.mutate({
          mutation: gql`
            mutation DeleteNotification($id: ID!) {
              deleteNotification(id: $id) {
                id
              }
            }
          `,
          variables: { id }
        });
        this.fetchData();
      } catch (err) {
        alert('Lỗi xóa thông báo: ' + err.message);
      }
    }
  }
};
</script>
