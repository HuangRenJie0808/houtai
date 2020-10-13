<template>
  <div class="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 渲染 -->
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="350"></el-table-column>
        <el-table-column prop="path" label="路径" width="350"></el-table-column>
        <el-table-column prop="level" min-width="350" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-if="scope.row.level == 1" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>


<script>
import { rights } from "../utils/api";
export default {
  name: "Rights",
  data() {
    return {
      tableData: []
    };
  },
  created() {},
  mounted() {
    this.a();
  },
  methods: {
    async a() {
      let data = await rights('list');
      console.log(data);
      this.tableData = data.data;
    }
  }
};
</script>

<style scoped lang="scss">
.box-card {
  margin-top: 15px;
}
</style>