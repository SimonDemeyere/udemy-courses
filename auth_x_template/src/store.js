import Vue from "vue";
import Vuex from "vuex";

import router from "./routes";

Vue.use(Vuex);

const FbAuth = "https://identitytoolkit.googleapis.com/v1/accounts";
const FbApiKey = "AIzaSyDWC81Fuow1dLCppb7HrGKhzIuvojWnhzU";

export default new Vuex.Store({
  state: {
    email: "",
    token: "",
    refresh: "",
    user: null,
  },
  getters: {
    isAuth(state) {
      if (state.token) {
        return true;
      }
      return false;
    },
  },
  mutations: {
    auth(state, authData) {
      state.email = authData.email;
      state.token = authData.idToken;
      state.refresh = authData.refreshToken;
    },
    logout(state) {
      state.email = null;
      state.token = null;
      state.refresh = null;

      localStorage.removeItem("token");
      localStorage.removeItem("refresh");

      router.push("/");
    },
    addUserInfo(state, userInfo) {
      state.user = userInfo;
    },
  },
  actions: {
    signin({ commit }, payload) {
      Vue.http
        .post(`${FbAuth}:signInWithPassword?key=${FbApiKey}`, {
          ...payload,
          returnSecureToken: true,
        })
        .then((response) => response.json())
        .then((authData) => {
          commit("auth", authData);
          localStorage.setItem("token", authData.idToken);
          localStorage.setItem("refresh", authData.refreshToken);
        })
        .catch((error) => console.log(error));
    },

    signup({ commit }, payload) {
      Vue.http
        .post(`${FbAuth}:signUp?key=${FbApiKey}`, {
          ...payload,
          returnSecureToken: true,
        })
        .then((response) => response.json())
        .then((authData) => {
          commit("auth", authData);
          localStorage.setItem("token", authData.idToken);
          localStorage.setItem("refresh", authData.refreshToken);
          // console.log(authData);
        })
        .catch((error) => console.log(error));
    },
    refreshToken({ commit }) {
      const refreshToken = localStorage.getItem("refresh");

      if (refreshToken) {
        Vue.http
          .post(`https://securetoken.googleapis.com/v1/token?key=${FbApiKey}`, {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          })
          .then((response) => response.json())
          .then((authData) => {
            commit("auth", {
              idToken: authData.id_token,
              refreshToken: authData.refresh_token,
            });
            localStorage.setItem("token", authData.idToken);
            localStorage.setItem("refresh", authData.refreshToken);
          });
      }
    },
    getUserInfo({ commit }, payload) {
      Vue.http
        .post(`${FbAuth}:lookup?key=${FbApiKey}`, {
          idToken: payload,
        })
        .then((response) => response.json())
        .then((res) => {
          commit("addUserInfo", res.users[0]);
        });
    },
  },
});
