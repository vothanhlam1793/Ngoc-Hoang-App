import gql from 'graphql-tag'

export const state = () => ({
    createState: "IDLE",
})

export const mutations = {
    updateStateCreate(state, data){
        state.stateCreate = data;
    }
}

export const actions = {

}