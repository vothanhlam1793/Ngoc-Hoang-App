import gql from 'graphql-tag'
export const state = () => ({
    lophoc: {}, 
    lophocs: []
});
export const mutations = {
    updateLopHoc(state, data){
        state.lophoc = data;
    },
    updateLopHocs(state, data){
      state.lophocs = data;
    }
}

const GET_LOPHOC = gql`
query getLopHoc($id: ID!){
    LopHoc(where: {id: $id}){
      id
      name
      hocsinhs {
        id
        name
        status
        parent {
          id
          name
          phone {
            number
          }
        }
        lophoc {
          hocphi
          id
        }
        luuy
        hocphi
      }
      chunhiem{
        id
        name
      }
    }
  }
`
export const actions = {
    getLopHoc({commit}, id){
        var client = this.app.apolloProvider.defaultClient;
        client.query({
            query: GET_LOPHOC,
            variables: {
                id: id
            }
        }).then(data => {
            commit("updateLopHoc", data.data.LopHoc);
        })
    },
    getAllLopHoc({commit}){
      var client = this.app.apolloProvider.defaultClient;
        client.query({
            query: gql`
            query {
              allLopHocs {
                id
                name
                chunhiem {
                  id
                  name
                }
              }
            }
            `
        }).then(data => {
            commit("updateLopHocs", data.data.allLopHocs);
        }).catch(err => {
          console.log(err);
        })
    }
}