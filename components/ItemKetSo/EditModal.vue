<template>
    <div>
        <b-modal
            v-model="show"
            :title="label"
            hide-footer
        >
            <div>
                <b-form-input
                    id="inputField"
                    v-model="inputValue"
                ></b-form-input>
            </div>

            <div class="mt-3 text-right">
                <b-button
                    variant="primary"
                    @click="onOK"
                >OK</b-button>
                <b-button
                    variant="danger"
                    @click="onCancel"
                >Cancel</b-button>
            </div>
        </b-modal>
    </div>
</template>
  
<script>
export default {
    props: {
        isOpen: Boolean, // Prop để kiểm soát việc mở/chỉ định modal
        inputData: String, // Prop để truyền dữ liệu vào modal
        label: String
    },
    data() {
        return {
            show: this.isOpen, // Sử dụng prop để quyết định xem modal có nên hiển thị hay không
            inputValue: this.inputData
        };
    },
    watch: {
        isOpen(newVal) {
            this.show = newVal; // Theo dõi thay đổi của prop isOpen để cập nhật trạng thái modal
        },
        inputData(newVal) {
            this.inputValue = newVal; // Theo dõi thay đổi của prop inputData
        }
    },
    methods: {
        showModal() {
            this.show = true;
        },
        onOK() {
            // Xử lý khi nút OK được nhấn
            console.log("OK button clicked. Input value: " + this.inputValue);
            this.$emit("update-data", this.inputValue); // Gửi dữ liệu ra ngoài thông qua sự kiện update-data
            // this.show = false; // Đóng modal
        },
        onCancel() {
            // Xử lý khi nút Cancel được nhấn
            console.log("Cancel button clicked");
            // this.show = false; // Đóng modal
            this.onOK();
        }
    }
};
</script>
  