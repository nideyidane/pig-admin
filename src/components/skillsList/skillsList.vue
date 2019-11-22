<!--
 * @Descripttion: 
 * @version: 
 * @Author: su
 * @Date: 2019-04-24 15:51:15
 * @LastEditors: dignli.su
 * @LastEditTime: 2019-11-18 14:23:20
 -->
<template>
  <section id="skillList">
    <el-card class="box-card">
      <el-row>
        <el-col :span="24">
          <!--表单-->
          <el-form style="float:right;margin-bottom:10px;">
            <el-button type="primary" @click="newData()" icon="el-icon-plus">新增</el-button>
            <!-- <el-button type="primary" @click="handleDelete()">批量删除</el-button> -->
            <!-- <el-button type="primary" @click="edit(2)" icon="el-icon-edit-outline">修改</el-button> -->
            <!-- <el-button type="danger"  icon="el-icon-delete">删除</el-button> -->
          </el-form>

          <!--表格-->
          <el-table
            :data="tableData"
            border
            :default-sort="{prop: 'name', order: 'descending'}"
            style="width: 100%"
            height="600"
          >
            <el-table-column align="center" type="index" label="序列ID" width="70px">
              <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>

            <el-table-column align="center" label="分类" width="100px">
              <template slot-scope="scope">{{ scope.row.categoryTopName }}</template>
            </el-table-column>
            <el-table-column align="center" label="领域" width="100px">
              <template slot-scope="scope">{{ scope.row.categorySecondName }}</template>
            </el-table-column>
            <el-table-column align="center" label="主页Icon" width="100px">
              <template slot-scope="scope">
                <el-image
                  style="width: 60px; height: 60px"
                  :src="scope.row.icoUrlLittle"
                  fit="scale-down"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column align="center" label="详情页Icon" width="100px">
              <template slot-scope="scope">
                <el-image
                  style="width:60px; height: 60px"
                  :src="scope.row.icoUrlBig"
                  fit="scale-down"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column align="center" label="主页显示语料" width="150px">
              <template slot-scope="scope">{{ scope.row.tip }}</template>
            </el-table-column>
            <!-- <el-table-column align="center" label="小标题">
              <template slot-scope="scope">{{ scope.row.brief }}</template>
            </el-table-column>
            <el-table-column align="center" label="语料">
              <template slot-scope="scope">{{ scope.row.brief }}</template>
            </el-table-column>-->
            <el-table-column align="center" label="详情页功能介绍" min-width="350px">
              <template slot-scope="scope">{{ scope.row.brief }}</template>
            </el-table-column>
            <el-table-column align="center" label="用户评分" width="100px">
              <template slot-scope="scope">{{ scope.row.score }}</template>
            </el-table-column>
            <el-table-column align="center" label="评分详情" width="100px">
              <template slot-scope="scope">
                <el-button type="info" size="small" @click="getLikeDetail(scope.row.id)">详情</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态" width="100px">
              <template slot-scope="scope">{{ scope.row.status==0?"未发布":"已发布" }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="255px">
              <template slot-scope="scope">
                <!-- <el-button v-show="scope.row.emoticon!=''" type="info">确认通过</el-button> -->

                <el-button
                  :disabled="scope.row.status!=0"
                  style="float:left;"
                  type="primary"
                  @click="handleData(scope.$index, scope.row,'push')"
                >发布</el-button>
                <el-button
                  style="float:left;"
                  type="success"
                  @click="handleData(scope.$index, scope.row,'change')"
                >修改</el-button>
                <el-button
                  style="float:right;"
                  type="warning"
                  @click="handleData(scope.$index, scope.row,'delet')"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 评分详情 -->
          <el-dialog title="评分详情" :visible.sync="likeDetail" @close="cancelShowLike()">
            <el-table :data="likeDetailData" style="width: 100%">
              <el-table-column type="index" :index="indexMethod"></el-table-column>
              <el-table-column prop="userId" label="用户ID" width="180">
                <template slot-scope="scope">{{ scope.row.userId }}</template>
              </el-table-column>
              <el-table-column prop="userName" label="用户名">
                <template slot-scope="scope">{{ scope.row.userName }}</template>
              </el-table-column>
              <el-table-column prop="categorySecondName" width="180" label="技能">
                <template slot-scope="scope">{{ scope.row.categorySecondName }}</template>
              </el-table-column>
              <el-table-column prop="score" width="180" label="评分">
                <template slot-scope="scope">{{ scope.row.score }}</template>
              </el-table-column>
              <el-table-column prop="createTime" label="评分提交时间" width="250">
                <template slot-scope="scope">{{ dateVali(scope.row.createTime) }}</template>
              </el-table-column>
            </el-table>
            <el-pagination
              style="text-align:center;margin-top:20px;"
              background
              layout="total,prev, pager, next"
              :page-count="pageLike.pages"
              :page-size="pageLike.size"
              :total="pageLike.total"
              :current-page="pageLike.current"
              @current-change="handleCurrentChange($event,'pageLike')"
            ></el-pagination>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelShowLike()">取 消</el-button>
              <el-button type="primary" @click="cancelShowLike()">确 定</el-button>
            </div>
          </el-dialog>
          <!-- 表单 -->
          <el-dialog
            id="changeDialog"
            :close-on-click-modal="false"
            :show-close="false"
            :title="ruleFormInfor.name"
            :visible.sync="ruleFormInfor.dialogFormVisible"
            style="width:100%;"
          >
            <div style="width:80%;display:flex;">
              <el-form
                id="form-data"
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
                v-loading="loading"
              >
                <el-form-item
                  label="分类选择"
                  :prop="ruleFormInfor.name=='修改技能'?'':'categoryTopName'"
                  style="width:45%;float:left;"
                >
                  <el-select
                    :disabled="ruleFormInfor.name=='修改技能'"
                    v-model="ruleForm.categoryTopName"
                    placeholder="选择分类"
                    @change="getSkillCategorySecond(ruleForm.categoryTopName)"
                  >
                    <el-option
                      v-for="(item,index) in categoryData"
                      :label="item.name"
                      :value="item.name"
                      :key="item.name"
                    >{{item.name}}</el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="技能" prop="categorySecondName" style="width:45%;float:left;">
                  <el-input
                    maxlength="10"
                    type="text"
                    v-model="ruleForm.categorySecondName"
                    resize="none"
                  ></el-input>
                </el-form-item>

                <el-form-item label="技能介绍" prop="brief" style="width:45%;float:left;">
                  <el-input type="textarea" v-model="ruleForm.brief" resize="none" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="技能序列"  style="width:30%;float:left;">
                  <el-select
                    v-model="ruleForm.rankIndex"
                    placeholder="选择分类"
                    @change="getSkillCategorySecond(ruleForm.categoryTopName)"
                  >
                    <el-option
                      v-for="index in (page.total+1)"
                      :label="index"
                      :value="index"
                      :key="index"
                    >{{index}}</el-option>
                  </el-select>
                  <!-- <el-input v-model="ruleForm.rankIndex" placeholder="请输入内容"></el-input> -->
                </el-form-item>
                <el-form-item label="详情页icon" prop="icoUrlBig" style="width:40%;float:left;">
                  <el-upload
                    class="avatar-uploader"
                    :headers="uploadfile.header"
                    :action="uploadfile.url+'?uploadType=5'"
                    :show-file-list="false"
                    :on-success="(res,file)=>{return handleAvatarSuccess(res,file, 'icoUrlBig')}"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="ruleForm.icoUrlBig" :src="ruleForm.icoUrlBig" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="主页icon" prop="icoUrlLittle" style="width:40%;float:left;">
                  <el-upload
                    class="avatar-uploader"
                    :headers="uploadfile.header"
                    :action="uploadfile.url+'?uploadType=4'"
                    :show-file-list="false"
                    :on-success="(res,file)=>{return handleAvatarSuccess(res,file, 'icoUrlLittle')}"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="ruleForm.icoUrlLittle" :src="ruleForm.icoUrlLittle" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="添加类型" style="width:100%;float:left;">
                  <el-radio-group v-model="ruleForm.type">
                    <el-radio-button label="1">你可以这样说</el-radio-button>
                    <el-radio-button label="2">玩法介绍</el-radio-button>
                  </el-radio-group>
                  <el-button
                    type="success"
                    icon="el-icon-plus"
                    circle
                    style="padding: 7px;"
                    @click="addSkillStatements()"
                  ></el-button>
                </el-form-item>

                <div v-for="(item,index) in ruleForm.skillStatements" class="skillStatements">
                  <el-form-item label="标题" style="width:100%;">
                    <el-input
                      v-model="item.title"
                      placeholder="请输入内容"
                      style="width:60%;"
                      maxlength="10"
                    ></el-input>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      style="padding: 7px;"
                      @click="deleteskillStatements(index)"
                    ></el-button>
                    <el-button
                      type="success"
                      icon="el-icon-plus"
                      circle
                      style="padding: 7px;"
                      @click="addskillContent(index)"
                    ></el-button>
                  </el-form-item>
                  <el-form-item label="内容" style="width:100%;">
                    <div
                      v-for="(child,childIndex) in (item.content.split('、'))"
                      style="width:100%;margin-bottom:5px;"
                    >
                      <el-checkbox style="margin-right: 3px;" @change="handleCheckedCitiesChange"></el-checkbox>
                      <input
                        maxlength="100"
                        class="skillStatementsContent"
                        type="text"
                        v-model="item.content.split('、')[childIndex]"
                        v-on:input="(e)=>{return contentChange(e,index,childIndex)}"
                        placeholder="请输入内容"
                        style="width:70%;border:1px solid #C0C4CC;border-radius:3px;height:30px;line-height:30px;padding:0 5px;"
                      />

                      <i class="el-icon-delete" @click="deleteskillContent(index,childIndex)"></i>
                    </div>
                  </el-form-item>
                </div>
              </el-form>
            </div>
            <section id="preview">
              <div id="titleIcon">
                <img :src="ruleForm.icoUrlBig" alt />
                <p>{{ruleForm.categorySecondName}}</p>
              </div>
              <div id="feiDes">
                <p>技能介绍</p>
                <p class="descontent">{{ruleForm.brief}}</p>
              </div>
              <div id="wanfa">
                <header>{{ruleForm.type==1?"你可以这样说":"玩法介绍"}}</header>
                <ul>
                  <li v-for="(item,index) in ruleForm.skillStatements" class="childLi">
                    <img
                      src="https://ubt-alpha.oss-cn-shenzhen.aliyuncs.com/pig/fly/img/Group@2x.png"
                    />
                    <div>
                      <p>{{item.title}}</p>
                      <pre>{{item.content.split('、').join("\n")}}</pre>
                    </div>
                  </li>
                </ul>
              </div>
            </section>
            <div slot="footer" class="dialog-footer">
              <el-button @click="cancelForm('ruleForm')">取消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </div>
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
              @current-change="handleCurrentChange($event,'page')"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </section>
</template>
<script type="text/ecmascript-6">
import {
  getGreetList,
  getLikeDetail,
  deleteFesData,
  pushFesData,
  getSkillCategory,
  getSkillCategorySecond,
  addSkillData,
  updateSkillData
} from "@/api/skillsList";
import { treeData } from "@/util/util";
import treeTable from "@/components/treeTable";
import alertTip from "@/mixins/alertTip";
import { hex_sha1 } from "@/util/sha1";
import { config } from "@/util/constant";

export default {
  name: "festival",
  data() {
    return {
      // 评分
      likeDetailData: [],
      likeDetail: false,
      listGreetLike: {
        index: 1,
        size: 10
      },
      pageLike: {
        current: 0,
        total: 0,
        pages: 0,
        size: 0,
        total: 0
      },

      // 技能数据
      skillListIndex:[],
      tableData: [],

      listGreet: {
        index: 1,
        size: 10
      },
      page: {
        current: 0,
        total: 0,
        pages: 0,
        size: 0,
        total: 0
      },
      // 分类数据
      categoryData: [
        {
          id: 9,
          name: "生活助手"
        }
      ],
      skillData: [],
      // 表单
      loading: false, //加载
      ruleFormInfor: {
        dialogFormVisible: false, //表单打开
        name: "技能"
      },
      uploadfile: {
        data: {
          uploadType: 1
        },
        url: config.domain + "/pig-manage/common/upload",
        header: {
          token: JSON.parse(sessionStorage.getItem("userKey")).token
          // product: "60201"
          // sessionName: window.vm.$store.state.user
        }
      },
      ruleForm: {
        rankIndex:'1',
        categoryId: "",
        categorySecondName: "",
        brief: "",
        icoUrlBig: "",
        icoUrlLittle: "",
        skillStatements: [],
        tip: "测试数据",
        type: 1,
        product: 60201
      },
      rules: {
        categoryTopName: [
          { required: true, message: "请选择分类", trigger: "change" }
        ],
        categorySecondName: [
          { required: true, message: "请输入技能", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        brief: [
          { required: true, message: "请输入描述内容", trigger: "blur" },
          {
            min: 20,
            max: 200,
            message: "长度在 20 到 200 个字符",
            trigger: "blur"
          }
        ],
        skillStatementTitle: [
          { required: true, message: "请输入小标题", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        skillStatementContnet: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getGreetList();
  },
  mixins: [alertTip],
  inject: ["reload"],
  methods: {
    // 评分id计算
    indexMethod(index) {
      return (this.pageLike.current - 1) * 10 + index + 1;
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
      var D = date.getDate() + 1 < 10 ? "0" + date.getDate() : date.getDate();
      var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + " " + h + ":" + m + ":" + s;
    },
    //表单操作
    addSkillStatements() {
      this.ruleForm.skillStatements.push({ title: "", content: "" });
    },
    deleteskillStatements(index) {
      this.ruleForm.skillStatements.splice(index, 1);
    },
    addskillContent(index, childIndex) {
      this.ruleForm.skillStatements[index].content += "、";
    },
    deleteskillContent(index, childIndex) {
      let delContent = this.ruleForm.skillStatements[index].content.split("、");
      delContent.splice(childIndex, 1);
      this.ruleForm.skillStatements[index].content = delContent.join("、");
    },
    changeContent(index, childIndex, val) {
      console.log(this.ruleForm.skillStatements[index].content, val);
    },
    handleCheckedCitiesChange(val) {
      console.log(val);
    },
    contentChange(e, index, childIndex) {
      let nowskillsList = this.ruleForm.skillStatements[index].content.split(
        "、"
      );
      nowskillsList[childIndex] = e.target.value;
      this.ruleForm.skillStatements[index].content = nowskillsList.join("、");
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateSkillData();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancelForm() {
      this.getGreetList();
      this.ruleFormInfor = {
        dialogFormVisible: false,
        name: ""
      };
      this.ruleForm = {
        categoryId: "",
        categorySecondName: "",
        brief: "",
        icoUrlBig: "",
        icoUrlLittle: "",
        skillStatements: [],
        tip: "测试数据",
        type: 1,
        product: 60201
      };
      this.resetForm("ruleForm");
    },
    updateSkillData: function() {
      let tipContent = document.getElementsByClassName(
        "el-checkbox is-checked"
      );
      let tipArry = [];
      for (let index = 0; index < tipContent.length; index++) {
        let el = tipContent[index];
        console.log(tipContent.length);
        tipArry.push(el.nextElementSibling.value);
      }
      this.ruleForm.tip = tipArry.join("\n");

      if (this.ruleFormInfor.name == "新增技能") {
        console.log(this.ruleForm);
        addSkillData(this.ruleForm)
          .then(res => {
            console.log(res);
            if (res.status) {
              this.$message({
                type: "success",
                message: "新增成功!"
              });
              this.cancelForm();
            } else {
              this.$message({
                type: "error",
                message: "新增失败，请检查技能参数后重试!"
              });
            }
          })
          .catch(error => {
            this.$message({
              type: "info",
              message: "新增失败，请稍后重试!"
            });
            console.log(error.data);
          });
      } else {
        updateSkillData(this.ruleForm)
          .then(res => {
            if (res.status) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.cancelForm();
            } else {
              this.$message({
                type: "error",
                message: "修改失败，请检查技能参数后重试!"
              });
            }
          })
          .catch(error => {
            this.$message({
              type: "info",
              message: "修改失败，请稍后重试!!"
            });
            console.log(error.data);
          });
      }
    },
    handleAvatarSuccess(res, file, type) {
      console.log(res.models);
      this.ruleForm[type] = res.models;
      // if (type == "icoUrlBig") {
      //   this.ruleForm.icoUrlBig = URL.createObjectURL(file.raw);
      // } else {
      //   this.ruleForm.icoUrlLittle = URL.createObjectURL(file.raw);
      // }
    },
    beforeAvatarUpload(file) {
      console.log(file);
      const isIMG = file.type === "image/png" || "image/jpeg";
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isIMG) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传图片大小不能超过 1MB!");
      }
      return isIMG && isLt1M;
    },
    // 评分详情
    getLikeDetail(param) {
      this.listGreetLike.id = param || this.listGreetLike.id;
      getLikeDetail(this.listGreetLike)
        .then(res => {
          this.likeDetailData = res.models.records;
          this.pageLike = res.models;

          this.likeDetail = true;
          console.log(res);
        })
        .catch(error => {
          console.log(error);
        });
    },
    cancelShowLike(index, row) {
      this.likeDetail = false;
      this.likeDetailData = [];
      this.listGreetLike = {
        index: 1,
        size: 10
      };
      this.pageLike = {
        current: 0,
        total: 0,
        pages: 0,
        size: 0,
        total: 0
      };
    },
    // 数据操作
    handleData(index, row, handel) {
      let toastInfo = "";
      switch (handel) {
        case "delet":
          toastInfo = "删除后，此条技能将永久消失。是否确认删除？";
          this.toast(toastInfo, row, "delet");
          break;
        case "push":
          toastInfo = "是否确认对全部用户的APP进行技能页面更新？";
          this.toast(toastInfo, row, "push");
          break;
        case "change":
          this.newData(index, row, handel);
          break;
      }
    },
    // 弹框
    toast(toastInfo, row, handel) {
      this.$confirm(toastInfo, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (handel == "delet") {
            this.deleteFesData(row);
          }
          if (handel == "push") {
            this.pushFesData(row);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },

    //提交后台发布
    pushFesData(rowData) {
      if (this.loading) {
      } else {
        this.loading = true;
        pushFesData({ id: rowData.id, status: "1" })
          .then(res => {
            this.loading = false;
            this.getGreetList();
            this.$message({
              type: "success",
              message: "发布成功!"
            });
          })
          .catch(error => {
            this.loading = false;
            this.$message({
              type: "info",
              message: "发布失败!"
            });
            console.log(error.data);
          });
      }
    },
    // 删除列表页数据
    deleteFesData(rowData) {
      deleteFesData({
        id: rowData.id
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
    //当前页切换
    handleCurrentChange(val, page) {
      if (page == "page") {
        this.listGreet.index = val;
        this.getGreetList();
      } else {
        this.listGreetLike.index = val;
        this.getLikeDetail();
      }
    },
    // 获取列表页数据
    getGreetList() {
      getGreetList(this.listGreet)
        .then(res => {
          this.tableData = res.models.records;
          this.page = res.models;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取大类数据
    getSkillCategory() {
      getSkillCategory({ product: 60201 })
        .then(res => {
          this.categoryData = res.models;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取选项技能
    getSkillCategorySecond(name) {
      let that = this;
      this.categoryData.forEach(el => {
        if (name == el.name) {
          that.ruleForm.categoryId = el.id;
        }
      });
      // getSkillCategorySecond({ categoryId: this.ruleForm.categoryId })
      //   .then(res => {
      //     this.skillData = res.models;
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
    },

    // 表单打开
    newData(index, row) {
      console.log(row);
      this.getSkillCategory();
      if (row) {
        this.ruleFormInfor = {
          dialogFormVisible: true, //表单打开
          name: "修改技能"
        };
        this.ruleForm = row;
        this.ruleForm.product = "60201";
      } else {
        this.ruleFormInfor = {
          dialogFormVisible: true,
          name: "新增技能"
        };
        console.log(this.ruleFormInfor);
      }
    }
  }
};
</script>
<style lang="scss">
.demo-ruleForm::-webkit-scrollbar,
#preview::-webkit-scrollbar {
  display: none;
}
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
#skillList .el-dialog {
  width: 80%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.skillStatements {
  width: 30%;
  margin-top: 10px;
  overflow: hidden;
}
#form-data {
  max-height: 500px;
  overflow: scroll;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
}
#preview {
  width: 20%;
  height: 500px;
  background: #f3f3f3;
  position: relative;
  overflow: scroll;
}
#changeDialog .el-dialog__body {
  display: flex;
  height: 600px;
  justify-content: space-between;
}
// 预览
/*头部*/
#titleIcon {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 10rem;
  background: #239fed;
  padding-top: 2.2rem;
  box-sizing: border-box;
  z-index: 10;
  display: grid;
}

#titleIcon img {
  width: 4.3125rem;
  height: auto;
  margin: 0 auto 0.9rem;
}

#titleIcon p {
  width: 100%;
  text-align: center;
  height: auto;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #ffffff;
  text-align: center;
  line-height: 1.225rem;
}

/* 技能介绍 */
#feiDes {
  width: 100%;
  padding: 0.9375rem;
  box-sizing: border-box;
  background: #fff;
  /* border-bottom: .5px solid #D9D9D9; */
}

#feiDes p {
  width: 100%;
  text-align: left;
}

#feiDes p:nth-of-type(1) {
  display: block;
  font-family: PingFangSC-Medium;
  font-size: 1rem;
  color: #184065;
  font-weight: 800;
}

#feiDes p:nth-of-type(2) {
  display: block;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #184065;
  margin-top: 0.325rem;
}

/*列表*/
#wanfa {
  width: 100%;
  margin-bottom: 0.625rem;
}

#wanfa header {
  width: 100%;
  padding: 0.9375rem 0.9375rem 0.625rem;
  box-sizing: border-box;
  background: #fff;
  border-bottom: 0.5px solid #d9d9d9;
  font-family: PingFangSC-Medium;
  font-size: 1rem;
  color: #184065;
  margin-top: 0.7rem;
  font-weight: 800;
  border-top: 0.5px solid #d9d9d9;
}

.childLi {
  width: 100%;
  padding: 1.25rem 0.9375rem;
  box-sizing: border-box;
  background: #ffffff;
  border-bottom: 0.5px solid #e2e2e2;
  display: flex;
  justify-content: flex-start;
}

.childLi img:nth-of-type(1) {
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 2px;
  align-self: flex-start;
}

.childLi div {
  max-width: 90%;
  margin-left: 0.75rem;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}

.childLi div p:nth-of-type(1) {
  opacity: 0.7;
  font-family: PingFangSC-Regular;
  font-size: 1.06rem;
  color: #184065;
  line-height: 1.13rem;
  min-height: 1.13rem;
  margin-bottom: 0.3rem;
}

.childLi div pre {
  font-family: PingFangSC-Regular;
  font-size: 1.0625rem;
  line-height: 1.5rem;
  min-height: 1.5rem;
  color: #184065;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.childLi div {
  align-self: center;
}
</style>
