<template>
  <div>
    <table-list :tableHead="award.tHead" :tableData="award.tBody" :isPaginationShow="false">
      <template slot="operation">
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="exportInit(scope.$index)">
              导出pdf
            </el-button>
          </template>
        </el-table-column>
      </template>

    </table-list>
    <el-dialog title="选择导出模式" :visible.sync="dialogVisible" width="30%">
      <el-select v-model="type" placeholder="请选择导出模式">
        <el-option label="单页" value="page"></el-option>
        <el-option label="表格" value="table"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toPDF" :disabled="type===''">确定</el-button>
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

    <el-dialog title="排序" multiple :visible.sync="dialogVisible2" >
      <div v-for="(item,index) in chooseAwards" :key="index" style="display:flex;align-items:center;margin-top:20px">
        <div>{{item}}</div>
        <el-button size="mini" style="margin-left:20px" type="primary" @click="moveUp(index)">上移</el-button>
        <el-button size="mini" type="primary" @click="moveDown(index)">下移</el-button>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
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
      type: '',
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
      chooseAwardsList: []
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
    exportInit (index) {
      this.chooseIndex = index
      this.dialogVisible = true
    },
    // 获取团队列表
    getTeamList () {
      const teamList = []
      let arr = []
      const different = ['Outstanding Team Leader']
      this.award.tBody.forEach(item => {
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
        this.awardList[this.chooseIndex].award_type !== 'team'
      ) {
        this.$store.commit('setAward', this.awardList[this.chooseIndex])
        this.$router.push({
          path: '/topdf'
        })
      } else if (
        this.type === 'table' &&
        this.awardList[this.chooseIndex].award_type === 'team'
      ) {
        const data = this.getTeamList()
        this.$store.commit('getTeamList', data)

        this.$store.commit('setAward', this.awardList)

        this.$router.push({
          name: 'teamPDF'
        })
      } else if (
        this.type === 'table' &&
        this.awardList[this.chooseIndex].award_type !== 'team'
      ) {
        this.dialogVisible1 = true
      }
    },
    sortData (a, b) {
      return a.showIndex - b.showIndex
    },

    preview () {
      const awardList = this.awardList
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

      this.$router.push({
        path: '/individualTable'
      })
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
