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
      <template slot="operation">
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="getSchool(scope.row.project_code, scope.row.project_name)">
              查看参加学校
            </el-button>
            <el-button type="text" @click="upload(scope.$index)" v-if="!project.tBody[scope.$index].project_award_background">
              上传背景图
            </el-button>

            <!-- <el-button type="text" @click="uploadBg(scope.row.project_code, scope.row.project_name)">
              上传背景图
            </el-button> -->
          </template>
        </el-table-column>
      </template>
    </table-list>

    <el-dialog title="上传背景图" :visible.sync="dialogVisible" >
      <img v-if="project.tBody[chooseIndex].project_award_background" :src="project.tBody[chooseIndex].project_award_background" style="width:100px;height:150px">
      <div v-if="!project.tBody[chooseIndex].project_award_background">未上传</div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadBackground">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import tableList from '@/components/Table'
import { getProjectsByYear,uploadBackground } from '@/api/yaodian.js'
export default {
  name: 'project',
  components: {
    tableList
  },
  data () {
    return {
      dialogVisible:false,
      project: {
        tHead: [
          { id: 'bank_account_company', label: '公司' },
          { id: 'project_name', label: '名称' },
          { id: 'project_type', label: '类型' },
          { id: 'project_award_background' , label:'背景图'}
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
      chooseIndex:0
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
    upload(index){
      this.chooseIndex = index
      this.dialogVisible=true
    },
    uploadBackground(){
      uploadBackground({project_id:this.project.tBody[this.chooseIndex]._id.$id}).then(res=>{
        console.log(res)
      })
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
