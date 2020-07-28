<template>
  <div class="Album">
    <div style="display: flex;flex-direction: row-reverse;margin-bottom: 10px">
      <div>
        <el-button type="primary" @click="showDialogCreateNewAlbum = true">新建专辑</el-button>
      </div>
    </div>
    <el-table :data="albumList" stripe="true" border="true" max-height="500">
      <el-table-column prop="album_name" label="专辑名字" align="center" />
      <el-table-column prop="album_songs.length" label="内容数" align="center" width="100px"/>
      <el-table-column prop="album_status" label="状态" align="center" width="100px"/>
      <el-table-column prop="album_intro" label="详情" align="center" width="100px">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="gotoAlbumDetail(scope.row._id.$id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="showDialogCreateNewAlbum" :show-close="false" :before-close="watchDialogCreateNewAlbumBeforeClose">
      <span >创建新的专辑</span>
      <el-input v-model="NewAlbumInfo.album_name"  placeholder="请输入专辑名字" style="margin-top: 15px"/>
      <el-input v-model="NewAlbumInfo.album_name_sub"  placeholder="请输入专辑副标题" style="margin-top: 15px"/>
      <vue-tags-input
        v-model="tag"
        :tags="tags"
        :placeholder="请输入标签"
        @tags-changed="newTags => tags = newTags"
        style="margin-top: 15px"
      />
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
import { getUserId } from '../utils/store'
import { updateAlbum, getMyAlbums } from '../api/yaodian'
import { formatDate } from '../utils/date'
import VueTagsInput from '@johmun/vue-tags-input'
export default {
  name: 'AlbumList',
  components: {
    VueTagsInput
  },
  data () {
    return {
      tag: '',
      tags: [],
      albumList: [],
      showDialogCreateNewAlbum: false,
      NewAlbumInfo: { album_name: '', album_intro: '' }
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.albumList = []
      getMyAlbums(getUserId()).then((res) => {
        this.albumList = res.data
      })
    },
    createNewAlbum () {
      var tempTags = []
      for (var tag in this.tags) {
        tempTags.push(this.tags[tag].text)
      }
      this.showDialogCreateNewAlbum = false
      updateAlbum('', getUserId(), this.NewAlbumInfo.album_name, this.NewAlbumInfo.album_name_sub, this.NewAlbumInfo.album_intro, tempTags).then((res) => {
        this.fetchData()
      })
    },
    watchDialogCreateNewAlbumBeforeClose (done) {
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
  .Album {
    width: 100%;
    margin: 20px;
    padding: 0px;
  }
</style>
