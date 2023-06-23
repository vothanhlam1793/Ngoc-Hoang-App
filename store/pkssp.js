import gql from 'graphql-tag'
export const state = () => ({
    itemKetSoById: {},
    monitor: 0
});


export const mutations = {
    updatePhieuKetSo(state, data) {
        state.itemKetSoById[data.id] = data;
        state.monitor += 1;
    }
}

export const actions = {
    getPhieuKetSo({ commit, state }, idItemKetSo) {
        if(state.itemKetSoById[idItemKetSo] == undefined){
            commit("updatePhieuKetSo", {
                id: idItemKetSo,
                phieuketso: {
                    code: ""
                },
                hocsinh: {
                    name: ""
                }
            });
            var client = this.app.apolloProvider.defaultClient;
            client.query({
                query: gql`
                query {
                    ItemKetSo(where: {id: "${idItemKetSo}"}){
                      id data code lophoc {name} hocsinh {
                        name status parent {debt}
                      } total createdAt phieuketso {code}
                    }
                }
                      `
            }).then(data => {
                // console.log("LOAD - item ket so: ", data);
                commit("updatePhieuKetSo", data.data.ItemKetSo);
            })
        } else {
            return;
        }
    }
}