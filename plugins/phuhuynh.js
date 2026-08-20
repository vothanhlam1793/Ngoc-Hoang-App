import gql from 'graphql-tag'
import { fragmentPhuHuynh } from './fragments';

export async function getPhuHuynh(client, { first = 50, skip = 0 } = {}){
    return new Promise((resolve, reject) => {
        client.query({
            query: gql`
            query getParents($first: Int, $skip: Int) {
                allParents(first: $first, skip: $skip, sortBy: code_DESC){
                    ...fPhuHuynh
                }
                _allParentsMeta {
                    count
                }
            }
            ${fragmentPhuHuynh}
            `,
            variables: { first, skip },
            fetchPolicy: 'network-only'
        }).then(data => {
            resolve({
                items: data.data.allParents,
                total: data.data._allParentsMeta.count
            });
        }).catch (err => {
            reject(err);
        });
    });
}
