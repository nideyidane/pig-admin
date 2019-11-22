<!--
 * @Descripttion: 
 * @version: 
 * @Author: su
 * @Date: 2019-04-24 15:51:15
 * @LastEditors: dignli.su
 * @LastEditTime: 2019-11-18 11:07:42
 -->
<template>
  <section id="festival">
    <el-card class="box-card">
      <el-row>
        <el-col :span="24">
          <!--表单-->
          <el-form style="float:right;margin-bottom:10px;">
            <el-button type="primary" @click="newData()" icon="el-icon-plus">新增</el-button>
            <el-button type="primary" @click="handleDelete()">批量删除</el-button>
            <!-- <el-button type="primary" @click="edit(2)" icon="el-icon-edit-outline">修改</el-button> -->
            <!-- <el-button type="danger"  icon="el-icon-delete">删除</el-button> -->
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
            <el-table-column align="center" type="selection" width="40px"></el-table-column>
            <el-table-column type="index" align="center" :index="indexMethod"></el-table-column>

            <el-table-column align="center" label="节假日名称" min-width="100px">
              <template slot-scope="scope">{{ scope.row.greetName }}</template>
            </el-table-column>
            <el-table-column align="center" label="问候语" min-width="150px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="cellclickForm(scope.row.greetFileUrl)"
                >{{ nameVali(scope.row.greetFileName) }}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="动画名称" min-width="150px">
              <template slot-scope="scope">
                <el-button size="mini">{{ nameVali(scope.row.cartoonFileName) }}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="推送对象" min-width="200px">
              <template slot-scope="scope">{{ scope.row.robotSeq?scope.row.robotSeq:"全部"}}</template>
            </el-table-column>
            <el-table-column align="center" label="生效日期" min-width="100px">
              <template slot-scope="scope">{{ scope.row.runTime }}</template>
            </el-table-column>
            <el-table-column align="center" label="修改日期" min-width="200px">
              <template slot-scope="scope">{{ dateVali(scope.row.modifyTime) }}</template>
            </el-table-column>
            <!-- <el-table-column align="center" label="修改账号" min-width="100px">
              <template slot-scope="scope">{{ scope.row.operateUser }}</template>
            </el-table-column>-->
            <el-table-column align="center" label="状态" min-width="100px">
              <template slot-scope="scope">{{ scope.row.status==0?"未推送":"已推送" }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="280px">
              <template slot-scope="scope">
                <!-- <el-button v-show="scope.row.emoticon!=''" type="info">确认通过</el-button> -->

                <el-button
                  :disabled="pushButtonStatus(scope.row.status,scope.row.modifyTime)"
                  style="float:left;"
                  type="primary"
                  @click="pushFesData(scope.row)"
                >确认推送</el-button>
                <el-button
                  style="float:left;"
                  type="success"
                  @click="newData(scope.$index, scope.row)"
                >编辑</el-button>
                <el-button
                  style="float:right;"
                  type="warning"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 表单 -->
          <el-dialog
            title="节假日问候"
            :visible.sync="ruleFormInfor.dialogFormVisible"
            :close-on-click-modal="false"
            :show-close="false"
          >
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
              v-loading="loading"
            >
              <el-form-item label="节假日名称" prop="greetName">
                <el-input v-model="ruleForm.greetName" :readonly="ruleFormInfor.nameDisabled"></el-input>
              </el-form-item>

              <el-form-item label="节日日期" required>
                <el-col :span="11">
                  <el-form-item prop="runTime">
                    <el-date-picker
                      v-if="ruleFormInfor.datedisabled==true"
                      :readonly="true"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                      v-model="ruleForm.runTime"
                      style="width: 100%;"
                    ></el-date-picker>
                    <el-date-picker
                      :picker-options="pickerOptions"
                      v-if="ruleFormInfor.datedisabled==false"
                      :readonly="false"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                      v-model="ruleForm.runTime"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item label="问候语">
                <el-upload
                  :before-upload="(file)=>{return beforeupload(file, '问候语')}"
                  :headers="uploadfile.header"
                  class="upload-demo"
                  :action="uploadfile.url"
                  :show-file-list="false"
                  :on-success="(res,file)=>{return uploadSuccess(res,file, '问候语')}"
                >
                  <el-button
                    size="small"
                    type="primary"
                    @click="handChangeFile('greetFileUrl')"
                  >点击上传</el-button>
                  <span id="festivalGreeting">{{ruleForm.greetFileName}}</span>
                </el-upload>
              </el-form-item>

              <el-form-item label="动画表情">
                <el-upload
                  :before-upload="(file)=>{return beforeupload(file, '动画表情')}"
                  :headers="uploadfile.header"
                  class="upload-demo"
                  :action="uploadfile.url"
                  :show-file-list="false"
                  :on-success="(res,file)=>{return uploadSuccess(res,file, '动画表情')}"
                >
                  <el-button
                    size="small"
                    type="primary"
                    @click="handChangeFile('cartoonFileUrl')"
                  >点击上传</el-button>
                  <span id="festivalCartoon">{{ruleForm.cartoonFileName}}</span>
                </el-upload>
              </el-form-item>
              <el-form-item label="推送对象" prop="pushType" style="width:35%;float:left;">
                <el-select v-model="ruleForm.pushType" @change="pushTypeChange()" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="设备SN号"
                prop="robotSeq"
                style="width:35%;float:left;"
                v-show="ruleForm.pushType==1"
              >
                <el-input maxlength="20" v-model="ruleForm.robotSeq"></el-input>
              </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelForm('ruleForm')">取消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </div>
          </el-dialog>
          <!-- 播放音频 -->
          <el-dialog title="问候语" :visible.sync="musicSource.centerDialogVisible" width="30%" center>
            <audio controls="controls" id="fesMusic">
              <source :src="musicSource.musicData" type="audio/ogg" />
              <source :src="musicSource.musicData" type="audio/mpeg" />Your browser does not support the audio tag.
            </audio>
            <span slot="footer" class="dialog-footer">
              <el-button @click="closeMusic()">取 消</el-button>
              <el-button type="primary" @click="closeMusic()">确 定</el-button>
            </span>
          </el-dialog>
          <div class="block">
            <el-pagination
              style="text-align:center;margin:20px;"
              background
              layout="total,prev, pager, next"
              :page-count="page.pages"
              :page-size="page.size"
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
  getGreetList,
  addFesData,
  updateFesData,
  pushFesData,
  deleteFesData,
  getListHoliday,
  uploadData
} from "@/api/festival";
import { treeData } from "@/util/util";
import treeTable from "@/components/treeTable";
import alertTip from "@/mixins/alertTip";
import { hex_sha1 } from "@/util/sha1";
import { config } from "@/util/constant";

export default {
  name: "festival",
  data() {
    return {
      // 日期范围
      pickerOptions: {
        disabledDate: time => {
          let nowData = new Date();
          nowData = new Date(nowData.setDate(nowData.getDate() - 1));
          return time < nowData;
        }
      },
      // 推送对象
      options: [
        {
          value: "3",
          label: "全部用户"
        },
        {
          value: "1",
          label: "选择设备SN号"
        }
      ],
      // 上传文件
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ],
      uploadfile: {
        data: {
          uploadType: 1
        },
        url: config.domain + "/pig-manage/common/upload?uploadType=1",
        header: {
          token: JSON.parse(sessionStorage.getItem("userKey")).token
          // product: "60201"
          // sessionName: window.vm.$store.state.user
        }
      },
      loading: false, //加载
      ruleFormInfor: {
        dialogFormVisible: false, //表单打开
        name: "节假日名称",
        nameDisabled: false,
        datedisabled: false,
        operatePosition: ""
      },
      ruleForm: {
        id: "",
        greetName: "",
        greetFileName: "",
        greetFileUrl: "",
        cartoonFileName: "",
        cartoonFileUrl: "",
        runTime: "",
        operateUser: "飞猪",
        robotSeq: ""
      },
      rules: {
        greetName: [
          { required: true, message: "请输入节假日名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        runTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        pushType: [{ required: true, message: "请选择推送对象" }],
        robotSeq: []
      },
      multipleSelection: [], //选中的行
      tableData: [], //列表数据
      listGreet: {
        //获取表格参数
        index: 1,
        size: 10
      },
      page: {
        //当前表格属性
        current: 0,
        total: 0,
        pages: 0,
        size: 0,
        total: 0
      },
      listHoliday: {
        //获取日期参数
      },
      // 播放音乐
      musicSource: {
        centerDialogVisible: false, //居中音乐播放
        muiscData: ""
      }
    };
  },
  created() {
    //this.getListHoliday();
    this.getGreetList();
  },
  mixins: [alertTip],
  inject: ["reload"],
  methods: {
    // 推送按钮状态
    pushButtonStatus(status, time) {
      if (time < Date.parse(new Date()) || status != 0) {
        return true;
      } else {
        return false;
      }
    },
    // id计算
    indexMethod(index) {
      return (this.page.current - 1) * 10 + index + 1;
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
    handleChecked(val) {
      console.log(val);
      console.log(this.form.roleIdList);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    //切换推送类型
    pushTypeChange() {
      //this.$refs["ruleForm"].resetFields();
      if (this.ruleForm.pushType == 1) {
        this.rules.robotSeq = [{ required: true, message: "请输入设备SN号" }];
      } else {
        this.rules.robotSeq = [];
      }
    },
    // 切换审核列表
    handleClick(tab, event) {
      this.listGreet = {
        //获取表格参数
        index: 1,
        size: 20,
        mesStatus: tab.name
      };
      this.getGreetList();
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ruleForm.greetFileName && this.ruleForm.cartoonFileName) {
            this.updateFesData();
          } else {
            this.$message.error("请确认问候语与表情资源是否已上传");
          }
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
      this.getGreetList();
    },
    // 获取列表页数据
    getGreetList() {
      getGreetList(this.listGreet)
        .then(res => {
          console.log(res);
          this.tableData = res.records;
          this.page = res;
          console.log(this.page);
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取日期数据
    getListHoliday(_callback) {
      getListHoliday(this.searchParam).then(res => {
        console.log(res);
        if (res.status) {
          this.optionsEmoticon = [];
          res.models.forEach(el => {
            var child = {
              value: el.groupId,
              label: el.groupName
            };
            this.listHoliday.push(child);
          });
        } else {
          console.log(res.msg);
        }
      });
    },
    updateFesData: function() {
      console.log();
      updateFesData(this.ruleForm)
        .then(res => {
          this.getGreetList();
          this.cancelForm();
          console.log(res);
        })
        .catch(error => {
          console.log(error.data);
        });
    },
    //提交后台推送
    pushFesData(rowData) {
      this.$confirm("是否确认进行推送操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.loading) {
          } else {
            this.loading = true;
            pushFesData({ id: rowData.id })
              .then(res => {
                this.loading = false;
                this.getGreetList();
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
    handleDelete(index, row) {
      console.log(row);
      console.log(this.multipleSelection.length);
      if (row || this.multipleSelection.length != 0) {
        this.multipleSelection = row ? [row] : this.multipleSelection;
        this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.deleteFesData();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          type: "info",
          message: "请选择要删除的数据"
        });
      }
    },
    // 删除列表页数据
    deleteFesData(rowData) {
      let nowselect = [];
      this.multipleSelection.forEach(el => {
        nowselect.push(el.id);
      });
      deleteFesData({
        ids: nowselect
      })
        .then(res => {
          console.log(res);
          this.$message({
            type: "info",
            message: "删除成功!"
          });
          this.getGreetList();
        })
        .catch(error => {
          console.log(error);
          this.$message({
            type: "info",
            message: "删除失败!"
          });
        });
    },
    //日期移入移出
    mouseoverDate(e) {
      e.currentTarget.nextElementSibling.style.opacity = "1";
    },
    mouseoutDate(e) {
      e.currentTarget.nextElementSibling.style.opacity = "0";
    },
    // 点击单元格
    cellclickForm(fileUrl) {
      console.log(fileUrl);
      this.musicSource.centerDialogVisible = true;
      this.musicSource.musicData = fileUrl;

      setTimeout(() => {
        let audio = document.getElementById("fesMusic");
        audio.src = fileUrl;
      }, 500);
    },
    //关闭音乐
    closeMusic() {
      let audio = document.getElementById("fesMusic");
      audio.pause(); // 这个就是暂停
      this.musicSource.centerDialogVisible = false;
    },
    // 上传文件
    uploadSuccess(response, file, type) {
      if (type == "问候语") {
        this.ruleForm.greetFileName = file.name;
        this.ruleForm.greetFileUrl = file.response.models;
      } else {
        this.ruleForm.cartoonFileName = file.name;
        this.ruleForm.cartoonFileUrl = file.response.models;
      }
    },
    beforeupload(file, type) {
      console.log(file, type);
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (type == "问候语") {
        const extension = testmsg === "mp3";
        if (!extension) {
          this.$message({
            message: "问候语上传文件只能是 mp3格式!",
            type: "warning"
          });
          return false;
        }
      }
      if (type == "动画表情") {
        const extension2 = testmsg === "gz";
        if (!extension2) {
          this.$message({
            message: "动画表情上传文件只能是 gz格式!",
            type: "warning"
          });
          return false;
        }
      }
    },
    handChangeFile(nowposition) {
      console.log(nowposition);
      this.ruleFormInfor.operatePosition = nowposition;
    },
    cancelForm() {
      this.ruleFormInfor = {
        dialogFormVisible: false, //表单打开
        name: "节假日名称",
        nameDisabled: false,
        datedisabled: false,
        operatePosition: ""
      };
      this.multipleSelection = [];
      this.ruleForm = {
        id: "",
        greetName: "",
        greetFileName: "",
        greetFileUrl: "",
        cartoonFileName: "",
        cartoonFileUrl: "",
        runTime: "",
        operateUser: "飞猪",
        robotSeq: ""
      };
      this.resetForm("ruleForm");
    },
    // 表单打开
    newData(index, row) {
      if (row) {
        this.ruleFormInfor = {
          dialogFormVisible: true, //表单打开
          name: "编辑节日",
          nameDisabled: true,
          datedisabled: true,
          upLoadUrl: "/cloud-ppi/pig/web/updateGreet",
          upSuccess: "修改成功",
          upFail: "修改失败"
        };
        this.ruleForm = {
          id: row.id,
          greetName: row.greetName,
          runTime: row.runTime,
          cartoonFileUrl: row.cartoonFileUrl,
          cartoonFileName: this.nameVali(row.cartoonFileUrl),
          greetFileName: this.nameVali(row.greetFileUrl),
          greetFileUrl: row.greetFileUrl,
          operateUser: "飞猪",
          robotSeq: row.robotSeq
        };
      } else {
        this.ruleFormInfor = {
          dialogFormVisible: true, //表单打开
          name: "节假日",
          nameDisabled: false,
          datedisabled: false,
          upLoadUrl: "/cloud-ppi/pig/web/addGreet",
          upSuccess: "新增成功",
          upFail: "新增失败"
        };
      }
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
