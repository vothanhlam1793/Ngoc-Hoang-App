import gql from 'graphql-tag'

export const state = () => ({
    inpDate: "",
    hocsinhs: []
});

export const mutations = {
    updateInpDate(state, data){
        state.inpDate = data;
    },
    updateHocSinh(state, data){
        state.hocsinhs = data;
    }
}

export const actions = {
    updateInpDate({commit}, data){
        commit('updateInpDate', data);
    }
}