/*
 * @Descripttion: 
 * @version: 
 * @Author: dignli.su
 * @Date: 2019-07-08 16:27:55
 * @LastEditors: dignli.su
 * @LastEditTime: 2019-08-30 16:46:26
 */
import axios from './httpConfig.js'
import qs from 'qs'

// -----------------列表数据-------------------------------
export const getGreetList = (params) => {
	return axios.get('pig-manage/skill/list', {
		params: params
	}).then((res) => {
		return res.data;
	})
}
// -----------------删除数据-------------------------------
export const deleteFesData = (params,_callBack) => {
	return axios.post('pig-manage/skill/delete', params).then((res) => {
		if (_callBack) {
			_callBack();
		}
		return res.data;
	})
}
// -----------------发布-------------------------------
export const pushFesData = (params,_callBack) => {
	return axios.post('pig-manage/skill/updateStatus', params).then((res) => {
		if (_callBack) {
			_callBack();
		}
		return res.data;
	})
}
// -----------------点赞-------------------------------
export const getLikeDetail = (params) => {
	return axios.get('pig-manage/skill/getLikeDetail', {
		params: params
	}).then((res) => {
		return res.data;
	})
}
/**
 * @name: 获取大类
 * @test: test font
 * @msg: 
 * @param {type} 
 * @return: 
 */

export const getSkillCategory = (params,_callBack) => {
	return axios.post('pig-manage/skill/getSkillCategory', params).then((res) => {
		if (_callBack) {
			_callBack();
		}
		return res.data;
	})
}
/**
 * @name: 获取技能
 * @test: test font
 * @msg: 
 * @param {type} 
 * @return: 
 */
export const getSkillCategorySecond = (params,_callBack) => {
	return axios.post('pig-manage/skill/getSkillCategorySecond', params).then((res) => {
		if (_callBack) {
			_callBack();
		}
		return res.data;
	})
}
/**
 * @name: 新增技能
 * @test: test font
 * @msg: 
 * @param {type} 
 * @return: 
 */
export const addSkillData = (params,_callBack) => {
	return axios.post('pig-manage/skill/add', params).then((res) => {
		if (_callBack) {
			_callBack();
		}
		return res.data;
	})
}
/**
 * @name: 修改技能
 * @test: test font
 * @msg: 
 * @param {type} 
 * @return: 
 */
export const updateSkillData = (params,_callBack) => {
	return axios.post('pig-manage/skill/update', params).then((res) => {
		if (_callBack) {
			_callBack();
		}
		return res.data;
	})
}
