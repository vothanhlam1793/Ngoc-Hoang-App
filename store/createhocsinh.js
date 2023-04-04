import gql from 'graphql-tag'
export const state = () => ({
    state: 'START',
    lophocs: [],
    hocsinh: {}, 
    phuhuynh: {}
})

const GET_LOPHOC = gql`
query {
    allLopHocs {
      name
      id
      chunhiem {
        name
      }
    }
}
`

const CREATE_HOCSINH = gql`
mutation createHocSinh($name: String, $idLophoc: ID!, $idParent: ID!){
    createStudent(data: {
          name: $name,
      parent: {
        connect: {
          id: $idParent
        }
      },
      lophoc: {
        connect: {
          id: $idLophoc
        }
      }
    }) {
      id
      name
    }
  }
`

export const mutations = {
    updateLophoc(state, data){
        state.lophocs = data;
    },
    updateState(state, data){
        state.state = data;
    },
    updateHocsinh(state, data){
        state.hocsinh = data;
    },
    updatePhuHuynh(state, data){
        state.phuhuynh = data;
    }
}
export const actions = {
    getLopHoc({commit}){
        var client = this.app.apolloProvider.defaultClient;
        client.query({
            query: GET_LOPHOC
        }).then(data => {
            commit("updateLophoc", data.data.allLopHocs);
        }).catch (err => {
            console.log(err);
        })
    },
    create({commit, state}, data){
        commit('updateState', "CREATING");
        var client = this.app.apolloProvider.defaultClient;    
        client.mutate({
            mutation: CREATE_HOCSINH,
            variables: {
                name: data.name,
                idLophoc: data.lophoc.id,
                idParent: state.phuhuynh.id
            }
        }).then(data => {
            commit('updateState', "DONE");
            commit('updateHocsinh', data.data.createStudent);
        }).catch(err => {
            console.log(err);
        })
    }
}