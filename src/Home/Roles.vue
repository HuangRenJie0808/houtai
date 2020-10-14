<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addList">添加角色</el-button>
      <el-table :data="tableData" border stripe style="margin-top:15px">
        <!-- 折叠框 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item,index) in scope.row.children"
              style=" border: 1px solid #ccc; padding:15px"
              effect="dark"
              type="flex"
              align="center"
              :key="index"
            >
              <el-col :span="4">
                <el-tag closable :disable-transitions="false">{{item.authName}}</el-tag>
              </el-col>
              <el-col :span="20">
                <el-row v-for="(i,k) in item.children" :key="k">
                  <el-col :span="4">
                    <el-tag
                      closable
                      :disable-transitions="false"
                      effect="dark"
                      type="success"
                    >{{i.authName}}</el-tag>
                  </el-col>
                  <el-col :span="20">
                    <el-tag
                      style="margin:0 0 10px 15px;"
                      effect="dark"
                      v-for="(it) in i.children"
                      type="warning"
                      :key="it.id"
                      closable
                      :disable-transitions="false"
                    >{{it.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 下标 -->
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <!-- 角色名称 -->
        <el-table-column prop="roleName" label="角色名称" width="320"></el-table-column>
        <!-- 角色描述 -->
        <el-table-column prop="roleDesc" label="角色描述" width="320"></el-table-column>
        <!-- 操作 -->
        <el-table-column prop="address" label="操作" min-width="400">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editList(scope.row.id)"
              size="mini"
            >编辑</el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="open(scope.row.id)"
            >删除</el-button>
            <!-- 分配权限 -->
            <el-button type="warning" icon="el-icon-setting" @click="fen" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户弹框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
      <el-form
        :model="listForm"
        :rules="rules"
        label-width="100px"
        ref="listForm"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" label-width="120px" prop="roleName">
          <el-input v-model="listForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="120px" prop="roleDesc">
          <el-input v-model="listForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addYes('listForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改角色弹框 -->
    <el-dialog title="修改角色" :visible.sync="flag">
      <el-form
        :model="editForm"
        :rules="rules"
        label-width="100px"
        ref="listForm"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" label-width="120px" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="120px" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="flag = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="修改角色" :visible.sync="jurFlag">
      <el-tree
        :data="jur"
        show-checkbox
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{data.authName }}</span>
        </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="flag = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>


<script>
import {
  roles,
  addroles,
  delList,
  queryList,
  isEditLiseEd,
  rights
} from "../utils/api";
export default {
  name: "Roles",
  data() {
    return {
      tableData: [], // 渲染角色列表
      dialogFormVisible: false, // 显示隐藏添加角色弹框
      listForm: {
        // 添加角色弹框数据
        roleName: "", // 添加角色名称
        roleDesc: "" // 添加角色描述
      },
      rules: {
        // 添加必填项
        roleName: [
          { required: true, message: "角色名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3到 10 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "角色描述", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      },
      // 修改角色弹框数据
      editForm: {
        roleName: "", // 修改角色名称
        roleDesc: "" // 修改角色描述
      },
      flag: false, // 显示隐藏修改角色弹框
      jurFlag: false, // 显示隐藏修改权限弹框
      jur: [] // 修改角色弹框数据
    };
  },
  methods: {
    //   获取角色列表
    async rolesList() {
      let data = await roles();
      this.tableData = data.data;
      console.log(data);
    },
    // 添加角色
    async addList() {
      this.dialogFormVisible = true;
      let data = await addroles({
        roleName: this.listForm.roleName,
        roleDesc: this.listForm.roleDesc
      });
      if (data.meta.status == 201) {
        this.dialogFormVisible = false;
        // 添加成功弹框
        this.$message({
          type: "success",
          message: data.meta.msg
        });
      }
    },
    // 添加角色成功
    addYes(listForm) {
      this.$refs[listForm].validate(valid => {
        if (valid) {
          this.addList();
          this.rolesList();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除角色
    async del(id) {
      let { data } = await delList(`roles/${id}`);
      console.log(data);
      if (data.meta.status == 200) {
        this.rolesList();
        this.$message({
          type: "success",
          message: data.meta.msg
        });
      }
    },
    // 删除
    open(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.del(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 查询当前数据
    async isEditList(id) {
      let data = await queryList(`roles/${id}`);
      console.log(data);
      this.editForm = data.data;
      if (data.meta.status == 200) {
        this.$message({
          type: "success",
          message: data.meta.msg
        });
      }
    },
    // 修改当前数据
    editList(id) {
      this.isEditList(id);
      this.flag = true;
    },
    // 修改
    async editPut() {
      let { data } = await isEditLiseEd(this.editForm);
      console.log(data);
      if (data.meta.status == 200) {
        this.flag = false;
        this.rolesList();
        this.$message({
          type: "success",
          message: "修改成功"
        });
      }
    },
    edit() {
      this.editPut();
    },
    // 分配权限
    async fen() {
      this.jurFlag = true;
      let data = await rights("tree");
      console.log(data);
      this.jur = data.data;
    }
  },
  created() {},
  mounted() {
    this.rolesList();
  }
};
</script>

<style scoped lang="scss">
.box-card {
  margin-top: 15px;
}
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>