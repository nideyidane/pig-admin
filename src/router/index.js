/*
 * @Descripttion: 
 * @version: 
 * @Author: dignli.su
 * @Date: 2019-07-30 14:39:56
 * @LastEditors: dignli.su
 * @LastEditTime: 2019-11-18 17:20:43
 */
import Vue from 'vue'
import store from '../store/index'
import Router from 'vue-router'


Vue.use(Router)

const Nav = () => import('components/Nav.vue');
const Home = () => import('components/Home.vue');
const Login = () => import('components/Login.vue');
const NoData = () => import('components/NoData.vue');

// 系统设置
const User = () => import('components/sys/User.vue');
const Dept = () => import('components/sys/Dept.vue');
const Role = () => import('components/sys/Role.vue');
const Menu = () => import('components/sys/Menu.vue');


// 用户列表
const Userlist = () => import('components/userManagement/User.vue');

// 消息推送
const systemMessages = () => import('components/notification/systemMessages.vue')
const pushMessages = () => import('components/notification/pushMessages.vue')

// 节日祝福
const festival = () => import('components/festival/festival.vue')

// 技能列表
const skillsList = () => import('components/skillsList/skillsList.vue')

// 众创空间
const create = () => import('components/create/create.vue')

// 轮播图
const carousel = ()=> import('components/carousel/carousel.vue')

const router = new Router({
	// mode: 'history',
	routes: [{
		path: '/',
		component: Login,
		redirect: '/login',
		children: [{
			path: '/login',
			component: Login,
			name: 'login',
			meta: {
				title: '优必选运营管理平台'
			}
		}]
	}, {
		path: '/',
		component: Nav,
		children: [{
			path: '/home',
			component: Home,
			name: 'home',
			meta: {
				title: '欢迎页'
			}
		}, {
			path: '/modules/sys/user',
			component: User,
			name: 'user',
			meta: {
				title: '用户管理'
			}
		}, {
			path: '/modules/sys/dept',
			component: Dept,
			name: 'dept',
			meta: {
				title: '部门管理'
			}
		}, {
			path: '/modules/sys/role',
			component: Role,
			name: 'role',
			meta: {
				title: '角色管理'
			}
		}, {
			path: '/modules/sys/menu',
			component: Menu,
			name: 'menu',
			meta: {
				title: '菜单管理'
			}
		}, {
			path: '/modules/userManagement/User',
			component: Userlist,
			name: 'Userlist',
			meta: {
				title: '用户列表'
			}
		}, {
			path: '/modules/notification/systemMessages',
			component: systemMessages,
			name: 'systemMessages',
			meta: {
				title: '系统消息'
			}
		}, {
			path: '/modules/notification/pushMessages',
			component: pushMessages,
			name: 'pushMessages',
			meta: {
				title: '通知栏消息'
			}
		}, {
			path: '/modules/festival/festival',
			component: festival,
			name: 'festival',
			meta: {
				title: '节日祝福'
			}
		}, {
			path: '/modules/skillsList/skillsList',
			component: skillsList,
			name: 'skillsList',
			meta: {
				title: '技能列表'
			}
		}, {
			path: '/modules/create/create',
			component: create,
			name: 'create',
			meta: {
				title: '众创空间',
				// requireAuth: true
			}
		},
		{
			path: '/modules/carousel/carousel',
			component: carousel,
			name: 'carousel',
			meta: {
				title: '轮播图',
				// requireAuth: true
			}
		}]
	}]
})
export default router

// router.beforeEach((to, from, next) => {
//     if (to.meta.requireAuth) { // 判断跳转的路由是否需要登录
//         if (store.state.userKey) { // vuex.state判断token是否存在
//             next() // 已登录
//         } else {
//             next({
//                 path: '/login',
//                 query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
//             })
//         }
//     } else {
//        next()
//     }
// })
