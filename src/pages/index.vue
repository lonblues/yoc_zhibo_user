<template>
  <div>
    <el-container>
      <el-header v-if="canShowHeader" class="head">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              ><div @click="logout()">退出</div></el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <span style="margin-right: 20px">{{ userName }}</span>
      </el-header>
      <el-container style="height: 1000px;">
        <el-aside v-if="canShowHeader" width="200px" class="aside">
          <el-row class="tac" style="background-color: #D3DCE6">
            <el-col>
              <el-menu default-active="1">
                <el-menu-item
                  v-for="(item, index) in menuItemList"
                  :key="index"
                  @click="handleMenuItem(item, index)"
                >
                  <div>
                    <span>{{ item.text }}</span>
                  </div>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { removeUserId, removeUserName, getUserName } from '@/utils/store'
export default {
  name: 'app',
  data () {
    return {
      userId: '',
      userName: '',
      currentMenuIndex: 0,
      menuItemList: [{ text: '成绩查看', id: 'results' }]
    }
  },
  watch: {
    userName: getUserName()
  },
  computed: {
    canShowHeader () {
      var show = this.$route.path.search('login') > 0
      return !show
    }
  },
  mounted () {},
  methods: {
    handleMenuItem (item, index) {
      this.currentMenuIndex = index
      // 路由处理
      if (index === 0) {
        this.$router.push('/')
        return
      }
      if (index === 1) {
        this.$router.push('/albumList')
        return
      }
      if (index === 2) {
        this.$router.push('/reviews')
      }
    },
    logout () {
      removeUserId()
      removeUserName()
      location.reload()
    }
  }
}
</script>
<style scoped>
.head {
  position: relative;
  text-align: right;
  font-size: 12px;
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.el-main {
  margin: 0px;
  padding: 0px;
}
.el-container {
  margin: 0px;
  padding: 0px;
}
</style>
