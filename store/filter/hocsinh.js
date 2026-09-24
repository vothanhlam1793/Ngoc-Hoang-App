import gql from "graphql-tag";

export const state = () => ({
  hocsinhs: [],
  filterHocsinhs: [],

  lophocs: [],
  choseAll: true,

  monitor: 0,
  total: 0,
  page: 1,
  pageSize: 50,
  searchName: "",
  loading: false,

  status: ["DANG_HOC", "TAM_NGHI", "DANG_KY", "NGHI_LUON"],
});

export const mutations = {
  updateHocsinhs(state, data) {
    state.hocsinhs = data || [];
    state.filterHocsinhs = data || [];
  },
  updateTotal(state, total) {
    state.total = total || 0;
  },
  updatePage(state, page) {
    state.page = page || 1;
  },
  updateSearchName(state, searchName) {
    state.searchName = searchName || "";
  },
  updateLoading(state, loading) {
    state.loading = !!loading;
  },
  updateLopHocs(state, data) {
    const list = (data || []).map((lh) => ({
      ...lh,
      chose: true,
    }));
    state.lophocs = list;
    state.choseAll = true;
    state.monitor += 1;
  },
  updateFilterEle2(state, data) {
    state.status = data || [];
  },
  updateFilterEle1(state, data) {
    state.lophocs.forEach((lophoc) => {
      if (lophoc.id === data.lophoc.id) {
        lophoc.chose = data.chose;
      }
    });
    const allChosen = state.lophocs.every((lh) => lh.chose);
    state.choseAll = allChosen;
    state.monitor += 1;
  },
  updateFilterEle1All(state, data) {
    state.lophocs.forEach((lophoc) => {
      lophoc.chose = !!data;
    });
    state.choseAll = !!data;
    state.monitor += 1;
  },
};

const GET_HOCSINH = gql`
  query getStudents($first: Int, $skip: Int, $where: StudentWhereInput) {
    allStudents(first: $first, skip: $skip, where: $where, sortBy: id_DESC) {
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
        balance
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

    // 1. Lọc theo từ khóa tìm kiếm
    const keyword = (state.searchName || "").trim();
    if (keyword) {
      where.OR = [
        { name_contains_i: keyword },
        { lophoc: { name_contains_i: keyword } },
        { parent: { name_contains_i: keyword } },
      ];
    }

    // 2. Lọc theo trạng thái học sinh
    if (state.status && state.status.length > 0) {
      where.status_in = state.status;
    } else {
      where.status_in = ["__NONE__"];
    }

    // 3. Lọc theo lớp học
    if (state.lophocs && state.lophocs.length > 0) {
      const selectedClasses = state.lophocs
        .filter((lophoc) => lophoc.chose)
        .map((lophoc) => lophoc.id);

      if (selectedClasses.length > 0 && selectedClasses.length < state.lophocs.length) {
        where.lophoc = { id_in: selectedClasses };
      } else if (selectedClasses.length === 0) {
        where.id_in = [];
      }
    }

    commit("updateLoading", true);
    const client = this.app.apolloProvider.defaultClient;
    try {
      const data = await client.query({
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
    } catch (err) {
      console.error("Lỗi khi tải danh sách học sinh:", err);
    } finally {
      commit("updateLoading", false);
    }
  },
  applyFilters({ commit, dispatch }) {
    commit("updatePage", 1);
    return dispatch("getAllHocsinhs", 1);
  },
  async getAllLopHoc({ commit, dispatch }) {
    const client = this.app.apolloProvider.defaultClient;
    try {
      const data = await client.query({
        query: gql`
          query {
            allLopHocs(sortBy: name_ASC) {
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
        fetchPolicy: "network-only",
      });
      commit("updateLopHocs", data.data.allLopHocs);
      dispatch("applyFilters");
    } catch (err) {
      console.error("Lỗi khi tải danh sách lớp học:", err);
    }
  },
};

