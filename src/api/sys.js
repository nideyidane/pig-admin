/*
 * @Author: zhongbin.chen
 * @Date: 2019-02-26 09:47:57
 * @Last Modified by: zhongbin.chen
 * @Last Modified time: 2019-02-28 22:22:21
 */
// 系统管理


import axios from './httpConfig.js'
import qs    from  'qs'

// -----------------用户管理-------------------------------
export const getUserList = (params) =>{
	return axios.get('sys/user/list', {params: params}).then((res) =>{
		return res.data;
	})
}
// 根据部门选择角色
export const getRoleListByDept = (params) =>{
	return axios.get('sys/role/select', {params: params}).then((res) =>{
		return res.data;
	})
}

export const saveUser = (params) =>{
	return axios.post('sys/user/save', params).then((res) =>{
		return res.data;
	})
}
export const updateUser = (params) =>{
	return axios.post('sys/user/update', params).then((res) =>{
		return res.data;
	})
}
export const delUser = (params) =>{
	return axios.post('sys/user/delete', params).then((res) =>{
		return res.data;
	})
}
export const getUser = (params) =>{
	return axios.get('sys/user/info/'+params).then((res) =>{
		return res.data;
	})
}
// -----------------部门管理-------------------------------
// 数据列表
export const getDeptList = (params) =>{
	return axios.get('sys/dept/list', {params: params}).then((res) =>{
		return res.data;
	})
}
// 删除
export const deptDel = (param) =>{
	let params = qs.stringify(param)
	return axios.post('sys/dept/delete', params, {
		headers:{
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}).then((res) =>{
		return res.data;
	})
}
// 新增
export const deptAdd = (params) =>{
	return axios.post('sys/dept/save', params).then((res) =>{
		return res.data;
	})
}
// 编辑
export const deptUpdate = (params) =>{
	return axios.post('sys/dept/update', params).then((res) =>{
		return res.data;
	})
}
// 产品线列表
export const productSelect = (params) =>{
	return axios.get('sys/dept/productList', {params: params}).then((res) =>{
		return res.data;
	})
}

// -----------------角色管理-------------------------------
export const getRoleList = (params) =>{
	return axios.get('sys/role/list', {params: params}).then((res) =>{
		return res.data;
	})
}
export const saveRole = (params) =>{
	return axios.post('sys/role/save', params).then((res) =>{
		return res.data;
	})
}
export const updateRole = (params) =>{
	return axios.post('sys/role/update', params).then((res) =>{
		return res.data;
	})
}
export const delRole = (params) =>{
	return axios.post('sys/role/delete', params).then((res) =>{
		return res.data;
	})
}
export const getRole = (params) =>{
	return axios.get('sys/role/info/'+params).then((res) =>{
		return res.data;
	})
}
// -----------------菜单管理-------------------------------
export const getMenuList = (params) =>{
	return axios.get('sys/menu/list', {params: params}).then((res) =>{
		return res.data;
	})
}

export const getMenuSelect = (params) =>{
	return axios.get('sys/menu/select', {params: params}).then((res) =>{
		return res.data;
	})
}

export const saveMenu = (params) =>{
	return axios.post('sys/menu/save', params).then((res) =>{
		return res.data;
	})
}

export const updateMenu = (params) =>{
	return axios.post('sys/menu/update', params).then((res) =>{
		return res.data;
	})
}

export const delMenu = (param) =>{
	let params = qs.stringify(param)
	return axios.post('sys/menu/delete', params, {
		headers:{
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}).then((res) =>{
		return res.data;
	})
}
export const getMenuInfo = (params) =>{
	return axios.get('sys/menu/info/'+params).then((res) =>{
		return res.data;
	})
}

