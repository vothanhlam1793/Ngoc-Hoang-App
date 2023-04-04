import gql from 'graphql-tag'
// var client = this.app.apolloProvider.defaultClient;
export const state = () => ({
    sanphams: [],
    sanphamChoose: [],
    total: 0,

    hocsinhs: [],
    hocsinh: {},
    
    hoadon: {}
});

export const mutations = {
    updateHoaDon(state, data){
        state.hoadon = data;
    },
    updateSanPham(state, data){
        state.sanphams = data;
    },
    updateHocSinhSelect(state, data){
        state.hocsinh = data;
    },
    addSanPhamChoose(state, data){
        const hasElement = state.sanphamChoose.find(item => item.id == data.id);
        if (!hasElement) {
            data.amount = 1;
            state.sanphamChoose.push(data);
        }
        this.commit("hd/updateTotal");
    },
    removeSanPhamChoose(state, data){
        var index = state.sanphamChoose.findIndex(item => item.id == data.id);
        if(index != -1){
            state.sanphamChoose.splice(index, 1);
        }
        this.commit("hd/updateTotal");
    },
    updateElement(state, item){
        state.sanphamChoose.forEach(function(sanpham){
            if(sanpham.id == item.sanpham.id){
                sanpham.amount = item.amount;
                sanpham.price = item.price;
            }
        });
        this.commit("hd/updateTotal");
    },
    updateTotal(state){
        var total = 0;
        state.sanphamChoose.forEach(function(sanpham){
            total += sanpham.price*sanpham.amount;
        });
        state.total = total;
    },
    updateHocSinh(state, data){
        state.hocsinhs = data;
    }
};

export const actions = {
    getAllSanPham({commit, state}){
        var client = this.app.apolloProvider.defaultClient;
        client.query({
            query: gql`
            query {
                allSanPhams {
                    name
                    id
                    price
                    type
                    amount
                    code
                    note
                }
            }
            `
        }).then(data => {
            // console.log(data);
            commit("updateSanPham", data.data.allSanPhams);
        })
    },
    createHoaDon({commit, state}){
        var client = this.app.apolloProvider.defaultClient;
        var items = [];
        state.sanphamChoose.forEach(function(sanpham){
            console.log(sanpham);
            items.push({
                sanpham: sanpham,
                price: sanpham.price,
                amount: sanpham.amount,
                total: sanpham.price*sanpham.amount,
            });
        });
        // return;
        client.mutate({
            mutation: gql`
            mutation {
                createCHoaDon (
                    items: "${JSON.stringify(items).split('"').join('\\"')}",
                    idParent: "${state.hocsinh.parent.id}"
                ){
                message
                content
                  data {
                    id
                    items {
                      sanpham {
                        name
                        id
                      }
                      price
                      amount
                      total
                    }
                    total
                  }
                }
            }
            `
        }).then(data => {
            commit("updateHoaDon", data.data.createCHoaDon.data);
        }).catch(err => {
            console.log(err);
        })
    },
    getHocSinhs({commit, state}){
        var client = this.app.apolloProvider.defaultClient;
        client.query({
            query: gql`
            query {
                allStudents {
                id
                name
                lophoc {
                  id
                  name
                }
                parent {
                  id
                  name
                  debt
                  phone {
                    number
                    name
                    id
                  }
                }
              }
            }
            `
        }).then(data => {
            // console.log(data);
            commit("updateHocSinh", data.data.allStudents)
        }).catch (err => {
            console.log(err);
        });
    }
};