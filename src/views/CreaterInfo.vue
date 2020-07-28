<template>
  <div class="Album">
    <div>
      <span>创作者信息</span>
      <el-form :model="createrInfo" label-width="auto" style="margin-top: 30px">
        <el-form-item label="创作者昵称">
          <el-input v-model="createrInfo.creater_nickName"></el-input>
        </el-form-item>
        <el-form-item label="创作者真实姓名">
          <el-input v-model="createrInfo.creater_legal_name" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="创作者邮箱">
          <el-input v-model="createrInfo.creater_email" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="创作者简介">
          <el-input
            style="margin-top: 15px"
            type="textarea"
            :rows="5"
            ref="input"
            placeholder="编辑简介信息"
            v-model="createrInfo.creater_intro">
          </el-input>
        </el-form-item>
        <el-form-item label="创作者头像">
          <div style="display: flex; flex-direction: row">
            <el-upload
              v-bind:class="createrInfo.avatar_pic_url? '': avatarStyle"
              action="#"
              :before-upload="beforeUpload"
              :show-file-list="false"
              accept="image/*">
              <img v-if="createrInfo.avatar_pic_url" :src="createrInfo.avatar_pic_url" class="avatar-uploader-icon">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <div class="flex-right" style="margin-top: 40px">
        <el-button type="primary" @click="updateCreaterInfo">更新创作者信息</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserId } from '../utils/store'
import { getCreater, uploadCreaterAvatar, updateCreater } from '../api/yaodian'
export default {
  name: 'CreaterInfo',
  data () {
    return {
      imageUrl: '',
      file: undefined,
      showUploadAvatar: false,
      avatarStyle: 'avatar-uploader',
      createrInfo: {}
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      getCreater(getUserId()).then((res) => {
        this.createrInfo = res.data
      })
    },
    beforeUpload (file) {
      this.file = file
      this.handleUpload()
      return false
    },
    handleUpload () {
      uploadCreaterAvatar(this.createrInfo._id.$id, this.file).then((res) => {
        this.fetchData()
      })
    },
    updateCreaterInfo () {
      updateCreater(this.createrInfo._id.$id, this.createrInfo.creater_nickName, this.createrInfo.creater_intro).then((res) => {
        this.$message('信息更新成功')
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
