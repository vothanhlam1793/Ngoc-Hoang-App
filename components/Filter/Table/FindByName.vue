<template>
    <div class="row">
        <div class="col">
            <input 
                class="form-control"
                v-model="findByName"
                placeholder="Nhập tên học sinh"
                @keyup="$store.commit('filter/list/updateFindByName', findByName)"
            />
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            findByName: ""
        }
    }
}
</script>