import gql from 'graphql-tag'
import { fragmentPhieuKetSo } from './fragments';

export async function getPhieuKetSo(client, code){
    return new Promise((resolve, reject) => {
        client.query({
            query: gql`
            query {
                allPhieuKetSos (where: {
                        code_contains: "${code}"
                }){
                    ...fPhieuKetSo
                }
            }
            ${fragmentPhieuKetSo}
            `
        }).then(data => {
            resolve(data.data.allPhieuKetSos);
        }).catch (err => {
            reject(err);
        });
    });
}