import gql from 'graphql-tag'

export const state = () => ({
    user: {},
    roles: [],
    isAdmin: false,
    // Impersonation state
    isImpersonating: false,
    simulatedRole: null, // 'giao-vien'
    simulatedClass: null, // { id: '...', name: '...' }
    classList: [] // All classes for quick selection
})
Array.prototype.diff = function(arr2) {
    var ret = [];
    this.sort();
    arr2.sort();
    for(var i = 0; i < this.length; i += 1) {
        if(arr2.indexOf(this[i]) > -1){
            ret.push(this[i]);
        }
    }
    return ret;
};

export const mutations = {
    updateUser(state, data){
        state.user = data;
        state.isAdmin = data.isAdmin === true || data.username === 'admin';
    },
    updateRoles(state, data){
        // console.log(data);
        state.roles = data.map(function(e){
            return e.slug;
        });
        // console.log(this);
    },
    setClassList(state, list){
        state.classList = list || [];
    },
    startImpersonation(state, { role = 'giao-vien', lophoc = null }){
        state.isImpersonating = true;
        state.simulatedRole = role;
        state.simulatedClass = lophoc;
        try {
            localStorage.setItem('impersonation_state', JSON.stringify({
                isImpersonating: true,
                simulatedRole: role,
                simulatedClass: lophoc
            }));
        } catch (e) {}
    },
    stopImpersonation(state){
        state.isImpersonating = false;
        state.simulatedRole = null;
        state.simulatedClass = null;
        try {
            localStorage.removeItem('impersonation_state');
        } catch (e) {}
    },
    setSimulatedClass(state, lophoc){
        state.simulatedClass = lophoc;
        try {
            const saved = JSON.parse(localStorage.getItem('impersonation_state') || '{}');
            saved.simulatedClass = lophoc;
            localStorage.setItem('impersonation_state', JSON.stringify(saved));
        } catch (e) {}
    },
    restoreImpersonation(state){
        try {
            const raw = localStorage.getItem('impersonation_state');
            if(raw){
                const data = JSON.parse(raw);
                if(data.isImpersonating){
                    state.isImpersonating = true;
                    state.simulatedRole = data.simulatedRole || 'giao-vien';
                    state.simulatedClass = data.simulatedClass || null;
                }
            }
        } catch (e) {}
    },
    checkRoles(state, slugs){
        var ret = false;
        // If impersonating
        var effectiveRoles = state.isImpersonating && state.simulatedRole ? [state.simulatedRole] : state.roles;
        effectiveRoles.forEach(function(e1){
          slugs.forEach(function(e2){
            if(e1 == e2){
              ret = true;
            }
          });
        })
        return ret;
    }
}

export const getters = {
    effectiveRoles(state){
        if (state.isImpersonating && state.simulatedRole) {
            return [state.simulatedRole];
        }
        return state.roles || [];
    },
    effectiveClass(state){
        if (state.isImpersonating && state.simulatedClass) {
            return state.simulatedClass;
        }
        if (state.user && state.user.lophoc && state.user.lophoc.length > 0) {
            return state.user.lophoc[0];
        }
        return null;
    },
    effectiveClasses(state){
        if (state.isImpersonating && state.simulatedClass) {
            return [state.simulatedClass];
        }
        if (state.user && state.user.lophoc) {
            return state.user.lophoc;
        }
        return [];
    },
    isRealAdmin(state){
        return state.isAdmin === true || (state.roles || []).includes('super-admin') || (state.roles || []).includes('quan-tri-vien');
    }
}

export const actions = {
    getRole({commit, dispatch}){
        var client = this.app.apolloProvider.defaultClient;
        client.query({
            query: gql`
            query {
                User(where: {id: "${this.$auth.$state.user.id}"}){
                  name
                  isAdmin
                  lophoc {
                    id
                    name
                  }
                  roles {
                    id
                    slug
                    name
                    lophoc{
                      id
                      name
                    }
                  }
                  id
                  username
                }
              }
            `
        }).then(data => {
            commit("updateRoles", data.data.User.roles);
            commit("updateUser", data.data.User);
            commit("restoreImpersonation");
            dispatch("fetchAllClasses");
        }).catch(e => {
            console.error("Error getting user role:", e);
        })
    },
    fetchAllClasses({commit}){
        var client = this.app.apolloProvider.defaultClient;
        client.query({
            query: gql`
            query {
                allLopHocs {
                    id
                    name
                }
            }
            `
        }).then(res => {
            if(res.data && res.data.allLopHocs){
                commit("setClassList", res.data.allLopHocs);
            }
        }).catch(e => {
            console.error("Error fetching class list:", e);
        });
    }
}