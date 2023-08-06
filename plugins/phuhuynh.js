import gql from 'graphql-tag'
import { fragmentPhuHuynh } from './fragments';

export async function getPhuHuynh(client){
    return new Promise((resolve, reject) => {
        client.query({
            query: gql`
            query {
                allParents(sortBy: code_DESC){
                    ...fPhuHuynh
                }
            }
            ${fragmentPhuHuynh}
            `
        }).then(data => {
            resolve(data.data.allParents);
        }).catch (err => {
            reject(err);
        });
    });
}