import gql from 'graphql-tag'
export const state = () => ({
    hocsinhs: [],

    // pagn
    pageLength: -1,
    pageSize: 0,
    pageNow: 0,
    pageHocsinhs: [],

});

export const mutations = {
    updateHocsinhs(state, data){
        state.hocsinhs = data;
        this.commit("filter/result/loadPageHocsinh");
    },
    setPageLength(state, length){
        state.pageLength = length;
        state.pageSize = Math.round(state.hocsinhs.length/length);
        console.log("SET PAGE", state.pageSize, length);
        state.pageNow = 0;
        this.commit("filter/result/loadPageHocsinh");
    },
    jumpPage(state, data){
        if((state.pageSize >= data) && (0 <= data)){
            state.pageNow = data;
        }
        this.commit("loadPageHocsinh");
    },
    nextPage(state){
        if(state.pageNow < state.pageSize){
            state.pageNow += 1;
        } else {
            return;
        }
        if(state.pageNow*state.pageLength >= state.hocsinhs.length){
            state.pageNow -= 1;
        }
        console.log(state.pageNow, state.pageSize);
        this.commit("filter/result/loadPageHocsinh");
    },
    prevPage(state){
        if(state.pageNow <= 0){
            return;
        } else {
            state.pageNow -= 1;
        }
        this.commit("filter/result/loadPageHocsinh");
    },
    loadPageHocsinh(state){
        if(state.pageLength == -1){
            state.pageHocsinhs = state.hocsinhs;
            return;
        }
        state.pageHocsinhs = state.hocsinhs.slice(state.pageNow*state.pageLength, (state.pageLength*(state.pageNow+1)));
    }
};

export const actions = {

};
