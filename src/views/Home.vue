<template>
  <div>
    <el-container>
      <el-container>
        <el-aside width="200px" class="aside">
          <el-row class="tac" style="background-color: #D3DCE6">
            <el-col>
              <el-menu default-active="1">
                <el-menu-item v-for="(item,index) in menuItemList"  :key="index" @click="handleMenuItem(item, index)">
                  <div>
                    <span>{{ item.list_name }}</span>
                  </div>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <el-container class="home">
            <div style="display: flex;flex-direction: column">
              <!--新建专辑-->
              <div v-if="showCreateNewAlbum" style="display: flex;flex-direction: row-reverse;margin-bottom: 10px">
                <div>
                  <el-button type="primary" @click="showDialogCreateNewAlbum = true">新建专辑</el-button>
                </div>
              </div>
              <!--专辑列表-->
              <el-table v-if="currentMenuIndex == 1" :data="albumList" stripe="true" border="true" max-height="500">

                <el-table-column prop="album_name" label="专辑名字" align="center" width="600px"/>
                <el-table-column prop="album_status" label="状态" align="center" width="100px"/>
                <!-- <el-table-column prop="album_name" label="状态" align="center"/> -->
                <el-table-column prop="album_intro" label="详情" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="gotoAlbumDetail(scope.row._id.$id)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <CreaterInfo v-if="currentMenuIndex == 0" :createrInfo = "createrInfo" @callback="handleCreaterInfoCallback"/>
            </div>
          </el-container>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog :visible.sync="showDialogCreateNewAlbum" :show-close="false" :before-close="watchDialogCreateNewAlbumBeforeClose">
      <span >创建新的专辑</span>
      <el-input v-model="NewAlbumInfo.album_name"  placeholder="请输入专辑名字" style="margin-top: 15px"/>
      <el-input
        style="margin-top: 15px"
        type="textarea"
        :rows="5"
        ref="input"
        placeholder="请输入专辑简介"
        :autofocus="false"
        v-model="NewAlbumInfo.album_intro">
      </el-input>
      <div class="flex-right" style="margin-top: 40px">
        <el-button type="primary" @click="createNewAlbum">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import CreaterInfo from '../components/CreaterInfo.vue'
import { getUserId } from '../utils/store'
import { getCreater, updateAlbum, getMyAlbums } from '../api/yaodian'
import { formatDate } from '../utils/date'
export default {
  name: 'Home',
  components: {
    CreaterInfo
  },
  data () {
    return {
      currentMenuIndex: 0,
      menuItemList: [],
      albumList: [],
      showCreateNewAlbum: false,
      showDialogCreateNewAlbum: false,
      NewAlbumInfo: { album_name: '', album_intro: '' },
      createrInfo: {}
    }
  },
  mounted () {
    this.menuItemList.push({ list_name: '个人档案' })
    this.menuItemList.push({ list_name: '专辑管理' })
    this.fetchData()
  },
  methods: {
    handleCreaterInfoCallback (event) {
      if (event === 'refreshCreater') {
        this._getCreaterInfo()
      }
    },
    fetchData () {
      this.albumList = []
      getMyAlbums(getUserId()).then((res) => {
        this.albumList = res.data
      })
    },
    createNewAlbum () {
      this.showCreateNewAlbum = false
      this.showDialogCreateNewAlbum = false
      updateAlbum('', getUserId(), this.NewAlbumInfo.album_name, this.NewAlbumInfo.album_intro).then((res) => {
        this.fetchData()
      })
    },
    handleMenuItem (item, index) {
      this.currentMenuIndex = index
      if (index === 0) {
        this._getCreaterInfo()
      }
      if (index === 1) {
        this.showCreateNewAlbum = true
        return
      }
      this.showCreateNewAlbum = false
    },
    _getCreaterInfo () {
      getCreater(getUserId()).then((res) => {
        this.createrInfo = res.data
      })
    },
    watchDialogCreateNewAlbumBeforeClose (done) {
      this.showCreateNewAlbum = false
      this.showDialogCreateNewAlbum = false
    },
    gotoAlbumDetail (id) {
      this.$router.push('/albumdetail/' + id)
    },
    formatPhpTime (php_time) {
      var val = JSON.parse(php_time)
      var time = val * 1000
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd')
    }
  }
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
}
.head{
  position: relative;
  text-align: right;
  font-size: 12px;
}
.head-menu{
  position: absolute;
  left: 20px;
}
/deep/ .el-checkbox__inner {
         width: 20px;
         height: 20px;
       }
/deep/ .el-checkbox__input .el-checkbox__inner::after {
         box-sizing: content-box;
         content: "";
         border-left: 0;
         border-top: 0;
         height: 10px;
         left: 6px;
         position: absolute;
         top: 1px;
         width: 5px;
         transform: rotate(45deg) scaleY(1);
       }
</style>
<style>
 .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
 .deleteline{
   text-decoration: line-through ;
 }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 500px;
  }
  .aside{
    position: relative;
    height: 680px;
  }
 .favorite{
   position: absolute;
   top: 15px;
   right: 20px;
 }
  .btn{
    position: fixed;
    bottom: 100px;
    left: 40px;
  }
  .box{
    position: absolute;
    top: 20px;
    left: 20px;
  }
  .el-icon-star-on{
    font-size: 32px;
  }
  .el-icon-star-off{
    font-size: 24px;
  }
</style>
