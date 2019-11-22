/*
 * @Descripttion: 
 * @version: 
 * @Author: dignli.su
 * @Date: 2019-07-30 14:39:56
 * @LastEditors: dignli.su
 * @LastEditTime: 2019-08-30 16:47:58
 */

// 系统管理


import axios from './httpConfig.js'
import qs from 'qs'

// -----------------用户列表-------------------------------
export const getUserList = (params) => {
	return axios.get('pig-manage/user/list', {
		params: params
	}).then((res) => {
		return res.data;
	})
}

// -----------------分组管理-------------------------------
export const getGroup = (params,_callBack) => {
	return axios.post('pig-manage/user/getGroup', params).then((res) => {
		if (_callBack) {
			_callBack();
		}
		return res.data;
	})
}
export const joinGroup = (params) => {
	return axios.post('pig-manage/user/joinGroup', params).then((res) => {
		return res.data;
	})
}
export const addGroup = (params) => {
	return axios.post('pig-manage/user/addGroup', params).then((res) => {
		return res.data;
	})
}
// -----------------强制解绑-------------------------------
export const unBind = (params) => {
	return axios.post('pig-manage/user/unBind', params).then((res) => {
		return res.data;
	})
}
