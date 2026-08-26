import gql from 'graphql-tag'
import { fragmentPhuHuynh } from './fragments';

export async function getPhuHuynh(client, { first = 50, skip = 0, sortBy = 'code_DESC' } = {}){
    const allowedSorts = ['code_ASC', 'code_DESC', 'debt_ASC', 'debt_DESC'];
    const parentSort = allowedSorts.includes(sortBy) ? sortBy : 'code_DESC';
    return new Promise((resolve, reject) => {
        client.query({
            query: gql`
            query getParents($first: Int, $skip: Int) {
                allParents(first: $first, skip: $skip, sortBy: ${parentSort}){
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
