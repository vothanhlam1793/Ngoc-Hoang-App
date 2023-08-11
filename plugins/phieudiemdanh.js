import gql from 'graphql-tag'

export async function getPhieuDiemDanh(client, code, type, idLopHoc){
    return new Promise((resolve, reject) => {
        client.query({
            query: gql`
            query {
                allDiemDanhs(where: {
                        code_contains: "${code}",
                        type: "${type}",
                        lophoc: {
                        id: "${idLopHoc}"
                    }
                }){
                    id co {id name} khong {id name} code giaovien {id name}
                }
            }
            `
        }).then(data => {
            resolve(data.data.allDiemDanhs);
        }).catch (err => {
            reject(err);
        });
    });
}