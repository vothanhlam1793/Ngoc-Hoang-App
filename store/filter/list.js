import gql from 'graphql-tag'
export const state = () => ({
    findByName: "",

    sortDebt: 0
});

export const mutations = {
    updateFindByName(state, data){
        state.findByName = data;
    },
    updateSortDebt(state, data){
        state.sortDebt = data;
    }
};

export const actions = {

};