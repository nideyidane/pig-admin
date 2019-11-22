/*
 * @Author: juliet.zhu 
 * @Date: 2019-02-26 15:06:49 
 * @Last Modified by: zhongbin.chen
 * @Last Modified time: 2019-02-26 21:54:56
 */

"use strict";

const arrayToTree = (data, parent=0) =>{
	let tree = [];
	let temp;
	for (let i = 0; i < data.length; i++) {
		if (data[i].parentId == parent) {
			var obj = data[i];
			obj.label =  data[i].name;
			obj.value =  data[i].deptId;

			temp = arrayToTree(data, data[i].deptId);
			if (temp.length > 0) {
				obj.children = temp;
			}
			tree.push(obj);
		}
	}
	return tree;
}
const treeData = (data, parent) =>{
	let tree = [];
	let temp;
	for (let i = 0; i < data.length; i++) {
		if (data[i].parentId == parent) {
			var obj = data[i];

			temp = treeData(data, data[i].deptId);
			if (temp.length > 0) {
				obj.children = temp;
			}
			tree.push(obj);
		}
	}
	return tree;
}
const treeMenu = (data, parent) =>{
	let tree = [];
	let temp;
	for (let i = 0; i < data.length; i++) {
		if (data[i].parentId == parent) {
			var obj = data[i];

			temp = treeMenu(data, data[i].menuId);
			if (temp.length > 0) {
				obj.children = temp;
			}
			tree.push(obj);
		}
	}
	return tree;
}


export {
    arrayToTree,
    treeData,
    treeMenu
}
