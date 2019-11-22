<!--
 * @Descripttion: 
 * @version: 
 * @Author: dignli.su
 * @Date: 2019-07-30 14:39:56
 * @LastEditors: dignli.su
 * @LastEditTime: 2019-11-19 19:19:30
 -->
<template>
  <section>
    <el-card class="box-card">
      <el-row>
        <el-col :span="24">
          <!--表单-->
          <el-form :inline="true" class="demo-form-inline">
            <el-select
              v-model="searchParam.searchType"
              style="width:200px;float:left;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-form-item>
              <el-input
                maxlength="20"
                v-model="searchParam.searchKey"
                placeholder="输入用户名/ID号/设备序列号/流水号可查询数据"
                style="width:400px;float:left;"
                clearable
              ></el-input>
            </el-form-item>
            <el-button type="default" icon="el-icon-search" @click="getTableList(1)">查询</el-button>
            <!-- <el-button type="primary" @click="add(1)" icon="el-icon-plus">新增</el-button>
            <el-button type="primary" @click="edit(2)" icon="el-icon-edit-outline">修改</el-button>
            <el-button type="danger" @click="del" icon="el-icon-delete">删除</el-button>-->
          </el-form>
          <!--表格-->
          <el-table
            :data="tableData"
            border
            :default-sort="{prop: 'name', order: 'descending'}"
            @selection-change="handleSelectionChange"
            style="width: 100%"
            height="600"
          >
            <el-table-column align="center" type="index" :index="indexMethod" width="50"></el-table-column>
            <el-table-column label="用户ID" width="100" align="center">
              <template slot-scope="scope">{{ scope.row.userId }}</template>
            </el-table-column>
            <el-table-column label="登录方式" width="100" align="center">
              <template slot-scope="scope">{{ scope.row.loginType }}</template>
            </el-table-column>
            <el-table-column label="用户名" width="100" align="center">
              <template slot-scope="scope">{{ scope.row.thirdUserName }}</template>
            </el-table-column>
            <el-table-column label="设备序列号" width="150" align="center">
              <template slot-scope="scope">{{ scope.row.equipmentSeq }}</template>
            </el-table-column>
            <el-table-column label="工厂流水号" width="150" align="center">
              <template slot-scope="scope">{{ scope.row.serialNumber }}</template>
            </el-table-column>
            <el-table-column label="首次激活时间" width="150" align="center">
              <template slot-scope="scope">{{ scope.row.activeTime }}</template>
            </el-table-column>
            <el-table-column label="设备硬件版本" width="150" align="center">
              <template slot-scope="scope">{{ scope.row.hardwareVersion }}</template>
            </el-table-column>
            <el-table-column label="设备软件版本" width="150" align="center">
              <template slot-scope="scope">{{ scope.row.softwareVersion }}</template>
            </el-table-column>
            <el-table-column label="选择分组" width="150" align="center">
              <template slot-scope="scope">
                <el-select
                  maxlength="20"
                  allow-create
                  filterable
                  clearable
                  v-model="scope.row.groupName"
                  placeholder="请选择"
                  @change="joinGroup(scope.row,$event)"
                >
                  <el-option
                    v-for="item in optionsEmoticon"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button
                  :disabled="scope.row.isBind==0?true:false"
                  type="primary"
                  @click="unBind(scope.row)"
                >强制解绑</el-button>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">{{ scope.row.isBind==0?"未绑定":"已绑定" }}</template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              style="text-align:center;margin:10px;"
              background
              layout="total,prev, pager, next"
              :page-count="page.pages"
              :page-size="20"
              :total="page.total"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </section>
</template>
<script type="text/ecmascript-6">
const ERR_OK = "000";
import {
  getUserList,
  getGroup,
  joinGroup,
  unBind,
  addGroup
} from "@/api/userManagement";
import { treeData } from "@/util/util";
import treeTable from "@/components/treeTable";
import alertTip from "@/mixins/alertTip";
import { hex_sha1 } from "@/util/sha1";

export default {
  name: "user",
  data() {
    return {
      selectOptions: [
        {
          value: "1",
          label: "ID号"
        },
        {
          value: "2",
          label: "用户名"
        },
        {
          value: "3",
          label: "设备序列号"
        },
        {
          value: "4",
          label: "工厂流水号"
        }
      ],
      multipleSelection: [],
      selsectLen: "",
      selectedOptions: [],
      optionsEmoticon: [
        //分组
      ],
      currentSelected: [],
      tableData: [],
      page: {
        //当前表格属性
        current: 1,
        total: 0,
        pages: 0,
        size: 20,
        total: 0
      },
      searchParam: {
        index: 1,
        size: 20,
        searchKey: "",
        searchType: "1"
      },
      userId: ""
    };
  },
  created() {
    this.getTableList(1);
    this.getGroup();
    var lett = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key == 13) {
        lett.getTableList(1);
      }
    };
  },
  mixins: [alertTip],
  inject: ["reload"],
  methods: {
    // id计算
    indexMethod(index) {
      return (this.page.current - 1) * 20 + index + 1;
    },
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
    // 获取列表数据
    getTableList(val) {
      this.searchParam.index = val;
      getUserList(this.searchParam).then(res => {
        console.log(res);
        if (res.status) {
          this.tableData = res.models.records;
          this.page = {
            current: res.models.current,
            total: res.models.total,
            pages: res.models.pages,
            size: res.models.size,
            total: res.models.total
          };
          console.log(this.tableData);
        } else {
          console.log(res.msg);
        }
      });
    },
    // 获取分组数据
    getGroup(_callback) {
      getGroup(this.searchParam).then(res => {
        console.log(res);
        if (res.status) {
          this.optionsEmoticon = [];
          res.models.forEach(el => {
            var child = {
              value: el.groupId,
              label: el.groupName
            };
            this.optionsEmoticon.push(child);
          });
          // if (_callback) {
          //   _callback();
          // }
        } else {
          console.log(res.msg);
        }
      });
    },
    //当前页切换
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getTableList(val);
    },
    // 加入分组
    joinGroup(row, event) {
      if (typeof event == "number") {
        row.groupId = event;
        joinGroup(row)
          .then(res => {
            console.log(res);
            this.getTableList(this.page.current);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.addGroup(row, event);
      }
    },
    // 新增分组
    addGroup(row, groupName) {
      if (groupName) {
        addGroup({ groupName: groupName })
          .then(res => {
            if (res.status) {
              console.log(res);
              var child = {
                value: res.models,
                label: groupName
              };
              this.optionsEmoticon.push(child);
              row.groupId = Number(res.models);
              this.joinGroup(row, Number(res.models));
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    // 强制解绑
    unBind(row) {
      this.$confirm(
        "是否强制解除ID为" +
          row.userId +
          "的用户和序列号为" +
          row.equipmentSeq +
          "的设备的绑定关系？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          unBind(row)
            .then(res => {
              console.log(res);
              if (res.status) {
                this.$message({
                  type: "success",
                  message: "解绑成功"
                });
                this.getTableList(this.page.current);
              } else {
                this.$message({
                  type: "info",
                  message: res.info
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {});
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
