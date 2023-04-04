import gql from 'graphql-tag'
export const state = () => ({
    state: 'START',
    stateSearchPhone: 'NO_FOUND',
    phoneFinded: {},
    parent: {}
})

const FILTER_PHONE = gql`
    query filterPhone($phone: String){
        allPhones (where: { number: $phone}){
           id
           number
           parent {
            id
            name
            phone {
                number
            }
           }
        }
    }
`

const CREATE_PHONE = gql`
    mutation createPhone($phone: String){
        createPhone(data: {number: $phone}){
            number
            id
        }
    }
`
const CREATE_PHUHUYNH = gql`
mutation createPhuHuynh($name: String, $idPhone: ID!){
	createParent(data: {
        name: $name,
        phone: {
            connect: {
                id: $idPhone
            }
        }
    }) {
        id
        name
        phone {
            number
        }
    }
}
`

export const mutations = {
    updateState(state, data){
        state.state = data;
    },
    updateStateSearchPhone(state, data){
        state.stateSearchPhone = data;
    },
    sync(state, data){
        console.log(state);
        state.parent = state.phoneFinded.parent;
        state.state = "DONE";
        state.stateSearchPhone = "DONE"
    },
    updatePhoneFinded(state, data){
        state.phoneFinded = data;
    },
    updatePhuHuynh(state, data){
        state.parent = data;
        state.state = "DONE";
    }
}

export const actions = {
    checkPhone({commit}, data){
        var client = this.app.apolloProvider.defaultClient;
        client.query({
            query: FILTER_PHONE,
            variables: {
                phone: data.phone
            }
        }).then(data => {
            console.log(data);
            if(data.data.allPhones.length > 0){
                commit('updateStateSearchPhone', 'FINDED_PHONE');
                commit('updatePhoneFinded', data.data.allPhones[0]);
            } else {
                commit('updateStateSearchPhone', 'NO_FINDED_PHONE');
            }
        }).catch (err => {
            reject(err);
        });
    },
    create({commit}, data){
        commit('updateState', "CREATING");
        commit('updateStateSearchPhone', "DONE");
        var client = this.app.apolloProvider.defaultClient;
            client.mutate({
                mutation: CREATE_PHONE,
                variables: {
                    "phone": data.phone
                }
            }).then((phone) => {
                var idPhone = phone.data.createPhone.id;
                // Tao moi thanh cong
                client.mutate({
                    mutation: CREATE_PHUHUYNH,
                    variables: {
                        name: data.name,
                        idPhone: idPhone
                    }
                }).then((phuhuynh)=>{
                    commit('updatePhuHuynh', phuhuynh.data.createParent)
                }).catch((err) => {
                    console.log(err);
                })
            });
                
    }
}