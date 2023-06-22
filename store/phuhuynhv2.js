import gql from 'graphql-tag'
export const state = () => ({
  phuhuynhs: [],
  phuhuynh: {},
  phieuthus: [],
  items: [],
  phuhuynhById: {},

  stateSearchPhuHuynhWithPhone: "IDLE",
  resultSearchPhuHuynhWithPhone: {
    message: "NONE",
    data: {}
  },
  monitor: 0
})

export const mutations = {
  update_data(state, data) {
    // console.log(data);
    state.phuhuynhs = data.data.allParents;
  },
  updatePhuHuynh(state, data) {
    state.phuhuynhById[data.id] = data.data;
    // state.phuhuynh = data;
    state.monitor += 1;
  },
  updateItems(state, data) {
    state.items = data;
  },
  updatePhieuThus(state, data) {
    state.phieuthus = data;
  },
  updateStateSearchPhuHuynhWithPhone(state, data) {
    state.stateSearchPhuHuynhWithPhone = data;
  },
  updateResultSearchPhuHuynhWithPhone(state, data) {
    state.resultSearchPhuHuynhWithPhone = data;
  }
}

const GET_PHUHUYNH = gql`
query {
    allParents {
      name
      phone {
        number
      }
      hocsinhs {
        name
        status
        id
        hocphi
        luuy
      }
      code
      id
      debt
    }
}
`
const CREATE_PHONE = gql`
    mutation createPhone($phone: String){
        createPhone(data: {number: $phone}){
            number
            id
        }
    }
`

const FILTER_PHONE = gql`
    query filterPhone($phone: String){
        allPhones (where: { number: $phone}){
           id
           number
        }
    }
`

const CREATE_PHUHUYNH = gql`
mutation createPhuHuynh($name: String, $idPhone: ID!){
	createParent(data: {
        name: $name,
        phone: {
            connect: {
                id: $idPhone
            }
        }
    }) {
        id
        name
    }
}
`


export const actions = {
  async getPhuHuynh({ commit }, id) {
    commit("updatePhuHuynh", {
      id: id,
      data: {
        name: ""
      }
    })
    var client = this.app.apolloProvider.defaultClient;
    var data = await client.query({
      query: gql`
            query {
                Parent(where: {id: "${id}"}){
                  name
                    phone {
                      number
                    }
                    hocsinhs {
                      name
                      status
                      id
                      hocphi
                      luuy
                      lophoc {
                        id
                        name
                      }
                    }
                    code
                    id
                    debt
                }
              }
            `
    }).then(data => {
      // console.log(data);
      commit("updatePhuHuynh", {
        id: id,
        data: data.data.Parent
      });
    }).catch(err => {
      console.log(err);
    })
  },
  async get_data({ commit }) {
    var client = this.app.apolloProvider.defaultClient;
    var data = await client.query({
      query: GET_PHUHUYNH
    });
    // console.log(data);
    commit('update_data', data);
  },
  async create({ commit }, data) {
    return new Promise((resolve, reject) => {
      var client = this.app.apolloProvider.defaultClient;
      client.mutate({
        mutation: CREATE_PHONE,
        variables: {
          "phone": data.phone
        }
      }).then((phone) => {
        var idPhone = phone.data.createPhone.id;
        // Tao moi thanh cong
        client.mutate({
          mutation: CREATE_PHUHUYNH,
          variables: {
            name: data.name,
            idPhone: idPhone
          }
        }).then((phuhuynh) => {
          resolve(phuhuynh);
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    });
  },
  /* Get
      - Item PKS => Hoc Sinh
      - Phieu Thu => Phu Huynh
      - HoaDon
  */
  async getDebt({ commit }, phuhuynh) {
    // Get Phieu ket so
    var client = this.app.apolloProvider.defaultClient;
    var hsa = "[";
    // Item PKS
    phuhuynh.hocsinhs.forEach(function (e, i) {
      if (i != 0) {
        hsa += ","
      }
      hsa += `{hocsinh: {id: "${e.id}"}}`
    })
    hsa += "]";
    var str = `query {
            allItemKetSos (where: 
              {
                    OR: ${hsa} 
              }
            ) {
              id
              hocsinh {
                id
              }
              total
              createdAt
              phieuketso {
                id
              }
            }
        }`
    client.query({
      query: gql(str)
    }).then(data => {
      commit("updateItems", data.data.allItemKetSos);

    });

    // Get Phieu thu
    client.query({
      query: gql`
            query {
                allPhieuThus (where: {
                  parent: {
                    id: "${phuhuynh.id}"
                  }
                }){
                  code
                  total
                  parent {
                    id
                    name
                    hocsinhs {
                      id
                    }
                  }
                  createdAt
                  ghichu
                }
              }
            `
    }).then(data => {
      console.log(data);
      commit("updatePhieuThus", data.data.allPhieuThus);
    })


  },

  async searchPhuHuynhWithPhone({ commit }, phone) {
    commit("updateStateSearchPhuHuynhWithPhone", "SEARCHING");
    // updateResultSearchPhuHuynhWithPhone
    var client = this.app.apolloProvider.defaultClient;
    client.query({
      query: gql`
            query {
                searchParentWithPhone(phone: "${phone}"){
                  message
                  data {
                    id
                    name
                    phone {
                      id
                      number
                      name
                    }
                    status
                    hocsinhs {
                      id
                      name
                      lophoc {
                        name
                        id
                      }
                    }
                  }
                }
              }
            `
    }).then(data => {
      commit("updateStateSearchPhuHuynhWithPhone", "DONE");
      commit("updateResultSearchPhuHuynhWithPhone", data.data.searchParentWithPhone);
    })

  },
  async searchPhuHuynhWithNameHocSinh({ commit }, phone) {
    commit("updateStateSearchPhuHuynhWithPhone", "SEARCHING");
    // updateResultSearchPhuHuynhWithPhone
    var client = this.app.apolloProvider.defaultClient;
    client.query({
      query: gql`
            query {
                searchParentWithNameHocSinh(name: "${phone}"){
                  message
                  data {
                    id
                    name
                    phone {
                      id
                      number
                      name
                    }
                    status
                    hocsinhs {
                      id
                      name
                      lophoc {
                        name
                        id
                      }
                    }
                  }
                }
              }
            `
    }).then(data => {
      // console.log(data);
      commit("updateStateSearchPhuHuynhWithPhone", "DONE");
      commit("updateResultSearchPhuHuynhWithPhone", data.data.searchParentWithNameHocSinh);
    }).catch(err => {
      // console.log(err);
    })

  }
}