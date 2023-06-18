import gql from 'graphql-tag'
export const state = () => ({
    idPhuHuynh: "",
    logs: []
});
export const mutations = {
    updateIdPhuHuynh(state, data){
        state.idPhuHuynh = data;
    },
    updateLogs(state, data){
        state.logs = data;
    }
}

    // var client = this.app.apolloProvider.defaultClient;
export const actions = {
    getLogsDebt({commit, state}){
        var client = this.app.apolloProvider.defaultClient;
        client.query({
            query: gql`
            query {
                allLogs (where: {
                  item: "Parent",
                  idItem: "${state.idPhuHuynh}",
                  key: "debt"
                }){
                    id item itemS idItem idItemS key value createdTime valueChange createdAt type
                }
            }
            `
        }).then(data => {
            data.data.allLogs.sort(function(a,b){
                var d1 = (new Date(a.createdAt)).getTime();
                var d2 = (new Date(b.createdAt)).getTime();
                return - d1 + d2;
            });
            commit("updateLogs", data.data.allLogs);
        }).catch(err => {
            console.log(err);
        })
    }
}