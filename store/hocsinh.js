import gql from 'graphql-tag'
export const state = () => ({
    hocsinhs: [],
    total: 0,
    page: 1,
    pageSize: 50
})

export const mutations = {
    update_data(state, data){
        state.hocsinhs = data.data.allStudents;
        state.total = data.data._allStudentsMeta.count;
    },
    updatePage(state, page){
        state.page = page;
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
query getStudents($first: Int, $skip: Int) {
	allStudents(first: $first, skip: $skip) {
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
      name
    }
  }
	_allStudentsMeta {
	  count
	}
}
`

export const actions = {
    async get_data({commit, state}, page = 1){
        const safePage = Math.max(1, page);
        var client = this.app.apolloProvider.defaultClient;
        var data = await client.query({
            query: GET_HOCSINH,
            variables: {
                first: state.pageSize,
                skip: (safePage - 1) * state.pageSize
            },
            fetchPolicy: 'network-only'
        });
        commit('updatePage', safePage);
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
