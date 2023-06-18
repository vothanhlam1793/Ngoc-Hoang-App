import gql from 'graphql-tag'
export const state = () => ({
    code: "",
    idLopHoc: "",

    phieuketso: {},

    full: 0,
    half: 0,

    stateEdit: "IDLE"
});

export const mutations = {
    updateCode(state, data){
        state.code = data;
    },
    updateIdLopHoc(state, data){
        state.idLopHoc = data;
    },
    updatePhieuKetSo(state, data){
        state.phieuketso = data;
    },
    updateHocPhiItem(state, data){
        state.phieuketso.items.forEach(function(item){
            if(item.id == data.item.id){
                item.hocphi = data.hocphi;
            }
        })
        this.commit("pks/updateTotal", data);
    },
    updateFull(state, data){
        state.full = data;
    },
    updateHalf(state, data){
        state.half = data;
    },
    updateCSVC(state, data){
        state.phieuketso.items.forEach(function(item){
            if(item.id == data.item.id){
                item.csvc = data.csvc;
            }
        });
        this.commit("pks/updateTotal", data);
    },
    updateCamera(state, data){
        state.phieuketso.items.forEach(function(item){
            if(item.id == data.item.id){
                item.camera = data.camera;
            }
        });
        this.commit("pks/updateTotal", data);
    },
    checkStateEdit(state, data){

    },
    updateHoaDon(state, data){
        state.phieuketso.items.forEach(function(item){
            if(item.id == data.item.id){
                item.totalHoaDon = data.total;
                item.hoadons = data.hoadons;

            }
        });
        this.commit("pks/updateTotal", data);
    },
    updateVeTre(state, data){
        state.phieuketso.items.forEach(function(item){
            if(item.id == data.item.id){
                item.ngoaigio = data.total;
            }
        });
        this.commit("pks/updateTotal", data);
    },
    updateAnChieu(state, data){
        state.phieuketso.items.forEach(function(item){
            if(item.id == data.item.id){
                item.an545 = data.total;
            }
        });
        this.commit("pks/updateTotal", data);
    },
    updateNghiLienTiep(state, data){
        state.phieuketso.items.forEach(function(item){
            if(item.id == data.item.id){
                item.thanhtiennghi = data.total;
                item.ngaynghi = data.ngaynghi;
            }
        });
        this.commit("pks/updateTotal", data);
    },
    updateKhac(state, data){
        state.phieuketso.items.forEach(function(item){
            if(item.id == data.item.id){
                item.khac = data.total;
            }
        });
        this.commit("pks/updateTotal", data);
    },
    updateDienGiai(state, data){
        state.phieuketso.items.forEach(function(item){
            if(item.id == data.item.id){
                item.note = data.note;
            }
        });
    },
    updateTotal(state, data){
        state.phieuketso.items.forEach(function(item){
            if(item.id == data.item.id){
                item.total = 
                (item.hocphi | 0)
                + (parseInt(item.csvc) | 0)
                + (item.camera | 0) 
                + (item.totalHoaDon | 0)
                + (item.ngoaigio | 0)
                + (item.an545 | 0)
                + (item.khac | 0)
                - (item.thanhtiennghi | 0);
            }
        });
        state.stateEdit = "EDIT";
    },
};
let infoPhieuKetSo = `
id
data
code
lophoc {
id
name
}
hocsinh {
    id
    name
    namhocphi
    hocphigiam
    luuy
    status
    parent {
        id
        phone {
            number
            id
            name
        }
        hocsinhs {
            id
            name
            lophoc {
                id
                name
            }
        }
    }
}
total
`

async function updateItem(client, idItem, data, status){
    var ret = await client.mutate({
        mutation: gql`
        mutation {
            updateItemKetSo(
              id: "${idItem}",
              data: {
                data: "${JSON.stringify(data).split('"').join('\\"')}",
              }
            ){
              ${infoPhieuKetSo}
            }
          }
        `
    });
    if(ret.errors){
        console.log(ret);
    } else {
        return ret.data.updateItemKetSo;
    }
}
export const actions = {
    // Get PKS lan 1
    createOrUpdatePhieuKetSo({commit, state}){
        var client = this.app.apolloProvider.defaultClient;
        client.mutate({
            mutation: gql`
            mutation {
                createOrUpdatePhieuKetSo(code: "${state.code}", idLopHoc: "${state.idLopHoc}"){
                    message
                    content
                    data {
                        id
                        status
                        createdAt
                        items {
                            ${infoPhieuKetSo}
                        }
                    }
                }
            }
            `
        }).then(data => {
            console.log(data);
            if(data.data.createOrUpdatePhieuKetSo.message == "SUCCESS"){
                data.data.createOrUpdatePhieuKetSo.data.items.forEach(function(item){
                    try {
                        item.data = JSON.parse(item.data);
                    } catch (e) {
                        item.data = {};
                    }
                });
                commit("updatePhieuKetSo", data.data.createOrUpdatePhieuKetSo.data)
            } else {
                console.log(data.data.createOrUpdatePhieuKetSo.message, data.data.createOrUpdatePhieuKetSo.content);    
            }
        }).then(err => {
            console.log(err);
        })
    },
    async updatePhieuKetSo({commit, state}){
        // Update Item la xong
        var client = this.app.apolloProvider.defaultClient;
        for(var j = 0; j < state.phieuketso.items.length; j++){
            let item = state.phieuketso.items[j];
            var data = await updateItem(client, item.id, {
                total: item.total,
                hocphi: item.hocphi,
                csvc: item.csvc | 0,
                camera: item.camera,
                totalHoaDon: item.totalHoaDon,
                ngoaigio: item.ngoaigio,
                an545: item.an545,
                khac: item.khac | 0,
                ngaynghi: item.ngaynghi,
                thanhtiennghi: item.thanhtiennghi,
                note: item.note,
                hoadons: item.hoadons,
                state: "SAVED"
            }, "SAVED");
            console.log(j, data)
        }
        await client.mutate({
            mutation: gql`
            mutation {
                updatePhieuKetSo (
                    id: "${state.phieuketso.id}",
                    data: {
                        status: "SAVED"
                    }
                ){
                    id
                }
            }
            `
        });
        location.href += "/view";
    },
    getCSVC({commit, state}){
        var client = this.app.apolloProvider.defaultClient;
        client.query({
            query: gql`
            query {
                allVariables (where: {
                    OR: [
                    {
                        key_contains: "CSVC_FULL"
                    },
                    {
                        key_contains: "CSVC_HALF"
                    }
                    ]
                }){
                    id
                    key
                    value
                }
            }
            `
        }).then(data => {
            data.data.allVariables.forEach(function(variable){
                if(variable.key == "CSVC_FULL"){
                    commit("updateFull", variable.value);
                } else if (variable.key == "CSVC_HALF"){
                    commit("updateHalf", variable.value);
                }
            });

        }).catch (err => {
            console.log(err);
        });
    }
};