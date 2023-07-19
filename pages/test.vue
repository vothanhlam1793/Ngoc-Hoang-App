<template>
    <div class="row">
        <div class="col">
            <div class="m-3">
                <p>State: {{ buttons[0].state }}</p>
                <p>Message: {{ buttons[0].message }}</p>
            </div>
            <BButton variant="success" size="sm" v-b-toggle.sidebar>Open Sidebar</BButton>
            <BButton variant="outline-primary" squared :pressed.sync="buttons[0].state" @click="showAlert()">{{ buttons[0].caption }}</BButton>
            <div class="m-3">
                <b-alert 
                    :show="dismissCountDown"
                    dismissible
                    variant="warning"
                    @dismissed="dismissCountDown=0"
                    @dismiss-count-down="countDownChanged"
                >Default Alert</b-alert>
            </div>
            <BSidebar id="sidebar" right width="600px"
                no-header
            >
            <template #default="{hide}">
                        <div>
                            <h1>Hello World</h1>
                            <BButton
                            @click="hide"
                            >Close</BButton>
                        </div>
                    </template>
            </BSidebar>

        </div>
    </div>
</template>
<script>
// import Vue from 'vue'
import { BAlert, BButton, BSidebar } from 'bootstrap-vue'
// Vue.use(ButtonPlugin)
export default {
    components: {
        BButton, 
        BAlert,
        BSidebar
    },
    data(){
        return {
            buttons: [
                { caption: 'Outline Primary', state: true, message: "" },
            ],
            dismissSecs: 3,
            dismissCountDown: 0,
            showDismissibleAlert: false
        }
    },
    methods: {
        btnClick(){
            var that = this;
            this.buttons[0].message = "Hello";
            setTimeout(()=> {
                that.buttons[0].message = "";
            }, 2000);
        },
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown
        },
        showAlert() {
            this.dismissCountDown = this.dismissSecs
        }
    },
    layout: "pdf",
}
</script>