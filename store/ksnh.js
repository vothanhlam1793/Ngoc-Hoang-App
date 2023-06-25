import gql from 'graphql-tag'
export const state = () => ({
    hocsinhs: [],
})

export const mutations = {
    updateHocSinh(state, hocsinh){
        var exists = state.hocsinhs.some(item => item.id === hocsinh.id);
        if(!exists){
            state.hocsinhs.push(hocsinh);
        }
    }
}

export const actions = {

}