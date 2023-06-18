export const state = () => ({
    inpSearch: "",
    hocsinhs: [],
    fHocsinhs: []
})

function chuyentiengviet(str) {
    if(str == undefined){
        return "";
    }
    return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export const mutations = {
    // Ham cap nhat du lieu
    updateInputSearch(state, data){
        state.inpSearch = data;
        var changeSearchReg = chuyentiengviet(data).split(" ").join("[ -w]+");
        var reg = new RegExp(changeSearchReg, "i");
        state.fHocsinhs = state.hocsinhs.filter(function(e){
            var temp = [e.name];
            return reg.test(chuyentiengviet(temp.join(" ")));
        });
    },
    updateHocSinh(state, data){
        state.hocsinhs = data;
        state.fHocsinhs = data;
    }
}
export const actions = {

}