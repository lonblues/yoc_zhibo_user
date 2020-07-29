<template>
  <div class="l-c">
    <el-form ref="ruleForm2" :model="ruleForm2" :rules="rules2" label-position="right" label-width="90px"
             class="demo-ruleForm login-container" status-icon>
      <h3 class="title">可能学院创作系统</h3>
      <el-form-item prop="employee_email" label="账号:">
        <el-input v-model="ruleForm2.creater_email" type="text" auto-complete="off" placeholder="账号"/>
      </el-form-item>
      <el-form-item prop="employee_pwd" label="密码:">
        <el-input v-model="ruleForm2.creater_pwd" auto-complete="off" placeholder="密码" type="password"/>
      </el-form-item>
      <span v-if="!!error_text" style="color: red" class="error_text">{{ error_text }}</span>
      <el-form-item style="width:100%;">
        <el-button :loading="logining" type="primary" style="width:100%;" @click="submit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { loginByCreater } from '../api/yaodian'
import { setUserId, setUserName } from '../utils/store'
export default {
  name: 'Login',
  data () {
    return {
      error_text: '',
      logining: false,
      ruleForm2: {
        creater_email: '',
        creater_pwd: ''
      },
      rules2: {
        creater_email: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        creater_pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit () {
      this.logining = false
      loginByCreater(this.ruleForm2.creater_email, this.ruleForm2.creater_pwd).then((res) => {
        var result = res.data
        if (result.status_code === 1) {
          var user_id = result.user_id
          var user_name = result.creater_nickName
          setUserId(user_id)
          setUserName(user_name)
          this.$router.push('/')
        } else if (result.status_code === 3) {
          this.error_text = '密码不对'
        } else if (result.status_code === 4) {
          this.error_text = '找不到账户'
        }
      }).finally(() => {
        this.logining = false
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .l-c{
    width: 100%;
    height: 100vh;
    position: relative;
    background: url('http://area.sinaapp.com/bingImg/');
    background-position: 0 0;
    .login-container {
      /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
      -webkit-border-radius: 5px;
      border-radius: 5px;
      -moz-border-radius: 5px;
      background-clip: padding-box;
      position: absolute;
      top:43%;
      left:50%;
      transform: translate(-50%,-50%);
      width: 350px;
      padding: 35px 35px 15px 35px;
      background: #fff;
      border: 1px solid #eaeaea;
      box-shadow: 0 0 25px #cac6c6;
      .title {
        margin: 0px auto 10px auto;
        text-align: center;
        color: #505458;
      }
      .remember {
        margin: 0px 0px 35px 0px;
      }
      .el-radio {
        margin-bottom: 10px;
        margin-top: 10px;
      }
    }
  }
  .error_text{
    color: red;
    // margin-bottom: 10px;
  }
</style>
