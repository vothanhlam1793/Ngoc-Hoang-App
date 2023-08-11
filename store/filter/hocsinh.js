import gql from 'graphql-tag'
export const state = () => ({
    hocsinhs: [],
    filterHocsinhs: [],

    lophocs: [],
    choseAll: false,
    
    monitor: 0,

    status: ['DANG_HOC','TAM_NGHI','DANG_KY','NGHI_LUON'],
    // loadingHocSinh: false
});

export const mutations = {
    updateHocsinhs(state, data) {
        state.hocsinhs = data;
        state.filterHocsinhs = data;
        state.hocsinhs.forEach(function(hocsinh){
            if(state.status.indexOf(hocsinh.status) >= 0){

            } else {
                state.status.push(hocsinh.status);
            }
        });
        console.log(state.status);
        this.commit("filter/hocsinh/updateFilterEle1All", true);
    },
    filterHS(state){   
        // chon ra nhung lop hoc duoc filter
        var lophocs = state.lophocs.filter(function(lophoc){
            return lophoc.chose == true;
        });
        state.filterHocsinhs = state.hocsinhs.filter(function(hocsinh){
            var hasChose;
            if(hocsinh.lophoc){
                hasChose = lophocs.some(lophoc => lophoc.id == hocsinh.lophoc.id);
            } else {
                hasChose = false;
            }
            return hasChose;
        });
        state.filterHocsinhs = state.filterHocsinhs.filter(function(hocsinh){
            return state.status.indexOf(hocsinh.status) >= 0;
        })
    },
    updateLopHocs(state, data){
        state.lophocs = data;

    },
    updateFilterEle2(state, data){
        state.status = data;
        this.commit("filter/hocsinh/filterHS");
    },
    updateFilterEle1(state, data){
        if((state.choseAll == true) && (state.choseAll != data.chose)){
            // state.lophocs.forEach(function(lophoc){
            //     lophoc.chose = false;
            // });
            state.choseAll = false;
        }
        state.lophocs.forEach(function(lophoc){
            if(lophoc.id == data.lophoc.id){
                lophoc.chose = data.chose;
            }
        });
        this.commit("filter/hocsinh/filterHS");
    },
    updateFilterEle1All(state, data){
        state.lophocs.forEach(function(lophoc){
            lophoc.chose = data;
        });
        state.choseAll = data;
        state.monitor += 1;
        this.commit("filter/hocsinh/filterHS");
    }
};


const GET_HOCSINH = gql`
query {
	allStudents {
        id
        name
        status
        parent {
            id
            name
            phone {
                number
            }
            debt
            code
            hocsinhs {
                name
                lophoc {
                    id
                    name
                    chunhiem {
                        name
                    }
                }
            }
        }
        lophoc { 
            id name 
            chunhiem { name } 
        } 
        hocphi hocphigiam namhocphi luuy
    }
}
`

export const actions = {
    async getAllHocsinhs({ commit }) {
        console.log("Hocsinh");
        var client = this.app.apolloProvider.defaultClient;
        var data = await client.query({
            query: GET_HOCSINH
        });
        // console.log(data.data.allStudents);
        commit('updateHocsinhs', data.data.allStudents);
    },
    async getAllLopHoc({commit}){
        var client = this.app.apolloProvider.defaultClient;
        client.query({
            query: gql`
            query {
              allLopHocs {
                id
                name
                chunhiem {
                  id
                  name
                }
                hocsinhs {
                  id
                }
              }
            }
            `
        }).then(data => {
            commit("updateLopHocs", data.data.allLopHocs);
        }).catch(err => {
          console.log(err);
        })
    }
};
