<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" class="mt20">
      <el-form-item label="时间">
        <el-select
          v-model="time"
          placeholder="请选择时间"
          size="small"
          @change="handleChange"
        >
          <el-option
            v-for="item in optionsTime"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <table-list
      :tableHead="project.tHead"
      :tableData="project.tBody"
      :isPaginationShow="false"
    >
      <template slot="background">
        <el-table-column label="背景图">
          <template slot-scope="scope">
            <img :src="project.tBody[scope.$index].project_award_background" style="width:96px;height:120px" v-if="project.tBody[scope.$index].project_award_background">
          </template>
        </el-table-column>
      </template>

      <template slot="operation">
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="getSchool(scope.row.project_code, scope.row.project_name)">
              查看参加学校
            </el-button>
            <el-button type="text" @click="upload(scope.$index)">
              上传背景图
            </el-button>
            <!-- <el-button type="text" @click="setChoose(scope.$index)">
              选项设置
            </el-button> -->
          </template>
        </el-table-column>
      </template>
    </table-list>

    <el-dialog title="上传背景图" :visible.sync="dialogVisible" >

      <div v-if="!project.tBody[chooseIndex].project_award_background">未上传</div>
      <input style="margin-top:20px" name="file" type="file"  accept="*" :ref="'file'+chooseIndex"/>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadBackground">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="选项设置" :visible.sync="dialogVisible1">
      <div>
        个人：
        <el-radio v-model="radio" label="1">单页</el-radio>
        <el-radio v-model="radio" label="2">表格</el-radio>
      </div>
      <div style="margin-top:20px">
        团队：
        <el-radio v-model="radio1" label="1">单页</el-radio>
        <el-radio v-model="radio1" label="2">表格</el-radio>
      </div>
      <div style="margin-top:20px">
        顺序：
        <el-radio v-model="radio2" label="1">个人奖项在前</el-radio>
        <el-radio v-model="radio2" label="2">团队奖项在前</el-radio>
      </div>
      <div style="margin-top:20px">
        奖项：
        <el-checkbox-group v-model="chooseAwards" style="display:inline">
          <el-checkbox v-for="(item,index) in awards" :key="index" :label="item"></el-checkbox>
        </el-checkbox-group>
      </div>
      <div style="margin-top:20px">
        奖项顺序

        <div v-for="(item,index) in chooseAwards" :key="index" style="display:flex;align-items:center;margin-top:20px">
          <div>{{item}}</div>
          <el-button size="mini" style="margin-left:20px" type="text" @click="moveUp(index)">上移</el-button>
          <el-button size="mini" type="text" @click="moveDown(index)">下移</el-button>
        </div>

      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="uploadChoose">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import tableList from '@/components/Table'
import { getProjectsByYear, uploadBackground, uploadChoose } from '@/api/yaodian.js'
export default {
  name: 'project',
  components: {
    tableList
  },
  data () {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      radio: '1',
      radio1: '1',
      radio2: '1',
      project: {
        tHead: [
          { id: 'bank_account_company', label: '公司' },
          { id: 'project_name', label: '名称' },
          { id: 'project_type', label: '类型' }
          // { id: 'project_award_background', label: '背景图' }
          // { id: "project_code", label: "" },
          // { id: "project_year", label: "" },
          // { id: "project_platform", label: "" },
          // { id: "project_mail_from_email", label: "" },
          // { id: "project_mail_from_name", label: "" },
          // { id: "project_mail_from_company", label: "" },
          // { id: "project_price", label: "" },
          // { id: "project_term", label: "" },
          // { id: "project_product", label: "" },
          // { id: "project_visa_required", label: "" },
          // { id: "project_BU", label: "" },
          // { id: "project_introduction", label: "" },
          // { id: "project_status", label: "" },
          // { id: "project_award_public", label: "" },
          // { id: "period", label: "" },
          // { id: "bank_account_id", label: "" }
        ],
        tBody: []

      },
      optionsTime: [
        { value: '18-19', label: '2018年-2019年' },
        { value: '19-20', label: '2019年-2020年' }
      ],
      time: '19-20',
      form: {},
      chooseIndex: 0,
      awards: [],
      chooseAwards: []
    }
  },
  created () {
    this.getGameList()
  },
  methods: {
    getGameList () {
      getProjectsByYear(this.time).then(({ data }) => {
        console.log(data)
        this.project.tBody = data
      })
    },
    handleChange (value) {
      console.log(value)
      this.getGameList()
    },
    getSchool (code, title) {
      this.$store.commit('getTitle', title)
      this.$router.push({ name: 'account', params: { id: code } })
    },
    upload (index) {
      this.chooseIndex = index
      this.dialogVisible = true
    },
    uploadBackground () {
      const myfile = this.$refs['file' + this.chooseIndex]
      const file = myfile.files[0]
      const param = new FormData()
      param.append('file', file)
      param.append('function', 'uploadBackground')
      param.append('project_id', this.project.tBody[this.chooseIndex]._id.$id)

      uploadBackground(param).then(res => {
        console.log(res)
        if (res.data.status === 'success') {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.dialogVisible = false
          this.getGameList()
        }
      })
    },
    setChoose (index) {
      this.chooseIndex = index
      this.awards = this.project.tBody[index].awards
      this.dialogVisible1 = true
      console.log(this.awards)
    },
    moveDown (index) {
      if (index !== this.chooseAwards.length - 1) {
        const awardList = this.chooseAwards
        awardList[index] = awardList.splice(index + 1, 1, awardList[index])[0]
        this.chooseAwards = awardList
      }
    },
    moveUp (index) {
      if (index !== 0) {
        const awardList = this.chooseAwards
        awardList[index] = awardList.splice(index - 1, 1, awardList[index])[0]
        this.chooseAwards = awardList
      }
    },
    uploadChoose () {

    }
  }
}
</script>

<style scoped lang="scss">
.mb20 {
  margin-bottom: 20px;
}
.mt20 {
  margin-top: 20px;
}
</style>
