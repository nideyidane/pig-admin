<template>
    <section>
        <el-card class="box-card" v-show="!isShow">
            <el-row>
                <el-col :span="24">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item>
                            <el-button type="primary" @click="add(1)" icon="el-icon-plus">新增</el-button>
                            <el-button type="primary" @click="edit(2)" icon="el-icon-edit-outline">修改</el-button>
                            <el-button type="danger" @click="del" icon="el-icon-delete">删除</el-button>
                        </el-form-item>
                    </el-form>
                    <tree-table :data="listData" :columns="columns" v-on:selection="selection" border></tree-table>
                </el-col>
            </el-row>
        </el-card>

        <el-card v-show="isShow" class="cardBox">
            <el-row>
                <p class="titleName">{{titleName}}</p>
                <el-col :span="8">
                    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="padding-10">
						<el-form-item label="类型" prop="type">
							<el-radio-group v-model="ruleForm.type" @change="typeChange">
								<el-radio :label="0">目录</el-radio>
								<el-radio :label="1">菜单</el-radio>
								<el-radio :label="2">按钮</el-radio>
							</el-radio-group>
                        </el-form-item>
                        <el-form-item label="菜单名称" prop="name">
                            <el-input v-model="ruleForm.name" clearable placeholder="菜单名称或按钮名称"></el-input>
                        </el-form-item>
                        <el-form-item label="上级菜单" prop="parentName">
                            <el-input v-model="ruleForm.parentName" class="readonly" :readonly="true" @click.native="getTree"></el-input>
                        </el-form-item>
						<el-form-item label="菜单URL" prop="url" v-if="ruleForm.type==1">
                            <el-input v-model="ruleForm.url" clearable placeholder="菜单URL"></el-input>
                        </el-form-item>
						<el-form-item label="授权标识" prop="perms"  v-if="ruleForm.type!=0">
                            <el-input v-model="ruleForm.perms" clearable placeholder="授权标识"></el-input>
                        </el-form-item>
						<el-form-item label="排序号" prop="orderNum"  v-if="ruleForm.type!=2">
                            <el-input v-model="ruleForm.orderNum" clearable placeholder="排序号"></el-input>
                        </el-form-item>
						<el-form-item label="图标" prop="icon" v-if="ruleForm.type!=2">
                            <el-input v-model="ruleForm.icon" clearable placeholder="菜单图标"></el-input>
							<p>获取图标：<a href="http://fontawesome.io/icons/">http://fontawesome.io/icons/</a></p>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                            <el-button @click="cancel">返回</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-dialog title="选择菜单" width="400px" :visible="dialogFormVisible" size="tiny" :before-close="handleClose">
                <el-tree :data="departmentData" show-checkbox default-expand-all node-key="menuId" ref="treeForm" highlight-current :props="defaultProps" check-strictly @check-change="handleClick" :default-checked-keys="currentSelected">
                </el-tree>
                <span slot="footer">
                    <el-button type="primary" size="small" @click="handleSure">确定</el-button>
                    <el-button size="small" @click="handleClose">取消</el-button>
                </span>
            </el-dialog>
        </el-card>
    </section>
</template>
<script type="text/ecmascript-6">
const ERR_OK = "000";
import {
    getMenuList,
    delMenu,
    saveMenu,
	updateMenu,
	getMenuSelect,
	getMenuInfo,
} from "@/api/sys";
import { treeData,treeMenu } from "@/util/util";
import treeTable from "@/components/treeTable";
import alertTip from "@/mixins/alertTip";

export default {
    name: "dept",
    data() {
        return {
            tableData: [],
            listData: [],
            currentPage: 1,
            totalPage: 0,
            dialogFormVisible: false,
            isTree: false,
            columns: [
                {
                    text: "菜单名称",
                    value: "name"
				},
				{
                    text: "上级菜单",
                    value: "parentName"
                },
                {
                    text: "图标",
                    value: "icon"
                },
                {
                    text: "类型",
                    value: "type"
				},
				{
                    text: "排序号",
                    value: "orderNum"
				},
				{
                    text: "菜单URL",
                    value: "url"
				},
				{
                    text: "授权标识",
                    value: "perms"
                }
            ],
            isShow: false,
            ruleForm: {
				type: 1,
				name: '',
				perms:'',
                parentName: '',
				url:'',
				icon:'',
				parentId: 0,
				orderNum: 0,
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入菜单名称",
                        trigger: "blur"
                    }
                ],
                productNo: [
                    { required: true, message: "请输入产品线", trigger: "blur" }
                ],
                parentName: [
                    {
                        required: true,
                        message: "请选择上级部门",
                        trigger: "blur"
                    }
                ]
            },
            titleName: "",
            departmentData: [],
            defaultProps: {
                children: "children",
                label: "name"
            },
            i: 1,
            productOptions: [],
            multipleSelection: [],
            selsectLen: "",
            currentSelected: [],
            currentType: ""
        };
    },
    created() {
		this.productList();
		this.getMenuTreeSelect();
    },
    components: { treeTable },
    mixins: [ alertTip ],
    inject: [ "reload" ],
    methods: {
        selection(val) {
            this.multipleSelection = val;
            this.selsectLen = this.multipleSelection.length;
            if (this.selsectLen != 0) {
                const {
                    menuId,
                    name,
                    orderNum,
                    parentId,
                } = this.multipleSelection[0];
                this.ruleForm = { menuId, name, orderNum, parentId, };
            }

            if (this.multipleSelection[0]&&!this.multipleSelection[0].parentName) {
                this.ruleForm.parentName = "一级菜单";
            }
		},
		// 类型改变
		typeChange(val){
			console.log('---->',val);
		},
        // 弹框
        handleSure() {
            this.dialogFormVisible = false;
            let data = this.$refs.treeForm.getCheckedNodes();
            if (data) {
                const { name: parentName, orderNum, parentId } = data[0];
                this.ruleForm = {
                    ...this.ruleForm,
                    orderNum,
                    parentId,
                    parentName
                };
                this.currentSelected[0] = data[0].menuId;
            }
        },
        handleClose(done) {
            this.dialogFormVisible = false;
        },
        handleClick(data, checked, node) {
            this.i++;
            if (this.i % 2 == 0) {
                if (checked) {
                    this.$refs.treeForm.setCheckedNodes([]);
                    this.$refs.treeForm.setCheckedNodes([data]);
                    //交叉点击节点
                } else {
                    this.$refs.treeForm.setCheckedNodes([]);
                    //点击已经选中的节点，置空
                }
            }
        },
        // 初始化节点树
        getTree() {
            this.departmentData = [];
            const obj = {};
            obj.name = "一级菜单";
            obj.menuId = 0;
            obj.orderNum = 0;
            obj.parentId = 0;
            obj.children = this.productOptions;
            this.departmentData.push(obj);

            this.dialogFormVisible = true;
            this.currentSelected = [];
            if (this.ruleForm.parentName == "一级菜单") {
                this.currentSelected.push(0);
            } else {
                this.tableData.forEach(li => {
                    if (li.name == this.ruleForm.parentName) {
                        this.currentSelected = [];
                        this.currentSelected.push(li.menuId);
                    }
                });
            }
        },
        del() {
            if (this.selsectLen == 0) {
                this.tip("请选择一条记录", "warning");
                return;
            } else if (this.selsectLen > 1) {
                this.tip("只能选择一条记录", "warning");
                return;
            }
            const params = { menuId: this.multipleSelection[0].menuId };

            this.$confirm("确认删除吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                cancelButtonClass: "cancel"
            })
            .then(() => {
                delMenu(params).then(res => {
                    if (res.code == 0) {
                        this.tip("操作成功！", "success");
                        this.productList();
                    }
                });
            })
            .catch(() => {});
        },
        getMenuTreeSelect() {
            getMenuSelect().then(res => {
                if (res.code == 0) {
					this.productOptions = treeMenu(res.menuList, 0);
					console.log(this.productOptions);
                } else {
                    console.log(res.msg);
                }
            });
        },
        // 新增
        add(li) {
            this.isShow = true;
            this.titleName = "新增";
            this.ruleForm.parentName = "一级菜单";
			this.currentType = li;
		},
		// 获取详情
		getMenuDetail(){
			getMenuInfo(this.ruleForm.menuId).then(res => {
                if (res.code == 0) {
					this.ruleForm = res.menu;
					if(res.menu.parentId==0){
						this.ruleForm.parentName = '一级菜单';
					}
					console.log(this.ruleForm);
                } else {
                    console.log(res.msg);
                }
            });
		},
        // 编辑
        edit(li) {
            if (this.selsectLen == 0) {
                this.tip("请选择一条记录", "warning");
                return;
            } else if (this.selsectLen > 1) {
                this.tip("只能选择一条记录", "warning");
                return;
            }
            this.isShow = true;
            this.titleName = "编辑";
			this.currentType = li;
			this.getMenuDetail();
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.currentType == 1) {
                        saveMenu(this.ruleForm).then(res => {
                            if (res.code == 0) {
                                this.tip("新增成功！", "success");
                                this.isShow = false;
                            } else {
                                console.log(res.msg);
                            }
                        });
                    } else if (this.currentType == 2) {
                        updateMenu(this.ruleForm).then(res => {
                            if (res.code == 0) {
                                this.tip("修改成功！", "success");
                                this.isShow = false;
                            } else {
                                console.log(res.msg);
                            }
                        });
                    }
                    this.reload();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        cancel() {
			this.isShow = false;
            this.ruleForm = {type: 1,
				name: '',
				perms:'',
                parentName: '',
				url:'',
				icon:'',
				parentId: 0,
				orderNum: 0,
			};
        },
        async productList() {
            this.tableData = await getMenuList();
            this.totalPage = this.tableData.length;
            this.listData = treeMenu(this.tableData, 0);
        },
        handleEdit(index, row) {
            this.dialogFormVisible = true;
            this.form = Object.assign({}, row);
            this.table_index = index;
        },
        handleSave() {
            this.$confirm("确认提交吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                cancelButtonClass: "cancel"
            })
            .then(() => {
                this.editLoading = true;
                let date = this.form.date;
                if (typeof date === "object") {
                    date = [
                        date.getFullYear(),
                        date.getMonth() + 1,
                        date.getDate()
                    ].join("-");
                    this.form.date = date;
                }
                this.tableData.splice(this.table_index, 1, this.form);
                this.$message({
                    message: "操作成功！",
                    type: "success"
                });
                this.editLoading = false;
                this.dialogFormVisible = false;
            })
            .catch(() => {});
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            console.log(`当前页: ${val}`);
        }
    }
};
</script>
<style lang="scss">
.el-pagination {
    text-align: center;
    margin-top: 30px;
}
.el-message-box__btns .cancel {
    float: right;
    margin-left: 10px;
}
</style>
