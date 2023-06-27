import gql from 'graphql-tag'
export const state = () => ({
    hocsinhs: [],
    items: {},
    success: false,
    results: {}
})

export const mutations = {
    updateHocSinh(state, hocsinh) {
        var exists = state.hocsinhs.some(item => item.id === hocsinh.id);
        if (!exists) {
            state.hocsinhs.push(hocsinh);
        }
    },
    updateItems(state, item) {
        state.items[item.hocsinh.id] = item;
    },
    updateCreateDone(state, data){
        var ret = true;
        state.results[data.id] = true;
        state.hocsinhs.forEach(function(hocsinh){
            if(state.results[hocsinh.id]){
                ret = true;
            } else {
                ret = false;
            }
        });
        state.success = ret;
    }
}
export const actions = {
    async createKetSo({ state, commit }) {
        var client = this.app.apolloProvider.defaultClient;
        client.mutate({
            mutation: gql`
            mutation{
                createPhieuKetSo (data: {
                    status: "NORMAL",
                  code: "KSNH",
                }){ id }}
            `
        }).then(data => {
            console.log("Tạo xong phiếu kết sổ: ", data.data.createPhieuKetSo.id);
            if (data.data.createPhieuKetSo.id) {
                console.log(data.data);
                var idPKS = data.data.createPhieuKetSo.id;
                // Tao phieu ket so
                state.hocsinhs.forEach(function (hocsinh) {
                    client.mutate({
                        mutation: gql`
                        mutation {
                            createItemKetSo(data: {
                              data: "{}", 
                              total: 0, 
                              hocsinh: {
                                connect: {
                                  id: "${hocsinh.id}"
                                }
                              },
                              phieuketso: {
                                connect: {
                                  id: "${idPKS}"
                                }
                              }
                            }){
                              id
                              hocsinh {
                                id
                              }
                            }
                        }
                        `
                    }).then(data1 => {
                        console.log(data1);
                        var item = data1.data.createItemKetSo;
                        console.log(item, data1.data);
                        if(item.id){
                            console.log(`
                            mutation {
                                updateItemKetSo(id: "${item.id}", data: {
                                    data: "${JSON.stringify({
                                        total: state.items[item.hocsinh.id].total,
                                        camera: state.items[item.hocsinh.id].camera,
                                        hocphithangcuoi: state.items[item.hocsinh.id].hocphithangcuoi,
                                        hocphidadong: state.items[item.hocsinh.id].hocphidadong,
                                        anchieu: state.items[item.hocsinh.id].anchieu,
                                        ngoaigio: state.items[item.hocsinh.id].ngoaigio,
                                        hoadons: []
                                    }).split('"').join('\\"')}",
                                    code: "KS_NGHI_LUON"
                                }){ id }
                            }
                            `);
                            // Cap nhat phieu ket so
                            // + this.item.data.csvc
                            // + this.item.data.camera
                            // + this.item.data.totalHoaDon
                            // + this.item.data.hocphi
                            // + this.item.data.ngoaigio
                            // + this.item.data.an545
                            // + this.item.data.khac;
                            client.mutate({
                                mutation: gql`
                                mutation {
                                    updateItemKetSo(id: "${item.id}", data: {
                                        data: "${JSON.stringify({
                                            total: state.items[item.hocsinh.id].total * (-1),
                                            camera: state.items[item.hocsinh.id].camera,
                                            hocphithangcuoi: state.items[item.hocsinh.id].hocphithangcuoi,
                                            hocphidadong: state.items[item.hocsinh.id].hocphidadong,
                                            anchieu: state.items[item.hocsinh.id].anchieu,
                                            ngoaigio: state.items[item.hocsinh.id].ngoaigio,
                                            hoadons: [],
                                        }).split('"').join('\\"')}",
                                        code: "KS_NGHI_LUON"
                                    }){ id  hocsinh {id}}
                                }
                                `
                            }).then(data2 => {
                                console.log(data2);
                                commit("updateCreateDone", data2.data.updateItemKetSo.hocsinh);
                            }).catch(err => {
                                console.log(err);
                            });
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                });
            }
        }).catch(err => {
            console.log(err);
        });
    },
}