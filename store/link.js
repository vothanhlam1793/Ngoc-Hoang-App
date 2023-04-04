import gql from 'graphql-tag'
export const state = () => ({
    back: ""
})

export const mutations = {
    updateBacklink(state, data){
        state.back = data;
    }
}

export const actions = {

}