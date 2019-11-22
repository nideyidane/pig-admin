<!--
 * @Descripttion: 
 * @version: 
 * @Author: dignli.su
 * @Date: 2019-08-30 14:43:01
 * @LastEditors: dignli.su
 * @LastEditTime: 2019-11-19 18:45:30
 -->
<template>
  <section>
    <el-card class="box-card">
      <el-row>
        <el-col :span="24">
          <!--表单-->
          <el-form style="float:right;">
            <el-button type="primary" @click="dialogFormVisible = true" icon="el-icon-plus">新增</el-button>
            <!-- <el-button type="primary" @click="edit(2)" icon="el-icon-edit-outline">修改</el-button> -->
            <!-- <el-button type="danger"  icon="el-icon-delete">删除</el-button> -->
          </el-form>
          <el-tabs
            v-model="listGreet.status"
            @tab-click="handleClick"
            style="width:20%;"
          >
            <el-tab-pane label="已推送" name="1">已推送</el-tab-pane>
            <el-tab-pane label="未推送" name="0">未推送</el-tab-pane>
          </el-tabs>

          <!--表格-->
          <el-table
            stripe
            @cell-mouse-enter="handleMouseEnter"
            :data="tableData"
            border
            :default-sort="{prop: 'name', order: 'descending'}"
            @selection-change="handleSelectionChange"
            style="width: 100%"
            height="600"
          >
            <el-table-column align="center" type="index" :index="indexMethod"></el-table-column>
            <el-table-column align="center" label="标题" width="200px">
              <template slot-scope="scope">{{ scope.row.title }}</template>
            </el-table-column>
            <el-table-column align="center" label="内容" min-width="200px">
              <template slot-scope="scope">{{ scope.row.content }}</template>
            </el-table-column>
            <el-table-column align="center" label="推送地址" width="320px">
              <template slot-scope="scope">{{ scope.row.url }}</template>
            </el-table-column>
            <el-table-column align="center" label="推送对象" width="100px">
              <template slot-scope="scope">{{ scope.row.targetName?scope.row.targetName:"全部" }}</template>
            </el-table-column>
            <el-table-column align="center" label="展示类型" width="100px">
              <template slot-scope="scope">{{ scope.row.pushType=='1'?'推广展示':"升级功能" }}</template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" width="180px">
              <template slot-scope="scope">{{ dateVali(scope.row.createTime,scope.row.createTime) }}</template>
            </el-table-column>
            <el-table-column align="center" label="推送时间" width="180px">
              <template slot-scope="scope">{{ dateVali(scope.row.sendTime,scope.row.createTime) }}</template>
            </el-table-column>
            <!-- <el-table-column align="center" label="状态" width="100px">
              <template slot-scope="scope">{{ scope.row.status==0?"未推送":"已推送" }}</template>
            </el-table-column> -->
            <el-table-column label="操作" width="250" align="center" v-if="listGreet.status==0">
              <template slot-scope="scope">
                <!-- <el-button v-show="scope.row.emoticon!=''" type="info">确认通过</el-button> -->
                <el-button
                  :disabled="pushButtonStatus(scope.row)"
                  type="primary"
                  @click="pushMessage(scope.row)"
                >确认推送</el-button>
                <el-button type="warning" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 表单 -->
          <el-dialog
            title="消息推送"
            :visible.sync="dialogFormVisible"
            :show-close="false"
            :close-on-click-modal="false"
          >
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
              v-loading="loading"
            >
              <el-form-item label="消息标题" prop="title" width="30%">
                <el-input v-model.trim="ruleForm.title"></el-input>
              </el-form-item>
              <el-form-item label="消息内容" prop="content">
                <el-input type="textarea" v-model.trim="ruleForm.content"></el-input>
              </el-form-item>
              <el-form-item label="推送地址" prop="url">
                <el-input v-model.trim="ruleForm.url"></el-input>
              </el-form-item>
              <el-form-item label="类型">
                <el-radio-group v-model="ruleForm.pushType">
                  <el-radio-button label="1">推广展示</el-radio-button>
                  <el-radio-button label="2">升级功能</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="推送时间" prop="sendTime">
                <el-date-picker
                  :picker-options="pickerOptions"
                  v-model="ruleForm.sendTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  style="float:left;"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
                <p style="margin:0;float:left;color:red;">（未设置推送时间时将以当前时间进行推送）</p>
              </el-form-item>
              <el-form-item label="推送对象" prop="type" style="width:35%;float:left;">
                <el-select v-model="ruleForm.type" @change="typeChange()" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="用户ID"
                prop="userId"
                style="width:35%;float:left;"
                v-show="ruleForm.type==1"
              >
                <el-input maxlength="9" v-model.number="ruleForm.userId"></el-input>
              </el-form-item>
              <el-form-item
                label="选择群组"
                prop="groupId"
                style="width:35%;float:left;"
                v-show="ruleForm.type==2"
              >
                <el-select v-model="ruleForm.groupId" placeholder="请选择">
                  <el-option
                    v-for="item in optionsEmoticon"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="resetForm('ruleForm')">取消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </div>
          </el-dialog>
          <div class="block">
            <el-pagination
              style="text-align:center;"
              background
              layout="total,prev, pager, next"
              :page-count="page.pages"
              :page-size="20"
              :total="page.total"
              :current-page="page.current"
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
  getMessageList,
  pushMessage,
  addInfor,
  deleteMessage,
  getGroup
} from "@/api/pushMessages";
import { treeData } from "@/util/util";
import treeTable from "@/components/treeTable";
import alertTip from "@/mixins/alertTip";
import { hex_sha1 } from "@/util/sha1";

export default {
  name: "pushMessages",
  data() {
    var checkNum = (rule, value, callback) => {
      if (value === "" || value == null) {
        return callback(new Error("请输入正确的用户ID"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入正确的用户ID"));
        }
      }, 500);
    };
    return {
      pickerOptions: {
        disabledDate: time => {
          let nowData = new Date();
          nowData = new Date(nowData.setDate(nowData.getDate() - 1));
          return time < nowData;
        }
      },
      options: [
        {
          value: "3",
          label: "所有用户"
        },
        {
          value: "1",
          label: "选择用户ID"
        },
        {
          value: "2",
          label: "选择群组"
        }
      ],
      optionsEmoticon: [],
      loading: false, //加载
      ruleForm: {
        title: "",
        content: "",
        url: "",
        sendTime: "",
        type: "",
        userId: "",
        groupId: "",
        targetId: "",
        pushType: "1"
      },
      rules: {
        title: [
          { required: true, message: "请输入正确的消息名称", trigger: "blur" },
          { min: 5, max: 50, message: "长度在 5 到 50 个字符", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入正确的消息内容", trigger: "blur" },
          {
            min: 5,
            max: 100,
            message: "长度在 5 到 100 个字符",
            trigger: "blur"
          }
        ],
        url: [
          { required: true, message: "请输入正确的推送地址", trigger: "blur" },
          {
            min: 10,
            max: 300,
            message: "长度在 10 到 300 个字符",
            trigger: "blur"
          }
        ],
        type: [{ required: true, message: "请选择推送对象" }],
        userId: [
          { required: true, message: "请输入推送对象ID" },
          { type: "number", message: "请输入正确的用户ID" }
          // { validator: checkNum, trigger: "blur" }
        ],
        groupId: [{ required: true, message: "请选择推送群组" }],
        sendTime: []
      },
      formInline: {
        user: "",
        region: ""
      },
      dialogFormVisible: false, //表单状态
      multipleSelection: [], //选中的行
      tableData: [], //列表数据
      listGreet: {
        //获取表格参数
        index: 1,
        size: 20,
        status: 0
      },
      page: {
        //当前表格属性
        current: 0,
        total: 0,
        pages: 0,
        size: 0,
        total: 0
      }
    };
  },
  created() {
    this.getGroup();
    this.getMessageList();
  },
  mixins: [alertTip],
  inject: ["reload"],
  methods: {
    // 推送按钮状态
    pushButtonStatus(row) {
      if (
        new Date(row.sendTime).getTime() < Date.parse(new Date()) ||
        row.status != 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    checkNum(rule, value, callback) {
      if (value === "" || value == null) {
        return callback(new Error("请输入正确的用户ID"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入正确的用户ID"));
        }
      }, 500);
    },
    // id计算
    indexMethod(index) {
      return (this.page.current - 1) * 20 + index + 1;
    },
    // 去掉空格
    trim(word) {
      return word.replace(/(^\s*)|(\s*$)/g, "");
    },
    // 名称转换
    nameVali(name) {
      name = name.split("/");
      return name[name.length - 1];
    },
    // 日期转换
    dateVali(timestamp, creatTime) {
      var nowTime = timestamp ? timestamp : creatTime;
      var date = new Date(nowTime); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + " " + h + ":" + m + ":" + s;
    },
    // 移入
    handleMouseEnter(row, column, cell, event) {
      if (column.label === "内容") {
        console.log(row, column, cell, event);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selsectLen = val.length;
      this.userId = val[0].userId;
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
    //切换推送类型
    typeChange() {
      console.log(this.data);
      //this.$refs["ruleForm"].resetFields();
      if (this.ruleForm.type == 1) {
        this.rules.userId = [
          { required: true, message: "请输入推送对象ID" },
          { type: "number", message: "请输入正确的用户ID" }
          // { validator: this.checkNum, trigger: "blur" }
        ];
        this.rules.groupId = [];
      } else if (this.ruleForm.type == 2) {
        this.rules.userId = [];
        this.rules.groupId = [{ required: true, message: "请选择推送群组" }];
      } else {
        this.rules.userId = [];
        this.rules.groupId = [];
      }
      console.log(this.rules.userId, this.rules.groupId);
    },
    // 切换审核列表
    handleClick(tab, event) {
      this.listGreet = {
        //获取表格参数
        index: 1,
        size: 20,
        status: tab.name
      };
      this.getMessageList();
    },
    //重置表单
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addInfor();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //当前页切换
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.listGreet.index = val;
      this.getMessageList();
    },
    // 获取列表页数据
    getMessageList() {
      getMessageList(this.listGreet)
        .then(res => {
          console.log(res);
          this.tableData = res.records;
          this.page = {
            current: res.current,
            total: res.total,
            pages: res.pages,
            size: res.size,
            total: res.total
          };
          console.log(this.page);
        })
        .catch(error => {
          console.log(error);
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
    addInfor: function() {
      var addData = this.ruleForm;
      if (addData.type == "1") {
        addData.targetId = addData.userId;
      } else if (addData.type == "2") {
        addData.targetId = addData.groupId;
      } else {
        addData.targetId = "";
      }
      addInfor(addData)
        .then(res => {
          this.getMessageList();
          this.resetForm("ruleForm");
          console.log(res);
        })
        .catch(error => {
          console.log(error.data);
        });
    },
    //提交后台推送
    pushMessage(rowData) {
      this.$confirm("是否确认推送", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.loading) {
          } else {
            this.loading = true;
            pushMessage({ id: rowData.id })
              .then(res => {
                this.loading = false;
                this.getMessageList();
                this.$message({
                  type: "success",
                  message: "推送成功!"
                });

                console.log(res);
              })
              .catch(error => {
                this.loading = false;
                this.$message({
                  type: "info",
                  message: "推送失败!"
                });
                console.log(error.data);
              });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消推送"
          });
        });
    },
    // 删除确认框
    handleDelete(row) {
      if (row) {
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.deleteMessage(row);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    // 删除列表页数据
    deleteMessage(rowData) {
      deleteMessage({ id: rowData.id })
        .then(res => {
          console.log(res);
          this.$message({
            type: "info",
            message: "删除成功!"
          });
          this.getMessageList();
        })
        .catch(error => {
          console.log(error);
          this.$message({
            type: "info",
            message: "删除失败!"
          });
        });
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
