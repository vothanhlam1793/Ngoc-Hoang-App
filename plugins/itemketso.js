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
