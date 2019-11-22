<template>
    <section>
        <el-card v-show="!isShow" class="box-card">
            <el-row>
                <el-col :span="24">
                    <!--表单-->
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item>
                            <el-input v-model="searchParam.username" placeholder="输入用户名" class="width240" clearable=""></el-input>
                        </el-form-item>
                        <el-button type="default" icon="el-icon-search" @click="getTableList">查询</el-button>
                        <el-button type="primary" @click="add(1)" icon="el-icon-plus">新增</el-button>
                        <el-button type="primary" @click="edit(2)" icon="el-icon-edit-outline">修改</el-button>
                        <el-button type="danger" @click="del" icon="el-icon-delete">删除</el-button>
                    </el-form>
                    <!--表格-->
                    <el-table :data="tableData" border :default-sort="{prop: 'name', order: 'descending'}" @selection-change="handleSelectionChange" style="width: 100%" height="600">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="username" label="用户名" sortable width="120"></el-table-column>
                        <el-table-column prop="deptName" label="所属部门" sortable width="120"></el-table-column>
                        <el-table-column prop="email" label="邮箱"></el-table-column>
                        <el-table-column prop="mobile" label="手机号"></el-table-column>
                        <el-table-column prop="status" label="状态">
                            <template slot-scope="scope">
                                <el-tag type="success" v-if="scope.row.status==1">正常</el-tag>
                                <el-tag type="danger" v-if="scope.row.status==0">禁用</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" sortable label="创建时间"></el-table-column>
                    </el-table>
                    <div class="block">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="totalCount"></el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-card>
        <el-card v-show="isShow" class="cardBox">
            <el-row>
                <p class="titleName">{{titleName}}</p>
                <el-col :span="8">
                    <el-form ref="form" :model="form" label-width="100px" :rules="ruleForm">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="form.username" placeholder="用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="用户昵称">
                            <el-input v-model="form.nickname" placeholder="用户姓名（或企业名）"></el-input>
                        </el-form-item>
                        <el-form-item label="所属部门" prop="deptName">
                            <el-input v-model="form.deptName" class="readonly" :readonly="true" @click.native="getTree"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input v-model="form.email" placeholder="邮箱"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号">
                            <el-input v-model="form.mobile" placeholder="手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="角色" prop="roleIdList">
                            <el-checkbox-group v-model="form.roleIdList" @change="handleChecked" :min="1">
                                <div class="checkBox">
                                    <el-checkbox v-for="item in roles" :label="item.roleId" :key="item.roleId">{{item.roleName}}</el-checkbox>
                                </div>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-radio-group v-model="form.status">
                                <el-radio :label="0">禁用</el-radio>
                                <el-radio :label="1">正常</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('form')">确定</el-button>
                            <el-button @click="cancel">返回</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <el-dialog title="选择部门" width="400px" :visible="dialogFormVisible" size="tiny" :before-close="handleClose">
            <el-tree :data="departmentData" show-checkbox default-expand-all node-key="deptId" ref="treeForm" highlight-current :props="defaultProps" check-strictly @check-change="handleClick" :default-checked-keys="currentSelected">
            </el-tree>
            <span slot="footer">
                <el-button type="primary" size="small" @click="handleSure">确定</el-button>
                <el-button size="small" @click="handleClose">取消</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script type="text/ecmascript-6">
const ERR_OK = "000";
import {
    getUserList,
    getDeptList,
    getRoleListByDept,
    saveUser,
    updateUser,
    delUser,
    getUser
} from "@/api/sys";
import { treeData } from "@/util/util";
import treeTable from "@/components/treeTable";
import alertTip from "@/mixins/alertTip";
import { hex_sha1 } from "@/util/sha1";

export default {
    name: "user",
    data() {
        let userRule = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入用户名"));
            } else if (value === 'admin') {
                callback(new Error("用户名不能为admin"));
            } else if (value.length < 2 || value.length > 20) {
                callback(new Error("用户名长度限定为2-20位！"));
            } else {
                callback();
            }
        };
        return {
            isShow: false,
            currentType: "",
            multipleSelection: [],
            selsectLen: "",
            selectedOptions: [],
            departmentData: [],
            defaultProps: {
                children: "children",
                label: "name"
            },
            currentSelected: [],
            titleName: "",
            dialogFormVisible: false,
            listData: [],
            i: 1,
            roles: [],
            tableData: [],
            form: {
                username: "",
                deptId: "",
                deptName: "",
                mobile: "",
                status: 1,
                email: "",
                nickname: "",
                password: "",
                newPassword: "",
                roleIdList: []
            },
            ruleForm: {
                username: [
                    {
                        required: true,
                        validator: userRule,
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur"
                    }
                ],
                roleIdList: [
                    {
                        required: true,
                        message: "请选择角色",
                        trigger: "blur"
                    }
                ],
                deptName: [
                    {
                        required: true,
                        message: "请选择部门",
                        trigger: "blur"
                    }
                ]
            },
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            table_index: 999,
            searchParam: {
                limit: 10,
                page: 1,
                sidx: "",
                order: "",
                _search: false,
                username: ""
            },
            deptTreeData: [],
            userId: ''
        };
    },
    created() {
        this.getTableList();
        this.getDeptList();
    },
    components: { treeTable },
    mixins: [alertTip],
    inject: ["reload"],
    methods: {
        handleChecked(val) {
            console.log(val);
            console.log(this.form.roleIdList);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.selsectLen = val.length;
            this.userId = val[0].userId;
            console.log(val);
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
        handleClose() {
            this.dialogFormVisible = false;
        },
        handleSure() {
            this.dialogFormVisible = false;
            let data = this.$refs.treeForm.getCheckedNodes();
            if (data) {
                const { name: deptName, deptId } = data[0];
                this.form = {
                    ...this.form,
                    deptName,
                    deptId
                };
                this.currentSelected[0] = data[0].deptId;
            }
            this.getRoleData(data[0].deptId);
            this.form.roleIdList = [];
        },
        async getDeptList() {
            this.listData = await getDeptList();
        },
        getRoleData(id) {
            getRoleListByDept({ deptId: id }).then(res => {
                if (res.code == 0) {
                    this.roles = res.list;
                }
            });
        },
        // 初始化节点树
        getTree() {
            this.departmentData = [];
            this.departmentData = treeData(this.listData, 0);

            this.dialogFormVisible = true;
            this.currentSelected = [];
            if (this.form.deptName == "优必选科技公司") {
                this.currentSelected.push(1);
            } else {
                this.listData.forEach(li => {
                    if (li.name == this.form.deptName) {
                        this.currentSelected = [];
                        this.currentSelected.push(li.deptId);
                    }
                });
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if (this.currentType == 1) {
                        this.form.newPassword = hex_sha1(this.form.password);
                        saveUser(this.form).then(res => {
                            if (res.code == 0) {
                                this.tip("新增成功！", "success");
                                this.isShow = false;
                            } else {
                                Console.log(res.msg);
                            }
                        });
                    } else if (this.currentType == 2) {
                        if (this.form.password != '******') {
                            this.form.newPassword = hex_sha1(this.form.password);
                        }
                        updateUser(this.form).then(res => {
                            if (res.code == 0) {
                                this.tip("修改成功！", "success");
                                this.isShow = false;
                            } else {
                                Console.log(res.msg);
                            }
                        });
                    }
                    this.reload();
                    this.getTableList();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        cancel() {
            this.isShow = false;
            this.form = {};
        },
        // 新增
        add(li) {
            this.isShow = true;
            this.titleName = "新增";
            this.form.deptName = "优必选科技公司";
            this.form.deptId = 1;
            this.form.roleIdList = [9];
            this.currentType = li;
            this.currentSelected = [1];
            this.getRoleData(1);
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
            getUser(this.userId).then((res) => {
                if (res.code == 0) {
                    // const { deptId, deptName, email, mobile, newPassword, nickname, password, roleIdList, status, username, userId, salt} = res.user;
                    this.form = res.user;
                    this.form.password = '******'
                } else {
                    console.log(res.msg);
                }
            })
        },
        // 删除
        del() {
            if (this.selsectLen == 0) {
                this.tip("请选择一条记录", "warning");
                return;
            } else if (this.selsectLen > 1) {
                this.tip("只能选择一条记录", "warning");
                return;
            }
            let params = [];
            params.push(this.multipleSelection[0].userId);
            this.$confirm("确认删除吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                cancelButtonClass: "cancel"
            })
            .then(() => {
                delUser(params).then(res => {
                    if (res.code == 0) {
                        this.tip("操作成功！", "success");
                        this.getTableList();
                    }
                });
            })
            .catch(() => {});
        },
        getTableList() {
            getUserList(this.searchParam).then(res => {
                console.log(res);
                if (res.code == 0) {
                    this.tableData = res.page.list;
                    this.pageSize = res.page.pageSize;
                    this.totalCount = res.page.totalCount;
                } else {
                    console.log(res.msg);
                }
            });
        },
        handleSave() {
            this.$confirm("确认提交吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                cancelButtonClass: "cancel"
            })
                .then(() => {
                    this.editLoading = true;
                    saveUser(this.form).then(res => {
                        console.log("result=======>", res);
                        if (res.code == 0) {
                            this.$message({
                                message: "操作成功！",
                                type: "success"
                            });
                            this.editLoading = false;
                            this.dialogFormVisible = false;
                            this.getTableList();
                        } else {
                            this.$message({
                                message: "操作失败！",
                                type: "error"
                            });
                        }
                    });
                })
                .catch(() => {});
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            console.log(`当前页: ${val}`);
            this.searchParam.page = val;
            this.getTableList();
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
.checkBox {
    width: 600px;
    .el-checkbox {
        width: 150px;
        margin: 0 20px 0 0 !important;
    }
}
</style>
