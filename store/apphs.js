import gql from 'graphql-tag'
export const state = () => ({
    step: 1,
    findPhone: {},
    lophocs: []
})

const FILTER_PHONE = gql`
    query filterPhone($phone: String){
        allPhones (where: { number: $phone}){
           id
           number
        }
    }
`

const GET_LOPHOC = gql`
query {
    allLopHocs {
      name
      id
      chunhiem {
        name
      }
    }
}
`
export const mutations = {
    update_filter_phone(state, data){
        state.findPhone = data;
    },
    updateStep(state, step){
        state.step = step;
    },
    update_lophoc(state, data){
        state.lophocs = data;
    }
}

export const actions = {
    async checkPhone({commit}, data){
        return new Promise((resolve, reject) => {
            var client = this.app.apolloProvider.defaultClient;
            client.query({
                query: FILTER_PHONE,
                variables: {
                    phone: data.phone
                }
            }).then(data => {
                if(data.data.allPhones.length > 0){
                    commit("update_filter_phone", data.data.allPhones[0]);
                    resolve(data.data.allPhones[0]);
                } else {
                    resolve({})
                }
            }).catch (err => {
                reject(err);
            });
        });
    },
    getLophoc({commit}){
        var client = this.app.apolloProvider.defaultClient;
            client.query({
                query: GET_LOPHOC
            }).then(data => {
                commit('update_lophoc', data.data.allLopHocs);
            }).catch (err => {
                console.log(err);
            });
    }
}