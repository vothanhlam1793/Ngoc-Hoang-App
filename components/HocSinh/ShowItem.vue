<template>
    <div class="row" v-if="student">
        <div class="col-6">
            <a :href="'/hocsinh/' + student.id">{{student.name}}</a>
        </div>
        <div class="col-3">
            <p>{{student.status || "Chưa trạng thái"}}</p>
        </div>
        <div class="col-3">
            <p v-if="student.lophoc == null">Chưa phân lớp</p>
            <p v-else>{{ student.lophoc.name }}</p>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    props: ['student']
}
</script>