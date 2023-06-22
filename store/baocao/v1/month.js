import gql from 'graphql-tag'
function generateSortedDateArray(startDateString, endDateString) {
    var startDate = parseDateString(startDateString);
    var endDate = parseDateString(endDateString);
    var result = [];

    var currentDate = new Date(startDate);
    currentDate.setDate(1); // Đặt ngày là 1 để bắt đầu từ đầu tháng

    while (currentDate <= endDate) {
        var year = currentDate.getFullYear();
        var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        var formattedDate = year + '_' + month;
        result.push(formattedDate);

        currentDate.setMonth(currentDate.getMonth() + 1); // Chuyển sang tháng tiếp theo

        if (currentDate.getFullYear() > endDate.getFullYear() || (currentDate.getFullYear() === endDate.getFullYear() && currentDate.getMonth() > endDate.getMonth())) {
            break;
        }
    }

    return result.sort();
}
function parseDateString(dateString) {
    var parts = dateString.split('_');
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // Giảm đi 1 vì tháng trong JavaScript bắt đầu từ 0
    return new Date(year, month);
}
function convertDateToYearMonth(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}_${month}`;
}
function convertYearMonthToObject(yearMonth) {
    const [year, month] = yearMonth.split('_');
    const startDate = new Date(`${year}-${month}-01T00:00:00Z`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999);

    return {
        start: startDate.toISOString(),
        end: endDate.toISOString()
    };
}
export const state = () => ({
    oBaoCao: {},
    monitor: 0,
    codes: []

});

export const mutations = {
    updateDoanhThu(state, oDoanhThu) {
        if (state.oBaoCao[oDoanhThu.code]) {
            state.oBaoCao[oDoanhThu.code].doanhthu = oDoanhThu.total;
        } else {
            state.oBaoCao[oDoanhThu.code] = {};
            state.oBaoCao[oDoanhThu.code].doanhthu = oDoanhThu.total;
        }
        // console.log(oDoanhThu, state.oBaoCao);
        state.monitor += 1;
    },
    updatePhieuThu(state, oPhieuThu) {
        if (state.oBaoCao[oPhieuThu.code]) {
            state.oBaoCao[oPhieuThu.code].thutien = oPhieuThu.total;
        } else {
            state.oBaoCao[oPhieuThu.code] = {};
            state.oBaoCao[oPhieuThu.code].thutien = oPhieuThu.total;
        }
        state.monitor += 1;
    },
    updateCode(state, codes){
        state.codes = codes;
    }
};

export const actions = {
    createBaoCao({ commit, dispatch }, oDate) {
        var that = this;
        // console.log(oDate);
        var arrayDateCode = generateSortedDateArray(convertDateToYearMonth(oDate.fromDate), convertDateToYearMonth(oDate.toDate));
        // console.log(arrayDateCode);
        commit("updateCode", arrayDateCode);
        arrayDateCode.forEach(function (dateCode) {
            dispatch('getDoanhThu', {
                fromDate: dateCode,
                toDate: dateCode
            });
            dispatch('getPhieuThu', {
                fromDate: dateCode,
                toDate: dateCode
            });
        });
    },
    getDoanhThu({commit}, oDate) {
        // console.log(oDate);
        var client = this.app.apolloProvider.defaultClient;
        client.query({
            query: gql`
            query {
              reportDoanhThu(from: "${oDate.fromDate}", to: "${oDate.toDate}"){
                    total    
              }
            }`
        }).then(data => {
            // console.log(data);
            commit('updateDoanhThu', {
                code: oDate.fromDate,
                total: data.data.reportDoanhThu.total
            })
        }).catch(err => {
            console.log(err);
        })
    },
    getPhieuThu({ commit }, oDate) {
        var client = this.app.apolloProvider.defaultClient;
        var d = convertYearMonthToObject(oDate.fromDate);
        client.query({
            query: gql`
            query {
                allPhieuThus(where : {
                  createdAt_gte: "${d.start}",
                  createdAt_lte: "${d.end}"
                }){
                  createdAt
                    total
                  parent {
                    name phone {number}
                  }
                  ghichu
                }
              }
            `
        }).then(data => {
            // console.log(d);
            // console.log(data);
            var total = 0;
            data.data.allPhieuThus.forEach(function(phieuthu){
                total += phieuthu.total;
            });
            commit('updatePhieuThu', {
                code: oDate.fromDate,
                total: total
            })
        }).catch(err => {
            console.log(err);
        })
    }
};