export const fragmentTodo = `
fragment fTodo on Todo {
    id
    content
    flag 
    done
}
`
export const fragmentListMain = `
fragment fListMain on List {
    id 
    todos {
        ...fTodo
    } 
    title 
    description 
    users {id name}
}
${fragmentTodo}
`
export const fragmentLoop = `
fragment fLoop on Loop {
    id endDate type data
}
`
export const fragmentTaskChild = `
fragment fTaskChild on Task {
    id
    title
    description
    estimate
    loop { ...fLoop }
    lists { ...fListMain }
}
`
export const fragmentTaskMain = `
fragment fTaskMain on Task {
    id
    title
    description
    estimate
    loop { ...fLoop }
    lists { ...fListMain }
    taskChilds { ...fTaskChild }

}
${fragmentListMain}
${fragmentLoop}
${fragmentTaskChild}
`

export const fragmentVariable = `
fragment fVariable on Variable {
	id key value item idItem slug
}
`

export const fragmentStudent = `
fragment fStudent on Student {
    id
    name
    status
    parent {id}
    lophoc {id name}    
    namhocphi
    hocphigiam
    birthday
}
`

export const fragmentItemKetSo = `
fragment fItemKetSo on ItemKetSo {
    id data total code phieuketso { code id createdAt }
    hocsinh { name id lophoc {id name} parent {id debt} status}
}
`

export const fragmentHoaDon = `
fragment fHoaDon on HoaDon{
    id createdAt 
    items { id sanpham { id name } price amount total }
   	code total parent {id name phone {number}} student {id name lophoc {id name}}
  	type  
}
`

export const fragmentPhieuThu = `
fragment fPhieuThu on PhieuThu {
    id code total parent {id name phone {number} hocsinhs {id name lophoc { id name } status }} createdAt createdBy {id name username}
    itemThu idItemThu createdBy {id name} updatedBy {id name} createdAt
}
`
export const fragmentPhieuKetSo = `
fragment fPhieuKetSo on PhieuKetSo {
    id code lophoc {id name} status createdAt createdBy {id name} updatedBy {id name}
  items {
    ...fItemKetSo
  }
}
${fragmentItemKetSo}
`

export const fragmentPhuHuynh = `
fragment fPhuHuynh on Parent {
    id code debt hocsinhs {id name lophoc {id name} status} name
}
`