<template>
  <div class="orders">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索 -->
        <div class="el-col-8" style="margin-bottom:20px">
          <el-input
            placeholder="请输入内容"
            @clear="ordersFn"
            clearable
            v-model="search"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="ordersFn"></el-button>
          </el-input>
        </div>
      <!-- 渲染数据 -->
      <el-table :data="tableData" border stripe style="width: 100%;font-size:12px">
        <el-table-column type="index" label="#" width="60"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="240"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="160"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="160">
          <template slot-scope="scope">
            <el-tag type="danger" effect="dark" v-if="scope.row.pay_status == 0">未付款</el-tag>
            <el-tag effect="dark" v-if="scope.row.pay_status == 1">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="160"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="160" :formatter="settime"></el-table-column>
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-location-outline"
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
  </div>
</template>


<script>
import { orders,kuaidi } from "../utils/api";
export default {
  name: "",
  data() {
    return {
      search: "", // 搜索
      tableData: [], // 渲染数据
      pagenum: 1, //分页当前页
      pagesize: 6, // 分页数量
      total: 0 // 所有条数
    };
  },
  created() {},
  mounted() {
    this.ordersFn();
  },
  methods: {
    async ordersFn() {
      let  data  = await orders({
        query: this.search,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      });
      this.tableData = data.data.goods;
      this.total = data.data.total;
      this.pagenum = data.data.pagenum;

      console.log(data);
     

    },
    // async queryFn(id){
    //     console.log(id)
    // },
    // async query(id){
    //     let a = await kuaidi(`kuaidi/${id}`)
    //     console.log(a);
    // },
    // 分页器
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.ordersFn();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.ordersFn();
    },
    // 时间函数
    settime(row, column) {
      let oldDate = new Date(row.create_time);
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