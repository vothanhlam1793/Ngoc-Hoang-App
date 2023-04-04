import gql from 'graphql-tag'

export const state = () => ({
    searchPhieuKetSos: [],
    stateItem: [],
    monitor: 0,
    itemsCreated: {},

    //
    phieuketso: {},

    //
    items: {}, // Dùng cho element
    stateItems: {},

    //
    stateCSVC: "NONE"
})

export const mutations = {
    updateItemState(state, data){
        var check = false;
        state.stateItem.forEach(function(e){
            if(e.id == data.id){
                e.state = data.state;
                check = true;
            }
        })
        if(check == false){
            state.stateItem.push({
                id: data.id,
                state: data.state
            })
        }
        state.monitor += 1;
    },
    controlState(state, data){
        state.stateItem.forEach(function(e){
            e.state = data;
        })
        state.monitor += 1;
    },
    updateItemCreated(state, data){
        state.itemsCreated[data.id] = data.data;
    },
    updateSearchKetSo(state, data){
        state.searchPhieuKetSos = data;
    },
    updatePhieuKetSo(state, data){
      state.phieuketso = data;
    },
    updateItem(state, item){
      if(state.items[item.id]){
        for (const [key, value] of Object.entries(item)) {
          state.items[item.id][key] = item[key];
        }
      } else {
        state.items[item.id] = item;
      }
    },
    updateStateCSVC(state, st){
      state.stateCSVC = st;
    }
}

const CREATE_ITEM_KETSO = gql`
mutation ($data: String, $code: String, $idLopHoc: ID!, $idHocSinh: ID!, $dateISO: DateTime, $total: Int){ 
	createItemKetSo(data: {
    data: $data,
    code: $code,
    total: $total,
    lophoc: {
      connect: {
        id: $idLopHoc
      }
    }
    hocsinh: {
      connect: {
        id: $idHocSinh
      }
    }
    createdAt: $dateISO
  }){
    id
    data
    code
    lophoc {
      id
    }
    phieuketso {
      id
    }
  }
}
`

function connectList(array){
    var str = `[`;
    array.forEach(function(item, index){
      if(index != 0){
        str += ",";
      }
      str += `{
        id: "${item.id}"
      }`
    })
    str += "]";
    return str;
}

export const actions = {
    searchKetSo({commit, state}, data){
        var client = this.app.apolloProvider.defaultClient;
        return client.query({
            query: gql`
            query {
                allPhieuKetSos (where: {
                  code_contains: "${data.code}"
                }) {
                  id
                  code
                  lophoc {
                    id
                  }
                }
            }
            
            `
        }).then(data => {
            commit("updateSearchKetSo", data.data.allPhieuKetSos);
        })
    },
    createItem({commit, state}, data){
        commit("updateItemState", {
            id: data.hocsinh.id,
            state: "SAVING"
        })
        var client = this.app.apolloProvider.defaultClient;
        return client.mutate({
            mutation: CREATE_ITEM_KETSO,
            variables: {
                idLopHoc: data.idLopHoc,
                data: data.data,
                code: data.code,
                idHocSinh: data.hocsinh.id,
                dateISO: (new Date()).toISOString(),
                total: data.total
            }
        }).then(data1 => {
            commit("updateItemState", {
                id: data.hocsinh.id,
                state: "DONE"
            });
            commit("updateItemCreated", {
                data: data1.data.createItemKetSo,
                id: data.hocsinh.id
            });
        }).catch(err => {
            console.log(err);
        })
    },
    createKetSo({commit, state}, data){
        var client = this.app.apolloProvider.defaultClient;
        var items = [];
        console.log("CREATED: ", state.itemsCreated);
        for (const [key, value] of Object.entries(state.itemsCreated)) {
            items.push(value);
        }
        var str = connectList(items);
        var CREATE_KETSO = `
        mutation ($code: String, $idLopHoc: ID!){
            createPhieuKetSo (data: {
              status: "NORMAL",
              code: $code,
              lophoc: {
                connect: {
                  id: $idLopHoc
                }
              },
              items: {
                connect: 
                ${str}
              }
            }){
              items {
                id
              }
              code
              lophoc{
                id
              }
            }
          }
        `
        return client.mutate({
            mutation: gql(CREATE_KETSO),
            variables: {
                code: data.code,
                idLopHoc: data.idLopHoc
            }
        }).then(d1 => {
            // console.log(d1);
        });      
    },
    getPhieuKetSo({commit, state}, data){
      console.log("GETPKS", data);
      var client = this.app.apolloProvider.defaultClient;
      client.query({
        query: gql`
        query {
          allPhieuKetSos(where: {AND: [{
            code_contains: "${data.code}"
          },
          {
            lophoc: {
              id: "${data.idLopHoc}"
            }
          },
          {
            status: "NORMAL"
          }
          ]}){
            id
            items{
              id
              data
              code
            }
            status 
            code
            lophoc {
              id
              name
              chunhiem{
                id
                name
              }
            }
          }
        }
        `
      }).then(data => {
        console.log(data);
        if(data.data.allPhieuKetSos.length > 0){
          commit("updatePhieuKetSo", data.data.allPhieuKetSos[0])
        };
      }).catch(err => {
        console.log(err);
      })
    },
    updateDataItemKetSo({commit, state}, idItem){
      var client = this.app.apolloProvider.defaultClient;
      var data = {};
      state.items.forEach(function(item){
        if(item.id == idItem){
          data = item.data;
        }
      });
      client.mutate({
        mutation: gql`
        mutation {
          updateItemKetSo(id: "${idItem}", data: {
            data: "${JSON.stringify(item.data)}"
          }){
            id
          }
        }
        `
      }).then(data => {
        console.log(data);
      }).catch (err => {
        console.log(err);
      });
    }
}