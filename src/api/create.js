/*
 * @Descripttion: 众创空间
 * @version: 
 * @Author: dignli.su
 * @Date: 2019-07-18 15:21:28
 * @LastEditors: dignli.su
 * @LastEditTime: 2019-08-30 16:41:48
 */




import axios from './httpConfig.js'
import qs from 'qs'

// -----------------列表数据-------------------------------
export const getCurrentPage = (params) => {
	return axios.get('pig-manage/statement/list', {
		params: params
	}).then((res) => {
		return res.data;
	})
}
// -----------------导出数据-------------------------------
export const getExportData = (params) => {
	return axios.get('pig-manage/statement/export', {
		params: params
	}).then((res) => {
		return res.data;
	})
}
// -----------------修改状态-------------------------------
export const setCurrentState = (params,_callBack) => {
	return axios.post('pig-manage/statement/update', params).then((res) => {
		if (_callBack) {
			_callBack();
		}
		return res.data;
	})
}
