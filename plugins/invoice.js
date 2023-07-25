import gql from 'graphql-tag'
import { fragmentHoaDon } from './fragments';

export async function getHoaDonById (client, idHoaDon){
    return new Promise((resolve, reject) => {
        client.query({
            query: gql`
                query {
                    HoaDon(where: {id: "${idHoaDon}"}){
                        ...fHoaDon
                    }
                }
                ${fragmentHoaDon}
            `
        }).then(data => {
            resolve(data.data.HoaDon);
        }).catch(err => {
            reject(err);
        });
    });
}