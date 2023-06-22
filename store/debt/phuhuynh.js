import gql from 'graphql-tag'
function chuyentiengviet(str) {
    if (str == undefined) {
        return "";
    }
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
export const state = () => ({
    phuhuynhs: [],
    phuhuynhsWithId: {},

    //
    filterPhuHuynhs: [],

    //
    findByNameStudent: "",
});

export const mutations = {
    updatePhuHuynh(state, data) {
        state.phuhuynhs = data;
        data.forEach(function (phuhuynh) {
            state.phuhuynhsWithId[phuhuynh.id] = phuhuynh;
        });
        this.commit("debt/phuhuynh/loadFilterPhuHuynh");
    },
    updateFindByName(state, data) {
        state.findByNameStudent = data;
        this.commit("debt/phuhuynh/loadFilterPhuHuynh");
    },
    loadFilterPhuHuynh(state) {
        // Filter by Name
        var changeSearchReg = chuyentiengviet(state.findByNameStudent).split(" ").join("[ -w]+");
        var reg = new RegExp(changeSearchReg, "i");
        state.filterPhuHuynhs = state.phuhuynhs.filter(function (phuhuynh) {
            var temp = [phuhuynh.name];
            return reg.test(chuyentiengviet(temp.join(" ")));
        });
        // state.filterPhuHuynhs = state.phuhuynhs;
    },
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

export const actions = {
    async getAllPhuHuynh({ commit }) {
        var client = this.app.apolloProvider.defaultClient;
        var data = await client.query({
            query: GET_PHUHUYNH
        });
        commit('updatePhuHuynh', data.data.allParents);
    },
}