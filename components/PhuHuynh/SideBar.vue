<template>
    <div class="p-2">
        <ul class="list-group">
            <li class="list-group-item">
                <a
                    :href="`/phuhuynh/${$route.params.id}`"
                >
                Tổng quát
                </a>
            </li>
            <li class="list-group-item">
                <a
                    :href="`/phuhuynh/congno/${$route.params.id}`"
                >
                Công nợ
                </a>
            </li>
        </ul> 
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    mounted(){
        console.log(this.$route.params);
    }
}
</script>