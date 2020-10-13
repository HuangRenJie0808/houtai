<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索 -->
      <div>
        <div class="el-col-8" style="margin-bottom:20px">
          <el-input
            placeholder="请输入内容"
            @clear="data"
            clearable
            v-model="keyword"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="data"></el-button>
          </el-input>
        </div>
        <el-button type="primary" style="margin-left:20px" @click="flag = true">添加用户</el-button>
      </div>
      <!-- 渲染用户列表 -->
      <el-table :data="list.users" stripe border style="width: 100%">
        <!-- 索引 -->
        <el-table-column type="index" label="#" width="45"></el-table-column>
        <!-- 名字 -->
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <!-- 邮箱 -->
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <!-- 电话 -->
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <!-- 角色 -->
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <!-- 状态 -->
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="changeState(scope.row.id,scope.row.mg_state)"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column prop label="操作" min-width="220">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="updates(scope.row.id)"
              size="mini"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" @click="open(scope.row.id)" size="mini"></el-button>
            <el-button type="warning" icon="el-icon-star-off" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="block" style="margin-top:20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[4,8,12]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="list.total"
        ></el-pagination>
      </div>
      <!-- 添加用户弹框 -->
      <el-dialog title="添加新用户" :visible.sync="flag">
        <!-- modal	是否需要遮罩层
        rules	表单验证规则-->
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <!-- prop	表单域 model 字段，
             在使用 validate、resetFields 方法的情况下
             该属性是必填的	string	传入 Form 组件的 model 中的字段 
          -->
          <!-- 添加:用户名 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <!-- 电话 -->
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="flag = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改 -->
      <el-dialog title="编辑用户" :visible.sync="flags">
        <el-form :model="editForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="flags = false">取 消</el-button>
          <el-button type="primary" @click="edit()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { users, update, creat, put, del, state } from "../utils/api";
export default {
  // 组件名称
  name: "",
  // 组件参数 接收来自父组件的数据
  props: [],
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
      pagenum: 1, // 显示的当前页
      pagesize: 4, // 每页的条数
      list: [], // 渲染用户数据
      keyword: "", // 搜索
      flag: false, // 添加用户确认取消
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入电话", trigger: "blur" }]
      },
      flags: false, // 修改用户
      editForm: {}
    };
  },
  // 计算属性

  computed: {},
  // 侦听器

  // 组件方法
  methods: {
    // 用户信息 搜索 分页
    async data() {
      let res = await users({
        query: this.keyword,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      });
      this.list = res.data;
    },

    // 分页器
    handleSizeChange(val) {
      // (`每页 ${val} 条`);
      this.pagesize = val;
      this.data();
    },
    handleCurrentChange(val) {
      // (`当前页: ${val}`);
      this.pagenum = val;
      this.data();
    },
    // 添加用户
    async create() {
      let data = await creat({
        username: this.ruleForm.username,
        password: this.ruleForm.password,
        email: this.ruleForm.email,
        mobile: this.ruleForm.mobile
      });
      // 添加成功
      if (data.meta.status == 201) {
        this.flag = false;
        this.data();
        // 添加成功弹框
        this.$message({
          type: "success",
          message: data.meta.msg
        });
      }
    },
    // 添加用户成功
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.create();
        }
      });
    },
    // 查询用户数据请求
    async date(uId) {
      let { data } = await update(`users/${uId}`);
      this.editForm = data;
    },
    // 查询要修改的用户数据
    updates(uId) {
      this.date(uId);
      this.flags = true;
    },
    // 修改用户数据
    async puts() {
      let { data } = await put(this.editForm);
      // 修改成功的判断
      if (data.meta.status == 200) {
        this.editForm = "";
        this.flags = false;
        this.data();
        // 修改成功弹框
        this.$message({
          type: "success",
          message: data.meta.msg
        });
      }
    },
    // 修改数据请求
    edit() {
      this.puts();
    },
    // 删除
    async dels(id) {
      let { data } = await del(`users/${id}`);
      this.$message({
        type: "success",
        message: data.meta.msg
      });
    },
    // 删除
    open(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.dels(id);
          this.data();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改用户状态
    async changeState(id, type) {
      let { data } = await state({ uId: id, type: type });
      console.log(data);
      if (data.meta.status == 200) {
        this.$message({
          type: "success",
          message: data.meta.msg
        });
      }
    }
  },
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {},
  mounted() {
    this.data();
  }
};
</script> 

<style scoped lang="scss">
.el-card {
  margin-top: 15px;
}
</style>
