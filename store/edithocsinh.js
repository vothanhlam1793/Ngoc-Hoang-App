import gql from 'graphql-tag'
export const state = () => ({
    state: 'DONE',
    hocsinh: {},
    idLophoc: ""
})

export const mutations = {
    updateHocsinh(state, data){
        state.hocsinh = data;
    },
    updateState(state, data){
        state.state = data;
    },
    updateStatus(state, data){
        state.hocsinh.status = data;
    },
    updateIdLophoc(state, data){
        state.idLophoc = data;
    },
    updateHocPhi(state, data){
        state.hocsinh.hocphi = data;
    },
    updateLuuY(state, data){
        state.hocsinh.luuy = JSON.stringify(data);
    }
}
const UPDATE_HOCSINH = gql `
mutation updateStudent($id: ID!, $status: String, $idLophoc: ID!, $luuy: String, $hocphi: String){
    updateStudent (id: $id, data: {
      status: $status,
      lophoc: {
        connect : {
          id: $idLophoc
        }
      }
      luuy: $luuy,
      hocphi: $hocphi,
    }){
      id
    }
}
`
export const actions = {
    saveChange({commit, state}){
        if(state.idLophoc == ""){
            commit('updateIdLophoc', state.hocsinh.lophoc.id);
        }
        var client = this.app.apolloProvider.defaultClient;
        client.mutate({
            mutation: UPDATE_HOCSINH,
            variables: {
                id: state.hocsinh.id,
                status: state.hocsinh.status,
                luuy: state.hocsinh.luuy,
                idLophoc: state.idLophoc,
                hocphi: state.hocsinh.hocphi,
            }
        }).then(data => {
            commit("updateState", "DONE")
        }).catch(err => {
            console.log(err);
        })
    }
}