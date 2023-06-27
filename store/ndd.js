import gql from 'graphql-tag'
export const state = () => ({
  type: "",
  lophoc: {},
  code: "",
  phieudiemdanh: {},
  idLopHoc: "",
  monitor: 0,
  idGiaoVien: "",
  dangkyan: [],
  edit: "create",
  stateLopHoc: "NULL",
  
  stateButtonEdit: false,

  phieudiemdanhs: []
});

export const mutations = {
  updateStateButtonEdit(state, data) {
    state.stateButtonEdit = data;
  },
  updateStateEdit(state, data) {
    state.edit = data;
  },
  updateType(state, data) {
    state.type = data;
  },
  updateLopHoc(state, data) {
    state.lophoc = data;
  },
  updateCode(state, code) {
    state.code = code;
  },
  updateIdLopHoc(state, idLH) {
    state.idLopHoc = idLH;
    state.monitor += 1;
  },
  updatePhieuDiemDanh(state, data) {
    if (data == undefined) {
      return;
    }
    state.phieudiemdanh = data;
    state.monitor += 1;
  },
  updatePhieuDiemDanhThang(state, data) {
    state.phieudiemdanhs = data;
  },
  updateDangKyAn(state, data) {
    state.dangkyan = data;
    state.monitor += 1;
  },
  updateStateLopHoc(state, data) {
    state.stateLopHoc = data;
  },
  updateDiemDanhHocSinh(state, data) {
    state.lophoc.hocsinhs.forEach(function (hocsinh) {
      if (hocsinh.id == data.hocsinh.id) {
        hocsinh.result = data.result;
      }
    });
    state.monitor += 1;
  },
  updateIdGiaoVien(state, data) {
    state.idGiaoVien = data;
  },
  mergePhieuDiemDanhToLopHoc(state) {
    if (state.phieudiemdanh.id == undefined) {
      console.log("Khong co phieu diem")
    }
    state.lophoc.hocsinhs.forEach(function (hocsinh) {
      hocsinh.result = undefined;
    });
    state.lophoc.hocsinhs.forEach(function (hocsinh) {
      state.phieudiemdanh.co.forEach(function (hs) {
        if (hs.id == hocsinh.id) {
          hocsinh.result = "1";
        }
      })
      if (hocsinh.result) {

      } else {
        hocsinh.result = "0";
      }
    });
    state.monitor += 1;
  },
  mergeDangKiAnToLopHoc(state) {
    state.lophoc.hocsinhs.forEach(function (hocsinh) {
      hocsinh.result = undefined;
    });
    state.dangkyan.forEach(function (variable) {
      state.lophoc.hocsinhs.forEach(function (hocsinh) {
        if (hocsinh.id == variable.idItem) {
          hocsinh.result = "1"
        }
      });
    });
    state.lophoc.hocsinhs.forEach(function (hocsinh) {
      if (hocsinh.result == undefined) {
        hocsinh.result = "0";
      }
    });
    state.monitor += 1;
  },
  mergeDiHocToLopHoc(state) {
    state.lophoc.hocsinhs.forEach(function (hocsinh) {
      switch (hocsinh.status) {
        case "DANG_KY": {
          hocsinh.result = "0";
        } break;
        case "DANG_HOC": {
          hocsinh.result = "1";
        } break;
        case "TAM_NGHI": {
          hocsinh.result = "0";
        } break;
        case "NGHI_LUON": {
          hocsinh.result = "0";
        } break;
        default: {
          hocsinh.result = "0";
        }
      }
      return;
    });
    // console.log(state);
    state.monitor += 1;
  },
  merVeTreToLopHoc(state) {
    state.lophoc.hocsinhs.forEach(function (hocsinh) {
      hocsinh.result = "0";
    });
    state.monitor += 1;
  }
}

export const actions = {
  getDangKyAn({ dispatch, commit, state }) {
    var client = this.app.apolloProvider.defaultClient;
    var str = "";
    state.lophoc.hocsinhs.forEach(function (hocsinh, index) {
      if (index != 0) {
        str += ",";
      }
      str += `{
                key: "AN545",
                item: "Student",
                idItem: "${hocsinh.id}"
              }`
    });
    client.query({
      query: gql`
              query {
                allVariables(where: {
                  OR: [
                    ${str}
                  ]
                }){
                  id
                  key
                  value
                  item
                  idItem
                }
              }
              `
    }).then(data => {
      commit("updateDangKyAn", data.data.allVariables);
    }).catch(err => {
      console.log(err);
    })
  },
  getPhieuDiemDanh({ dispatch, commit, state }) {
    var client = this.app.apolloProvider.defaultClient;
    client.query({
      query: gql`
            query {
                allDiemDanhs(where: {
                  AND: [{
                    type: "${state.type}",
                    lophoc: {
                      id: "${state.idLopHoc}"
                    }, 
                    code: "${state.code}"
                  }]
                }){
                  id
                  co {
                    id
                    name
                  }
                  khong {
                    id
                    name
                  }
                  code
                  type
                  giaovien {
                    id
                    name
                  }
                }
            }
            `
    }).then(data => {
      commit("updatePhieuDiemDanh", data.data.allDiemDanhs[0]);
    }).catch(err => {
      console.log("NDD/ACTIONS/GETLOPCHOC-2: ", err);
    })
  },
  getLopHoc({ dispatch, commit, state }) {
    var client = this.app.apolloProvider.defaultClient;
    client.query({
      query: gql`
            query { 
                LopHoc(where: {id: "${state.idLopHoc}"}){
                    id
                    hocsinhs {
                      id
                      name
                      status
                      sName
                    }
                    chunhiem {
                      id
                      name
                    }
                    name
                }
            }
            `
    }).then(data => {
      // Cap nhat cai nay danh cho viec loc trang thai học sinh
      var lophoc = data.data.LopHoc;
      lophoc.hocsinhs = lophoc.hocsinhs.filter(function(hocsinh){
        return hocsinh.status != "NGHI_LUON";
      })
      commit("updateLopHoc", lophoc);
      commit("updateStateLopHoc", "READY");
    }).catch(err => {
      console.log("NDD/ACTIONS/GETLOPCHOC: ", err);
    });
  },
  async createPhieuDiemDanhV2({ commit, state, dispatch }) {
    var client = this.app.apolloProvider.defaultClient;
    var co = state.lophoc.hocsinhs.filter(function (hocsinh) {
      return hocsinh.result == "1";
    }).map(function (hocsinh) {
      return {
        id: hocsinh.id
      }
    });
    var khong = state.lophoc.hocsinhs.filter(function (hocsinh) {
      return hocsinh.result == "0"
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
                idLopHoc: "${state.idLopHoc}", 
                idGiaoVien: "${state.idGiaoVien}", 
                co: "${JSON.stringify(co).split('"').join('\\"')}", 
                khong: "${JSON.stringify(khong).split('"').join('\\"')}", 
                code: "${state.code}", 
                type: "${state.type}"){
                message
                content
                giaovien {
                  id
                  name
                }
                lophoc {
                  id
                  name
                }
                data {
                  id
                  co {
                    id
                    name
                  }
                  khong {
                    id
                    name
                  }
                  type
                  code
                }
              }
          }
          `
    }).then(data => {
      console.log(data);
    }).catch(err => {
      console.log(err);
    })
  },
  async createPhieuDiemDanh({ commit, state, dispatch }) {
    var client = this.app.apolloProvider.defaultClient;
    var co = state.lophoc.hocsinhs.filter(function (hocsinh) {
      return hocsinh.result == "1";
    }).map(function (hocsinh) {
      return {
        id: hocsinh.id
      }
    });
    var khong = state.lophoc.hocsinhs.filter(function (hocsinh) {
      return hocsinh.result == "0"
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
                  idLopHoc: "${state.idLopHoc}", 
                  idGiaoVien: "${state.idGiaoVien}", 
                  co: "${JSON.stringify(co).split('"').join('\\"')}", 
                  khong: "${JSON.stringify(khong).split('"').join('\\"')}", 
                  code: "${state.code}", 
                  type: "${state.type}"){
                  message
                  content
                  giaovien {
                    id
                    name
                  }
                  lophoc {
                    id
                    name
                  }
                  data {
                    id
                    co {
                      id
                      name
                    }
                    khong {
                      id
                      name
                    }
                    type
                    code
                  }
                }
            }
            `
    }).then(data => {
      if (state.edit == "create") {
        var a = location.href.split("/");
        a.splice(a.length - 1, 0, "edit");
        location.href = a.join("/");
      } else {
        location.reload();
      }
    }).catch(err => {
      console.log(err);
    })
  },
  getAllPhieuDiemDanhOnMonth({ dispatch, commit, state }, data) {
    var client = this.app.apolloProvider.defaultClient;
    client.query({
      query: gql`
        query {
          allDiemDanhs(where: {
              code_contains: "${data.year}_${data.month}",
              lophoc: {
                id: "${state.idLopHoc}"
              },
              type: "${state.type}"
          }){
                              id
                          co {
                            id
                            name
                          }
                          khong {
                            id
                            name
                          }
                          code
                          type
                          giaovien {
                            id
                            name
                          }
          }
        }
        `
    }).then(data => {
      commit("updatePhieuDiemDanhThang", data.data.allDiemDanhs);
    }).catch(err => {
      console.log(err);
    })
  }
}