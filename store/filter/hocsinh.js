import gql from "graphql-tag";
export const state = () => ({
  hocsinhs: [],
  filterHocsinhs: [],

  lophocs: [],
  choseAll: false,

  monitor: 0,
  total: 0,
  page: 1,
  pageSize: 60,
  searchName: "",
  loading: false,

  status: ["DANG_HOC", "TAM_NGHI", "DANG_KY", "NGHI_LUON"],
  // loadingHocSinh: false
});

export const mutations = {
  updateHocsinhs(state, data) {
    state.hocsinhs = data;
    state.filterHocsinhs = data;
  },
  updateTotal(state, total) {
    state.total = total;
  },
  updatePage(state, page) {
    state.page = page;
  },
  updateSearchName(state, searchName) {
    state.searchName = searchName;
  },
  updateLoading(state, loading) {
    state.loading = loading;
  },
  filterHS(state) {
    // chon ra nhung lop hoc duoc filter
    var lophocs = state.lophocs.filter(function (lophoc) {
      return lophoc.chose == true;
    });
    state.filterHocsinhs = state.hocsinhs.filter(function (hocsinh) {
      var hasChose;
      if (hocsinh.lophoc) {
        hasChose = lophocs.some((lophoc) => lophoc.id == hocsinh.lophoc.id);
      } else {
        hasChose = false;
      }
      return hasChose;
    });
    state.filterHocsinhs = state.filterHocsinhs.filter(function (hocsinh) {
      return state.status.indexOf(hocsinh.status) >= 0;
    });
  },
  updateLopHocs(state, data) {
    state.lophocs = data;
  },
  updateFilterEle2(state, data) {
    state.status = data;
    this.commit("filter/hocsinh/filterHS");
  },
  updateFilterEle1(state, data) {
    if (state.choseAll == true && state.choseAll != data.chose) {
      // state.lophocs.forEach(function(lophoc){
      //     lophoc.chose = false;
      // });
      state.choseAll = false;
    }
    state.lophocs.forEach(function (lophoc) {
      if (lophoc.id == data.lophoc.id) {
        lophoc.chose = data.chose;
      }
    });
    this.commit("filter/hocsinh/filterHS");
  },
  updateFilterEle1All(state, data) {
    state.lophocs.forEach(function (lophoc) {
      lophoc.chose = data;
    });
    state.choseAll = data;
    state.monitor += 1;
    this.commit("filter/hocsinh/filterHS");
  },
};

const GET_HOCSINH = gql`
  query getStudents($first: Int, $skip: Int, $where: StudentWhereInput) {
    allStudents(first: $first, skip: $skip, where: $where) {
      id
      name
      status
      parent {
        id
        name
        phone {
          number
        }
        debt
        code
      }
      lophoc {
        id
        name
      }
      hocphi
      hocphigiam
      namhocphi
      luuy
    }
    _allStudentsMeta(where: $where) {
      count
    }
  }
`;

export const actions = {
  async getAllHocsinhs({ commit, state }, page = state.page) {
    const safePage = Math.max(1, page);
    const where = {};
    const selectedClasses = state.lophocs
      .filter((lophoc) => lophoc.chose)
      .map((lophoc) => lophoc.id);

    if (state.searchName.trim()) {
      where.OR = [
        { name_contains_i: state.searchName.trim() },
        { lophoc: { name_contains_i: state.searchName.trim() } },
      ];
    }
    where.status_in = state.status;
    if (state.lophocs.length) {
      where.lophoc = { id_in: selectedClasses };
    }

    commit("updateLoading", true);
    var client = this.app.apolloProvider.defaultClient;
    try {
      var data = await client.query({
        query: GET_HOCSINH,
        variables: {
          first: state.pageSize,
          skip: (safePage - 1) * state.pageSize,
          where,
        },
        fetchPolicy: "network-only",
      });
      commit("updatePage", safePage);
      commit("updateHocsinhs", data.data.allStudents);
      commit("updateTotal", data.data._allStudentsMeta.count);
    } finally {
      commit("updateLoading", false);
    }
  },
  applyFilters({ commit, dispatch }) {
    commit("updatePage", 1);
    return dispatch("getAllHocsinhs", 1);
  },
  async getAllLopHoc({ commit }) {
    var client = this.app.apolloProvider.defaultClient;
    client
      .query({
        query: gql`
          query {
            allLopHocs {
              id
              name
              chunhiem {
                id
                name
              }
              hocsinhs {
                id
              }
            }
          }
        `,
      })
      .then((data) => {
        commit("updateLopHocs", data.data.allLopHocs);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
