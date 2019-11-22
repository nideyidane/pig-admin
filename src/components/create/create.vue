<!--
 * @Descripttion: 
 * @version: 
 * @Author: dignli.su
 * @Date: 2019-07-30 14:39:56
 * @LastEditors: dignli.su
 * @LastEditTime: 2019-11-19 19:18:49
 -->
<template>
  <div>
    <el-tabs
      v-model="listGreet.approveStatus"
      @tab-click="handleClick"
    >
      <el-tab-pane label="审核通过" name="1">审核通过</el-tab-pane>
      <el-tab-pane label="审核未通过" name="2">审核未通过</el-tab-pane>
      <el-tab-pane label="未审核" name="0">未审核</el-tab-pane>
    </el-tabs>
    <!-- 操作 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="listGreet.searchKey" placeholder="在问题/答案中搜索" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="onSearch">查询</el-button>
      </el-form-item>

      <el-date-picker
        v-model="dateStartEnd"
        type="daterange"
        range-separator="—"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
      <el-form-item id="approveBtn">
        <el-button
          type="primary"
          @click="moreproveStatus('1')"
          v-show="listGreet.approveStatus!=1"
        >确认通过</el-button>
      </el-form-item>
      <el-form-item id="unapproveBtn">
        <el-button
          type="primary"
          @click="moreproveStatus('2')"
          v-show="listGreet.approveStatus==0"
        >确认不通过</el-button>
      </el-form-item>
      <el-form-item id="export-Excel" v-show="listGreet.approveStatus!=0">
        <el-button type="primary" @click="export_Excel()">导出</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      stripe
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      height="600"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column align="center" type="index" :index="indexMethod" width="100"></el-table-column>

      <el-table-column align="center" label="上传时间" width="200">
        <template slot-scope="scope">{{ dateVali(scope.row.createTime) }}</template>
      </el-table-column>
      <el-table-column align="center" label="问题">
        <template slot-scope="scope">{{ scope.row.question }}</template>
      </el-table-column>
      <el-table-column align="center" label="播报答案">
        <template slot-scope="scope">{{ scope.row.answer }}</template>
      </el-table-column>
      <!-- <el-table-column label="创建时间" width="150">
        <template slot-scope="scope">{{ dateVali(scope.row.createTime) }}</template>
      </el-table-column>-->
      <el-table-column label="表情" width="150" align="center" v-if="listGreet.approveStatus!=1">
        <template slot-scope="scope">
          <el-select v-model="scope.row.emoticon" placeholder="请选择">
            <el-option
              v-for="item in optionsEmoticon"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="表情" width="150" align="center" v-if="listGreet.approveStatus==1">
        <template slot-scope="scope">{{ scope.row.emoticon }}</template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center" v-if="listGreet.approveStatus!=1">
        <template slot-scope="scope">
          <!-- <el-button v-show="scope.row.emoticon!=''" type="info">确认通过</el-button> -->
          <el-button type="primary" @click="approveStatus(scope.row,scope.row.emoticon,'1')">确认通过</el-button>
          <el-button
            v-show="listGreet.approveStatus==0"
            type="warning"
            @click="approveStatus(scope.row,scope.row.emoticon,'2')"
          >不通过</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审核状态" width="100">
        <template slot-scope="scope">{{ staues[Number(scope.row.approveStatus)] }}</template>
      </el-table-column>
    </el-table>

    <!-- 页码 -->
    <el-pagination
      style="text-align:center;margin-top: 15px;"
      background
      layout="total,prev, pager, next"
      :page-count="page.pages"
      :page-size="page.size"
      :total="page.total"
      :current-page.sync="page.current"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import { getCurrentPage, getExportData, setCurrentState } from "@/api/create";
import { treeData } from "@/util/util";
import treeTable from "@/components/treeTable";
import alertTip from "@/mixins/alertTip";
import { hex_sha1 } from "@/util/sha1";
export default {
  data() {
    return {
      optionsStateData: [
        //通过状态下拉
        {
          value: "通过",
          label: "通过"
        },
        {
          value: "未通过",
          label: "未通过"
        }
      ],
      optionsEmoticon: [
        //表情类下拉
        {
          value: "smile",
          label: "smile"
        },
        {
          value: "blink",
          label: "blink"
        },
        {
          value: "shy",
          label: "shy"
        },
        {
          value: "depressed",
          label: "depressed"
        },
        {
          value: "confuse",
          label: "confuse"
        },
        {
          value: "angry",
          label: "angry"
        },
        {
          value: "grin",
          label: "grin"
        },
        {
          value: "greedy",
          label: "greedy"
        }
      ],
      value: "",

      formInline: {
        user: "",
        region: ""
      },
      staues: ["未审核", "通过", "未通过"], //状态保存
      dateStartEnd: [], //日期
      multipleSelection: [], //选中的行
      tableData: [], //列表数据
      listGreet: {
        //获取表格参数
        index: 1,
        size: 20,
        searchKey: "",
        approveStatus: "0"
      },
      page: {
        //当前表格属性
        current: 0,
        total: 0,
        pages: 0,
        size: 0,
        total: 0
      },
      formLabelWidth: "120px"
    };
  },
  created() {
    this.getCurrentPage();
  },
  components: {},
  computed: {
    // id计算
  },
  methods: {
    // 序列号
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
    dateVali(timestamp) {
      var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
    //取消选中
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 编辑
    handleEdit(index, row) {
      console.log(index, row);
    },
    onSearch() {
      this.listGreet.index = 1;
      this.getCurrentPage();
      this.toggleSelection();
    },
    // 获取导出数据数据
    getExportData() {
      this.listGreet.beginTime = this.dateStartEnd ? this.dateStartEnd[0] : "";
      this.listGreet.endTime = this.dateStartEnd ? this.dateStartEnd[1] : "";
      getExportData(this.listGreet)
        .then(res => {
          console.log(res);
          if (res.models.length) {
            require.ensure([], () => {
              const {
                export_json_to_excel
              } = require("../../vendor/Export2Excel");
              const tHeader = [
                "No",
                "上传时间",
                "问题",
                "播报答案",
                "答案（含表情标签）",
                "审核状态"
              ];
              const filterVal = [
                "No",
                "createTime",
                "question",
                "answer",
                "emoticon",
                "approveStatus"
              ];
              const list = res.models;

              const data = this.formatJson(filterVal, list);
              console.log(list, data);
              export_json_to_excel(tHeader, data, "众创空间");
            });
          } else {
            this.$message({
              message: "请确认当前数据是否存在",
              type: "warning"
            });
          }
        })
        .catch(error => {
          console.log(error.data);
          this.$message({
            message: res.data.info,
            type: "warning"
          });
        });
    },
    // 导出表格数据
    formatJson(filterVal, jsonData) {
      console.log(filterVal);
      var nowData = [];
      for (let index = 0; index < jsonData.length; index++) {
        const el = jsonData[index];
        nowData[index] = {
          No: index + 1,
          createTime: this.dateVali(el.createTime),
          question: el.question,
          answer: el.answer,
          emoticon: el.answer + "<" + el.emoticon + "/>",
          approveStatus: this.staues[Number(el.approveStatus)]
        };
      }
      return nowData.map(v => filterVal.map(j => v[j]));
    },
    export_Excel() {
      this.$confirm("确定要导出表格数据么？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.getExportData();
        })
        .catch(() => {});
    },
    // 获取当前页数据
    getCurrentPage() {
      this.listGreet.beginTime = this.dateStartEnd ? this.dateStartEnd[0] : "";
      this.listGreet.endTime = this.dateStartEnd ? this.dateStartEnd[1] : "";
      getCurrentPage(this.listGreet)
        .then(res => {
          this.tableData = res.records;
          this.page = res;
          console.log(this.page)
        })
        .catch(error => {
          console.log(error);
        });
    },
    //单个审核判断
    approveStatus: function(data, emoticon, status) {
      if (status == "1" && !emoticon) {
        this.$message({
          message: "请选择表情类型后进行操作",
          type: "warning"
        });
      } else {
        this.$confirm("确定要对所选数据进行操作？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            var nowSingle = [];
            data.approveStatus = status;
            nowSingle.push(data);
            this.setCurrentState(nowSingle);
          })
          .catch(() => {});

        
      }
    },
    //多个审核判断
    moreproveStatus: function(status) {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "请勾选选中项后进行操作",
          type: "warning"
        });
      } else {
        this.$confirm("确定要对所选数据进行操作？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.multipleSelection.forEach((el, index) => {
              if (status == "1" && !el.emoticon) {
                this.$message({
                  message: "请确认勾选项的表情类型后进行操作",
                  type: "warning"
                });
                return;
              } else {
                console.log(index);
                el.approveStatus = status;
                if (index == this.multipleSelection.length - 1) {
                  this.setCurrentState(this.multipleSelection);
                }
              }
            });
          })
          .catch(() => {});
      }
    },
    // 审核更新
    setCurrentState(data) {
      setCurrentState(data)
        .then(res => {
          this.getCurrentPage();
          this.$message({
            type: "success",
            message: "审核成功!"
          });
          this.multipleSelection = [];
          console.log(res);
        })
        .catch(error => {
          this.$message({
            type: "info",
            message: "审核失败!"
          });
          console.log(error.data);
        });
    },
    handleCurrentChange(val) {
      //当前页切换
      console.log(`当前页: ${val}`);
      this.listGreet["index"] = val;
      this.multipleSelection = [];
      this.getCurrentPage();
    },

    // 切换审核列表
    handleClick(tab, event) {
      console.log(tab);
      this.dateStartEnd = [];
      this.listGreet = {
        //获取表格参数
        index: 1,
        size: 20,
        searchKey: "",
        approveStatus: tab.name
      };
     this.handleCurrentChange(1)
      this.toggleSelection();
    }
  }
};
</script>
<style>
.date-line {
  text-align: center;
}
.formCarton .el-input,
.formlau .el-input {
  width: 68%;
}
.upload-demo {
  width: 35%;
  height: 75px;
  float: left;
}
.formCarton button,
.formlau button {
  margin-left: 20px;
}
.el-dialog__header i {
  display: none;
}
.el-dialog__footer {
  text-align: center;
}
.el-tabs__content {
  display: none;
}

#approveBtn,
#unapproveBtn,
#export-Excel {
  float: right;
}
.el-date-editor .el-range-separator {
  width: auto;
}
</style>
