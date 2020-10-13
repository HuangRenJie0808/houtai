<template>
  <div class="home">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div>
          <img src="../assets/heima.b5a855ee.png" alt />
          <p>电商后台管理系统</p>
        </div>
        <el-button type="info" @click="del">退出</el-button>
        <!-- <el-button type="" @click="del">退出</el-button> -->
      </el-header>
      <el-container>
        <!-- 左侧导航菜单 -->
        <el-aside :width="isCollapse?'64px':'200px'">
          <div class="call" @click="isCollapse=!isCollapse">|||</div>
          <el-menu
            text-color="#fff"
            background-color="#333744"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            :collapse="isCollapse"
            :unique-opened="true"
            router
            :default-active="defaultActive"
          >
            <el-submenu v-for="(item,index) in left" :key="item.id" :index="item.id+''">
              <template slot="title">
                <i :class="iconMenu[index]"></i>
                <span slot="title">{{ item.authName }}</span>
              </template>

              <el-menu-item-group>
                <el-menu-item
                  @click="rou(`/home/${i.path}`)"
                  :index="`/home/${i.path}`"
                  v-for="(i,k) in item.children"
                  :key="k"
                >
                  <i class="el-icon-menu"></i>
                  {{ i.authName }}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧主体 -->
        <el-main>
            
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { menus } from "../utils/api";
export default {
  // 组件名称
  name: "Home",

  // 组件参数 接收来自父组件的数据
  props: [],
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
      isCollapse: false,
      left: [],
      defaultActive: "",
      iconMenu: [
        "el-icon-user-solid",
        "el-icon-s-unfold",
        "el-icon-menu",
        "el-icon-s-order",
        "el-icon-s-marketing"
      ]
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    $route: {
      handler(newValue, oldValue) {
        // if(newValue.path == '/home/index'){
        //   this.defaultActive = '/home/index'
        // }else{
        //   }
        sessionStorage.setItem("defaultActive", newValue.path);
        this.defaultActive = newValue.path;
        console.log(newValue.path, oldValue.path);
      },
      deep: true
    }
  },
  // 组件方法
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    kai() {
      this.isCollapse = !this.isCollapse;
      console.log(this.isCollapse);
    },
    // 异步请求
    async zuo() {
      let left = await menus();
      this.left = left.data;
    },
    // 跳转路由
    rou(path) {
      sessionStorage.setItem("defaultActive", path);
      this.defaultActive = path;
    },
    // 退出登录
    del() {
      this.$confirm("确定要退出么？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          sessionStorage.removeItem("token");
          this.$router.push("/");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    }
  },
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {
    let path = sessionStorage.getItem("defaultActive");
    this.defaultActive = path;
  },
  mounted() {
    this.zuo();
  }
};
</script> 

<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
  .el-container {
    width: 100%;
    height: 100%;
    .el-header {
      background-color: #373d41;
      color: #fff;
      height: 60px;
      padding: 0 20px;
      display: flex;
      position: relative;
      justify-content: space-between;
      align-items: center;
      div {
        display: flex;
        height: 60px;
        img {
          width: 56px;
          height: 56px;
          margin-right: 15px;
        }
        p {
          font-size: 22px;
          line-height: 60px;
        }
      }
      .el-button {
        height: 40px;
      }
    }
    .el-aside {
      background-color: #333744;
      transition: all 0s;
      .el-breadcrumb {
        margin-bottom: 50px;
      }
      .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        transition: all 0s !important;
        min-height: 400px;
      }

      .call {
        background-color: #4a5064;
        color: #fff;
        font-size: 12px;
        text-align: center;
        line-height: 22px;
        cursor: pointer;
        letter-spacing: 0.12em;
      }
    }
    .el-main {
      background-color: #eaedf1;
    }
    .el-menu {
      border: none;
    }
  }
}
</style>
