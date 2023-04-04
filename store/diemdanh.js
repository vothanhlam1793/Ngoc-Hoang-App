import gql from 'graphql-tag'

function createDate(year, month){
  var d = new Date(year+"/"+month+"/1");
  var n = new Date(year+"/"+(parseInt(month) + 1) + "/1");
  n = n.getTime() - 86400000;
  n = new Date(n);
  var e = new Date();
  var ret = [];
  var i = 0;
  var f = new Date(year+"/"+month+"/1");
  for(i = 1; (f <= e) && (f <= n);){
      let j = ("0" + i).substring(("0" + i).length - 2, ("0" + i).length);
      ret.push(j);
      f = new Date(f.getTime() + 86400000);
      i += 1;
  }
  console.log(year, month, ret);
  return ret;
};

export const state = () => ({
    startDate: (new Date()).toLocaleDateString(),
    endDate: (new Date()).toLocaleDateString(),
    todayDiemDanh: {},
    idLopHoc: "",
    yearForm: "2023",
    monthForm: "03",
    dateForm: [],
    searchPhieuDiemDanh: [],

    // APP DIEM DANH NGAY
    stateDiemDanh: "IDLE",
    dadiemdanh: 0,
    online: 0,
    offline: 0,

})

export const mutations = {
    updateStateCreate(state, data){
        state.stateCreate = data;
    },
    updateIdLopHoc(state, data){
        state.idLopHoc = data;
    },
    updateDateForm(state, data){
      state.yearForm = data.year;
      state.monthForm = data.month;
      state.dateForm = createDate(data.year, data.month).reverse();
      // console.log(state);
    },
    updateSearchPhieuDiemDanh(state, data){
      state.searchPhieuDiemDanh = data;
    },
    dadiemdanh(state, data){
      var t = 0;
      var online = 0;
      var offline = 0;
      data.hocsinhs.forEach(function(hocsinh){
        if((data.status[hocsinh.id] == "online")){
          t += 1;
          online += 1;
        } else if ((data.status[hocsinh.id] == "offline")) {
          t += 1;
          offline += 1;;
        } else {

        }
      });
      state.offline = offline;
      state.online = online;
      state.dadiemdanh = t;
    }
}

const SEARCH_PHIEUDIEMDANH = gql`
query search($code: String, $id: ID!){
  allPhieuDiemDanhs(
    where: {
      AND: [{
              code_contains: $code
            },
            {
              lophoc: {
                id: $id
              }
            },
            {
              status: "NORMAL"
            }
      ]
      
    }
  ){
    id
    dihoc {
      id
    }
    nghi {
      id
    }
    nghicophep {
      id
    }
    giaovien {
      id
      name
    }
    code
  }
}
`

function connectList(array){
  var str = `[`;
  array.forEach(function(item, index){
    if(index != 0){
      str += ",";
    }
    str += `{
      id: "${item.id}"
    }`
  })
  str += "]";
  return str;
}

export const actions = {
    searchDiemDanh({commit, state}, data){
      var client = this.app.apolloProvider.defaultClient;
      client.query({
        query: SEARCH_PHIEUDIEMDANH,
        variables: {
          code: data.code,
          id: data.id
        }
      }).then(data => {
        if(data.data.allPhieuDiemDanhs.length > 0){
          commit("updateSearchPhieuDiemDanh", data.data.allPhieuDiemDanhs);
        } else {
          commit("updateSearchPhieuDiemDanh", []);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    create({commit, state}, data){
      var offline = [];
      var online = [];
      data.hocsinhs.map(function(hocsinh){
        if(data.status[hocsinh.id] == "online"){
          online.push(hocsinh);
        } else if (data.status[hocsinh.id] == "offline"){
          offline.push(hocsinh);
        }
      });
      online = connectList(online);
      offline = connectList(offline);
      console.log("ONLINE: ", online);
      console.log("OFFLINE: ", offline);
      var CREATE_PHIEUDIEMDANH = `
      mutation {
        createPhieuDiemDanh(data: {
          dihoc: {
            connect: 
            ` + online + `
          },
          nghi: {
            connect: 
            ` + offline + `
          },
          code: "` + data.code + `",
          lophoc: {
            connect: {
              id: "${data.idLopHoc}"
            }
          },
          status: "NORMAL"
        }){
          dihoc {
            id
            name
          } 
          nghi {
            id name
          }
          giaovien {
            id name
          }
          code
        }
      }
      `
      var client = this.app.apolloProvider.defaultClient;
      return client.mutate({
        mutation: gql(CREATE_PHIEUDIEMDANH),
      }).then(data => {
        console.log(data);
      }).catch(err => {
        console.log(err);
      })
    },
    deletePhieuDiemDanh({commit, state}, data){
      var client = this.app.apolloProvider.defaultClient;
      return client.mutate({
        mutation: gql`
          mutation {
            updatePhieuDiemDanh(id: "${data}", data: {
              status: "DELETE"
            }){
              id
            }
          }
        `
      }).then(data => {
        console.log(data);
      }).catch(err => {
        console.log(err);
      })
    }
}