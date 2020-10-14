<template>
  <div class="reports">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- 卡片 -->
    <el-card class="box-card">
    <div  id="myChart" :style="{width: '800px', height: '460px'}"></div>
    </el-card>
  </div>
</template>

<script>
import { echarts } from "../utils/api";
export default {
  data() {
    return {};
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    async drawLine() {
        // 获取数据
      let { data: res } = await echarts();
      let shuju = res;
      var myChart = this.$echarts.init(document.getElementById("myChart")); //获取容器元素
      let option = {
        title: {
          text: "用户来源" // 左上角
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: shuju.legend.data
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: shuju.xAxis[0].data
          }
        ],
        yAxis: shuju.yAxis[0],
        series: shuju.series
      };
      //防止越界，重绘canvas
      window.onresize = myChart.resize;
      myChart.setOption(option); //设置option
    }
  }
};
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 15px;
}
</style>