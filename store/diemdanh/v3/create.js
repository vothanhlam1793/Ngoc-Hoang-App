import gql from 'graphql-tag'
export const state = () => ({
    lophoc: {
        hocsinhs: []
    },
    user: {},
    date: "",
    type: "",
    monitor: 0,
});

export const mutations = {
    updateType(state, data) {
        state.type = data;
    },
    updateDate(state, data) {
        state.date = data;
    },
    updateLopHoc(state, data) {
        state.lophoc = data;
    },
    updateResultDiemDanh(state, data) {
        /*
            data {
                hocsinh: hocsinh,
                result
            }
        */
        state.lophoc.hocsinhs.forEach(function (hocsinh) {
            if (hocsinh.id == data.hocsinh.id) {
                hocsinh.result = data.result
            }
        });
        state.monitor += 1;
    }
};

export const actions = {
    getLophocById({ dispatch, commit, state }, idLopHoc) {
        state.lophoc.id = idLopHoc;
        var client = this.app.apolloProvider.defaultClient;
        return new Promise((resolve, reject) => {
            client.query({
                query: gql`
                      query { 
                          LopHoc(where: {id: "${idLopHoc}"}){
                              id
                              hocsinhs { id name status }
                              chunhiem { id name }
                              name
                          }
                      }
                      `
            }).then(data => {
                commit("updateLopHoc", data.data.LopHoc);
                resolve(data.data.LopHoc);
            }).catch(err => {
                console.log("NDD/ACTIONS/GETLOPCHOC: ", err);
                reject(err);
            });
        });
    },
    getUserById({ dispatch, commit, state }, idUser) {
        console.log("ACTIONS - getUserById");
        state.user.id = idUser;
        return new Promise((resolve, reject) => {

        })
    },
    createDiemDanh({ commit, state }) {
        var client = this.app.apolloProvider.defaultClient;
        
        var co = state.lophoc.hocsinhs.filter(function (hocsinh) {
            return hocsinh.result == "1";
        }).map(function (hocsinh) {
            return {
                id: hocsinh.id
            }
        });

        var khong = state.lophoc.hocsinhs.filter(function (hocsinh) {
            return (hocsinh.result == "0") || (hocsinh.result == undefined)
        }).map(function (hocsinh) {
            return {
                id: hocsinh.id
            }
        });


        // Tao phieu moi
        client.mutate({
            mutation: gql`
              mutation {
                  createCDiemDanh (
                    idLopHoc: "${state.lophoc.id}", 
                    idGiaoVien: "${state.user.id}", 
                    co: "${JSON.stringify(co).split('"').join('\\"')}", 
                    khong: "${JSON.stringify(khong).split('"').join('\\"')}", 
                    code: "${state.date}", 
                    type: "${state.type}"){
                    message
                    content
                    giaovien { id name }
                    lophoc { id name }
                    data { id co { id name } khong { id name } type code }
                  }
              }
            `
        }).then(data => {
            console.log("UPDATE");
        }).catch(err => {
            console.log(err);
        })
    }
};
