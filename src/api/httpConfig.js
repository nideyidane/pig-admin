/*
 * @Author: zhongbin.chen 
 * @Date: 2019-02-20 11:22:30 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-04-15 13:54:08
 */
import axios from 'axios'
import qs from 'qs'
import {
	config
} from "@/util/constant"
import router from "@/router/index"


//Header 配置
// axios.defaults.timeout = 12000
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

//axios.defaults.baseURL = 'http://10.10.20.71:8085/operation/';      //配置接口地址
//axios.defaults.baseURL = 'http://10.10.20.72:8090/pig-manage/';        //业务接口地址 测试环境
axios.defaults.baseURL = config.domain; //业务接口地址 预发布环境

// axios.defaults.proxy.host = '120.25.237.198';
// axios.defaults.proxy.port = '8899';
axios.defaults.withCredentials = false; //表示跨域请求时是否需要使用凭证

//在创建实例时设置配置默认值   
// var instance = axios.create({
//   baseURL: 'https://operation.ubtrobot.com'
// });
//在实例创建后改变默认值
//instance.defaults.headers.common ['Authorization'] = AUTH_TOKEN;

let token = '';
if (JSON.parse(sessionStorage.getItem('userKey'))) {
	token = JSON.parse(sessionStorage.getItem('userKey')).token;
}

// //设置默认请求头
// axios.defaults.headers = {
//     "Content-Type": "application/x-www-form-urlencoded",
//     product: "60201"
//   }

//http拦截器

//序列化POST传参
// axios.interceptors.request.use((config) => {
//   //在发送请求之前做某件事
//   if(config.method  === 'post'){
//     config.data = qs.stringify(config.data);
//   }
//   return config;
// },(error) =>{
//   //alert("错误的传参");
//   return Promise.reject(error);
// });


//请求拦截器
axios.interceptors.request.use(config => {
	// if (config.url.indexOf('login') != -1) {
	// 	delete config.headers.product;
	// } else {
	// 	config.headers.product = '60201';
	// }

	// 配置token
	if (token) {
		config.headers.token = token;
		config.token = {
			'token': token
		}
	}
	return config
}, error => {
	return Promise.reject(error)
})
//响应拦截器
axios.interceptors.response.use(function (response) {
	if (response.data.code === 401) {
		localStorage.clear()
		router.replace({
		  path: '/login',
		  query: {redirect: router.currentRoute.fullPath} 
		})
	  }
	return response;
}, function (error) {
	return Promise.reject(error);
});

export default axios;
