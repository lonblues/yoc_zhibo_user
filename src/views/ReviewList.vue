<template>
  <div class="Album">
    <div>
      <span>审核列表</span>
      <el-table :data="reviewList" stripe="true" border="true" max-height="500" style="margin-top: 20px">
        <el-table-column prop="" label="提交时间" align="center">
          <template slot-scope="scope">
            <span>{{formatPhpTime(scope.row.create_time)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="专辑名字" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.album_info.album_name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="音频名字" align="center">
          <template slot-scope="scope">
            <span>{{allSongNames(scope.row.album_songs)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="审核类型" align="center" width="100px">
          <template slot-scope="scope">
            <span>{{formatReviewStage(scope.row.review_stage)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="审核状态" align="center" width="100px">
          <template slot-scope="scope">
            <span>{{formatReviewStatus(scope.row.review_status)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="审核形式状态" align="center" width="100px">
          <template slot-scope="scope">
            <span>{{formatFormalStatus(scope.row.formal_status)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" align="center" width="100px">
          <template slot-scope="scope">
            <el-button  type="primary" size="small" v-if="scope.row.review_status === 'pending'" @click="cancelReview(scope.row._id.$id)">取消审核</el-button>
            <!--<span>{{formatFormalStatus(scope.row.formal_status)}}</span>-->
            <!--<el-button  type="primary" size="small" v-if="scope.row.review_status === 'canceled'" @click="cancelReview(scope.row._id.$id)">取消审核</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getUserId } from '../utils/store'
import { getMyAlbumReviews, cancelAlbumReview } from '../api/yaodian'
import { formatDate } from '../utils/date'
export default {
  name: 'ReviewList',
  data () {
    return {
      reviewList: []
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      getMyAlbumReviews(getUserId()).then((res) => {
        this.reviewList = res.data.data
      })
    },
    cancelReview (review_id) {
      cancelAlbumReview(review_id).then((res) => {
        this.fetchData()
      })
    },
    formatFormalStatus (formal_status) {
      if (formal_status === 'debut') {
        return '内容首发'
      }
      if (formal_status === 'modify') {
        return '内容修改'
      }
    },
    formatReviewStage (review_stage) {
      if (review_stage === 'script') {
        return '文本审核'
      }
      if (review_stage === 'audio') {
        return '音频审核'
      }
      if (review_stage === 'proposal') {
        return '策划审核'
      }
    },
    formatReviewStatus (review_status) {
      if (review_status === 'pending') {
        return '审核中'
      }
      if (review_status === 'approved') {
        return '审核通过'
      }
      if (review_status === 'rejected') {
        return '审核未通过'
      }
      if (review_status === 'canceled') {
        return '已取消审核'
      }
    },
    allSongNames (album_songs) {
      var names = ''
      for (var index in album_songs) {
        names = names + album_songs[index].song_name
        names = names + '\n'
      }
      return names
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
    margin: 5px;
    padding: 0px;
  }

  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
  }

</style>
