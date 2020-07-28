<template>
  <div class="Album">
    <div style="margin: 30px">
      <div style="display: flex;flex-direction: column">
        <div class="detail" style="margin-top: 10px" >
          <span>专辑信息</span>
          <el-form :model="AlbumDetail" label-width="auto" style="margin-top: 30px">
            <el-form-item label="专辑名称">
              <el-input v-model="AlbumDetail.album_name"></el-input>
            </el-form-item>
            <el-form-item label="专辑副标题">
              <el-input v-model="AlbumDetail.album_name_sub"></el-input>
            </el-form-item>
            <el-form-item label="专辑标签">
              <vue-tags-input
                v-model="tag"
                :tags="albumTags"
                @tags-changed="newTags => albumTags = newTags"
              />
            </el-form-item>
            <el-form-item label="专辑简介">
              <el-input
                type="textarea"
                :rows="5"
                v-model="AlbumDetail.album_intro"></el-input>
            </el-form-item>
            <el-form-item label="专辑封面">
              <div style="display: flex; flex-direction: row">
                <el-upload
                  v-bind:class="AlbumDetail.cover_pic_url? '': avatarStyle"
                  action="#"
                  :before-upload="beforeUpload"
                  :show-file-list="false"
                  accept="image/*">
                  <img v-if="AlbumDetail.cover_pic_url" :src="AlbumDetail.cover_pic_url" class="avatar-uploader-icon">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </el-form-item>
          </el-form>

          <div class="flex-right" style="margin-top: 40px">
            <el-button type="primary" @click="updateAlbumInfo">更新专辑信息</el-button>
          </div>

          <div style="margin-top: 20px">
            <el-button size="small"  type="primary" @click="showDialogForSubmitReView = true">提交审核 </el-button>
          </div>
        </div>
        <div class="songList" style="margin-top: 20px">
          <span>音频列表</span>
          <el-table :data="albumSongs" stripe="true" border="true" style="margin-top: 20px">
            <el-table-column prop="" label="编号" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.index+1}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="" label="音频标题" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.song_name">{{scope.row.song_name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="" label="音频标签" align="center">
              <template slot-scope="scope">
                <span >{{formatSongTags(scope.row.song_tags)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="song_lyrics_length" label="字数" align="center" width="100px"/>
            <el-table-column prop="" label="操作" align="center" width="200px">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="goSongDetail(scope.row._id.$id)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top: 20px">
          <el-button size="small" @click="showDialogForNewSong = true">添加新的音频 </el-button>
        </div>
      </div>
      <el-dialog :visible.sync="showDialogForNewSong">
        <span >新加新的音频</span>
        <el-input v-model="songInfo.song_name"  placeholder="请输入音频标题" style="margin-top: 15px"/>
        <el-input v-model="songInfo.song_name_sub"  placeholder="请输入音频副标题" style="margin-top: 15px"/>
        <vue-tags-input
          v-model="tag"
          :tags="tags"
          @tags-changed="newTags => tags = newTags"
          style="margin-top: 15px"
        />
        <el-input
          style="margin-top: 15px"
          type="textarea"
          :rows="15"
          ref="input"
          placeholder="请输入音频文本"
          :autofocus="false"
          v-model="songInfo.song_lyrics">
        </el-input>
        <div class="flex-right" style="margin-top: 40px">
          <el-button type="primary" @click="addNewSong">确认</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="showDialogForSubmitReView">
        <div style="display: flex;flex-direction: column;">
          <span >提交审核信息</span>
          <el-select v-model="review_stage" placeholder="请选择类型" style="margin-top: 20px">
            <el-option
              v-for="item in review_stages"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-input v-model="update_note"  placeholder="请输入内容"
                    type="textarea"
                    :rows="5"
                    ref="input"
                    style="margin-top: 15px"/>
          <div class="flex-right" style="margin-top: 40px">
            <el-button type="primary" @click="submitToReView">提交审核</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getUserId } from '../utils/store'
import { getAlbum, updateSong, uploadAlbumCover, submitAlbumReview, updateAlbum } from '../api/yaodian'
import VueTagsInput from '@johmun/vue-tags-input'
export default {
  name: 'AlbumDetail',
  components: {
    VueTagsInput
  },
  data () {
    return {
      update_note: '',
      review_stage: '',
      review_stages: ['策划审核', '文本审核', '音频审核'],
      tag: '',
      tags: [],
      albumTags: [],
      file: undefined,
      albumId: '',
      userName: '',
      AlbumDetail: {},
      showDialogForSubmitReView: false,
      showDialogForNewSong: false,
      songInfo: { id: '', song_name: '', song_name_sub: '', song_lyrics: '' },
      avatarStyle: 'avatar-uploader',
      albumSongs: []
    }
  },
  mounted () {
    this.albumId = this.$route.params.id
    this.fetchData()
  },
  methods: {
    formatSongTags (tags) {
      var tempTag = ''
      for (var index in tags) {
        tempTag = tempTag + tags[index]
        tempTag = tempTag + '\n'
      }
      return tempTag
    },
    fetchData () {
      this.albumTags = []
      this.AlbumDetail = {}
      this.albumTags = []
      getAlbum(this.albumId).then((res) => {
        var result = res.data
        this.AlbumDetail = result
        this.albumSongs = result.album_song_contents
        this.albumSongs = this.albumSongs.map((item, index) => ({ ...item, index: index }))
        var album_tags = result.album_tags
        for (var index in album_tags) {
          if (album_tags[index] !== null && album_tags[index] !== 'null') {
            var new_tag = { text: album_tags[index] }
            this.albumTags.push(new_tag)
          }
        }
      })
    },
    updateAlbumInfo () {
      var tempTags = []
      for (var tag in this.albumTags) {
        tempTags.push(this.albumTags[tag].text)
      }
      updateAlbum(this.albumId, getUserId(), this.AlbumDetail.album_name, this.AlbumDetail.album_name_sub, this.AlbumDetail.album_intro, tempTags).then((res) => {
        this.$message('更新成功')
        this.fetchData()
      })
    },
    addNewSong () {
      this.showDialogForNewSong = false
      var tempTags = []
      for (var tag in this.tags) {
        tempTags.push(this.tags[tag].text)
      }
      updateSong(this.songInfo.id, this.albumId, this.songInfo.song_name, this.songInfo.song_name_sub, this.songInfo.song_lyrics, tempTags).then((res) => {
        this.fetchData()
      })
    },
    goSongDetail (id) {
      this.$router.push('/songdetail/' + id)
    },
    beforeUpload (file) {
      this.file = file
      this.handleUpload()
      return false
    },
    handleUpload () {
      uploadAlbumCover(this.albumId, this.file).then((res) => {
        this.fetchData()
      })
    },
    submitToReView () {
      this.showDialogForSubmitReView = false
      var review_songs = []
      var songContents = this.AlbumDetail.album_song_contents
      for (var index in songContents) {
        review_songs.push(songContents[index]._id.$id)
      }
      var new_stage = ''
      if (this.review_stage === '文本审核') {
        new_stage = 'script'
      } else if (this.review_stage === '音频审核') {
        new_stage = 'audio'
      } else if (this.review_stage === '策划审核') {
        new_stage = 'proposal'
      }
      submitAlbumReview(this.albumId, this.update_note, review_songs, new_stage).then((res) => {
        this.fetchData()
      })
    }
  }
}
</script>
<style scoped>
  .Album {
    width: 100%;
    margin: 10px;
    padding: 0px;
  }
  .avatar-uploader {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border: 1px dashed #d9d9d9;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
</style>
