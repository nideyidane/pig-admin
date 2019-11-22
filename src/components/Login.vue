<!--
 * @Descripttion: 
 * @version: 
 * @Author: dignli.su
 * @Date: 2019-07-30 14:39:56
 * @LastEditors: dignli.su
 * @LastEditTime: 2019-10-31 20:03:28
 -->
<template>
  <el-container>
    <div class="bg-box"></div>
    <div class="logo-l">
      <span class="logo-lg">
        <span>运营管理平台</span>
      </span>
    </div>
    <el-card class="box-card login-box">
      <div slot="header" class="clearfix" style="text-align:center;">
        <span class="login-title">管理员登录</span>
      </div>
      <el-form label-width="0" :model="user" :rules="loginRules" ref="user">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-edit-outline" v-model="user.username" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-setting"
            v-model="user.password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input prefix-icon="el-icon-bell" v-model="user.captcha" placeholder="验证码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="18">
              <img :src="src" />
            </el-col>
            <el-col :span="6">
              <a class="refresh-btn" @click="refreshCode">点击刷新</a>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%" @click="login('user')">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-container>
</template>
 <script>
import { constants, config } from "@/util/constant";
import { hex_sha1 } from "@/util/sha1";
import alertTip from "@/mixins/alertTip";
export default {
  data() {
    return {
      src: "",
      user: {
        username: "",
        password: "",
        captcha: ""
      },
      loginRules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      }
    };
  },
  created() {
    this.refreshCode();
    var lett = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key == 13) {
        lett.login('user');
      }
    };
  },
  mixins: [alertTip],
  inject: ["reload"],
  methods: {
    refreshCode() {
      this.src = config.domain + "pig-manage/captcha.jpg?t=" + new Date().getTime();
    },
    login(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { username, captcha } = this.user;
          let fd = new FormData();
          fd.append("username", username);
          fd.append("captcha", captcha);
          fd.append("password", hex_sha1(this.user.password));
          console.log(fd);
          console.log(this.user);
          this.$axios
            .post(config.domain + "pig-manage/sys/login", fd)
            .then(res => {
              console.log(res);
              if (res.data.code === constants.SUCCESS) {
                this.tip("登录成功", "success");
                this.$store.commit("setStorage", res.data);
                this.$axios.defaults.headers.common["token"] = res.data.token;
                this.$nextTick(() => {
                  this.$router.push({
                    path: "/home"
                  });
                  this.reload();
                });
              } else {
                this.alert(res.data.msg);
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.bg-box {
  position: absolute;
  z-index: 0;
  height: 100%;
  width: 100%;
  background: url("../../static/img/banner1.png") no-repeat center;
  background-size: cover;
}
.logo-l {
  width: 293px;
  height: 70px;
  position: absolute;
  left: 200px;
  top: 4%;
  .logo-lg {
    background: url("../../static/img/ubt.png") no-repeat 8px 7px;
    line-height: 55px;
    display: block;
    padding-left: 55px;
    font-size: 18px;
    margin: 8px 5px;
  }
}
.login-box {
  min-width: 400px;
  max-width: 500px;
  height: auto;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  position: absolute;
}
.login-title {
  font-size: 20px;
  color: #1890ff;
  font-weight: 600;
}
.refresh-btn {
  cursor: pointer;
  color: #1890ff;
  display: block;
  line-height: 50px;
}
</style>
