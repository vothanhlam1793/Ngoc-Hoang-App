import gql from 'graphql-tag'
export const state = () => ({
    hocphis: []
});
export const mutations = { 
    updateHocPhis(state, data){
        state.hocphis = data;
    }

}

export const actions = { 
    getInfoHocPhi({commit, state}){
        var client = this.app.apolloProvider.defaultClient;
        client.query({
            query: gql`
            query {
                allVariables (where: {
                  key_contains: "HPN"
                }) {
                  id
                  key
                  value
                  slug
                }
              }
            `
        }).then(data => {
            console.log(data);
            commit("updateHocPhis", data.data.allVariables);
        }).catch(err => {
            console.log(data);
        })
    },
    saveHocPhi({commit, state}, hocphi){
        var client = this.app.apolloProvider.defaultClient;
        return client.query({
            query: gql`
            query {
                allVariables (where: {
                  key_contains: "${hocphi.key}"
                }) {
                  id
                  key
                  value
                  slug
                }
              }
            `
        }).then(data => {
            console.log(data);
            if(data.data.allVariables.length > 0){
                // Đã tạo rồi - lưu lại thôi
                var hp = data.data.allVariables[0];
                client.mutate({
                    mutation: gql`
                    mutation {
                        updateVariable (id: "${hp.id}", data: {
                          key: "${hp.key}",
                          value: "${hocphi.value}"
                        }) {
                          id
                          key
                          value
                        }
                    }
                    `
                }).then(data1 => {
                    console.log(data1);
                }).catch(err1 => {

                });
            } else {
                // Tạo mới
                client.mutate({
                    mutation: gql`
                    mutation {
                        createVariable (data: {
                          key:"${hocphi.key}",
                          value: "${hocphi.value}"
                        }){
                          id
                          slug
                          value
                          key
                        }
                      }
                    `
                }).then(data1 => {
                    console.log(data1);
                }).catch(err1 => {
                    console.log(err1);
                })
            }
        }).catch(err => {
            console.log(err);
        })
    }    
}