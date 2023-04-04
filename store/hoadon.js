import gql from 'graphql-tag'

function findIndexSanPhamOfArray(array, data){
    var index = -1;
    array.forEach(function(item, i){
        if(item.sanpham.id == data.id){
            index = i;
        }
    });
    return index;
}
export const state = () => ({
    createState: "IDLE",
    sanPhamChoice: [],
    hoaDonCreated: {}
})

export const mutations = {
    updateStateCreate(state, data){
        state.stateCreate = data;
    },
    addSanPhamChoice(state, data){
        console.log(state, data);
        var index = findIndexSanPhamOfArray(state.sanPhamChoice, data);
        if(index > -1){

        } else {
            state.sanPhamChoice.push({
                sanpham: data,
                amount: 1
            });
        }
    },
    removeSanPhamChoice(state, data){
        var index = findIndexSanPhamOfArray(state.sanPhamChoice, data);
        state.sanPhamChoice.splice(index, 1);
    },
    updateDataPreCreateHoaDon(state, data){
        state.sanPhamChoice.forEach(function(item){
            item.amount = data.items[item.sanpham.id];
            item.price = data.prices[item.sanpham.id];
        });
    },
    updateHoaDonCreated(state, data){
        state.hoaDonCreated = data;
        console.log(state);
    }
}

function obj(item){
    return `
    {data: {
        price: ${item.price},
        amount: ${item.amount},
        total: ${item.price*item.amount},
        sanpham: {
            connect: {
                id: "${item.sanpham.id}"
            }
        }
    }}
    `
}
function createStringItems(data){
    var str = `mutation{
        createItems(data: [
        `;   
    data.forEach(function(item){
        str += obj(item);
    });
    str += `]){
        sanpham {
          id
        }
        price
        amount
        total
        id
      }
    }`
    return str;
}

function connectItemHoaDon(idItem){
    return `
    {id: "${idItem}"}
    `
}
function createStringHoaDon(items){
    var str = `
    mutation {
        createHoaDon (data: {
            items: {
            connect: [`
    items.forEach(function(item, index){
        if(index != 0){
            str += ",";
        }
        str += connectItemHoaDon(item.id);
    });
    str += `]
}
total: 0
}){
  id
}
}
`
    return str;
}

export const actions = {
    create({commit, state}){
        var str = createStringItems(state.sanPhamChoice);
        console.log(str);
        var client = this.app.apolloProvider.defaultClient;
        client.mutate({
            mutation: gql(str),
        }).then(data => {
            console.log(data);
            var str1 = createStringHoaDon(data.data.createItems);
            console.log(str1);
            client.mutate({
                mutation: gql(str1)
            }).then(data1 => {
                console.log(data1);
                commit("updateHoaDonCreated", data1.createHoaDon);
            })
        }).catch(err => {
            console.log(err);
        })
    }
}