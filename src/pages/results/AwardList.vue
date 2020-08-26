<template>
  <div>
    <el-button @click="exportInit" type="primary">导出喜报</el-button>
    <table-list :tableHead="award.tHead" :tableData="award.tBody" :isPaginationShow="false">
      <!-- <template slot="operation">
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="exportInit(scope.$index)">
              导出pdf
            </el-button>
          </template>
        </el-table-column>
      </template> -->
    </table-list>
    <el-dialog title="选择导出" :visible.sync="dialogVisible" width="30%">
      <div>选择导出类型</div>
      <el-select v-model="status" placeholder="请选择导出类型" style="margin-top:10px">
        <el-option label="个人" value="individual"></el-option>
        <el-option label="团队" value="team"></el-option>
      </el-select>
      <div style="margin-top:10px">选择导出模式</div>
      <el-select v-model="type" placeholder="请选择导出模式" style="margin-top:10px">
        <el-option label="单页" value="page"></el-option>
        <el-option label="表格" value="table"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toPDF" :disabled="type==='' || status===''">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="选择奖项" :visible.sync="dialogVisible1">
      <el-select v-model="chooseAwards" multiple placeholder="请选择导出奖项">
        <el-option v-for="(item,index) in chooseAwardsList" :key="index" :value="item" :label="item"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible2=true" :disabled="chooseAwards===[]">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="排序"  :visible.sync="dialogVisible2" >
      <div v-for="(item,index) in chooseAwards" :key="index" style="display:flex;align-items:center;margin-top:20px">
        <div>{{item}}</div>
        <el-button size="mini" style="margin-left:20px" type="text" @click="moveUp(index)">上移</el-button>
        <el-button size="mini" type="text" @click="moveDown(index)">下移</el-button>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="preview">预览</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import tableList from '@/components/Table'
import { getAwardsByAccountProject } from '@/api/yaodian.js'
export default {
  name: 'award',
  components: {
    tableList
  },
  data () {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      chooseIndex: 0,
      awardList: [],
      award: {
        tHead: [
          { id: 'student_name', label: '名字' },
          { id: 'group', label: '组' },
          { id: 'student_gender', label: '性别' },
          { id: 'student_mobile', label: '手机号码' },
          { id: 'student_email', label: '邮箱' },
          { id: 'awardName', label: '奖项类型' },
          { id: 'test_award', label: '奖' }
        ],
        tBody: []
      },
      groups: {},

      chooseAwards: [],
      chooseAwardsList: [],
      status: '',
      type: ''
    }
  },
  async created () {
    await this.getAwardsByAccountProject()
    await this.addGroup()
  },
  methods: {
    getAwardsByAccountProject () {
      return getAwardsByAccountProject(
        this.$route.params.id,
        this.$route.params.code
      ).then(({ data }) => {
        console.log(data.data)
        this.awardList = data.data
        const awardList = data.data
        if ('choose_template' in awardList[0].project) {
          this.type = awardList[0].project.choose_template.type
          this.status = awardList[0].project.choose_template.status
          if ('chooseAwards' in awardList[0].project.choose_template) {
            this.chooseAwards = awardList[0].project.choose_template.chooseAwards
          }
        }

        var hash = []
        for (var i = 0; i < awardList.length; i++) {
          if (hash.indexOf(awardList[i].test_award) === -1) {
            if (awardList[i].test_award !== '') {
              hash.push(awardList[i].test_award)
            }
          }
        }
        this.chooseAwardsList = hash

        this.award.tBody = data.data.map(item => {
          return {
            ...item.student_info,
            ...item,
            ...item.app_info
          }
        })
        this.award.tBody = this.award.tBody.map(item => {
          return {
            ...item,
            student_name: `${item.student_lastName}${item.student_givenName}`,
            awardName: item.award_type === 'team' ? '团队奖项' : '个人奖项',
            group: item.application_team_code
          }
        })
      })
    },
    unique () {
      const isGroups = this.award.tBody.map(item => {
        return item.application_team_code
      })
      return Array.from(new Set(isGroups))
    },
    addGroup () {
      const arr = this.unique()
      arr.forEach((item, index) => {
        this.$set(this.groups, item, [])
      })
      this.award.tBody.forEach(item => {
        if (item.application_team_role === '领队') {
          this.groups[item.application_team_code].unshift(
            `${item.student_name}(领队)`
          )
        } else {
          this.groups[item.application_team_code].push(item.student_name)
        }
      })
      arr.forEach((item, index) => {
        this.groups[item] = Array.from(new Set(this.groups[item]))
      })
      this.award.tBody = this.award.tBody.map(item => {
        return {
          ...item,
          group: this.groups[item.application_team_code].join(' ')
        }
      })
    },
    exportInit () {
      this.dialogVisible = true
    },
    // 获取团队列表
    getTeamList () {
      console.log(this.award.tBody)
      const awardList = []
      for (let i = 0; i < this.award.tBody.length; i++) {
        if (this.award.tBody[i].award_type === 'team') {
          awardList.push(this.award.tBody[i])
        }
      }
      const teamList = []
      let arr = []
      const different = ['Outstanding Team Leader']

      awardList.forEach(item => {
        if (
          !teamList.includes(item.group) ||
          !different.includes(item.test_award)
        ) {
          teamList.push(item.group)
          different.push(item.test_award)
          arr.push(item)
        }
      })
      console.log(teamList)
      arr = arr.map(item => {
        let group = item.group.split(' ')
        if (group[0] === '') {
          group.splice(0, 1)
        }
        group.splice(1, 0, '<br/>')
        group = group.join(' ')
        console.log(group)
        return {
          award: item.test_award,
          team: item.account.account_name,
          groups: group,
          work: item.test_subject
        }
      })
      return arr
    },
    toPDF () {
      if (
        this.type === 'page' &&
        this.status === 'individual'
      ) {
        // const awardList = []
        // for (let i = 0; i < this.awardList.length; i++) {
        //   if (this.awardList[i].award_type !== 'team') {
        //     awardList.push(this.awardList[i])
        //   }
        // }
        // console.log(awardList)
        // if (awardList.length === 0) {
        //   this.$message({
        //     message: '当前页没有个人奖项'
        //   })
        // } else {
        //   this.$store.commit('setAward', awardList)
        //   this.$router.push({
        //     path: '/topdf'
        //   })
        // }
        this.dialogVisible1 = true
      } else if (
        this.type === 'table' &&
        this.status === 'team'
      ) {
       

        const awardList = []
        for (let i = 0; i < this.awardList.length; i++) {
          if (this.awardList[i].award_type === 'team') {
            awardList.push(this.awardList[i])
          }
        }
        console.log(awardList)
        if (awardList.length === 0) {
          this.$message({
            message: '当前页没有团队奖项'
          })
        } else {
          const data = this.getTeamList()
          this.$store.commit('getTeamList', data)

          this.$store.commit('setAward', this.awardList)

          this.$router.push({
            name: 'teamPDF'
          })
        }
      } else if (
        this.type === 'table' &&
        this.status !== 'team'
      ) {
        this.dialogVisible1 = true
      } else {
        this.$message({
          message: '团队单页模板尚未导入'
        })
      }
    },
    sortData (a, b) {
      return a.showIndex - b.showIndex
    },

    preview () {

      const awardList = []
      for (let i = 0; i < this.awardList.length; i++) {
        if (this.awardList[i].award_type !== 'team') {
          awardList.push(this.awardList[i])
        }
      }

      const chooseAwards = this.chooseAwards
      const showList = []
      for (let i = 0; i < awardList.length; i++) {
        for (let j = 0; j < chooseAwards.length; j++) {
          if (awardList[i].test_award === chooseAwards[j]) {
            awardList[i].showIndex = j
            showList.push(awardList[i])
          }
        }
      }
      console.log(showList)
      showList.sort(this.sortData)

      this.$store.commit('setAward', showList)

      if (this.type === 'table') {
        this.$router.push({
          path: '/individualTable'
        })
      } else {
        this.$router.push({
          path: '/topdf'
        })
      }
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
    }
  }
}
</script>

<style scoped lang="scss"></style>
