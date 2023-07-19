<template>
    <div class="row">
        <div class="col">
            <div class="my-2">
                <EditName 
                    :hocsinh="hocsinh"
                />
            </div>
            <div class="row">
                <div class="col">
                    <HocSinhState
                    :hocsinh="hocsinh" />
                </div>
                <div class="col">
                    <HocSinhLopHoc
                    :hocsinh="hocsinh" />
                </div>
                <div class="col">
                    <HocSinhCamera
                    :hocsinh="hocsinh"
                    ></HocSinhCamera>
                </div>
                <div class="col">
                    <HocSinhAn545
                    :hocsinh="hocsinh"
                    ></HocSinhAn545>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-4">
                    <HocPhi :id="hocsinh.id"></HocPhi>
                    <DateAccess
                        :hocsinh="hocsinh"
                    ></DateAccess>
                </div>
                <div class="col-8">
                    <div class="row">
                        <div class="col-4">
                            <HocSinhSName
                            :hocsinh="hocsinh"
                            ></HocSinhSName>
                            <div class="row">
                                <div class="col">
                                    <ShowDiemDanh
                                        :hocsinh="hocsinh"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-8">
                            <Note
                                :hocsinh="hocsinh"
                            >

                            </Note>
                        </div>
                    </div>
                </div>
            </div>
            <div class="">

            </div>
        </div>
    </div>
</template>
<script>
import EditName from '~/components/HocSinh/EditName.vue';
import Note from '~/components/HocSinh/Note.vue';
import DateAccess from '~/components/HocSinh/DateAccess.vue';
import ShowDiemDanh from '~/components/HocSinh/ShowDiemDanh.vue';
export default {
    components: {
        EditName, Note, DateAccess,
        ShowDiemDanh
    },
    data(){
        return {

        }
    },
    methods: {

    },
    computed: {

    },
    created(){
        
    },
    props: ['hocsinh']
}
</script>