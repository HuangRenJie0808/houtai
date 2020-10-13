<template>
  <div class="login">
    <div class="box">
      <div class="avater-box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录框 -->
      <!-- qqqqqqqqqqqqqqqqqq -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item label prop="username">
          <el-input v-model="ruleForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label prop="password">
          <el-input v-model="ruleForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
      </el-form>

      <div class="btn">
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </div>
      <!-- <el-button type="primary" @click="onLoad">登录</el-button>
      <el-button type="info">重置</el-button>-->
    </div>
  </div>
</template>

<script>
import { login } from "../utils/api";
export default {
  // 组件名称
  name: "Login",
  // 组件参数 接收来自父组件的数据
  props: [],
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
      // 登录
      ruleForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        ]
      }
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    //   qqqqqqqq
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          
          this.onLoad();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置文本框
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 获取数据
    async onLoad() {
      // 调用api接口
      let data = await login({
        username: this.ruleForm.username,
        password: this.ruleForm.password
      });
      console.log(data);
      if (data.meta.status == 200) {
        sessionStorage.setItem("token", data.data.token);
          this.$router.push("/home");
        this.$message({
          type: "success",
          message: data.meta.msg
        });

      } else {
        this.$message({
          type: "error",
          message: data.meta.msg
        });
      }
    }
  },
  created() {},
  mounted() {}
};
</script> 

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
  position: relative;
  .box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #ddd;
    border-radius: 3px;
    top: 50%;
    display: flex;
    align-items: center;
    flex-direction: column;
    .el-form {
      margin-top: 100px;
      width: 80%;
    }
    .btn {
      position: absolute;
      right: 45px;
      bottom: 40px;
    }
  }
  .avater-box {
    width: 130px;
    height: 130px;
    padding: 10px;
    border: 1px solid #efefef;
    border-radius: 50%;
    background-color: #fff;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #ddd;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #efefef;
    }
  }
}
</style>
