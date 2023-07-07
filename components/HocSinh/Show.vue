<template>
    <div class="row">
        <div class="col">
            <h1>{{ hocsinh.name }}</h1>
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
                <div class="col">
                    <HocPhi :id="hocsinh.id"></HocPhi>
                </div>
                <div class="col">
                    <HocSinhSName
                    :hocsinh="hocsinh"
                    ></HocSinhSName>
                </div>
            </div>
            <div class="">

            </div>
        </div>
    </div>
</template>
<script>
export default {
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