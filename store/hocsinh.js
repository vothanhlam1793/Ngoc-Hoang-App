import gql from 'graphql-tag'
export const state = () => ({
    hocsinhs: []
})

export const mutations = {
    update_data(state, data){
        // console.log(data);
        state.hocsinhs = data.data.allStudents;
    },
    updateHocSinh(state, data){
      var index = -1;
      state.hocsinhs.forEach(function(hocsinh, inx){
        if(hocsinh.id == data.id){
          index = inx;
        }
      });
      if(index != -1){
        state.hocsinhs.push(data);
      } else {
        state[index] = data;
      }
    }
}

const GET_HOCSINH = gql`
query {
	allStudents {
    id
    name
    status
    parent {
      id
      name
      phone {
        number
      }
      code
      hocsinhs {
        name
        lophoc {
          name
          chunhiem {
            name
          }
        }
      }
    }
    lophoc {
      name
      chunhiem {
        name
      }
    }
    hocphi
    hocphigiam
    namhocphi
    luuy
  }
	
}
`

export const actions = {
    async get_data( {commit}){
        var client = this.app.apolloProvider.defaultClient;
        var data = await client.query({
            query: GET_HOCSINH
        });
        // console.log(data);
        commit('update_data', data);
    }, 
    async getHocSinh({commit, state}, idHocSinh){
      var temp = false;
      console.log("ERROR-1", idHocSinh);
      state.hocsinhs.forEach(function(hocsinh){
        if(hocsinh.id == idHocSinh){
          temp = true;
        }
      });
      console.log("ERROR-3", temp);
      if(temp == true){
        return;
      }
      console.log("ERROR-3", idHocSinh);
      var client = this.app.apolloProvider.defaultClient;
      client.query({
        query: gql`
        query {
          Student (where: { id: "${idHocSinh}"}){
            id
            name
            status
            parent {
              id
              name
              phone {
                number
              }
              code
              hocsinhs {
                name
                lophoc {
                  id
                  name
                  chunhiem {
                    name
                  }
                }
              }
            }
            lophoc {
              id
              name
              chunhiem {
                name
              }
            }
            hocphi
            hocphigiam
            namhocphi
            luuy
          }
        }
        `
      }).then(data => {
        console.log(data);
        commit("updateHocSinh", data.data.Student);
      }).catch(err => {
        console.log(err);
      })
    }
}