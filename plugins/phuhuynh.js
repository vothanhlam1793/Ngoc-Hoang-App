import gql from 'graphql-tag'
import { fragmentPhuHuynh } from './fragments';

export async function getPhuHuynh(client, { first = 50, skip = 0, sortBy = 'code_DESC', search = '' } = {}){
    const allowedSorts = ['code_ASC', 'code_DESC', 'debt_ASC', 'debt_DESC'];
    const parentSort = allowedSorts.includes(sortBy) ? sortBy : 'code_DESC';
    const where = {};
    if (search && search.trim()) {
        const s = search.trim();
        where.OR = [
            { code_contains_i: s },
            { name_contains_i: s },
            { phone_some: { number_contains_i: s } },
            { hocsinhs_some: { name_contains_i: s } }
        ];
    }
    return new Promise((resolve, reject) => {
        client.query({
            query: gql`
            query getParents($first: Int, $skip: Int, $where: ParentWhereInput) {
                allParents(first: $first, skip: $skip, sortBy: ${parentSort}, where: $where){
                    ...fPhuHuynh
                }
                _allParentsMeta(where: $where) {
                    count
                }
            }
            ${fragmentPhuHuynh}
            `,
            variables: { first, skip, where },
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
