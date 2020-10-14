<template>
  <div class="goods">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <div>
        <div class="el-col-8" style="margin-bottom:20px">
          <el-input
            placeholder="请输入内容"
            @clear="goodFn"
            clearable
            v-model="search"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="goodFn"></el-button>
          </el-input>
        </div>
        <!-- 添加 -->
        <el-button type="primary" style="margin-left:20px" @click="$router.push('/home/add')">添加用户</el-button>
      </div>
      <!-- 渲染数据 -->
      <el-table :data="tableData" border stripe style="width: 100%;font-size:12px">
        <el-table-column type="index" label="#" width="40"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="700"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180" :formatter="settime"></el-table-column>
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="queryFn(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="del(scope.row.goods_id)"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[8, 15, 20,total]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改弹框 -->
    <el-dialog title="提示" :visible.sync="flag" width="30%">
      <el-form :label-position="labelPosition" label-width="80px" :model="goodsForm">
        <el-form-item label="商品名称">
          <el-input v-model="goodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
          <el-input v-model="goodsForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="goodsForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="重量">
          <el-input v-model="goodsForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="quxiao">取 消</el-button>
        <el-button type="primary" @click="editFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { goods, goodsDel, goodsQuery, goodsPut } from "../utils/api";
export default {
  name: "",
  data() {
    return {
      search: "", // 搜索
      tableData: [],
      pagenum: 1, //分页当前页
      pagesize: 8, // 分页数量
      total: 0, // 所有条数
      labelPosition: "left", // 修改弹框文本显示在左侧
      // 要修改的数据
      goodsForm: {
        goods_name: "", // 商品名称
        goods_price: "", // 价格
        goods_number: "", // 数量
        goods_weight: "" // 重量
      },
      flag: false // 修改弹框显示隐藏
    };
  },
  created() {},
  mounted() {
    this.goodFn();
  },
  methods: {
    async goodFn() {
      let { data } = await goods({
        query: this.search,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      });
      console.log(data);
      this.tableData = data.goods;
      this.total = data.total;
    },
    // 分页器
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.goodFn();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.goodFn();
    },
    // 删除
    async del(id) {
      let data = await goodsDel(`goods/${id}`);
      console.log(data.data.meta.msg);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (data.data.meta.status == 200) {
            this.goodFn();
            this.$message({
              type: "success",
              message: data.data.meta.msg
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 查询当前数据
    async queryFn(id) {
      let { data } = await goodsQuery(`goods/${id}`);
      console.log(data);
      this.flag = true;
      this.goodsForm = data;
    },
    // 修改商品
    async editFn() {
      let { data } = await goodsPut({
        url: `goods/${this.goodsForm.goods_id}`,
        params: this.goodsForm
      });
      if (data.meta.status == 201) {
        this.flag = false;
        this.goodFn();
        this.$message({
          type: "success",
          message: data.meta.msg
        });
      }
    },
    quxiao(){
        this.flag = false;
        this.$message({
            type: "info",
            message: "已取消修改"
          });
    },
    // 时间函数
    settime(row, column) {
      let oldDate = new Date(row.add_time);
      let newDate = new Date();
      var dayNum = "";
      var getTime = (newDate.getTime() - oldDate.getTime()) / 1000;
      let year = oldDate.getFullYear();
      let month = oldDate.getMonth() + 1;
      let day = oldDate.getDate();
      let hour = oldDate.getHours();
      let minute = oldDate.getMinutes();
      let second = oldDate.getSeconds();
      return `${dayNum} ${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
  }
};
</script>

<style scoped lang="scss">
.el-card {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>