/*
 * @Author: zhongbin.chen
 * @Date: 2019-03-03 13:55:05
 * @Last Modified by: zhongbin.chen
 * @Last Modified time: 2019-03-03 18:04:17
 */
import Vue from "vue";
import Vuex from "vuex";
import { getUser } from "@/api/sys";

Vue.use(Vuex);
const key = "user";
const store = new Vuex.Store({
	state() {
		return {
            userKey: '',
            userInfo: ''
		};
	},
	getters: {
		getStorage(state) {
            state.userKey = JSON.parse(sessionStorage.getItem('userKey'));
			return state.userKey;
		}
	},
	mutations: {
		setStorage(state, value) {
            state.userKey = value;
			sessionStorage.setItem('userKey', JSON.stringify(value));
		},
		removeStorage(state) {
			state.userKey = null;
			sessionStorage.removeItem('userKey');
		}
    },
    action: {
        async getUserInfo(state) {
            try{
                const res = await getUser(state.userKey.userId)
                if (res.code == 0) {
                    state.userInfo = res.user;
                    commit('userInfo', res.user);
                }else{
                    console.log(res.msg);
                }
            }catch(err){
                // console.log(err.message)
            }
        }
    }
});

export default store;
