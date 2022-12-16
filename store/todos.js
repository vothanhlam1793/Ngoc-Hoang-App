import gql from 'graphql-tag'

export const state = () => ({
    list: []
})

export const mutations = {
    add(state, text) {
        state.list.push({
            text,
            done: false
        })
    },
    remove(state, { todo }) {
        state.list.splice(state.list.indexOf(todo), 1)
    },
    toggle(state, todo) {
        todo.done = !todo.done
    }
}
const GET_USER = gql`
    query {
        allUsers {
            name
            phone
            id
        }
    }
`
export const actions = {
    async get_data(){
        var client = this.app.apolloProvider.defaultClient;
        var data = await client.query({
            query: GET_USER
        });
        console.log(data);
    },
}