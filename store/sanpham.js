import gql from 'graphql-tag'

function chuyentiengviet(str) {
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export const state = () => ({
    sanphams: [],
    createState: "IDLE",
    sanphamCreated: {},
    searchNameSanPham: "",
    resultSearchSanPhams: [],
    stateChoose: "IDLE",
    sanPhamChoose: {},
})

export const mutations = {
    updateSanPham(state, data){
        state.sanphams = data;
    },
    updateCreateState(state, data){
        state.createState = data;
    },
    updateCreateSanPham(state, data){
        state.sanphamCreated = data;
    },
    updateStateChoose(state, data){
        state.stateChoose = data;
    },
    updateSanPhamChoose(state, data){
        state.sanPhamChoose = data;
    },
    searchSanPham(state, data){
        console.log(state, data);
        var changeSearchReg = chuyentiengviet(data).split(" ").join("[ -w]+");
        var reg = new RegExp(changeSearchReg, "i");
        state.resultSearchSanPhams = state.sanphams.filter(function(sanpham){
            var temp = [sanpham.name];
            return reg.test(chuyentiengviet(temp.join(" ")));
        });
    }   
}

const GET_SANPHAM = gql`
query {
    allSanPhams{
      id
      name
      price
      type
      amount
      code
    }
}
`

const CREATE_SANPHAM = gql`
mutation createSanPham($name: String, $price: Int){
    createSanPham(data: {
      name: $name,
      price: $price
    }){
      id
      name
      price
    }
}
`

export const actions = {
    getSanPham({commit, state}){
        var client = this.app.apolloProvider.defaultClient;
        client.query({
            query: GET_SANPHAM
        }).then(data => {
            commit("updateSanPham", data.data.allSanPhams);
        }).catch(err => {
            console.log(err);   
        })
    },
    createSanPham({commit}, data){
        commit("updateCreateState", "CREATING");
        var client = this.app.apolloProvider.defaultClient;
        client.mutate({
            mutation: CREATE_SANPHAM,
            variables: {
                name: data.name,
                price: parseInt(data.price)    
            }
        }).then(data => {
            commit("updateCreateSanPham", data.data.createSanPham);
            commit("updateCreateState", "DONE");
        }).catch(err => {
            console.log(err);
        })

    },
}