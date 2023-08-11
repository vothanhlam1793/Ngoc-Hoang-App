import gql from "graphql-tag";
import { fragmentItemKetSo } from "./fragments";

export async function getItemKetSo(client, id) {
  return new Promise((resolve, reject) => {
    client
      .query({
        query: gql`
          query {
            allItemKetSos(
              where: { id: "${id}" }
            ) {
              ...fItemKetSo
            }
          }
          ${fragmentItemKetSo}
        `,
      })
      .then((data) => {
        if(data.data.allItemKetSos.length > 0){
            resolve(data.data.allItemKetSos[0]);
        } else {
            resolve({});
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}


export async function getItemKetSoWithDate(client, dates) {
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
                ...fItemKetSo
        }
        }
        ${fragmentItemKetSo}
        `
    }).then(data => {
        resolve(data.data.allPhieuThus);
    }).catch (err => {
        reject(err);
    });
  });
}