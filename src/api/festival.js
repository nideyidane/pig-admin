/*
 * @Descripttion: 
 * @version: 
 * @Author: dignli.su
 * @Date: 2019-04-24 15:52:10
 * @LastEditors: dignli.su
 * @LastEditTime: 2019-08-30 16:44:46
 */

// 节日祝福


import axios from './httpConfig.js'
import qs from 'qs'

// -----------------列表数据-------------------------------
export const getGreetList = (params) => {
	return axios.get('pig-manage/greet/list', {
		params: params
	}).then((res) => {
		return res.data;
	})
}

// -----------------增加数据-------------------------------
export const addFesData = (params,_callBack) => {
	return axios.post( params.upUrl,'pig-manage/greet/add', params).then((res) => {
		if (_callBack) {
			_callBack();
		}
		return res.data;
	})
}

// -----------------更新数据-------------------------------
export const updateFesData = (params,_callBack) => {
	return axios.post(params.id?'pig-manage/greet/update':'pig-manage/greet/add', params).then((res) => {
		if (_callBack) {
			_callBack();
		}
		return res.data;
	})
}
// -----------------发布数据-------------------------------
export const pushFesData = (params,_callBack) => {
	return axios.post('pig-manage/greet/push', params).then((res) => {
		if (_callBack) {
			_callBack();
		}
		return res.data;
	})
}

// -----------------删除数据-------------------------------
export const deleteFesData = (params,_callBack) => {
	return axios.post('pig-manage/greet/delete', params).then((res) => {
		if (_callBack) {
			_callBack();
		}
		return res.data;
	})
}
// -----------------获取节假日-------------------------------
export const getListHoliday = (params,_callBack) => {
	return axios.get('pig-manage/greet/listHoliday', params).then((res) => {
		if (_callBack) {
			_callBack();
		}
		return res.data;
	})
}
// -----------------文件上传相关-------------------------------
export const uploadData = (params,_callBack) => {
	return axios.post('pig-manage/common/upload', params).then((res) => {
		if (_callBack) {
			_callBack();
		}
		return res.data;
	})
}
