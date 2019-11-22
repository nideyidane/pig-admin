/*
 * @Author: dingli.su
 * @Date: 2019-04-17 17:05:47
 * @Last Modified by: dingli.su
 * @Last Modified time: 2019-04-17 17:05:47
 */
// 通知栏消息推送


import axios from './httpConfig.js'
import qs from 'qs'

// -----------------消息列表-------------------------------
export const getMessageList = (params) => {
	return axios.get('pig-manage/message/list', {
		params: params
	}).then((res) => {
		return res.data;
	})
}
// -----------------消息推送-------------------------------
export const pushMessage = (params) => {
	return axios.post('pig-manage/message/push', params, { timeout: 1000 * 60 * 1 }).then((res) => {
		return res.data;
	})
}
// -----------------消息增加-------------------------------
export const addInfor = (params) => {
	return axios.post('pig-manage/message/add', params, { timeout: 1000 * 60 * 1 }).then((res) => {
		return res.data;
	})
}
// -----------------消息删除-------------------------------
export const deleteMessage = (params) => {
	return axios.post('pig-manage/message/delete', params, { timeout: 1000 * 60 * 1 }).then((res) => {
		return res.data;
	})
}
// -----------------群组选择-------------------------------
export const getGroup = (params,_callBack) => {
	return axios.post('pig-manage/user/getGroup', params).then((res) => {
		if (_callBack) {
			_callBack();
		}
		return res.data;
	})
}
