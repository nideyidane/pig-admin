/*
 * @Descripttion: 
 * @version: 
 * @Author: dignli.su
 * @Date: 2019-03-14 15:36:44
 * @LastEditors: dignli.su
 * @LastEditTime: 2019-10-30 17:34:48
 */
const constants = {};
constants.SUCCESS =0;//请求成功的标志

const config = {
    //domain: 'https://internal.ubtrobot.com/',
    //domain: 'https://test79.ubtrobot.com/operation_service/',
    domain: 'https://prerelease.ubtrobot.com/',
    //domain:window.global_config.BASE_URL,
    redirectUrl: 'http://passport.corp.visiondk.com/login?redirect_url=',
    name: '运营管理系统',
    vision: '0.1',
    author: 'dingli.su',
    email: 'dingli.su@ubtrobot.com',
}

export {
    constants,
    config
}