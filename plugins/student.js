import gql from 'graphql-tag'
import { fragmentStudent } from './fragments';

export async function saveNameStudent (client, hocsinh){
    return new Promise((resolve, reject) => {
        client.mutate({
            mutation: gql`
                mutation {
                    updateStudent (id: "${hocsinh.id}", data: {
                        name: "${hocsinh.name}"
                    }) {
                        ...fStudent
                    }
                }
                ${fragmentStudent}
            `
        }).then(data => {
            resolve(data.data.updateStudent);
        }).catch(err => {
            reject(err);
        })
    });
}