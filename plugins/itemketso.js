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
        if (data.data.allItemKetSos.length > 0) {
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
    client
      .query({
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
        `,
      })
      .then((data) => {
        resolve(data.data.allPhieuThus);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function updateItemKetSo(client, idItem, data) {
  return new Promise((resolve, reject) => {
    if(data.hoadons == undefined){
      data.hoadons = [];
    }
    if(data.totalHoaDon == undefined){
      data.totalHoaDon = 0;
    }
    console.log(`
    mutation {
      updateItemKetSo(
        id: "${idItem}",
        data: {
          data: "${JSON.stringify(data).split('"').join('\\"')}",
        }
      ){
          ...fItemKetSo
        }
      }
      ${fragmentItemKetSo}
    `);
    client
      .mutate({
        mutation: gql`
          mutation {
            updateItemKetSo(
              id: "${idItem}",
              data: {
                data: "${JSON.stringify(data).split('"').join('\\"')}",
              }
            ){
                ...fItemKetSo
              }
            }
            ${fragmentItemKetSo}
      `,
      })
      .then((data) => {
        console.log(data);
        resolve(data.updateItemKetSo);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export async function getItemKetSoWithStudent(client, idHocSinh) {
  return new Promise((resolve, reject) => {
    client
      .query({
        query: gql`
          query {
            allItemKetSos(
              where: { 
								hocsinh: {
                  id: "${idHocSinh}" 
                } 
              }
            ) {
              ...fItemKetSo
            }
          }
          ${fragmentItemKetSo}
        `,
      })
      .then((data) => {
        resolve(data.data.allItemKetSos);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
