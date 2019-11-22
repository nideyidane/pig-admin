<!--
 * @Descripttion: 
 * @version: 
 * @Author: dignli.su
 * @Date: 2019-07-30 14:39:56
 * @LastEditors: dignli.su
 * @LastEditTime: 2019-11-19 16:30:48
 -->
<template>
  <div class="nav">
    <div class="header">
      <img src="static/img/ubt.png" alt class="logo" />
      <span class="name" v-if="!isCollapse">运营管理平台</span>
      <span class="navBtn">
        <i class="el-icon-d-arrow-left" v-if="!isCollapse" @click="isNav(true)"></i>
        <i class="el-icon-d-arrow-right" v-if="isCollapse" @click="isNav(false)"></i>
      </span>

      <span class="userBox">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link userName">
            <span class="userImg"></span>
            <span>
              欢迎
              <span>{{user.username}}</span>
            </span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changePwd">
              <i class="fa fa-lock"></i>
              <span>修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item @click.native="exit">
              <i class="fa fa-sign-out"></i>
              <span>退出系统</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>
    <div class="content">
      <div class="content-l" ref="contentLeft">
        <el-menu
          default-active="1-4-1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
          :unique-opened="true"
        >
          <el-submenu v-for="item in menuList" :key="item.menuId" :index="item.menuId">
            <template slot="title">
              <div class="menuText" :class="{'active': theActive == item.menuId}">
                <i :class="item.icon || defaultIcon"></i>
                <span slot="title">{{item.name}}</span>
              </div>
            </template>
            <el-menu-item
              v-for="val in item.list"
              :key="val.menuId"
              :index="val.menuId"
              v-if="!val.list"
              @click="getActive(item, val)"
            >
              <router-link
                :to="val.url | getUrl"
                class="nav_a navText1"
                :class="{'active': isActive == val.menuId}"
              >
                <i :class="val.icon || defaultIcon"></i>
                <span>{{val.name}}</span>
              </router-link>
            </el-menu-item>

            <!-- <el-submenu
              v-for="val in item.list"
              :key="val.menuId + 'a'"
              :index="val.menuId + ''"
              v-if="val.list"
            >
              <span slot="title">
                <div class="menuText2">
                  <i :class="val.icon || defaultIcon"></i>
                  <span>{{val.name}}</span>
                </div>
              </span>
              <el-menu-item
                v-for="li in val.list"
                :key="li.menuId +'b'"
                :index="li.menuId + ''"
                @click="getActive(item, val, li)"
              >
                <router-link
                  :to="li.url | getUrl"
                  class="nav_a navText2"
                  :class="{'active': isActive == li.menuId}"
                >
                  <i :class="li.icon || defaultIcon"></i>
                  <span>{{li.name}}</span>
                </router-link>
              </el-menu-item>
            </el-submenu>-->
          </el-submenu>
        </el-menu>
      </div>
      <div class="content-r" ref="contentRight">
        <p class="prompt" v-html="currentMsg">{{currentMsg}}</p>
        <div class="padding-20 content-r-show">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <el-dialog
      title="修改密码"
      width="500px"
      :visible="dialogFormVisible"
      size="tiny"
      :before-close="close"
    >
      <el-form label-width="70px" :model="user" :rules="changeRules" ref="user">
        <el-form-item label="账号">
          <el-input
            prefix-icon="el-icon-search"
            v-model="user.username"
            placeholder="账号"
            readonly="readonly"
            class="readonly"
          ></el-input>
        </el-form-item>
        <el-form-item label="原密码" prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-search"
            v-model="user.password"
            placeholder="请输入原密码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            type="password"
            prefix-icon="el-icon-search"
            v-model="user.newPassword"
            placeholder="请输入新密码"
            clearable
          ></el-input>
        </el-form-item>

        <div class="text-r">
          <el-button type="primary" size="small" @click="sure('user')">确定</el-button>
          <el-button size="small" @click="close">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getMenuList, loginOut, changeUserPwd } from "@/api/service";
import { config } from "@/util/constant";
import { getUser } from "@/api/sys";
import alertTip from "@/mixins/alertTip";
import { hex_sha1 } from "@/util/sha1";
export default {
  data() {
    let newPasswordRule = (rule, value, callback) => {
      let regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,30}/;
      if (value === "") {
        callback(new Error("请输入新密码！"));
      } else if (value.length < 8) {
        callback(new Error("密码长度需大于8位！"));
      } else if (!regex.test(value)) {
        callback(new Error("密码中必须包含字母、数字、特殊字符！"));
      } else {
        callback();
      }
    };
    return {
      isCollapse: false,
      menuList: [
        {
          menuId: "1",
          icon: "",
          name: "用户管理",
          list: [
            {
              menuId: "11",
              name: "用户管理",
              icon: "",
              url: "modules/userManagement/User"
            }
          ]
        },
        {
          menuId: "2",
          icon: "",
          name: "消息推送",
          list: [
            {
              menuId: "21",
              name: "系统消息",
              icon: "",
              url: "modules/notification/systemMessages"
            },
            {
              menuId: "22",
              name: "通知栏消息",
              icon: "",
              url: "modules/notification/pushMessages"
            }
          ]
        },
        {
          menuId: "3",
          icon: "",
          name: "节假日问候",
          list: [
            {
              menuId: "31",
              name: "节假日问候",
              icon: "",
              url: "modules/festival/festival"
            }
          ]
        },
        {
          menuId: "4",
          icon: "",
          name: "技能手册",
          list: [
            {
              menuId: "41",
              name: "技能手册",
              icon: "",
              url: "modules/skillsList/skillsList"
            }
          ]
        },
        {
          menuId: "5",
          icon: "",
          name: "众创空间",
          list: [
            {
              menuId: "51",
              name: "众创空间",
              icon: "",
              url: "modules/create/create"
            }
          ]
        },
        {
          menuId: "6",
          icon: "",
          name: "轮播图",
          list: [
            {
              menuId: "61",
              name: "轮播图",
              icon: "",
              url: "modules/carousel/carousel"
            }
          ]
        }
      ],
      defaultIcon: "fa fa-circle-o",
      isActive: "",
      theActive: "",
      currentMsg:
        '<i class="fa fa-home"></i><span>首页</span><i class="fa fa-angle-right"></i><span>欢迎页</span>',
      dialogFormVisible: false,
      user: {
        username: "",
        password: "",
        newPassword: ""
      },
      changeRules: {
        password: [
          { required: true, message: "请输入原密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, validator: newPasswordRule, trigger: "blur" }
        ]
      },
      userInfo: ""
    };
  },
  mixins: [alertTip],
  inject: ["reload"],
  watch: {
    isCollapse: "collapseStatus"
  },
  filters: {
    getUrl(li) {
      if (li) {
        return "/" + li.replace(".html", "");
      } else {
        return li;
      }
    }
  },
  created() {
    //this.getMenu();
    //this.gerUserInfo();
  },
  methods: {
    collapseStatus() {
      console.log(this.isCollapse);
      if (this.isCollapse) {
        this.$refs.contentLeft.style.width = "70px";
        this.$refs.contentRight.style.width = "calc(100% - 70px)";
      } else {
        this.$refs.contentLeft.style.width = "220px";
        this.$refs.contentRight.style.width = "calc(100% - 220px)";
      }
    },
    isNav(li) {
      this.isCollapse = li;
    },
    gerUserInfo() {
      let id = this.$store.getters.getStorage.userId;
      console.log(id);
      getUser(id).then(res => {
        if (res.code == 0) {
          this.userInfo = res.user;
          console.log(this.userInfo);
          this.user.username = this.userInfo.username;
        }
      });
    },
    changePwd() {
      this.dialogFormVisible = true;
    },
    sure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {};
          params.password = hex_sha1(this.user.password);
          params.newPassword = hex_sha1(this.user.newPassword);
          changeUserPwd(params).then(res => {
            console.log(res);
            if (res.code == 0) {
              this.dialogFormVisible = false;
              this.tip("密码修改成功！", "success");
            } else {
              this.alert(res.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    close() {
      this.dialogFormVisible = false;
    },

    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    async getMenu() {
      if (sessionStorage.currentMsg) {
        this.theActive = sessionStorage.theActive;
        this.isActive = sessionStorage.isActive;
        this.currentMsg = sessionStorage.currentMsg;
      }
      // await getMenuList().then(res => {
      //   console.log(res);
      //   if (res.code == 0) {
      //     this.menuList = res.menuList;
      //   } else if (res.code == 401) {
      //     this.$router.push({
      //       path: "/login"
      //     });
      //     this.tip("登录超时，请重新登录！", "info");
      //   }
      // });
    },
    getActive(item, val, li) {
      this.theActive = item.menuId;
      if (li) {
        this.isActive = li.menuId;
        this.currentMsg =
          '<i class="fa fa-home"></i><span>首页</span><i class="fa fa-angle-right"></i><span>' +
          item.name +
          '</span><i class="fa fa-angle-right"></i><span>' +
          val.name +
          '</span><i class="fa fa-angle-right"></i><span class="blue">' +
          li.name +
          "</span>";
      } else {
        this.isActive = val.menuId;
        this.currentMsg =
          '<i class="fa fa-home"></i><span>首页</span><i class="fa fa-angle-right"></i><span>' +
          item.name +
          '</span><i class="fa fa-angle-right"></i><span class="blue">' +
          val.name +
          "</span>";
      }
      sessionStorage.currentMsg = this.currentMsg;
      sessionStorage.isActive = this.isActive;
      sessionStorage.theActive = this.theActive;
      this.getMenu();
    },
    exit() {
      // this.$axios
      //   .post(config.domain + "pig-manage/sys/logout")
      //   .then(res => {
      //     console.log(res);
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });
      loginOut().then(res => {
        console.log(res);
        this.$store.commit("removeStorage");
        sessionStorage.clear();
        this.$router.push({
          path: "/login"
        });
      });
    }
  }
};
</script>
<style lang="scss">
html {
  overflow: hidden;
}
.el-menu {
  border: none !important;
}
.el-submenu .el-menu-item {
  height: 40px !important;
  line-height: 40px !important;
  padding: 0 !important;
  &:hover,
  &:hover > i {
    color: #409eff;
    background: transparent;
  }
}
.el-menu-item,
.el-submenu__title {
  height: 40px !important;
  line-height: 40px !important;
  padding: 0 !important;
  &:hover,
  &:hover > i {
    color: #409eff;
    background: transparent;
  }
  color: #303133;
}
.navText1 {
  color: #303133;
  padding-left: 40px;
  &:hover,
  &:hover > i {
    color: #409eff;
  }
}
.navText2 {
  color: #303133;
  padding-left: 60px !important;
  &:hover,
  &:hover > i {
    color: #409eff;
  }
}
.nav {
  .header {
    position: fixed;
    width: 100%;
    // min-width: 1200px;
    top: 0;
    left: 0;
    height: 64px;
    line-height: 64px;
    padding: 0 20px;
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    z-index: 999;
    .logo {
      position: relative;
      top: 8px;
      width: 30px;
    }
    .name {
      color: #409eff;
      font-size: 18px;
      padding: 0 6px;
    }
    .navBtn {
      display: none;
      i {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .userBox {
      float: right;
      cursor: pointer;
      .userName {
        display: block;
        .userImg {
          display: inline-block;
          width: 30px;
          height: 30px;
          vertical-align: middle;
          border-radius: 30px;
          background: #f0f2f5;
        }
      }
    }
  }
  .content {
    padding-top: 64px;
    font-size: 0;
    .content-l {
      display: inline-block;
      vertical-align: top;
      width: 220px;
      height: 93vh;
      box-sizing: border-box;
      border-right: solid 1px #e6e6e6;
      background: #f0f2f5;
      ul {
        background: #f0f2f5;
      }
      i {
        display: inline-block;
        width: 16px;
        vertical-align: middle;
        text-align: center;
      }
      .nav_a {
        display: inline-block;
        color: #303133;
        width: 100%;
        border-left: 4px solid transparent;
        &:hover,
        &:hover > i {
          color: #409eff;
        }
      }
      .menuText {
        padding-left: 20px;
        border-left: 4px solid transparent;
      }
      .menuText2 {
        padding-left: 40px;
        border-left: 4px solid transparent;
      }
      .active {
        color: #409eff;
        background: #e6f7ff;
        border-left: 4px solid #409eff;
        i {
          color: #409eff;
        }
      }
    }
    .content-r {
      display: inline-block;
      vertical-align: top;
      width: calc(100% - 220px);
      height: 93vh;
      overflow-y: hidden;
      .prompt {
        height: 50px;
        line-height: 50px;
        padding: 0 10px;
        background: #f0f2f5;
        color: #777;
        font-size: 14px;
        i {
          font-size: 18px;
          padding: 0 6px;
        }
      }
      .content-r-show {
        width: 100%;
        height: calc(100% - 50px);
        overflow: scroll;
      }
    }
  }
}
</style>

