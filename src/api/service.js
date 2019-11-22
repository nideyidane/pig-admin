/*
 * @Author: zhongbin.chen
 * @Date: 2019-02-20 11:23:15
 * @Last Modified by: zhongbin.chen
 * @Last Modified time: 2019-03-04 10:48:33
 */
import axios from './httpConfig.js'
import qs    from  'qs'

// 获取随机码
export const getCode = (params) =>{
	return axios.get('pig-manage/captcha.jpg', {params: params}).then((res) =>{
		return res.data;
	})
}
// 获取菜单列表
export const getMenuList = (params) =>{
	return axios.get('pig-manage/sys/menu/nav', {params: params}).then((res) =>{
		return res.data;
	})
}
export const changeUserPwd = (param) =>{
	let params = qs.stringify(param)
	return axios.post('pig-manage/sys/user/password', params, {
		headers:{
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}).then((res) =>{
		return res.data;
	})
}
// 登出
export const loginOut = (params) =>{
	return axios.post('pig-manage/sys/logout', params).then((res) => {
		console.log(res)
		return res.data;
	})
}




