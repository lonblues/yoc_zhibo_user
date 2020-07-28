<template>
  <div class="Album">
    <div style="margin: 30px">
      <div style="display: flex;flex-direction: column">
        <div class="detail" style="margin-top: 10px" >
          <span>音频信息</span>
          <el-form :model="songDetail" label-width="auto" style="margin-top: 30px">
            <el-form-item label="音频标题">
              <el-input v-model="songDetail.song_name"></el-input>
            </el-form-item>
             <el-form-item label="音频副标题">
              <el-input v-model="songDetail.song_name_sub"></el-input>
            </el-form-item>
            <el-form-item label="音频标签">
              <vue-tags-input
                v-model="tag"
                :tags="tags"
                @tags-changed="newTags => tags = newTags"
              />
            </el-form-item>

            <el-form-item label="音频文本">
              <!-- <el-input
                style="margin-top: 15px"
                type="textarea"
                :rows="15"
                ref="input"
                placeholder="编辑文本"
                v-model="songDetail.song_lyrics">
              </el-input> -->
              <tinymce  :height="200" v-model="songDetail.song_lyrics"/>
            </el-form-item>
          </el-form>
          <div class="flex-right" style="margin-top: 40px">
            <el-button type="primary" @click="updateSongInfo">更新音频信息</el-button>
          </div>
          <div style="margin-top: 20px">
            <el-button type="primary" @click="showDialogForSubmitReView = true">提交审核 </el-button>
          </div>
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
    </div>
  </div>
</template>
<script>
import Tinymce from '../components/Tinymce'
import { getSong, updateSong, submitAlbumReview } from '../api/yaodian'
import VueTagsInput from '@johmun/vue-tags-input'
export default {
  name: 'SongDetail',
  components: {
    tinymce: Tinymce,
    VueTagsInput
  },
  data () {
    return {
      update_note: '',
      review_stage: '',
      review_stages: ['文本审核', '音频审核', '策划审核'],
      tag: '',
      tags: [],
      songId: '',
      showDialogForSubmitReView: false,
      songDetail: {}
    }
  },
  mounted () {
    this.songId = this.$route.params.id
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.tags = []
      this.songDetail = {}
      getSong(this.songId).then((res) => {
        var result = res.data
        this.songDetail = result
        var song_tags = result.song_tags
        for (var index in song_tags) {
          if (song_tags[index] !== null && song_tags[index] !== 'null') {
            var new_tag = { text: song_tags[index] }
            this.tags.push(new_tag)
          }
        }
      })
    },
    updateSongInfo () {
      var tempTags = []
      for (var tag in this.tags) {
        tempTags.push(this.tags[tag].text)
      }
      updateSong(this.songId, this.songDetail.album_id, this.songDetail.song_name, this.songDetail.song_name_sub, this.songDetail.song_lyrics, tempTags).then((res) => {
        this.$message('更新成功')
        this.fetchData()
      })
    },
    submitToReView () {
      this.showDialogForSubmitReView = false
      var review_songs = []
      review_songs.push(this.songId)
      var new_stage = ''
      if (this.review_stage === '文本审核') {
        new_stage = 'script'
      } else if (this.review_stage === '音频审核') {
        new_stage = 'audio'
      } else if (this.review_stage === '策划审核') {
        new_stage = 'proposal'
      }
      submitAlbumReview(this.songDetail.album_id, this.update_note, review_songs, new_stage).then((res) => {
        this.$message('更新成功')
        this.fetchData()
      })
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
