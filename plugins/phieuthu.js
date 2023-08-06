import gql from 'graphql-tag'
import { fragmentPhieuThu } from './fragments';

export async function getPhieuThu(client, dates){
    return new Promise((resolve, reject) => {
        client.query({
            query: gql`
            query {
            allPhieuThus (
            where: {
                createdAt_gte: "${dates.from}",
                createdAt_lte: "${dates.to}"
            },
            sortBy: createdAt_DESC
            ) {
                    ...fPhieuThu
            }
            }
            ${fragmentPhieuThu}
            `
        }).then(data => {
            resolve(data.data.allPhieuThus);
        }).catch (err => {
            reject(err);
        });
    });
}